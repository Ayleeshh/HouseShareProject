import {
    IsNotEmpty,
    IsString,
} from 'class-validator';
import {Prop} from "@nestjs/mongoose";

export class CreateBillTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    householdId: string;
}