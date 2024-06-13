// decorators
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// types
import { DataSource, Repository } from 'typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { AuthEmployeeSignInDTO } from '../auth/dtos/auth-employee-sign-in.dto';
import { EmployeeCredentialsEntity } from './entities/employee-credentials.entity';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
        @InjectRepository(EmployeeCredentialsEntity)
        private readonly employeeCredentialRepository: Repository<EmployeeCredentialsEntity>,
        private readonly dataSourceRepository: DataSource,
    ) {}

    async getCredentialsByUsername(signIn: AuthEmployeeSignInDTO) {
        return this.employeeCredentialRepository.findOne({
            where: {
                username: signIn.username,
            },
        });
    }
    /*
in p_employee_first_name VARCHAR(45),
										in p_employee_last_name VARCHAR(45),
										in p_employee_birthdate DATE,
										in p_employee_sex CHAR(1),
                                        in p_employee_email VARCHAR(45),
										in p_phone_number VARCHAR(9),
										in p_phone_code_area CHAR(2),
										in p_phone_is_whatsapp BOOLEAN,
                                        in p_employee_username VARCHAR(45),
                                        in p_employee_password VARCHAR(45))

*/

    async signUpEmployee(employee: CreateEmployeeDTO) {
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
