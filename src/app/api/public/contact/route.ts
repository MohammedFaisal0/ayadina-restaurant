import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    return NextResponse.json(
      { success: true, id: contactMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/public/contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
