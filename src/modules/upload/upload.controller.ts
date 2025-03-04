import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Public } from '@/common/decorators/public.decorator';

@Controller('api/files')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 检查文件是否上传完成
  @Post('check')
  async checkFile(@Body() body: { fileHash: string; fileName: string }) {
    return await this.uploadService.checkFile(body.fileHash, body.fileName);
  }

  // 上传切片
  @Post('chunk')
  @UseInterceptors(FileInterceptor('chunk'))
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { fileHash: string; chunkIndex: number },
  ) {
    return await this.uploadService.saveChunk(
      file,
      body.fileHash,
      body.chunkIndex,
    );
  }

  // 合并切片
  @Post('merge')
  async mergeChunks(
    @Body() body: { fileHash: string; fileName: string; size: number },
  ) {
    return await this.uploadService.mergeChunks(
      body.fileHash,
      body.fileName,
      body.size,
    );
  }

  // 添加普通文件上传接口
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.saveFile(file);
  }
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return {
  //     code: 200,
  //     msg: '文件上传成功',
  //     data: {
  //       filename: file.filename,
  //       originalname: file.originalname,
  //       mimetype: file.mimetype,
  //       size: file.size,
  //     },
  //   };
  // }
}
