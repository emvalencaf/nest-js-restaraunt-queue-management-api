import { IsString, IsStrongPassword } from 'class-validator';

export class CreateEmployeeCredentialsDTO {
    @IsString()
    username: string;
    @IsStrongPassword()
    password: string;
}
