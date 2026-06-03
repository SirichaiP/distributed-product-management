import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
  })
  @IsEnum(OrderStatus)
  toStatus!: OrderStatus;

  @ApiProperty({
    example: '11111111-1111-1111-1111-111111111111',
    description: 'Admin/User id who changed status',
  })
  @IsUUID()
  changedBy!: string;

  @ApiPropertyOptional({
    example: 'Admin approved this order',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note?: string;
}