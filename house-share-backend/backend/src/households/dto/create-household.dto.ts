import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
} from 'class-validator';

export class CreateHouseholdDto {
    @IsString()
    @IsNotEmpty()
    householdId: string;

    @IsString()
    @IsNotEmpty()
    householdName: string;

    // @IsString()
    // @IsNotEmpty()
    // members: string;

}