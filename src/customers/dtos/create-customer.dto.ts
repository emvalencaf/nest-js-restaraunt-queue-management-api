import {
    IsBoolean,
    IsDateString,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { CreateCustomerPhoneDTO } from './create-customer-phone.dto';

export class CreateCustomerDTO {
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

    @IsBoolean()
    @IsOptional()
    has_special_needs: boolean;

    phone: CreateCustomerPhoneDTO;
}
