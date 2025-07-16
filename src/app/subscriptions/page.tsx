
// src/app/subscriptions/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Gem } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Tables } from "@/lib/database.types";


async function getSubscriptionPlans() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true });

    if (error) {
        console.error("Error fetching subscription plans:", error);
        return [];
    }
    return data;
}

const faqs = [
    {
        question: "Can I cancel anytime?",
        answer: "Yes, you can cancel your subscription at any time through your account settings. You'll continue to have access until your current billing period ends."
    },
    {
        question: "What devices are supported?",
        answer: "Our books work on all modern devices including smartphones, tablets, computers, and dedicated e-readers that support standard formats."
    },
    {
        question: "Do you offer refunds?",
        answer: "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, contact us within 7 days for a full refund."
    },
    {
        question: "How many books are included?",
        answer: "All active plans include unlimited access to our entire library, with new books added regularly."
    }
]

export default async function SubscriptionsPage() {
    const plans = await getSubscriptionPlans();

  return (
    <div className="min-h-screen bg-background text-foreground">
        <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
            <section id="plans" className="text-center mb-16">
                 <h1 className="text-4xl md:text-5xl font-headline text-primary mb-4">
                    Subscription Plans
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Unlock unlimited access to our entire library with a subscription plan that fits your reading needs.
                </p>
            </section>

            {plans.length > 0 ? (
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-start">
                    {plans.map((plan, index) => (
                        <Card key={plan.id} className={`flex flex-col h-full ${index === 1 ? 'border-primary shadow-lg' : ''}`}>
                             {index === 1 && (
                                <div className="text-center py-1 px-4 bg-primary text-primary-foreground text-sm font-bold rounded-t-lg">
                                    Best Value
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                    <Gem className="text-accent" />
                                    <span>{plan.name}</span>
                                </CardTitle>
                                <div className="flex items-baseline gap-2">
                                     <span className="text-4xl font-bold text-primary">KES {plan.price}</span>
                                     <span className="text-muted-foreground">/{plan.period}</span>
                                </div>
                                <CardDescription>{plan.features ? plan.features[0] : '...'}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features?.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" asChild>
                                    <Link href="/login">Subscribe to {plan.name}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </section>
            ) : (
                <p className="text-center text-muted-foreground my-16">No subscription plans are available at this time. Please check back later.</p>
            )}

            <section id="faq" className="max-w-3xl mx-auto mb-16">
                 <h2 className="text-3xl font-headline text-primary text-center mb-8">
                    Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                         <AccordionItem key={i} value={`item-${i+1}`}>
                            <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                               {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
            
            <section className="text-center">
                 <h2 className="text-3xl font-headline text-primary">
                    Ready to Start Reading?
                </h2>
                <p className="text-muted-foreground mt-2 mb-6">
                    Join thousands of readers who have unlimited access to prophetic literature.
                </p>
                <Button size="lg" asChild>
                    <Link href="/signup">Sign Up to Get Started</Link>
                </Button>
            </section>
        </main>
    </div>
  )
}
