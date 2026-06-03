import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Order } from './order.entity';

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uniqueidentifier',
  })
  orderId!: string;

  @Column({
    type: 'nvarchar',
    length: 30,
    nullable: true,
  })
  fromStatus!: string | null;

  @Column({
    type: 'nvarchar',
    length: 30,
  })
  toStatus!: string;

  @Column({
    type: 'nvarchar',
    length: 100,
  })
  changedBy!: string;

  @Column({
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  note?: string | null;

  @CreateDateColumn({
    type: 'datetime2',
  })
  createdAt!: Date;

  @ManyToOne(
    () => Order,
    (order) => order.histories,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'orderId',
  })
  order!: Order;
}