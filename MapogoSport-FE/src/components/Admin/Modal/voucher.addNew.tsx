import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MutatorCallback, MutatorOptions } from "swr";

interface Voucher {
  voucherId?: number
  name: string
  discountPercent: number
  quantity: number
  createDate: Date
  endDate: Date
  status: string
  discountCode: string
  activeDate: Date
  createdBy: User | null
}

interface UserProps {
  showAddVoucher: boolean;
  setShowAddVoucher: (v: boolean) => void;
  voucher?: Voucher | null;
  currentUser?: User | null;
  onFetch: (data?: MutatorCallback<Voucher[]> | Voucher[], opts?: boolean | MutatorOptions) => Promise<Voucher[] | undefined>;
}

const BASE_URL = "http://localhost:8080";

const VoucherAddNew = ({ showAddVoucher, setShowAddVoucher, voucher, currentUser, onFetch }: UserProps) => {
  const [formValue, setFormValue] = useState<Voucher>({
    name: "",
    discountPercent: 0,
    quantity: 0,
    createDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: "inactive", // Default status
    discountCode: "",
    activeDate: new Date(),
    createdBy: null,
  });

  useEffect(() => {
    if (currentUser) {
      setFormValue((prevState) => ({
        ...prevState,
        createdBy: currentUser,
      }));
    }
  }, [currentUser]); // Cập nhật createdBy mỗi khi currentUser thay đổi

  const setFormValueNull = () => {
    if (!currentUser) {
      console.error("currentUser is null or username is missing");
      return; // Ngừng nếu currentUser hoặc username không hợp lệ
    }

    setFormValue({
      name: "",
      discountPercent: 0,
      quantity: 0,
      createDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      status: "inactive", // Default status
      discountCode: "",
      activeDate: new Date(),
      createdBy: currentUser, // Gán đúng giá trị username từ currentUser
    });
  };

  useEffect(() => {
    if (voucher && showAddVoucher) {
      setFormValue({
        name: voucher.name,
        discountPercent: voucher.discountPercent,
        quantity: voucher.quantity,
        createDate: voucher.createDate ? new Date(voucher.createDate) : new Date(), // Đảm bảo tạo Date hợp lệ
        endDate: voucher.endDate ? new Date(voucher.endDate) : new Date(), // Đảm bảo tạo Date hợp lệ
        status: voucher.status,
        discountCode: voucher.discountCode,
        activeDate: voucher.activeDate ? new Date(voucher.activeDate) : new Date(), // Đảm bảo tạo Date hợp lệ
        createdBy: voucher.createdBy || currentUser || null,
      });
    } else {
      setFormValueNull();
    }
  }, [voucher, currentUser, showAddVoucher]);


  const handleClose = () => {
    setFormValueNull();
    setShowAddVoucher(false);
  };

  const handleUpdateVoucher = async () => {
    try {
      await axios.put(`${BASE_URL}/rest/update/voucher/${voucher?.voucherId}`,
        JSON.stringify({
          name: formValue.name,
          discountPercent: formValue.discountPercent,
          quantity: formValue.quantity,
          createDate: formValue.createDate.toISOString(),
          endDate: formValue.endDate.toISOString(),
          status: formValue.status,
          discountCode: formValue.discountCode,
          activeDate: formValue.activeDate.toISOString(),
          createdBy: formValue.createdBy?.username,
        }), {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });
      toast.success("Cập nhật mã giảm giá thành công!");
      onFetch();
    } catch (error) {
      console.error("Lỗi khi tạo update voucher:", error);
    }
  };


  const handleCreateVoucher = async () => {
    try {
      await axios.post(`${BASE_URL}/rest/create/voucher`, // URL của API bạn đã tạo ở backend
        JSON.stringify({
          name: formValue.name,
          discountPercent: formValue.discountPercent,
          quantity: formValue.quantity,
          createDate: formValue.createDate ? new Date(formValue.createDate) : new Date(), // Đảm bảo tạo Date hợp lệ
          endDate: formValue.endDate ? new Date(formValue.endDate) : new Date(), // Đảm bảo tạo Date hợp lệ
          status: formValue.status,
          discountCode: formValue.discountCode,
          activeDate: formValue.activeDate ? new Date(formValue.activeDate) : new Date(), // Đảm bảo tạo Date hợp lệ
          createdBy: formValue.createdBy?.username,
        }), {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });
      toast.success("thành công tạo voucher");
      onFetch();
    } catch (error) {
      console.error("Lỗi khi tạo voucher:", error);
    }
  };

  const isValidate = () => {
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
      toast.warning("Ngày hết hạn không thể là quá khứ trong is validate");
      return false;
    }

    // Kiểm tra ngày hoạt động
    if (!formValue.activeDate) {
      toast.warning("Vui lòng chọn ngày hoạt động");
      return false;
    }

    const activeDate = new Date(formValue.activeDate);
    const currentDate = new Date();
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
    if (voucher) {
      const endDate = new Date(formValue.endDate);
      const currentDate = new Date();
      endDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (endDate < currentDate) {
        toast.warning("Ngày hết hạn nhỏ hơn ngày hiện tại!");
        return false;
      }
      handleUpdateVoucher();
    } else {
      if (!isValidate()) {
        return
      }
      handleCreateVoucher();
    }
    handleClose();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const option = [
    { label: "Chưa hiệu lực", value: "inactive" },
    { label: "Có hiệu lực", value: "active" },
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
    <Modal show={showAddVoucher} onHide={handleClose} centered backdrop="static" keyboard={true}>
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase text-danger">
          {voucher ? "Chỉnh Sửa mã giảm giá" : "Tạo mã giảm giá"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Floating>
                  <Form.Control type="text" placeholder="Mã code" name="discountCode" value={formValue.discountCode}
                    onChange={handleChange} />
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
                    value={formValue.createdBy ? formValue.createdBy.fullname : ""}
                    // value={formValue.createdBy?.fullname }
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
                        ? new Date(formValue.endDate).toLocaleDateString("en-CA")
                        : ""
                    }
                    onChange={handleChange}
                    // min={new Date(new Date(formValue?.activeDate).setDate(new Date(formValue?.activeDate).getDate() + 1)).toISOString().split("T")[0]}                   />
                    min={new Date(new Date(formValue?.activeDate).setDate(new Date(formValue?.activeDate).getDate())).toISOString().split("T")[0]} />
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
                    // max={new Date(formValue?.endDate).toISOString().split("T")[0]}
                    disabled={
                      formValue.activeDate &&
                      new Date(formValue.activeDate).getTime() < new Date().setHours(0, 0, 0, 0)
                    } />
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
