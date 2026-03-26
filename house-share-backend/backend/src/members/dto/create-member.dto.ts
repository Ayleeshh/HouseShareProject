import {
    IsBoolean,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
} from 'class-validator';

export class CreateMemberDto {
    @IsString()
    @IsNotEmpty()
    householdId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    isAdmin: boolean;


}