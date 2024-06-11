import { IsString, Length } from 'class-validator';

export class GetCustomerByPhoneDTO {
    @IsString()
    @Length(9, 9)
    number: string;

    @IsString()
    @Length(2, 2)
    codeArea: string;
}
