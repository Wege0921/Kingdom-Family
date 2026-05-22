'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface BookmarkToggleProps {
  sermonId: string
  initialBookmarked: boolean
  isLoggedIn: boolean
}

export function BookmarkToggle({ sermonId, initialBookmarked, isLoggedIn }: BookmarkToggleProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  if (!isLoggedIn) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href={`/auth/login?next=/sermons/${sermonId}`}>Sign in to bookmark</a>
      </Button>
    )
  }

  const toggle = async () => {
    setLoading(true)
    const supabase = createClient()
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({ title: 'Session expired', description: 'Please sign in again.', variant: 'destructive' })
        return
      }

      if (bookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .match({ sermon_id: sermonId, user_id: user.id })
        if (error) throw error
        setBookmarked(false)
        toast({ title: 'Removed from bookmarks' })
      } else {
        const { error } = await supabase.from('bookmarks').insert({ sermon_id: sermonId, user_id: user.id })
        if (error) throw error
        setBookmarked(true)
        toast({ title: 'Saved to bookmarks' })
      }
      router.refresh()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Bookmark failed'
      toast({ title: 'Error', description: message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button type="button" variant={bookmarked ? 'default' : 'outline'} size="sm" onClick={toggle} disabled={loading}>
      <Heart className={`mr-2 h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}
