import { CustomerEntity } from '../../customers/entities/customer.entity';
import { ReservationEntity } from '../entities/reservation.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class ReturnedReservation {
    reservationId: number;
    reservationStatus: ReservationStatus;
    requestedCapability: number;
    startDatetime: Date;
    endDatetime: Date;
    checkedInDatetime: Date;
    cancelDatetime?: Date;
    assignedTableReservationDatetime?: Date;
    customer: CustomerEntity;

    constructor(reservation: ReservationEntity) {
        this.reservationId = reservation.id;
        this.requestedCapability = reservation.requestedCapability;
        this.reservationStatus = reservation.reservationStatus;
        this.startDatetime = reservation.startDatetime;
        this.endDatetime = reservation.endDatetime;
        this.checkedInDatetime = reservation.checkedInDatetime;
        this.assignedTableReservationDatetime =
            reservation?.assignedTables[0]?.assignedTableReservationDatetime;
        this.cancelDatetime = reservation?.cancelled?.cancelDatetime || null;
        this.customer = reservation.customer;
    }
}
