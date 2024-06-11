import {
    IsBoolean,
    IsNumberString,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
} from 'class-validator';

export class CreateCustomerPhoneDTO {
    @IsString()
    @IsPhoneNumber()
    number: string;

    @IsNumberString()
    @Length(2, 2)
    codeArea: string;

    @IsBoolean()
    @IsOptional()
    isWhatsapp: boolean;
}
