import { HttpException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';


@Injectable()
export class AuthService {

    constructor(private readonly prisma:PrismaService){}

    async auth(authDto: AuthDto) {
        try {
            const checkUser = await this.prisma.users.findFirst({
                where: {
                    fullName: authDto.fullName,
                    className: authDto.className
                }
            })
            if(!checkUser) {
                await this.prisma.users.create({
                    data: {
                        className: authDto.className,
                        fullName: authDto.fullName
                    }
                })
                const user = await this.prisma.users.findFirst({
                    where: {
                        fullName: authDto.fullName,
                        className: authDto.className
                    }
                })
                await this.prisma.users_sessions.create({
                    data: {
                        tgId: authDto.tgId,
                        userId: user.id
                    }
                })
            }else {
                await this.prisma.users_sessions.create({
                    data: {
                        userId: checkUser.id,
                        tgId: authDto.tgId
                    }
                })
            }
            return {message: 'secsess'}
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async getMe(tgId: number) {
        const session = await this.prisma.users_sessions.findFirst({
            where: {
                tgId: Number(tgId)
            }
        })
        if(!session) return {auth: false}

        const user = await this.prisma.users.findFirst({
            where: {
                id: session.userId
            }
        })
        return user
    }

    async getMySessions(tgId: number) {
        try {
            const session = await this.prisma.users_sessions.findFirst({
                where: {
                    tgId: Number(tgId)
                }
            })
            const user = await this.prisma.users.findFirst({
                where: {
                    id: session.userId
                }
            })
            const sessions = await this.prisma.users_sessions.findMany({
                where: {
                    userId: user.id
                }
            })
            return sessions
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async updateMe(tgId: number, updateMeDto: UpdateMeDto) {
        await this.prisma.users_sessions.findFirst({
            where: {tgId}
        })
    }

    async authLogout(tgId: number) {
        try {
            const session = await this.prisma.users_sessions.findFirst({
                where: {
                    tgId
                }
            })
            const sessionDelete = await this.prisma.users_sessions.delete({
                where: {
                    id: session.id
                }
            })
            return sessionDelete
        } catch (error) {
            
        }
    }

}
