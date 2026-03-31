import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateBillTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    householdId: string;
}