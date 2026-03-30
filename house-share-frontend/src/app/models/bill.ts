export interface Bill {
  _id?: string;
  householdId: string;
  billTypeId: string;
  description: string;
  totalAmount: number;
  startDate?: String;
  endDate?: String;
  isClosed?: boolean;
}
