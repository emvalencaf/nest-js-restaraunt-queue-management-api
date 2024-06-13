import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class GetCustomerByPhoneDTO {
    @IsString()
    @Length(9, 9)
    number: string;

    @IsString()
    @Length(2, 2)
    codeArea: string;

    @IsBoolean()
    @IsOptional()
    showPhone?: boolean = false;
}
