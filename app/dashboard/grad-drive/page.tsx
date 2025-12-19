import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileImage } from "lucide-react"

export default function GradDrivePage() {
  const assets = [
    {
      id: 1,
      title: "Celebration Poster",
      description: "Beautiful graduation celebration poster design",
      type: "Poster",
      format: "PNG",
    },
    {
      id: 2,
      title: "Kente Pattern Cap Design",
      description: "Traditional Kente-inspired graduation cap decoration",
      type: "Cap Design",
      format: "PDF",
    },
    {
      id: 3,
      title: "Achievement Certificate",
      description: "Customizable achievement certificate template",
      type: "Certificate",
      format: "PDF",
    },
    {
      id: 4,
      title: "Thank You Cards",
      description: "Set of elegant thank you card templates",
      type: "Cards",
      format: "PNG",
    },
    {
      id: 5,
      title: "Social Media Graphics",
      description: "Announcement graphics for social platforms",
      type: "Graphics",
      format: "PNG",
    },
    {
      id: 6,
      title: "Memory Scrapbook",
      description: "Digital scrapbook template for memories",
      type: "Template",
      format: "PDF",
    },
  ]

  return (
    <div className="flex flex-col justify-center items-center w-full py-12">
      <div className="container max-w-6xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl md:text-4xl text-balance">Digital Asset Hub</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Download free posters, cap designs, and keepsake materials
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <Card key={asset.id} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 mb-2">
                  <FileImage className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-lg">{asset.title}</CardTitle>
                <CardDescription>{asset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{asset.type}</span>
                  <span>{asset.format}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
