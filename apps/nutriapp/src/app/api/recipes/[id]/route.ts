// src/app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRecipe, updateRecipe, deleteRecipe } from '@/db/queries/recipes';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await getRecipe(params.id);
    if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(recipe);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  try {
    const updated = await updateRecipe(params.id, body, body.ingredients);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteRecipe(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
