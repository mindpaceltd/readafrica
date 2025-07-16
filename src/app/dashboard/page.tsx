
// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardRedirectPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // If no user, send to login
        redirect('/login');
    }
        
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', user.id)
        .single();
    
    if (profile?.is_admin) {
        redirect('/admin');
    }

    if (profile?.role === 'publisher') {
        redirect('/publisher');
    }

    // Default redirect for regular users (readers) or if profile fetch fails
    redirect('/my-books');
}
