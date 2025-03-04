// 基础响应接口
export interface BaseResponse<T = any> {
  code: number;
  msg: string;
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  [key: string]: any;
}

// Prisma 排序方向
export type SortOrder = 'asc' | 'desc';

// 排序配置
export type OrderByInput = {
  [key: string]: SortOrder;
};

// 查询参数接口
export interface QueryParams {
  // 分页参数
  page?: number;
  pageSize?: number;

  // 基础查询条件
  include?: string | string[] | Record<string, boolean>;

  // 高级查询选项
  where?: Record<string, any>; // 自定义where条件
  orderBy?: OrderByInput | OrderByInput[]; // 排序
  select?: Record<string, boolean>; // 选择特定字段
  distinct?: string | string[]; // 去重字段
  skip?: number; // 跳过记录数，一般与page互斥
  take?: number; // 获取记录数，一般与pageSize互斥
  cursor?: Record<string, any>; // 游标分页

  [key: string]: any;
}

// 创建参数对象
export interface CreateParamsObject {
  include?: string | string[] | Record<string, boolean>;
  [key: string]: any;
}

// 创建参数类型
export type CreateParams = CreateParamsObject | CreateParamsObject[];

// 更新参数对象
export interface UpdateParamsObject {
  id: number;
  include?: string | string[] | Record<string, boolean>;
  [key: string]: any;
}

// 更新参数类型
export type UpdateParams = UpdateParamsObject | UpdateParamsObject[];

// 删除参数对象接口
export interface DeleteParamsBase {
  id: string | number;
  include?: string | string[] | Record<string, boolean>;
}
// 删除参数对象接口（必须包含 id 或 ids）
export type DeleteParamsObject =
  | DeleteParamsBase
  | ({
      ids: (string | number)[];
      include?: string | string[] | Record<string, boolean>;
    } & {
      [K: string]: never; // 禁止添加其他属性
    });

// 删除参数类型
export type DeleteParams =
  | string
  | number
  | (string | number)[]
  | DeleteParamsObject
  | DeleteParamsBase[]; // 新增支持数组对象格式

// 真实删除参数类型（与删除参数相同）
export type HardDeleteParams = DeleteParams;
