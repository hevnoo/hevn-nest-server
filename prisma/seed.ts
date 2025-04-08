// prisma/seed.ts
/* 初始化添加数据，npx prisma db seed */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {
  dictTypeData,
  dictData,
  roleData,
  buttonData,
  menuData,
  departmentData,
} from './seed-data';

async function createDictType() {
  const newData: any = [];
  for (const item of dictTypeData) {
    newData.push(
      await prisma.dict_type.upsert({
        where: {
          value_deletetime: {
            value: item.value,
            deletetime: BigInt(0),
          },
        },
        update: {},
        create: {
          name: item.name,
          value: item.value,
          description: item.description,
        },
      }),
    );
  }
  return newData;
}

async function createDict(dictTypeData) {
  const newData: any = [];
  for (const item of dictTypeData) {
    for (const subItem of dictData.filter(
      (f) => f.dict_type_id_value === item.value,
    )) {
      newData.push(
        await prisma.dict.upsert({
          where: {
            dict_value_dict_type_id_language_deletetime: {
              dict_value: subItem.dict_value,
              language: subItem.language,
              dict_type_id: item.id,
              deletetime: BigInt(0),
            },
          },
          update: {},
          create: {
            dict_name: subItem.dict_name,
            dict_value: subItem.dict_value,
            language: subItem.language,
            dict_type_id: item.id,
          },
        }),
      );
    }
  }

  return newData;
}

async function createRoles() {
  const newData: any = [];
  for (const item of roleData) {
    newData.push(
      await prisma.roles.upsert({
        where: {
          value_deletetime: {
            value: item.value,
            deletetime: BigInt(0),
          },
        },
        update: {},
        create: {
          name: item.name,
          value: item.value,
          order: item.order,
        },
      }),
    );
  }
  return newData;
}

async function createMenu(rolesData) {
  // 1. 先创建所有顶级菜单（parent_value 为空的）
  for (const menu of menuData.filter((item) => !item.parent_value)) {
    await prisma.menu.upsert({
      where: {
        name_parent_id_deletetime: {
          name: menu.name,
          parent_id: '',
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        title: menu.title,
        name: menu.name,
        path: menu.path,
        component: menu.component,
        redirect: menu.redirect,
        meta: menu.meta,
        icon: menu.icon,
        order: menu.order,
        roles: {
          // connect: rolesData.map((role) => ({ id: role.id })),
          // 给超级管理员分配菜单，管理员拥有菜单权限
          connect: rolesData.filter((role) => role.value.includes('admin')),
        },
      },
    });
  }

  // 2. 获取所有已创建的菜单，用于查找父级ID
  let existingMenus = await prisma.menu.findMany({
    where: { deletetime: BigInt(0) },
  });

  // 3. 创建子菜单
  for (const menu of menuData.filter((item) => item.parent_value)) {
    const parentMenu = existingMenus.find((m) => m.name === menu.parent_value);
    if (!parentMenu) {
      console.warn(
        `找不到父菜单: ${menu.parent_value}, 跳过创建: ${menu.name}`,
      );
      continue;
    }

    existingMenus.push(
      await prisma.menu.upsert({
        where: {
          name_parent_id_deletetime: {
            name: menu.name,
            parent_id: parentMenu.id,
            deletetime: BigInt(0),
          },
        },
        update: {},
        create: {
          title: menu.title,
          name: menu.name,
          path: menu.path,
          component: menu.component,
          redirect: menu.redirect,
          meta: menu.meta,
          icon: menu.icon,
          order: menu.order,
          parent_id: parentMenu.id,
          roles: {
            // 给超级管理员分配菜单，管理员拥有菜单权限
            connect: rolesData.filter((role) => role.value.includes('admin')),
          },
        },
      }),
    );
  }
}

async function createDepartment() {
  // 1. 先创建所有顶级（parent_value 为空的）
  for (const department of departmentData.filter(
    (item) => !item.parent_value,
  )) {
    await prisma.department.upsert({
      where: {
        code_parent_id_deletetime: {
          code: department.code,
          parent_id: '',
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: department.name,
        code: department.code,
        order: department.order,
      },
    });
  }

  // 2. 获取所有已创建的，用于查找父级ID
  let existingDepartments = await prisma.department.findMany({
    where: { deletetime: BigInt(0) },
  });

  // 3. 创建子级别
  for (const department of departmentData.filter((item) => item.parent_value)) {
    const parentDepartment = existingDepartments.find(
      (m) => m.code === department.parent_value,
    );
    if (!parentDepartment) {
      console.warn(
        `找不到父级: ${department.parent_value}, 跳过创建: ${department.code}`,
      );
      continue;
    }

    existingDepartments.push(
      await prisma.department.upsert({
        where: {
          code_parent_id_deletetime: {
            code: department.code,
            parent_id: parentDepartment.id,
            deletetime: BigInt(0),
          },
        },
        update: {},
        create: {
          name: department.name,
          code: department.code,
          order: department.order,
          parent_id: parentDepartment.id,
        },
      }),
    );
  }
}

async function main() {
  const dictTypeData = await createDictType();
  await createDict(dictTypeData);
  const rolesData = await createRoles();
  await createMenu(rolesData);
  await createDepartment();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function arrayToTree(
  items,
  idField = 'id',
  parentIdField = 'parentId',
  childrenField = 'children',
) {
  const itemMap = {};

  // 初始化每个节点
  items.forEach((item) => {
    itemMap[item[idField]] = { ...item, [childrenField]: [] };
  });

  const tree: any = [];

  // 构建树结构
  items.forEach((item) => {
    if (item[parentIdField] === null) {
      // 根节点
      tree.push(itemMap[item[idField]]);
    } else {
      // 子节点
      const parent = itemMap[item[parentIdField]];
      if (parent) {
        parent[childrenField].push(itemMap[item[idField]]);
      }
    }
  });

  return tree;
}

/* 
  使用 upsert 操作，它的工作原理是：
  首先根据 where 条件查找记录：
  where: { value_deletetime: { value: 'super_admin', deletetime: BigInt(0) } },
  如果找到匹配的记录，则执行 update 操作，更新记录的值。
  如果未找到匹配的记录，则执行 create 操作，创建新的记录。
  */
