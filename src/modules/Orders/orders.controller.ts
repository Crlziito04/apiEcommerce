import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GuardToken } from 'src/guards/guardToken';
import { CreateOrderDto } from 'src/dto/createOrderDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetail.entity';
import { orderDetailDto } from 'src/dto/orderDetailDto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @HttpCode(200)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Orden Encontrada' })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrado',
  })
  @ApiOperation({
    summary: 'Obtener orden por ID',
    description:
      'Endpoint para obtener orden por ID. detalla los productos de la orden de compra, monto total, fecha de orden',
  })
  @UseGuards(GuardToken)
  getOrder(@Param('id', ParseUUIDPipe) id: string): Promise<orderDetailDto> {
    return this.ordersService.getOrder(id);
  }

  @HttpCode(201)
  @Post()
  @ApiResponse({ status: 201, description: 'Orden Creada' })
  @ApiResponse({
    status: 404,
    description: 'User no encontrado',
  })
  @ApiOperation({
    summary: 'Crear nueva orden de compra',
    description:
      'Endpoint para crear orden de compra. Devuelve el id de la orden, Fecha, Id de OrdenDetail y monto total',
  })
  @UseGuards(GuardToken)
  addOrder(@Body() order: CreateOrderDto): Promise<Order[]> {
    const { userId, products } = order;

    return this.ordersService.addOrder(userId, products);
  }
}
