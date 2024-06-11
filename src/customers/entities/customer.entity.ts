// decorators
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerPhoneEntity } from './customer-phone.entity';

// entities

@Entity({ name: 'customers' })
export class CustomerEntity {
    @PrimaryGeneratedColumn('rowid', { name: 'customer_id' })
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
}
