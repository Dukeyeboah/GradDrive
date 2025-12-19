import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download } from "lucide-react"

export default function EbooksPage() {
  const ebooks = [
    {
      id: 1,
      title: "After-Grad Kit",
      author: "Grad Drive Team",
      description:
        "Complete guide to navigating life after graduation, including career planning, financial tips, and personal development strategies.",
      pages: 120,
      available: true,
    },
    {
      id: 2,
      title: "Career Launch Blueprint",
      author: "Coming Soon",
      description: "Strategic guide to launching your professional career with confidence and clarity.",
      pages: 85,
      available: false,
    },
    {
      id: 3,
      title: "Financial Freedom Fundamentals",
      author: "Coming Soon",
      description: "Essential financial literacy for young professionals starting their journey.",
      pages: 95,
      available: false,
    },
  ]

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl text-balance">E-book Library</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Access exclusive guides and resources for your post-graduation journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((ebook) => (
          <Card
            key={ebook.id}
            className="border-border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <CardHeader>
              <div className="flex h-48 w-full items-center justify-center rounded-lg bg-accent/10 mb-2">
                <BookOpen className="h-16 w-16 text-accent" />
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{ebook.title}</CardTitle>
                {ebook.available ? (
                  <Badge variant="default">Available</Badge>
                ) : (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
              <CardDescription className="leading-relaxed">{ebook.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>By {ebook.author}</span>
                <span>{ebook.pages} pages</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2" disabled={!ebook.available}>
                {ebook.available ? (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                ) : (
                  "Notify Me"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
