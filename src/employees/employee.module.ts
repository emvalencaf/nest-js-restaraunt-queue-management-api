import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeCredentialsEntity } from './entities/employee-credentials.entity';
import { EmployeePhoneEntity } from './entities/employee-phone.entity';
import { EmployeeController } from './employee.controller';
import { TableModule } from '../tables/table.module';
import { ReservationModule } from '../reservations/reservation.modules';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmployeeEntity,
            EmployeeCredentialsEntity,
            EmployeePhoneEntity,
        ]),
        TableModule,
        ReservationModule,
    ],
    exports: [EmployeeService],
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule {}
