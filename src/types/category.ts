export interface Category {
  id: string; // unique slug/id
  name: string;
  description?: string;
  sortOrder: number;
  visibility: boolean; // true = visible, false = hidden
  status: "active" | "inactive";
  createdAt?: any;
  updatedAt?: any;
}
