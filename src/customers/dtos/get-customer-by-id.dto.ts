import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class GetCustomerByIdDTO {
    @IsNumber()
    id: number;
    @IsBoolean()
    @IsOptional()
    showPhone: boolean;
    @IsBoolean()
    @IsOptional()
    showReservations: boolean;
    @IsBoolean()
    @IsOptional()
    showQueueTickets: boolean;
}
