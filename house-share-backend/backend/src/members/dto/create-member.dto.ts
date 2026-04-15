import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

// Defines what data is allowed into Member API
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
