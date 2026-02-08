import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch recent search history (last 10 searches)
export async function GET() {
  try {
    const history = await prisma.searchHistory.findMany({
      orderBy: { searchedAt: 'desc' },
      take: 10,
    });

    // Get unique cities (remove duplicates manually)
    const uniqueCities = new Map();
    history.forEach(item => {
      if (!uniqueCities.has(item.city)) {
        uniqueCities.set(item.city, item);
      }
    });

    const uniqueHistory = Array.from(uniqueCities.values());

    return NextResponse.json({ history: uniqueHistory });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search history', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Add a new search to history
export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json();

    if (!city || typeof city !== 'string') {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    const searchHistory = await prisma.searchHistory.create({
      data: {
        city: city.trim(),
      },
    });

    return NextResponse.json({ searchHistory }, { status: 201 });
  } catch (error) {
    console.error('Error saving search history:', error);
    return NextResponse.json(
      { error: 'Failed to save search history' },
      { status: 500 }
    );
  }
}

// DELETE: Clear all search history
export async function DELETE() {
  try {
    await prisma.searchHistory.deleteMany({});
    return NextResponse.json({ message: 'Search history cleared' });
  } catch (error) {
    console.error('Error clearing search history:', error);
    return NextResponse.json(
      { error: 'Failed to clear search history' },
      { status: 500 }
    );
  }
}
