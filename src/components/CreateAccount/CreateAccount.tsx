import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IpcRendererEvent } from 'electron/renderer';
import { Form, Button, Container, FloatingLabel } from 'react-bootstrap';
import { FaEyeSlash } from 'react-icons/fa';
import { IpcResponse } from '../../interface/interface';
import { notification } from '../../../utils/toast_notification';
import AnimatedFrame from '../../../utils/animation_page';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateAccount.css';

function CreateAccount() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleToggle = () => {
    const inputNode = document.getElementById('myPassword') as HTMLInputElement;
    if (inputNode.type === 'password') inputNode.type = 'text';
    else inputNode.type = 'password';
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleListener = () => {
    window.electronAPI.clearListener('signup-response');
    window.electronAPI.onMessage(
      'signup-response',
      (event: IpcRendererEvent, response: IpcResponse) => {
        if (response.success) {
          notification.success(response.message);
          setTimeout(() => {
            navigate('/manage-account');
          }, 500);
        } else {
          notification.error(response.message);
        }
        setIsLoading(false);
      },
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    handleListener();
    setIsLoading(true);
    try {
      await window.electronAPI.signup({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
      });
    } catch (error) {
      notification.error('Đã có lỗi xảy ra! Vui lòng thử lại sau.');
    }
  };

  return (
    <AnimatedFrame>
      <Container className="form-container">
        <h2 style={{ textAlign: 'center' }} className="mb-5">
          Tạo tài khoản mới
        </h2>
        <Form onSubmit={handleSubmit}>
          <FloatingLabel
            controlId="floatingInput"
            label="Tên tài khoản"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder=""
              name="name"
              onChange={handleChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Tên đăng nhập"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder=""
              name="username"
              onChange={handleChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-3"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
            />
          </FloatingLabel>
          <FloatingLabel label="Mật khẩu" className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder=""
              id="myPassword"
              onChange={handleChange}
            />
            <div style={{ position: 'absolute', right: '0', top: '50%' }}>
              <FaEyeSlash className="icon-left" onClick={handleToggle} />
            </div>
          </FloatingLabel>

          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="outline-primary"
              size="lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </div>
        </Form>
      </Container>
    </AnimatedFrame>
  );
}

export default CreateAccount;
