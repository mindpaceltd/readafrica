// src/app/cart/page.tsx
'use client'

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart, ArrowLeft, CreditCard } from "lucide-react";

export default function CartPage() {
    const { items, removeItem, getTotalPrice } = useCart();

    return (
        <div className="min-h-screen bg-muted/40 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/books">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Continue Shopping
                    </Link>
                </Button>
                
                <h1 className="text-3xl font-headline text-primary mb-8">My Cart</h1>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2">
                        {items.length === 0 ? (
                            <Card className="text-center py-16 px-4">
                                <CardContent>
                                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                                    <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
                                    <Button asChild>
                                        <Link href="/books">Explore Books</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-0">
                                    <ul className="divide-y divide-border">
                                        {items.map(item => (
                                            <li key={item.id} className="flex items-center gap-4 p-4">
                                                <Image 
                                                    src={item.thumbnail_url || 'https://placehold.co/100x120.png'}
                                                    alt={item.title}
                                                    width={80}
                                                    height={100}
                                                    className="rounded-md object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">by {item.author}</p>
                                                    <p className="text-sm text-primary font-bold mt-1">KES {item.price}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    
                    {items.length > 0 && (
                        <div className="md:col-span-1 sticky top-24">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>KES {getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>KES {getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Proceed to Checkout
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
