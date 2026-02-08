import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all favorite cities
export async function GET() {
  try {
    const favorites = await prisma.favorites.findMany({
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Add a city to favorites
export async function POST(request: NextRequest) {
  try {
    const { city, notes } = await request.json();

    if (!city || typeof city !== 'string') {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await prisma.favorites.findUnique({
      where: { city: city.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'City already in favorites' },
        { status: 409 }
      );
    }

    const favorite = await prisma.favorites.create({
      data: {
        city: city.trim(),
        notes: notes || null,
      },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a city from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    await prisma.favorites.delete({
      where: { city },
    });

    return NextResponse.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
