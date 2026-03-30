import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import {Prop} from "@nestjs/mongoose";

export class CreateBillDto {
  @IsString()
  @IsNotEmpty()
  householdId: string;

  @IsString()
  @IsNotEmpty()
  billTypeId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  totalAmount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  isClosed:boolean;

}
