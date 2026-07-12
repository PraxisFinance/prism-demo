import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, delta, className }: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex h-full flex-col gap-2">
        <span className="shrink-0 text-[1.1375rem] text-black">{label}</span>
        <div className="flex flex-1 gap-2">
          <span className="font-heading text-[3.25rem] font-medium text-foreground">
            {value}
          </span>
          {delta}
        </div>
      </CardContent>
    </Card>
  );
}
