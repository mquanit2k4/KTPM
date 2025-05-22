import db from './config';
import { IpcMainInvokeEvent } from 'electron';
import { compare, genSalt, hash } from 'bcrypt-ts';
import { FieldPacket, QueryResult } from 'mysql2';
import { LoginPayload, Resident, SignupPayload } from '../interface/interface';
import { ChartData } from '../interface/class';

const saltRounds = 15;

export const queryUserByField = (field: string, value: string) => {
  const query = `SELECT * FROM users WHERE ${field} = ?`;
  return db.query(query, [value]);
};

export const insertUser = (userData: SignupPayload) => {
  const query =
    'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)';
  return genSalt(saltRounds)
    .then((salt) => hash(userData.password, salt))
    .then((hashedPassword) =>
      db.query(query, [
        userData.username,
        hashedPassword,
        userData.email,
        userData.name,
      ]),
    );
};

export const loginRequest = async (
  event: IpcMainInvokeEvent,
  { username, password, admin }: LoginPayload,
) => {
  let query = admin
    ? 'SELECT password FROM admin WHERE username = ?'
    : 'SELECT password FROM users WHERE username = ?';
  const values = [username];
  try {
    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        if (!value[0][0])
          event.sender.send('login-response', {
            success: false,
            message: 'User not found',
          });
        else {
          compare(password, value[0][0].password).then((result) => {
            if (result) {
              if (!admin) {
                event.sender.send('login-response', {
                  success: true,
                  message: 'Login successful',
                });
              } else {
                event.sender.send('login-response', {
                  success: true,
                  message: 'Admin successful',
                });
              }
            } else {
              event.sender.send('login-response', {
                success: false,
                message: 'Invalid credentials',
              });
            }
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        event.sender.send('login-response', {
          success: false,
          message: 'Error occured!',
        });
      });
  } catch (err: any) {
    // console.log(err);
    event.sender.send('login-response', {
      success: false,
      message: 'Error occured!',
    });
  }
};

export const signupRequest = async (
  event: IpcMainInvokeEvent,
  userData: SignupPayload,
) => {
  queryUserByField('username', userData.username)
    .then(([rows]) => {
      if (rows[0]) {
        throw new Error('Tên tài khoản đã tồn tại.');
      }
      return queryUserByField('email', userData.email);
    })
    .then(([rows]) => {
      if (rows[0]) {
        throw new Error('Email đã được sử dụng.');
      }
      return insertUser(userData);
    })
    .then(() => {
      event.sender.send('signup-response', {
        success: true,
        message: 'Tạo tài khoản thành công',
      });
    })
    .catch((error) => {
      const errorMessage =
        error.message || 'Lỗi máy chủ! Vui lòng thử lại sau.';
      event.sender.send('signup-response', {
        success: false,
        message: errorMessage,
      });
    });
};

export const fetchUserRequest = async (
  event: IpcMainInvokeEvent,
  id?: number,
) => {
  if (id) {
    try {
      const [rows] = await db.query(
        'SELECT name, username, email FROM users WHERE id = ?',
        [id],
      );
      return rows;
    } catch (error) {
      console.error('Error fetching users from database:', error);
      throw error;
    }
  } else {
    try {
      const [rows] = await db.query(
        'SELECT id, name, username, email FROM users',
      );
      return rows;
    } catch (error) {
      console.error('Error fetching users from database:', error);
      throw error;
    }
  }
};

export const fetchResidents = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM residents');
    return rows;
  } catch (err) {
    console.error('Error fetching residents:', err);
    throw err;
  }
};

export const editAccount = async (
  event: IpcMainInvokeEvent,
  formData: SignupPayload,
  userId: number,
) => {
  if (formData.password === '') {
    try {
      const query =
        'UPDATE users SET username = ?, name = ?, email = ? WHERE id = ?';
      const values = [formData.username, formData.name, formData.email, userId];
      db.query(query, values)
        .then((value: [QueryResult, FieldPacket[]]) => {
          event.sender.send('edit-response', {
            success: true,
            message: 'Edit successful',
          });
        })
        .catch(() => {
          event.sender.send('signup-response', {
            success: false,
            message: 'Edit failed!',
          });
        });
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const query =
        'UPDATE users SET username = ?, password = ?, name = ?, email = ? WHERE id = ?';
      genSalt(saltRounds)
        .then((salt) => hash(formData.password, salt))
        .then((hashedPassword) => {
          const values = [
            formData.username,
            hashedPassword,
            formData.name,
            formData.email,
            userId,
          ];
          db.query(query, values)
            .then((value: [QueryResult, FieldPacket[]]) => {
              event.sender.send('edit-response', {
                success: true,
                message: 'Edit successful',
              });
            })
            .catch(() => {
              event.sender.send('edit-response', {
                success: false,
                message: 'Edit failed!',
              });
            });
        });
    } catch (err) {
      console.log(err);
    }
  }
};

