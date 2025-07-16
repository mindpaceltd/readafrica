// src/app/admin/subscriptions/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Gem, Check, Trash2, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/database.types";


const initialFormState: Omit<Tables<'subscription_plans'>, 'id' | 'created_at' | 'active'> = {
    name: '',
    price: 0,
    period: 'monthly',
    features: [],
};

export default function SubscriptionPlansPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Tables<'subscription_plans'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [featureText, setFeatureText] = useState('');
  
  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subscription_plans').select('*').order('price');
    if (error) {
        toast({ title: 'Error fetching plans', description: error.message, variant: 'destructive' });
    } else {
        setPlans(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (isEditing && selectedPlanId) {
        const planToEdit = plans.find(p => p.id === selectedPlanId);
        if (planToEdit) {
            setFormData({
                name: planToEdit.name,
                price: planToEdit.price,
                period: planToEdit.period,
                features: planToEdit.features || [],
            });
            setFeatureText((planToEdit.features || []).join('\n'));
        }
    } else {
        setFormData(initialFormState);
        setFeatureText('');
    }
  }, [isEditing, selectedPlanId, plans]);


  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (plan: Tables<'subscription_plans'>) => {
    setIsEditing(true);
    setSelectedPlanId(plan.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedPlanId(null);
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = featureText.split('\n').filter(f => f.trim() !== '');
    
    const planData = {
        ...formData,
        price: Number(formData.price),
        features: featuresArray,
    };

    if (isEditing && selectedPlanId) {
        // Update existing plan
        const { error } = await supabase.from('subscription_plans').update(planData).eq('id', selectedPlanId);
         if (error) {
            toast({ title: "Update failed", description: error.message, variant: 'destructive' });
        } else {
            toast({ title: "Plan updated successfully" });
            fetchPlans();
        }
    } else {
        // Add new plan
        const { error } = await supabase.from('subscription_plans').insert({ ...planData, active: true });
        if (error) {
            toast({ title: "Create failed", description: error.message, variant: 'destructive' });
        } else {
            toast({ title: "Plan created successfully" });
            fetchPlans();
            setFormData(initialFormState);
            setFeatureText('');
        }
    }
    setIsEditing(false);
    setSelectedPlanId(null);
  }

  const handleDelete = async (planId: string) => {
      if (!confirm("Are you sure you want to delete this plan?")) return;
      const { error } = await supabase.from('subscription_plans').delete().eq('id', planId);
      if (error) {
          toast({ title: "Delete failed", description: error.message, variant: 'destructive' });
      } else {
          toast({ title: "Plan deleted" });
          fetchPlans();
      }
  }
  
  const toggleActive = async (plan: Tables<'subscription_plans'>) => {
    const { error } = await supabase.from('subscription_plans').update({ active: !plan.active }).eq('id', plan.id);
    if (error) {
        toast({ title: "Update failed", description: error.message, variant: 'destructive' });
    } else {
        toast({ title: `Plan ${!plan.active ? 'activated' : 'deactivated'}` });
        fetchPlans();
    }
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
                {loading && <p>Loading plans...</p>}
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
                                <Switch checked={plan.active} onCheckedChange={() => toggleActive(plan)} aria-label={`Activate ${plan.name} plan`} />
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(plan)}><Edit className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(plan.id)}><Trash2 className="h-4 w-4"/></Button>
                           </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {plan.features && plan.features.map((feature, fIndex) => (
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
                            <Textarea id="plan-features" placeholder="Enter features, one per line..." rows={4} value={featureText} onChange={(e) => setFeatureText(e.target.value)} required/>
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