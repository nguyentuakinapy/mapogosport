

"use client";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "../admin.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Interfaces
interface IProps {
  isShowAddNewSize: boolean;
  ProductDetailWasCreated: number;
  setIsShowAddNewSize: any;
  modalTypeProductDetail: "add" | "edit";
  currentProductDetailSize: ProductDetailSize | null;
  selectedProductDetail: ProductDetail | null;
  onFetchProductDetailSize: any
}

const ModalProductAddNewSize = ({
  isShowAddNewSize,
  setIsShowAddNewSize,
  modalTypeProductDetail,
  currentProductDetailSize,
  selectedProductDetail,
  ProductDetailWasCreated,
  onFetchProductDetailSize,
}: IProps) => {

  console.log("ProductDetailWasCreated ",ProductDetailWasCreated);
  
  // Fetch sizes from API
  const getDataSize = async () => {
    const url_getDataSize = "http://localhost:8080/rest/size";
    const response = await axios.get(url_getDataSize);
    return response.data; // Return size data
  };

  // Use react-query to fetch sizes
  const { data: sizeData, isLoading, refetch } = useQuery({
    queryFn: getDataSize,
    queryKey: ["getDataSize"],
  });

  const queryClient = useQueryClient();
  const [sizes, setSizes] = useState<Size[]>([]); // Save list of sizes from API

  // Cập nhật danh sách kích cỡ khi có dữ liệu từ API
  useEffect(() => {
    if (sizeData) {
      setSizes(sizeData);
      if (!formValues.sizeId && sizeData.length > 0) {
        // Thiết lập giá trị mặc định là kích cỡ đầu tiên nếu chưa có chọn lựa
        setFormValues((prev) => ({
          ...prev,
          sizeId: sizeData[0].sizeId,
        }));
      }
    }
  }, [sizeData]);

  // Use formValues to manage all form fields
  const [formValues, setFormValues] = useState<{
    sizeId: number;
    price: number;
    quantity: number;
  }>({
    sizeId: 0,
    price: 0,
    quantity: 0,
  });

  // Update formValues when currentProductDetailSize changes
  useEffect(() => {
    if (modalTypeProductDetail === "edit" && currentProductDetailSize) {
      setFormValues({
        sizeId: currentProductDetailSize.size.sizeId,
        price: currentProductDetailSize.price,
        quantity: currentProductDetailSize.quantity,
      });
    } else {
      setFormValues({
        sizeId: 0,
        price: 0,
        quantity: 0,
      });
    }
  }, [currentProductDetailSize]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    if (value === "" || value === "Chọn kích cỡ --") {
      toast.warning("Vui lòng chọn kích cỡ"); // Hiển thị thông báo khi không chọn màu
    } else {
      console.log("Selected size value: ", value);
    }
    // Check if the value is a number and not negative
    if (!isNaN(numericValue) && numericValue >= 0) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: numericValue,
      }));
    } else {
      toast.error("Vui lòng nhập đúng định dạng");
    }
  };

  // API to create a ProductDetailSize
  const createProductDetailSize = async (
    productDetailId: number,
    productDetailSize: ProductDetailSize
  ) => {
    // Log the data to see what is being sent to the server
    console.log("Sending to server: ", { productDetailId, productDetailSize });
   

     // Tạo một đối tượng FormData
     const formData = new FormData();
    
     // Thêm productDetailSize vào FormData
     formData.append("productDetailSize", JSON.stringify(productDetailSize)); // Chuyển đổi đối tượng thành JSON
        

     const response = await axios.post(
        `http://localhost:8080/rest/product-detail-size/create/${productDetailId}`,
        formData, // Gửi FormData
        {
            headers: {
                'Content-Type': 'multipart/form-data', // Đặt Content-Type cho FormData
            },
        }
    );
  };
  // API to update a ProductDetailSize
      const updateProductDetailSize = async (
        productDetailSizeId: number,
        productDetailSize: ProductDetailSize
      ) => {
        const formData = new FormData();
        formData.append("productDetailSize", JSON.stringify(productDetailSize));
        
        const response = await axios.put(
          `http://localhost:8080/rest/product-detail-size/update/${productDetailSizeId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      };


  const mutation = useMutation({
    mutationFn: (productDetailSize: ProductDetailSize) => {
      return modalTypeProductDetail === "edit"
        ? updateProductDetailSize(currentProductDetailSize!.productDetailSizeId, productDetailSize)
        : createProductDetailSize(selectedProductDetail!.productDetailId, productDetailSize);
    },
    onSuccess: () => {
      toast.success("Kích cỡ đã được lưu thành công!");
      onFetchProductDetailSize(); // Gọi mutate để refetch dữ liệu
      queryClient.invalidateQueries(["getDataSize"]); // Tải lại dữ liệu sau khi cập nhật
      handleCloseModal(); // Đóng modal sau khi lưu
    },
    onError: (error) => {
      console.error("Error occurred while saving size: ", error);
      toast.error("Có lỗi xảy ra khi lưu kích cỡ!");
    },
  });
  

  const handleAddSize = () => {
    const { sizeId, price, quantity } = formValues;

    if (!sizeId) {
      toast.error("Vui lòng chọn kích cỡ!");
      return; // Stop if no size selected
    }

    const sizeData: ProductDetailSize = {
      // productDetail: selectedProductDetail? { productDetailId: selectedProductDetail.productDetailId }: ProductDetailWasCreated,
      productDetail: selectedProductDetail !== null ? { productDetailId: selectedProductDetail.productDetailId } : ProductDetailWasCreated,

      size: {sizeId: sizeId} || 0, 
      price: Number(price),
      quantity: Number(quantity),
    };

    // Log the sizeData to see what is being sent
    console.log("sizeData: ", sizeData);

    mutation.mutate(sizeData); // Call the mutation function to add/update size
  };

  // Close the modal and reset form values
  const handleCloseModal = () => {
    setIsShowAddNewSize(false);
    setFormValues({
      sizeId: 0,
      price: 0,
      quantity: 0,
    });
  };


  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div>
      <Modal
        show={isShowAddNewSize}
        onHide={handleCloseModal}
        className="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProductDetailSize
              ? "Chỉnh sửa kích cỡ"
              : "Thêm kích cỡ mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {/* <span>
                Id productDetail: {selectedProductDetail?.productDetailId} <br />
                Id productDetail ProductDetailWasCreated: ${ProductDetailWasCreated}
              </span> */}
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label>Kích cỡ</Form.Label>
                  <Form.Select
                    name="sizeId"
                    value={formValues.sizeId}
                    onChange={handleInputChange}
                  >
                    <option>
                      Chọn kích cỡ --
                    </option>
                    {sizes.map((size: Size) => (
                      <option key={size.sizeId} value={size.sizeId}>
                        {size.sizeName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Nhập giá"
                    value={formValues.price || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    placeholder="Nhập số lượng"
                    value={formValues.quantity || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end mt-4">
              <Button variant="primary" onClick={handleAddSize}>
                Lưu kích cỡ
              </Button>
              <Button
                className="mx-1"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalProductAddNewSize;
