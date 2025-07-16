// src/app/admin/devotionals/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MessageSquare, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ManageDevotionalsPage() {
  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-headline text-primary">Manage Devotionals</h1>
                <p className="text-muted-foreground">Create, schedule, and view devotionals.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2" /> New Devotional
            </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Devotional</CardTitle>
                        <CardDescription>Write your message below. It can be sent immediately or scheduled for later.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="devotional-message">Message</Label>
                            <Textarea id="devotional-message" placeholder="Type your uplifting message here..." rows={8}/>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline">Schedule</Button>
                            <Button>Send Now</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Scheduled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <Calendar className="h-8 w-8"/>
                            <div>
                                <p className="font-bold">Tomorrow, 9:00 AM</p>
                                <p className="text-sm line-clamp-2">"A word of encouragement for the new day..."</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Devotionals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-start gap-4 text-sm">
                            <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0 text-primary"/>
                            <p className="text-muted-foreground">"Your breakthrough is closer than you think. Hold on to faith..."</p>
                         </div>
                         <div className="flex items-start gap-4 text-sm">
                            <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0 text-primary"/>
                            <p className="text-muted-foreground">"Do not be afraid, for I am with you. Do not be dismayed, for I am your God."</p>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}