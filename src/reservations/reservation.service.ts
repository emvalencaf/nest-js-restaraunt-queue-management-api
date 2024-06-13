// decorators
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// types
import { DataSource, Repository } from 'typeorm';

// entities
import { ReservationEntity } from './entities/reservation.entity';

// dtos
import { CreateReservationDTO } from './dtos/create-reservation.dto';
import { UpdateReservationStatusDTO } from './dtos/update-reservation-status.dto';
import { CancelReservationDTO } from './dtos/cancel-reservation.dto';

// enums
import { ReservationStatus } from './enums/reservation-status.enum';
import { GetReservationById } from './dtos/get-by-id.dto';
import { ReturnedReservation } from './dtos/returned-reservation.dto';

@Injectable()
export class ReservationService {
    constructor(
        private readonly dataSourceRepository: DataSource,
        @InjectRepository(ReservationEntity)
        private readonly reservationRepository: Repository<ReservationEntity>,
    ) {}

    // create a reservation
    async create(customerId: number, reservation: CreateReservationDTO) {
        const newReservation = await this.reservationRepository.create({
            ...reservation,
            reservationStatus: ReservationStatus.PENDING,
            customer: { id: customerId },
        });

        return this.reservationRepository.save(newReservation);
    }

    async getById(getByIdParams: GetReservationById) {
        const reservation = await this.reservationRepository.findOne({
            where: {
                id: getByIdParams.reservationId,
            },
            relations: {
                cancelled: getByIdParams.showCancel,
                assignedTables: getByIdParams.showAssignedTables,
                customer: true,
            },
        });

        return new ReturnedReservation(reservation);
    }

    // update a reservation status
    async updateStatus(
        reservationId: number,
        update: UpdateReservationStatusDTO,
    ) {
        // the db will deal
        return this.reservationRepository.update(reservationId, {
            reservationStatus: update.reservationStatus,
        });
    }

    // cancel a reservation
    // both employees and customers can cancel a reservation
    async cancel(paramsCancel: CancelReservationDTO) {
        return await this.dataSourceRepository
            .createQueryRunner()
            .query('call cancel_reservation (?, ?, ?)', [
                paramsCancel.reservationId,
                paramsCancel.employeeId ? paramsCancel.employeeId : null,
                paramsCancel.customerId ? paramsCancel.customerId : null,
            ]);
    }
}
