export interface Payment {
  _id?: string;
  allocationId: string;
  memberId: string;
  amount: number;
  paidAt: Date;
}
