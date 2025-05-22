import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { ViewAccountProps } from '../../interface/interface';
import { useNavigate } from 'react-router-dom';

const ViewAccount: React.FC<ViewAccountProps> = ({ users, handleDelete }) => {
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = (e: any) => {
    setId(parseInt(e.target.getAttribute('data-id')));
    setShow(true);
  };

  const navigate = useNavigate();

  const handleEdit = (e: any, id: number) => {
    e.preventDefault();
    navigate(`/manage-account/${id}/edit`);
  };

  return (
    <div style={{ width: '100%' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên tài khoản</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td id={`${user.id}`}>
                <Button
                  variant="outline-primary"
                  onClick={(e) => {
                    handleEdit(e, user.id);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  variant="outline-danger"
                  data-id={`${user.id}`}
                  onClick={handleShow}
                >
                  Xóa
                </Button>
              </td>
              <Modal
                show={show}
                onHide={handleClose}
                style={{ color: 'black' }}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Xác nhận hành động</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Bạn có chắc chắn muốn xóa tài khoản này?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Hủy bỏ
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDelete(id);
                      handleClose();
                    }}
                  >
                    Xóa
                  </Button>
                </Modal.Footer>
              </Modal>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewAccount;
