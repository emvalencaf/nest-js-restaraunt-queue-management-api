import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from '../customers/customer.service';
import { AuthCustomerSignInDTO } from './dtos/auth-customer-sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthCustomerSignInPayloadDTO } from './dtos/auth-customer-sign-in-payload.dto';
import { AuthEmployeeSignInDTO } from './dtos/auth-employee-sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly customerService: CustomerService,
        private readonly jwtService: JwtService,
    ) {}

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

    async employeeSignIn(signIn: AuthEmployeeSignInDTO) {
        return signIn;
        /*
        return {
            accessToken: this.jwtService.sign({
                ...new AuthEmployeeSignInDTO(signIn),
            });
        };*/
    }
}
