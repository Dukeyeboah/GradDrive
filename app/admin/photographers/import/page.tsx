"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { importPhotographers } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText, Upload } from "lucide-react"

export default function ImportPhotographersPage() {
  const [jsonData, setJsonData] = useState("")
  const [importing, setImporting] = useState(false)
  const [importingFromFile, setImportingFromFile] = useState(false)
  const { toast } = useToast()

  const handleImportFromFile = async () => {
    try {
      setImportingFromFile(true)
      console.log("Starting import from file...")
      const response = await fetch("/api/photographers/import", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Import result:", result)

      if (result.success) {
        toast({
          title: "Import Complete",
          description: result.message,
        })
      } else {
        throw new Error(result.error || "Failed to import")
      }
    } catch (error: any) {
      console.error("Import error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to import photographers from file",
        variant: "destructive",
      })
    } finally {
      setImportingFromFile(false)
    }
  }

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
        <p className="text-muted-foreground">Import photographer data from JSON file or paste data manually</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Import from File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Import from File
            </CardTitle>
            <CardDescription>
              Import photographers from the data/photographers.json file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will import all photographers from the pre-configured JSON file located at{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">data/photographers.json</code>
            </p>
            <Button 
              onClick={handleImportFromFile} 
              disabled={importingFromFile}
              className="w-full"
            >
              {importingFromFile ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import from File
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Import */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Import</CardTitle>
            <CardDescription>
              Paste JSON data manually to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="json-data">JSON Data (array of photographer objects)</Label>
              <Textarea
                id="json-data"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder='[{"Column1": "Interested - Follow Up", "Column2": "John", ...}]'
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            <Button 
              onClick={handleImport} 
              disabled={importing}
              className="w-full"
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import Photographers"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

