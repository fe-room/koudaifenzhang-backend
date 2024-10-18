import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountBooksModule } from './account_books/account_books.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 配置模块，用于应用全局配置。
    ConfigModule.forRoot({
      isGlobal: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    // 数据库模块配置，使用mysql数据库。
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development', // 开发时使用，生产环境请改为false
    }),
    UsersModule,
    AccountBooksModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
