import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/services/internal";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    const user = await createUser(userData);
    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(
      { error: "Exception creating user" },
      { status: 500 }
    );
  }
}