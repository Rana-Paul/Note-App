export interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
