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
  setNewColor: any
    newColor:any
}

const ModalProductAddNewColor = ({
  isShowAddColor,
  productDetailId,
  setNewColor,
  newColor,
  setIsShowAddColor,
}: IProps) => {
  
  // console.log("new color ", newColor);
  
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
  const handleAddColor =()=>{
      // Cập nhật selectedProductDetail.color với color mới
  if (newColor) {
    // selectedProductDetail.color = newColor; // Cập nhật màu sắc hiện tại
    // setColor(newColor); // Cập nhật màu sắc hiện tại
  }
    setIsShowAddColor(false); // Đóng modal
    setPreviewNewColorImage(null);

  }

  // const handleAddColor = async () => {
  //   try {
  //     // Tạo đối tượng productDetail chứa các thuộc tính cần thiết
  //     const productDetail = {
  //       color: newColor,
  //     };

  //     // Tạo FormData để chứa productDetail (JSON) và ảnh
  //     const formData = new FormData();
  //     formData.append("productDetail", JSON.stringify(productDetail)); // Chuyển productDetail thành JSON
  //     formData.append("fileimage", newColorImage); // Thêm ảnh mới vào FormData

  //     // Log thông tin để kiểm tra
  //     console.log("Tên màu:", newColor);
  //     if (newColorImage instanceof File) {
  //       console.log("Tên ảnh:", newColorImage.name); // Log tên file của ảnh
  //     } else {
  //       console.error(
  //         "newColorImage không phải là một đối tượng File:",
  //         newColorImage
  //       );
  //     }

  //     // Gửi yêu cầu thêm màu sắc mới
  //     await axios.post(
  //       `http://localhost:8080/rest/product-detail/${currentProduct.productId}`, // Thay đổi URL theo API của bạn
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

  //     // Thông báo thành công và đóng modal
  //     toast.success("Thêm màu sắc thành công");
  //     handleCloseModalAddColor(); // Đóng modal và reset dữ liệu
  //   } catch (error: any) {
  //     // Thông báo lỗi
  //     toast.error(`Lỗi khi thêm màu sắc: ${error.message}`);
  //     console.error("Lỗi khi thêm màu sắc:", error);
  //   }
  // };

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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalProductAddNewColor;
