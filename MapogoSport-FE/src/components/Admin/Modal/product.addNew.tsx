import { Button, Col, Form, Modal, Row, Image } from "react-bootstrap";
import "../admin.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { useMutation, useQueryClient } from 'react-query';


interface UserProps {
  showAddProduct: boolean;
  setShowAddProduct: (v: boolean) => void;
  currentProduct: Product | null;
  modalType: "add" | "edit";
  categoryProducts: CategoryProduct[];
  // onAddProduct: (product: Product) => void;
}
const BASE_URL = 'http://localhost:8080';

const ProductAddNew = ({
  showAddProduct,
  setShowAddProduct,
  currentProduct,
  modalType,
  categoryProducts,
}: UserProps) => {
  const [value, setValue] = useState("");
  const option = [
    { label: "Còn hàng", value: "Còn hàng" },
    { label: "Hết hàng", value: "Hết hàng" },
  ];

  const [formValues, setFormValues] = useState<Product>({
    name: "",
    categoryProduct: {
      categoryProductId: categoryProducts[0]?.categoryProductId || 0,
      name: categoryProducts[0]?.name || "",
    },
    description: "",
    price: 0,
    status: option[0].value,
    brand: "",
    country: "",
    image: "",
    stock: 0,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null); // Dùng để lưu đường dẫn ảnh xem trước

  useEffect(() => {
    if (modalType === "edit" && currentProduct) {
      setFormValues({
        ...currentProduct,
        categoryProduct: {
          ...currentProduct.categoryProduct,
        },
        image: currentProduct.image || "", // Hiển thị ảnh hiện có từ sản phẩm
      });
    } else {  // trường hợp này là thêm mới nên set form thành rỗng
      setFormValues({
        name: "",
        categoryProduct: {
          categoryProductId: categoryProducts[0]?.categoryProductId || 0,
          name: categoryProducts[0]?.name || "",
        },
        description: "",
        price: 0,
        status: option[0].value,
        brand: "",
        country: "",
        image: "",
        stock: 1,
      });
    }
  }, [modalType, currentProduct, categoryProducts]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    console.log('selected Input change value: ', value);
  };


  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setValue(value);
    setFormValues((prevValues) => ({ ...prevValues, status: value }));

    console.log('selected value: ', value);
    
  };

const handleCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedId = event.target.value; // Lấy ID của loại sản phẩm đã chọn
  const selectedCategory = categoryProducts.find(cat => cat.categoryProductId === Number(selectedId));

  setFormValues((prevValues) => ({
      ...prevValues,
      categoryProduct: {
          categoryProductId: Number(selectedId), // Cập nhật ID của loại sản phẩm
          name: selectedCategory?.name || "", // Lấy tên từ loại sản phẩm đã chọn
          image: selectedCategory?.image || "" // Cung cấp thuộc tính image
      }
  }));
};


  const handleClose = () => {
    setShowAddProduct(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (modalType === 'add') {
        console.log('modal type add');
        
      // Chế độ thêm: chỉ hiển thị ảnh xem trước của tệp đã chọn
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreviewImage(URL.createObjectURL(file)); // Tạo URL xem trước
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          image: file, // Lưu đối tượng File
        }));
      } else {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          image: '', // Đặt hình ảnh thành rỗng nếu không có tệp được chọn
        }));
        setPreviewImage(null); // Xóa ảnh xem trước
      }
    } else if (modalType === 'edit') {
        console.log('modal type edit');

      // Chế độ chỉnh sửa: giữ lại ảnh gốc trừ khi có tệp mới được chọn
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước của tệp mới
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          image: file, // Cập nhật formValues với tệp mới
        })
    );
      } else {
        setPreviewImage(null); // Không có ảnh xem trước, giữ lại ảnh gốc
      }
    }
  };
  
