'use client'
import ProductAddNew from "@/components/Admin/Modal/product.addNew";
import { formatPrice } from "@/components/Utils/Format";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Form, Nav, OverlayTrigger, Pagination, Table, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR from "swr";

const AdminProduct = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedType, setSelectedType] = useState<number>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const BASE_URL = "http://localhost:8080";

  const { data: categoryProducts } = useSWR<CategoryProduct[]>(`${BASE_URL}/rest/category_product/category-products`, fetcher);
  const { data: products, mutate } = useSWR<Product[]>(`${BASE_URL}/rest/products`, fetcher);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = products?.filter(p => {
    return (
      p.name.toLowerCase().includes(searchTerm)
    )
  }).filter(p => {
    switch (activeTab) {
      case 'inStock': return p.status === "Còn hàng";
      case 'outStock': return p.status === "Hết hàng";
      default: return true;
    }
  }).filter(p => {
    if (selectedType) {
      return p.categoryProduct.categoryProductId == selectedType;
    }
    return true;
  });

  const renderContent = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
    return renderTable(currentItems);
  };

  const renderTable = (filteredProducts: Product[] = []) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
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
            {filteredProducts && filteredProducts.length > 0 ?
              filteredProducts.map((product, index) => (
                <tr key={product.productId} id={product.productId.toString()}>
                  <td className="text-center align-middle">{indexOfFirstItem + index + 1}</td>
                  <td className="text-center align-middle">
                    <Link href="#">
                      <Image onClick={() => handleEditClick(product)} src={`${product.image}`} width={110} height={110}
                        alt={`${product.image}`} style={{ height: '180px', width: '200px', objectFit: 'cover' }} />
                    </Link>
                  </td>
                  <td className="text-start align-middle">
                    <div>
                      <span>Tên sản phẩm: </span>
                      <strong className="text-dark">{product.name}</strong>
                    </div>
                    <div>
                      <span>Ngày tạo:</span>{" "}
                      <strong>{new Date(product.createDate).toLocaleDateString('vi-GB')}</strong>
                    </div>
                    <div>
                      <span>Danh mục:</span>{" "}
                      <strong>{product.categoryProduct.name || "Không xác định"}</strong>
                    </div>
                    <div>
                      <span>Giá:</span>{" "}
                      <strong>{formatPrice(product.price)}</strong>
                    </div>
                    <div>
                      <span>Hãng:</span> <strong>{product.brand}</strong>
                    </div>
                    <div>
                      <span>Xuất sứ:</span> <strong>{product.country}</strong>
                    </div>
                    <div>
                      <span>Trạng thái:</span>
                      <Badge bg={product.status === "Còn hàng" ? "success" : "danger"}>{product.status}</Badge>
                    </div>
                    <div>
                      <span>Số lượng:</span>
                      <Badge bg={product.stock >= 1 ? "primary" : "danger"}>{product.stock}</Badge>
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
    )
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = products && Math.ceil(products.length / itemsPerPage);
    if (totalPages && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPagination = () => {
    const totalPages = filteredProducts && Math.ceil(filteredProducts.length / itemsPerPage);
    const pages = [];

    if (filteredProducts && filteredProducts.length < 1 || totalPages && totalPages === 1) return null;

    if (totalPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
        );
      }
    }

    return (
      <Pagination>
        <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
        {pages}
        <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  const markProductAsOutOfStock = async (productId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa loại sân này?')) {
      await fetch(`${BASE_URL}/rest/products/${productId}/mark-as-out-of-stock`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        }
      }).then((res) => {
        if (!res.ok) {
          toast.error('Cập nhật trạng thái sản phẩm thất bại!');
          return;
        }
        mutate();
        toast.success("Cập nhật trạng thái sản phẩm thành công");
      });
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product)
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setCurrentProduct(null);
    setShowModal(true);
  };

  return (
    <div style={{ fontSize: "14px" }}>
      <div className="box-ultil d-flex flex-wrap align-items-center justify-content-between gap-3">
        <b className="text-danger flex-grow-1" style={{ fontSize: "20px" }}>Quản lý sản phẩm/ Tổng: {products?.length || 0} sản phẩm</b>
        <Button className="btn-sd-admin" style={{ fontSize: "15px", whiteSpace: "nowrap" }} onClick={handleCreateClick}>
          <i className="bi bi-plus-circle me-2"></i>Thêm Sản Phẩm
        </Button>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <i className="bi bi-funnel fs-4"></i>
          <Form.Control as="select" name="categoryProduct" value={selectedType} onChange={(e) => setSelectedType(Number(e.target.value))}
            style={{ minWidth: "200px" }}>
            <option value="">Tất cả loại sản phẩm</option>
            {categoryProducts?.map((category) => (
              <option key={category.categoryProductId} value={category.categoryProductId}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </div>
        <Form.Control type="text" placeholder="Tìm theo tên và địa chỉ..." onChange={handleSearch} />
      </div>
      <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
        <Nav.Item>
          <Nav.Link eventKey="all" className="tab-link">Toàn bộ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="inStock" className="tab-link">Còn hàng</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="outStock" className="tab-link">Hết hàng</Nav.Link>
        </Nav.Item>
      </Nav>
      {renderContent()}
      {renderPagination()}
      <ProductAddNew showAddProduct={showModal} setShowAddProduct={setShowModal} currentProduct={currentProduct}
        categoryProducts={categoryProducts} />
    </div>
  )
}

export default AdminProduct;