import { notification, Space } from 'antd';
import { Button } from 'react-bootstrap';
import { NotificationType } from '../../interface/interface';

const ToastNotification = (props: any) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    description: String,
    title: String,
  ) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button
          onClick={() =>
            openNotificationWithIcon(
              props.noticeType,
              props.description,
              props.title,
            )
          }
        >
          {props.buttonName}
        </Button>
      </Space>
    </>
  );
};

export default ToastNotification;
