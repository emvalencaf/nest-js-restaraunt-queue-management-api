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

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('/customers')
    @UsePipes(ValidationPipe)
    async signIn(@Body() signIn: AuthCustomerSignInDTO) {
        try {
            console.log(signIn);
            return this.authService.customerSignIn(signIn);
        } catch (err) {
            return {
                result: err,
                statusCode: err,
            };
        }
    }
}
