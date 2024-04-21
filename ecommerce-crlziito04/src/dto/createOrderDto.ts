import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ProductId {
  @IsUUID()
  id: string;
}
export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Has to be UUID',
    example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
  })
  userId: string;

  @IsArray()
  @ApiProperty({
    description:
      'Has to be an array of objects with an ID property of type UUID',
    example:
      '[{"id":"887a8887-598b-4240-a7da-4c751a9ab2d3"},{"id":"887a8887-598b-4240-a7da-4c751a9ab2d3"}]',
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductId)
  products: ProductId[];
}
