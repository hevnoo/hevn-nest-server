/*
  handleInclude()支持三种 include 参数格式：
  字符串形式：include=roles,menu
  数组形式：include=['roles', 'menu']
  对象形式：include={roles: true, menu: true}
*/
export const parseInclude = (
  include?: string | string[] | Record<string, boolean>,
): Record<string, boolean> => {
  let includes = {};

  if (!include) return includes;

  if (typeof include === 'string') {
    // 支持字符串形式：include=roles,menu
    includes = include.split(',').reduce((acc, rel) => {
      acc[rel.trim()] = true;
      return acc;
    }, {});
  } else if (Array.isArray(include)) {
    // 支持数组形式：include=['roles', 'menu']
    includes = include.reduce((acc, rel) => {
      acc[rel] = true;
      return acc;
    }, {});
  } else if (typeof include === 'object') {
    // 支持对象形式：include={roles: true, menu: true}
    includes = include;
  }

  return includes;
};

// 处理关联关系的通用方法
export const formatRelations = (payload: any, isCreate = false): any => {
  const data = { ...payload };

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // 处理数组类型的值
    if (Array.isArray(value)) {
      if (value.length === 0) {
        // 创建时空数组使用 connect，而不是 set
        data[key] = isCreate ? { connect: [] } : { set: [] };
      } else if (typeof value[0] === 'number' || typeof value[0] === 'string') {
        data[key] = {
          [isCreate ? 'connect' : 'set']: value.map((id) => ({
            id: !isNaN(id) ? parseInt(id) : id,
          })),
        };
      }
    }
    // 处理对象类型的值
    else if (typeof value === 'object' && value !== null) {
      const validOperators = [
        'connect',
        'disconnect',
        'set',
        'create',
        'update',
        'upsert',
        'delete',
        'connectOrCreate',
        'updateMany',
        'deleteMany',
      ];

      const hasValidOperator = validOperators.some(
        (op) => value[op] !== undefined,
      );

      if (hasValidOperator) {
        data[key] = value;
      }
    }
  });

  return data;
};

// 将bigint类型转换为number类型，js无法直接将bigint进行转换JSON
export const transformBigIntToNumber = (data: any): any => {
  // const biginitList = ['deletetime']; // bigint类型的字段列表，将bigint类型的数据转成number.返回客户端
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => transformBigIntToNumber(item));
  }

  const transformed = { ...data };
  for (const key in transformed) {
    if (typeof transformed[key] === 'bigint') {
      transformed[key] = Number(transformed[key]);
    } else if (
      // console.log('transformed[key]', key, transformed[key]),
      typeof transformed[key] === 'object' &&
      transformed[key] !== null &&
      !(transformed[key] instanceof Date)
    ) {
      transformed[key] = transformBigIntToNumber(transformed[key]);
    }
  }
  return transformed;
};
