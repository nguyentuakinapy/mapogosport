'use client'
import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

interface ProductDetailModalProps {
  show: boolean;
  onClose: () => void;
  productDetail?: ProductDetail; // Assume ProductDetail is defined
  onSave: (productDetail: ProductDetail) => void;
}

const ProductDetailModal = ({ show, onClose, productDetail, onSave }: ProductDetailModalProps) => {
  const [formValues, setFormValues] = useState<ProductDetail>({
    color: "",
    size: "",
    quantity: 1,
    image: "",
  });

  useEffect(() => {
    if (productDetail) {
      setFormValues(productDetail); z
    } else {
      setFormValues({ color: "", size: "", quantity: 1, image: "" });
    }
  }, [productDetail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = () => {
    onSave(formValues); // Pass the updated values to the parent
    onClose(); // Close the modal
  };

  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{productDetail ? "Chỉnh sửa chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Màu</Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={formValues.color}
              onChange={handleInputChange}
              placeholder="Nhập màu"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kích thước</Form.Label>
            <Form.Control
              type="text"
              name="size"
              value={formValues.size}
              onChange={handleInputChange}
              placeholder="Nhập kích thước"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formValues.quantity}
              onChange={handleInputChange}
              min="1"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setFormValues({ ...formValues, image: file });
                }
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailModal;
