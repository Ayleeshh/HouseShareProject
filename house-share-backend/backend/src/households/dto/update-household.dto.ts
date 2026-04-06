import { IsString, IsNotEmpty } from 'class-validator';

// Defines what data is allowed into Household API
export class UpdateHouseholdDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}