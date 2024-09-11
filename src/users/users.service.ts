import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {

    constructor(private readonly prisma:PrismaService){}


    async getUserByTgId(tgId: number) {
        try {
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
            return user
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async findAll() {
        try {
            const users = await this.prisma.users.findMany()
            console.log(users)
            return users
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async getTop() {
        try {
            const users = await this.prisma.users.findMany({
                orderBy: {
                    pagesCount: 'desc'
                }
            })
            return users
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async getClassmates(tgId: number) {
        try {
            const user = await this.getUserByTgId(tgId)
            const users = this.prisma.users.findMany({
                where: {
                    className: user.className
                },
                orderBy: {
                    pagesCount: 'desc'
                }
            })
            return users
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

}
