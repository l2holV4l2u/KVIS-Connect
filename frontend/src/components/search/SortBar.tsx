"use client";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchParams } from "@/lib/types";

interface Props {
  sort: SearchParams["sort"];
  order: SearchParams["order"];
  onSort: (s: SearchParams["sort"]) => void;
  onOrder: (o: SearchParams["order"]) => void;
}

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "kvis_year", label: "Class Year" },
  { value: "created_at", label: "Joined" },
] as const;

export function SortBar({ sort, order, onSort, onOrder }: Props) {
  const toggle = () => onOrder(order === "asc" ? "desc" : "asc");
  const Icon = order === "asc" ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline">Sort:</span>
      <Select value={sort} onValueChange={(v) => onSort(v as SearchParams["sort"])}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggle} title="Toggle order">
        <Icon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
