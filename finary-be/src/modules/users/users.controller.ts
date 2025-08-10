import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Request } from 'express';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { S3Service } from 'src/services/s3.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // @Permissions('user:read')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async findAll(@Query() query: PaginationQueryDto) {
  //   return this.usersService.findAll(query);
  // }

  @Get(':id')
  @Permissions('user:read')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('upload-avatar')
  @UseGuards(CombinedAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }], multerOptions),
  )
  async uploadAvatar(
    @Body() uploadAvatarDto: UploadAvatarDto,
    @Req() req: Request,
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
  ) {
    const user = (req as any).user.sub;
    let uploadedImageUrl: string | undefined;

    if (files?.picture?.length) {
      const file = files.picture[0];
      const upload = await S3Service.uploadToS3({ imagePath: file }, 'avatar');
      uploadedImageUrl = upload.url;
    }

    return this.usersService.uploadAvatar(user, uploadedImageUrl);
  }
}
