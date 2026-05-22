import { SpeakerForm } from '@/components/admin/speaker-form'

export default function NewSpeakerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New speaker</h1>
        <p className="text-muted-foreground">Add a ministry speaker or teacher</p>
      </div>
      <SpeakerForm />
    </div>
  )
}
