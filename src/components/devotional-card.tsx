"use client";

import { useState, useEffect } from "react";
import { getDailyDevotional } from "@/app/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Hand, Shield, Star } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const moods = [
    { name: "Faith", icon: Hand },
    { name: "Anxiety", icon: Shield },
    { name: "Breakthrough", icon: Star },
]

export function DevotionalCard() {
  const [devotional, setDevotional] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState("Faith");

  const fetchDevotional = async (mood: string) => {
    setLoading(true);
    setError("");
    setSelectedMood(mood);
    try {
      const result = await getDailyDevotional({
        mood: mood,
      });
      setDevotional(result.message);
    } catch (err) {
      setError("Failed to load devotional. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotional(selectedMood);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground shadow-xl">
      <CardHeader className="flex flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0" />
          <CardTitle className="font-headline text-2xl md:text-3xl">
            Daily Prophetic Word
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchDevotional(selectedMood)}
          disabled={loading}
          className="hover:bg-white/20 flex-shrink-0"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/30 rounded-md" />
            <Skeleton className="h-4 w-full bg-white/30 rounded-md" />
            <Skeleton className="h-4 w-3/4 bg-white/30 rounded-md" />
          </div>
        ) : error ? (
          <p className="text-red-300">{error}</p>
        ) : (
          <CardDescription className="text-base md:text-lg text-primary-foreground/90 leading-relaxed">
            {devotional}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
          <p className="text-sm font-medium text-primary-foreground/80">Need a specific word? Select a mood:</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
                <Button key={mood.name} variant="secondary" onClick={() => fetchDevotional(mood.name)} disabled={loading} className={cn(selectedMood === mood.name ? "bg-white/30" : "bg-white/10", "text-primary-foreground hover:bg-white/30")}>
                    <mood.icon className="mr-2 h-4 w-4" />
                    {mood.name}
                </Button>
            ))}
          </div>
      </CardFooter>
    </Card>
  );
}
