"use client";

import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SpeedIndicatorProps {
  startTime: number;
  endTime: number;
}

export function SpeedIndicator({ startTime, endTime }: SpeedIndicatorProps) {
  const duration = (endTime - startTime) / 1000;
  
  return (
    <div className="flex items-center gap-2 text-green-600">
      <Zap className="w-4 h-4" />
      <span className="text-sm font-medium">
        Generated in {duration.toFixed(1)}s
      </span>
      {duration < 5 && (
        <Badge variant="success">Lightning Fast ⚡</Badge>
      )}
    </div>
  );
}