import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { SpeakersTable } from '@/components/admin/speakers-table'
import { Plus } from 'lucide-react'

export default async function AdminSpeakersPage() {
  const supabase = await createClient()
  const { data: speakers } = await supabase.from('speakers').select('*').order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Speakers</h1>
          <p className="text-muted-foreground">Manage sermon speakers</p>
        </div>
        <Button asChild>
          <Link href="/admin/speakers/new">
            <Plus className="mr-2 h-4 w-4" />
            New speaker
          </Link>
        </Button>
      </div>
      <SpeakersTable speakers={speakers ?? []} />
    </div>
  )
}
