// decorators
// modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// entities
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeCredentialsEntity } from './entities/employee-credentials.entity';

// dtos
import { AuthEmployeeSignInDTO } from '../auth/dtos/auth-employee-sign-in.dto';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { ReturnedFactQueue } from '../reservations/dtos/returned-fact-queue.dto';
import { ReturnedFactQueueView } from '../reservations/dtos/returned-fact-queue-view.dto';

// types
import { DataSource, Repository } from 'typeorm';

// utils
import { hash } from 'bcrypt';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
        @InjectRepository(EmployeeCredentialsEntity)
        private readonly employeeCredentialRepository: Repository<EmployeeCredentialsEntity>,
        private readonly dataSourceRepository: DataSource,
    ) {}

    async getQueue(filterByRequest: number): Promise<ReturnedFactQueue[]> {
        const queue: ReturnedFactQueueView[] = await this.dataSourceRepository
            .createQueryRunner()
            .query(
                `SELECT * FROM fact_queue ${filterByRequest && filterByRequest >= 1 ? `WHERE reservation_requested_capability = ${filterByRequest}` : ''};`,
            );

        if (queue.length == 0 || !queue)
            throw new NotFoundException('No queue found it');

        return queue.map((reservation) => new ReturnedFactQueue(reservation));
    }

    async getCredentialsByUsername(signIn: AuthEmployeeSignInDTO) {
        console.log(signIn);
        return this.employeeCredentialRepository.findOne({
            where: {
                username: signIn.username,
            },
        });
    }

    async signUpEmployee(employee: CreateEmployeeDTO) {
        const salt = 10;

        employee.credentials.password = await hash(
            employee.credentials.password,
            salt,
        );

        return await this.dataSourceRepository
            .createQueryRunner()
            .query('call insert_new_employee (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                employee.firstName,
                employee.lastName,
                employee.birthday,
                employee.sex,
                employee.email,
                employee.phone.number,
                employee.phone.codeArea,
                employee.phone.isWhatsapp,
                employee.credentials.username,
                employee.credentials.password,
            ]);
    }
}
