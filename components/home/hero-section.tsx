import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, GraduationCap, Users } from 'lucide-react'

interface HeroSectionProps {
  isLoggedIn: boolean
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            Grow in <span className="text-primary">Faith</span> Through{' '}
            <span className="text-primary">Learning</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            Access sermons, study guides, and learning paths designed to deepen your 
            understanding of God&apos;s Word. Join our community and start your spiritual 
            journey today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/sermons">
                    Browse Sermons
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/learn">Start Learning</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sermons">Browse Sermons</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Weekly Sermons</h3>
            <p className="text-sm text-muted-foreground">
              Access new sermons every week with study guides and reflection questions.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Learning Paths</h3>
            <p className="text-sm text-muted-foreground">
              Structured courses to help you grow in specific areas of faith.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with others, share insights, and grow together in faith.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
