import Link from 'next/link'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Sermon } from '@/lib/types'
import { format } from 'date-fns'

interface Props {
  sermon: Sermon | null
}

export function WeeklySermon({ sermon }: Props) {
  if (!sermon) return null

  const isThisWeek = sermon.published_at
    ? new Date(sermon.published_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {isThisWeek ? 'This Week' : 'Latest Sermon'}
          </CardTitle>
          {isThisWeek && <Badge variant="default">New</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <Link
          href={`/sermons/${sermon.id}`}
          className="group block space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            {sermon.video_thumbnail && (
              <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={sermon.video_thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                {sermon.title_en}
              </h3>
              {sermon.speaker && (
                <p className="text-sm text-muted-foreground mt-1">
                  {sermon.speaker.name}
                </p>
              )}
              {sermon.published_at && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" />
                  {format(new Date(sermon.published_at), 'MMMM d, yyyy')}
                </div>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
