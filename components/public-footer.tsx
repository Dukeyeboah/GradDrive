import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="font-bold text-primary-foreground text-lg">GD</span>
              </div>
              <span className="font-bold text-lg">Grad Drive</span>
            </div>
            <p className="text-sm text-muted-foreground">Your graduation journey partner</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/grad-drive" className="hover:text-foreground transition-colors">
                  Digital Assets
                </Link>
              </li>
              <li>
                <Link href="/dashboard/photographers" className="hover:text-foreground transition-colors">
                  Photographers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard/ebooks" className="hover:text-foreground transition-colors">
                  E-books
                </Link>
              </li>
              <li>
                <Link href="/dashboard/scholarship" className="hover:text-foreground transition-colors">
                  Scholarship
                </Link>
              </li>
              <li>
                <Link href="/dashboard/discounts" className="hover:text-foreground transition-colors">
                  Discounts
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Grad Drive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
