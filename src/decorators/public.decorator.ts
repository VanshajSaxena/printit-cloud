import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): RequestUser | undefined => {
    return ctx.switchToHttp().getRequest<{ user: RequestUser | undefined }>()
      .user;
  },
);

export interface RequestUser {
  sub: number;
  email: string;
  username: string;
  slug: string;
}
