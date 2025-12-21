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
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download } from 'lucide-react';
import { getEbooks, type Ebook } from '@/lib/firebase/firestore';

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    try {
      setLoading(true);
      const data = await getEbooks();
      setEbooks(data);
    } catch (error) {
      console.error('Error loading ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-col justify-start items-center w-full py-4'>
        <div className='container max-w-6xl'>
          <p className='text-muted-foreground text-center'>Loading ebooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-start items-center w-full py-4'>
      <div className='container max-w-6xl space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='font-bold text-3xl md:text-4xl text-balance'>
            E-book Library
          </h1>
          <p className='text-lg text-muted-foreground text-balance'>
            Access exclusive guides and resources for your post-graduation
            journey
          </p>
        </div>

        {ebooks.length === 0 ? (
          <div className='text-center py-12'>
            <BookOpen className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>
              No e-books available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {ebooks.map((ebook) => (
              <Card
                key={ebook.id}
                className='p-0 border-border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden'
              >
                {ebook.thumbnailUrl ? (
                  <div className='w-full relative overflow-hidden flex-shrink-0'>
                    <img
                      src={ebook.thumbnailUrl}
                      alt={ebook.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-full h-48 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0'>
                    <BookOpen className='h-16 w-16 text-white/50' />
                  </div>
                )}
                <CardHeader className='pb-3 pt-3 flex-shrink-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <CardTitle className='text-sm font-semibold leading-tight flex-1'>
                      {ebook.title}
                    </CardTitle>
                    {ebook.available ? (
                      <Badge variant='default' className='text-xs'>
                        Available
                      </Badge>
                    ) : (
                      <Badge variant='secondary' className='text-xs'>
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardDescription className='text-xs'>
                    By {ebook.author}
                  </CardDescription>
                  {ebook.description && (
                    <CardDescription className='text-xs mt-1 line-clamp-2'>
                      {ebook.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter className='pt-0 pb-3'>
                  <Button
                    className='w-full gap-2'
                    size='sm'
                    disabled={!ebook.available || !ebook.fileUrl}
                    onClick={() => {
                      if (!ebook.fileUrl) return;
                      // Use API route to download (bypasses CORS)
                      const fileName = `${ebook.title.replace(
                        /[^a-z0-9]/gi,
                        '_'
                      )}.pdf`;
                      const downloadUrl = `/api/download?url=${encodeURIComponent(
                        ebook.fileUrl
                      )}&filename=${encodeURIComponent(fileName)}`;

                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    {ebook.available ? (
                      <>
                        <Download className='h-4 w-4' />
                        Download
                      </>
                    ) : (
                      'Notify Me'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
