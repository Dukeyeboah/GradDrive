import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  BookOpen,
  Camera,
  Ticket,
  Gift,
  Award,
} from 'lucide-react';

export function WelcomeScreen() {
  const benefits = [
    {
      icon: GraduationCap,
      title: 'Free Digital Assets',
      description:
        'Download graduation posters, cap designs, and keepsake materials',
    },
    {
      icon: BookOpen,
      title: 'After-Grad E-books',
      description:
        'Access our comprehensive After-Grad Kit and future releases',
    },
    {
      icon: Camera,
      title: 'Photographer Network',
      description: 'Connect with verified photographers for your special day',
    },
    {
      icon: Award,
      title: 'Ghana Culture Scholarship',
      description: 'Apply for our exclusive Ghana Culture Scholarship Tour',
    },
    {
      icon: Gift,
      title: 'Exclusive Discounts',
      description: 'Access future purchase discounts and special offers',
    },
    {
      icon: Ticket,
      title: 'Premium Perks',
      description: 'Unlock additional benefits as we grow with you',
    },
  ];

  return (
    // <main className="flex-1">
    <main className='flex-col flex justify-center items-center'>
      {/* Hero Section */}
      <section className='container py-20 md:py-32'>
        <div className='mx-auto max-w-3xl text-center space-y-6'>
          <div className='inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-secondary-foreground'>
            🎓 Celebrate Your Achievement
          </div>

          <h1 className='font-bold text-4xl md:text-6xl text-balance text-foreground'>
            Your Graduation Journey,{' '}
            <span className='text-accent'>Simplified</span>
          </h1>

          <p className='text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto'>
            Access exclusive perks, digital assets, photographer connections,
            and scholarship opportunities — all in one place.
          </p>

          <div className='flex items-center justify-center gap-4 pt-4'>
            <Link href='/signup'>
              <Button size='lg' className='gap-2'>
                Get Started Free
              </Button>
            </Link>
            <Link href='/login'>
              <Button size='lg' variant='outline'>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      {/* <section className="container py-20 bg-muted/30">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-bold text-3xl md:text-4xl text-balance">Everything You Need to Celebrate</h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Grad Drive brings together resources, connections, and opportunities to make your graduation memorable.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <Card key={idx} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="container py-20">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="font-bold text-3xl md:text-4xl text-balance">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Join thousands of graduates celebrating their achievements with Grad Drive.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section> */}
    </main>
  );
}
