"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { importPhotographers } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function ImportPhotographersPage() {
  const [jsonData, setJsonData] = useState("")
  const [importing, setImporting] = useState(false)
  const { toast } = useToast()

  const handleImport = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Error",
        description: "Please paste JSON data",
        variant: "destructive",
      })
      return
    }

    try {
      const data = JSON.parse(jsonData)
      const dataArray = Array.isArray(data) ? data : [data]
      
      setImporting(true)
      const result = await importPhotographers(dataArray)
      
      toast({
        title: "Import Complete",
        description: `Successfully imported ${result.success} photographers. ${result.errors} errors.`,
      })
      
      setJsonData("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to import photographers",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl">Import Photographers</h1>
        <p className="text-muted-foreground">Import photographer data from JSON</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paste JSON Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="json-data">JSON Data (array of photographer objects)</Label>
            <Textarea
              id="json-data"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder='[{"Column1": "Interested - Follow Up", "Column2": "John", ...}]'
              rows={15}
              className="font-mono text-sm"
            />
          </div>
          <Button onClick={handleImport} disabled={importing}>
            {importing ? "Importing..." : "Import Photographers"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

