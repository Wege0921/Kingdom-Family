import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { SocialPostsTable } from '@/components/admin/social-posts-table'
import { Plus } from 'lucide-react'

export default async function AdminSocialPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('social_posts')
    .select(
      `
      *,
      sermon:sermons(id, title_en)
    `,
    )
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social posts</h1>
          <p className="text-muted-foreground">Schedule and manage channel posts</p>
        </div>
        <Button asChild>
          <Link href="/admin/social/new">
            <Plus className="mr-2 h-4 w-4" />
            New post
          </Link>
        </Button>
      </div>
      <SocialPostsTable posts={posts ?? []} />
    </div>
  )
}
