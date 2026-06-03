import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Place new order',
    description: 'Create order with product snapshot and order items.',
  })
  @ApiBody({ type: PlaceOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order request.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  placeOrder(@Body() dto: PlaceOrderDto) {
    return this.ordersService.placeOrder(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all orders.',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  /**
   * สำคัญ:
   * ต้องวาง /user/:userId ก่อน /:id
   * ไม่งั้น Nest อาจจับ "user" เป็น id ของ @Get(':id')
   */
  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get orders by user id',
  })
  @ApiParam({
    name: 'userId',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @ApiResponse({
    status: 200,
    description: 'Return user orders.',
  })
  findByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.ordersService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by id',
  })
  @ApiParam({
    name: 'id',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @ApiResponse({
    status: 200,
    description: 'Return order detail.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Admin or system updates order status and stores status history.',
  })
  @ApiParam({
    name: 'id',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @ApiBody({ type: UpdateOrderStatusDto })
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel order',
  })
  @ApiParam({
    name: 'id',
    example: '11111111-1111-1111-1111-111111111111',
  })
  cancelOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.updateStatus(id, {
      toStatus: OrderStatus.CANCELLED,
      changedBy: '00000000-0000-0000-0000-000000000000',
      note: 'Order cancelled',
    });
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Complete order',
  })
  @ApiParam({
    name: 'id',
    example: '11111111-1111-1111-1111-111111111111',
  })
  completeOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.updateStatus(id, {
      toStatus: OrderStatus.COMPLETED,
      changedBy: '00000000-0000-0000-0000-000000000000',
      note: 'Order completed',
    });
  }
}