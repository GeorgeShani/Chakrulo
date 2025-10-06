import { UUID } from "crypto";

export interface User {
  id: UUID;
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url?: string | null;
  weight?: number | null;
  weight_unit?: string | null;
  height?: number | null;
  height_unit?: string | null;
  birth_date?: Date | null;
  country?: string | null;
  sleep_time?: number | null;
  biological_sex?: string | null;
  gender?: string | null;
}

export interface CreateUserRequest {
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string | null;
  weight?: number | null;
  weight_unit?: string | null;
  height?: number | null;
  height_unit?: string | null;
  birth_date?: Date | null;
  country?: string | null;
  sleep_time?: number | null;
  biological_sex?: string | null;
  gender?: string | null;
}