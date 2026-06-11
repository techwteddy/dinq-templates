"use server"
import { createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { getGradeLetter } from "@/utils/gradeUtils"

export async function addGrade(formData: FormData) {
  const supabase = await createServerClient();
  
  // These names must match the 'name' attribute in your <input /> tags
  const student_name = formData.get("student_name") as string;
  const subject = formData.get("subject") as string;
  const grade_level = formData.get("grade_level") as string; 
  const semester = formData.get("semester") as string;
  const academic_year = formData.get("academic_year") as string;
  const scoreString = formData.get("score") as string;
  const score = parseFloat(scoreString);

  const { error } = await supabase.from("grades").insert([
    {
      student_name,
      subject,
      grade_level,
      semester,
      academic_year,
      score,
      grade_letter: getGradeLetter(score)
    }
  ]);

  if (error) throw new Error(error.message);
  revalidatePath("/[lang]/grades", "page");
}

export async function deleteGrade(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("grades").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/[lang]/grades", "page");
}

export async function addSemester(formData: FormData) {
  const supabase = await createServerClient();
  const name = formData.get("semester_name") as string;
  const { error } = await supabase.from("semesters").insert([{ name }]);
  if (error) throw error;
  revalidatePath("/[lang]/grades", "page");
}

export async function updateGrade(id: string, formData: FormData) {
  const supabase = await createServerClient();
  const student_name = formData.get("student_name") as string;
  const score = parseFloat(formData.get("score") as string);
  const grade_letter = getGradeLetter(score);

  const { error } = await supabase
    .from("grades")
    .update({ student_name, score, grade_letter })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/[lang]/grades", "page");
}

export async function deleteSemester(semesterName: string) {
  const supabase = await createServerClient();

  // 1. Delete all grades associated with this semester first
  const { error: gradesError } = await supabase
    .from("grades")
    .delete()
    .eq("semester", semesterName);

  if (gradesError) throw gradesError;

  // 2. Delete the semester itself
  const { error: semError } = await supabase
    .from("semesters")
    .delete()
    .eq("name", semesterName);

  if (semError) throw semError;

  revalidatePath("/[lang]/grades", "page");
}