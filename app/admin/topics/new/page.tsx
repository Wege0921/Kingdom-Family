import { TopicForm } from '@/components/admin/topic-form'

export default function NewTopicPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New topic</h1>
        <p className="text-muted-foreground">Add a sermon topic tag</p>
      </div>
      <TopicForm />
    </div>
  )
}
