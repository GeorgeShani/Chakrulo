import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/supabase/user";
import { createSupabaseClient } from "@/lib/database/connection"

const supabase = createSupabaseClient();

export async function createUser(
  userData: CreateUserRequest
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error("Exception creating user:", error);
    return null;
  }
}

export async function getUser(clerkId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error("Exception fetching user:", error);
    return null;
  }
}

export async function updateUser(
  clerkId: string,
  updateData: UpdateUserRequest
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("clerk_id", clerkId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error("Exception updating user:", error);
    return null;
  }
}

export async function deleteUser(clerkId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception deleting user:", error);
    return false;
  }
}