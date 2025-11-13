import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const auth = (request.headers['authorization'] || '') as string
    if (!auth.startsWith('Bearer ')) throw new UnauthorizedException()
    const token = auth.slice(7)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    let payload: any
    try {
      payload = jwt.verify(token, secret)
    } catch {
      throw new UnauthorizedException()
    }
    request.user = payload
    const allowed = this.reflector.get<string[]>('roles', context.getHandler()) || []
    if (allowed.length && !allowed.includes(payload.role)) throw new UnauthorizedException()
    return true
  }
}

