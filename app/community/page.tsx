import { createClient } from '@/lib/supabase/server'
import { PublicShell } from '@/components/layout/public-shell'
import { CommunityFeed } from '@/components/community/community-feed'
import { CommunityPostForm } from '@/components/community/community-post-form'
import { Users } from 'lucide-react'

export const metadata = {
  title: 'Community',
  description: 'Connect with others, share insights, and grow together in faith.',
}

export default async function CommunityPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('community_posts')
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles:user_id(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <PublicShell>
      <div className="container px-4 py-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Community
          </h1>
          <p className="text-muted-foreground">
            Share insights from sermons and learning paths. Grow together in faith.
          </p>
        </div>

        {user && <CommunityPostForm />}

        {!user && (
          <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
            Sign in to share your insights with the community.
          </p>
        )}

        <CommunityFeed posts={posts ?? []} currentUserId={user?.id ?? null} />
      </div>
    </PublicShell>
  )
}
