import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { TableStatus } from '../enums/table-status.enum';

export class CreateTableDTO {
    @IsEnum(TableStatus)
    @IsOptional()
    status: TableStatus = TableStatus.AVAILABLE;

    @IsInt()
    maxCapability: number;

    @IsBoolean()
    @IsOptional()
    isCombinable: boolean = true;
}
