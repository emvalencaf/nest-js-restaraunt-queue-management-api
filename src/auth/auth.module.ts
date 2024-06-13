import { Module } from '@nestjs/common';
import { CustomerModule } from '../customers/customer.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        CustomerModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET || 'default_secret',
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN || '3600S',
                },
            }),
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
