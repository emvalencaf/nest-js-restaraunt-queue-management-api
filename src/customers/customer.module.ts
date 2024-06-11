import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerPhoneEntity } from './entities/customer-phone.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity, CustomerPhoneEntity])],
    exports: [],
    controllers: [CustomerController],
    providers: [CustomerService],
})
export class CustomerModule {}
