import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import {Prop} from "@nestjs/mongoose";

export class CreateHouseholdDto {
  @IsString()
  @IsNotEmpty()
  householdId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  members: string[];

}
