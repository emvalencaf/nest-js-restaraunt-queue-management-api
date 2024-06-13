import { Injectable } from '@nestjs/common';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerPhoneEntity } from './entities/customer-phone.entity';
import { DataSource, Repository } from 'typeorm';
import { GetCustomerByPhoneDTO } from './dtos/get-customer-by-phone.dto';
import { GetCustomerByIdDTO } from './dtos/get-customer-by-id.dto';
import { CreateCustomerDTO } from './dtos/create-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerService {
    constructor(
        private readonly dataSourceRepository: DataSource,
        @InjectRepository(CustomerEntity)
        private readonly customerEntity: Repository<CustomerEntity>,
        @InjectRepository(CustomerPhoneEntity)
        private readonly customerPhoneEntity: Repository<CustomerPhoneEntity>,
    ) {}

    // get by id
    async getById(findOneOptions: GetCustomerByIdDTO) {
        return this.customerEntity.findOne({
            where: {
                id: findOneOptions.id,
            },
            relations: {
                phone: findOneOptions.showPhone,
            },
        });
    }

    // get customer by phone
    async getByNumber(findOneOptions: GetCustomerByPhoneDTO) {
        return this.customerEntity.findOne({
            where: {
                phone: {
                    number: findOneOptions.number,
                    codeArea: findOneOptions.codeArea,
                },
            },
        });
    }

    // create customer
    async create(customer: CreateCustomerDTO) {
        return await this.dataSourceRepository
            .createQueryRunner()
            .query('call insert_new_customer (?, ?, ?, ?, ?, ?, ?, ?)', [
                customer.firstName,
                customer.lastName,
                customer.birthday,
                customer.sex,
                customer.has_special_needs,
                customer.phone.codeArea,
                customer.phone.number,
                customer.phone.isWhatsapp,
            ]);
    }
}