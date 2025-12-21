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
import { Plus, FileImage, MoreVertical, Eye, Edit, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPosters,
  addPoster,
  updatePoster,
  deletePoster,
  type Poster,
} from '@/lib/firebase/firestore';
import { uploadImage } from '@/lib/firebase/storage';
import { addSystemLog } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AdminPostersPage() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect page - only admins can access
  useEffect(() => {
    if (
      userData &&
      userData.role !== 'admin' &&
      userData.role !== 'super admin'
    ) {
      toast({
        title: 'Access Denied',
        description: 'You must be an admin to access this page.',
        variant: 'destructive',
      });
      // Redirect to dashboard or home
      window.location.href = '/dashboard';
    }
  }, [userData, toast]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    shopifyLink: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadPosters();
  }, []);

  const loadPosters = async () => {
    try {
      setLoading(true);
      const data = await getPosters();
      setPosters(data);
    } catch (error) {
      console.error('Error loading posters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posters',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPoster = async () => {
    if (!user || !userData) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload posters',
        variant: 'destructive',
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: 'Error',
        description: 'Please upload an image',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Debug: Log user info before upload
      console.log('=== UPLOAD DEBUG INFO ===');
      console.log('User:', user);
      console.log('User UID:', user?.uid);
      console.log('User Data:', userData);
      console.log('User Role:', userData?.role);
      console.log('Is Authenticated:', !!user);

      // Verify role before upload
      if (!userData || userData.role !== 'admin') {
        console.error('❌ ROLE CHECK FAILED - User role is not admin!');
        console.error("Expected: 'admin', Got:", userData?.role);
        toast({
          title: 'Permission Denied',
          description:
            'You must be an admin to upload posters. Current role: ' +
            (userData?.role || 'none'),
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }

      console.log('✅ Role check passed - User is admin');
      console.log('=========================');

      // Upload image to Firebase Storage
      const { url, error: uploadError } = await uploadImage(
        imageFile,
        'posters'
      );
      if (uploadError || !url) {
        toast({
          title: 'Upload Error',
          description: uploadError || 'Failed to upload image',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }

      // Save poster data to Firestore (remove undefined values)
      const posterData: any = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl: url,
        uploadedBy: user.uid,
        uploadedByName: userData.displayName || user.email || 'Unknown',
      };

      // Only include optional fields if they have values
      if (formData.category && formData.category.trim()) {
        posterData.category = formData.category.trim();
      }
      if (formData.shopifyLink && formData.shopifyLink.trim()) {
        posterData.shopifyLink = formData.shopifyLink.trim();
      }

      const posterId = await addPoster(posterData);
      if (posterId) {
        // Log the action
        await addSystemLog(
          'Poster uploaded',
          'poster',
          user.uid,
          userData.displayName || user.email || 'Unknown',
          userData.email || '',
          { posterId, posterName: formData.name }
        );

        toast({
          title: 'Success',
          description: 'Poster uploaded successfully!',
        });
        setAddModalOpen(false);
        resetForm();
        loadPosters();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save poster',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error adding poster:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditPoster = async () => {
    if (!selectedPoster || !user || !userData) return;

    setUploading(true);
    try {
      let imageUrl = selectedPoster.imageUrl;

      // Upload new image if one was selected
      if (imageFile) {
        const { url, error: uploadError } = await uploadImage(
          imageFile,
          'posters'
        );
        if (uploadError || !url) {
          toast({
            title: 'Upload Error',
            description: uploadError || 'Failed to upload image',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        }
        imageUrl = url;
      }

      // Update poster in Firestore (remove undefined values)
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl,
      };

      // Only include optional fields if they have values
      if (formData.category && formData.category.trim()) {
        updateData.category = formData.category.trim();
      } else {
        // If category is empty, we might want to delete it, but for now we'll just not include it
        // Firestore will keep the existing value if we don't include it
      }
      if (formData.shopifyLink && formData.shopifyLink.trim()) {
        updateData.shopifyLink = formData.shopifyLink.trim();
      }

      const success = await updatePoster(selectedPoster.id!, updateData);
      if (success) {
        // Log the action
        await addSystemLog(
          'Poster updated',
          'poster',
          user.uid,
          userData.displayName || user.email || 'Unknown',
          userData.email || '',
          { posterId: selectedPoster.id, posterName: formData.name }
        );

        toast({
          title: 'Success',
          description: 'Poster updated successfully!',
        });
        setEditModalOpen(false);
        setSelectedPoster(null);
        resetForm();
        loadPosters();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update poster',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error updating poster:', error);
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
      name: '',
      description: '',
      category: '',
      tags: '',
      shopifyLink: '',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const openViewModal = (poster: Poster) => {
    setSelectedPoster(poster);
    setViewModalOpen(true);
  };

  const openEditModal = (poster: Poster) => {
    setSelectedPoster(poster);
    setFormData({
      name: poster.name,
      description: poster.description,
      category: poster.category || '',
      tags: poster.tags?.join(', ') || '',
      shopifyLink: poster.shopifyLink || '',
      imageUrl: poster.imageUrl || '',
    });
    setImagePreview(poster.imageUrl || null);
    setImageFile(null);
    setEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className='p-6 flex items-center justify-center min-h-[400px]'>
        <p className='text-muted-foreground'>Loading posters...</p>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='font-bold text-3xl md:text-4xl'>Poster Management</h1>
          <p className='text-muted-foreground'>
            Upload and manage digital posters
          </p>
        </div>
        <Button className='gap-2' onClick={() => setAddModalOpen(true)}>
          <Plus className='h-4 w-4' />
          Upload Poster
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {posters.map((poster) => (
          <Card
            key={poster.id}
            className='border-border bg-card shadow-sm overflow-hidden flex flex-col h-72 p-0'
          >
            {poster.imageUrl ? (
              <div className='w-full h-full relative overflow-hidden'>
                <img
                  src={poster.imageUrl}
                  alt={poster.name}
                  className='w-full h-full object-cover'
                />
                {/* Title overlay with see-through background */}
                <div className='absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm px-3 py-2'>
                  <CardTitle className='text-sm font-semibold leading-tight text-white'>
                    {poster.name}
                  </CardTitle>
                </div>
                {/* Menu button */}
                <div className='absolute top-2 right-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-background/80 backdrop-blur-sm h-8 w-8'
                      >
                        <MoreVertical className='h-3 w-3' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => openViewModal(poster)}>
                        <Eye className='h-4 w-4 mr-2' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(poster)}>
                        <Edit className='h-4 w-4 mr-2' />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className='w-full h-full relative bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center'>
                <FileImage className='h-16 w-16 text-white/50' />
                {/* Title overlay */}
                <div className='absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-2'>
                  <CardTitle className='text-sm font-semibold leading-tight text-white'>
                    {poster.name}
                  </CardTitle>
                </div>
                {/* Menu button */}
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
                      <DropdownMenuItem onClick={() => openViewModal(poster)}>
                        <Eye className='h-4 w-4 mr-2' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(poster)}>
                        <Edit className='h-4 w-4 mr-2' />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add Poster Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Upload New Poster</DialogTitle>
            <DialogDescription>
              Add a new poster to the library
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Poster Name</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='e.g., Celebration Poster'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Describe the poster'
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='category'>Category (optional)</Label>
              <Input
                id='category'
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder='e.g., Graduation, Celebration'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='tags'>Tags (comma-separated, optional)</Label>
              <Input
                id='tags'
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder='Graduation, Celebration, Kente'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='shopifyLink'>Shopify Link (optional)</Label>
              <Input
                id='shopifyLink'
                type='url'
                value={formData.shopifyLink}
                onChange={(e) =>
                  setFormData({ ...formData, shopifyLink: e.target.value })
                }
                placeholder='https://your-shop.myshopify.com/products/...'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='image'>Poster Image</Label>
              <div className='flex flex-col gap-2'>
                <label htmlFor='image-upload' className='cursor-pointer'>
                  <div className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors'>
                    <Upload className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm font-medium'>
                      Click to upload image
                    </span>
                  </div>
                  <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <div className='mt-2'>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='w-full h-48 object-cover rounded-lg border border-border'
                    />
                  </div>
                )}
              </div>
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
                onClick={handleAddPoster}
                disabled={uploading || !imageFile}
              >
                {uploading ? 'Uploading...' : 'Upload Poster'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Poster Details</DialogTitle>
            <DialogDescription>
              Complete information about the poster
            </DialogDescription>
          </DialogHeader>
          {selectedPoster && (
            <div className='space-y-4'>
              {selectedPoster.imageUrl ? (
                <div className='w-full h-64 rounded-lg overflow-hidden'>
                  <img
                    src={selectedPoster.imageUrl}
                    alt={selectedPoster.name}
                    className='w-full h-full object-cover'
                  />
                </div>
              ) : (
                <div className='flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600'>
                  <FileImage className='h-16 w-16 text-white/50' />
                </div>
              )}
              <div className='space-y-3'>
                <div>
                  <Label className='text-sm font-medium'>Name</Label>
                  <p className='text-lg font-semibold mt-1'>
                    {selectedPoster.name}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium'>Description</Label>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {selectedPoster.description}
                  </p>
                </div>
                {selectedPoster.category && (
                  <div>
                    <Label className='text-sm font-medium'>Category</Label>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {selectedPoster.category}
                    </p>
                  </div>
                )}
                {selectedPoster.tags && selectedPoster.tags.length > 0 && (
                  <div>
                    <Label className='text-sm font-medium'>Tags</Label>
                    <div className='flex gap-2 mt-1 flex-wrap'>
                      {selectedPoster.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-1 text-xs rounded-md bg-muted'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedPoster.shopifyLink && (
                  <div>
                    <Label className='text-sm font-medium'>Shopify Link</Label>
                    <a
                      href={selectedPoster.shopifyLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-accent hover:underline mt-1 block'
                    >
                      {selectedPoster.shopifyLink}
                    </a>
                  </div>
                )}
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <Label className='text-sm font-medium'>Downloads</Label>
                    <p className='text-lg font-bold mt-1'>
                      {selectedPoster.downloads || 0}
                    </p>
                  </div>
                  {selectedPoster.uploadedByName && (
                    <div>
                      <Label className='text-sm font-medium'>Uploaded By</Label>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {selectedPoster.uploadedByName}
                      </p>
                    </div>
                  )}
                </div>
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

      {/* Edit Poster Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Poster</DialogTitle>
            <DialogDescription>Update poster information</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-name'>Poster Name</Label>
              <Input
                id='edit-name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-description'>Description</Label>
              <Textarea
                id='edit-description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-category'>Category (optional)</Label>
              <Input
                id='edit-category'
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-tags'>
                Tags (comma-separated, optional)
              </Label>
              <Input
                id='edit-tags'
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-shopifyLink'>Shopify Link (optional)</Label>
              <Input
                id='edit-shopifyLink'
                type='url'
                value={formData.shopifyLink}
                onChange={(e) =>
                  setFormData({ ...formData, shopifyLink: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-image'>Update Poster Image (optional)</Label>
              <div className='flex flex-col gap-2'>
                <label htmlFor='edit-image-upload' className='cursor-pointer'>
                  <div className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors'>
                    <Upload className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm font-medium'>
                      Click to upload new image
                    </span>
                  </div>
                  <input
                    id='edit-image-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <div className='mt-2'>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='w-full h-48 object-cover rounded-lg border border-border'
                    />
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedPoster(null);
                  resetForm();
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button onClick={handleEditPoster} disabled={uploading}>
                {uploading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
