import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SermonForm } from '@/components/admin/sermon-form'

interface EditSermonPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSermonPage({ params }: EditSermonPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const [
    { data: sermon },
    { data: speakers },
    { data: series },
    { data: topics },
    { data: sermonTopics },
  ] = await Promise.all([
    supabase.from('sermons').select('*').eq('id', id).single(),
    supabase.from('speakers').select('*').eq('is_active', true).order('name'),
    supabase.from('series').select('*').eq('is_active', true).order('title_en'),
    supabase.from('topics').select('*').order('name_en'),
    supabase.from('sermon_topics').select('topic_id').eq('sermon_id', id),
  ])
  
  if (!sermon) {
    notFound()
  }
  
  const topicIds = sermonTopics?.map((st) => st.topic_id) || []
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Sermon</h1>
        <p className="text-muted-foreground">Update sermon content and settings</p>
      </div>

      <SermonForm 
        sermon={sermon}
        speakers={speakers || []} 
        series={series || []} 
        topics={topics || []}
        initialTopicIds={topicIds}
      />
    </div>
  )
}
