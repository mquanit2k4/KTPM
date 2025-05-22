import { Layout } from 'antd';
import './HomePage.css';
import SideBar from '../SideBar/SideBar';
import ResidentTable from './ResidentTable';
import AnimatedFrame from '../../../../utils/animation_page';
import { Link } from 'react-router-dom';
import UILayout from '../../../../utils/UILayout';

const { Header, Content } = Layout;

function HomePage() {
  return (
    <UILayout>
      <ResidentTable />
    </UILayout>
  );
}

export default HomePage;
