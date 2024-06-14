import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { TableEntity } from '../../tables/entities/table.entity';

@Entity('assignedtablereservation')
export class AssignedTableReservationEntity {
    @PrimaryGeneratedColumn('increment', {
        name: 'assigned_table_reservation_id',
    })
    id: number;

    @Column({ name: 'assigned_table_reservation_datetime', nullable: true })
    assignedTableReservationDatetime?: string;

    @ManyToOne(
        () => ReservationEntity,
        (reservation) => reservation.assignedTables,
        {
            eager: false,
        },
    )
    @JoinColumn({ name: 'reservation_id' })
    reservation: ReservationEntity;

    @ManyToOne(() => TableEntity, (table) => table.assignedReservations, {
        eager: false,
    })
    @JoinColumn({ name: 'table_id' })
    table: TableEntity;
}
