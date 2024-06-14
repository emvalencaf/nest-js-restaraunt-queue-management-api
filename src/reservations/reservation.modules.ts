import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { AssignedTableReservationEntity } from './entities/assigned-table-reservation.entity';
import { TableModule } from '../tables/table.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ReservationEntity,
            AssignedTableReservationEntity,
        ]),
        TableModule,
    ],
    controllers: [ReservationController],
    providers: [ReservationService],
    exports: [ReservationService],
})
export class ReservationModule {}
