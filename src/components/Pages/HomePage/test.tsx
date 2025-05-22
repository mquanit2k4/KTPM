/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Resident } from '../../../interface/interface.js';

const rowsPerPage = 10;

function ResidentTable() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [editingResidentId, setEditingResidentId] = useState(null);
  const [editedResident, setEditedResident] = useState({
    room_number: '',
    full_name: '',
    birth_year: '',
    occupation: '',
    phone_number: '',
    email: '',
  });
  const [isAdding, setIsAdding] = useState(false); // Trạng thái thêm cư dân mới
  const [newResident, setNewResident] = useState({
    room_number: '',
    full_name: '',
    birth_year: '',
    occupation: '',
    phone_number: '',
    email: '',
  });

  // Lấy dữ liệu từ localStorage khi trang load
  useEffect(() => {
    const storedResidents = localStorage.getItem('residents');
    if (storedResidents) {
      setResidents(JSON.parse(storedResidents));
      setTotalPages(Math.ceil(JSON.parse(storedResidents).length / rowsPerPage));
    }
  }, []);

  const saveResidentsToLocalStorage = (updatedResidents) => {
    localStorage.setItem('residents', JSON.stringify(updatedResidents));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentResidents = residents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Xử lý thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewResident({ ...newResident, [name]: value });
    } else {
      setEditedResident({ ...editedResident, [name]: value });
    }
  };

  // Bắt đầu chỉnh sửa cư dân
  const handleEdit = (resident) => {
    setEditingResidentId(resident.id);
    setEditedResident(resident); // Điền thông tin cư dân hiện tại vào form
  };

  // Lưu lại thông tin cư dân sau khi chỉnh sửa
  const handleSave = () => {
    const updatedResidents = residents.map((resident) =>
      resident.id === editingResidentId ? editedResident : resident,
    );
    setResidents(updatedResidents);
    setEditingResidentId(null); // Đặt lại trạng thái không chỉnh sửa
    saveResidentsToLocalStorage(updatedResidents); // Lưu vào localStorage
  };

  // Hủy bỏ việc chỉnh sửa
  const handleCancel = () => {
    setEditingResidentId(null); // Đặt lại trạng thái không chỉnh sửa
  };

  // Bắt đầu thêm cư dân mới
  const handleAddResident = () => {
    const updatedResidents = [...residents, { ...newResident, id: Date.now() }]; // thêm id tạm thời bằng Date.now()
    setResidents(updatedResidents);
    setTotalPages(Math.ceil(updatedResidents.length / rowsPerPage));

    // Reset lại form
    setNewResident({
      room_number: '',
      full_name: '',
      birth_year: '',
      occupation: '',
      phone_number: '',
      email: '',
    });
  };

  const handleAddNew = () => {
    setIsAdding(true); // Chuyển sang chế độ thêm
    setNewResident({
      room_number: '',
      full_name: '',
      birth_year: '',
      occupation: '',
      phone_number: '',
      email: '',
    });
  };

  function isValidPhoneNumber(phoneNumber) {
    // Kiểm tra nếu chuỗi chỉ chứa các chữ số và độ dài từ 9 đến 12
    const regex = /^[0-9]{9,12}$/;
    return regex.test(phoneNumber);
}

  // Lưu cư dân mới vào danh sách
  const handleSaveNew = () => {
    if (
      !newResident.room_number ||
      !newResident.full_name ||
      !newResident.birth_year ||
      !newResident.occupation ||
      !newResident.phone_number ||
      !newResident.email
    ) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if(!isValidPhoneNumber(newResident.phone_number)) {
      alert('SDT phải gồm 9-12 chữ số');
      return;
    }

    const newResidentWithId = { ...newResident, id: Date.now() }; // Tạo ID mới cho cư dân
    const updatedResidents = [...residents, newResidentWithId];
    setResidents(updatedResidents);
    setIsAdding(false); // Tắt form thêm mới sau khi lưu
    saveResidentsToLocalStorage(updatedResidents); // Lưu vào localStorage
    alert('Thêm cư dân thành công');

  };

  // Hủy bỏ thêm cư dân mới
  const handleCancelNew = () => {
    setIsAdding(false); // Tắt form thêm mới
  };

  return (
    <div className="resident-table-container">
      <div className="res">
        <h2>Danh sách cư dân</h2>
        <button className="btn-primary p-2 bg-blue-400 font-medium" onClick={handleAddNew}>
          Thêm cư dân
        </button>
      </div>

      {isAdding && (
        <div className="add-resident-form">
          <h3>Thêm cư dân mới</h3>
          <input
            className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
            type="number"
            name="room_number"
            placeholder="Số phòng"
            value={newResident.room_number}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="text"
            name="full_name"
            placeholder="Họ và tên"
            value={newResident.full_name}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="number"
            name="birth_year"
            placeholder="Năm sinh"
            value={newResident.birth_year}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="text"
            name="occupation"
            placeholder="Nghề nghiệp"
            value={newResident.occupation}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="text"
            name="phone_number"
            placeholder="Số điện thoại"
            value={newResident.phone_number}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="email"
            name="email"
            placeholder="Email"
            value={newResident.email}
            onChange={handleInputChange}
          />
            <button className='btn-submit rounded-sm p-2  font-semibold text-white bg-green-400' onClick={handleSaveNew}>Lưu</button>
            <button className='btn-delete rounded-sm p-2 font-semibold text-white bg-red-400' onClick={handleCancelNew}>Hủy</button>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Số phòng</th>
            <th>Họ và tên</th>
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
                        className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
                        type="number"
                        name="room_number"
                        value={editedResident.room_number}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
                        type="text"
                        name="full_name"
                        value={editedResident.full_name}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
                        type="number"
                        name="birth_year"
                        value={editedResident.birth_year}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
                        type="text"
                        name="occupation"
                        value={editedResident.occupation}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
                        type="text"
                        name="phone_number"
                        value={editedResident.phone_number}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
                        type="email"
                        name="email"
                        value={editedResident.email}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className='min-w-[200px]'>
                      <button className='btn-submit p-1 font-medium text-white bg-green-400' onClick={handleSave}>Lưu</button>
                      <button className='btn-delete p-1 font-medium text-white bg-red-400' onClick={handleCancel}>Hủy</button>
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
                      <button className='btn-primary p-1 px-2 font-medium bg-slate-400 text-gray-600' onClick={() => handleEdit(resident)}>Chỉnh sửa</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No residents found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <span>Trang {currentPage}</span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ResidentTable;
