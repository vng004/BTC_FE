import { Form, Input, message, Modal, Select } from "antd";
import { FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatDateDay } from "../../../constants/util";
import { PurchaseOrder } from "../../../interfaces/PurchaseOrder";
import {
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
} from "../../../redux/slices/purchaseOrderApiSlice";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const DetailPurchaseOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [status, SetStatus] = useState<0 | 1 | 2 | 3>(0);
  const { data } = useGetPurchaseOrderByIdQuery(id!, {
    skip: !id,
  });
  const [updatePurchaseOrder, { isLoading: isUpdating }] =
    useUpdatePurchaseOrderMutation();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const onFinish = async (values: Partial<PurchaseOrder>) => {
    if (!id) return;
    try {
      await updatePurchaseOrder({
        id,
        data: values,
      }).unwrap();
      message.success("Cập nhật đơn hàng thành công");
      navigate("/admin/purchase-order");
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  const confirmStatusChange = (value: 0 | 1 | 2 | 3) => {
    Modal.confirm({
      title: (
        <span className="text-[#ef4d38]">Xác nhận thay đổi trạng thái</span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0] text-[#685f78]">
          Bạn có chắc chắn muốn{" "}
          <span className="text-[#ef4d38] font-semibold text-[16px]">
            thay đổi trạng thái
          </span>{" "}
          đơn hàng này không?
        </p>
      ),
      okText: "Xác nhận",
      okType: "danger",
      okButtonProps: {
        style: {
          backgroundColor: "#F84563",
          borderColor: "#F84563",
          color: "#fff",
        },
      },
      cancelButtonProps: {
        style: {
          backgroundColor: "#fff",
          color: "#F84563",
          borderColor: "#F84563",
        },
      },
      cancelText: "Hủy",
      centered: true,
      maskClosable: false,
      icon: null,
      width: 600,
      onOk: () => {
        form.setFieldsValue({ status: value });
        SetStatus(value);
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>{getTitleTab(`Chi tiết đơn hàng`)}</title>
      </Helmet>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isUpdating}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white rounded-[50px] shadow-xl p-4">
          <div className="flex items-center gap-x-6 mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">
              Chỉnh sửa đơn hàng: <span>{data?.orderCode}</span>
              <span className="text-lg text-gray-700">
                ({formatDateDay(data?.createdAt)})
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-x-4 w-full md:w-auto">
            <Form.Item name="status" className="mb-0 flex-1 md:flex-none">
              <Select
                value={status}
                onChange={confirmStatusChange}
                className="h-10 min-w-[190px] "
              >
                <Option value={0}>
                  <p className="text-orange-500 text-lg font-semibold">
                    Chưa xác nhận
                  </p>
                </Option>
                <Option value={1}>
                  <p className="text-blue-500 text-lg font-semibold">
                    Đã xác nhận
                  </p>
                </Option>
                <Option value={2}>
                  <p className="text-purple-500 text-lg font-semibold">
                    Đã đặt cọc
                  </p>
                </Option>
                <Option value={3}>
                  <p className="text-green-500 text-lg font-semibold">
                    Tất toán đơn hàng
                  </p>
                </Option>
                <Option value={4}>
                  <p className="text-red-500 text-lg font-semibold">Hủy đơn</p>
                </Option>
              </Select>
            </Form.Item>
            <button
              type="submit"
              disabled={isUpdating}
              className="border-2 w-full md:w-[140px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md disabled:opacity-50"
            >
              {isUpdating ? <LoadingOutlined /> : <FilePenLine size={18} />}
              Cập nhật
            </button>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-x-2">
          <Form.Item label="Mã khách hàng" name="customerCode">
            <Input disabled className="py-[10px]" />
          </Form.Item>
          <Form.Item label="Tên khách hàng" name="fullName">
            <Input disabled className="py-[10px]" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input disabled className="py-[10px]" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled className="py-[10px]" />
          </Form.Item>
          <Form.Item label="Tên sản phẩm" name="productName">
            <Input disabled className="py-[10px]" />
          </Form.Item>

          <Form.Item label="Link sản phẩm" name="productLink">
            <input
              className="border rounded-md py-[10px] px-3 w-full hover:border-orange-500 text-gray-700 outline-none "
              type="text"
              name="productLink"
              disabled
            />
          </Form.Item>

          <Form.Item label="Thông số hàng" name="orderDetails">
            <Input.TextArea rows={6} disabled />
          </Form.Item>

          <div>
            <Form.Item label="Số lượng" name="quantity">
              <Input disabled className="py-[10px]" />
            </Form.Item>
            <Form.Item label="Giá trị thực" name="actualValue">
              <Input disabled className="py-[10px]" />
            </Form.Item>
          </div>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={6} placeholder="Nhập mô tả (tùy chọn)" />
          </Form.Item>
          <Form.Item
            label="Mã vận đơn"
            name="trackingCode"
            rules={[{ required: true, message: "Vui lòng nhập mã vận đơn" }]}
          >
            <Input placeholder="Nhập mã vận đơn" className="py-[10px]" />
          </Form.Item>

          <Form.Item label="Phí nội địa" name="domesticFee">
            <Input
              placeholder="Nhập phí nội địa (tùy chọn)"
              className="py-[10px]"
            />
          </Form.Item>
          <Form.Item
            label="Tổng tiền"
            name="totalAmount"
            rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
          >
            <Input placeholder="Nhập tổng tiền" className="py-[10px]" />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default DetailPurchaseOrder;
