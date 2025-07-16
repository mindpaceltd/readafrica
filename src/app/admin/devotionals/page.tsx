// src/app/admin/devotionals/page.tsx
'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MessageSquare, Calendar, Send, Save, Trash2, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/database.types";
import { RichTextEditor } from "@/components/rich-text-editor";

type Devotional = Tables<'devotionals'>;

export default function ManageDevotionalsPage() {
  const supabase = createClient();
  const { toast } = useToast();

  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState<Devotional | null>(null);

  const [message, setMessage] = useState('');
  
  const fetchDevotionals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error fetching devotionals", description: error.message, variant: "destructive" });
    } else {
      setDevotionals(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const handleEditClick = (devotional: Devotional) => {
    setIsEditing(devotional);
    setMessage(devotional.message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setIsEditing(null);
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this devotional?")) return;
    
    const { error } = await supabase.from('devotionals').delete().eq('id', id);
    if (error) {
        toast({ title: "Error deleting devotional", description: error.message, variant: 'destructive' });
    } else {
        toast({ title: "Devotional deleted" });
        fetchDevotionals();
    }
  };

  const handleSubmit = async (status: 'sent' | 'draft') => {
    if (!message.trim()) {
        toast({ title: "Message cannot be empty", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();

    const devotionalData = {
        message: message,
        author_id: user?.id,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
    };

    let error;
    if (isEditing) {
        const { error: updateError } = await supabase.from('devotionals').update(devotionalData).eq('id', isEditing.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase.from('devotionals').insert(devotionalData);
        error = insertError;
    }


    if (error) {
        toast({ title: "Error saving devotional", description: error.message, variant: "destructive" });
    } else {
        toast({ title: `Devotional ${isEditing ? 'updated' : 'created'} successfully!` });
        setMessage('');
        setIsEditing(null);
        fetchDevotionals();
    }

    setIsSubmitting(false);
  }

  const recentDevotionals = devotionals.filter(d => d.sent_at).slice(0, 5);
  const draftedDevotionals = devotionals.filter(d => !d.sent_at);

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Manage Devotionals</h1>
            <p className="text-muted-foreground">Create, schedule, and view devotionals.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Devotional' : 'Create New Devotional'}</CardTitle>
                        <CardDescription>
                            {isEditing ? 'Update the message below.' : 'Write your message below. It can be sent immediately or saved as a draft.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                           <RichTextEditor value={message} onChange={setMessage} />
                        </div>
                        <div className="flex justify-end gap-2">
                            {isEditing && <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>}
                            <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
                                <Save className="mr-2" />
                                {isEditing ? 'Save Changes' : 'Save as Draft'}
                            </Button>
                            <Button onClick={() => handleSubmit('sent')} disabled={isSubmitting}>
                                <Send className="mr-2" />
                                {isEditing ? 'Update & Send' : 'Send Now'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Drafts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading && <p>Loading drafts...</p>}
                        {!loading && draftedDevotionals.length === 0 && <p className="text-sm text-muted-foreground">No drafts.</p>}
                        {draftedDevotionals.map((devotional) => (
                            <div key={devotional.id} className="text-sm border-b pb-2 last:border-b-0">
                                <div 
                                    className="text-muted-foreground line-clamp-2" 
                                    dangerouslySetInnerHTML={{ __html: devotional.message.replace(/<[^>]+>/g, ' ').substring(0, 100) + '...' }} 
                                />
                                <div className="flex gap-2 mt-2">
                                     <Button size="sm" variant="outline" onClick={() => handleEditClick(devotional)}><Edit className="mr-1 h-3 w-3" /> Edit</Button>
                                     <Button size="sm" variant="destructive" onClick={() => handleDelete(devotional.id)}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Devotionals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading && <p>Loading recent...</p>}
                        {!loading && recentDevotionals.length === 0 && <p className="text-sm text-muted-foreground">No recent devotionals sent.</p>}
                         {recentDevotionals.map((devotional) => (
                            <div key={devotional.id} className="flex items-start gap-4 text-sm">
                                <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0 text-primary"/>
                                <div 
                                    className="text-muted-foreground line-clamp-3" 
                                    dangerouslySetInnerHTML={{ __html: devotional.message }} 
                                />
                            </div>
                         ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
