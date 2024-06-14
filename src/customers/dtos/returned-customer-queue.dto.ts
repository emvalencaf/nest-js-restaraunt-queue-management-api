import { ReturnedCustomerQueueProcedureDTO } from './returned-customer-queue-procedure.dto';

export class ReturnedCustomerQueueDTO {
    queuePosition: number;
    id: number;
    firstName: string;
    lastName: string;
    hasSpecialNeeds: boolean;
    reservation: {
        id: number;
        requestedCapability: number;
        startDatetime: string;
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
            requestedCapability: queuePosition.reservation_requested_capability,
            startDatetime: queuePosition.reservation_start_datetime,
            checkedInDatetime: queuePosition.reservation_checked_in_datetime,
            isQueueTicket: Boolean(queuePosition.reservation_is_queue_ticket),
        };
    }
}
