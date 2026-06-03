import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column({
    length: 300,
  })
  productName: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  unitPrice: number;

  @Column()
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  lineTotal: number;

  @ManyToOne(
    () => Order,
    (order) => order.items,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'orderId',
  })
  order: Order;
}