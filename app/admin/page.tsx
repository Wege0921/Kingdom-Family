import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, GraduationCap, Share2, Eye, TrendingUp, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { AdminStatTrends } from '@/components/admin/stat-trends'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch counts
  const [
    { count: sermonsCount },
    { count: publishedSermonsCount },
    { count: speakersCount },
    { count: learningPathsCount },
    { count: socialPostsCount },
    { count: usersCount },
    { count: commentsCount },
  ] = await Promise.all([
    supabase.from('sermons').select('*', { count: 'exact', head: true }),
    supabase.from('sermons').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('speakers').select('*', { count: 'exact', head: true }),
    supabase.from('learning_paths').select('*', { count: 'exact', head: true }),
    supabase.from('social_posts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
  ])
  
  // Fetch trend data for last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Sermon views trend
  const { data: sermonViews } = await supabase
    .from('sermons')
    .select('created_at, view_count')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // New users trend
  const { data: newUsers } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // Sermon publications trend
  const { data: publishedSermons } = await supabase
    .from('sermons')
    .select('published_at')
    .gte('published_at', sevenDaysAgo.toISOString())
    .not('published_at', 'is', null)
    .order('published_at', { ascending: true })

  // Process trend data for charts
  const processTrendData = (data: any[], dateField: string, valueField?: string) => {
    const trendMap = new Map<string, number>()
    const days = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      days.push(dateStr)
      trendMap.set(dateStr, 0)
    }

    data.forEach((item) => {
      const date = new Date(item[dateField])
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (trendMap.has(dateStr)) {
        const currentValue = trendMap.get(dateStr) || 0
        trendMap.set(dateStr, currentValue + (valueField ? item[valueField] : 1))
      }
    })

    return days.map((day) => ({
      date: day,
      views: trendMap.get(day) || 0,
      users: trendMap.get(day) || 0,
      count: trendMap.get(day) || 0,
    }))
  }

  const viewsTrend = processTrendData(sermonViews || [], 'created_at', 'view_count')
  const usersTrend = processTrendData(newUsers || [], 'created_at')
  const publishesTrend = processTrendData(publishedSermons || [], 'published_at')
  
  // Fetch recent sermons
  const { data: recentSermons } = await supabase
    .from('sermons')
    .select('id, title_en, is_published, created_at, view_count')
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Fetch pending social posts
  const { data: pendingPosts } = await supabase
    .from('social_posts')
    .select('id, platform, status, scheduled_for')
    .in('status', ['draft', 'scheduled'])
    .order('scheduled_for', { ascending: true })
    .limit(5)

  const stats = [
    {
      title: 'Total Sermons',
      value: sermonsCount || 0,
      description: `${publishedSermonsCount || 0} published`,
      icon: FileText,
      href: '/admin/sermons',
    },
    {
      title: 'Users',
      value: usersCount || 0,
      description: 'Registered users',
      icon: Users,
      href: '/admin/settings',
    },
    {
      title: 'Comments',
      value: commentsCount || 0,
      description: 'Total comments',
      icon: MessageSquare,
      href: '/admin/notifications',
    },
    {
      title: 'Social Posts',
      value: socialPostsCount || 0,
      description: 'Posts created',
      icon: Share2,
      href: '/admin/social',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stat Trends */}
      <AdminStatTrends
        sermonViews={viewsTrend}
        newUsers={usersTrend}
        sermonPublishes={publishesTrend}
      />

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Sermons
            </CardTitle>
            <CardDescription>Latest sermon entries</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSermons && recentSermons.length > 0 ? (
              <div className="space-y-4">
                {recentSermons.map((sermon) => (
                  <Link
                    key={sermon.id}
                    href={`/admin/sermons/${sermon.id}`}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{sermon.title_en}</p>
                      <p className="text-xs text-muted-foreground">
                        {sermon.is_published ? 'Published' : 'Draft'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {sermon.view_count}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sermons yet. Create your first sermon!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Pending Social Posts
            </CardTitle>
            <CardDescription>Posts awaiting publishing</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingPosts && pendingPosts.length > 0 ? (
              <div className="space-y-4">
                {pendingPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/social/${post.id}`}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">{post.platform}</p>
                      <p className="text-xs text-muted-foreground capitalize">{post.status}</p>
                    </div>
                    {post.scheduled_for && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.scheduled_for).toLocaleDateString()}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pending social posts
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
