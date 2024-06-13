import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class UpdateReservationStatusDTO {
    @IsEnum(ReservationStatus)
    reservationStatus: ReservationStatus;
}
