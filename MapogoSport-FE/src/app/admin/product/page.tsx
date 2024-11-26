"use client";
import Link from "next/link";
import { Button, Table, Badge, Image, OverlayTrigger, Tooltip, Nav, Form } from "react-bootstrap";
import "../product/adminStyleProduct.scss";
import React, { useState, useEffect } from "react";
import ProductAddNew from "@/components/Admin/Modal/product.addNew";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const AdminProduct = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add"); // 'add' hoặc 'edit'
  const [currentProduct, setCurrentProduct] = useState<Product>(); // Sản phẩm hiện tại

  const [products, setProducts] = useState<Product[]>([]);
  const [isNeedScroll, setIsNeedScroll] = useState<boolean>(false);
  const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>(
    []
  );

  const BASE_URL = "http://localhost:8080";

  const getDatas = async () => {
    const apiProducts = "http://localhost:8080/rest/products";

    const apiCategoriesProducts = "http://localhost:8080/rest/category-products";
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get(apiProducts),
      axios.get(apiCategoriesProducts),
    ]);
    return {
      productsRes,
      categoriesRes,
    };
  };

  const getDatas_DEMO = async () => {
    const url_getProduct = "http://localhost:8080/rest/products";

    const apiDemo = axios.get(url_getProduct);
    return apiDemo;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiProducts = "http://localhost:8080/rest/products";

        const apiCategoriesProducts =
          "http://localhost:8080/rest/category-products";

        // Gọi cả hai API cùng lúc
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(apiProducts),
          axios.get(apiCategoriesProducts),
        ]);

        // Lưu dữ liệu vào state
        setProducts(productsRes.data); // Dữ liệu từ API products
        setCategoryProducts(categoriesRes.data); // Dữ liệu từ API category_products
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => await getDatas(),
    queryKey: ["product_category"], //Array according to Documentation
  });

  const queryDemo = useQuery({
    queryFn: async () => await getDatas_DEMO(),
    queryKey: ["getDatas_DEMO"], //Array according to Documentation
  });

  useEffect(() => {
    if (!isNeedScroll) return;
    if (products.length > 0) {

      const ele = document.getElementById(
        products[products.length - 1].productId.toString()
      );
      if (ele) {
        ele.scrollIntoView();
        setIsNeedScroll(false);
      }
    }
  }, [isNeedScroll, products]);

  // load lại data
  useEffect(() => {
    if (data) {
      setProducts(data.productsRes?.data || []);
      setCategoryProducts(data.categoriesRes?.data || []);
    }
  }, [data]);

  const handleEditClick = (product: Product) => {
    console.log("product ht ", product);

    setCurrentProduct(product)
    setModalType("edit"); // Đặt loại modal thành 'edit'
    setShowModal(true); // Hiển thị modal
  };

  const handleCreateClick = () => {
    setCurrentProduct(undefined); // Đặt sản phẩm hiện tại là null để tạo mới
    setModalType("add"); // Đặt loại modal thành 'add'
    setShowModal(true); // Hiển thị modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Đóng modal
    setCurrentProduct(undefined); // Reset sản phẩm hiện tại
  };

  // Tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number>(); // Giá trị mặc định là rỗng



  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Xử lý khi thay đổi tab
  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
  };
  // Hàm loại bỏ dấu tiếng Việt
  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Hàm lọc sản phẩm đã cập nhật
  const getFilteredProducts = () => {
    // Bước 1: Lọc theo trạng thái
    let filtered = products;
    if (activeTab === "inStock") {
      filtered = products.filter((product) => product.status === "Còn hàng");
    } else if (activeTab === "outStock") {
      filtered = products.filter((product) => product.status === "Hết hàng");
    }

    // Bước 2: Lọc theo từ khóa tìm kiếm không dấu
    if (searchTerm) {
      const normalizedSearchTerm = removeVietnameseTones(searchTerm).toLowerCase();
      filtered = filtered.filter((product) =>
        removeVietnameseTones(product.name).toLowerCase().includes(normalizedSearchTerm)
      );
    }
    if (selectedType) {
      filtered = filtered.filter((product) => product.categoryProduct.categoryProductId === selectedType)

      // console.log("ssssssssssss " + products[0].categoryProduct.categoryProductId);

    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();


  // Phần phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // số item trên mỗi trang

  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Xử lý khi bấm vào trang mới
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // Xử lý khi bấm nút "Lùi"
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Xử lý khi bấm nút "Tới"
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatCurrency = (value: number) => {
    if (value === null || value === undefined) return "";
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Hàm để cập nhật trạng thái sản phẩm thành "Hết hàng"
  const markProductAsOutOfStock = async (productId: number) => {
    console.log("productId ", productId);

    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

    if (!confirmed) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    try {
      const response = await axios.put(
        `${BASE_URL}/rest/products/${productId}/mark-as-out-of-stock`
      );
      toast.success("Cập nhật trạng thái sản phẩm thành công");

      // Sử dụng mutate để cập nhật lại dữ liệu sản phẩm
      // mutate(`${BASE_URL}/rest/products`);
      refetch();

      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      toast.error("Lỗi khi cập nhật trạng thái sản phẩm");
      throw error;
    }
  };

  const renderContent = () => {
    return (
      <div className="box-table-border mb-4">
        <Table striped className="mb-0">
          <thead>
            <tr>
              <th>STT</th>
              <th>Hình ảnh</th>
              <th>Thông tin sản phẩm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems && currentItems.length > 0 ?
              currentItems.map((product, index) => (
                <tr key={product.productId} id={product.productId.toString()}>
                  <td className="text-center align-middle">{index + 1}</td>
                  <td className="text-center align-middle">
                    <Link href="#">
                      <Image
                        loading="lazy"
                        onClick={() => handleEditClick(product)}
                        src={`${product.image}`}
                        style={{ width: "150px", height: "auto" }}
                        className="mx-2"
                        alt={`product.image`}
                        onError={(e) => {
                          e.currentTarget.src = "/images/logo.png"; // Ảnh mặc định
                        }}
                      />
                    </Link>
                  </td>
                  <td className="text-start align-middle">
                    <div>
                      <span>Tên sản phẩm: </span>{" "}
                      <strong className="text-dark">{product.name}</strong>
                    </div>
                    <div>
                      <span>Ngày tạo:</span>{" "}
                      <strong>
                        {new Date(product.createDate).toLocaleDateString()}
                      </strong>
                    </div>
                    <div>
                      <span>Danh mục:</span>{" "}
                      <strong>
                        {product.categoryProduct.name || "Không xác định"}
                      </strong>
                    </div>
                    <div>
                      {/* <span>Giá:</span> <strong>{product.price}</strong> */}
                      <span>Giá:</span>{" "}
                      <strong>{formatCurrency(product.price)}</strong>
                    </div>
                    <div>
                      <span>Hãng:</span> <strong>{product.brand}</strong>
                    </div>
                    <div>
                      <span>Xuất sứ:</span> <strong>{product.country}</strong>
                    </div>
                    <div>
                      <span>Trạng thái:</span>
                      <Badge bg={product.status === "Còn hàng" ? "success" : "danger"}>
                        {product.status}
                      </Badge>
                    </div>
                    <div>
                      <span>Số lượng:</span>
                      <Badge bg={product.stock >= 1 ? "primary" : "danger"}>
                        {product.stock}
                      </Badge>
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                      <Button style={{ 'backgroundColor': '#132239' }} className="m-1" onClick={() => handleEditClick(product)}>
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                      <Button style={{ 'backgroundColor': '#132239' }} className="m-1" disabled={product.status === "Hết hàng"}
                        onClick={() => markProductAsOutOfStock(product.productId)}>
                        <i className="bi bi-trash3-fill"></i>
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              )) : (
                <tr >
                  <td colSpan={11} className="text-center h6 ">
                    <p >Không có dữ liệu </p>
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
      </div>
    );
  };

  if (queryDemo.isPending) return <div>Đang tải...</div>;

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div style={{ fontSize: "14px" }}>
      <div className="box-ultil d-flex flex-wrap align-items-center justify-content-between gap-3">
        {/* Tổng số sản phẩm */}
        <b className="text-danger flex-grow-1" style={{ fontSize: "20px" }}>
          Quản lý sản phẩm/ Tổng: {products?.length || 0} sản phẩm
        </b>

        {/* Dropdown chọn loại sản phẩm */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <i className="bi bi-funnel fs-4"></i>
          <Form.Control as="select" name="categoryProduct"
            value={selectedType}
            onChange={(e) => setSelectedType(Number(e.target.value))}
            style={{ minWidth: "200px" }}
          >
            <option value="">Tất cả loại sản phẩm</option>
            {categoryProducts.map((category) => (
              <option key={category.categoryProductId} value={category.categoryProductId}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </div>

        {/* Input tìm kiếm sản phẩm */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            width: "200px",
            flexShrink: 0,
          }}
        />

        {/* Nút thêm sản phẩm */}
        <Button
          className="btn-sd-admin"
          style={{ fontSize: "15px", whiteSpace: "nowrap" }}
          onClick={handleCreateClick}
        >
          <i className="bi bi-plus-circle me-2"></i>Thêm Sản Phẩm
        </Button>
      </div>

      <Nav
        variant="pills"
        activeKey={activeTab}
        // onSelect={(selectedKey) => setActiveTab(selectedKey as string)}
        onSelect={(selectedKey) => handleTabSelect(selectedKey ? selectedKey : '')}
        className="custom-tabs my-3"
      >
        <Nav.Item>
          <Nav.Link eventKey="all" className="tab-link">
            Toàn bộ
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="inStock" className="tab-link">
            Còn hàng
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="outStock" className="tab-link">
            Hết hàng
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-3">
        {renderContent()}

        {currentItems.length > 0 ? (
          <div className="pagination">
            {/* Nút "Đầu tiên" 
            <div className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <div
                className="page-link text-light"
                style={{ backgroundColor: "#132239" }}
                aria-label="First"
                onClick={() => handlePageChange(1)}
                title="Go to first page"
              >
                <span aria-hidden="true">&laquo;</span>
              </div>
            </div>*/}
            {/* Nút "Lùi" */}
            <button
              className="btn mx-1 text-light"
              style={{ backgroundColor: "#132239" }}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {/* Các nút số trang */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                className={`btn mx-1 text-light ${currentPage === index + 1 ? "active" : ""
                  }`}
                style={{
                  backgroundColor: currentPage === index + 1 ? "grey" : "#132239",
                  border: currentPage === index + 1 ? "2px solid white" : "none",
                }}
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
            {/* Nút "Tới" */}
            <button
              className="btn mx-1 text-light"
              style={{ backgroundColor: "#132239" }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
            {/* Nút "Trang cuối" 
            <button
              className="btn mx-1 text-light"
              style={{ backgroundColor: "#132239" }}
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>*/}
          </div>
        ) : null}


      </div>

      <ProductAddNew
        showAddProduct={showModal}
        setShowAddProduct={handleCloseModal}
        currentProduct={currentProduct}
        modalType={modalType}
        categoryProducts={categoryProducts}
        onFetch={refetch}
        setIsNeedScroll={setIsNeedScroll}
      />
    </div>
  );
};

export default AdminProduct;