export const deleteAccount = (event: IpcMainInvokeEvent, userId: number) => {
  const query = 'DELETE FROM users WHERE id = ?';
  const values = [userId];
  try {
    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('delete-user-response', {
          success: true,
          message: 'Xóa tài khoản thành công',
        });
      })
      .catch(() => {
        event.sender.send('delete-user-response', {
          success: false,
          message: 'Tài khoản không tồn tại!',
        });
      });
  } catch (err) {
    event.sender.send('delete-user-response', {
      success: false,
      message: 'Lỗi máy chủ! Vui lòng thử lại sau.',
    });
  }
};

export const getResidentsData = async () => {
  const todayYear = new Date().getFullYear();
  try {
    const [result] = await db.query(
      'select	count(*) as totalResidents, count(case when birth_year > ? then 1 else null end) as totalChildren, count(case when (birth_year <= ? and birth_year > ?) then 1 else null end) as totalAdults, count(case when birth_year <= ? then 1 else null end) as totalElders, count(case when gender = ? then 1 else null end) as totalMale, count(case when gender = ? then 1 else null end) as totalFemale from db.residents',
      [
        todayYear - 18,
        todayYear - 18,
        todayYear - 50,
        todayYear - 50,
        'Nam',
        'Nữ',
      ],
    );
    const childrenData = new ChartData('0 - 18', result[0].totalChildren);
    const adultsData = new ChartData(
      '18 - 50',
      result[0].totalResidents - result[0].totalChildren,
    );
    const elderData = new ChartData('Trên 50', result[0].totalElders);
    const maleData = new ChartData('Nam', result[0].totalMale);
    const femaleData = new ChartData(
      'Nữ',
      result[0].totalResidents - result[0].totalMale,
    );
    return {
      ageCount: [childrenData, adultsData, elderData],
      genderCount: [maleData, femaleData],
    };
  } catch (err) {
    console.log(err);
  }
};

export const getRequiredFeeData = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM db.fee_required');
    return rows;
  } catch (err) {
    console.error('Error fetching RequiredFee data:', err);
    throw err;
  }
};

export const addRequiredFee = async (
  event: IpcMainInvokeEvent,
  feeData: any,
) => {
  try {
    const query =
      'INSERT INTO db.fee_required (fee_name, unit_price, unit) VALUES (?, ?, ?)';
    const values = [feeData.feeName, feeData.feeUnitPrice, feeData.feeUnit];

    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('add-required-fee-response', {
          success: true,
          message: 'Thêm khoản thu bắt buộc thành công!',
        });
      })
      .catch((err) => {
        event.sender.send('add-required-fee-response', {
          success: false,
          message: 'Thêm khoản thu bắt buộc thất bại!',
        });
      });
  } catch {
    event.sender.send('add-required-fee-response', {
      success: false,
      message: 'Server error!',
    });
  }
};

export const editRequiredFee = async (
  event: IpcMainInvokeEvent,
  feeData: any,
  editId: number,
) => {
  try {
    const query =
      'UPDATE db.fee_required SET fee_name = ?, unit_price = ?, unit = ? WHERE fee_id = ?';
    const values = [
      feeData.feeName,
      feeData.feeUnitPrice,
      feeData.feeUnit,
      editId,
    ];

    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('edit-required-fee-response', {
          success: true,
          message: 'Sửa khoản thu bắt buộc thành công!',
        });
      })
      .catch((err) => {
        event.sender.send('edit-required-fee-response', {
          success: false,
          message: 'Sửa khoản thu bắt buộc thất bại!',
        });
        console.log(err);
      });
  } catch {
    event.sender.send('edit-required-fee-response', {
      success: false,
      message: 'Server error!',
    });
  }
};

export const deleteRequiredFee = async (
  event: IpcMainInvokeEvent,
  feeId: number,
) => {
  try {
    const query = 'DELETE FROM db.fee_required WHERE fee_id = ?';
    const values = [feeId];

    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('delete-required-fee-response', {
          success: true,
          message: 'Xóa khoản thu bắt buộc thành công!',
        });
      })
      .catch((err) => {
        console.log(err);
        event.sender.send('delete-required-fee-response', {
          success: false,
          message: 'Xóa khoản thu bắt buộc thất bại!',
        });
      });
  } catch {
    event.sender.send('delete-required-fee-response', {
      success: false,
      message: 'Server error!',
    });
  }
};

export const getContributeFeeData = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM db.fee_contribute');
    return rows;
  } catch (err) {
    console.error('Error fetching ContributeFee data:', err);
    throw err;
  }
};

