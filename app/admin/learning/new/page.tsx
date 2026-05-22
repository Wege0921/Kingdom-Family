import { LearningPathForm } from '@/components/admin/learning-path-form'

export default function NewLearningPathPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New learning path</h1>
        <p className="text-muted-foreground">Create a course; add modules after saving.</p>
      </div>
      <LearningPathForm />
    </div>
  )
}
