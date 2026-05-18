import { Models } from 'node-appwrite';

export interface IBoard extends Models.Document {
  name: string;
  slug: string;
  logo?: string;
}

export type BoardDocument = IBoard;
