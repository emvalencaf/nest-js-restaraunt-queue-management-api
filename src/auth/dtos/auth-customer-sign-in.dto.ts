import { IsNumberString, IsString, Length } from 'class-validator';

export class AuthCustomerSignInDTO {
    @IsString()
    @Length(9, 9)
    number: string;
    @IsNumberString()
    @Length(2, 2)
    codeArea: string;
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
}
