import { IsArray } from 'class-validator';

export class AssignTablesDTO {
    @IsArray()
    tablesId: number[];
}
