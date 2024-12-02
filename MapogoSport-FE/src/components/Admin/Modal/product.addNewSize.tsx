"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "../admin.scss";
import { useMutation } from "@tanstack/react-query";
import useSWR from "swr";

interface IProps {
  isShowAddNewSize: boolean;
  ProductDetailWasCreated: number | null;
  setIsShowAddNewSize: Dispatch<SetStateAction<boolean>>;
  currentProductDetailSize: ProductDetailSize | null;
  selectedProductDetail: ProductDetail | null;
  onFetchProductDetailSize: (data?: ProductDetailSize[] | undefined) => void; // Hàm có thể nhận tham số hoặc không
}

const ModalProductAddNewSize = (props: IProps) => {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { isShowAddNewSize, setIsShowAddNewSize, currentProductDetailSize, selectedProductDetail,
    ProductDetailWasCreated, onFetchProductDetailSize } = props;
  const [isShowAddSizeModal, setIsShowAddSizeModal] = useState(false); // State để mở modal thêm kích cỡ mới
  const [newSizeName, setNewSizeName] = useState(""); // State cho tên kích cỡ mới
  const [sizes, setSizes] = useState<Size[]>([]); // Save list of sizes from API
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [formValues, setFormValues] = useState<{ sizeId: number; price: number; quantity: number; }>({ sizeId: 0, price: 0, quantity: 0 });
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


  const { data: sizeData, isLoading, mutate: refetch } = useSWR(`${BASE_URL}rest/size`, fetcher);

  // Cập nhật danh sách kích cỡ khi có dữ liệu từ API
  useEffect(() => {
    if (sizeData) {
      setSizes(sizeData);
      if (!formValues.sizeId && sizeData.length > 0) {
        // Thiết lập giá trị mặc định là kích cỡ đầu tiên nếu chưa có chọn lựa
        setFormValues((prev) => ({ ...prev, sizeId: sizeData[0].sizeId }));
      }
    }
  }, [sizeData]);

  // Update formValues when currentProductDetailSize changes
  useEffect(() => {
    if (currentProductDetailSize) {
      setFormValues({
        sizeId: currentProductDetailSize.size.sizeId ?? 0,
        price: currentProductDetailSize.price,
        quantity: currentProductDetailSize.quantity,
      });
    } else {
      setFormValues({ sizeId: 0, price: 0, quantity: 0 });
    }
  }, [currentProductDetailSize]);

  const addNewSize = async () => {
    if (!newSizeName) {
      toast.warning("Vui lòng nhập kích cỡ trước khi lưu")
      return
    }
    if (sizes.some((size) => size.sizeName.toLowerCase() === newSizeName.toLowerCase())) {
      toast.warning("Kích cỡ này đã tồn tại!");
      return;
    }
    try {
      await axios.post(`${BASE_URL}rest/size/create`, { sizeName: newSizeName });
      toast.success("Thêm kích cỡ mới thành công!");
      refetch(); // Tải lại danh sách kích cỡ
      setIsShowAddSizeModal(false); // Đóng modal thêm kích cỡ mới
    } catch (error) {
      toast.error("Lỗi khi thêm kích cỡ mới!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "sizeId" && value === "Thêm kích cỡ --") {
      setIsShowAddSizeModal(true);
      return;
    }

    // Chỉ chuyển đổi sang số nếu giá trị là một số hợp lệ
    const numericValue = Number(value);

    if (!isNaN(numericValue) && numericValue >= 0) {
      setFormValues((prevValues) => ({ ...prevValues, [name]: numericValue }));
    } else {
      toast.error("Vui lòng nhập đúng định dạng");
    }
  };

  // Hàm xử lý thay đổi giá trị input
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
    const numericValue = rawValue === "" ? 0 : Number(rawValue); // Chuyển giá trị thành số
    setFormValues((prevValues) => ({ ...prevValues, price: numericValue }));
    setDisplayPrice(numericValue);
  };

  // API to create a ProductDetailSize
  const createProductDetailSize = async (productDetailId: number, productDetailSize: ProductDetailSize) => {
    // Tạo một đối tượng FormData
    const formData = new FormData();

    // Thêm productDetailSize vào FormData
    formData.append("productDetailSize", JSON.stringify(productDetailSize)); // Chuyển đổi đối tượng thành JSON

    // const response = await axios.post(
    await axios.post(`${BASE_URL}rest/product-detail-size/create/${productDetailId}`, formData, // Gửi FormData
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đặt Content-Type cho FormData
        },
      }
    );
  };

  // API to update a ProductDetailSize
  const updateProductDetailSize = async (productDetailSizeId: number, productDetailSize: ProductDetailSize) => {
    const formData = new FormData();
    formData.append("productDetailSize", JSON.stringify(productDetailSize));

    const response = await axios.put(`${BASE_URL}rest/product-detail-size/update/${productDetailSizeId}`, formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: (productDetailSize: ProductDetailSize) => {
      return currentProductDetailSize ? updateProductDetailSize(currentProductDetailSize!.productDetailSizeId, productDetailSize)
        : createProductDetailSize(selectedProductDetail!.productDetailId, productDetailSize);
    },
    onSuccess: () => {
      toast.success("Kích cỡ đã được lưu thành công!");
      onFetchProductDetailSize(); // Gọi mutate để refetch dữ liệu
      handleCloseModal(); // Đóng modal sau khi lưu
    },
    onError: () => { toast.error("Có lỗi xảy ra khi lưu kích cỡ!") },
  });

  const handleAddSize = () => {
    const { sizeId, price, quantity } = formValues;
    if (!sizeId) {
      toast.error("Vui lòng chọn kích cỡ!");
      return; // Stop if no size selected
    }

    const sizeData: ProductDetailSize = {
      productDetail:
        selectedProductDetail !== null
          ? { productDetailId: selectedProductDetail.productDetailId }
          : ProductDetailWasCreated !== null
            ? { productDetailId: ProductDetailWasCreated }
            : { productDetailId: 0 },  // Gán giá trị mặc định nếu null

      size: { sizeId: sizeId ?? 0 },
      price: Number(price),
      quantity: Number(quantity),
      productDetailSizeId: 0,
    };
    mutation.mutate(sizeData); // Call the mutation function to add/update size
  };

  // Close the modal and reset form values
  const handleCloseModal = () => {
    setIsShowAddNewSize(false);
    setFormValues({ sizeId: 0, price: 0, quantity: 0 });
  };

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div>
      <Modal show={isShowAddNewSize} onHide={handleCloseModal} className="modal-dialog-centered modal-add-color">
        <Modal.Header closeButton>
          <Modal.Title>{currentProductDetailSize ? "Chỉnh sửa kích cỡ" : "Thêm kích cỡ mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label>Kích cỡ</Form.Label>
                  <Form.Select name="sizeId" value={formValues.sizeId} onChange={handleInputChange} style={{ border: '1px solid' }}>
                    <option>Chọn kích cỡ --</option>
                    {sizes.map((size: Size) => (
                      <option key={size.sizeId} value={size.sizeId}>{size.sizeName}</option>
                    ))}
                    <option>Thêm kích cỡ --</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label>Giá</Form.Label>
                  <InputGroup>
                    <Form.Control type="text" placeholder="Nhập giá" value={displayPrice.toLocaleString()}
                      onChange={handlePriceChange} />
                    <InputGroup.Text style={{ fontSize: '15px', fontWeight: 700, border: '1px solid' }}>VNĐ</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control type="number" name="quantity" placeholder="Nhập số lượng" value={formValues.quantity || ""}
                    onChange={handleInputChange} style={{ border: '1px solid' }} />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end mt-4">
              <Button variant="primary" onClick={handleAddSize}>Lưu kích cỡ</Button>
              <Button className="mx-1" variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Modal Thêm Kích Cỡ Mới */}
      <Modal show={isShowAddSizeModal} onHide={() => setIsShowAddSizeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm kích cỡ mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tên kích cỡ</Form.Label>
            <Form.Control type="text" placeholder="Nhập tên kích cỡ" value={newSizeName} onChange={(e) => setNewSizeName(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsShowAddSizeModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={addNewSize}>Thêm mới</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalProductAddNewSize;
