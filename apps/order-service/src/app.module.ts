import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersModule } from './orders/orders.module';

import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { OrderStatusHistory } from './orders/entities/order-status-history.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('DB_HOST:', config.get<string>('DB_HOST'));
        console.log('DB_PORT:', config.get<string>('DB_PORT'));
        console.log('DB_DATABASE:', config.get<string>('DB_DATABASE'));

        return {
          type: 'mssql',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<string>('DB_PORT')),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),

          entities: [Order, OrderItem, OrderStatusHistory],

          synchronize: true,
          logging: true,

          options: {
            encrypt: false,
            trustServerCertificate:
              config.get<string>('DB_TRUST_SERVER_CERTIFICATE') === 'true',
          },
        };
      },
    }),
    AuthModule,

    OrdersModule,
  ],
})
export class AppModule {}