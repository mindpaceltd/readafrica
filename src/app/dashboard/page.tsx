// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardRedirectPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
        
        if (profile?.is_admin) {
            redirect('/admin');
        }
    }

    // Default redirect for regular users or if profile fetch fails
    redirect('/my-books');
}
