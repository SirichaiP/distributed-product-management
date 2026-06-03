import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  totalAmount: number;

  @Column({
    length: 10,
    default: 'THB',
  })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  cancelledAt?: Date;

  @Column({
    nullable: true,
  })
  completedAt?: Date;

  @OneToMany(
    () => OrderItem,
    (item) => item.order,
    {
      cascade: true,
    },
  )
  items: OrderItem[];

  @OneToMany(
    () => OrderStatusHistory,
    (history) => history.order,
    {
      cascade: true,
    },
  )
  histories: OrderStatusHistory[];
}