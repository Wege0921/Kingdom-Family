'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Send, Loader2 } from 'lucide-react'

export function CommunityPostForm() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from('community_posts')
      .insert({ content: content.trim() })

    setIsSubmitting(false)
    if (!error) {
      setContent('')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
      <Textarea
        placeholder="Share an insight, prayer request, or encouragement..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {content.length}/500
        </span>
        <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Post
        </Button>
      </div>
    </form>
  )
}
