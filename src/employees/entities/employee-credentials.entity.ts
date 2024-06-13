import { IsString, Length } from 'class-validator';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Entity('employee_credentials')
export class EmployeeCredentialsEntity {
    @PrimaryColumn({ name: 'employee_id', nullable: false })
    id: number;

    @IsString()
    @Length(3, 45)
    username: string;
    @IsString()
    @Length(3, 60)
    password: string;

    @OneToOne(() => EmployeeEntity)
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity;
}
