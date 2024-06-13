import { IsDateString, IsInt, IsNumber } from 'class-validator';

export class CreateReservationDTO {
    @IsInt()
    @IsNumber()
    requestedCapability: number;

    @IsDateString()
    startDatetime: string;
}
