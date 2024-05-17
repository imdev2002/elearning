import getPixels from 'get-pixels';
import { createWriteStream } from 'fs';
import rgb2hex from 'rgb2hex';

const commonUtil = {
  generateRandomString: (length = 5) => {
    const chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  },
  escapeRegExp: (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  },

  replaceAll: (str: string, find: string, replace: string) => {
    return str.replace(new RegExp(commonUtil.escapeRegExp(find), 'g'), replace);
  },
  validatePassword: (password = '') => {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    return regex.test(password);
  },
  generateRandomPassword: () => {
    let password = '';
    while (!commonUtil.validatePassword(password)) {
      password = '';
      const length = Math.floor(Math.random() * (12 - 9 + 1)) + 9;
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return password;
  },
};
export default commonUtil;
