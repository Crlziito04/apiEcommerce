import { Module } from '@nestjs/common';
import { UsersModule } from './modules/Users/users.module';
import { ProductsModule } from './modules/Products/products.module';
import { AuthModule } from './modules/Auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './modules/Categories/categories.module';
import { OrdersModule } from './modules/Orders/orders.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

import typeOrmConfig from './config/typeorm2';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm2'),
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.SECRET_KEY,
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
