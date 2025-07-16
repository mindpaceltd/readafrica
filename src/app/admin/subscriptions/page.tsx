// src/app/admin/subscriptions/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Gem, Check, Trash2, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useId } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type Plan = {
    id: string;
    name: string;
    price: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    features: string[];
    active: boolean;
};

const initialPlans: Plan[] = [
    {
        id: "plan-1",
        name: "Bronze Tier",
        price: "500",
        period: "monthly",
        features: ["Access to 5 subscription books per month", "Standard support"],
        active: true
    },
    {
        id: "plan-2",
        name: "Silver Tier",
        price: "1000",
        period: "monthly",
        features: ["Access to 15 subscription books per month", "Priority support", "Early access to new releases"],
        active: true
    },
    {
        id: "plan-3",
        name: "Gold Tier",
        price: "2000",
        period: "monthly",
        features: ["Unlimited access to all subscription books", "24/7 priority support", "Exclusive content and webinars"],
        active: false
    },
]

const initialFormState: Omit<Plan, 'id' | 'active' | 'features'> & { features: string } = {
    name: '',
    price: '',
    period: 'monthly',
    features: '',
};

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const idPrefix = useId();
  let nextId = plans.length + 1;

  useEffect(() => {
    if (isEditing && selectedPlanId) {
        const planToEdit = plans.find(p => p.id === selectedPlanId);
        if (planToEdit) {
            setFormData({
                name: planToEdit.name,
                price: planToEdit.price,
                period: planToEdit.period,
                features: planToEdit.features.join('\n'),
            });
        }
    } else {
        setFormData(initialFormState);
    }
  }, [isEditing, selectedPlanId, plans]);


  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (plan: Plan) => {
    setIsEditing(true);
    setSelectedPlanId(plan.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedPlanId(null);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = formData.features.split('\n').filter(f => f.trim() !== '');
    if (isEditing && selectedPlanId) {
        // Update existing plan
        setPlans(plans.map(p => p.id === selectedPlanId ? { ...p, ...formData, id: p.id, features: featuresArray, price: formData.price, active: p.active } : p));
    } else {
        // Add new plan
        const newPlan: Plan = {
            id: `${idPrefix}-${nextId++}`,
            ...formData,
            features: featuresArray,
            price: formData.price,
            active: true, // New plans are active by default
        };
        setPlans([...plans, newPlan]);
    }
    setIsEditing(false);
    setSelectedPlanId(null);
  }


  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
                {plans.map((plan) => (
                    <Card key={plan.id}>
                        <CardHeader className="flex flex-row justify-between items-start">
                           <div>
                             <CardTitle className="flex items-center gap-2">
                                <Gem className="h-6 w-6 text-yellow-500" />
                                <span>{plan.name}</span>
                             </CardTitle>
                             <CardDescription>KES {plan.price}/{plan.period}</CardDescription>
                           </div>
                           <div className="flex items-center gap-2">
                                <Switch checked={plan.active} onCheckedChange={(checked) => setPlans(plans.map(p => p.id === plan.id ? {...p, active: checked} : p))} aria-label={`Activate ${plan.name} plan`} />
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(plan)}><Edit className="h-4 w-4"/></Button>
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
                    <CardTitle>{isEditing ? "Edit Plan" : "Create New Plan"}</CardTitle>
                    <CardDescription>{isEditing ? "Modify the details of the existing plan." : "Add a new subscription tier."}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="plan-name">Plan Name</Label>
                            <Input id="plan-name" placeholder="e.g., Premium Tier" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="plan-price">Price (KES)</Label>
                                <Input id="plan-price" type="number" placeholder="e.g., 1500" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan-period">Billing Period</Label>
                                <Select value={formData.period} onValueChange={(value) => handleInputChange('period', value)}>
                                    <SelectTrigger id="plan-period">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="plan-features">Features</Label>
                            <Textarea id="plan-features" placeholder="Enter features, one per line..." rows={4} value={formData.features} onChange={(e) => handleInputChange('features', e.target.value)} required/>
                        </div>
                        <div className="flex flex-col gap-2">
                             <Button type="submit" className="w-full">
                                {isEditing ? "Save Changes" : <><PlusCircle className="mr-2" />Add Plan</>}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
