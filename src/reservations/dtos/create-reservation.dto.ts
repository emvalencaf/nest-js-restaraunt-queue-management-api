import { IsBoolean, IsDateString, IsInt, IsNumber } from 'class-validator';
import { format } from 'date-fns';

export class CreateReservationDTO {
    @IsInt()
    @IsNumber()
    requestedCapability: number;

    @IsDateString()
    recordDatetime?: string = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');

    @IsBoolean()
    isQueueTicket?: boolean = false;
}
