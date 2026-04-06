import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './create-bill.dto';

// Defines what data is allowed into Bill API
export class UpdateBillDto extends PartialType(CreateBillDto) {

}
