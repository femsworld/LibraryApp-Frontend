export interface Book{
    id: string;
    title: string;
    genre: Genre|string;
    images?: string[] | null;
}

export enum Genre {
  TextBooks,
  Novel,
  Fiction,
  ResearchPaper,
  genre
}