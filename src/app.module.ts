import { Module } from '@nestjs/common';

// modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
