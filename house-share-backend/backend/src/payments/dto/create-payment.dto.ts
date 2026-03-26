import {IsDateString, IsInt, IsNotEmpty, IsString, Min} from 'class-validator';

export class CreatePaymentDto {

    @IsString()
    @IsNotEmpty()
    billId: string;

    @IsString()
    @IsNotEmpty()
    memberId: string;

    @IsInt()
    @Min(0)
    totalCents: number;

    @IsDateString()
    date: string;
}