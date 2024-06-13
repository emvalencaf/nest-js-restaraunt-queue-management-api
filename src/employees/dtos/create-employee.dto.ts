import { IsDateString, IsEmail, IsString, Length } from 'class-validator';
import { CreateEmployeeCredentialsDTO } from './create-employee-credentials.dto';
import { CreateEmployeePhoneDTO } from './create-employee-phone.dto';

export class CreateEmployeeDTO {
    @IsString()
    @Length(3, 45)
    firstName: string;
    @IsString()
    @Length(3, 45)
    lastName: string;
    @IsString()
    @Length(1, 1)
    sex: string;
    @IsDateString()
    birthday: string;
    @IsEmail()
    email: string;

    phone: CreateEmployeePhoneDTO;

    credentials: CreateEmployeeCredentialsDTO;
}
