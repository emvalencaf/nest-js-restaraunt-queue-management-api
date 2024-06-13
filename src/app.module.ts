import { Module } from '@nestjs/common';

// modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customers/customer.module';
import { ReservationModule } from './reservations/reservation.modules';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employees/employee.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development.local'],
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            password: process.env.DB_PASSWORD,
            username: process.env.DB_USER,
            port: Number(process.env.DB_PORT),
            entities: [`${__dirname}/**/*.entity{.js,.ts}`],
            synchronize: false,
        }),
        CustomerModule,
        ReservationModule,
        JwtModule,
        AuthModule,
        EmployeeModule,
    ],
    controllers: [],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
