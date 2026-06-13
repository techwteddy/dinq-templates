// src/app/api/recipes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRecipe, listRecipes } from '@/db/queries/recipes';

export async function GET() {
  try {
    const recipes = await listRecipes();
    return NextResponse.json({ recipes });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { name: string; servings: number; notes?: string; ingredients: { food_id: string; grams: number }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.name || !body.ingredients?.length) {
    return NextResponse.json({ error: 'name and ingredients are required' }, { status: 400 });
  }

  try {
    const recipe = await createRecipe(
      { name: body.name, servings: body.servings ?? 1, notes: body.notes },
      body.ingredients
    );
    return NextResponse.json(recipe, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
