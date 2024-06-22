// decorators
import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
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
import { format } from 'date-fns';

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
        console.log(reservation);
        // assign a new table to a reservations
        if (
            !reservation ||
            (reservation.status !== 'checked-in' &&
                reservation.status != 'in_use')
        )
            throw new BadRequestException(
                'Reservation with invalid status or not exists',
            );

        const tables = await Promise.all(
            assignedTables.tablesId.map(async (tableId) => {
                return this.tableService.getById(tableId);
            }),
        );

        if (!tables || tables.length === 0)
            throw new NotFoundException('Table id or ids were not found');

        const maxCapability = tables.reduce(
            (sum, table) => sum + table.maxCapability,
            0,
        );

        return Promise.all(
            tables.map(async (table) => {
                if (table.status !== 'available')
                    throw new BadRequestException(
                        `Table id ${table.id} is not available.`,
                    );

                if (maxCapability < reservation.requestedCapability)
                    throw new BadRequestException(
                        `Table Id ${table.id} cannot be assigned to more than it's max capability`,
                    );

                const assigned = this.assignedReservationRepository.create({
                    table: table,
                    reservation: reservation,
                });

                await this.assignedReservationRepository.save(assigned);

                return assigned;
            }),
        );
    }

    // create a reservation
    async create(customerId: number, reservation: CreateReservationDTO) {
        const newReservation = await this.reservationRepository.create({
            ...reservation,
            recordDatetime: reservation?.isQueueTicket
                ? format(
                      new Date(reservation.recordDatetime),
                      'yyyy-MM-dd HH:mm:ss', // make sure the date is correctly formatted
                  )
                : reservation.recordDatetime,
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
        const reservation = await this.reservationRepository.findOne({
            where: {
                id: paramsCancel.reservationId,
            },
            relations: {
                customer: true,
            },
        });

        if (!reservation)
            throw new NotFoundException('no reservation was found it');

        if (
            paramsCancel.customerId &&
            reservation.customer.id !== paramsCancel.customerId
        )
            throw new UnauthorizedException(
                'only the customer or employee can cancel a reservation',
            );

        return await this.dataSourceRepository
            .createQueryRunner()
            .query('call cancel_reservation (?, ?)', [
                paramsCancel.reservationId,
                paramsCancel.employeeId ? paramsCancel.employeeId : null,
            ]);
    }
}
