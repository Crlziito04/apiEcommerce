import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authController } from './auth.controller';
import { UsersRepository } from 'src/modules/Users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, UsersRepository],
  controllers: [authController],
})
export class AuthModule {}
