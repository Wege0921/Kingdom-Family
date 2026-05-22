'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter } from 'lucide-react'

interface SermonFiltersProps {
  speakers: Array<{ id: string; name: string }>
  seriesList: Array<{ id: string; title_en: string }>
  topics: Array<{ id: string; name_en: string }>
  currentSpeaker?: string
  currentSeries?: string
  currentTopic?: string
  currentSort?: 'newest' | 'oldest' | 'title'
}

export function SermonFilters({
  speakers,
  seriesList,
  topics,
  currentSpeaker,
  currentSeries,
  currentTopic,
  currentSort,
}: SermonFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/sermons?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Filter className="h-4 w-4 text-muted-foreground" />

      <Select
        value={currentSpeaker || 'all'}
        onValueChange={(value) => updateFilter('speaker', value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Speaker" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All speakers</SelectItem>
          {speakers?.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentSeries || 'all'}
        onValueChange={(value) => updateFilter('series', value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Series" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All series</SelectItem>
          {seriesList?.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.title_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentTopic || 'all'}
        onValueChange={(value) => updateFilter('topic', value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All topics</SelectItem>
          {topics?.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentSort || 'newest'}
        onValueChange={(value) => updateFilter('sort', value === 'newest' ? null : value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
