"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CategoryForm } from "./category-form";
import { IconPreview } from "@/components/icon-preview";
import type { Category } from "@/types/database";
import { Search } from "lucide-react";

function CategoryList({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Category[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableEmpty colSpan={4}>No categories found.</TableEmpty>
              ) : (
                items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <IconPreview name={c.icon} className="h-4 w-4" style={{ color: c.color ?? "currentColor" }} />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-10 rounded-full border shadow-sm"
                          style={{ backgroundColor: c.color ?? "#71717a" }}
                          title={c.color ?? ""}
                        />
                        <span className="text-[10px] text-muted-foreground font-mono uppercase">
                          {c.color ?? "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <CategoryForm mode="edit" category={c} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoriesClient({ initialCategories = [] }: { initialCategories?: Category[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialCategories.filter((c) => c.name.toLowerCase().includes(q));
  }, [initialCategories, search]);

  const income = filtered.filter((c) => c.type === "income");
  const expenses = filtered.filter((c) => c.type === "expense");

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">How your transactions are classified.</p>
        </div>
        <CategoryForm />
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search category..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryList title="Income" description="Inflow categories." items={income} />
        <CategoryList title="Expenses" description="Outflow categories." items={expenses} />
      </div>
    </div>
  );
}
