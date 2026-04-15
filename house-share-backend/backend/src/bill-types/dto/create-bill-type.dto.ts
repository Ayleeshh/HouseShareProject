import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

// Defines what data is allowed into BillType API
export class CreateBillTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    householdId: string;
}