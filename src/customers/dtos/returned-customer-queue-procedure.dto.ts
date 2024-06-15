export class ReturnedCustomerQueueProcedureDTO {
    reservation_queue_position: number;
    customer_id: number;
    customer_has_special_needs: boolean;
    customer_first_name: string;
    customer_last_name: string;
    reservation_id: number;
    reservation_requested_capability: number;
    reservation_record_datetime: string;
    reservation_checked_in_datetime: string;
    reservation_average_wait_time: string;
    reservation_is_queue_ticket: boolean;
}
