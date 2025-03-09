// prisma/seed.ts
/* 初始化添加数据，npx prisma db seed */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. 初始化角色相关字典
  const roleTypes = [
    {
      value: 'super_admin',
      label: '超级管理员',
      label_en: 'Super Admin',
      order: 1,
      remark: '系统超级管理员',
      remark_en: 'System Super Administrator',
      is_default: true,
    },
    {
      value: 'admin',
      label: '管理员',
      label_en: 'Admin',
      order: 2,
      remark: '系统管理员',
      remark_en: 'System Administrator',
    },
    {
      value: 'editor',
      label: '编辑',
      label_en: 'Editor',
      order: 3,
      remark: '内容编辑',
      remark_en: 'Content Editor',
    },
    {
      value: 'user',
      label: '普通用户',
      label_en: 'Normal User',
      order: 4,
      remark: '普通用户',
      remark_en: 'Normal User',
    },
  ];

  for (const role of roleTypes) {
    await prisma.dict.upsert({
      where: {
        code_value_deletetime: {
          code: 'role_type',
          value: role.value,
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: '角色类型',
        name_en: 'Role Type',
        code: 'role_type',
        value: role.value,
        label: role.label,
        label_en: role.label_en,
        type: 'string',
        order: role.order,
        status: 1,
        is_default: role.is_default ?? false,
        remark: role.remark,
        remark_en: role.remark_en,
      },
    });
  }

  // 2. 初始化按钮权限相关字典
  const buttonTypes = [
    { value: 'add', label: '新增', label_en: 'Add', order: 1 },
    { value: 'edit', label: '编辑', label_en: 'Edit', order: 2 },
    { value: 'detail', label: '详情', label_en: 'Detail', order: 3 },
    { value: 'delete', label: '删除', label_en: 'Delete', order: 4 },
  ];

  for (const btn of buttonTypes) {
    await prisma.dict.upsert({
      where: {
        code_value_deletetime: {
          code: 'button_type',
          value: btn.value,
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: '按钮类型',
        name_en: 'Button Type',
        code: 'button_type',
        value: btn.value,
        label: btn.label,
        label_en: btn.label_en,
        type: 'string',
        order: btn.order,
        status: 1,
      },
    });
  }

  // 3. 初始化菜单字典
  const menuDict = [
    {
      value: 'home',
      label: '首页',
      label_en: 'Home',
      path: '/home',
      component: '/home/HomeView',
      order: 1,
      icon: 'House',
      parent_value: '',
      redirect: '',
      meta: {
        title: '首页',
        icon: 'House',
        keepAlive: false,
      },
    },
    {
      value: 'system',
      label: '系统设置',
      label_en: 'System',
      path: '/system-settings',
      component: '',
      order: 2,
      icon: 'Setting',
      parent_value: '', // 顶级菜单
      redirect: '/system-settings/user-management', // 可选的重定向
      meta: {
        title: '系统设置',
        icon: 'Setting',
        keepAlive: false,
      },
    },
    {
      value: 'user',
      label: '用户管理',
      label_en: 'Users',
      path: '/system-settings/user-management',
      component: '/system-settings/user-management/UserManagementView',
      order: 1,
      icon: 'User',
      parent_value: 'system',
      redirect: '',
      meta: {
        title: '用户管理',
        icon: 'User',
        keepAlive: false,
      },
    },
    {
      value: 'role',
      label: '角色管理',
      label_en: 'Roles',
      path: '/system-settings/role-management',
      component: '/system-settings/role-management/RoleManagementView',
      order: 2,
      icon: 'User',
      parent_value: 'system',
      redirect: '',
      meta: {
        title: '角色管理',
        icon: 'User',
        keepAlive: false,
      },
    },
    {
      value: 'menu',
      label: '菜单管理',
      label_en: 'Menus',
      path: '/system-settings/menu-management',
      component: '/system-settings/menu-management/MenuManagementView',
      order: 3,
      icon: 'Menu',
      parent_value: 'system',
      redirect: '',
      meta: {
        title: '菜单管理',
        icon: 'Menu',
        keepAlive: false,
      },
    },
  ];

  for (const menu of menuDict) {
    await prisma.dict.upsert({
      where: {
        code_value_deletetime: {
          code: 'menu_type',
          value: menu.value,
          deletetime: BigInt(0),
        },
      },
      update: {},
      create: {
        name: '菜单配置',
        name_en: 'Menu Config',
        code: 'menu_type',
        value: menu.value,
        label: menu.label,
        label_en: menu.label_en,
        type: 'string',
        order: menu.order,
        status: 1,
        extra_data: {
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
  for (const menu of menuDictData.filter((m) => !m.extra_data.parent_value)) {
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
        name: menu.extra_data.name,
        path: menu.extra_data.path,
        component: menu.extra_data.component,
        redirect: menu.extra_data.redirect,
        meta: menu.extra_data.meta,
        icon: menu.extra_data.icon,
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
    const parentMenu = menu.extra_data.parent_value
      ? parentMenus.find((p) => p.value === menu.extra_data.parent_value)
      : null;

    // 如果是子菜单但找不到父菜单，则跳过
    if (menu.extra_data.parent_value && !parentMenu) {
      console.warn(
        `找不到父菜单: ${menu.extra_data.parent_value}, 跳过创建: ${menu.value}`,
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
        name: menu.extra_data.name,
        path: menu.extra_data.path,
        component: menu.extra_data.component,
        redirect: menu.extra_data.redirect,
        meta: menu.extra_data.meta,
        icon: menu.extra_data.icon,
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

  // for (const menu of menuDictData.filter((m) => m.extra_data.parent_value)) {
  //   const parentMenu = parentMenus.find(
  //     (p) => p.value === menu.extra_data.parent_value,
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
  //       path: menu.extra_data.path,
  //       component: menu.extra_data.component,
  //       redirect: menu.extra_data.redirect,
  //       meta: menu.extra_data.meta,
  //       icon: menu.extra_data.icon,
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
