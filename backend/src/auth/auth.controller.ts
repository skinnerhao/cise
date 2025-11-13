import { Body, Controller, Post } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { User } from '../schemas/user.schema'
import { IsEmail, IsIn, IsString } from 'class-validator'

class RegisterDto {
  @IsEmail() email: string
  @IsString() password: string
  @IsIn(['submitter', 'reviewer', 'analyst']) role: 'submitter' | 'reviewer' | 'analyst'
}
class LoginDto {
  @IsEmail() email: string
  @IsString() password: string
}

@Controller('api/auth')
export class AuthController {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const email = (body.email || '').trim().toLowerCase()
    const role = body.role
    if (!email || !body.password || !role) return { error: '缺少必填项' }
    const exists = await this.userModel.findOne({ email })
    if (exists) return { error: '邮箱已注册' }
    const hash = await bcrypt.hash(body.password, 10)
    await this.userModel.create({ email, passwordHash: hash, role })
    return { success: true }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const email = (body.email || '').trim().toLowerCase()
    const user = await this.userModel.findOne({ email })
    if (!user) return { error: '用户不存在' }
    const ok = await bcrypt.compare(body.password || '', (user as any).passwordHash)
    if (!ok) return { error: '密码错误' }
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ sub: String((user as any)._id), email, role: (user as any).role }, secret, { expiresIn: '7d' })
    return { token, role: (user as any).role }
  }
}
