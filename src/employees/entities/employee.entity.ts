import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeePhoneEntity } from './employee-phone.entity';
import { EmployeeCredentialsEntity } from './employee-credentials.entity';

@Entity('employees')
export class EmployeeEntity {
    @PrimaryGeneratedColumn('increment', { name: 'employee_id' })
    id: number;

    @Column({ name: 'employee_first_name', nullable: false })
    firstName: string;

    @Column({ name: 'employee_last_name', nullable: false })
    lastName: string;

    @Column({ name: 'employee_sex', nullable: false })
    sex: string;

    @Column({ name: 'employee_birthday', nullable: false })
    birthday: string;

    @Column({ name: 'employee_email', unique: true, nullable: false })
    email: string;

    @OneToOne(
        () => EmployeePhoneEntity,
        (employeePhone) => employeePhone.employee,
        {
            cascade: true,
        },
    )
    phone: EmployeePhoneEntity;

    @OneToOne(
        () => EmployeeCredentialsEntity,
        (employeeCredentials) => employeeCredentials.employee,
        {
            cascade: true,
        },
    )
    credentials: EmployeeCredentialsEntity;
}
