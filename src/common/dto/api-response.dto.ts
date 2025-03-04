// 接口返回数据结构
export class ApiResponseDto<T = any> {
  code: number;
  msg: string;
  data?: T;
  [key: string]: any;

  constructor(code: number, msg: string, data?: T) {
    this.code = code;
    this.msg = msg;
    if (data) {
      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.assign(this, data);
      } else {
        this.data = data;
      }
    }
  }
}
