export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  views: number;
  dateCreation: Date;
}

