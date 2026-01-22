'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, GraduationCap, ExternalLink } from 'lucide-react';
import { getCapDesigns, type Poster } from '@/lib/firebase/firestore';

export default function CapDesignsPage() {
  const [designs, setDesigns] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const data = await getCapDesigns();
      setDesigns(data);
    } catch (error) {
      console.error('Error loading cap designs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-col justify-start items-center w-full py-4'>
        <div className='container max-w-6xl'>
          <p className='text-muted-foreground text-center'>
            Loading cap designs...
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
            Graduation Cap Designs
          </h1>
          <p className='text-lg text-muted-foreground text-balance'>
            Explore and download cap design templates for your graduation
          </p>
        </div>

        {designs.length === 0 ? (
          <div className='text-center py-12'>
            <GraduationCap className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>
              No cap designs available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {designs.map((design) => (
              <Card
                key={design.id}
                className='border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-72 p-0'
              >
                {design.imageUrl ? (
                  <div className='w-full h-full relative overflow-hidden'>
                    {!loadedImages.has(design.id || '') && (
                      <div className='absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center'>
                        <GraduationCap className='h-12 w-12 text-muted-foreground/30' />
                      </div>
                    )}
                    <img
                      src={design.imageUrl}
                      alt={design.name}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        loadedImages.has(design.id || '') ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => {
                        if (design.id) {
                          setLoadedImages((prev) => new Set(prev).add(design.id!));
                        }
                      }}
                      onError={() => {
                        if (design.id) {
                          setLoadedImages((prev) => new Set(prev).add(design.id!));
                        }
                      }}
                    />
                    {/* Title overlay with see-through background */}
                    <div className='absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm px-3 py-2'>
                      <CardTitle className='text-sm font-semibold leading-tight text-white'>
                        {design.name}
                      </CardTitle>
                    </div>
                    {/* Action buttons overlay */}
                    <div className='absolute top-2 right-2 flex gap-2'>
                      <Button
                        className='gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 p-0'
                        variant='default'
                        size='sm'
                        onClick={() => {
                          const fileName = `${design.name.replace(
                            /[^a-z0-9]/gi,
                            '_'
                          )}.png`;
                          const downloadUrl = `/api/download?url=${encodeURIComponent(
                            design.imageUrl!
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
                      {design.shopifyLink && (
                        <Button
                          className='gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 p-0'
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            window.open(design.shopifyLink, '_blank')
                          }
                        >
                          <ExternalLink className='h-3 w-3' />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='w-full h-full relative bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center'>
                    <GraduationCap className='h-16 w-16 text-white/50' />
                    {/* Title overlay */}
                    <div className='absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm px-3 py-2'>
                      <CardTitle className='text-sm font-semibold leading-tight text-white'>
                        {design.name}
                      </CardTitle>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

