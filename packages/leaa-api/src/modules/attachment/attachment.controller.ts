import { Controller, Get, HttpCode, Body, UseInterceptors, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtGuard } from '@leaa/api/guards/jwt.guard';
import { AttachmentService } from '@leaa/api/modules/attachment/attachment.service';
import { SaveInOssService } from '@leaa/api/modules/attachment/save-in-oss.service';
import { ICraeteAttachmentByOssCallback, IAttachmentParams } from '@leaa/common/interfaces';

@Controller('/attachments')
export class AttachmentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly saveInOssService: SaveInOssService,
  ) {}

  @Get('')
  async test() {
    return '<code>-- NOT FOUND ATTACHMENT --</code>';
  }

  @Get('/signature')
  async getSignature() {
    return this.attachmentService.getSignature();
  }

  @Post('/oss/callback')
  async ossCallback(@Body() request: ICraeteAttachmentByOssCallback) {
    return this.saveInOssService.ossCallback(request);
  }

  @Post('/upload')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() body: IAttachmentParams, @UploadedFile() file: Express.Multer.File) {
    return this.attachmentService.craeteAttachmentByLocal(body, file);
  }
}
