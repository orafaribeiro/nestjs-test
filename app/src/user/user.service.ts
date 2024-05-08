import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  create({ email, name, password }: CreateUserDto) {
    return this.prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {

    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {

      throw new NotFoundException('Usuário não encontrado');

    }

    return user;

  }

  update(id: number, { email, name, password }: UpdateUserDto) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        email,
        name,
        password,
      },
    });
  }

  remove(id: number) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
}
