// src/app/admin/subscriptions/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Gem, Check, Trash2, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const plans = [
    {
        name: "Bronze Tier",
        price: "500",
        features: ["Access to 5 subscription books per month", "Standard support"],
        active: true
    },
    {
        name: "Silver Tier",
        price: "1000",
        features: ["Access to 15 subscription books per month", "Priority support", "Early access to new releases"],
        active: true
    },
    {
        name: "Gold Tier",
        price: "2000",
        features: ["Unlimited access to all subscription books", "24/7 priority support", "Exclusive content and webinars"],
        active: false
    },
]

export default function SubscriptionPlansPage() {
  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-headline text-primary">Subscription Plans</h1>
                <p className="text-muted-foreground">Create and manage subscription tiers for your users.</p>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 grid gap-6">
                {plans.map((plan, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row justify-between items-start">
                           <div>
                             <CardTitle className="flex items-center gap-2">
                                <Gem className="h-6 w-6 text-yellow-500" />
                                <span>{plan.name}</span>
                             </CardTitle>
                             <CardDescription>KES {plan.price}/month</CardDescription>
                           </div>
                           <div className="flex items-center gap-2">
                                <Switch checked={plan.active} aria-label={`Activate ${plan.name} plan`} />
                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                           </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="md:col-span-1 sticky top-24">
                <CardHeader>
                    <CardTitle>Create New Plan</CardTitle>
                    <CardDescription>Add a new subscription tier.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="plan-name">Plan Name</Label>
                            <Input id="plan-name" placeholder="e.g., Premium Tier" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="plan-price">Monthly Price (KES)</Label>
                            <Input id="plan-price" type="number" placeholder="e.g., 1500" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="plan-features">Features</Label>
                            <Textarea id="plan-features" placeholder="Enter features, one per line..." rows={4} />
                        </div>
                        <Button className="w-full">
                            <PlusCircle className="mr-2" />
                            Add Plan
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
