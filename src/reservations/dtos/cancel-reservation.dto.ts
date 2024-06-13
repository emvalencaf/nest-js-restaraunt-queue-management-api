import { IsInt } from 'class-validator';

export class CancelReservationDTO {
    @IsInt()
    customerId?: number;
    @IsInt()
    employeeId?: number;
    @IsInt()
    reservationId: number;
}
