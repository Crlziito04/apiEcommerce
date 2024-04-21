import { PartialType } from '@nestjs/swagger';
import { OrderDetail } from 'src/entities/orderDetail.entity';

export class orderDetailDto extends PartialType(OrderDetail) {}
