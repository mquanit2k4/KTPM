import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  FloatingLabel,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { EditUser } from '../../interface/interface';
import { FaEyeSlash } from 'react-icons/fa';
import AnimatedFrame from '../../../utils/animation_page';

const EditAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idNumber = id ? parseInt(id) : 0;

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState<EditUser>({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  const handleToggle = () => {
    const inputNode = document.getElementById('myPassword') as HTMLElement;
    if (inputNode.type === 'password') inputNode.type = 'text';
    else inputNode.type = 'password';
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await window.electronAPI.editUserAccount(
        {
          username: user.username,
          password: user.password,
          email: user.email,
          name: user.name,
        },
        idNumber,
      );
      navigate('/manage-account');
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const result = await window.electronAPI.fetchUser(idNumber);
      const data: EditUser = {
        ...result[0],
        password: '',
      };
      setUser(data);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AnimatedFrame>
      <Container className="form-container">
        <h2 style={{ textAlign: 'center' }} className="mb-5">
          Chỉnh sửa thông tin tài khoản
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
              value={user.name}
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
              value={user.username}
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
              value={user.email}
              onChange={handleChange}
            />
          </FloatingLabel>
          <FloatingLabel label="Mật khẩu mới" className="mb-3">
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
              {isLoading ? 'Đang xử lí...' : 'Chỉnh sửa'}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </div>
        </Form>
      </Container>
    </AnimatedFrame>
  );
};

export default EditAccount;
