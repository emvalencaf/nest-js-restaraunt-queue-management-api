import { ReturnedFactQueueView } from './returned-fact-queue-view.dto';

// TO DO: criar um returned DTO para a view queue
export class ReturnedFactQueue {
    id: number;
    firstName: string;
    lastName: string;
    hasSpecialNeeds: boolean;
    reservation: {
        id: number;
        requestedCapability: number;
        recordDatetime: string;
        checkedInDatetime: string;
        isQueueTicket: boolean;
        averageWaitTime: string;
    };

    constructor(reservation: ReturnedFactQueueView) {
        this.id = reservation.customer_id;
        this.firstName = reservation.customer_first_name;
        this.lastName = reservation.customer_last_name;
        this.hasSpecialNeeds = Boolean(reservation.customer_has_special_needs);
        this.reservation = {
            id: reservation.reservation_id,
            requestedCapability: reservation.reservation_requested_capability,
            recordDatetime: reservation.reservation_record_datetime,
            checkedInDatetime: reservation.reservation_checked_in_datetime,
            isQueueTicket: Boolean(reservation.reservation_is_queue_ticket),
            averageWaitTime: reservation.reservation_average_wait_time,
        };
    }
}
