// src/components/book-form.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
  } from "@/components/ui/drawer"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect, useMemo } from "react"
import { UploadCloud, X, Loader2, FileText, Award } from "lucide-react"
import { Switch } from "./ui/switch"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Tables, TablesInsert, TablesUpdate } from "@/lib/database.types"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

type BookWithCategory = Tables<'books'> & {
  categories: { name: string } | null;
};

type BookFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: BookWithCategory | null;
  onFormSubmit: () => void;
}

const initialFormState = {
    title: "",
    author: "",
    description: "",
    price: 0,
    is_subscription: false,
    is_featured: false,
    bestseller: false,
    tags: [] as string[],
    category_id: null as number | null,
    status: 'draft' as 'published' | 'draft',
    seo_title: "",
    seo_description: "",
    thumbnail_url: "",
    full_content_url: "",
    data_ai_hint: "",
    preview_content: ""
}

export function BookForm({ open, onOpenChange, book, onFormSubmit }: BookFormProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const supabase = createClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [currentTag, setCurrentTag] = useState('');
  const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);


  useEffect(() => {
    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    }
    fetchCategories();
  }, [supabase]);


  useEffect(() => {
    if (open && book) {
      setFormData({
        title: book.title,
        author: book.author || "",
        description: book.description || "",
        price: book.price,
        is_subscription: book.is_subscription,
        is_featured: book.is_featured,
        bestseller: book.bestseller || false,
        tags: book.tags || [],
        category_id: book.category_id,
        status: book.status as 'published' | 'draft',
        seo_title: book.seo_title || '',
        seo_description: book.seo_description || '',
        thumbnail_url: book.thumbnail_url || '',
        full_content_url: book.full_content_url || '',
        data_ai_hint: book.data_ai_hint || '',
        preview_content: book.preview_content || ''
      });
    } else {
      setFormData(initialFormState);
    }
     setCoverFile(null);
     setContentFile(null);
  }, [book, open]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
      setFormData(prev => ({...prev, [field]: value}));
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = currentTag.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        handleInputChange('tags', [...formData.tags, newTag]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let thumbnail_url = formData.thumbnail_url || '';
    if (coverFile) {
        const { data, error } = await supabase.storage
            .from('book-covers')
            .upload(`${Date.now()}_${coverFile.name}`, coverFile);
        if (error) {
            toast({title: "Cover Upload Failed", description: error.message, variant: "destructive"});
            setIsSubmitting(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from('book-covers').getPublicUrl(data.path);
        thumbnail_url = publicUrl;
    }
    
    let full_content_url = formData.full_content_url || '';
    if (contentFile) {
        const { data, error } = await supabase.storage
            .from('book-content')
            .upload(`${Date.now()}_${contentFile.name}`, contentFile);
        if (error) {
            toast({title: "Content Upload Failed", description: error.message, variant: "destructive"});
            setIsSubmitting(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from('book-content').getPublicUrl(data.path);
        full_content_url = publicUrl;
    }

    const bookData = {
        ...formData,
        price: Number(formData.price),
        thumbnail_url,
        full_content_url
    }

    if (book) {
        // Update
        const { error } = await supabase.from('books').update(bookData).eq('id', book.id);
        if (error) {
             toast({title: "Update Failed", description: error.message, variant: "destructive"});
        } else {
            toast({title: "Book updated successfully"});
            onFormSubmit();
            onOpenChange(false);
        }
    } else {
        // Create
        const { error } = await supabase.from('books').insert(bookData);
        if (error) {
            toast({title: "Creation Failed", description: error.message, variant: "destructive"});
        } else {
            toast({title: "Book created successfully"});
            onFormSubmit();
            onOpenChange(false);
        }
    }

    setIsSubmitting(false);
  }

  const formContent = (
    <form id="book-form" onSubmit={handleFormSubmit} className="space-y-6 px-1">
      <div className="space-y-2">
        <Label htmlFor="title">Book Title</Label>
        <Input id="title" placeholder="e.g., The Prophetic Voice" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" placeholder="e.g., Dr C Wiseman" value={formData.author} onChange={(e) => handleInputChange('author', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="A short summary of the book" rows={3} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
      </div>
        <div className="space-y-2">
            <Label htmlFor="preview_content">Book Preview</Label>
            <Textarea id="preview_content" placeholder="A short preview of the book's content" rows={5} value={formData.preview_content} onChange={(e) => handleInputChange('preview_content', e.target.value)} />
        </div>
       <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category_id?.toString()} onValueChange={(value) => handleInputChange('category_id', parseInt(value))}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="price">Price (KES)</Label>
            <Input id="price" type="number" placeholder="e.g., 500" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Purchase Type</Label>
          <RadioGroup value={formData.is_subscription ? 'subscription' : 'purchase'} onValueChange={(value) => handleInputChange('is_subscription', value === 'subscription')} className="flex pt-2 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="purchase" id="r1" />
              <Label htmlFor="r1">Purchase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subscription" id="r2" />
              <Label htmlFor="r2">Subscription</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
        <div className="space-y-2">
            <Label>Cover & Content</Label>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    {formData.thumbnail_url && (
                        <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border">
                            <Image src={formData.thumbnail_url} alt="Current cover" fill className="object-cover"/>
                        </div>
                    )}
                    <label htmlFor="cover-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center text-center">
                            <UploadCloud className="w-8 h-8 mb-1 text-muted-foreground"/>
                            <p className="text-sm text-muted-foreground"><span className="font-semibold">{formData.thumbnail_url ? 'Change' : 'Upload'} Cover</span></p>
                            {coverFile && <p className="text-xs text-green-500 mt-1 truncate max-w-full px-2">{coverFile.name}</p>}
                        </div>
                        <Input id="cover-upload" type="file" className="hidden" onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}/>
                    </label>
                </div> 
                <div className="space-y-2">
                     {formData.full_content_url && (
                        <div className="border rounded-md p-2 flex items-center gap-2">
                           <FileText className="h-5 w-5 text-primary"/>
                           <Link href={formData.full_content_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                            View Current Content
                           </Link>
                        </div>
                    )}
                    <label htmlFor="content-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center text-center">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground"/>
                            <p className="text-sm text-muted-foreground"><span className="font-semibold">{formData.full_content_url ? 'Change' : 'Upload'} Content</span></p>
                            <p className="text-xs text-muted-foreground">PDF, EPUB</p>
                            {contentFile && <p className="text-xs text-green-500 mt-1 truncate max-w-full px-2">{contentFile.name}</p>}
                        </div>
                        <Input id="content-upload" type="file" className="hidden" onChange={(e) => setContentFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                </div> 
            </div>
        </div>
      <Separator />
        <div className="space-y-4">
             <h3 className="text-lg font-medium">SEO & Discovery</h3>
             <div className="space-y-2">
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input id="seo-title" placeholder="A catchy title for search engines" value={formData.seo_title} onChange={(e) => handleInputChange('seo_title', e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea id="seo-description" placeholder="A brief description for search results" rows={2} value={formData.seo_description} onChange={(e) => handleInputChange('seo_description', e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    <Input 
                        id="tags" 
                        placeholder="Add tags..." 
                        className="flex-1 border-none shadow-none focus-visible:ring-0 h-auto p-0"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                    />
                </div>
                <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag.</p>
             </div>
        </div>

       <Separator />
        <div className="space-y-4">
             <h3 className="text-lg font-medium">Status & Visibility</h3>
            <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                    <h3 className="font-medium">Publish Status</h3>
                    <p className="text-sm text-muted-foreground">
                        Set whether the book is a draft or publicly available.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="status-switch" className={formData.status === 'draft' ? 'text-muted-foreground' : ''}>Draft</Label>
                    <Switch id="status-switch" checked={formData.status === 'published'} onCheckedChange={(checked) => handleInputChange('status', checked ? 'published' : 'draft')} aria-label="Publish status" />
                     <Label htmlFor="status-switch" className={formData.status === 'published' ? '' : 'text-muted-foreground'}>Published</Label>
                </div>
            </div>
           <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                    <h3 className="font-medium">Featured Book</h3>
                    <p className="text-sm text-muted-foreground">
                        Display this book prominently on the home page.
                    </p>
                </div>
                <Switch checked={formData.is_featured} onCheckedChange={(value) => handleInputChange('is_featured', value)} aria-label="Featured book" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                    <h3 className="font-medium">Mark as Bestseller</h3>
                    <p className="text-sm text-muted-foreground">
                        Show a bestseller badge on the book.
                    </p>
                </div>
                <Switch checked={formData.bestseller} onCheckedChange={(value) => handleInputChange('bestseller', value)} aria-label="Bestseller book" />
            </div>
        </div>
    </form>
  );

  const title = book ? "Edit Book" : "Add New Book";
  const description = "Fill in the details below. Click save when you're done.";
  const submitButtonText = book ? "Save Changes" : "Create Book";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] overflow-y-auto">
            <div className="px-6 pb-6">
              {formContent}
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" form="book-form" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto max-h-[75vh]">
            <div className="p-4">{formContent}</div>
        </ScrollArea>
        <DrawerFooter className="pt-2 border-t">
            <Button type="submit" form="book-form" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitButtonText}
            </Button>
            <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
            </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
