import { UserType } from '../../enums/user-type.enum';

export class AuthEmployeeSignInDTO {
    id: number;
    username: string;
    userType: UserType;
    constructor(id: number, username: string) {
        this.id = id;
        this.username = username;
        this.userType = UserType.EMPLOYEE;
    }
}
