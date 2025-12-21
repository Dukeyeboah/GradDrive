'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  BookOpen,
  MoreVertical,
  Eye,
  Edit,
  Upload,
  Download,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getEbooks,
  addEbook,
  updateEbook,
  deleteEbook,
  type Ebook,
} from '@/lib/firebase/firestore';
import { uploadImage, uploadFile } from '@/lib/firebase/storage';
import { addSystemLog } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AdminEbooksPage() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pages: '',
    available: true,
    category: '',
    isbn: '',
    thumbnailUrl: '',
    fileUrl: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [ebookFileName, setEbookFileName] = useState<string | null>(null);

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
      toast({
        title: 'Error',
        description: 'Failed to load ebooks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEbookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEbookFile(file);
      setEbookFileName(file.name);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEbook = async () => {
    if (!user || !userData) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload ebooks',
        variant: 'destructive',
      });
      return;
    }

    if (!ebookFile) {
      toast({
        title: 'Error',
        description: 'Please upload an e-book file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Upload ebook file first to ebooks/files/ folder
      const { url: fileUrl, error: fileError } = await uploadFile(
        ebookFile,
        `ebooks/files/${Date.now()}_${ebookFile.name}`
      );
      if (fileError || !fileUrl) {
        toast({
          title: 'Upload Error',
          description: fileError || 'Failed to upload e-book file',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }

      // Upload thumbnail if provided to ebooks/thumbnails/ folder
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        const { url, error: thumbError } = await uploadImage(
          thumbnailFile,
          'ebooks/thumbnails'
        );
        if (thumbError || !url) {
          toast({
            title: 'Upload Warning',
            description:
              thumbError || 'Failed to upload thumbnail, continuing without it',
            variant: 'destructive',
          });
        } else {
          thumbnailUrl = url;
        }
      }

      // Save ebook data to Firestore
      const ebookData: any = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        pages: parseInt(formData.pages) || 0,
        available: formData.available,
        fileUrl,
        uploadedBy: user.uid,
        uploadedByName: userData.displayName || user.email || 'Unknown',
        uploadedByEmail: user.email || '',
      };

      if (thumbnailUrl) {
        ebookData.thumbnailUrl = thumbnailUrl;
      }
      if (formData.category && formData.category.trim()) {
        ebookData.category = formData.category.trim();
      }
      if (formData.isbn && formData.isbn.trim()) {
        ebookData.isbn = formData.isbn.trim();
      }

      const ebookId = await addEbook(ebookData);
      if (ebookId) {
        await addSystemLog(
          'E-book uploaded',
          'ebook',
          user.uid,
          userData.displayName || user.email || 'Unknown',
          userData.email || '',
          { ebookId, ebookTitle: formData.title }
        );

        toast({
          title: 'Success',
          description: 'E-book uploaded successfully!',
        });
        setAddModalOpen(false);
        resetForm();
        loadEbooks();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save e-book',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error adding ebook:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditEbook = async () => {
    if (!selectedEbook || !user || !userData) return;

    setUploading(true);
    try {
      let fileUrl = selectedEbook.fileUrl;
      let thumbnailUrl = selectedEbook.thumbnailUrl;

      // Upload new ebook file if one was selected to ebooks/files/ folder
      if (ebookFile) {
        const { url, error: fileError } = await uploadFile(
          ebookFile,
          `ebooks/files/${Date.now()}_${ebookFile.name}`
        );
        if (fileError || !url) {
          toast({
            title: 'Upload Error',
            description: fileError || 'Failed to upload e-book file',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        }
        fileUrl = url;
      }

      // Upload new thumbnail if one was selected to ebooks/thumbnails/ folder
      if (thumbnailFile) {
        const { url, error: thumbError } = await uploadImage(
          thumbnailFile,
          'ebooks/thumbnails'
        );
        if (thumbError || !url) {
          toast({
            title: 'Upload Warning',
            description: thumbError || 'Failed to upload thumbnail',
            variant: 'destructive',
          });
        } else {
          thumbnailUrl = url;
        }
      }

      // Update ebook in Firestore
      const updateData: any = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        pages: parseInt(formData.pages) || selectedEbook.pages,
        available: formData.available,
        fileUrl,
        uploadedByEmail: user.email || '',
      };

      if (thumbnailUrl) {
        updateData.thumbnailUrl = thumbnailUrl;
      }
      if (formData.category && formData.category.trim()) {
        updateData.category = formData.category.trim();
      }
      if (formData.isbn && formData.isbn.trim()) {
        updateData.isbn = formData.isbn.trim();
      }

      const success = await updateEbook(selectedEbook.id!, updateData);
      if (success) {
        await addSystemLog(
          'E-book updated',
          'ebook',
          user.uid,
          userData.displayName || user.email || 'Unknown',
          userData.email || '',
          { ebookId: selectedEbook.id, ebookTitle: formData.title }
        );

        toast({
          title: 'Success',
          description: 'E-book updated successfully!',
        });
        setEditModalOpen(false);
        setSelectedEbook(null);
        resetForm();
        loadEbooks();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update e-book',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error updating ebook:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      pages: '',
      available: true,
      category: '',
      isbn: '',
      thumbnailUrl: '',
      fileUrl: '',
    });
    setThumbnailFile(null);
    setEbookFile(null);
    setThumbnailPreview(null);
    setEbookFileName(null);
  };

  const openViewModal = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setViewModalOpen(true);
  };

  const openEditModal = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setFormData({
      title: ebook.title,
      author: ebook.author,
      description: ebook.description,
      pages: ebook.pages?.toString() || '',
      available: ebook.available ?? true,
      category: ebook.category || '',
      isbn: ebook.isbn || '',
      thumbnailUrl: ebook.thumbnailUrl || '',
      fileUrl: ebook.fileUrl || '',
    });
    setThumbnailPreview(ebook.thumbnailUrl || null);
    setThumbnailFile(null);
    setEbookFile(null);
    setEbookFileName(null);
    setEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className='p-6 flex items-center justify-center min-h-[400px]'>
        <p className='text-muted-foreground'>Loading ebooks...</p>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='font-bold text-3xl md:text-4xl'>E-book Management</h1>
          <p className='text-muted-foreground'>
            Upload and update e-book resources
          </p>
        </div>
        <Button className='gap-2' onClick={() => setAddModalOpen(true)}>
          <Plus className='h-4 w-4' />
          Upload E-book
        </Button>
      </div>

      {ebooks.length === 0 ? (
        <div className='text-center py-12'>
          <BookOpen className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground'>
            No e-books available yet. Upload your first e-book to get started!
          </p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {ebooks.map((ebook) => (
            <Card
              key={ebook.id}
              className='border-border bg-card shadow-sm overflow-hidden flex flex-col p-0'
            >
              {ebook.thumbnailUrl ? (
                <div className='w-full relative overflow-hidden flex-shrink-0'>
                  <img
                    src={ebook.thumbnailUrl}
                    alt={ebook.title}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute top-2 right-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='bg-background/80 backdrop-blur-sm'
                        >
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => openViewModal(ebook)}>
                          <Eye className='h-4 w-4 mr-2' />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(ebook)}>
                          <Edit className='h-4 w-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ) : (
                <div className='w-full h-48 relative bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0'>
                  <BookOpen className='h-16 w-16 text-white/50' />
                  <div className='absolute top-2 right-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='bg-background/80 backdrop-blur-sm'
                        >
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => openViewModal(ebook)}>
                          <Eye className='h-4 w-4 mr-2' />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(ebook)}>
                          <Edit className='h-4 w-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
              <CardHeader className='pb-3 pt-0 flex-shrink-0'>
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
                {/* <CardDescription className='text-xs'>
                  By {ebook.author}
                </CardDescription> */}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Add E-book Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Upload New E-book</DialogTitle>
            <DialogDescription>
              Add a new e-book to the library
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder='E-book title'
              />
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='author'>Author</Label>
                <Input
                  id='author'
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder='Author name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='pages'>Pages</Label>
                <Input
                  id='pages'
                  type='number'
                  value={formData.pages}
                  onChange={(e) =>
                    setFormData({ ...formData, pages: e.target.value })
                  }
                  placeholder='120'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Describe the e-book content'
                rows={4}
              />
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Input
                  id='category'
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder='e.g., Career Guide, Finance'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='isbn'>ISBN (optional)</Label>
                <Input
                  id='isbn'
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  placeholder='978-0-123456-78-9'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ebook-file'>Upload E-book File</Label>
              <div className='flex flex-col gap-2'>
                <label htmlFor='ebook-file-upload' className='cursor-pointer'>
                  <div className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors'>
                    <FileText className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm font-medium'>
                      Click to upload e-book file (PDF, EPUB, MOBI)
                    </span>
                  </div>
                  <input
                    id='ebook-file-upload'
                    type='file'
                    accept='.pdf,.epub,.mobi'
                    className='hidden'
                    onChange={handleEbookFileChange}
                  />
                </label>
                {ebookFileName && (
                  <div className='px-3 py-2 bg-muted rounded-md'>
                    <p className='text-sm text-muted-foreground'>
                      <FileText className='h-4 w-4 inline mr-2' />
                      {ebookFileName}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='thumbnail'>
                Upload Thumbnail Image (optional)
              </Label>
              <div className='flex flex-col gap-2'>
                <label htmlFor='thumbnail-upload' className='cursor-pointer'>
                  <div className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors'>
                    <Upload className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm font-medium'>
                      Click to upload thumbnail image
                    </span>
                  </div>
                  <input
                    id='thumbnail-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleThumbnailChange}
                  />
                </label>
                {thumbnailPreview && (
                  <div className='mt-2'>
                    <img
                      src={thumbnailPreview}
                      alt='Thumbnail preview'
                      className='w-full h-48 object-cover rounded-lg border border-border'
                    />
                  </div>
                )}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='available'
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
                className='rounded'
              />
              <Label htmlFor='available' className='cursor-pointer'>
                Make available for download
              </Label>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setAddModalOpen(false);
                  resetForm();
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEbook}
                disabled={uploading || !ebookFile}
              >
                {uploading ? 'Uploading...' : 'Upload E-book'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>E-book Details</DialogTitle>
            <DialogDescription>
              Complete information about the e-book
            </DialogDescription>
          </DialogHeader>
          {selectedEbook && (
            <div className='space-y-4'>
              {selectedEbook.thumbnailUrl ? (
                <div className='w-full h-64 rounded-lg overflow-hidden'>
                  <img
                    src={selectedEbook.thumbnailUrl}
                    alt={selectedEbook.title}
                    className='w-full h-full object-cover'
                  />
                </div>
              ) : (
                <div className='flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600'>
                  <BookOpen className='h-16 w-16 text-white/50' />
                </div>
              )}
              <div className='flex items-start gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h3 className='text-xl font-bold'>{selectedEbook.title}</h3>
                    {selectedEbook.available ? (
                      <Badge variant='default'>Available</Badge>
                    ) : (
                      <Badge variant='secondary'>Coming Soon</Badge>
                    )}
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    By {selectedEbook.author}
                  </p>
                </div>
              </div>
              <div className='space-y-3'>
                <div>
                  <Label className='text-sm font-medium'>Description</Label>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {selectedEbook.description}
                  </p>
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <Label className='text-sm font-medium'>Pages</Label>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {selectedEbook.pages || 0} pages
                    </p>
                  </div>
                  {selectedEbook.downloads !== undefined && (
                    <div>
                      <Label className='text-sm font-medium'>Downloads</Label>
                      <div className='flex items-center gap-1 mt-1'>
                        <Download className='h-4 w-4 text-muted-foreground' />
                        <span className='text-lg font-bold'>
                          {selectedEbook.downloads || 0}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {selectedEbook.uploadedByName && (
                  <div>
                    <Label className='text-sm font-medium'>Uploaded By</Label>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {selectedEbook.uploadedByName}
                    </p>
                  </div>
                )}
                {selectedEbook.category && (
                  <div>
                    <Label className='text-sm font-medium'>Category</Label>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {selectedEbook.category}
                    </p>
                  </div>
                )}
                {selectedEbook.isbn && (
                  <div>
                    <Label className='text-sm font-medium'>ISBN</Label>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {selectedEbook.isbn}
                    </p>
                  </div>
                )}
                {selectedEbook.createdAt && (
                  <div>
                    <Label className='text-sm font-medium'>Uploaded</Label>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {selectedEbook.createdAt.toDate
                        ? selectedEbook.createdAt
                            .toDate()
                            .toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                        : 'N/A'}
                    </p>
                  </div>
                )}
              </div>
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  onClick={() => setViewModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit E-book Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit E-book</DialogTitle>
            <DialogDescription>Update e-book information</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-title'>Title</Label>
              <Input
                id='edit-title'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='edit-author'>Author</Label>
                <Input
                  id='edit-author'
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-pages'>Pages</Label>
                <Input
                  id='edit-pages'
                  type='number'
                  value={formData.pages}
                  onChange={(e) =>
                    setFormData({ ...formData, pages: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-description'>Description</Label>
              <Textarea
                id='edit-description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='edit-category'>Category</Label>
                <Input
                  id='edit-category'
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-isbn'>ISBN (optional)</Label>
                <Input
                  id='edit-isbn'
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-ebook-file'>
                Update E-book File (optional)
              </Label>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='edit-ebook-file-upload'
                  className='cursor-pointer'
                >
                  <div className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors'>
                    <FileText className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm font-medium'>
                      Click to upload new e-book file
                    </span>
                  </div>
                  <input
                    id='edit-ebook-file-upload'
                    type='file'
                    accept='.pdf,.epub,.mobi'
                    className='hidden'
                    onChange={handleEbookFileChange}
                  />
                </label>
                {ebookFileName && (
                  <div className='px-3 py-2 bg-muted rounded-md'>
                    <p className='text-sm text-muted-foreground'>
                      <FileText className='h-4 w-4 inline mr-2' />
                      {ebookFileName}
                    </p>
                  </div>
                )}
                {!ebookFileName && selectedEbook?.fileUrl && (
                  <div className='px-3 py-2 bg-muted rounded-md'>
                    <p className='text-sm text-muted-foreground'>
                      <FileText className='h-4 w-4 inline mr-2' />
                      Current file uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-thumbnail'>
                Update Thumbnail Image (optional)
              </Label>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='edit-thumbnail-upload'
                  className='cursor-pointer'
                >
                  <div className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors'>
                    <Upload className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm font-medium'>
                      Click to upload new thumbnail image
                    </span>
                  </div>
                  <input
                    id='edit-thumbnail-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleThumbnailChange}
                  />
                </label>
                {thumbnailPreview && (
                  <div className='mt-2'>
                    <img
                      src={thumbnailPreview}
                      alt='Thumbnail preview'
                      className='w-full h-48 object-cover rounded-lg border border-border'
                    />
                  </div>
                )}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='edit-available'
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
                className='rounded'
              />
              <Label htmlFor='edit-available' className='cursor-pointer'>
                Make available for download
              </Label>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedEbook(null);
                  resetForm();
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button onClick={handleEditEbook} disabled={uploading}>
                {uploading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
