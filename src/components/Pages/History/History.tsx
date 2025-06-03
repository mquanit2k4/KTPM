import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Layout } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import AnimatedFrame from '../../../../utils/animation_page';
import { TransferFee } from '../../../interface/interface.js';

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

function HistoryPage() {
  const [requiredFee, setRequiredFee] = useState<TransferFee[]>([]);
  const [roomFeeMap, setRoomFeeMap] = useState<RoomFeeMap>({});

  // search the fee that filter by room number
  const [searchValues, setSearchValues] = useState({
    searchRoomFee: "",
    result: "",
  });

  const [filterFeeType, setFilterFeeType] = useState('Tất cả');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // fetch data from database
  const fetchRequiredFee = async () => {
    const requiredFeeData: TransferFee[] = await window.electronAPI.fetchTransferFee();
    const mapFee: RoomFeeMap = {};
    requiredFeeData.forEach((fee) => {
      const roomNumber = fee.room_number.toString();
      if (!mapFee[roomNumber]) {
        mapFee[roomNumber] = [];
      }
      mapFee[roomNumber].push(fee);
    });
    setRequiredFee(requiredFeeData);
    setRoomFeeMap(mapFee);
  };

  useEffect(() => {fetchRequiredFee();}, []);

  // for searching
  const handleSearching = (e: any) => {
    const { value } = e.target;
    setSearchValues({
      searchRoomFee: value,
      result: '',
    });
    fetchRequiredFee();
  };

  //for editing
  const [curEditMoney, setCurEditMoney] = useState('');
  const [curEditTransferrer, setCurEditTransferrer] = useState('');

  const handleSubmitEditing = async (e: any) => {
    e.preventDefault();

    var check = 0;

    for (var i = 0; i < requiredFee.length; i++) {
      if (searchValues.searchRoomFee == requiredFee[i]["room_number"].toString()) {
        setCurEditMoney(requiredFee[i]["money"].toString());
        // setCurEditTransferrer(requiredFee[i]["transferer"]);
        check = 1;
        break;
      }
    }

    if (!check) {
      // Nếu cần báo lỗi có thể dùng toast hoặc console.error
      return;
    } else {
      // Nếu cần xác nhận có thể dùng modal khác hoặc bỏ qua
    }
  };

  const handleConfirmEditing = async () => {
    // setConfirmEditModalOpen(false); // Close confirmation modal

    try {
      var transferrer = "";

      const success = await window.electronAPI.editFee(Number(searchValues.searchRoomFee), Number(curEditMoney), transferrer);

      if (success) {
        // setSuccessEditModalOpen(true);
      } else {
        // setErrorEditMessage("Chỉnh sửa khoản thu không thành công.");
        // setErrorEditModalOpen(true);
      }
    } catch(error) {
      console.log(error);
    }

    fetchRequiredFee();
  };

  const handleExport = () => {
    // Lấy dữ liệu từ bảng hiện tại (đã lọc hoặc chưa lọc)
    const dataToExport =
      searchValues.searchRoomFee !== ""
        ? roomFeeMap[searchValues.searchRoomFee] || []
        : requiredFee;

    // Định dạng dữ liệu cho CSV
    const formattedData = dataToExport.map((row) => ({
      'Số phòng': row.room_number,
      'Số tiền đã nộp': row.money,
      'Tên khoản thu': row.fee_name,
      'Người nộp': row.transferer,
      'Loại khoản thu': row.fee_type,
      'Thời gian nộp': (row as any).payment_date
        ? typeof (row as any).payment_date === 'string'
          ? (row as any).payment_date
          : new Date((row as any).payment_date).toLocaleDateString('vi-VN')
        : '',
    }));

    // Chuyển đổi dữ liệu sang CSV
    const csvData = Papa.unparse(formattedData);

    // Thêm BOM để hỗ trợ UTF-8 cho tiếng Việt
    const utf8Bom = '\uFEFF';
    const blob = new Blob([utf8Bom + csvData], { type: 'text/csv;charset=utf-8;' });

    // Tải xuống file với tên "history.csv"
    saveAs(blob, 'history.csv');
  };

  // Hàm chuẩn hóa ngày về yyyy-mm-dd
  function toDateString(date: any) {
    if (!date) return '';
    if (typeof date === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        const [d, m, y] = date.split('/');
        return `${y}-${m}-${d}`;
      }
      return new Date(date).toISOString().slice(0, 10);
    }
    if (date instanceof Date) return date.toISOString().slice(0, 10);
    return '';
  }

  // Hàm lọc dữ liệu theo loại khoản thu và khoảng thời gian
  const filteredRows = (searchValues.searchRoomFee !== ''
    ? roomFeeMap[searchValues.searchRoomFee] || []
    : requiredFee
  ).filter(row => {
    const matchType = filterFeeType === 'Tất cả' || row.fee_type === filterFeeType;
    const dateStr = toDateString(row.payment_date);
    let matchDate = true;
    if (filterDateFrom) matchDate = matchDate && dateStr >= filterDateFrom;
    if (filterDateTo) matchDate = matchDate && dateStr <= filterDateTo;
    return matchType && matchDate;
  });

  return (
    <AnimatedFrame>
      <Layout>
        <Layout className="site-layout">
          <Header className="header"> </Header>
          <Content style={{ margin: '14px', background: '#fff' }}>
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Lịch sử nộp tiền</h2>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label className="block text-sm font-medium mb-2" htmlFor="roomNumber">
                        Số phòng
                      </label>
                      <input
                        type="text"
                        value={searchValues.searchRoomFee}
                        onChange={handleSearching}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <label className="block text-sm font-medium mb-2" htmlFor="filterFeeType">
                        Loại khoản thu
                        <FilterOutlined style={{ marginLeft: 6 }} />
                      </label>
                      <select
                        id="filterFeeType"
                        value={filterFeeType}
                        onChange={e => setFilterFeeType(e.target.value)}
                        className="p-2 border rounded-md"
                      >
                        <option value="Tất cả">Tất cả</option>
                        <option value="Tự nguyện">Tự nguyện</option>
                        <option value="Bắt buộc">Bắt buộc</option>
                      </select>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <label className="block text-sm font-medium mb-2">Từ ngày</label>
                      <input
                        type="date"
                        value={filterDateFrom}
                        onChange={e => setFilterDateFrom(e.target.value)}
                        className="p-2 border rounded-md"
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <label className="block text-sm font-medium mb-2">Đến ngày</label>
                      <input
                        type="date"
                        value={filterDateTo}
                        onChange={e => setFilterDateTo(e.target.value)}
                        className="p-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th>Số phòng</th>
                        <th>Số tiền đã nộp</th>
                        <th>Tên khoản thu</th>
                        <th>Người nộp</th>
                        <th>Loại khoản thu <FilterOutlined style={{ fontSize: 14, marginLeft: 4 }} /></th>
                        <th>Thời gian nộp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.length > 0 ? (
                        filteredRows.map((row, index) => (
                          <tr key={index}>
                            <td>{row.room_number}</td>
                            <td>{typeof row.money === 'number' ? row.money.toLocaleString('vi-VN') : row.money}</td>
                            <td>{row.fee_name}</td>
                            <td>{row.transferer}</td>
                            <td>{row.fee_type}</td>
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
                          <td colSpan={6} style={{ textAlign: 'center' }}>Không có dữ liệu phù hợp</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {/* Dòng phân cách */}
                  <hr className="my-4 border-t border-gray-300" />
                  {/* Nút xuất file */}
                  <div className="export-button-container">
                    <button onClick={handleExport} className="btn btn-success">
                      Xuất file CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </AnimatedFrame>
  );
}

export default HistoryPage;
