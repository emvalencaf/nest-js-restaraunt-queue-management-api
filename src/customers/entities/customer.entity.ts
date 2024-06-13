// decorators
import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerPhoneEntity } from './customer-phone.entity';
import { ReservationEntity } from '../../reservations/entities/reservation.entity';

// entities

@Entity({ name: 'customers' })
export class CustomerEntity {
    @PrimaryGeneratedColumn('increment', { name: 'customer_id' })
    id: number;

    @Column({ name: 'customer_first_name', nullable: false })
    firstName: string;

    @Column({ name: 'customer_last_name', nullable: false })
    lastName: string;

    @Column({ name: 'customer_sex', nullable: false })
    sex: string;

    @Column({ name: 'customer_birthday', nullable: false })
    birthday: string;

    @Column({
        name: 'customer_has_special_needs',
        nullable: false,
    })
    has_special_needs: boolean;

    @OneToOne(
        () => CustomerPhoneEntity,
        (customerPhone) => customerPhone.customer,
        {
            cascade: true,
        },
    )
    phone: CustomerPhoneEntity;

    @OneToMany(() => ReservationEntity, (reservation) => reservation.customer, {
        cascade: true,
    })
    reservations: ReservationEntity[];
}
