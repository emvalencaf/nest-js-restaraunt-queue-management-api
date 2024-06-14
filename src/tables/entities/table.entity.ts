import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TableStatus } from '../enums/table-status.enum';

@Entity('tables')
export class TableEntity {
    @PrimaryGeneratedColumn('increment', { name: 'table_id' })
    id: number;

    @Column({
        name: 'table_status',
        enum: TableStatus,
        nullable: true,
        default: TableStatus.AVAILABLE,
    })
    status: TableStatus;

    @Column({ name: 'table_max_capability', nullable: false })
    maxCapability: number;

    @Column({ name: 'table_is_combinable', nullable: true, default: true })
    isCombinable: boolean;
}
