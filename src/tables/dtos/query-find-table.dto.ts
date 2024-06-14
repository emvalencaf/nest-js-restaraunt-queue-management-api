import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TableStatus } from '../enums/table-status.enum';

export class QueryFindTableDTO {
    @IsEnum(TableStatus)
    @IsOptional()
    filterByStatus?: TableStatus;
    @IsInt()
    @IsOptional()
    filterByRequested?: number;
    @IsString()
    @IsOptional()
    filterByIsCombinable?: string;
}
