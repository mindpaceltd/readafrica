// src/app/admin/books/categories/page.tsx
'use client'

import { useState } from "react";
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

const initialCategories = [
    { id: 1, name: "Spiritual Growth", bookCount: 1 },
    { id: 2, name: "Prophetic Teaching", bookCount: 2 },
    { id: 3, name: "Financial Freedom", bookCount: 0 },
    { id: 4, name: "Personal Development", bookCount: 0 },
];

export default function BookCategoriesPage() {
    const [categories, setCategories] = useState(initialCategories);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            const newCategory = {
                id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
                name: newCategoryName,
                bookCount: 0,
            };
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
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
                                        <TableHead>Book Count</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>{category.bookCount}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
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
                                <Button type="submit" className="w-full">
                                    <PlusCircle className="mr-2" />
                                    Add Category
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
