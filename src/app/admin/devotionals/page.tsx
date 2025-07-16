// src/app/admin/devotionals/page.tsx
'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Send, Trash2, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/database.types";
import { Textarea } from "@/components/ui/textarea";

type Devotional = Tables<'devotionals'>;

export default function ManageDevotionalsPage() {
  const supabase = createClient();
  const { toast } = useToast();

  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDevotional, setEditingDevotional] = useState<Devotional | null>(null);

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
    setEditingDevotional(devotional);
    setMessage(devotional.message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingDevotional(null);
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
    if (editingDevotional) {
        const { error: updateError } = await supabase.from('devotionals').update(devotionalData).eq('id', editingDevotional.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase.from('devotionals').insert(devotionalData);
        error = insertError;
    }


    if (error) {
        toast({ title: "Error saving devotional", description: error.message, variant: "destructive" });
    } else {
        toast({ title: `Devotional ${editingDevotional ? 'updated' : 'created'} successfully!` });
        setMessage('');
        setEditingDevotional(null);
        fetchDevotionals();
    }

    setIsSubmitting(false);
  }

  const drafts = devotionals.filter(d => !d.sent_at);
  const sentDevotionals = devotionals.filter(d => d.sent_at);

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Manage Devotionals</h1>
            <p className="text-muted-foreground">Create, schedule, and view devotionals.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{editingDevotional ? 'Edit Devotional' : 'Create New Devotional'}</CardTitle>
                        <CardDescription>
                            {editingDevotional ? 'Update the message below.' : 'Write your message below. It can be sent immediately or saved as a draft.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                           <Textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your uplifting message here..."
                                rows={8}
                           />
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingDevotional && <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>}
                            <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
                                <Save className="mr-2" />
                                {editingDevotional ? 'Save Changes' : 'Save as Draft'}
                            </Button>
                            <Button onClick={() => handleSubmit('sent')} disabled={isSubmitting}>
                                <Send className="mr-2" />
                                {editingDevotional ? 'Update & Send' : 'Send Now'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Drafts ({drafts.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-64 overflow-y-auto">
                        {loading && <p>Loading drafts...</p>}
                        {!loading && drafts.length === 0 && <p className="text-sm text-muted-foreground">No drafts.</p>}
                        {drafts.map((devotional) => (
                            <div key={devotional.id} className="text-sm border-b pb-2 last:border-b-0">
                                <p 
                                    className="text-muted-foreground line-clamp-2"
                                >{devotional.message.substring(0, 100) + '...'}</p>
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
                        <CardTitle>Sent Devotionals ({sentDevotionals.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                        {loading && <p>Loading sent devotionals...</p>}
                        {!loading && sentDevotionals.length === 0 && <p className="text-sm text-muted-foreground">No devotionals sent yet.</p>}
                         {sentDevotionals.map((devotional) => (
                            <div key={devotional.id} className="text-sm border-b pb-2 last:border-b-0">
                                <p className="text-xs text-muted-foreground">{devotional.sent_at ? new Date(devotional.sent_at).toLocaleString() : ''}</p>
                                <p 
                                    className="text-muted-foreground line-clamp-3 mt-1"
                                >{devotional.message}</p>
                            </div>
                         ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
