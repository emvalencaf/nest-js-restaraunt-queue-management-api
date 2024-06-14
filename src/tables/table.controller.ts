import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TableStatus } from './enums/table-status.enum';
import { TableService } from './table.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../enums/user-type.enum';
import { CreateTableDTO } from './dtos/create-table.dto';

@Controller('tables')
export class TableController {
    constructor(private readonly tableService: TableService) {}

    @Roles(UserType.EMPLOYEE)
    @Post()
    async create(@Body() table: CreateTableDTO) {
        return this.tableService.create(table);
    }

    @Roles(UserType.EMPLOYEE)
    @Get()
    async getAll(
        @Query('filterByStatus') filterByStatus: TableStatus,
        @Query('filterByRequested') filterByRequested: number,
        @Query('filterByIsCombinable') filterByIsCombinable: string = 'true',
    ) {
        return this.tableService.getAll({
            filterByStatus,
            filterByRequested,
            filterByIsCombinable,
        });
    }
}
