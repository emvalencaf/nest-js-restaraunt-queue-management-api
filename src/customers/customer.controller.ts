import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dtos/create-customer.dto';

@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() customer: CreateCustomerDTO) {
        try {
            const result = await this.customerService.create(customer);
            return result[0][0];
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    @Get('/:customerId')
    getById(
        @Param('customerId') customerId: number,
        @Query('showPhone') showPhone: string = 'false',
        @Query('showReservations') showReservations: string = 'false',
        @Query('showQueueTickets') showQueueTickets: string = 'false',
    ) {
        try {
            return this.customerService.getById({
                id: customerId,
                showPhone: showPhone.toLowerCase() === 'true',
                showQueueTickets: showQueueTickets.toLowerCase() === 'true',
                showReservations: showReservations.toLowerCase() === 'true',
            });
        } catch (err) {
            return err;
        }
    }
}
