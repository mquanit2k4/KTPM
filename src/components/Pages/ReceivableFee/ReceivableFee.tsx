import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ContributeFee, RequiredFee } from '../../../interface/interface';
import UILayout from '../../../../utils/UILayout';
import FeeTable from './FeeTable';

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
    } else if (action === 'edit') {
      await window.electronAPI.editContributeFee(data, editId);
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
      setRequiredFee(requiredFeeData);
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
      setContributeFee(contributeFeeData);
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
    setContributeFee(queryResult);
  };

  const getData = async () => {
    await Promise.all([fetchRequiredFee(), fetchContributeFee()]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <UILayout title="Khoản thu">
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
