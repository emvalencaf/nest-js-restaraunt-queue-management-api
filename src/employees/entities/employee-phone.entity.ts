import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Entity({ name: 'employee_phones' })
export class EmployeePhoneEntity {
    @PrimaryColumn({ name: 'employee_id', nullable: false })
    id: number;

    @Column({ name: 'phone_number', nullable: false })
    number: string;

    @Column({ name: 'phone_code_area', nullable: false })
    codeArea: string;

    @Column({ name: 'phone_is_whatsapp', nullable: false })
    isWhatsapp: boolean;

    @OneToOne(() => EmployeeEntity)
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity;
}
