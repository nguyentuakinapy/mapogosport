////// page 	product
"use client";
import Link from "next/link";
import {
  FormCheck,
  Button,
  Table,
  Badge,
  Image,
  OverlayTrigger,
  Tooltip,
  Nav,
} from "react-bootstrap";
import "../product/adminStyleProduct.scss";
import { useState, useEffect } from "react";
import ProductAddNew from "@/components/Admin/Modal/product.addNew";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const AdminProduct = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add"); // 'add' hoặc 'edit'
  const [currentProduct, setCurrentProduct] = useState<Product[]>([]); // Sản phẩm hiện tại

  const [products, setProducts] = useState<Product[]>([]);
  const [isNeedScroll, setIsNeedScroll] = useState<boolean>(false);
  const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>(
    []
  );



  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAllProduct, setSelectAllProduct] = useState(false);

  const BASE_URL = "http://localhost:8080";

  const getDatas = async () => {
    const apiProducts = "http://localhost:8080/rest/products";

    const apiCategoriesProducts =
      "http://localhost:8080/rest/category-products";
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

        // console.log('Products:', productsRes.data); // Ghi lại sản phẩm
        // console.log('Category Products:', categoriesRes.data); // Ghi lại danh mục sản phẩm

        // Lưu dữ liệu vào state
        setProducts(productsRes.data); // Dữ liệu từ API products
        setCategoryProducts(categoriesRes.data); // Dữ liệu từ API category_products
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
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
      console.log(
        "iddddddddddddddddddddddddd",
        products[products.length - 1].productId.toString()
      );

      const ele = document.getElementById(
        products[products.length - 1].productId.toString()
      );
      if (ele) {
        // window.scrollTo(ele.offsetLeft,ele.offsetTop, behavior)
        ele.scrollIntoView();
        setIsNeedScroll(false);
      }
    }
  }, [products]);

  // load lại data
  useEffect(() => {
    if (data) {
      setProducts(data.productsRes?.data || []);
      setCategoryProducts(data.categoriesRes?.data || []);
    }
  }, [data]);

  // Hàm thêm sản phẩm mới vào danh sách
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleEditClick = (product: Product) => {
    console.log("product ht ", product);

    setCurrentProduct(product); // Cập nhật sản phẩm hiện tại
    setModalType("edit"); // Đặt loại modal thành 'edit'
    setShowModal(true); // Hiển thị modal
  };

  const handleCreateClick = () => {
    setCurrentProduct(null); // Đặt sản phẩm hiện tại là null để tạo mới
    setModalType("add"); // Đặt loại modal thành 'add'
    setShowModal(true); // Hiển thị modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Đóng modal
    setCurrentProduct(null); // Reset sản phẩm hiện tại
  };

  const handleSelectAllProduct = () => {
    if (selectAllProduct) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.productId));
    }
    setSelectAllProduct(!selectAllProduct);
  };

  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(
        selectedProducts.filter((productId) => productId !== id)
      );
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

    if (!confirmed) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    try {
      await axios.delete(`${BASE_URL}/rest/products/${id}`);
      setProducts(products.filter((product) => product.productId !== id));
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      toast.success("Xóa sản phẩm không thành công");
      console.error("Error deleting product:", error);
    }
  };

  // Tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

    // Xử lý khi thay đổi tab
      const handleTabSelect = (tab) => {
        setActiveTab(tab);
      };
      // Hàm loại bỏ dấu tiếng Việt
      const removeVietnameseTones = (str) => {
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

        return filtered;
      };

  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredProducts = getFilteredProducts();


  // Phần phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // số item trên mỗi trang

  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  // const currentItems = products.slice(startIndex, startIndex + itemsPerPage);
  // const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Xử lý khi bấm vào trang mới
  const handlePageChange = (page) => {
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

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };
  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

        // Hàm để cập nhật trạng thái sản phẩm thành "Hết hàng"
      const markProductAsOutOfStock = async (productId: number) => {
        console.log("productId ",productId);
        
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
            {currentItems &&
              currentItems.length > 0 &&
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
                      <Badge
                        bg={
                          product.status === "Còn hàng" ? "success" : "danger"
                        }
                      >
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
                      <Button
                      style={{'backgroundColor': '#132239'}}
                        // variant="warning"
                        className="m-1"
                        onClick={() => handleEditClick(product)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                      <Button
                        // variant="danger"
                        style={{'backgroundColor': '#132239'}}
                        className="m-1"
                        // onClick={() => handleDelete(product.productId)}
                        disabled={ product.status === "Hết hàng" }
                        onClick={() => markProductAsOutOfStock(product.productId)}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  };

  if (queryDemo.isPending) return <div>Đang tải...</div>;
  // if (productError) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

  if (isLoading) return <div>Đang tải...</div>;
  // if (categoryError) return <div>Đã xảy ra lỗi trong quá trình lấy dữ liệu! Vui lòng thử lại sau hoặc liên hệ với quản trị viên</div>;

  return (
    <div style={{ fontSize: "14px" }}>
      <div className="box-ultil">
        <b className="text-danger" style={{ fontSize: "20px" }}>
          Quản Lý Sản Phẩm/ Tổng: {products?.length || 0} sản phẩm
        </b>
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
          width: "200px"
        }}
      />
        <Button
          className="btn-sd-admin"
          style={{ fontSize: "15px" }}
          onClick={handleCreateClick}
        >
          <i className="bi bi-plus-circle me-2"></i>Thêm Sản Phẩm
        </Button>
      </div>
      <Nav
        variant="pills"
        activeKey={activeTab}
        // onSelect={(selectedKey) => setActiveTab(selectedKey as string)}
        onSelect={(selectedKey) => handleTabSelect(selectedKey)}
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
        {renderContent(currentItems)}

        <div className="pagination ">
          <div className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <div
              className="page-link"
              aria-label="First"
              onClick={() => handlePageChange(1)}
              title="Go to first page"
            >
              <span aria-hidden="true">&laquo;</span>
            </div>
          </div>
          {/* Nút "Lùi" */}
          <button
            className="btn btn-primary mx-1 active"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            {/* Lùi */} &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              // className="btn btn-primary mx-1 active"
              className={`btn mx-1 ${
                currentPage === index + 1
                  ? "btn-primary active"
                  : "btn-secondary"
              }`}
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
          {/* Nút "Tới" */}
          <button
            className="btn btn-primary mx-1 active"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {/* Tới */} &gt;
          </button>
          {/* Nút "Tới trang cuối" */}
          <button
            className="btn btn-primary mx-1"
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>

      <ProductAddNew
        showAddProduct={showModal}
        setShowAddProduct={handleCloseModal}
        currentProduct={currentProduct}
        modalType={modalType}
        categoryProducts={categoryProducts}
        onAddProduct={handleAddProduct}
        onFetch={refetch}
        setIsNeedScroll={setIsNeedScroll}
      />
    </div>
  );
};

export default AdminProduct;
