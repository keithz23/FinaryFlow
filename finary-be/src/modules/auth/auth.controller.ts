import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';
import { TokenService } from '../token/token.service';
import { AuthGuard } from '@nestjs/passport';
import { CombinedAuthGuard } from './guards/combined.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SoftAuthGuard } from './guards/soft-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserEntity } from 'src/common/interfaces';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private configService: ConfigService,
  ) {}
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'cuid',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          roles: [],
          permissions: [],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return {
      statusCode: 201,
      message: 'Account created successfully',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      status: 200,
      message: 'Login successfully',
      data: { user },
    };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.tokenService.refreshToken(refreshTokenDto);
  }

  @UseGuards(SoftAuthGuard)
  @Get('check-auth')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check authentication' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  async checkAuth(@GetUser() user: UserEntity) {
    if (user) {
      return {
        isAuthenticated: true,
        user: user,
      };
    }
    return null;
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@GetUser() user: UserEntity, @Res() res: Response) {
    const response = await this.tokenService.generateTokens(user);

    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.redirect(this.configService.get('config.client.url'));
  }

  @UseGuards(CombinedAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  async logout(@GetUser('sub') userId: string, @Res() res: Response) {
    await this.authService.logout(userId);

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.status(200).json({ message: 'Successfully logged out' });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(CombinedAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser('sub') userId: string,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }

  @UseGuards(CombinedAuthGuard)
  @Post('me')
  async me(@Req() req: Request, @GetUser('sub') userId: string) {
    return this.authService.me(userId);
  }
}
