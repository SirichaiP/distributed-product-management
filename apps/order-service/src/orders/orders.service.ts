import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(OrderStatusHistory)
    private readonly statusHistoryRepository: Repository<OrderStatusHistory>,
  ) {}

  async placeOrder(
    dto: PlaceOrderDto,
    authorization?: string,
  ): Promise<Order> {
    const totalAmount = dto.items.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);

    const order = this.orderRepository.create({
      userId: dto.userId,
      status: OrderStatus.PENDING,
      totalAmount,
      currency: dto.currency ?? 'THB',
      items: dto.items.map((item) =>
        this.orderItemRepository.create({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.unitPrice * item.quantity,
        }),
      ),
      histories: [
        this.statusHistoryRepository.create({
          fromStatus: null,
          toStatus: OrderStatus.PENDING,
          changedBy: dto.userId,
          note: 'Order placed',
        }),
      ],
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderWithItems = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: {
        items: true,
        histories: true,
      },
    });

    if (!orderWithItems) {
      throw new NotFoundException(
        `Order id ${savedOrder.id} not found after created`,
      );
    }

    await this.publishStockReservedAsync(orderWithItems, authorization);

    return orderWithItems;
  }

  private async publishStockReservedAsync(
    order: Order,
    authorization?: string,
  ): Promise<void> {
    const payload = {
      eventName: 'StockReserved',
      orderId: order.id,
      userId: order.userId,
      items: (order.items ?? []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      occurredAt: new Date().toISOString(),
    };

    console.log('Publish StockReserved event:', payload);
    console.log('Forward Authorization:', authorization ? 'YES' : 'NO');

    for (const item of payload.items) {
      const response = await fetch(
        `http://localhost:5012/api/products/${item.productId}/reserve-stock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authorization ? { Authorization: authorization } : {}),
          },
          body: JSON.stringify({
            quantity: item.quantity,
            referenceId: payload.orderId,
            reason: 'Order placed',
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Reserve stock failed. productId=${item.productId}, status=${response.status}, message=${errorText}`,
        );
      }

      console.log(
        `Reserved stock success. productId=${item.productId}, quantity=${item.quantity}`,
      );
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: {
        items: true,
        histories: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        items: true,
        histories: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order id ${id} not found`);
    }

    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: {
        items: true,
        histories: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    const oldStatus = order.status;
    order.status = dto.toStatus;

    if (dto.toStatus === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();
    }

    if (dto.toStatus === OrderStatus.COMPLETED) {
      order.completedAt = new Date();
    }

    const history = this.statusHistoryRepository.create({
      orderId: order.id,
      fromStatus: oldStatus,
      toStatus: dto.toStatus,
      changedBy: dto.changedBy,
      note: dto.note,
    });

    await this.orderRepository.save(order);
    await this.statusHistoryRepository.save(history);

    return this.findOne(id);
  }
}