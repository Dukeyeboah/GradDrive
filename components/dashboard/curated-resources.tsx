const RESOURCES = [
  { title: 'Prepare for your next role', provider: 'OpenLearn · The Open University', description: 'A free, self-paced course covering career planning, CVs, applications, and interviews.', href: 'https://www.open.edu/openlearn/education-development/succeed-the-workplace/content-section-overview', audience: 'Useful across locations; adapt examples to your local job market.' },
  { title: 'Explore free learning', provider: 'OpenLearn · The Open University', description: 'Browse free courses and choose one skill to develop for your next chapter.', href: 'https://www.open.edu/openlearn/free-courses/full-catalogue', audience: 'Online learning; check each course’s requirements.' },
  { title: 'Explore careers and training', provider: 'CareerOneStop · U.S. Department of Labor sponsored', description: 'Find career exploration, job-search, and training resources.', href: 'https://www.careeronestop.org/', audience: 'U.S.-focused; availability and eligibility vary.' },
];
export function CuratedResources() {
  return <section className="space-y-4" aria-labelledby="curated-resources-title">
    <div><h2 id="curated-resources-title" className="text-xl font-semibold">Useful places to start</h2><p className="mt-1 text-sm text-muted-foreground">Independent resources, reviewed November 16, 2026. These open on the provider’s website.</p></div>
    <div className="grid gap-4 md:grid-cols-3">{RESOURCES.map(resource => <article key={resource.href} className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <p className="text-xs text-muted-foreground">{resource.provider}</p><h3 className="font-semibold">{resource.title}</h3><p className="text-sm text-muted-foreground">{resource.description}</p><p className="text-xs text-muted-foreground">{resource.audience}</p><a href={resource.href} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-medium underline underline-offset-4">Visit resource <span className="sr-only">(opens in a new tab)</span>↗</a>
    </article>)}</div>
  </section>;
}
