import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
// npm install fs-extra @types/fs-extra
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  // 修改为绝对路径
  private readonly uploadDir = path.join(process.cwd(), 'uploads'); // 文件上传目录
  private readonly chunkDir = 'chunks'; // 切片目录

  // 计算文件的 MD5 Hash值
  private calculateHash(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  constructor() {
    // 确保目录存在
    fs.ensureDirSync(this.uploadDir);
    fs.ensureDirSync(path.join(this.uploadDir, this.chunkDir));
  }

  // 检查文件是否上传完成
  async checkFile(fileHash: string, fileName: string) {
    if (!fileHash || !fileName) {
      throw new Error('fileHash and fileName are required');
    }
    const filePath = path.join(this.uploadDir, fileName);
    const chunksPath = path.join(this.uploadDir, this.chunkDir, fileHash);

    // 检查文件是否已经上传完成
    if (await fs.pathExists(filePath)) {
      return {
        code: 200,
        msg: '文件已上传',
        shouldUpload: false,
      };
    }

    // 获取已上传的切片列表
    let uploadedChunks: string[] = [];
    if (await fs.pathExists(chunksPath)) {
      uploadedChunks = await fs.readdir(chunksPath);
    }

    return {
      code: 200,
      msg: 'pending',
      shouldUpload: true,
      uploadedChunks,
    };
  }

  // 保存切片
  async saveChunk(
    file: Express.Multer.File,
    fileHash: string,
    chunkIndex: number,
  ) {
    const chunksPath = path.join(this.uploadDir, this.chunkDir, fileHash);
    await fs.ensureDir(chunksPath);

    const chunkPath = path.join(chunksPath, chunkIndex.toString());
    await fs.writeFile(chunkPath, file.buffer);

    return {
      code: 200,
      msg: '切片上传成功',
    };
  }

  // 合并切片
  async mergeChunks(fileHash: string, fileName: string, size: number) {
    const chunksPath = path.join(this.uploadDir, this.chunkDir, fileHash);
    const filePath = path.join(this.uploadDir, fileName);

    // 获取所有切片
    const chunks = await fs.readdir(chunksPath);
    chunks.sort((a, b) => parseInt(a) - parseInt(b));

    // 创建写入流
    const writeStream = fs.createWriteStream(filePath);

    for (const chunk of chunks) {
      const chunkPath = path.join(chunksPath, chunk);
      const buffer = await fs.readFile(chunkPath);
      writeStream.write(buffer);
    }

    writeStream.end();

    // 清理切片文件夹
    await fs.remove(chunksPath);

    return {
      code: 200,
      msg: '文件已成功合并',
    };
  }

  // 普通文件上传
  async saveFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }
    // 计算文件 hash
    const fileHash = this.calculateHash(file.buffer);
    try {
      // 检查文件是否已存在
      const files = await fs.readdir(this.uploadDir);
      for (const f of files) {
        // 跳过目录
        const filePath = path.join(this.uploadDir, f);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) continue;

        // 只检查文件名中包含相同 hash 的文件
        if (f.startsWith(fileHash)) {
          return {
            code: 200,
            msg: '文件已存在',
            url: `/uploads/${f}`,
            fileName: f,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            fileHash,
          };
        }
      }

      // 如果文件不存在，保存新文件
      const fileName = `${fileHash}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);

      return {
        code: 200,
        msg: '文件上传成功',
        url: `/uploads/${fileName}`,
        fileName: fileName,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        fileHash,
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error('文件上传失败');
    }
  }
}
