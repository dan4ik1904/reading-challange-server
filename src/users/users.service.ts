import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {

    constructor(private readonly prisma:PrismaService){}

    async findAll() {
        const users = await this.prisma.users.findMany()
        console.log(users)
        return users
    }

    async getTop() {
        const users = await this.prisma.users.findMany({
            orderBy: {
                pagesCount: 'desc'
            }
        })
        return users
    }

    async getClassmates(tgId: number) {
        const session = await this.prisma.users_sessions.findFirst({
            where: {
                tgId
            }
        })
        const user = await this.prisma.users.findFirst({
            where: {
                id: session.userId
            }
        })
        const users = this.prisma.users.findMany({
            where: {
                className: user.className
            },
            orderBy: {
                pagesCount: 'desc'
            }
        })
        return users
    }

}
