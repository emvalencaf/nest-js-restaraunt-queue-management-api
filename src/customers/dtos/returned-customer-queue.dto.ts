import { ReturnedCustomerQueueProcedureDTO } from './returned-customer-queue-procedure.dto';

export class ReturnedCustomerQueueDTO {
    queuePosition: number;
    id: number;
    firstName: string;
    lastName: string;
    hasSpecialNeeds: boolean;
    reservation: {
        id: number;
        averageWaitTime: string;
        requestedCapability: number;
        recordDatetime: string;
        checkedInDatetime: string;
        isQueueTicket: boolean;
    };

    constructor(queuePosition: ReturnedCustomerQueueProcedureDTO) {
        this.queuePosition = queuePosition.reservation_queue_position;
        this.id = queuePosition.customer_id;
        this.firstName = queuePosition.customer_first_name;
        this.lastName = queuePosition.customer_last_name;
        this.hasSpecialNeeds = Boolean(
            queuePosition.customer_has_special_needs,
        );
        this.reservation = {
            id: queuePosition.reservation_id,
            averageWaitTime: queuePosition.reservation_average_wait_time,
            requestedCapability: queuePosition.reservation_requested_capability,
            recordDatetime: queuePosition.reservation_record_datetime,
            checkedInDatetime: queuePosition.reservation_checked_in_datetime,
            isQueueTicket: Boolean(queuePosition.reservation_is_queue_ticket),
        };
    }
}
