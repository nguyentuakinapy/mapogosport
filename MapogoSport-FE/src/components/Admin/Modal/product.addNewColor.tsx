import ReactColorPicker from "@super-effective/react-color-picker";
import { useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import "../admin.scss";
import axios from "axios";
import { toast } from "react-toastify";

interface IProps {
  isShowAddColor: boolean;
  setIsShowAddColor: any;
  productDetailId?: ProductDetail;
  setNewColor: any;
  newColor: any;
}

const ModalProductAddNewColor = ({
  isShowAddColor,
  productDetailId,
  setNewColor,
  newColor,
  setIsShowAddColor,
}: IProps) => {
  // console.log("new color ", newColor);

  const optionColor = [
    { label: "Xanh", value: "Xanh", style: "green" },
    { label: "Đỏ", value: "Đỏ", style: "red" },
    { label: "Vàng", value: "Vàng", style: "yellow" },
    { label: "Cam", value: "Cam", style: "orange" },
    { label: "Tím", value: "Tím", style: "purple" },
    { label: "Hồng", value: "Hồng", style: "pink" },
    { label: "Đen", value: "Đen", style: "black" },
    { label: "Trắng", value: "Trắng", style: "white" },
    { label: "Xanh dương", value: "Xanh dương", style: "blue" },
    { label: "Nâu", value: "Nâu", style: "brown" },
    { label: "Xám", value: "Xám", style: "gray" },
];


  // const [color, setColor] = useState(newColor);
  const [color, setColor] = useState(newColor || "#3cd64c"); // Giá trị mặc định khi newColor rỗng

  const [isInteracting, setIsInteracting] = useState(false);
  // const [newColor, setNewColor] = useState("");

  const onColorChange = (updatedColor: any) => {
    // alert()

    setColor(updatedColor);
    setNewColor(updatedColor);
  };

  const onInteractionStart = () => {
    setIsInteracting(true);
  };

  const onInteractionEnd = () => {
    setIsInteracting(false);
  };

  const [newColorImage, setNewColorImage] = useState<string | File>("");
  const [previewNewColorImage, setPreviewNewColorImage] = useState<
    string | null
  >(null); // Dùng để lưu đường dẫn ảnh xem trước

  const handleCloseModalAddColor = () => {
    setIsShowAddColor(false); // Đóng modal
    setNewColor(""); // Reset input màu sắc
    setPreviewNewColorImage(null);
    // setNewColorImage(null); // Reset hình ảnh
  };
  const handleAddColor = () => {
    // Cập nhật selectedProductDetail.color với color mới
    if (newColor) {
      // selectedProductDetail.color = newColor; // Cập nhật màu sắc hiện tại
      // setColor(newColor); // Cập nhật màu sắc hiện tại
    }
    setIsShowAddColor(false); // Đóng modal
    setPreviewNewColorImage(null);
  };

  return (
    <div>
      <Modal
        show={isShowAddColor}
        onHide={handleCloseModalAddColor}
        className="modal-dialog-centered"
      >
        <div>Id Detail {productDetailId?.productDetailId} stts</div>
        <Modal.Header closeButton>
          <Modal.Title>Thêm màu sắc mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <ReactColorPicker
                color={color}
                onChange={onColorChange}
                onInteractionStart={onInteractionStart}
                onInteractionEnd={onInteractionEnd}
              />
            </Row>
            <Row>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label>Màu sắc</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập màu sắc nè em"
                    value={color}
                    onChange={(e) => setNewColor(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                {/* <Form.Group className="mb-1">
                  <Form.Label>Hình ảnh theo màu</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleNewColorImageChange}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  {previewNewColorImage && (
                    <div
                      className="preview-image"
                      style={{ marginTop: "10px", display: "flex" }}
                    >
                      <Image
                        src={previewNewColorImage}
                        alt="Preview"
                        fluid
                        style={{
                          objectFit: "cover",
                          maxHeight: "70px",
                          maxWidth: "100px",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  )}
                </Form.Group> */}
                <div className="text-end mt-5">
                  <Button variant="primary" onClick={handleAddColor}>
                    Lưu màu
                  </Button>
                  <Button
                    className="mx-1"
                    variant="secondary"
                    onClick={handleCloseModalAddColor}
                  >
                    Hủy
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
          <div>
            {optionColor.map((option) => (
              <div
                className="btn mx-1 mt-2"
                key={option.value}
                value={option.value}
                style={{ backgroundColor: `${option.style}` }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalProductAddNewColor;
