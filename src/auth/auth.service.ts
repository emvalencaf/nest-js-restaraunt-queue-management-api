import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from '../customers/customer.service';
import { AuthCustomerSignInDTO } from './dtos/auth-customer-sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthCustomerSignInPayloadDTO } from './dtos/auth-customer-sign-in-payload.dto';
import { AuthEmployeeSignInDTO } from './dtos/auth-employee-sign-in.dto';
import { EmployeeService } from '../employees/employee.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly customerService: CustomerService,
        private readonly employeeService: EmployeeService,
        private readonly jwtService: JwtService,
    ) {}

    async employeeSignIn(signIn: AuthEmployeeSignInDTO) {
        const employee =
            await this.employeeService.getCredentialsByUsername(signIn);
        console.log(employee);
    }
    // sign in as a customer
    async customerSignIn(signIn: AuthCustomerSignInDTO) {
        const customer = await this.customerService.getByNumber({
            codeArea: signIn.codeArea,
            number: signIn.number,
            showPhone: true,
        });

        if (!customer) throw new UnauthorizedException('Phone number invalid');

        console.log(process.env.JWT_SECRET);
        return {
            accessToken: this.jwtService.sign({
                ...new AuthCustomerSignInPayloadDTO(customer),
            }),
        };
    }
}
