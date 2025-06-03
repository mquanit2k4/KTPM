import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

// const ConfirmLogout = (props: any) => {
//   const navigate = useNavigate();
//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Xác nhận đăng xuất
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p>Bạn có muốn đăng xuất khỏi tài khoản hay không?</p>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={props.onHide}>
//           Đóng
//         </Button>
//         <Button
//           variant="danger"
//           onClick={() => {
//             props.onLogout();
//             navigate('/');
//           }}
//         >
//           Đăng xuất
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

function ConfirmLogout(props: any) {
  const navigate = useNavigate();
  const { onLogout, onHide, show } = props;
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Xác nhận đăng xuất
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có muốn đăng xuất khỏi tài khoản hay không?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onLogout();
            navigate('/');
          }}
        >
          Đăng xuất
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ConfirmLogout;
