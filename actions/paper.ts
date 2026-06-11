'use server';

import { createAdminClient } from '@/lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const PAPERS_COLLECTION_ID = process.env.APPWRITE_PAPERS_COLLECTION_ID!;
const BOARDS_COLLECTION_ID = process.env.APPWRITE_BOARDS_COLLECTION_ID!;
const STORAGE_BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID!;

export async function getPapers(filter: any = {}) {
  try {
    const { databases } = await createAdminClient();
    
    const queries = [Query.orderDesc('year')];
    
    if (filter.boardId) queries.push(Query.equal('boardId', filter.boardId));
    if (filter.classLevel) queries.push(Query.equal('classLevel', filter.classLevel));
    if (filter.subject) queries.push(Query.equal('subject', filter.subject));
    if (filter.category) queries.push(Query.equal('category', filter.category));
    
    // Add custom or default limit (default to 5000 to cover all items for global search/filters)
    queries.push(Query.limit(filter.limit || 5000));

    const response = await databases.listDocuments(
      DATABASE_ID,
      PAPERS_COLLECTION_ID,
      queries
    );
    
    return { success: true, data: JSON.parse(JSON.stringify(response.documents)) };
  } catch (error) {
    console.error('Error fetching papers:', error);
    return { success: false, error: 'Failed to fetch papers' };
  }
}

export async function getPaperById(id: string) {
  try {
    const { databases } = await createAdminClient();
    const paper = await databases.getDocument(
      DATABASE_ID,
      PAPERS_COLLECTION_ID,
      id
    );
    
    // Fetch board info separately since Appwrite doesn't have auto-populate
    let board = null;
    if (paper.boardId) {
      try {
        board = await databases.getDocument(
          DATABASE_ID,
          BOARDS_COLLECTION_ID,
          paper.boardId
        );
      } catch (e) {
        console.error('Error fetching board for paper:', e);
      }
    }
    
    return { success: true, data: JSON.parse(JSON.stringify({ ...paper, board })) };
  } catch (error) {
    console.error('Error fetching paper:', error);
    return { success: false, error: 'Failed to fetch paper' };
  }
}

export async function getClassesByBoard(boardId: string) {
    if (!boardId) return { success: false, error: 'Board ID is required' };
    try {
      const { databases } = await createAdminClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        PAPERS_COLLECTION_ID,
        [Query.equal('boardId', boardId), Query.limit(100)]
      );
      
      // Get unique classes
      const classes = Array.from(new Set(response.documents.map(doc => doc.classLevel)));
      return { success: true, data: classes.sort() };
    } catch (error) {
      console.error('Error fetching classes:', error);
      return { success: false, error: 'Failed to fetch classes' };
    }
}

export async function getSubjectsByBoardAndClass(boardId: string, classLevel: string) {
    if (!boardId || !classLevel) return { success: false, error: 'Board ID and Class Level are required' };
    try {
      const { databases } = await createAdminClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        PAPERS_COLLECTION_ID,
        [Query.equal('boardId', boardId), Query.equal('classLevel', classLevel), Query.limit(100)]
      );
      
      // Get unique subjects
      const subjects = Array.from(new Set(response.documents.map(doc => doc.subject)));
      return { success: true, data: subjects.sort() };
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return { success: false, error: 'Failed to fetch subjects' };
    }
}

export async function getCategories() {
    try {
      const { databases } = await createAdminClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        PAPERS_COLLECTION_ID,
        [Query.limit(100), Query.select(['category'])]
      );
      
      const categories = Array.from(new Set(response.documents.map(doc => doc.category).filter(Boolean)));
      return { success: true, data: categories.sort() };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: 'Failed to fetch categories' };
    }
}

export async function createPaper(formData: FormData) {
  try {
    const { databases, storage } = await createAdminClient();
    
    const title = formData.get('title') as string;
    const boardId = formData.get('boardId') as string;
    const classLevel = formData.get('classLevel') as string;
    const subject = formData.get('subject') as string;
    const year = parseInt(formData.get('year') as string);
    const type = formData.get('type') as string;
    const group = formData.get('group') as string;
    const category = formData.get('category') as string;
    const paperFile = formData.get('paperFile') as File | null;
    const paperFileId = formData.get('paperFileId') as string | null;
    const richContent = (formData.get('richContent') as string | null) || '';

    const hasFile = paperFileId || (paperFile && paperFile.size > 0);
    const hasRichContent = richContent.trim().length > 0;

    if (!title || !boardId || !classLevel || !subject || !year || !type || (!hasFile && !hasRichContent)) {
      return { success: false, error: 'Please fill in all required fields and either upload a file or add text content.' };
    }

    let fileIdToUse = paperFileId;

    if (!fileIdToUse && hasFile && paperFile) {
      // Upload to Appwrite Storage (fallback if not uploaded client-side)
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        paperFile
      );
      fileIdToUse = uploadedFile.$id;
    }
    
    // Get file URL (using the view endpoint), empty string if text-only
    const pdfUrl = fileIdToUse
      ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${fileIdToUse}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
      : '';

    await databases.createDocument(
      DATABASE_ID,
      PAPERS_COLLECTION_ID,
      ID.unique(),
      {
        title,
        boardId,
        classLevel,
        subject,
        year,
        type,
        group,
        category,
        pdfUrl,
        ...(richContent ? { richContent } : {}),
      }
    );
    
    // Revalidate paths
    const board = await databases.getDocument(DATABASE_ID, BOARDS_COLLECTION_ID, boardId);
    if (board) {
      revalidatePath(`/past-papers/${board.slug}`);
      revalidatePath(`/past-papers/${board.slug}/${classLevel}`);
      revalidatePath(`/past-papers/${board.slug}/${classLevel}/${subject}`);
    }
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error creating paper:', error);
    return { success: false, error: error.message || 'Failed to create paper' };
  }
}
