import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TableEntity } from './entities/table.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFindTableDTO } from './dtos/query-find-table.dto';
import { CreateTableDTO } from './dtos/create-table.dto';

@Injectable()
export class TableService {
    async create(table: CreateTableDTO) {
        const newTable = await this.tableRepository.create(table);

        return this.tableRepository.save(newTable);
    }

    constructor(
        @InjectRepository(TableEntity)
        private readonly tableRepository: Repository<TableEntity>,
    ) {}

    async getAll(query: QueryFindTableDTO) {
        return this.tableRepository.find({
            where: {
                status: query.filterByStatus,
                maxCapability: query.filterByRequested,
                isCombinable:
                    query.filterByIsCombinable === 'false' ? false : true,
            },
        });
    }
}
