"use client";

import { useState, useEffect } from "react";
import { getDailyDevotional } from "@/app/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function DevotionalCard() {
  const [devotional, setDevotional] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDevotional = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getDailyDevotional({
        context: "A message of hope and encouragement.",
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
    fetchDevotional();
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
          onClick={fetchDevotional}
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
    </Card>
  );
}
