import { Card } from 'react-bootstrap';
import { UsergroupAddOutlined, HomeOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = '#52c41a', icon }) => (
  <Card style={{ boxShadow: '0 2px 8px #f0f1f2', minHeight: 150 }}>
    <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: '#888', fontWeight: 500, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 36, fontWeight: 700, margin: '8px 0' }}>
          {typeof value === 'number' ? (
            <CountUp end={value} duration={1.2} separator="," />
          ) :
            (typeof value === 'string' && value.match(/^\d+\/\d+$/)) ? (
              <>
                <CountUp end={parseInt(value.split('/')[0], 10)} duration={1.2} separator="," />
                {`/${value.split('/')[1]}`}
              </>
            ) : (
              value
            )
          }
        </div>
      </div>
      <div style={{
        background: color,
        borderRadius: '50%',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon !== undefined ? icon : <UsergroupAddOutlined style={{ color: '#fff', fontSize: 28 }} />}
      </div>
    </Card.Body>
  </Card>
);

export default StatCard;
