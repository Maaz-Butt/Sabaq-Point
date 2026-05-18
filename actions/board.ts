'use server';

import { createAdminClient } from '@/lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const BOARDS_COLLECTION_ID = process.env.APPWRITE_BOARDS_COLLECTION_ID!;

export async function getBoards() {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      BOARDS_COLLECTION_ID,
      [Query.orderAsc('name')]
    );
    return { success: true, data: JSON.parse(JSON.stringify(response.documents)) };
  } catch (error) {
    console.error('Error fetching boards:', error);
    return { success: false, error: 'Failed to fetch boards' };
  }
}

export async function getBoardBySlug(slug: string) {
  if (!slug) {
    console.warn('getBoardBySlug called with empty slug');
    return { success: false, error: 'Slug is required' };
  }
  
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      BOARDS_COLLECTION_ID,
      [Query.equal('slug', slug.toLowerCase())]
    );
    
    if (response.total === 0) return { success: false, error: 'Board not found' };
    
    return { success: true, data: JSON.parse(JSON.stringify(response.documents[0])) };
  } catch (error) {
    console.error('Error fetching board:', error);
    return { success: false, error: 'Failed to fetch board' };
  }
}

export async function createBoard(formData: FormData) {
  try {
    const { databases } = await createAdminClient();
    
    const name = formData.get('name') as string;
    
    if (!name) {
      return { success: false, error: 'Board name is required' };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await databases.createDocument(
      DATABASE_ID,
      BOARDS_COLLECTION_ID,
      ID.unique(),
      {
        name,
        slug,
      }
    );

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating board:', error);
    return { success: false, error: error.message || 'Failed to create board' };
  }
}
