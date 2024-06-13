import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('assignedtablereservation')
export class AssignedTableReservationEntity {
    @PrimaryGeneratedColumn('increment', {
        name: 'assigned_table_reservation_id',
    })
    id: number;

    @Column({ name: 'assigned_table_reservation_datetime', nullable: false })
    assignedTableReservationDatetime: Date;

    @ManyToOne(
        () => ReservationEntity,
        (reservation) => reservation.assignedTables,
        {
            eager: false,
        },
    )
    @JoinColumn({ name: 'reservation_id' })
    reservation: ReservationEntity;
}
