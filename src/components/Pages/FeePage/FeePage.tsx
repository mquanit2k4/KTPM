import React, { useState, useEffect } from 'react';
import { Flex, Button, Layout, Menu } from 'antd';
import {  FaLeaf, FaSearch, FaHome, FaMoneyBillWave, FaUserAlt  } from "react-icons/fa";
import {
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  FormOutlined,
  NotificationOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
// import './FeePage.css';
import AnimatedFrame from '../../../../utils/animation_page';
import { Link } from 'react-router-dom';
import { Fee } from '../../../interface/interface.js';
import SideBar from '../SideBar/SideBar';
import ConfirmModal from '../../ConfirmModal/ConfirmModel';

const { Header, Sider, Content } = Layout;
const rowsPerPage = 5;
const requiredMoney = 50;

type RoomFeeMap = {
  [key: string]: Fee;
};

function FeePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [requiredFee, setRequiredFee] = useState<Fee[]>([]);
  const [searchRoom, setSearchRoom] = useState("");
  const [roomFeeMap, setRoomFeeMap] = useState<RoomFeeMap>({});

  // search the fee that filter by room number
  const [searchValues, setSearchValues] = useState({
    searchRoomFee: "",
    result: "",
  });

  // fetch data from database
  const fetchRequiredFee = async () => {
    try {
      const requiredFee: Fee[] = await window.electronAPI.fetchRequiredFee();
      const map: RoomFeeMap = {};

      for (var i = 0; i < requiredFee.length; i++) {
        map[requiredFee[i]["room_number"].toString()] = requiredFee[i];
      }

      setRequiredFee(requiredFee);
      setRoomFeeMap(map);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {fetchRequiredFee();}, []);

  // for searching
  const handleSearching = (e: any) => {
    const { name, value } = e.target;

    setSearchValues({
      searchRoomFee: value,
      result: "",
    });

  };
  
  useEffect(() => {
    if (searchValues.searchRoomFee) {
      var result = "";

      for (var i = 0; i < requiredFee.length; i++) {
        if (searchValues.searchRoomFee == requiredFee[i]["room_number"].toString()) {
          result = requiredFee[i]["amount_money"].toString();
          break;
        }
      }

      setSearchValues({
        searchRoomFee: searchValues.searchRoomFee,
        result: result
      });
    } else {

      setSearchValues({
        searchRoomFee: "",
        result: ""
      });

    }
  }, [searchValues.searchRoomFee]);

  // for deleting
  const [searchDeletedRoom, setSearchDeletedRoom] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isErrorDeleteModalOpen, setErrorDeleteModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [isSuccessDeleteModalOpen, setSuccessDeleteModalOpen] = useState(false);
  const [errorDeleteMessage, setErrorDeleteMessage] = useState('');
  const [confirmationDeleteMessage, setConfirmationDeleteMessage] = useState('');

  const handleCloseDelete = () => setDeleteModalOpen(false);

  const handleSubmitDeleting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    var check = 0;

    for (var i = 0; i < requiredFee.length; i++) {
      if (searchDeletedRoom == requiredFee[i]["room_number"].toString()) {
        check = 1;
        break;
      }
    }

    if (!check) {
      setErrorDeleteMessage("Vui lòng nhập đúng số phòng");
      setErrorDeleteModalOpen(true); // Show error modal
    } else {
      setConfirmationDeleteMessage(`Bạn có chắc chắn xoá khoản thu của phòng ${searchDeletedRoom}?`);
      setConfirmDeleteModalOpen(true); // Show confirmation modal
    }
  };

  const handleConfirmDeleting = async () => {
    setConfirmDeleteModalOpen(false); // Close confirmation modal
    try {
      const success = await window.electronAPI.deleteCompulsoryFee(Number(searchDeletedRoom));
      if (success) {
        setSuccessDeleteModalOpen(true); // Show success modal
      } else {
        setErrorDeleteMessage("Thêm khoản thu không thành công.");
        setErrorDeleteModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    }

    fetchRequiredFee();
  };
  
  // for adding
  const [isErrorAddModalOpen, setErrorAddModalOpen] = useState(false);
  const [isConfirmAddModalOpen, setConfirmAddModalOpen] = useState(false);
  const [isSuccessAddModalOpen, setSuccessAddModalOpen] = useState(false);
  const [errorAddMessage, setErrorAddMessage] = useState('');
  const [confirmationAddMessage, setConfirmationAddMessage] = useState('');

  const [submitRoomNumber, setSubmitRoomNumber] = useState("");
  const [submitTransferrer, setSubmitTransferrer] = useState("");
  const [submitMoney, setSubmitMoney] = useState("");

  const handleSubmitAdding = async (e: any) => {
    e.preventDefault();
    
    var check = 0;

    for (var i = 0; i < requiredFee.length; i++) {
      if (submitRoomNumber == requiredFee[i]["room_number"].toString()) {
        check = 1;
        break;
      }
    }

    if (!check) {
      setErrorAddMessage("Nhập sai số phòng.");
      setErrorAddModalOpen(true);
    } else {
      setConfirmationAddMessage(`Bạn có chắc chắn thêm khoản thu của phòng ${submitRoomNumber}?`)
      setConfirmAddModalOpen(true);
    }
  };

  const handleConfirmAdding = async () => {
    setConfirmAddModalOpen(false); // Close confirmation modal
    var cur_money = 0;

    for (var i = 0; i < requiredFee.length; i++) {
      if (submitRoomNumber == requiredFee[i]["room_number"].toString()) {
        cur_money = requiredFee[i]["amount_money"];
        break;
      }
    }

    const money = cur_money + Number(submitMoney);
    try {
      const success = await window.electronAPI.addSubmittedFee(Number(submitRoomNumber), money, submitTransferrer);

      if (success) {
        setSuccessAddModalOpen(true);
      } else {
        setErrorAddMessage("Thêm khoản thu không thành công.");
        setErrorAddModalOpen(true);
      }
    } catch(error) {
      console.log(error);
    }

    fetchRequiredFee();
  };

  //for editing
  const [searchEditedRoom, setSearchEditedRoom] = useState("");
  const [editedMoney, setEditedMoney] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedTransferrer, setEditedTransferrer] = useState("");

  const [isErrorEditModalOpen, setErrorEditModalOpen] = useState(false);
  const [isConfirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [isSuccessEditModalOpen, setSuccessEditModalOpen] = useState(false);
  const [errorEditMessage, setErrorEditMessage] = useState('');
  const [confirmationEditMessage, setConfirmationEditMessage] = useState('');
  const [curEditMoney, setCurEditMoney] = useState('');
  const [curEditTransferrer, setCurEditTransferrer] = useState('');

  const handleSubmitEditing = async (e: any) => {
    e.preventDefault();
    
    var check = 0;

    for (var i = 0; i < requiredFee.length; i++) {
      if (searchEditedRoom == requiredFee[i]["room_number"].toString()) {
        setCurEditMoney(requiredFee[i]["amount_money"].toString());
        setCurEditTransferrer(requiredFee[i]["representator"]);
        check = 1;
        break;
      }
    }

    if (!check) {
      setErrorEditMessage("Nhập sai số phòng.");
      setErrorEditModalOpen(true);
    } else {
      setConfirmationEditMessage(`Bạn có chắc chắn chỉnh sửa khoản thu của phòng ${searchEditedRoom}?`)
      setConfirmEditModalOpen(true);
    }
  };

  const handleConfirmEditing = async () => {
    setConfirmEditModalOpen(false); // Close confirmation modal

    try {
      var money = "", transferrer = "";
      if (editedMoney == "") money = curEditMoney;
      else money = editedMoney;

      if (editedTransferrer == "") transferrer = curEditTransferrer;
      else transferrer = editedTransferrer;

      const success = await window.electronAPI.editFee(Number(searchEditedRoom), Number(money), transferrer);

      if (success) {
        setSuccessEditModalOpen(true);
      } else {
        setErrorEditMessage("Chỉnh sửa khoản thu không thành công.");
        setErrorEditModalOpen(true);
      }
    } catch(error) {
      console.log(error);
    }

    fetchRequiredFee();
  };

  return (
    <AnimatedFrame>
      <Layout>
        {/* <SideBar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
        <Layout className="site-layout">
          <Header className="header"> </Header>
          <Content style={{ margin: '14px', background: '#fff' }}>
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="container mx-auto grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
                {/* Transfer Money Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">
                    Thêm khoản thu
                  </h2>
                  <form onSubmit={handleSubmitAdding}>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="roomNumber"
                      >
                        Số phòng
                      </label>
                      <input
                        type="number"
                        id="roomNumber"
                        value={submitRoomNumber}
                        onChange={(e) => setSubmitRoomNumber(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="transferAmount"
                      >
                        Số tiền nộp
                      </label>
                      <input
                        type="number"
                        id="transferAmount"
                        value={submitMoney}
                        onChange={(e) => setSubmitMoney(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số tiền"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="transferrer"
                      >
                        Người nộp tiền
                      </label>
                      <input
                        type="string"
                        id="person"
                        value={submitTransferrer}
                        onChange={(e) => setSubmitTransferrer(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập tên người nộp tiền"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Thêm khoản thu
                    </button>

                    <ConfirmModal
                      show={isErrorAddModalOpen}
                      onClose={() => setErrorAddModalOpen(false)}
                      onConfirm={() => setErrorAddModalOpen(false)}
                      title="Lỗi"
                      bodyText={errorAddMessage}
                      confirmText=""
                      cancelText="Huỷ"
                    />

                    {/* Confirmation Modal */}
                    <ConfirmModal
                      show={isConfirmAddModalOpen}
                      onClose={() => setConfirmAddModalOpen(false)}
                      onConfirm={handleConfirmAdding}
                      title="Xác nhận thêm khoản thu"
                      bodyText={confirmationAddMessage}
                      confirmText="Xác nhận"
                      cancelText="Hủy"
                    />

                    {/* Success Modal */}
                    <ConfirmModal
                      show={isSuccessAddModalOpen}
                      onClose={() => setSuccessAddModalOpen(false)}
                      onConfirm={() => setSuccessAddModalOpen(false)}
                      title="Thành công"
                      bodyText="Đã thêm khoản thu thành công."
                      confirmText=""
                      cancelText="Huỷ"
                    />
                  </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa khoản thu</h2>
                  <form onSubmit={handleSubmitEditing}>
                    <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="roomNumber"
                        >
                          Số phòng
                    </label>
                    <div className="mb-4">
                      <input
                        type="number"
                        value={searchEditedRoom}
                        onChange={(e) => setSearchEditedRoom(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                        required
                      />
                    </div>

                    <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="roomNumber"
                        >
                          Số tiền nộp
                    </label>

                    <div className="mb-4">
                      <input
                        type="number"
                        value={editedMoney}
                        onChange={(e) => setEditedMoney(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số tiền mới"
                      />
                    </div>

                    <div className="mb-4">
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="transferrer"
                        >
                          Người nộp tiền
                        </label>
                        <input
                          type="string"
                          id="transferAmount"
                          value={editedTransferrer}
                          onChange={(e) => setEditedTransferrer(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập tên người nộp tiền mới"
                        />
                      </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      >
                        Chỉnh sửa khoản thu
                    </button>   

                    <ConfirmModal
                      show={isErrorEditModalOpen}
                      onClose={() => setErrorEditModalOpen(false)}
                      onConfirm={() => setErrorEditModalOpen(false)}
                      title="Lỗi"
                      bodyText={errorEditMessage}
                      confirmText=""
                      cancelText="Huỷ"
                    />

                    {/* Confirmation Modal */}
                    <ConfirmModal
                      show={isConfirmEditModalOpen}
                      onClose={() => setConfirmEditModalOpen(false)}
                      onConfirm={handleConfirmEditing}
                      title="Xác nhận chỉnh sửa khoản thu"
                      bodyText={confirmationEditMessage}
                      confirmText="Xác nhận"
                      cancelText="Hủy"
                    />

                    {/* Success Modal */}
                    <ConfirmModal
                      show={isSuccessEditModalOpen}
                      onClose={() => setSuccessEditModalOpen(false)}
                      onConfirm={() => setSuccessEditModalOpen(false)}
                      title="Thành công"
                      bodyText="Đã chỉnh sửa khoản thu thành công."
                      confirmText=""
                      cancelText="Huỷ"
                    />
                  </form>              
                </div>

                {/* Room Payments Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Xoá khoản thu</h2>
                  <form onSubmit={handleSubmitDeleting}>
                    <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="roomNumber"
                        >
                          Số phòng
                    </label>
                    <div className="mb-4">
                      <input
                        type="text"
                        id="deleteroom"
                        value={searchDeletedRoom}
                        onChange={(e) => setSearchDeletedRoom(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                        required
                      />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        // onClick={(e) => {
                        //   e.preventDefault(); 
                        //   setDeleteModalOpen(true)
                        
                        // }}
                      >
                        Xoá khoản thu
                    </button>    

                    <ConfirmModal
                      show={isErrorDeleteModalOpen}
                      onClose={() => setErrorDeleteModalOpen(false)}
                      onConfirm={() => setErrorDeleteModalOpen(false)}
                      title="Lỗi"
                      bodyText={errorDeleteMessage}
                      confirmText=""
                      cancelText="Huỷ"
                    />

                    {/* Confirmation Modal */}
                    <ConfirmModal
                      show={isConfirmDeleteModalOpen}
                      onClose={() => setConfirmDeleteModalOpen(false)}
                      onConfirm={handleConfirmDeleting}
                      title="Xác nhận xoá khoản thu"
                      bodyText={confirmationDeleteMessage}
                      confirmText="Xác nhận"
                      cancelText="Hủy"
                    />

                    {/* Success Modal */}
                    <ConfirmModal
                      show={isSuccessDeleteModalOpen}
                      onClose={() => setSuccessDeleteModalOpen(false)}
                      onConfirm={() => setSuccessDeleteModalOpen(false)}
                      title="Thành công"
                      bodyText="Đã xoá khoản thu thành công."
                      confirmText=""
                      cancelText="Huỷ"
                    />

                  </form>            
                </div>
              {/* </div> */}

              {/* <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-4"> */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Xem khoản thu</h2>
                  <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="roomNumber"
                      >
                        Số phòng
                  </label>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchValues.searchRoomFee}
                      onChange={handleSearching}
                      className="w-full p-2 border rounded-md"
                      placeholder="Nhập số phòng"
                    />
                  </div>
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th>Số phòng</th>
                        <th>Người nộp</th>
                        <th>Đã nộp (000 VND)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        searchValues.searchRoomFee !== "" && searchValues.result !== ""? (
                          <tr>
                            <td>{roomFeeMap[searchValues.searchRoomFee].room_number}</td>
                            <td>{roomFeeMap[searchValues.searchRoomFee].representator}</td>
                            <td>{roomFeeMap[searchValues.searchRoomFee].amount_money}</td>
                          </tr>
                          ) : (<tr></tr>)
                      }
                    </tbody>
                  </table>
                </div>
                {/* </div> */}

              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </AnimatedFrame>
  );
}

export default FeePage;
