import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell } from 'lucide-react'

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Web push and sermon alerts</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push notifications
          </CardTitle>
          <CardDescription>
            Automated push on sermon publish requires VAPID keys and the push API routes (Phase 6).
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Configure in your environment:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>NEXT_PUBLIC_VAPID_PUBLIC_KEY</li>
            <li>VAPID_PRIVATE_KEY</li>
            <li>VAPID_EMAIL</li>
          </ul>
          <p className="pt-2">
            Members can enable notifications from their account once the push subscribe flow is wired.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
