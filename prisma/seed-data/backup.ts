// prisma/seed.ts
/* 初始化添加数据，npx prisma db seed */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { roleTypes, buttonTypes, menuDict } from './seed-data';

async function main() {
  // 1. 初始化角色相关字典
  for (const role of roleTypes) {
    await prisma.dict.upsert({
      where: {
        dict_code_dict_type_id_deletetime: {
          code: 'role_type',
          value: role.value,
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: '角色类型',
        code: 'role_type',
        value: role.value,
        label: role.label,
        type: 'string',
        order: role.order,
        status: 1,
      },
    });
  }

  // 2. 初始化按钮权限相关字典
  for (const btn of buttonTypes) {
    await prisma.dict.upsert({
      where: {
        dict_code_dict_type_id_deletetime: {
          code: 'button_type',
          value: btn.value,
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: '按钮类型',
        code: 'button_type',
        value: btn.value,
        label: btn.label,
        type: 'string',
        order: btn.order,
        status: 1,
      },
    });
  }

  // 3. 初始化菜单字典
  for (const menu of menuDict) {
    await prisma.dict.upsert({
      where: {
        dict_code_dict_type_id_deletetime: {
          code: 'menu_type',
          value: menu.value,
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: '菜单配置',
        code: 'menu_type',
        value: menu.value,
        label: menu.label,
        type: 'string',
        order: menu.order,
        status: 1,
        json_data: {
          name: menu.path.substring(1),
          path: menu.path,
          component: menu.component,
          icon: menu.icon,
          parent_value: menu.parent_value,
          redirect: menu.redirect,
          meta: menu.meta,
        },
      },
    });
  }

  // ****************** 根据字典创建实际数据 ******************

  // 4. 基于角色字典创建实际的角色数据
  const roleDictData = await prisma.dict.findMany({
    where: { code: 'role_type', deletetime: BigInt(0) },
  });

  for (const role of roleDictData) {
    await prisma.roles.upsert({
      where: {
        value_deletetime: {
          value: role.value,
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: role.label,
        value: role.value,
        description: role.remark,
      },
    });
  }

  // 5. 基于字典创建菜单
  const menuDictData: any = await prisma.dict.findMany({
    where: { code: 'menu_type', deletetime: BigInt(0) },
  });

  const buttonDictData: any = await prisma.dict.findMany({
    where: { code: 'button_type', deletetime: BigInt(0) },
  });
  const baseButtons = buttonDictData.map((btn) => ({
    name: btn.label,
    value: btn.value,
    order: btn.order,
    deletetime: BigInt(0),
  }));

  // 先创建所有顶级菜单
  for (const menu of menuDictData.filter((m) => !m.json_data.parent_value)) {
    await prisma.menu.upsert({
      where: {
        value_deletetime: {
          value: menu.value,
          // parent_id: null, // 修改为 null
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        label: menu.label,
        value: menu.value,
        name: menu.json_data.name,
        path: menu.json_data.path,
        component: menu.json_data.component,
        redirect: menu.json_data.redirect,
        meta: menu.json_data.meta,
        icon: menu.json_data.icon,
        parent_id: null, // 修改为 null
        order: menu.order,
      },
    });
  }

  // 查询所有已创建的菜单
  const parentMenus = await prisma.menu.findMany({
    where: { deletetime: BigInt(0) },
  });

  // 创建子菜单
  for (const menu of menuDictData) {
    const parentMenu = menu.json_data.parent_value
      ? parentMenus.find((p) => p.value === menu.json_data.parent_value)
      : null;

    // 如果是子菜单但找不到父菜单，则跳过
    if (menu.json_data.parent_value && !parentMenu) {
      console.warn(
        `找不到父菜单: ${menu.json_data.parent_value}, 跳过创建: ${menu.value}`,
      );
      continue;
    }

    await prisma.menu.upsert({
      where: {
        value_deletetime: {
          value: menu.value,
          // parent_id: parentMenu?.id ?? null, // 修改为 null
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        label: menu.label,
        value: menu.value,
        name: menu.json_data.name,
        path: menu.json_data.path,
        component: menu.json_data.component,
        redirect: menu.json_data.redirect,
        meta: menu.json_data.meta,
        icon: menu.json_data.icon,
        parent_id: parentMenu?.id ?? null, // 修改为 null
        order: menu.order,
        // 只给子菜单添加按钮
        ...(parentMenu
          ? {
              buttons: {
                createMany: {
                  data: baseButtons,
                },
              },
            }
          : {}),
      },
    });
  }

  // for (const menu of menuDictData.filter((m) => m.json_data.parent_value)) {
  //   const parentMenu = parentMenus.find(
  //     (p) => p.value === menu.json_data.parent_value,
  //   );
  //   if (!parentMenu) continue;

  //   await prisma.menu.upsert({
  //     where: {
  //       value_parent_id_deletetime: {
  //         value: menu.value,
  //         parent_id: parentMenu.id,
  //         deletetime: BigInt(0),
  //       },
  //     },
  //     update: {},
  //     create: {
  //       name: menu.label,
  //       value: menu.value,
  //       path: menu.json_data.path,
  //       component: menu.json_data.component,
  //       redirect: menu.json_data.redirect,
  //       meta: menu.json_data.meta,
  //       icon: menu.json_data.icon,
  //       parent_id: parentMenu.id,
  //       order: menu.order,
  //       deletetime: BigInt(0),
  //       buttons: {
  //         createMany: {
  //           data: baseButtons,
  //         },
  //       },
  //     },
  //   });
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/* 
  使用 upsert 操作，它的工作原理是：
  首先根据 where 条件查找记录：
  where: { value_deletetime: { value: 'super_admin', deletetime: BigInt(0) } },
  如果找到匹配的记录，则执行 update 操作，更新记录的值。
  如果未找到匹配的记录，则执行 create 操作，创建新的记录。
  */
