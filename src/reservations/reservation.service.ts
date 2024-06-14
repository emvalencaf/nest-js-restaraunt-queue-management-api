// decorators
import { BadRequestException, Injectable } from '@nestjs/common';
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
import { AssignTablesDTO } from '../employees/dtos/assign-tables.dto';
import { AssignedTableReservationEntity } from './entities/assigned-table-reservation.entity';
import { TableService } from '../tables/table.service';

@Injectable()
export class ReservationService {
    constructor(
        private readonly dataSourceRepository: DataSource,
        @InjectRepository(ReservationEntity)
        private readonly reservationRepository: Repository<ReservationEntity>,
        @InjectRepository(AssignedTableReservationEntity)
        private readonly assignedReservationRepository: Repository<AssignedTableReservationEntity>,
        private readonly tableService: TableService,
    ) {}
    //
    async assignReservationToTables(
        reservationId: number,
        assignedTables: AssignTablesDTO,
    ) {
        const reservation = await this.reservationRepository.findOne({
            where: {
                id: reservationId,
            },
        });

        // assign a new table to a reservations
        if (
            !reservation ||
            (reservation.status !== 'checked-in' &&
                reservation.status != 'in_use')
        )
            throw new BadRequestException(
                'Reservation with invalid status or not exists',
            );

        return assignedTables.tablesId.map(async (tableId) => {
            const table = await this.tableService.getById(tableId);

            if (!table || table.status !== 'available')
                throw new BadRequestException(
                    `Table id ${tableId} was not found or is not available.`,
                );
            if (table.maxCapability < reservation.requestedCapability)
                throw new BadRequestException(
                    `Table Id ${tableId} cannot be assigned to more than it's max capability`,
                );

            const assigned = this.assignedReservationRepository.create({
                table: table,
                reservation: reservation,
            });

            return this.assignedReservationRepository.save(assigned);
        });
    }

    // create a reservation
    async create(customerId: number, reservation: CreateReservationDTO) {
        const newReservation = await this.reservationRepository.create({
            ...reservation,
            status: ReservationStatus.PENDING,
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
            status: update.reservationStatus,
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
