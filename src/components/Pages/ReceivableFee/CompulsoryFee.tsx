import { Space, Input } from 'antd';
import { Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/esm/Accordion';
import './ReceivableFee.css';
import '../../style/variable.css';
const { Search } = Input;

function CompulsoryFee() {
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>
        Khoản thu bắt buộc
      </Accordion.Header>
      <Accordion.Body>
        <Space direction="horizontal">
          <Search
            placeholder="Tìm kiếm khoản thu"
            allowClear
            style={{ width: 200 }}
          />
          <Button variant="primary" className="btn-submit-fee">
            Tạo khoản bắt buộc mới
          </Button>
        </Space>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên khoản thu</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <button type="button" className="btn btn-link p-0">1</button>
              </th>
              <td>Phí dịch vụ</td>
              <td>Phí dịch vụ chung cư</td>
              <td>
                <Button variant="outline-primary" size="sm">
                  Chỉnh sửa
                </Button>
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Phí bảo trì</td>
              <td>Phí bảo trì cơ sở vật chất</td>
              <td>
                <Button variant="outline-primary" size="sm">
                  Chỉnh sửa
                </Button>
              </td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Phí vệ sinh</td>
              <td>Phí vệ sinh môi trường</td>
              <td>
                <Button variant="outline-primary" size="sm">
                  Chỉnh sửa
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default CompulsoryFee;
