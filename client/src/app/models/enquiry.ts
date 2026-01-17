export interface Enquiry {
  _id?: string;
  carId: string | any;
  guestName: string;
  guestEmail: string;
  message: string;
  adminReply?: string;
  status: 'New' | 'Replied';
  createdAt?: string;
}
