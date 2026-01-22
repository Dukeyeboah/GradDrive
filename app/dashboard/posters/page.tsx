'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileImage, ExternalLink } from 'lucide-react';
import { getPosters, type Poster } from '@/lib/firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function PostersPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadPosters();
  }, []);

  const loadPosters = async () => {
    try {
      setLoading(true);
      const allPosters = await getPosters();
      // Filter out cap designs (they should be shown separately)
      const postersOnly = allPosters.filter(
        (p) => p.category !== 'Cap Designs'
      );
      setPosters(postersOnly);
    } catch (error) {
      console.error('Error loading posters:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-col justify-start items-center w-full py-4'>
        <div className='container max-w-6xl'>
          <p className='text-muted-foreground text-center'>
            Loading posters...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-start items-center w-full py-4'>
      <div className='container max-w-6xl space-y-8 w-full'>
        <div className='space-y-2 text-center w-full pt-4 '>
          <h1 className='font-bold text-3xl md:text-4xl text-balance'>
            Digital Posters & Artwork
          </h1>
          <p className='text-lg text-muted-foreground text-balance'>
            Download free posters and artwork for your graduation celebration
          </p>
        </div>

        {posters.length === 0 ? (
          <div className='text-center py-12'>
            <FileImage className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>
              No posters available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {posters.map((poster) => (
              <Card
                key={poster.id}
                className='border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-72 p-0 cursor-pointer'
                onClick={() => {
                  setSelectedPoster(poster);
                  setModalOpen(true);
                }}
              >
                {poster.imageUrl ? (
                  <div className='w-full h-full relative overflow-hidden'>
                    {!loadedImages.has(poster.id || '') && (
                      <div className='absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center'>
                        <FileImage className='h-12 w-12 text-muted-foreground/30' />
                      </div>
                    )}
                    <img
                      src={poster.lowResImageUrl || poster.imageUrl}
                      alt={poster.name}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        loadedImages.has(poster.id || '') ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => {
                        if (poster.id) {
                          setLoadedImages((prev) => new Set(prev).add(poster.id!));
                        }
                      }}
                      onError={(e) => {
                        // If low-res fails, fall back to high-res
                        if (poster.lowResImageUrl && poster.imageUrl) {
                          const img = e.currentTarget;
                          if (img.src === poster.lowResImageUrl) {
                            img.src = poster.imageUrl;
                            return;
                          }
                        }
                        // Mark as loaded to hide loading state
                        if (poster.id) {
                          setLoadedImages((prev) => new Set(prev).add(poster.id!));
                        }
                      }}
                    />
                    {/* Title overlay with see-through background */}
                    <div className='absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm px-3 py-2'>
                      <CardTitle className='text-sm font-semibold leading-tight text-white'>
                        {poster.name}
                      </CardTitle>
                    </div>
                    {/* Action buttons overlay */}
                    <div className='absolute top-2 right-2 flex gap-2'>
                      <Button
                        className='gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 p-0'
                        variant='default'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          // Use high-res image for download
                          if (!poster.imageUrl) return;
                          
                          // Use API route to download (bypasses CORS)
                          const fileName = `${poster.name.replace(
                            /[^a-z0-9]/gi,
                            '_'
                          )}.png`;
                          const downloadUrl = `/api/download?url=${encodeURIComponent(
                            poster.imageUrl
                          )}&filename=${encodeURIComponent(fileName)}`;

                          const link = document.createElement('a');
                          link.href = downloadUrl;
                          link.download = fileName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className='h-3 w-3 text-black dark:text-white' />
                      </Button>
                      {poster.shopifyLink && (
                        <Button
                          className='gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 p-0'
                          variant='outline'
                          size='sm'
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            window.open(poster.shopifyLink, '_blank');
                          }}
                        >
                          <ExternalLink className='h-3 w-3' />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='w-full h-full relative bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center'>
                    <FileImage className='h-16 w-16 text-white/50' />
                    {/* Title overlay */}
                    <div className='absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm px-3 py-2'>
                      <CardTitle className='text-sm font-semibold leading-tight text-white'>
                        {poster.name}
                      </CardTitle>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Poster Detail Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPoster?.name}</DialogTitle>
            {selectedPoster?.description && (
              <DialogDescription className="text-base">
                {selectedPoster.description}
              </DialogDescription>
            )}
          </DialogHeader>
          {selectedPoster && (
            <div className="space-y-4">
              {/* Poster Image - Constrained to fit viewport */}
              {selectedPoster.imageUrl && (
                <div className="w-full relative bg-muted rounded-lg overflow-hidden flex items-center justify-center" style={{ maxHeight: '60vh' }}>
                  <img
                    src={selectedPoster.lowResImageUrl || selectedPoster.imageUrl}
                    alt={selectedPoster.name}
                    className="w-full h-auto object-contain max-h-[60vh]"
                    loading="eager"
                    onError={(e) => {
                      // Fallback to high-res if low-res fails
                      if (selectedPoster.lowResImageUrl && selectedPoster.imageUrl) {
                        const img = e.currentTarget;
                        if (img.src === selectedPoster.lowResImageUrl) {
                          img.src = selectedPoster.imageUrl;
                        }
                      }
                    }}
                  />
                </div>
              )}

              {/* Download Button */}
              <div className="flex justify-center pt-2">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    if (!selectedPoster.imageUrl) return;
                    
                    const fileName = `${selectedPoster.name.replace(
                      /[^a-z0-9]/gi,
                      '_'
                    )}.png`;
                    const downloadUrl = `/api/download?url=${encodeURIComponent(
                      selectedPoster.imageUrl
                    )}&filename=${encodeURIComponent(fileName)}`;

                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-5 w-5" />
                  Download High-Resolution PNG
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

