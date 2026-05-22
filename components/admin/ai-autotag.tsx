'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AIAutoTagProps {
  title: string
  summary: string
  onTopicsGenerated: (topics: string[]) => void
}

export function AIAutoTag({ title, summary, onTopicsGenerated }: AIAutoTagProps) {
  const [generating, setGenerating] = useState(false)
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const { toast } = useToast()

  const handleGenerateTags = async () => {
    setGenerating(true)

    try {
      const response = await fetch('/api/ai/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate tags')
      }

      const data = await response.json()
      setSuggestedTopics(data.topics)
      toast({ title: 'Tags generated successfully' })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate tags',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  const handleApplyTopics = () => {
    onTopicsGenerated(selectedTopics)
    setSelectedTopics([])
    setSuggestedTopics([])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Auto-Tag
        </CardTitle>
        <CardDescription>
          Generate relevant topic suggestions for this sermon.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateTags}
          disabled={generating || !title}
          className="w-full"
          variant="outline"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Topic Suggestions
            </>
          )}
        </Button>

        {suggestedTopics.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Select topics to apply:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant={selectedTopics.includes(topic) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyTopics} disabled={selectedTopics.length === 0} size="sm">
                Apply {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''}
              </Button>
              <Button
                onClick={() => {
                  setSelectedTopics([])
                  setSuggestedTopics([])
                }}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
