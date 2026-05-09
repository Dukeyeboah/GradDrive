import Image from 'next/image';

const HERO_IMAGE = '/images/grad.jpg';

export function DashboardHeroSection({
  greetingLine,
  userName,
}: {
  greetingLine: string;
  userName: string | null;
}) {
  const hello = userName ? `Hello, ${userName}` : 'Hello';

  return (
    <section className='grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12'>
      <div className='space-y-4'>
        <p className='text-lg text-muted-foreground'>
          {hello} 👋
        </p>
        <h1 className='text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl'>
          Everything you need to succeed after graduation, all in one place.
        </h1>
        <p className='max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg'>
          {greetingLine}
        </p>
      </div>
      <div className='relative w-full aspect-[4/3] max-h-[380px] lg:max-h-[420px]'>
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/15 to-primary/10 -z-10 scale-[1.02] blur-sm' />
        <div className='relative h-full w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/40'>
          <Image
            src={HERO_IMAGE}
            alt='Graduate celebration'
            fill
            className='object-cover'
            sizes='(max-width: 1024px) 100vw, 50vw'
            priority
          />
        </div>
      </div>
    </section>
  );
}
