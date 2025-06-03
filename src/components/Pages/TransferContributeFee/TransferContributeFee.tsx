import React, { useState, useEffect } from 'react';
import { Layout, Dropdown } from 'antd';
import AnimatedFrame from '../../../../utils/animation_page';
import { TransferFee } from '../../../interface/interface.js';
import ConfirmModal from '../../ConfirmModal/ConfirmModel';
import './TransferContributeFee.css';
const { Header, Content } = Layout;

type RoomFeeMap = {
  [key: string]: TransferFee[];
};

function TransferContributeFeePage() {
  const [requiredFee, setRequiredFee] = useState<TransferFee[]>([]);
  const [roomFeeMap, setRoomFeeMap] = useState<RoomFeeMap>({});
  const [FeeMap, setFeeMap] = useState<string[]>([]);

  // search the fee that filter by room number
  const [searchValues, setSearchValues] = useState({
    searchRoomFee: '',
    result: '',
  });

  const fetchFee = async () => {
    await window.electronAPI.fetchMyFee();
  };

  fetchFee();

  // fetch data from database
  const fetchRequiredFee = async () => {
    const transferFeeList: TransferFee[] = await window.electronAPI.fetchTransferFee();
    const mapFee: RoomFeeMap = {};
    transferFeeList.forEach((fee) => {
      const roomNumber = fee.room_number.toString();
      if (!mapFee[roomNumber]) {
        mapFee[roomNumber] = [];
      }
      mapFee[roomNumber].push(fee);
    });
    setRequiredFee(transferFeeList);
    setRoomFeeMap(mapFee);
  };

  useEffect(() => {
  // Simulate fetching data
  const fetchFees = async () => {
    const requiredFeeData = await window.electronAPI.fetchContributeFee();
    const fees = requiredFeeData.map((row: any) => String(row.fee_name)); // Ensure strings
    console.log(fees);
    setFeeMap(fees); // Set the list of fees
  };

  fetchFees();
}, []);
  useEffect(() => {fetchRequiredFee();}, []);

  // for searching
  const handleSearching = (e: any) => {
    const { name, value } = e.target;

    setSearchValues({
      searchRoomFee: value,
      result: "",
    });

    fetchRequiredFee();

  };

//   useEffect(() => {
//     if (searchValues.searchRoomFee) {
//       var result = "";

//       for (const fee of requiredFee) {
//         if (searchValues.searchRoomFee == fee["room_number"].toString()) {
//           result = fee["money"].toString();
//           break;
//         }
//       }

//       setSearchValues({
//         searchRoomFee: searchValues.searchRoomFee,
//         result: result
//       });
//     } else {

//       setSearchValues({
//         searchRoomFee: "",
//         result: ""
//       });

//     }
//   }, [searchValues.searchRoomFee]);

  // for deleting
  const [searchDeletedRoom, setSearchDeletedRoom] = useState('');
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
      var success = 1;
      // const success = await window.electronAPI.deleteCompulsoryFee(Number(searchDeletedRoom));
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

  const [submitRoomNumber, setSubmitRoomNumber] = useState('');
  const [submitTransferrer, setSubmitTransferrer] = useState('');
  const [submitFeeName, setSubmitFeeName] = useState('');
  const [submitMoney, setSubmitMoney] = useState('');
  const [submitDate, setSubmitDate] = useState('');

  // Thêm state lưu danh sách số phòng cư dân
  const [residentRooms, setResidentRooms] = useState<string[]>([]);

  // Khi mount component, lấy danh sách số phòng cư dân
  useEffect(() => {
    const fetchResidentRooms = async () => {
      const residents = await window.electronAPI.fetchResidentsList();
      setResidentRooms(residents.map((r: any) => String(r.room_number).trim()));
    };
    fetchResidentRooms();
  }, []);

  const handleSubmitAdding = async (e: any) => {
    e.preventDefault();

    // Nếu chưa load xong danh sách phòng
    if (residentRooms.length === 0) {
      setErrorAddMessage('Đang tải dữ liệu phòng, vui lòng thử lại.');
      setErrorAddModalOpen(true);
      return;
    }

    const inputRoom = String(submitRoomNumber).trim();
    const validRooms = residentRooms.map((r) => r.trim());
    if (!validRooms.includes(inputRoom)) {
      setErrorAddMessage('Nhập sai số phòng.');
      setErrorAddModalOpen(true);
      return;
    }

    setConfirmationAddMessage(`Bạn có chắc chắn nộp tiền cho phòng ${submitRoomNumber}?`);
    setConfirmAddModalOpen(true);
  };

  const handleConfirmAdding = async () => {
    setConfirmAddModalOpen(false); // Close confirmation modal

    try {
      const paymentDate = submitDate || new Date().toISOString().slice(0, 10);
      const success = await window.electronAPI.addTransferFee(
        Number(submitRoomNumber),
        Number(submitMoney),
        submitFeeName,
        submitTransferrer,
        "Tự nguyện",
        paymentDate
      );

      if (success) {
        setSuccessAddModalOpen(true);

        roomFeeMap[submitRoomNumber.toString()].push({
          room_number: Number(submitRoomNumber),
          money: Number(submitMoney),
          fee_name: submitFeeName,
          transferer: submitTransferrer,
          fee_type: "Tự nguyện",
          payment_date: paymentDate
        });

      } else {
        setErrorAddMessage("Nộp tiền không thành công.");
        setErrorAddModalOpen(true);
      }
    } catch(error) {
      console.log(error);
    }

    fetchRequiredFee();
  };

  //for editing
  const [searchEditedRoom, setSearchEditedRoom] = useState('');
  const [editedMoney, setEditedMoney] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedTransferrer, setEditedTransferrer] = useState('');

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
        setCurEditMoney(requiredFee[i]["money"].toString());
        // setCurEditTransferrer(requiredFee[i]["transferer"]);
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
                    Nộp tiền
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
                        <label className="block text-sm font-medium mb-2" htmlFor="feeName">
                            Tên khoản thu
                        </label>
                        <Dropdown
                            menu={{
                                items: [
                                    { key: '', label: 'Chọn khoản thu' },
                                    ...FeeMap.map((key) => ({
                                        key,
                                        label: key,
                                        onClick: () => setSubmitFeeName(key)
                                    }))
                                ]
                            }}
                            trigger={['click']}
                            overlayClassName="custom-dropdown"
                        >
                            <div className="dropdown-trigger">
                                {submitFeeName || 'Chọn khoản thu'}
                            </div>
                        </Dropdown>
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
                      {submitMoney && !isNaN(Number(submitMoney)) && (
                        <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                          {Number(submitMoney).toLocaleString('vi-VN')} đ
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="submitDate"
                      >
                        Thời gian nộp tiền
                      </label>
                      <input
                        type="date"
                        id="submitDate"
                        value={submitDate}
                        onChange={(e) => setSubmitDate(e.target.value)}
                        className="w-full p-2 border rounded-md"
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
                      className="w-full btn-submit-fee"
                    >
                      Nộp tiền
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
                      title="Xác nhận nộp tiền"
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
                      bodyText="Đã nộp tiền thành công."
                      confirmText=""
                      cancelText="Đóng"
                    />
                  </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Tra cứu tiền nộp</h2>
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
                        <th>Tên khoản thu</th>
                        <th>Số tiền đã nộp</th>
                        <th>Người nộp</th>
                        <th>Thời gian nộp</th>
                      </tr>
                    </thead>
                    <tbody>
                        {searchValues.searchRoomFee !== ""? (
                            roomFeeMap[searchValues.searchRoomFee]?.filter(row => row.fee_type === 'Tự nguyện').map((row, index) => (
                            <tr key={index}>
                                <td>{row.room_number}</td>
                                <td>{row.fee_name}</td>
                                <td>{typeof row.money === 'number' ? row.money.toLocaleString('vi-VN') : row.money}</td>
                                <td>{row.transferer}</td>
                                <td>
                                  {row.payment_date
                                    ? typeof row.payment_date === 'string'
                                      ? row.payment_date
                                      : new Date(row.payment_date).toLocaleDateString('vi-VN')
                                    : ''}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    Hãy nhập số phòng
                                </td>
                            </tr>
                        )}
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

export default TransferContributeFeePage;
