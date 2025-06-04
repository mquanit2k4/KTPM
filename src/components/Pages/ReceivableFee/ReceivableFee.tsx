import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ContributeFee, RequiredFee } from '../../../interface/interface';
import UILayout from '../../../../utils/UILayout';
import FeeTable from './FeeTable';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

const handleSubmitRequiredFee = async (
  data: RequiredFee,
  action: any,
  editId: number,
) => {
  try {
    if (action === 'add') {
      await window.electronAPI.addRequiredFee(data);
    } else if (action === 'edit') {
      await window.electronAPI.editRequiredFee(data, editId);
      toast.success('Sửa khoản thu thành công!', {
        position: 'top-right',
        autoClose: 3000,
        style: { marginTop: 60 },
      });
    } else if (action === 'delete') {
      await window.electronAPI.deleteRequiredFee(editId);
    }
  } catch (err) {
    console.error('Error adding RequiredFee:', err);
  }
};

const handleSubmitContributeFee = async (
  data: ContributeFee,
  action: any,
  editId: number,
) => {
  try {
    if (action === 'add') {
      await window.electronAPI.addContributeFee(data);
      toast.success('Đã thêm khoản đóng góp mới thành công!', {
        position: 'top-right',
        autoClose: 3000,
        style: { marginTop: 60 },
      });
    } else if (action === 'edit') {
      await window.electronAPI.editContributeFee(data, editId);
      toast.success('Sửa khoản thu thành công!', {
        position: 'top-right',
        autoClose: 3000,
        style: { marginTop: 60 },
      });
    } else if (action === 'delete') {
      await window.electronAPI.deleteContributeFee(editId);
    }
  } catch (err) {
    console.error('Error adding ContributeFee:', err);
  }
};

const ReceivableFee = () => {
  const [loading, setLoading] = useState([true, true]);
  const [requiredFee, setRequiredFee] = useState<RequiredFee[]>([]);
  const [contributeFee, setContributeFee] = useState<ContributeFee[]>([]);

  const fetchRequiredFee = async () => {
    try {
      setLoading((prev) => [true, prev[1]]);
      const requiredFeeData = await window.electronAPI.fetchRequiredFee();
      const requiredFeeWithName = requiredFeeData.map((fee: any) => ({
        ...fee,
        name: fee.name || fee.fee_name,
      }));
      setRequiredFee(requiredFeeWithName);
    } catch (err) {
      console.error('Error fetching RequiredFee data:', err);
    } finally {
      setLoading((prev) => [false, prev[1]]);
    }
  };

  const fetchContributeFee = async () => {
    try {
      setLoading((prev) => [prev[0], true]);
      const contributeFeeData = await window.electronAPI.fetchContributeFee();
      const transferFeeData = await window.electronAPI.fetchTransferFee();

      // Tính tổng số tiền đã đóng góp cho từng khoản đóng góp
      const totalByFeeName: Record<string, number> = {};
      transferFeeData.forEach((item: any) => {
        if (item.fee_type === 'Tự nguyện') {
          totalByFeeName[item.fee_name] = (totalByFeeName[item.fee_name] || 0) + Number(item.money);
        }
      });

      // Gán trường name và tổng tiền vào từng khoản đóng góp
      const contributeFeeWithTotal = contributeFeeData.map((fee: any, idx: number) => ({
        ...fee,
        name: fee.name || fee.fee_name || `Khoản đóng góp ${idx + 1}`,
        totalAmount: totalByFeeName[fee.fee_name || fee.name] || 0,
      }));

      setContributeFee(contributeFeeWithTotal);
    } catch (err) {
      console.error('Error fetching ContributeFee data:', err);
    } finally {
      setLoading((prev) => [prev[0], false]);
    }
  };

  const searchRequiredQuery = async (query: string) => {
    const queryResult = await window.electronAPI.queryRequiredFee(query);
    setRequiredFee(queryResult);
  };

  const searchContributeQuery = async (query: string) => {
    const queryResult = await window.electronAPI.queryContributeFee(query);
    setContributeFee(
      queryResult.map((fee: any, idx: number) => ({
        ...fee,
        name: fee.name || fee.fee_name || `Khoản đóng góp ${idx + 1}`,
        totalAmount: fee.total_amount || 0,
      }))
    );
  };

  const getData = async () => {
    await Promise.all([fetchRequiredFee(), fetchContributeFee()]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <UILayout title="Khoản thu">
      <ToastContainer />
      <Accordion alwaysOpen>
        <FeeTable
          eventKey="0"
          tableName="Khoản thu bắt buộc"
          addDataName="Tạo khoản bắt buộc mới"
          editDataName="Sửa khoản bắt buộc"
          rowData={requiredFee}
          loading={loading[0]}
          theadTitle={[
            'STT',
            'Tên khoản thu',
            'Đơn giá',
            'Đơn vị',
            'Hành động',
          ]}
          onSubmit={handleSubmitRequiredFee}
          triggerReload={fetchRequiredFee}
          onSearch={searchRequiredQuery}
          requiredFee
        />
        <FeeTable
          eventKey="1"
          tableName="Khoản đóng góp"
          addDataName="Tạo khoản đóng góp mới"
          editDataName="Sửa khoản đóng góp"
          rowData={contributeFee}
          loading={loading[1]}
          theadTitle={[
            'STT',
            'Tên khoản đóng góp',
            'Tổng số tiền đã đóng góp',
            'Hành động',
          ]}
          onSubmit={handleSubmitContributeFee}
          onSearch={searchContributeQuery}
          triggerReload={fetchContributeFee}
        />
      </Accordion>
    </UILayout>
  );
};

export default ReceivableFee;
