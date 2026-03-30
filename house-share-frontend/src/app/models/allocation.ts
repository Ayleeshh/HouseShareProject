export interface Allocation {
  _id?: string;
  billId: string;
  memberId: string;
  amountPaid: number;
  amountOwed: number;
  status: 'unpaid' | 'part-paid' |'paid';
}
