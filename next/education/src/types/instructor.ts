export interface Instructor {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}
