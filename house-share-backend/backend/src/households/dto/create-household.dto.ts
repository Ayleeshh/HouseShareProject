import { IsString, IsNotEmpty } from 'class-validator';

// Defines what data is allowed into Household API
export class CreateHouseholdDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}