export const addContributeFee = async (
  event: IpcMainInvokeEvent,
  feeData: any,
) => {
  try {
    const query =
      'INSERT INTO db.fee_contribute (fee_name, total_money) VALUES (?, ?)';
    const values = [feeData.feeName, feeData.totalMoney];

    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('add-contribute-fee-response', {
          success: true,
          message: 'Thêm khoản đóng góp thành công!',
        });
      })
      .catch((err) => {
        event.sender.send('add-contribute-fee-response', {
          success: false,
          message: 'Thêm khoản đóng góp thất bại!',
        });
      });
  } catch {
    event.sender.send('add-contribute-fee-response', {
      success: false,
      message: 'Server error!',
    });
  }
};

export const editContributeFee = async (
  event: IpcMainInvokeEvent,
  feeData: any,
  editId: number,
) => {
  try {
    const query =
      'UPDATE db.fee_contribute SET fee_name = ?, total_money = ? WHERE fee_id = ?';
    const values = [feeData.feeName, feeData.totalMoney, editId];

    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('edit-contribute-fee-response', {
          success: true,
          message: 'Sửa khoản đóng góp thành công!',
        });
      })
      .catch((err) => {
        event.sender.send('edit-contribute-fee-response', {
          success: false,
          message: 'Sửa khoản đóng góp thất bại!',
        });
        console.log(err);
      });
  } catch {
    event.sender.send('edit-contribute-fee-response', {
      success: false,
      message: 'Server error!',
    });
  }
};

export const deleteContributeFee = async (
  event: IpcMainInvokeEvent,
  feeId: number,
) => {
  try {
    const query = 'DELETE FROM db.fee_contribute WHERE fee_id = ?';
    const values = [feeId];

    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('delete-contribute-fee-response', {
          success: true,
          message: 'Xóa khoản đóng góp thành công!',
        });
      })
      .catch((err) => {
        console.log(err);
        event.sender.send('delete-contribute-fee-response', {
          success: false,
          message: 'Xóa khoản đóng góp thất bại!',
        });
      });
  } catch {
    event.sender.send('delete-contribute-fee-response', {
      success: false,
      message: 'Server error!',
    });
  }
};

export const queryRequiredFee = async (
  event: IpcMainInvokeEvent,
  query: string,
) => {
  try {
    if (query) {
      const [rows] = await db.query(
        'SELECT * FROM db.fee_required WHERE fee_name LIKE ?',
        [`%${query}%`],
      );
      return rows;
    } else {
      const [rows] = await db.query('SELECT * FROM db.fee_required');
      return rows;
    }
  } catch (err) {
    console.error('Error fetching RequiredFee data:', err);
    throw err;
  }
};

export const queryContributeFee = async (
  event: IpcMainInvokeEvent,
  query: string,
) => {
  try {
    if (query) {
      const [rows] = await db.query(
        'SELECT * FROM db.fee_contribute WHERE fee_name LIKE ?',
        [`%${query}%`],
      );
      return rows;
    } else {
      const [rows] = await db.query('SELECT * FROM db.fee_contribute');
      return rows;
    }
  } catch (err) {
    console.error('Error fetching ContributeFee data:', err);
    throw err;
  }
};

export const addResident = async (
  event: IpcMainInvokeEvent,
  residentData: any,
) => {
  try {
    const query =
      'INSERT INTO db.residents (room_number, full_name, birth_year, gender, occupation, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
      residentData.room_number,
      residentData.full_name,
      residentData.birth_year,
      residentData.gender,
      residentData.occupation,
      residentData.phone_number,
      residentData.email,
    ];
    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('add-resident-response', {
          success: true,
          message: 'Thêm cư dân thành công!',
        });
      })
      .catch((err) => {
        event.sender.send('add-resident-response', {
          success: false,
          message: 'Thêm cư dân thất bại!',
        });
        console.log(err);
      });
  } catch {
    event.sender.send('add-resident-response', {
      success: false,
      message: 'Server error!',
    });
    console.log('Error');
  }
};

export const editResident = async (
  event: IpcMainInvokeEvent,
  residentData: Resident,
) => {
  try {
    const query =
      'UPDATE db.residents SET room_number = ?, full_name = ?, birth_year = ?, occupation = ?, phone_number = ?, email = ? WHERE id = ?';
    const values = [
      residentData.room_number,
      residentData.full_name,
      residentData.birth_year,
      residentData.occupation,
      residentData.phone_number,
      residentData.email,
      residentData.id,
    ];
    db.query(query, values)
      .then((value: [QueryResult, FieldPacket[]]) => {
        event.sender.send('add-resident-response', {
          success: true,
          message: 'Thêm cư dân thành công!',
        });
      })
      .catch((err) => {
        console.log(err);
        event.sender.send('add-resident-response', {
          success: false,
          message: 'Thêm cư dân thất bại!',
        });
      });
  } catch {
    event.sender.send('add-resident-response', {
      success: false,
      message: 'Server error!',
    });
  }
};
