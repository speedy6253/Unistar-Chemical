export type AdminRole = "super_admin" | "admin" | "editor" | "viewer";
export type AdminStatus = "active" | "inactive";

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  lastLogin: string;
}
