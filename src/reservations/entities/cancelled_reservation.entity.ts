import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('cancelled_reservation')
export class CancelledReservationEntity {
    @PrimaryColumn({ name: 'reservation_id', nullable: false })
    id: number;

    @Column({
        name: 'cancelled_reservation_datetime',
        type: 'datetime',
        nullable: false,
    })
    cancelDatetime: Date;

    @OneToOne(() => ReservationEntity)
    @JoinColumn({ name: 'reservation_id' })
    reservation: ReservationEntity;
}
