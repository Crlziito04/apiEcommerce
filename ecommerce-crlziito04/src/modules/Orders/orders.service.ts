import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetail.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async addOrder(userId, products) {
    let total = 0;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const productsArr = await Promise.all(
      products.map(async (product) => {
        const findProduct = await this.productRepository.findOneBy({
          id: product.id,
        });
        if (!findProduct) return 'Product not found';

        if (findProduct.stock === 0) return null;
        total += Number(findProduct.price);

        await this.productRepository.update(
          { id: findProduct.id },
          { stock: findProduct.stock - 1 },
        );

        return findProduct;
      }),
    );

    console.log(await productsArr, 'todos los productos');

    const validProductsArr = await productsArr.filter(
      (product) => product !== null,
    );

    const order = {
      date: new Date(),
      user: user,
    };
    const newOrder = await this.orderRepository.save(order);

    const orderDetail = {
      price: Number(total.toFixed(2)),
      products: validProductsArr,
      order: newOrder,
    };
    await this.orderDetailRepository.save(orderDetail);

    return await this.orderRepository.find({
      where: { id: newOrder.id },
      relations: {
        orderDetail: true,
      },
    });
  }

  async getOrder(id) {
    const findOrder = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['user', 'orderDetail', 'orderDetail.products'],
    });
    if (!findOrder) throw new NotFoundException('Order not found');

    return findOrder;
  }
}
