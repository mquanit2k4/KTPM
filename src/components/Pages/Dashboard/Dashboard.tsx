import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DashboardData } from '../../../interface/interface';
import { Layout } from 'antd';
import GenderChart from './GenderChart';
import AgeChart from './AgeChart';
import AnimatedFrame from '../../../../utils/animation_page';
import UILayout from '../../../../utils/UILayout';
import StatCard from './StatCard';
import { HomeOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { Header, Content } = Layout;
  const [data, setData] = useState<DashboardData>();
  const fetchNumberResidents = async () => {
    try {
      const data = await window.electronAPI.fetchResidentsData();
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchNumberResidents();
  }, []);

  return (
    <UILayout title="Thống kê dân cư">
      <Row style={{ marginBottom: 24 }}>
        <Col lg={6} md={12}>
          <StatCard
            title="SỐ LƯỢNG DÂN CƯ"
            color="#ff7a00"
            value={data?.genderCount ? data.genderCount.reduce((sum, item) => sum + Number(item.value || 0), 0) : 0}
          />
        </Col>
        <Col lg={6} md={12}>
          <StatCard
            title="SỐ CĂN HỘ ĐÃ SỬ DỤNG"
            value="50/50"
            color="#faad14"
            icon={<HomeOutlined style={{ color: '#fff', fontSize: 28 }} />}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12}>
          <div className="gender-chart">
            <GenderChart data={data?.genderCount} />
          </div>
        </Col>
        <Col lg={6} md={12}>
          <div className="age-chart">
            <AgeChart data={data?.ageCount} />
          </div>
        </Col>
      </Row>
    </UILayout>
  );
};

export default Dashboard;
