export const roleData = [
  {
    value: 'super_admin',
    name: '超级管理员',
    order: 1,
  },
  {
    value: 'admin',
    name: '管理员',
    order: 2,
  },
  {
    value: 'test',
    name: '测试',
    order: 3,
  },
  {
    value: 'user',
    name: '普通用户',
    order: 4,
  },
];

export const departmentData = [
  { name: '集团', code: 'group', order: 1 },
  { name: '公司', code: 'company', order: 2, parent_value: 'group' },
  { name: '分公司', code: 'branch', order: 3, parent_value: 'group' },
  { name: '研发部门', code: 'development', order: 4, parent_value: 'company' },
  { name: '测试部门', code: 'test', order: 5, parent_value: 'company' },
  { name: '运维部门', code: 'operation', order: 6, parent_value: 'company' },
  { name: '市场部门', code: 'market', order: 7, parent_value: 'branch' },
  { name: '财务部门', code: 'finance', order: 8, parent_value: 'branch' },
];

export const menuData = [
  {
    value: 'home',
    label: '首页',
    path: '/home',
    component: '/home/HomeView',
    order: 1,
    icon: 'House',
    parent_value: '', // 临时标记
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
  {
    value: 'dept',
    label: '部门管理',
    path: '/system-settings/dept-management',
    component: '/system-settings/dept-management/DeptManagementView',
    order: 4,
    icon: 'Avatar',
    parent_value: 'system',
    redirect: '',
    meta: {
      title: '部门管理',
      icon: 'Avatar',
      keepAlive: false,
    },
  },
  {
    value: 'dict',
    label: '字典管理',
    path: '/system-settings/dict-management',
    component: '/system-settings/dict-management/DictManagementView',
    order: 5,
    icon: 'Memo',
    parent_value: 'system',
    redirect: '',
    meta: {
      title: '字典管理',
      icon: 'Memo',
      keepAlive: false,
    },
  },
];

// 字典类型
export const dictTypeData = [
  { name: '性别', value: 'gender', description: '性别字典', order: 1 },
  { name: '状态', value: 'status', description: '状态字典', order: 2 },
  { name: '按钮', value: 'button', description: '按钮字典', order: 3 },
];

// 字典
export const dictData = [
  {
    dict_name: '男',
    dict_value: 'male',
    dict_type_id_mark: 'gender', // 临时标记
    language: 'zh',
  },
  {
    dict_name: 'Man',
    dict_value: 'male',
    dict_type_id_mark: 'gender',
    language: 'en',
  },
  {
    dict_name: '女',
    dict_value: 'female',
    dict_type_id_mark: 'gender',
    language: 'zh',
  },
  {
    dict_name: 'Woman',
    dict_value: 'female',
    dict_type_id_mark: 'gender',
    language: 'en',
  },
  {
    dict_name: '未知',
    dict_value: 'unknown',
    dict_type_id_mark: 'gender',
    language: 'zh',
  },
  {
    dict_name: 'Unknown',
    dict_value: 'unknown',
    dict_type_id_mark: 'gender',
    language: 'en',
  },
  {
    dict_name: '启用',
    dict_value: 'enable',
    dict_type_id_mark: 'status',
    language: 'zh',
  },
  {
    dict_name: 'Enable',
    dict_value: 'enable',
    dict_type_id_mark: 'status',
    language: 'en',
  },
  {
    dict_name: '禁用',
    dict_value: 'disabled',
    dict_type_id_mark: 'status',
    language: 'zh',
  },
  {
    dict_name: 'Disabled',
    dict_value: 'disabled',
    dict_type_id_mark: 'status',
    language: 'en',
  },
  {
    dict_name: '新增',
    dict_value: 'add',
    dict_type_id_mark: 'button',
    language: 'zh',
  },
  {
    dict_name: 'Add',
    dict_value: 'add',
    dict_type_id_mark: 'button',
    language: 'en',
  },
  {
    dict_name: '编辑',
    dict_value: 'edit',
    dict_type_id_mark: 'button',
    language: 'zh',
  },
  {
    dict_name: 'Edit',
    dict_value: 'edit',
    dict_type_id_mark: 'button',
    language: 'en',
  },
  {
    dict_name: '详情',
    dict_value: 'detail',
    dict_type_id_mark: 'button',
    language: 'zh',
  },
  {
    dict_name: 'Detail',
    dict_value: 'detail',
    dict_type_id_mark: 'button',
    language: 'en',
  },
  {
    dict_name: '删除',
    dict_value: 'delete',
    dict_type_id_mark: 'button',
    language: 'zh',
  },
  {
    dict_name: 'Delete',
    dict_value: 'delete',
    dict_type_id_mark: 'button',
    language: 'en',
  },
];

export const buttonData = [
  { label: '新增', value: 'add', order: 1 },
  { label: '编辑', value: 'edit', order: 2 },
  { label: '详情', value: 'detail', order: 3 },
  { label: '删除', value: 'delete', order: 4 },
];
