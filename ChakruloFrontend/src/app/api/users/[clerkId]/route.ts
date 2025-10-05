import { NextRequest, NextResponse } from "next/server";
import { updateUser, deleteUser, getUser } from "@/services/internal";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  const { clerkId } = await params;
  if (!clerkId) {
    return NextResponse.json({ error: "clerkId is required" }, { status: 400 });
  }

  const user = await getUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
    
  return NextResponse.json(user);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;
    const updateData = await req.json();
    const updatedUser = await updateUser(clerkId, updateData);
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
      
    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json(
      { error: "Exception updating user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;
    const success = await deleteUser(clerkId);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Exception deleting user" },
      { status: 500 }
    );
  }
}
