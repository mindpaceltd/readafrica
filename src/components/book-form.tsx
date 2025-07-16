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
import { Book, books } from "@/lib/data"
import { useState, useEffect, useMemo } from "react"
import { UploadCloud, X } from "lucide-react"
import { Switch } from "./ui/switch"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type BookFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
}

const initialFormState = {
    title: "",
    description: "",
    price: "",
    purchaseType: "purchase",
    isFeatured: false,
    tags: [] as string[],
    category: "",
    status: 'draft' as 'published' | 'draft',
    seoTitle: "",
    seoDescription: "",
}

export function BookForm({ open, onOpenChange, book }: BookFormProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [formData, setFormData] = useState(initialFormState);
  const [currentTag, setCurrentTag] = useState('');

  const availableCategories = useMemo(() => {
    const categories = new Set(books.map(b => b.category).filter(Boolean));
    return Array.from(categories);
  }, []);

  useEffect(() => {
    if (open && book) {
      setFormData({
        title: book.title,
        description: book.description || "",
        price: book.price.replace('KES ', ''),
        purchaseType: book.isSubscription ? 'subscription' : 'purchase',
        isFeatured: book.isFeatured || false,
        tags: book.tags || [],
        category: book.category || "",
        status: book.status || 'draft',
        seoTitle: book.seoTitle || '',
        seoDescription: book.seoDescription || '',
      });
    } else {
      // Reset form when adding a new book, or when closing the dialog
      setFormData(initialFormState);
    }
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


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle book creation/update logic here
    console.log("Submitting book:", formData);
    onOpenChange(false);
  }

  const formContent = (
    <form id="book-form" onSubmit={handleFormSubmit} className="space-y-6 px-1">
      <div className="space-y-2">
        <Label htmlFor="title">Book Title</Label>
        <Input id="title" placeholder="e.g., The Prophetic Voice" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="A short summary of the book" rows={3} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
      </div>
       <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
          <RadioGroup value={formData.purchaseType} onValueChange={(value) => handleInputChange('purchaseType', value)} className="flex pt-2 gap-4">
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
            <div className="flex items-center justify-center w-full">
                <label htmlFor="cover-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center text-center">
                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Upload Cover</span></p>
                        <p className="text-xs text-muted-foreground">PNG, JPG</p>
                    </div>
                    <Input id="cover-upload" type="file" className="hidden" />
                </label>
            </div> 
            <div className="flex items-center justify-center w-full">
                <label htmlFor="content-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center text-center">
                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Upload Content</span></p>
                        <p className="text-xs text-muted-foreground">PDF, EPUB</p>
                    </div>
                    <Input id="content-upload" type="file" className="hidden" />
                </label>
            </div> 
        </div>
      </div>
      <Separator />
        <div className="space-y-4">
             <h3 className="text-lg font-medium">SEO & Discovery</h3>
             <div className="space-y-2">
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input id="seo-title" placeholder="A catchy title for search engines" value={formData.seoTitle} onChange={(e) => handleInputChange('seoTitle', e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea id="seo-description" placeholder="A brief description for search results" rows={2} value={formData.seoDescription} onChange={(e) => handleInputChange('seoDescription', e.target.value)} />
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
                <Switch checked={formData.isFeatured} onCheckedChange={(value) => handleInputChange('isFeatured', value)} aria-label="Featured book" />
            </div>
        </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
            <DialogDescription>
              Fill in the details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] overflow-y-auto">
            <div className="px-6 pb-6">
              {formContent}
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" form="book-form">{book ? "Save Changes" : "Create Book"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{book ? "Edit Book" : "Add New Book"}</DrawerTitle>
          <DrawerDescription>
            Fill in the details below. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto max-h-[75vh]">
            <div className="p-4">{formContent}</div>
        </ScrollArea>
        <DrawerFooter className="pt-2 border-t">
            <Button type="submit" form="book-form">{book ? "Save Changes" : "Create Book"}</Button>
            <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
            </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
