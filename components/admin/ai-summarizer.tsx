'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AISummarizerProps {
  sermonId?: string
  videoUrl?: string
  onSummaryGenerated: (summary: string) => void
  language?: 'en' | 'am'
}

export function AISummarizer({
  sermonId,
  videoUrl,
  onSummaryGenerated,
  language = 'en',
}: AISummarizerProps) {
  const [transcript, setTranscript] = useState('')
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateSummary = async () => {
    if (!sermonId) {
      toast({
        title: 'Sermon required',
        description: 'Please save the sermon first to generate a summary.',
        variant: 'destructive',
      })
      return
    }

    setGenerating(true)

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sermonId,
          transcript: transcript || undefined,
          videoUrl,
          language,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate summary')
      }

      const data = await response.json()
      onSummaryGenerated(data.summary)
      toast({ title: 'Summary generated successfully' })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate summary',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Summarizer
        </CardTitle>
        <CardDescription>
          Generate sermon summaries using AI. Optionally provide a transcript for better results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste sermon transcript here (optional)..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={6}
          disabled={generating}
        />
        <Button
          onClick={handleGenerateSummary}
          disabled={generating || !sermonId}
          className="w-full"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate {language === 'en' ? 'English' : 'Amharic'} Summary
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
