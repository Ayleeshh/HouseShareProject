import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import {Prop} from "@nestjs/mongoose";

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  billId: string;

  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  allocationId: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsDateString()
  paidAt: string;

}
