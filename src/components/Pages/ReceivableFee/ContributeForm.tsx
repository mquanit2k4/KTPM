import { Modal, Form, FloatingLabel, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const ContributeForm = (props: any) => {
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({
    feeName: '',
    totalMoney: 0,
  });

  const fetchData = async () => {
    setData({
      feeName: props.data ? props.data.fee_name : '',
      totalMoney: props.data ? props.data.total_money : 0,
    });
  };

  useEffect(() => {
    fetchData();
  }, [props.data]);

  const handleSubmit = async (event: any) => {
    const form = document.querySelector('form') as HTMLElement;
    setValidated(true);
    if (form.checkValidity() === true) {
      try {
        await props.onSubmit(data);
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => {
          setValidated(false);
          setData({
            feeName: '',
            totalMoney: 0,
          });
          props.triggerReload();
        }, 500);
      }
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <FloatingLabel controlId="feeName" label="Tên khoản" className="mb-3">
            <Form.Control
              required
              name="feeName"
              type="text"
              placeholder=""
              onChange={handleChange}
              value={data.feeName}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập tên khoản
            </Form.Control.Feedback>
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Đóng
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {props.submitText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ContributeForm;
