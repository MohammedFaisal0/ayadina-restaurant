import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TEXTS = 40;
const MAX_CHARS = 450;

type MyMemoryResponse = {
  responseStatus?: number;
  responseData?: {
    translatedText?: string;
  };
};

function chunkText(text: string): string[] {
  if (text.length <= MAX_CHARS) return [text];

  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > MAX_CHARS) {
    let splitAt = remaining.lastIndexOf(" ", MAX_CHARS);
    if (splitAt < 50) splitAt = MAX_CHARS;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

async function translateChunk(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`;
  const response = await fetch(url, { cache: "no-store" });
  const data = (await response.json().catch(() => null)) as MyMemoryResponse | null;
  const translated = data?.responseData?.translatedText?.trim();

  if (!response.ok || !translated) {
    throw new Error("Remote translation failed");
  }

  if (/MYMEMORY WARNING/i.test(translated)) {
    throw new Error("Translation quota exceeded");
  }

  return translated;
}

async function translateOne(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const parts = chunkText(trimmed);
  const translatedParts: string[] = [];
  for (const part of parts) {
    translatedParts.push(await translateChunk(part));
  }
  return translatedParts.join(" ");
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = (await request.json()) as { texts?: unknown };
    if (!Array.isArray(body.texts) || body.texts.some((item) => typeof item !== "string")) {
      return NextResponse.json({ error: "texts must be an array of strings" }, { status: 400 });
    }

    if (body.texts.length === 0) {
      return NextResponse.json({ translations: [] });
    }

    if (body.texts.length > MAX_TEXTS) {
      return NextResponse.json({ error: "Too many texts to translate" }, { status: 400 });
    }

    const translations: string[] = [];
    for (const text of body.texts) {
      translations.push(await translateOne(text));
    }

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("POST /api/translate error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
