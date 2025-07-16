// src/app/devotionals/page.tsx
import { DevotionalCard } from "@/components/devotional-card";

export default function DevotionalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8">
          Daily Devotionals
        </h1>
        <div className="space-y-8">
            <DevotionalCard />
            {/* We can add more devotional cards here in the future */}
        </div>
      </main>
    </div>
  );
}