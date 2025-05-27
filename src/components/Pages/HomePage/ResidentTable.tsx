import React, { useState, useEffect } from 'react';
import { Resident } from '../../../interface/interface.js';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const rowsPerPage = 10;

function ResidentTable() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchRoom, setSearchRoom] = useState('');
  const [searchName, setSearchName] = useState('');
  const [editingResidentId, setEditingResidentId] = useState<Number>();
  const [editedResident, setEditedResident] = useState<Resident>({
    id: 0,
    room_number: 0,
    full_name: '',
    birth_year: 0,
    gender: '',
    occupation: '',
    phone_number: '',
    email: '',
  });
  const [isAdding, setIsAdding] = useState(false); // Trạng thái thêm cư dân mới
  const [newResident, setNewResident] = useState({
    room_number: 0,
    full_name: '',
    birth_year: 0,
    gender: 'Nam',
    occupation: '',
    phone_number: '',
    email: '',
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: '',
    direction: 'asc',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState<Resident | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const addResident = async (resident: any) => {
    try {
      await window.electronAPI.addResident(resident);
    } catch (error) {
      console.error('Error adding resident:', error);
    }
  };

  const fetchResidents = async () => {
    try {
      const residents = await window.electronAPI.fetchResidentsList();
      setResidents(residents);
      setTotalPages(Math.ceil(residents.length / rowsPerPage));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // const currentResidents = residents.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );

  // Xử lý thay đổi dữ liệu trong form
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewResident({ ...newResident, [name]: value });
    } else {
      setEditedResident({ ...editedResident, [name]: value });
    }
  };

  // Bắt đầu chỉnh sửa cư dân
  const handleEdit = (resident: Resident) => {
    setEditedResident(resident);
    setShowEditModal(true);
  };

  // Lưu lại thông tin cư dân sau khi chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      await window.electronAPI.editResident({
        ...editedResident,
        id: editedResident.id,
      });
      toast.success('Chỉnh sửa thông tin cư dân thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { marginTop: 60 },
      });
      setResidents((prev) => prev.map(r => r.id === editedResident.id ? { ...editedResident } : r));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error editing resident:', error);
    }
  };

  // Hủy bỏ việc chỉnh sửa
  const handleCancel = () => {
    setEditingResidentId(0); // Đặt lại trạng thái không chỉnh sửa
  };

  // Bắt đầu thêm cư dân mới
  const handleAddResident = () => {
    // thêm id tạm thời bằng Date.now()
    addResident(newResident);

    // Reset lại form
    setNewResident({
      room_number: 0,
      full_name: '',
      birth_year: 0,
      gender: 'Nam',
      occupation: '',
      phone_number: '',
      email: '',
    });
  };

  const handleAddNew = () => {
    setIsAdding(true); // Chuyển sang chế độ thêm
    setNewResident({
      room_number: 0,
      full_name: '',
      birth_year: 0,
      gender: 'Nam',
      occupation: '',
      phone_number: '',
      email: '',
    });
  };

  function isValidEmail(email: string) {
    // Định dạng email cơ bản
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  function isValidPhoneNumber(phoneNumber: string) {
    // Chỉ chứa số, độ dài 9-12
    const regex = /^\d{9,12}$/;
    return regex.test(phoneNumber);
  }

  // Lưu cư dân mới vào danh sách
  const handleSaveNew = async () => {
    if (
      !newResident.room_number ||
      !newResident.full_name ||
      !newResident.birth_year ||
      !newResident.occupation ||
      !newResident.phone_number ||
      !newResident.email
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin!', {
        position: 'top-right',
        autoClose: 3000,
        style: { marginTop: 60 },
      });
      return;
    }

    if (!isValidPhoneNumber(newResident.phone_number)) {
      toast.error('Số điện thoại phải gồm 9-12 chữ số và chỉ chứa số!', {
        position: 'top-right',
        autoClose: 3000,
        style: { marginTop: 60 },
      });
      return;
    }

    if (!isValidEmail(newResident.email)) {
      toast.error('Email không hợp lệ!', {
        position: 'top-right',
        autoClose: 3000,
        style: { marginTop: 60 },
      });
      return;
    }
    try {
      await addResident(newResident); // Đảm bảo thêm xong mới fetch
      await fetchResidents(); // Lấy lại danh sách mới nhất từ database
      toast.success('Thêm cư dân thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { marginTop: 60 },
      });
      setIsAdding(false); // Đóng modal thêm cư dân
    } catch (error) {
      console.error('Error adding resident:', error);
    }
  };

  // Hủy bỏ thêm cư dân mới
  const handleCancelNew = () => {
    setIsAdding(false); // Tắt form thêm mới
  };
  const filteredResidents = residents.filter((resident) =>
    resident.room_number
      .toString()
      .toLowerCase()
      .includes(searchRoom.toLowerCase()) &&
    resident.full_name
      .toLowerCase()
      .includes(searchName.toLowerCase())
  );
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const sortedResidents = [...filteredResidents].sort((a, b) => {
    if (sortConfig.key === 'room_number') {
      return sortConfig.direction === 'asc'
        ? a.room_number - b.room_number
        : b.room_number - a.room_number;
    }
    if (sortConfig.key === 'full_name') {
      return sortConfig.direction === 'asc'
        ? a.full_name.localeCompare(b.full_name)
        : b.full_name.localeCompare(a.full_name);
    }
    return 0;
  });
  const currentResidents = sortedResidents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  useEffect(() => {
    setTotalPages(Math.ceil(filteredResidents.length / rowsPerPage));
    setCurrentPage(1);
  }, [searchRoom, searchName]);

  const handleExport = () => {
    const formattedData = currentResidents.map((resident) => ({
      ID: resident.id,
      'Số phòng': resident.room_number,
      'Họ và tên': resident.full_name,
      'Năm sinh': resident.birth_year,
      'Nghề nghiệp': resident.occupation,
      'Số điện thoại': resident.phone_number,
      Email: resident.email,
    }));

    const csvData = Papa.unparse(formattedData);
    const utf8Bom = '\uFEFF';
    const blob = new Blob([utf8Bom + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'filtered_residents.csv');
  };

  const handleDeleteResident = async () => {
    if (residentToDelete) {
      try {
        await window.electronAPI.deleteResident(residentToDelete.id);
        fetchResidents();
        toast.success('Đã xóa cư dân thành công!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { marginTop: 60 }, // Đẩy xuống dưới nút đăng xuất
        });
      } catch (error) {
        console.error('Error deleting resident:', error);
      } finally {
        setShowDeleteModal(false);
        setResidentToDelete(null);
      }
    }
  };

  return (
    <div className="resident-table-container">
      <ToastContainer />
      <div className="res">
        <h2>Danh sách cư dân</h2>
        <button
          className="btn-primary p-2 bg-blue-400 font-medium add-resident-btn"
          onClick={handleAddNew}
        >
            Thêm cư dân <i className="fas fa-plus" style={{marginLeft: '1px'}}></i>
        </button>
      </div>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Thêm cư dân mới</h3>
            <form className="flex flex-col">
              <div style={{ marginBottom: 8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="room_number">Số phòng</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="room_number"
                  id="room_number"
                  placeholder="Số phòng"
                  value={newResident.room_number}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="full_name">Họ và tên</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="full_name"
                  id="full_name"
                  placeholder="Họ và tên"
                  value={newResident.full_name}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="birth_year">Năm sinh</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="birth_year"
                  id="birth_year"
                  placeholder="Năm sinh"
                  value={newResident.birth_year}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gender">Giới tính</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="gender"
                  id="gender"
                  value={newResident.gender}
                  onChange={handleInputChange}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="occupation">Nghề nghiệp</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="occupation"
                  id="occupation"
                  placeholder="Nghề nghiệp"
                  value={newResident.occupation}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone_number">Số điện thoại</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  placeholder="Số điện thoại"
                  value={newResident.phone_number}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={newResident.email}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 0, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-delete flex items-center justify-center rounded-sm px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600"
                  onClick={handleCancelNew}
                  style={{ minWidth: 70, fontSize: 15, borderRadius: 6 }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn-submit flex items-center justify-center rounded-sm px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600"
                  onClick={handleSaveNew}
                  style={{ minWidth: 70, fontSize: 15, borderRadius: 6 }}
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="resident-table-container">
        {/* Thanh tìm kiếm */}
        <div className="search-bar" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="form-control"
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Tìm kiếm theo số phòng"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>
                Số phòng
                <i
                  className={`fas ${
                    sortConfig.key === 'room_number'
                      ? sortConfig.direction === 'asc'
                        ? 'fa-sort-up'
                        : 'fa-sort-down'
                      : 'fa-sort'
                  } sort-icon`}
                  style={{ marginLeft: '6px', cursor: 'pointer' }}
                  onClick={() => handleSort('room_number')}
                  title="Sắp xếp theo số phòng"
                />
              </th>
              <th>
                Họ và tên
                <i
                  className={`fas ${
                    sortConfig.key === 'full_name'
                      ? sortConfig.direction === 'asc'
                        ? 'fa-sort-up'
                        : 'fa-sort-down'
                      : 'fa-sort'
                  } sort-icon`}
                  style={{ marginLeft: '6px', cursor: 'pointer' }}
                  onClick={() => handleSort('full_name')}
                  title="Sắp xếp theo họ và tên"
                />
              </th>
              <th>Năm sinh</th>
              <th>Nghề nghiệp</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentResidents.length > 0 ? (
              currentResidents.map((resident) => (
                <tr key={resident.id}>
                  {editingResidentId === resident.id ? (
                    <>
                      <td>{resident.id}</td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="number"
                          name="room_number"
                          value={editedResident.room_number}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="text"
                          name="full_name"
                          value={editedResident.full_name}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="number"
                          name="birth_year"
                          value={editedResident.birth_year}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="text"
                          name="occupation"
                          value={editedResident.occupation}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="text"
                          name="phone_number"
                          value={editedResident.phone_number}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="email"
                          name="email"
                          value={editedResident.email}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td className="min-w-[200px]">
                        <Button
                          variant="secondary"
                          style={{ minWidth: 100 }}
                          onClick={() => setShowEditModal(false)}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="primary"
                          style={{ minWidth: 100 }}
                          onClick={handleSaveEdit}
                        >
                          Lưu
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{resident.id}</td>
                      <td>{resident.room_number}</td>
                      <td>{resident.full_name}</td>
                      <td>{resident.birth_year}</td>
                      <td>{resident.occupation}</td>
                      <td>{resident.phone_number}</td>
                      <td>{resident.email}</td>
                      <td>
                        <button
                          className="btn-primary p-1 px-2 font-medium bg-slate-400 text-gray-600"
                          onClick={() => handleEdit(resident)}
                        >
                          Chỉnh sửa <i className="fas fa-edit" style={{ marginLeft: '4px' }} />
                        </button>
                        <button
                          className="btn-delete p-1 px-2 font-medium text-white"
                          style={{ backgroundColor: '#e53935', marginLeft: '0.5rem' }}
                          onClick={() => {
                            setResidentToDelete(resident);
                            setShowDeleteModal(true);
                          }}
                        >
                          Xóa <i className="fas fa-trash-alt" style={{ marginLeft: '4px' }} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>Không tìm thấy cư dân</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Điều hướng trang */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            className="pagination-controls"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              type="button"
            >
              Trước
            </button>
            <span style={{ minWidth: 60, textAlign: 'center', fontWeight: 500 }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              type="button"
            >
              Tiếp theo
            </button>
          </div>

          {/* Nút xuất file */}
          <div
            className="export-button-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button onClick={handleExport} className="btn btn-success">
              Xuất file CSV
            </button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa cư dân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa cư dân này khỏi danh sách cư dân?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteResident}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chỉnh sửa cư dân */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin cư dân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="flex flex-col">
            <div style={{ marginBottom: 8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="room_number">Số phòng</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                name="room_number"
                id="room_number"
                value={editedResident.room_number}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="full_name">Họ và tên</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="full_name"
                id="full_name"
                value={editedResident.full_name}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="birth_year">Năm sinh</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                name="birth_year"
                id="birth_year"
                value={editedResident.birth_year}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gender">Giới tính</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="gender"
                id="gender"
                value={editedResident.gender}
                onChange={handleInputChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="occupation">Nghề nghiệp</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="occupation"
                id="occupation"
                value={editedResident.occupation}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone_number">Số điện thoại</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="phone_number"
                id="phone_number"
                value={editedResident.phone_number}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                id="email"
                value={editedResident.email}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 0, paddingBottom: 32 }}>
          <button
            type="button"
            className="btn-delete flex items-center justify-center rounded-sm px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600"
            onClick={() => setShowEditModal(false)}
            style={{ minWidth: 70, fontSize: 15, borderRadius: 6 }}
          >
            Hủy
          </button>
          <button
            type="button"
            className="btn-submit flex items-center justify-center rounded-sm px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600"
            onClick={handleSaveEdit}
            style={{ minWidth: 70, fontSize: 15, borderRadius: 6 }}
          >
            Lưu
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default ResidentTable;
