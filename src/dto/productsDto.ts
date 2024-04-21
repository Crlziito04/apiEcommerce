import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { checkDecimal } from 'src/decorators/checkDecimal.decorator';

export class productsDto {
  @ApiProperty({
    description: 'Name has be a string, maxLength 50',
    example: 'Xbox 360',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Some description about the product',
    example: '1TB,Black',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsPositive()
  @Validate(checkDecimal)
  @ApiProperty({
    description: 'Price is a number with two decimals',
    example: '120.63',
  })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Stock has to be positive, greater than zero',
    example: '2',
  })
  stock: number;

  @IsOptional()
  @ApiProperty({
    description: 'Has to be a valid URL',
    example:
      'https://http2.mlstatic.com/D_NQ_NP_2X_600412-MLU75698212761_042024-F.webp',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Has to be a string, maxLength is 50',
    example: 'console, phone, monitor,',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  category: string;
}

export class UpdateProduct extends PartialType(productsDto) {}
