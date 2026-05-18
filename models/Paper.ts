import { Models } from 'node-appwrite';

export interface IPaper extends Models.Document {
  title: string;
  boardId: string; // Storing the board ID as a string in Appwrite
  classLevel: number;
  subject: string;
  year: number;
  type: 'Solved' | 'Unsolved';
  group?: string;
  pdfUrl: string;
  description?: string;
}

export type PaperDocument = IPaper;
