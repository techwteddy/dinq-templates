export interface TeamMemberEn {
  id: number;
  name: string;
  role: string;
  category: string;
  image: string;
}

export const teamMembers: TeamMemberEn[] = [
  { id: 1, name: "Tetiana Shevchenko", role: "Acting Director, PRM Doctor, Pediatric Psychiatrist, Pediatric Neurologist", category: "Doctors", image: "/images/shevckenko.webp" },
  { id: 2, name: "Karolina Levkivska", role: "Head of Medical Rehabilitation Department for Premature Infants and the First Three Years of Life, PRM Doctor", category: "Doctors", image: "/images/Levkivska.webp" },
  { id: 3, name: "Tetiana Mashtaler", role: "Head of Inpatient Medical Rehabilitation Department, Pediatric Neurologist, PRM Doctor", category: "Doctors", image: "/images/Mashtaler.webp" },
  { id: 4, name: "Vira Kobylinska", role: "Pediatric Psychiatrist", category: "Doctors", image: "/images/Kobulinska.webp" },
  { id: 5, name: "Yevheniia Shevchuk", role: "Physical Therapist, Occupational Therapist", category: "Professionals", image: "/images/Shevchyk.webp" },
  { id: 6, name: "Oleksandr Shcherbak", role: "Pediatric Surgeon", category: "Doctors", image: "/images/Sherbak.webp" },
  { id: 7, name: "Oleksandra Furman", role: "Clinical Psychologist", category: "Professionals", image: "/images/Furman.webp" },
  { id: 8, name: "Svitlana Shadura", role: "Physical Therapist Assistant", category: "Rehabilitation Specialists", image: "/images/Shadyra.webp" },
  { id: 9, name: "Vita Mykhalchuk", role: "Occupational Therapy Assistant", category: "Rehabilitation Specialists", image: "/images/Muchalchyk.webp" },
  { id: 10, name: "Svitlana Heraimovych", role: "Educator", category: "Pedagogical Staff", image: "/images/Heraimovich.webp" },
  { id: 11, name: "Olena Bondarchuk", role: "Educator", category: "Pedagogical Staff", image: "/images/Bondarchyk.webp" },
  { id: 12, name: "Alla Dmytruk", role: "Montessori Teacher", category: "Pedagogical Staff", image: "/images/Dmitryk.webp" },
  { id: 13, name: "Oksana Chumakevych", role: "Speech Therapist", category: "Psychologists & Speech Therapists", image: "/images/Chymackevich.webp" },
  { id: 14, name: "Olha Kovalova", role: "Speech Therapist", category: "Psychologists & Speech Therapists", image: "/images/Kovaloyva.webp" },
  { id: 15, name: "Svitlana Zozulia", role: "Special Education Teacher", category: "Pedagogical Staff", image: "/images/Zozyla.webp" },
  { id: 16, name: "Hanna Matviienko", role: "Music Director", category: "Pedagogical Staff", image: "/images/Maatvienko.webp" },
  { id: 17, name: "Daryna Melnychuk", role: "Special Education Teacher", category: "Pedagogical Staff", image: "/images/Melnichyk.webp" }
];
