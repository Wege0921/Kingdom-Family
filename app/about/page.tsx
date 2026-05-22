import { PublicShell } from '@/components/layout/public-shell'

export const metadata = {
  title: 'About',
  description: 'About Kingdom Family Platform.',
}

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="container max-w-2xl px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold">About Kingdom Family</h1>
        <p className="text-muted-foreground leading-relaxed">
          Kingdom Family is a bilingual sermon and discipleship platform built for the Keys of the
          Kingdom series. Members can watch teachings, read structured summaries in English and
          Amharic, follow learning paths, and grow together in faith.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Ministry leaders can publish weekly content, schedule social distribution, and track
          engagement — all from one place.
        </p>
      </div>
    </PublicShell>
  )
}
