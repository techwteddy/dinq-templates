import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB — Whisper's limit
const VALID_LANGUAGES = ["en", "ur"] as const;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = formData.get("language") as string | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Audio file exceeds 25MB limit" },
        { status: 400 }
      );
    }

    if (audioFile.size === 0) {
      return NextResponse.json({ text: "" });
    }

    const lang = VALID_LANGUAGES.includes(language as "en" | "ur")
      ? (language as "en" | "ur")
      : "en";

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      language: lang,
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);

    const message =
      error instanceof Error ? error.message : "Transcription failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
