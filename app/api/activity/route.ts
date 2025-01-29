import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { uploadToStorage } from '@/lib/upload';
import { ActivityStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ActivityUpdateSchema = z.object({
  activityId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
  rating: z.number().min(0).max(5).optional(),
  feedback: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('id');

    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID required' },
        { status: 400 },
      );
    }

    const activity = await db.activity.findUnique({
      where: { id: activityId },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Failed to fetch activity', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { activityId, rating, status } = ActivityUpdateSchema.parse(body);

    const activity = await db.activity.update({
      where: { id: activityId },
      data: {
        rating,
        status: status as ActivityStatus,
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ activity });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const activityId = formData.get('activityId') as string;

    if (!file || !activityId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const uploadResult = await uploadToStorage(file);
    const attachment = await db.attachment.create({
      data: {
        activityId,
        type: file.type,
        url: uploadResult.url,
        filename: file.name,
      },
    });

    const activity = await db.activity.findUnique({
      where: { id: activityId },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ activity, attachment });
  } catch (error) {
    console.error('Failed to upload file', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('id');

    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID required' },
        { status: 400 },
      );
    }

    const deletedActivity = await db.activity.delete({
      where: { id: activityId },
    });

    return NextResponse.json({ activity: deletedActivity });
  } catch (error) {
    console.error('Failed to delete activity', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 },
    );
  }
}
