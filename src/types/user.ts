export interface User {
  id: string;
  email: string;
  role: Roles;
  created_at?: string;
}

export type Roles = "seller" | "buyer" | "admin";
export type UserWithPassword = User & { password: string };
