import React from 'react';
import { Button } from 'react-bootstrap';
import { HandleLoginState } from '../../interface/interface';
import './LogoutButton.css';

function LogoutButton({ onAction }: HandleLoginState) {
  const handleLogout = () => {
    onAction(false);
  };
  return (
    <Button variant="danger" onClick={handleLogout} className="logout-button">
      Đăng xuất
    </Button>
  );
}

export default LogoutButton;
