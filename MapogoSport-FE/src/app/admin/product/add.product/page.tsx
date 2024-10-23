import { Button, Col, Form, Row, Image } from "react-bootstrap";
// import "../admin.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface UserProps {
  showAddProduct: boolean;
  setShowAddProduct: (v: boolean) => void;
  currentProduct: Product | null;
  modalType: "add" | "edit";
  categoryProducts: CategoryProduct[];
}
const BASE_URL = 'http://localhost:8080';

const ProductAddNew_Demo = ({
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

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (modalType === "edit" && currentProduct) {
      setFormValues({
        ...currentProduct,
        categoryProduct: {
          ...currentProduct.categoryProduct,
        },
        image: currentProduct.image || "",
      });
    } else {
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setValue(value);
    setFormValues((prevValues) => ({ ...prevValues, status: value }));
  };
  
  const handleCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedCategory = categoryProducts.find(cat => cat.categoryProductId === Number(selectedId));

    setFormValues((prevValues) => ({
      ...prevValues,
      categoryProduct: {
        categoryProductId: Number(selectedId),
        name: selectedCategory?.name || "",
        image: selectedCategory?.image || ""
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        image: file,
      }));
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        image: '',
      }));
      setPreviewImage(null);
    }
  };
  
  const handleSave = async () => {
    try {
      const formData = new FormData();
      let imageUrl = currentProduct?.image;

      if (previewImage) {
        const file = formValues.image;
        if (file instanceof File) {
          const fileName = `${file.name.replace(/\s+/g, "_")}`;
          imageUrl = fileName;
          formData.append("fileimage", file);
        }
      }

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

      formData.append("product", JSON.stringify(productData));

      if (modalType === "add") {
        await axios.post(`${BASE_URL}/rest/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Thêm sản phẩm thành công");
      } else if (modalType === "edit" && currentProduct) {
        await axios.put(`${BASE_URL}/rest/products/${currentProduct.productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Sản phẩm đã được cập nhật");
      }
    } catch (error) {
      toast.error(`Lỗi khi lưu sản phẩm: ${error}`);
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
    setShowAddProduct(false);
  };

  return (
    <div className="product-add-edit-page">
      <h2 className="text-uppercase text-danger">
        {modalType === "add" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
      </h2>
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
                    <Form.Label htmlFor="price">
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
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Hình ảnh</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="preview"
                    fluid
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
                {formValues.image && !previewImage && (
                  <Image
                    src={`${BASE_URL}/images/${formValues.image}`}
                    alt="original"
                    fluid
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Button
          className="text-uppercase btn-primary"
          onClick={handleSave}
        >
          {modalType === "add" ? "Thêm" : "Cập nhật"}
        </Button>
        <Button
          variant="secondary"
          className="text-uppercase"
          onClick={() => setShowAddProduct(false)}
        >
          Hủy
        </Button>
      </Form>
    </div>
  );
};

export default ProductAddNew_Demo;
