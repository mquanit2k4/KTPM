import { useEffect, useState } from 'react';
import { IpcRendererEvent } from 'electron';
import { useNavigate } from 'react-router-dom';
import AnimatedFrame from '../../../utils/animation_page';
import './SignupForm.css';

interface IpcResponse {
  success: boolean;
  message: string;
}

function Signup() {
  const [input, setInput] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    retype_password: '',
  });
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (input.password !== input.retype_password) {
      setMessage('Password retype incorrect!');
    } else {
      try {
        const { username, password, email, name } = input;
        await window.electronAPI.signup({
          username,
          password,
          name,
          email,
        });
      } catch (error) {
        setMessage('Signup failed');
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleClick = () => {
    navigate('/');
  };

  useEffect(() => {
    window.electronAPI.onMessage(
      'signup-response',
      (event: IpcRendererEvent, response: IpcResponse) => {
        if (response.success) {
          setMessage('Signup successful');
          //   alert('Signup successful!');
          navigate('/');
        } else {
          setMessage(response.message);
          // alert(response.message);
        }
      },
    );
  }, []);

  return (
    <AnimatedFrame>
      <div className="wrapper signup">
        <form onSubmit={handleSubmit}>
          <h1>Đăng ký</h1>
          <div className="input-box">
            <input
              type="text"
              name="name"
              placeholder="Tên tài khoản"
              required
              value={input.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              required
              value={input.username}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={input.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              required
              value={input.password}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="retype_password"
              placeholder="Nhập lại mật khẩu"
              required
              value={input.retype_password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Đăng ký</button>

          <div className="remember-forgot" style={{ marginTop: '10px' }}>
            <a href="#" onClick={handleClick}>
              Đã có tài khoản? Đăng nhập
            </a>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </AnimatedFrame>
  );
}

export default Signup;
