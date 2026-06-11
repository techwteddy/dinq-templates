import { Instructor } from './instructor';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id?: string; // Optional because Velite might not generate IDs for posts in the same way as courses
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  authorId: string;
  author?: Instructor;
  categoryId: string;
  category?: Category;
  tags?: string[];
  published?: boolean;
}

export type BlogPost = Post;
