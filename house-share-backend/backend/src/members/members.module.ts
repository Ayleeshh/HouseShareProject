import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './schemas/member.schema';

@Module({
  imports: [
    // Registers Member schemas with MongoDB for use in this module
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
    ]),
  ],
  // Registers the controller that handles incoming requests
  controllers: [MembersController],

  // Registers the service that contains the business logic
  providers: [MembersService],

  // Exports the service so other modules can use it
  exports: [MembersService],
})
export class MembersModule {}