const handleSave = async () => {
    try {
      const formData = new FormData();
  
      // Giữ nguyên hình ảnh gốc nếu không có hình mới
      let imageUrl = currentProduct?.image;
      
      // Kiểm tra nếu có hình ảnh mới được chọn
      if (previewImage) {
        const file = formValues.image; // Đây là file đã được chọn
  
        if (file instanceof File) {
          const fileName = `${file.name.replace(/\s+/g, "_")}`;
          imageUrl = fileName; // Cập nhật tên file hình ảnh
          formData.append("fileimage", file); // Thêm file hình ảnh vào FormData
          console.log('image u: ',imageUrl);
          console.log('form value image: ',formValues.image);
          
          
        } else {
          console.error("file không phải là một đối tượng File:", file);
        }
      }
  
      // Tạo đối tượng product với các thuộc tính
      const productData = {
        name: formValues.name,
        brand: formValues.brand,
        categoryProduct: {
          categoryProductId: formValues.categoryProduct.categoryProductId,
        },
        status: formValues.status,
        country: formValues.country,
        price: formValues.price,
        description: formValues.description,
        image: imageUrl,
        stock: formValues.stock,
      };
  
      // Thêm product vào FormData dưới dạng chuỗi JSON
      formData.append("product", JSON.stringify(productData));
  
      // Log ra FormData để kiểm tra
      let index = 0;
      for (let [key, value] of formData.entries()) {
        console.log(`${index++} Key: ${key}, Type of: ${typeof value}, Value:`, value);
      }
  
      // Gửi dữ liệu lên backend
      if (modalType === "add") {
        const response = await axios.post(
          `http://localhost:8080/rest/products`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Thêm sản phẩm thành công");
      } else if (modalType === "edit" && currentProduct) {
        const response = await axios.put(
          `http://localhost:8080/rest/products/${currentProduct.productId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Sản phẩm đã được cập nhật");
      }
    } catch (error) {
      toast.error(`Lỗi khi lưu sản phẩm: ${error}`);
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
    handleClose();
  };
  
  
  
  
  return (
    <>
      <Modal
      
        show={showAddProduct}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={true}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase text-danger">
            {modalType === "add" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col xs={8}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          type="text"
                          placeholder="Tên"
                          name="name"
                          value={formValues.name}
                          onChange={handleInputChange}
                        />
                        <Form.Label htmlFor="name">
                          Tên sản phẩm <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          type="number"
                          placeholder="Số lượng"
                          name="stock"
                          value={formValues.stock}
                          onChange={handleInputChange}
                        />
                        <Form.Label htmlFor="stock">
                          Số lượng <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          type="number"
                          placeholder="Giá"
                          name="price"
                          value={formValues.price}
                          onChange={handleInputChange}
                        />
                        <Form.Label htmlFor="stock">
                          Giá <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          type="text"
                          placeholder="Hãng"
                          name="brand"
                          value={formValues.brand}
                          onChange={handleInputChange}
                        />
                        <Form.Label htmlFor="brand">
                          Hãng <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          as="select"
                          name="categoryProduct"
                          value={formValues.categoryProduct.categoryProductId}
                          onChange={handleCategorySelect}
                        >
                          {categoryProducts.map((category) => (
                            <option
                              key={category.categoryProductId}
                              value={category.categoryProductId}
                            >
                              {category.name}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Label htmlFor="category">
                          Loại sản phẩm <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          as="select"
                          name="status"
                          value={formValues.status}
                          onChange={handleSelect}>
                          {option.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Label htmlFor="status">
                          Trạng thái <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          type="text"
                          placeholder="country"
                          name="country"
                          value={formValues.country}
                          onChange={handleInputChange}
                        />
                        <Form.Label htmlFor="country">
                          Xuất sứ <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="description">
                        Mô tả <b className="text-danger">*</b>
                      </Form.Label>
                      <Form.Floating>
                        <Form.Control
                          as="textarea"
                          placeholder="Mô tả"
                          name="description"
                          rows={6}
                          value={formValues.description}
                          onChange={handleInputChange}
                          style={{
                            width: "100%",
                            height: "150px",
                            padding: "10px",
                          }}
                        />
                      </Form.Floating>
                    </Form.Group>
                    {/* Hình ảnh chọn từ file */}
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="image" className="text-danger">
                        Chọn hình ảnh
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      {previewImage && (
                        <div
                          className="preview-image"
                          style={{ marginTop: "10px", display: "flex" }}
                        >
                          <Image
                            src={previewImage}
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
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col xs={4}>
                {/* Hình ảnh từ server */}
                <div>
                  {formValues.image && modalType === "edit" && (
                    <Image
                      src={`${formValues.image}`}
                      alt={`formValues.image`}
                      fluid
                      style={{ objectFit: "cover", maxHeight: "300px" }}
                    />
                  )}
                    {/* <Image
                      src={`${BASE_URL}/images/product-images/${formValues.image}`}
                      alt={formValues.image}
                      fluid
                      style={{ objectFit: "cover", maxHeight: "300px" }}
                    />
                  )} */}
                </div>
                <div>
                  {previewImage && modalType === "add" && (
                    <div style={{ marginTop: "10px" }}>
                      <p>Hình ảnh minh họa:</p>
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fluid
                        style={{ objectFit: "cover", maxHeight: "300px" }}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductAddNew;
