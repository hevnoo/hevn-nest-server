export const UsernameField = 'email'; // 鉴权的唯一标识，可以是邮箱、用户名、手机号
export const PORT = '8080';
export const BASE_URL = `http://localhost${PORT}`;
//密钥
export const SECRET_KEY = process.env.SECRET_KEY || 'hevn-secret-key';
//token有效时间
export const EXPIRESD = process.env.EXPIRESD || '24h';
export const refresh_time = '48h';
export const PWD_SALT = 'hevn-node';
export const UPLOAD_DIR = './uploads';
