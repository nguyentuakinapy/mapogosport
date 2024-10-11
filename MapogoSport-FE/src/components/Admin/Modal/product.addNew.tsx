import { Button, Col, Form, Modal, Row, Image } from "react-bootstrap";
import "../admin.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
  // Cập nhật hàm handleSelect cho loại sản phẩm
const handleCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value; // Lấy ID của loại sản phẩm đã chọn
    setFormValues((prevValues) => ({
        ...prevValues,
        categoryProduct: {
            categoryProductId: Number(selectedId), // Cập nhật ID của loại sản phẩm
            name: categoryProducts.find(cat => cat.categoryProductId === Number(selectedId))?.name || "",
            imgae: null || ""
        }
    }));
};
  const handleClose = () => {
    setShowAddProduct(false);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if(modalType === 'add' ){
  //           if (e.target.files && e.target.files[0]) {
  //         const file = e.target.files[0];
  //         // // setFormValues({ ...formValues, image: file.name }); // Chỉ lưu tên tệp hình ảnh
  //         // setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh
  //         setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh

  //         // Cập nhật formValues với tên tệp hình ảnh thực tế
  //         setFormValues({ ...formValues, image: file.name });
  //     } else {
  //         setFormValues({ ...formValues, image: '' });
  //         setPreviewImage(null); // Xóa ảnh xem trước nếu không có ảnh được chọn
  //     }
  //     }else{
  //     if (e.target.files && e.target.files[0]) {
  //                     const file = e.target.files[0];
  //                     // // setFormValues({ ...formValues, image: file.name }); // Chỉ lưu tên tệp hình ảnh
  //                     // setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh
  //                     setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh

  //                     // Cập nhật formValues với tên tệp hình ảnh thực tế
  //                     // setFormValues({ ...formValues, image: file.name });
  //                 } else {
  //                     setFormValues({ ...formValues, image: '' });
  //                     setPreviewImage(null); // Xóa ảnh xem trước nếu không có ảnh được chọn
  //                 }
  //     }

  // };
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh
//         console.log('type of preview image',typeof previewImage); // object file
        

//       // Lưu đối tượng File vào formValues
//       setFormValues({ ...formValues, image: file }); // Lưu đối tượng File
//       console.log("type of form value.file", typeof formValues.image);


//     } else {
//       setFormValues({ ...formValues, image: "" });
//       setPreviewImage(null); // Xóa ảnh xem trước nếu không có ảnh được chọn
//     }
//   };


const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; // Lấy đối tượng File đầu tiên
      setPreviewImage(URL.createObjectURL(file)); // Tạo đường dẫn xem trước ảnh
        
      // Lưu đối tượng File vào formValues
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        image: file, // Lưu đối tượng File
      }));
  
      console.log("type of form value.file:", typeof file); // In ra kiểu của file
      console.log("type of form Preview File:", typeof previewImage); // In ra kiểu của file
      console.log("type of form FormValues.image:", typeof formValues.image); // In ra kiểu của file
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        image: '', // Đặt về null nếu không có file
      }));
      setPreviewImage(null); // Xóa ảnh xem trước nếu không có ảnh được chọn
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
      toast.error("Lỗi khi lưu sản phẩm");
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
                      src={`${BASE_URL}/images/product-images/${formValues.image}`}
                      alt={formValues.image}
                      fluid
                      style={{ objectFit: "cover", maxHeight: "300px" }}
                    />
                  )}
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
