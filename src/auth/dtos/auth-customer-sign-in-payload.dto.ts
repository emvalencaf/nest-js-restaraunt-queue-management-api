import { CustomerEntity } from '../../customers/entities/customer.entity';
import { UserType } from '../../enums/user-type.enum';

export class AuthCustomerSignInPayloadDTO {
    id: number;
    phone: {
        number: string;
        codeArea: string;
    };
    userType: UserType;

    constructor(customer: CustomerEntity) {
        this.id = customer.id;
        this.phone = {
            number: customer.phone.number,
            codeArea: customer.phone.codeArea,
        };
        this.userType = UserType.CUSTOMER;
    }
}
