import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    billId: string;

    @IsString()
    @IsNotEmpty()
    payerName: string;

    @IsInt()
    @Min(0)
    amountCents: number;
}