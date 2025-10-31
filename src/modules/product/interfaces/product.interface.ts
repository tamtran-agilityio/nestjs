export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
