import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Public } from '../decorators/public.decorator';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../enums/user-type.enum';
import { AssignTablesDTO } from './dtos/assign-tables.dto';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Public()
    @Post()
    async signUp(@Body() employee: CreateEmployeeDTO) {
        try {
            const result = await this.employeeService.signUpEmployee(employee);
            console.log(result[0][0]);
            return result[0][0];
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    @Roles(UserType.EMPLOYEE)
    @Get('/queue')
    async getQueue(@Query('requestedCapability') filterByRequest?: number) {
        const queue = await this.employeeService.getQueue(filterByRequest);
        console.log(queue);
        return queue;
    }

    @Roles(UserType.EMPLOYEE)
    @Post('/assign-table/:reservationId')
    async assignReservationToTables(
        @Param('reservationId') reservationId: number,
        @Body() assignedTables: AssignTablesDTO,
    ) {
        try {
            return this.employeeService.assignReservationToTables(
                reservationId,
                assignedTables,
            );
        } catch (err) {
            return err;
        }
    }
}
