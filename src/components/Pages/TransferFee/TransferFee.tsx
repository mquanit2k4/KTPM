import React, { useState, useEffect } from 'react';
import { Layout, Dropdown, DatePicker } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

import AnimatedFrame from '../../../../utils/animation_page';
import {
  // BaseFee, // Xoá nếu không dùng
  TransferFee,
  RequiredFee,
} from '../../../interface/interface.js';
import ConfirmModal from '../../ConfirmModal/ConfirmModel';
import './TransferFee.css';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Header, Content } = Layout;
// const FeeMap: Record<"Tiền điện" | "Tiền nước" | "Tiền ủng hộ bão" | "Tiền ủng hộ lũ" | "Tiền wifi", string> = {
//     "Tiền điện": "Bắt buộc",
//     "Tiền wifi": "Bắt buộc",
//     "Tiền nước": "Bắt buộc",
//     "Tiền ủng hộ bão": "Tự nguyện",
//     "Tiền ủng hộ lũ": "Tự nguyện",
//   };


type RoomFeeMap = {
  [key: string]: TransferFee[];
};

function TransferFeePage() {
  const [requiredFee, setRequiredFee] = useState<TransferFee[]>([]);
  const [roomFeeMap, setRoomFeeMap] = useState<RoomFeeMap>({});
  const [FeeMap, setFeeMap] = useState<string[]>([]);
  const [requiredFeesData, setRequiredFeesData] = useState<RequiredFee[]>([]);

  // search the fee that filter by room number
  const [searchValues, setSearchValues] = useState({
    searchRoomFee: '',
    result: '',
  });

  const [selectedMonth, setSelectedMonth] = useState(null);

  const fetchFee = async () => {
    // const feeList: BaseFee[] = await window.electronAPI.fetchMyFee();
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
      const requiredFeeData = await window.electronAPI.fetchRequiredFee();
      // Map lại dữ liệu để luôn có trường name, unit_price, unit, id
      const mappedRequiredFees = requiredFeeData.map((row: any) => ({
        name: row.fee_name || row.name,
        unit_price: row.unit_price,
        unit: row.unit,
        id: row.id || row.fee_id
      }));
      const fees = mappedRequiredFees.map((row: any) => String(row.name));
      setFeeMap(fees); // Set the list of fees
      setRequiredFeesData(mappedRequiredFees); // Store the full required fees data
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
      console.log('Residents:', residents);
      setResidentRooms(residents.map((r: any) => String(r.room_number).trim()));
    };
    fetchResidentRooms();
  }, []);

  const handleSubmitAdding = async (e: any) => {
    e.preventDefault();

    if (residentRooms.length === 0) {
      setErrorAddMessage('Đang tải dữ liệu phòng, vui lòng thử lại.');
      setErrorAddModalOpen(true);
      return;
    }

    const inputRoom = String(submitRoomNumber).trim();
    const inputFeeName = submitFeeName.trim();
    const inputMonth = dayjs(submitDate).format('YYYY-MM');
    const paidFees = roomFeeMap[inputRoom] || [];
    const isDuplicate = paidFees.some(fee =>
      fee.fee_name === inputFeeName &&
      fee.fee_type === 'Bắt buộc' &&
      fee.payment_date &&
      dayjs(fee.payment_date).format('YYYY-MM') === inputMonth
    );

    if (!residentRooms.map((r) => r.trim()).includes(inputRoom)) {
      setErrorAddMessage('Nhập sai số phòng.');
      setErrorAddModalOpen(true);
      return;
    }

    if (isDuplicate) {
      setErrorAddMessage('Khoản thu này đã được nộp trong tháng này.');
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
        'Bắt buộc',
        paymentDate
      );

      if (success) {
        await fetchRequiredFee(); // Đảm bảo cập nhật dữ liệu mới nhất
        setSuccessAddModalOpen(true);
      } else {
        setErrorAddMessage('Nộp tiền không thành công.');
        setErrorAddModalOpen(true);
      }
    } catch(error) {
      console.log(error);
    }
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

  // Hàm lọc các khoản đã nộp trong tháng đã chọn
  const getPaidFees = () => {
    if (!searchValues.searchRoomFee || !selectedMonth) return [];
    const roomNumber = searchValues.searchRoomFee;
    const monthStart = dayjs(selectedMonth).startOf('month');
    const monthEnd = dayjs(selectedMonth).endOf('month');
    return (
      roomFeeMap[roomNumber]?.filter((fee) => {
        const paymentDate = dayjs(fee.payment_date);
        return (
          paymentDate.isSameOrAfter(monthStart, 'day') &&
          paymentDate.isSameOrBefore(monthEnd, 'day') &&
          fee.fee_type === 'Bắt buộc'
        );
      }) || []
    );
  };

  // Hàm lọc các khoản chưa nộp trong tháng đã chọn
  const getUnpaidFees = () => {
    if (!searchValues.searchRoomFee || !selectedMonth) return [];
    const roomNumber = searchValues.searchRoomFee;
    const monthStart = dayjs(selectedMonth).startOf('month');
    const monthEnd = dayjs(selectedMonth).endOf('month');
    // Danh sách khoản bắt buộc
    const allRequiredFees = requiredFeesData.map((fee) => ({
      room_number: Number(roomNumber),
      fee_name: fee.name,
      money: fee.unit_price,
      due_date: monthEnd.format('DD/MM/YYYY'),
    }));
    // Danh sách khoản đã nộp trong tháng
    const paidFees = getPaidFees();
    // Lọc khoản chưa nộp
    return allRequiredFees.filter(
      (requiredFee) => !paidFees.some((paidFee) => paidFee.fee_name === requiredFee.fee_name)
    );
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
                                        onClick: () => {
                                          setSubmitFeeName(key);
                                          // Find the selected fee and set its unit price
                                          const selectedFee = requiredFeesData.find(fee => fee.name === key);
                                          console.log('Selected fee:', selectedFee); // Debug log
                                          if (selectedFee) {
                                            setSubmitMoney(selectedFee.unit_price.toString());
                                          }
                                        }
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
                        readOnly
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
                      cancelText="Huỷ"
                    />
                  </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Tra cứu tiền nộp</h2>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2" htmlFor="roomNumber">Số phòng</label>
                      <input
                        type="text"
                        id="roomNumber"
                        value={searchValues.searchRoomFee}
                        onChange={handleSearching}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                      />
                    </div>
                    <div className="flex-1" style={{ marginTop: 8 }}>
                      <label className="block text-sm font-medium mb-2" htmlFor="monthPicker">Tháng</label>
                      <DatePicker
                        id="monthPicker"
                        picker="month"
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        locale={locale}
                        className="w-full"
                        format="MM/YYYY"
                      />
                    </div>
                  </div>
                  {searchValues.searchRoomFee && selectedMonth && (
                    <>
                      <h3 className="text-lg font-semibold mb-2 text-left" >Các khoản bắt buộc đã nộp</h3>
                      <table className="min-w-full table-auto border-collapse mb-6">
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
                          {getPaidFees().length > 0 ? getPaidFees().map((row, idx) => (
                            <tr key={row.fee_name + String(row.payment_date)}>
                              <td>{row.room_number}</td>
                              <td>{row.fee_name}</td>
                              <td>{typeof row.money === 'number' ? row.money.toLocaleString('vi-VN') : row.money}</td>
                              <td>{row.transferer}</td>
                              <td>{row.payment_date ? dayjs(row.payment_date).format('DD/MM/YYYY') : ''}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan={5} className="text-center">Không có khoản nào</td></tr>
                          )}
                        </tbody>
                      </table>
                      <h3 className="text-lg font-semibold mb-2 text-left" style={{ marginTop: 16 }}>Các khoản bắt buộc chưa nộp</h3>
                      <table className="min-w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-200">
                            <th>Số phòng</th>
                            <th>Tên khoản thu</th>
                            <th>Số tiền cần nộp</th>
                            <th>Hạn chót cần nộp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getUnpaidFees().length > 0 ? getUnpaidFees().map((row, idx) => (
                            <tr key={row.fee_name + String(row.due_date)}>
                              <td>{row.room_number}</td>
                              <td>{row.fee_name}</td>
                              <td>{typeof row.money === 'number' ? row.money.toLocaleString('vi-VN') : row.money}</td>
                              <td>{row.due_date}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="text-center">Không có khoản nào</td></tr>
                          )}
                        </tbody>
                      </table>
                    </>
                  )}
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

export default TransferFeePage;
