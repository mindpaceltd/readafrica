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
import { Book } from "@/lib/data"
import { useState } from "react"
import { UploadCloud } from "lucide-react"

type BookFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
}

export function BookForm({ open, onOpenChange, book }: BookFormProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [title, setTitle] = useState(book?.title || "");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle book creation/update logic here
    console.log("Submitting book:", { title });
    onOpenChange(false);
  }

  const formContent = (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Book Title</Label>
        <Input id="title" placeholder="e.g., The Prophetic Voice" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="A short summary of the book" rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="price">Price (KES)</Label>
            <Input id="price" type="number" placeholder="e.g., 500" />
        </div>
         <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <p className="text-sm text-muted-foreground pt-2">Draft</p>
        </div>
      </div>
       <div className="space-y-2">
        <Label>Book Cover</Label>
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground"/>
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 800x400px)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" />
            </label>
        </div> 
      </div>
       <div className="space-y-2">
        <Label>Book File</Label>
        <Input type="file" />
        <p className="text-xs text-muted-foreground">Upload the book in PDF, EPUB, or HTML format.</p>
       </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
            <DialogDescription>
              Fill in the details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {formContent}
          <DialogFooter>
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
        <div className="p-4">{formContent}</div>
        <DrawerFooter className="pt-2">
            <Button type="submit" form="book-form">{book ? "Save Changes" : "Create Book"}</Button>
            <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
            </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
