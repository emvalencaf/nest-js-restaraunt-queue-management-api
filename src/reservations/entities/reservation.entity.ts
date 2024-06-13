import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { CustomerEntity } from '../../customers/entities/customer.entity';
import { AssignedTableReservationEntity } from './assigned-table-reservation.entity';
import { CancelledReservationEntity } from './cancelled_reservation.entity';

@Entity('reservations')
export class ReservationEntity {
    @PrimaryGeneratedColumn('increment', { name: 'reservation_id' })
    id: number;

    @Column({ name: 'reservation_requested_capability', nullable: false })
    requestedCapability: number;

    @Column({ name: 'reservation_start_datetime', nullable: false })
    startDatetime: Date;

    @Column({ name: 'reservation_end_datetime', nullable: true })
    endDatetime: Date;

    @Column({ name: 'reservation_checked_in_datetime', nullable: false })
    checkedInDatetime: Date;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        name: 'reservation_status',
        nullable: true,
        default: ReservationStatus.PENDING,
    })
    reservationStatus: ReservationStatus;

    @OneToOne(
        () => CancelledReservationEntity,
        (cancelledReservation) => cancelledReservation.reservation,
        {
            cascade: true,
        },
    )
    cancelled: CancelledReservationEntity;

    @ManyToOne(() => CustomerEntity, (customer) => customer.reservations, {
        eager: false,
    })
    @JoinColumn({ name: 'customer_id' })
    customer: CustomerEntity;

    @OneToMany(
        () => AssignedTableReservationEntity,
        (assignedTable) => assignedTable.reservation,
        {
            cascade: true,
        },
    )
    assignedTables: AssignedTableReservationEntity[];
}
