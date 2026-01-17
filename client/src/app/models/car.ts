export interface Car {
  _id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  condition: 'New' | 'Used' | 'Certified';
  description?: string;
  image?: string;
  status: 'Available' | 'Sold';
  createdAt?: string;
}
