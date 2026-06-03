import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlaceOrderItemDto {
  @ApiProperty({
    example: '7D4D7D33-0A9F-4B6E-8C10-222222222222',
    description: 'Product id from Catalog Service',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'Product name snapshot at order time',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  productName!: string;

  @ApiProperty({
    example: 39900,
    description: 'Unit price snapshot at order time',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice!: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity ordered',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PlaceOrderDto {
  @ApiProperty({
    example: '11111111-1111-1111-1111-111111111111',
    description: 'User id who placed the order',
  })
  @IsUUID()
  userId!: string;

  @ApiPropertyOptional({
    example: 'THB',
    default: 'THB',
    description: 'Order currency',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency: string = 'THB';

  @ApiProperty({
    type: [PlaceOrderItemDto],
    description: 'Order items with product snapshot',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemDto)
  items!: PlaceOrderItemDto[];
}