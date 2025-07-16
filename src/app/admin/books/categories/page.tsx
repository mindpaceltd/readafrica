// src/app/admin/books/categories/page.tsx
'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/database.types";

export default function BookCategoriesPage() {
    const supabase = createClient();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) {
            toast({ title: "Error fetching categories", description: error.message, variant: 'destructive' });
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            setIsSubmitting(true);
            const { error } = await supabase.from('categories').insert({ name: newCategoryName });
            if (error) {
                toast({ title: "Error adding category", description: error.message, variant: 'destructive' });
            } else {
                toast({ title: "Category added successfully" });
                setNewCategoryName('');
                fetchCategories();
            }
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            toast({ title: "Error deleting category", description: error.message, variant: 'destructive' });
        } else {
            toast({ title: "Category deleted successfully" });
            fetchCategories();
        }
    };


    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-headline text-primary">Book Categories</h1>
                <p className="text-muted-foreground">Manage the categories for your books.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                    <Card>
                         <CardHeader>
                            <CardTitle>Existing Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category Name</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
                                    {!loading && categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(category.id)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Category</CardTitle>
                            <CardDescription>Create a new category for your books.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddCategory} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category-name">Category Name</Label>
                                    <Input 
                                        id="category-name" 
                                        placeholder="e.g., Faith"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        required 
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    <PlusCircle className="mr-2" />
                                    {isSubmitting ? "Adding..." : "Add Category"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}