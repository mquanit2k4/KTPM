import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  bodyText?: string;
  confirmText?: string;
  cancelText?: string;
}

function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title = 'Xác nhận hành động',
  bodyText = 'Bạn có chắc chắn muốn xóa tài khoản này?',
  confirmText = 'Xóa',
  cancelText = 'Hủy bỏ',
}: ConfirmModalProps) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        {confirmText && (
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  title: 'Xác nhận hành động',
  bodyText: 'Bạn có chắc chắn muốn xóa tài khoản này?',
  confirmText: 'Xóa',
  cancelText: 'Hủy bỏ',
};

export default ConfirmModal;
