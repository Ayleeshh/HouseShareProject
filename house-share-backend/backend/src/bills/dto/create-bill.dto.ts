import {
  IsDateString,
  IsNotEmpty, IsNumber,
  IsString,
  Min,
} from 'class-validator';

// Defines what data is allowed into Bill API
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

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

}
