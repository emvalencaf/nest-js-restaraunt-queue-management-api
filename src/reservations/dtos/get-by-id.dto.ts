import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class GetReservationById {
    @IsInt()
    reservationId: number;
    @IsBoolean()
    @IsOptional()
    showAssignedTables?: boolean = true;
    @IsBoolean()
    @IsOptional()
    showCancel?: boolean = true;
}
