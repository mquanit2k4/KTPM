import { Modal, Form, FloatingLabel, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const FeeForm = (props: any) => {
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({
    feeName: '',
    feeUnitPrice: 0,
    feeUnit: 'kWh',
  });

  const fetchData = async () => {
    setData({
      feeName: props.data ? props.data.fee_name : '',
      feeUnitPrice: props.data ? props.data.unit_price : 0,
      feeUnit: props.data ? props.data.unit : 'kWh',
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
            feeUnitPrice: 0,
            feeUnit: 'kWh',
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
          <FloatingLabel controlId="feeUnit" label="Đơn vị" className="mb-3">
            <Form.Select
              aria-label="Đơn vị"
              onChange={handleChange}
              value={data.feeUnit}
              name="feeUnit"
            >
              <option value="kWh">kWh</option>
              <option value="Số">Số</option>
              <option value="Tháng">Tháng</option>
              <option value="Người">Người</option>
              <option value="Lần">Lần</option>
              <option value="Cái">Cái</option>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel
            controlId="feeUnitPrice"
            label="Đơn giá (đồng)"
            className="mb-3"
          >
            <Form.Control
              type="number"
              placeholder=""
              required
              name="feeUnitPrice"
              onChange={handleChange}
              value={data.feeUnitPrice == 0 ? '' : data.feeUnitPrice}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập đơn giá
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

export default FeeForm;
