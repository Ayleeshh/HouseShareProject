export interface Bill {
  _id?: string;
  householdId: string;
  billTypeId: string;
  description: string;
  totalAmount: number;
  startDate?: string;
  endDate?: string;
  isClosed?: boolean;
}
