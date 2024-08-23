import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthorBookGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const tgId = req.headers.authorization;

    if (!tgId) throw new HttpException({message: 'No authorizade'}, 401);

    const session = await this.prisma.users_sessions.findFirst({
        where: {
            tgId: Number(tgId)
        }
    })
    const user = await this.prisma.users.findFirst({
        where: { id: session.userId }
    })
    const book = await this.prisma.books.findFirst({
        where: {
            userId: session.userId
        }
    }) 

    console.log(user.id, book.userId)

    if(user.id != book.userId) throw new HttpException({message: 'No authorizade'}, 403)
    return true
    
  }
}