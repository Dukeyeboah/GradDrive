import Link from 'next/link';
export default function PausedExperience({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-xl px-6 py-16 text-center space-y-4">
    <p className="text-sm font-medium text-orange-600">Paused for now</p>
    <h1 className="text-3xl font-bold">We’re focusing on your next chapter</h1>
    <p className="text-muted-foreground">This experience is not currently open. Explore our guides or meet other graduates while we develop future opportunities.</p>
    <Link href="/dashboard" className="inline-flex rounded-xl bg-foreground px-5 py-3 text-background">Back to your Grad Drive</Link>
  </div>;
}
