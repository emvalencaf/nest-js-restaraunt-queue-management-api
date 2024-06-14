import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UnauthorizedException,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDTO } from './dtos/create-reservation.dto';
import { UpdateReservationStatusDTO } from './dtos/update-reservation-status.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../enums/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';
import { UserRole } from '../decorators/user-type.decorator';

@Controller('reservations')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    // create a new reservation
    // only customers can create a reservation
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(UserType.CUSTOMER)
    @Post('/customer')
    async create(
        @UserId('customerId') customerId: number,
        @Body() reservation: CreateReservationDTO,
    ) {
        return this.reservationService.create(customerId, {
            ...reservation,
        });
    }

    // get a reservation by id
    @Roles(UserType.CUSTOMER, UserType.EMPLOYEE)
    @Get('/:reservationId')
    async getById(
        @Param('reservationId') reservationId: number,
        @Query('showCancel') showCancel: boolean = true,
        @Query('showAssignedTables') showAssignedTables: boolean = true,
    ) {
        return this.reservationService.getById({
            reservationId,
            showCancel,
            showAssignedTables,
        });
    }

    // update reservation status
    @Roles(UserType.CUSTOMER, UserType.EMPLOYEE)
    @Patch('/:reservationId')
    async updateStatus(
        @UserId() userId: number,
        @UserRole() userRole: UserType,
        @Param('reservationId') reservationId: number,
        @Body()
        updateStatus: UpdateReservationStatusDTO,
    ) {
        if (
            (updateStatus.reservationStatus === 'checked-in' &&
                userRole === UserType.CUSTOMER) ||
            (userRole === UserType.CUSTOMER &&
                updateStatus.reservationStatus === 'confirmed')
        )
            throw new UnauthorizedException(
                'Only employees can checked-in or confirmed reservation',
            );

        if (updateStatus.reservationStatus === 'confirmed')
            return this.reservationService.updateStatus(
                reservationId,
                updateStatus,
            );
        if (updateStatus.reservationStatus === 'cancelled')
            return this.reservationService.cancel({
                reservationId,
                customerId: userRole === UserType.CUSTOMER ? userId : null,
                employeeId: userRole === UserType.EMPLOYEE ? userId : null,
            });

        return this.reservationService.updateStatus(
            reservationId,
            updateStatus,
        );
    }
}
