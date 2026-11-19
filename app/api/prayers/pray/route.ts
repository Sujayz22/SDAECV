import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid prayer ID is required' }, { status: 400 });
    }

    const delta = action === 'unpray' ? -1 : 1;

    // Gracefully handle missing write token (e.g. before user configures it)
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      console.warn('[API/prayers/pray] SANITY_API_WRITE_TOKEN is not configured. Count was updated locally only.');
      return NextResponse.json({
        success: true,
        persisted: false,
        message: 'Write token not configured; state updated in browser only.',
      });
    }

    // Atomically increment / decrement the prayer count in Sanity
    let updatedDoc;
    try {
      updatedDoc = await writeClient
        .patch(id)
        .setIfMissing({ likes: 0 })
        .inc({ likes: delta })
        .commit({ returnDocuments: true });
    } catch (err: any) {
      // If it is a fallback item (id '1', '2', etc.) not in Sanity, handle gracefully
      if (err?.statusCode === 404 || err?.message?.includes('not found')) {
        return NextResponse.json({
          success: true,
          persisted: false,
          message: 'Document not found in Sanity (placeholder item); updated locally only.',
        });
      }
      throw err;
    }

    // Guard against negative likes
    if (typeof updatedDoc.likes === 'number' && updatedDoc.likes < 0) {
      updatedDoc = await writeClient
        .patch(id)
        .set({ likes: 0 })
        .commit({ returnDocuments: true });
    }

    return NextResponse.json({
      success: true,
      persisted: true,
      likes: updatedDoc.likes,
    });
  } catch (error: any) {
    console.error('[API/prayers/pray] Error updating prayer count in Sanity:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update prayer count' },
      { status: 500 }
    );
  }
}
