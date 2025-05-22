import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import './output.css';
import AccountManage from '../components/AccountManage/AccountManage';
import HomePage from '../components/Pages/HomePage/HomePage';
import LogoutButton from '../components/LogoutButton/LogoutButton';
import FeePage from '../components/Pages/FeePage/FeePage';
import ContributionPage from '../components/Pages/ContributionPage/ContributionPage';
import SideBar from '../components/Pages/SideBar/SideBar';
import Dashboard from '../components/Pages/Dashboard/Dashboard';
import EditAccount from '../components/EditAccount/EditAccount';
import ConfirmLogout from '../components/ConfirmLogout/ConfirmLogout';
import ReceivableFee from '../components/Pages/ReceivableFee/ReceivableFee';
import ScrollToTop from '../../utils/scroll_to_top';
import CreateAccount from '../components/CreateAccount/CreateAccount';
import TransferFeePage from '../components/Pages/TransferFee/TransferFee';
import TransferContributeFeePage from '../components/Pages/TransferContributeFee/TransferContributeFee';
import HistoryPage from '../components/Pages/History/History';
import SignupForm from '../components/SignupForm/SignupForm';
const AppInner = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <ScrollToTop />
      {location.pathname !== '/' &&
        (location.pathname as string) !== '/sign-up' && (
          <LogoutButton
            onAction={() => {
              setModalShow(true);
            }}
          />
        )}
      {isLogin ? (
        <div style={{ display: 'flex' }}>
          {!location.pathname.includes('/manage-account') && (
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
          )}
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/manage-account" element={<AccountManage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/feepage" element={<FeePage />} />
              <Route path="/contribute" element={<ContributionPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/receivable-fee" element={<ReceivableFee />} />
              <Route path="/transferfeepage" element={<TransferFeePage />} />
              <Route path="/transfercontributefeepage" element={<TransferContributeFeePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route
                path="/manage-account/:id/edit"
                element={<EditAccount />}
              />
              <Route
                path="/manage-account/create-account"
                element={<CreateAccount />}
              />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginForm onAction={setIsLogin} />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Routes>
      )}
      <ConfirmLogout
        show={modalShow}
        onHide={() => setModalShow(false)}
        onLogout={() => {
          setIsLogin(false);
          setModalShow(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
