import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Entity('employee_credentials')
export class EmployeeCredentialsEntity {
    @PrimaryColumn({ name: 'employee_id', nullable: false })
    id: number;

    @Column({ name: 'employee_username', nullable: false })
    username: string;
    @Column({ name: 'employee_password', nullable: false })
    password: string;

    @OneToOne(() => EmployeeEntity)
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity;
}
