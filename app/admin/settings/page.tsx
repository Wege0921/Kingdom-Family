import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, User, Database } from 'lucide-react'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Platform and account configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your account
          </CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <span className="text-muted-foreground">Name:</span> {profile?.full_name ?? '—'}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Role:</span> {profile?.role ?? '—'}
          </p>
          <Button variant="outline" asChild>
            <Link href="/my/settings">Edit profile</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data & integrations
          </CardTitle>
          <CardDescription>Managed via environment variables</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Supabase, Cloudinary, Resend, Telegram, and WhatsApp keys are set in Vercel or .env.local.</p>
          <p>See <code className="text-xs bg-muted px-1 rounded">.env.example</code> in the project root.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Site
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Public URL:{' '}
            <span className="font-mono text-foreground">
              {process.env.NEXT_PUBLIC_APP_URL ?? 'Not set'}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
