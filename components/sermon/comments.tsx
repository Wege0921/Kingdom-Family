'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Reply, Send, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Comment, Profile } from '@/lib/types'

interface SermonCommentsProps {
  sermonId: string
  currentUser: { id: string; email: string } | null
}

interface CommentWithProfile {
  id: string
  user_id: string
  sermon_id: string
  content: string
  parent_id: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
  profile: Profile | null
  replies?: CommentWithProfile[]
}

export function SermonComments({ sermonId, currentUser }: SermonCommentsProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState<CommentWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [sermonId])

  const loadComments = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        profile:profiles(id, full_name, avatar_url)
      `)
      .eq('sermon_id', sermonId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (data) {
      // Organize into threaded structure
      const threaded = organizeComments(data as CommentWithProfile[])
      setComments(threaded)
    }
    setLoading(false)
  }

  const organizeComments = (flatComments: CommentWithProfile[]): CommentWithProfile[] => {
    const commentMap = new Map<string, CommentWithProfile>()
    const rootComments: CommentWithProfile[] = []

    // First pass: create map
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: build tree
    flatComments.forEach((comment) => {
      const node = commentMap.get(comment.id)!
      if (comment.parent_id && commentMap.has(comment.parent_id)) {
        const parent = commentMap.get(comment.parent_id)!
        if (!parent.replies) parent.replies = []
        parent.replies.push(node)
      } else {
        rootComments.push(node)
      }
    })

    return rootComments
  }

  const handleSubmitComment = async (content: string, parentId: string | null = null) => {
    if (!currentUser) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a comment.',
        variant: 'destructive',
      })
      return
    }

    if (!content.trim()) return

    setSubmitting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from('comments').insert({
        sermon_id: sermonId,
        user_id: currentUser.id,
        content: content.trim(),
        parent_id: parentId,
      })

      if (error) throw error

      toast({ title: 'Comment posted' })
      setNewComment('')
      setReplyText('')
      setReplyingTo(null)
      await loadComments()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return

    const supabase = createClient()
    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', commentId)
      .eq('user_id', currentUser.id)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      })
      return
    }

    toast({ title: 'Comment deleted' })
    await loadComments()
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: CommentWithProfile; depth?: number }) => {
    const getInitials = (name: string | null | undefined) => {
      if (!name) return 'U'
      return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
      <div className={`${depth > 0 ? 'ml-8 mt-4 border-l-2 border-muted pl-4' : ''}`}>
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(comment.profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{comment.profile?.full_name || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {currentUser?.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            {depth < 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 h-7 text-xs"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="mr-1 h-3 w-3" />
                Reply
              </Button>
            )}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitComment(replyText, comment.id)}
                    disabled={submitting || !replyText.trim()}
                  >
                    <Send className="mr-1 h-3 w-3" />
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Comments
      </h2>

      {/* New comment form */}
      <Card>
        <CardContent className="pt-6">
          <Textarea
            placeholder={currentUser ? 'Share your thoughts...' : 'Sign in to leave a comment'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            disabled={!currentUser}
          />
          <div className="flex justify-end mt-3">
            <Button
              onClick={() => handleSubmitComment(newComment)}
              disabled={submitting || !newComment.trim() || !currentUser}
            >
              <Send className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">No comments yet. Be the first to share!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  )
}
