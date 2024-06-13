import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { CustomerModule } from '../customers/customer.module';

@Module({
    imports: [TypeOrmModule.forFeature([ReservationEntity]), CustomerModule],
    controllers: [ReservationController],
    providers: [ReservationService],
})
export class ReservationModule {}
