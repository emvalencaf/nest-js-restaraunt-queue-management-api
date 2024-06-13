import {
    IsBoolean,
    IsNumberString,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
} from 'class-validator';

export class CreateEmployeePhoneDTO {
    @IsString()
    @IsPhoneNumber()
    @Length(9, 9)
    number: string;

    @IsNumberString()
    @Length(2, 2)
    codeArea: string;

    @IsBoolean()
    @IsOptional()
    isWhatsapp: boolean;
}
