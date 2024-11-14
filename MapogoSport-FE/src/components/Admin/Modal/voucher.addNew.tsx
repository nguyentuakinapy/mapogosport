import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useData } from "@/app/context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';


interface UserProps {
  showAddVoucher: boolean;
  setShowAddVoucher: (v: boolean) => void;
  voucher?: Voucher | null;
  currentUser?: User | null;
  onFetch: any;
}

const BASE_URL = "http://localhost:8080";

const VoucherAddNew = ({
  showAddVoucher,
  setShowAddVoucher,
  voucher,
  currentUser,
  onFetch,
}: UserProps) => {
  const [formValue, setFormValue] = useState<Voucher>({
    // voucherId: 0,
    name: "",
    discountPercent: 0,
    quantity: 0,
    createDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: "inactive", // Default status
    discountCode: "",
    activeDate: new Date(),
    createdBy: "",
  });

  useEffect(() => {
    if (currentUser?.username) {
      setFormValue((prevState) => ({
        ...prevState,
        createdBy: currentUser.username,
      }));
    }
  }, [currentUser]); // Cập nhật createdBy mỗi khi currentUser thay đổi

  const setFormValueNull = () => {
    if (!currentUser?.username) {
      console.error("currentUser is null or username is missing");
      return; // Ngừng nếu currentUser hoặc username không hợp lệ
    }

    setFormValue({
      //   voucherId: 0,
      name: "",
      discountPercent: 0,
      quantity: 0,
      createDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      status: "inactive", // Default status
      discountCode: "",
      activeDate: new Date(),
      createdBy: currentUser.username, // Gán đúng giá trị username từ currentUser
    });
  };

  useEffect(() => {
    if (voucher) {
      console.log("voucher: ", voucher);
      console.log("voucher createDate: ", voucher.createDate);
      console.log("voucher: activeDate ", voucher.activeDate);
      console.log("voucher: endDate ", voucher.endDate);

      setFormValue({
        // voucherId: voucher.voucherId,
        name: voucher.name,
        discountPercent: voucher.discountPercent,
        quantity: voucher.quantity,
        createDate: voucher.createDate
          ? new Date(voucher.createDate)
          : new Date(), // Đảm bảo tạo Date hợp lệ
        endDate: voucher.endDate ? new Date(voucher.endDate) : new Date(), // Đảm bảo tạo Date hợp lệ
        status: voucher.status,
        discountCode: voucher.discountCode,
        activeDate: voucher.activeDate
          ? new Date(voucher.activeDate)
          : new Date(), // Đảm bảo tạo Date hợp lệ
        createdBy: voucher.createdBy,
      });
    } else {
      setFormValueNull();
    }
  }, [voucher]);
  

  const handleClose = () => {
    setFormValueNull();
    setShowAddVoucher(false);
  };

  // Gửi yêu cầu tạo voucher mới
//   const handleUpdateVoucher = async () => {
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/rest/update/voucher/${voucher?.voucherId}`, // URL của API bạn đã tạo ở backend

//         JSON.stringify({
//           name: formValue.name,
//           discountPercent: formValue.discountPercent,
//           quantity: formValue.quantity,
//           createDate: formValue.createDate
//             ? new Date(formValue.createDate)
//             : new Date(), // Đảm bảo tạo Date hợp lệ
//           endDate: formValue.endDate ? new Date(formValue.endDate) : new Date(), // Đảm bảo tạo Date hợp lệ
//           status: formValue.status,
//           discountCode: formValue.discountCode,
//           activeDate: formValue.activeDate
//             ? new Date(formValue.activeDate)
//             : new Date(), // Đảm bảo tạo Date hợp lệ
//           createdBy: formValue.createdBy,
//         }),
//         {
//           headers: {
//             Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       toast.success("thành công update voucher");
//       onFetch();
//       console.log("Voucher đã được update:", response.data);
//     } catch (error) {
//       console.error("Lỗi khi tạo update voucher:", error);
//     }
//   };
const handleUpdateVoucher = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/rest/update/voucher/${voucher?.voucherId}`,
        JSON.stringify({
          name: formValue.name,
          discountPercent: formValue.discountPercent,
          quantity: formValue.quantity,
          createDate: formValue.createDate.toISOString(),
          endDate: formValue.endDate.toISOString(),
          status: formValue.status,
          discountCode: formValue.discountCode,
          activeDate: formValue.activeDate.toISOString(),
          createdBy: formValue.createdBy,
        }),
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("thành công update voucher");
      onFetch();
      console.log("Voucher đã được update:", response.data);
    } catch (error) {
      console.error("Lỗi khi tạo update voucher:", error);
    }
  };
  

  const handleCreateVoucher = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/rest/create/voucher`, // URL của API bạn đã tạo ở backend

        JSON.stringify({
          name: formValue.name,
          discountPercent: formValue.discountPercent,
          quantity: formValue.quantity,
          createDate: formValue.createDate
            ? new Date(formValue.createDate)
            : new Date(), // Đảm bảo tạo Date hợp lệ
          endDate: formValue.endDate ? new Date(formValue.endDate) : new Date(), // Đảm bảo tạo Date hợp lệ
          status: formValue.status,
          discountCode: formValue.discountCode,
          activeDate: formValue.activeDate
            ? new Date(formValue.activeDate)
            : new Date(), // Đảm bảo tạo Date hợp lệ
          createdBy: formValue.createdBy,
        }),
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("thành công tạo voucher");
      onFetch();
      console.log("Voucher đã được tạo:", response.data);
    } catch (error) {
      console.error("Lỗi khi tạo voucher:", error);
    }
  };

  const isValidate = () => {
    // Kiểm tra tên voucher
    console.log("form nảm, ", formValue.name);
    if (formValue.discountCode === "") {
        toast.warning("Vui lòng nhập mã code");
        return false;
    }

    if (formValue.name === "") {
        toast.warning("Vui lòng nhập tên voucher");
        return false;
    }

    // Kiểm tra phần trăm giảm giá
    if (!formValue.discountPercent || formValue.discountPercent <= 0) {
        toast.warning("Vui lòng nhập phần trăm giảm giá hợp lệ");
        return false;
    }

    // Kiểm tra số lượng
    if (!formValue.quantity || formValue.quantity <= 0) {
        toast.warning("Vui lòng nhập số lượng hợp lệ");
        return false;
    }

    // Kiểm tra ngày tạo
    if (!formValue.createDate) {
        toast.warning("Vui lòng chọn ngày tạo");
        return false;
    }

    // Kiểm tra ngày hết hạn
    if (!formValue.endDate) {
        toast.warning("Vui lòng chọn ngày hết hạn");
        return false;
    }

    // Kiểm tra ngày hết hạn không trước ngày hiện tại
    if (new Date(formValue.endDate) < new Date()) {
        toast.warning("Ngày hết hạn không thể là quá khứ");
        return false;
    }

    // Kiểm tra ngày hoạt động
    if (!formValue.activeDate) {
        toast.warning("Vui lòng chọn ngày hoạt động");
        return false;
    }
   
    const activeDate = new Date(formValue.activeDate);
    const currentDate = new Date();

    // Đặt giờ của cả hai ngày về 00:00 để chỉ so sánh ngày
    activeDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (activeDate < currentDate) {
        toast.warning("Ngày kích hoạt không thể là quá khứ");
        return false;
    }

    // Kiểm tra trạng thái
    if (!formValue.status) {
        toast.warning("Vui lòng chọn trạng thái");
        return false;
    }

    return true; // Tất cả các trường hợp đã hợp lệ
};

  const handleSave = () => {
    if(!isValidate()){
        return
    }
    if (voucher) {
        console.log("form value", formValue);
      handleUpdateVoucher();
    } else {
      console.log("form value", formValue);
      handleCreateVoucher();
    }
    // Lưu dữ liệu đã chỉnh sửa
    console.log("Saving voucher:", formValue);
    handleClose();
  };

  const dateFields = ["endDate", "createDate", "activeDate"]; // Các trường cần chuyển đổi thành Date

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     // Kiểm tra xem tên trường có phải là một trong những trường cần chuyển đổi không
//     if (dateFields.includes(name)) {
//       setFormValue({
//         ...formValue,
//         [name]: new Date(value), // Chuyển đổi giá trị thành Date
//       });
//     } else {
//       setFormValue({
//         ...formValue,
//         [name]: value,
//       });
//     }
//   };
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Kiểm tra xem tên trường có phải là một trong những trường cần chuyển đổi không
    if (dateFields.includes(name)) {
      setFormValue(prevState => ({
        ...prevState,
        [name]: new Date(value), // Chuyển đổi giá trị thành Date
      }));
    } else {
      setFormValue(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const option = [
    { label: "Chưa hoạt động", value: "inactive" },
    { label: "Đang hoạt động", value: "active" },
  ];

  // Xử lý logic trạng thái: đang hoạt động, chưa hoạt động, hết hạn
  const getVoucherStatus = () => {
    const currentDate = new Date();
    if (formValue.status === "active" && formValue.endDate > currentDate) {
      return "Đang hoạt động"; // Đang hoạt động
    }
    if (formValue.status === "inactive") {
      return "Chưa hoạt động"; // Chưa hoạt động
    }
    if (formValue.endDate < currentDate) {
      return "Hết hạn"; // Hết hạn
    }
    return "Đang hoạt động"; // Mặc định là đang hoạt động nếu không có tình huống nào khác
  };

  return (
    <Modal
      show={showAddVoucher}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase text-danger">
          {voucher ? "Chỉnh Sửa Voucher" : "Tạo Voucher"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Mã code"
                    name="discountCode"
                    value={formValue.discountCode}
                    onChange={handleChange}
                  />
                  <Form.Label>
                    Mã Code <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Tên voucher"
                    name="name"
                    value={formValue.name}
                    onChange={handleChange}
                  />
                  <Form.Label>
                    Tên voucher <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Số lượng"
                    name="quantity"
                    value={formValue.quantity}
                    onChange={handleChange}
                  />
                  <Form.Label>
                    Số lượng <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Người tạo"
                    disabled
                    name="createdBy"
                    value={formValue.createdBy}
                    onChange={handleChange}
                  />
                  <Form.Label>
                    Người Tạo <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Giảm (%)"
                    name="discountPercent"
                    value={formValue.discountPercent}
                    onChange={handleChange}
                  />
                  <Form.Label>
                    Giảm (%) <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>
            </Col>
            <Col>
          
              <Form.Group className="mb-3">
                <Form.Floating>
               
                  <Form.Control
                    type="date"
                    placeholder="Ngày hết hạn"
                    name="endDate"
                    value={
                      formValue.endDate
                        ? formValue.endDate.toLocaleDateString("en-CA")
                        : ""
                    }
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}                   />
                  <Form.Label>
                    Ngày hết hạn <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    type="date"
                    placeholder="Ngày kích hoạt"
                    name="activeDate"
                    value={
                      formValue.activeDate
                        ? formValue.activeDate.toLocaleDateString("en-CA")
                        : ""
                    }
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <Form.Label>
                    Ngày Kích Hoạt <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    type="date"
                    disabled
                    placeholder="Ngày tạo"
                    name="createDate"
                    value={
                      formValue.createDate
                        ? formValue.createDate.toLocaleDateString("en-CA")
                        : ""
                    }
                    onChange={handleChange}
                  />
                  <Form.Label>
                    Ngày Tạo <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control
                    as="select"
                    name="status"
                    value={formValue.status}
                    onChange={handleChange}
                  >
                    {option.map((opt, idx) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Label>
                    Trạng thái <b className="text-danger">*</b>
                  </Form.Label>
                </Form.Floating>
              </Form.Group>

              {/* Hiển thị trạng thái theo logic */}
              <div>
                <strong>Trạng thái hiện tại:</strong> {getVoucherStatus()}
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button style={{ backgroundColor: "#142239" }} onClick={handleSave}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VoucherAddNew;
