import { SeriesForm } from '@/components/admin/series-form'

export default function NewSeriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New series</h1>
        <p className="text-muted-foreground">Create a sermon series</p>
      </div>
      <SeriesForm />
    </div>
  )
}
