import { PieChart, Pie, Cell, Legend, Tooltip, Label } from 'recharts';
import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const GenderChart = ({ data }: any) => {
  const COLORS = ['#faad14', '#ff7a45', '#ff4d4f', '#52c41a'];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading gender data, please wait...</div>;
  } else {
    return (
      <Card>
        <Card.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <PieChart width={400} height={360}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              align="right"
              verticalAlign="top"
              height={36}
              iconSize={18}
            />
          </PieChart>
          <h3
            style={{
              position: 'absolute',
              bottom: '18px',
              fontWeight: 500,
              fontSize: '16px',
            }}
          >
            Thống kê tỉ lệ nam - nữ dân cư
          </h3>
        </Card.Body>
      </Card>
    );
  }
};

export default GenderChart;
