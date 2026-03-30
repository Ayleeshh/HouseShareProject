import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import {Prop} from "@nestjs/mongoose";

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  householdId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

}
