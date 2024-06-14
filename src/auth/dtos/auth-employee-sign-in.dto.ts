import { IsString, Length } from 'class-validator';

export class AuthEmployeeSignInDTO {
    @IsString()
    @Length(3, 45)
    username: string;
    @IsString()
    @Length(3, 60)
    password: string;
}
