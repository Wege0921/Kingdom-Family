import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-lg">Kingdom Family</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Growing in faith through sermons, learning paths, and community engagement.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/sermons" className="hover:text-primary transition-colors">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-primary transition-colors">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/my/bookmarks" className="hover:text-primary transition-colors">
                  My Bookmarks
                </Link>
              </li>
              <li>
                <Link href="/my/progress" className="hover:text-primary transition-colors">
                  My Progress
                </Link>
              </li>
              <li>
                <Link href="/my/settings" className="hover:text-primary transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kingdom Family. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
