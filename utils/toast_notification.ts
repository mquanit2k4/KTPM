import { notification as antdNotification } from 'antd';

export const notification = {
  error: (description: string) => {
    antdNotification.error({
      message: 'Lỗi',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  warning: (description: string) => {
    antdNotification.warning({
      message: 'Cảnh báo',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  success: (description: string) => {
    antdNotification.success({
      message: 'Thành công',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  info: (description: string) => {
    antdNotification.info({
      message: 'Thông tin',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
};
