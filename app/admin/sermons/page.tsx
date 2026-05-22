import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SermonsTable } from '@/components/admin/sermons-table'
import { Plus } from 'lucide-react'

export default async function SermonsPage() {
  const supabase = await createClient()
  
  const { data: sermons } = await supabase
    .from('sermons')
    .select(`
      *,
      speaker:speakers(id, name),
      series:series(id, title_en)
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sermons</h1>
          <p className="text-muted-foreground">Manage your sermon content</p>
        </div>
        <Button asChild>
          <Link href="/admin/sermons/new">
            <Plus className="mr-2 h-4 w-4" />
            New Sermon
          </Link>
        </Button>
      </div>

      <SermonsTable sermons={sermons || []} />
    </div>
  )
}
