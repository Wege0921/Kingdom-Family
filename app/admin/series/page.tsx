import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { SeriesTable } from '@/components/admin/series-table'
import { Plus } from 'lucide-react'

export default async function AdminSeriesPage() {
  const supabase = await createClient()
  const { data: series } = await supabase.from('series').select('*').order('title_en')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Series</h1>
          <p className="text-muted-foreground">Group sermons into teaching series</p>
        </div>
        <Button asChild>
          <Link href="/admin/series/new">
            <Plus className="mr-2 h-4 w-4" />
            New series
          </Link>
        </Button>
      </div>
      <SeriesTable series={series ?? []} />
    </div>
  )
}
