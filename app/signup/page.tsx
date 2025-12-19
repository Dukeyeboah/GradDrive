import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

export default function SignupPage() {
  return (
    <>
      <PublicNav />

      <main className="flex-1 container py-20">
        <div className="mx-auto max-w-md">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Get started with Grad Drive today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" size="lg">
                Create Account
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </>
  )
}
