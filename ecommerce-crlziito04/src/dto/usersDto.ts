import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ConfirmPass } from '../decorators/matchPassword.decorator';
import { User } from 'src/entities/user.entity';

export class usersDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  @ApiProperty({
    description: 'Name has be a string, Length between 3 - 80',
    example: 'Carlos',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  @ApiProperty({
    description: 'Lastname has be a string, Length between 3 - 80',
    example: 'Perez',
  })
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'Has to be a valid email address',
    example: 'Pedro@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Password has to be alphanumeric, Length between 8 and 15, it must have at leats 1 number, 1 Capital letter and 1 Symbol',
    example: 'P@assw0rd123',
  })
  @MinLength(8)
  @MaxLength(15)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'This value has to be the same like in the password field',
    example: 'P@ssw0rd123',
  })
  @Validate(ConfirmPass, ['password'])
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: `Could be a street, avenue, etc`,
    example: 'Libertador Avenue',
  })
  @MaxLength(80)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]+$/, {
    message: 'Address must contain only numeric characters.',
  })
  @ApiProperty({
    description: 'Must has 8 digits',
    example: '1125463604',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({
    description: 'Name has be a string, Length between 5 - 20',
    example: 'Argentina',
  })
  country?: string | undefined;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({
    description: 'Name has be a string, Length between 5 - 80',
    example: 'Mercedes',
  })
  city?: string | undefined;
}

export class UpdateUser extends PartialType(usersDto) {}

export class users extends PartialType(User) {}
