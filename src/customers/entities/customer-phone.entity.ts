// decorators
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

// entities
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'customer_phones' })
export class CustomerPhoneEntity {
    @PrimaryColumn({ name: 'customer_id', nullable: false })
    id: number;

    @Column({ name: 'phone_number', nullable: false })
    number: string;

    @Column({ name: 'phone_code_area', nullable: false })
    codeArea: string;

    @Column({ name: 'phone_is_whatsapp', nullable: false })
    isWhatsapp: boolean;

    @OneToOne(() => CustomerEntity)
    @JoinColumn({ name: 'customer_id' })
    customer: CustomerEntity;
}
