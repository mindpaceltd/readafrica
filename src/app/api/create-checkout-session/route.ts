
// src/app/api/create-checkout-session/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId } = await req.json();

  if (!planId) {
    return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
  }

  // 1. Fetch plan details from your database
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: 'Subscription plan not found.' }, { status: 404 });
  }

  // 2. In a real application, you would integrate with a payment gateway like Stripe
  // to create a checkout session. For this demo, we will simulate this process.
  // We'll create a "pending" transaction record in our database.
  
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      subscription_plan_id: plan.id,
      amount: plan.price,
      status: 'completed', // Simulate immediate completion for demo
      transaction_type: 'subscription',
      mpesa_code: `SIM_SUB_${Date.now()}`
    })
    .select()
    .single();

  if (transactionError) {
    console.error('Error creating transaction:', transactionError);
    return NextResponse.json({ error: 'Failed to create transaction.' }, { status: 500 });
  }

  // In a real app, a webhook from the payment provider would update the user's subscription status.
  // Here, we'll just return a success message.
  
  return NextResponse.json({
    success: true,
    message: 'Subscription checkout initiated successfully.',
    redirectUrl: '/my-books', // Redirect user after "successful payment"
  });
}
