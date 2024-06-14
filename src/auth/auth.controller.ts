import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { AuthCustomerSignInDTO } from './dtos/auth-customer-sign-in.dto';
import { AuthEmployeeSignInDTO } from './dtos/auth-employee-sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('/customers')
    @UsePipes(ValidationPipe)
    async signInCustomer(@Body() signIn: AuthCustomerSignInDTO) {
        try {
            return this.authService.customerSignIn(signIn);
        } catch (err) {
            return {
                result: err,
                statusCode: err,
            };
        }
    }

    @Public()
    @Post('/employee')
    @UsePipes(ValidationPipe)
    async signInEmployee(@Body() signIn: AuthEmployeeSignInDTO) {
        try {
            return this.authService.employeeSignIn(signIn);
        } catch (err) {
            console.error(err);
            return {
                result: err,
                status: err,
            };
        }
    }
}
