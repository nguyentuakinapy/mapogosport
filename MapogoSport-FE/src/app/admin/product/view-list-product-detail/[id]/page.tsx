"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Table, Button, Collapse } from "react-bootstrap";
import { useState } from "react";
import ProductDetailModalProps from "@/components/Admin/Modal/product.detail.addNew";

// Fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ViewListDetail() {
  const { id } = useParams(); // Lấy productId từ URL

  // State để quản lý productDetailId được mở
  const [openProductDetailId, setOpenProductDetailId] = useState<number | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<ProductDetail[]>([]);

  // Fetch ProductDetail dựa vào productId
  const { data: productDetails, error: errorProductDetails } = useSWR<
    ProductDetail[]
  >(`http://localhost:8080/rest/product-detail/${id}`, fetcher);

  // Fetch ProductDetailSize dựa vào productDetailId
  const { data: productDetailSizes, error: errorProductDetailSizes } = useSWR<
    ProductDetailSize[]
  >(
    openProductDetailId
      ? `http://localhost:8080/rest/product-detail-size/${openProductDetailId}`
      : null,
    fetcher
  );

  // Xử lý lỗi và trạng thái loading
  if (errorProductDetails)
    return <div>Lỗi loading dữ liệu chi tiết sản phẩm...</div>;
  if (errorProductDetailSizes)
    return <div>Lỗi loading dữ liệu size màu chi tiết sản phẩm...</div>;
  if (!productDetails)
    return <div>Đang loading dữ liệu chi tiết sản phẩm...</div>;

  // Tính tổng số lượng cho từng sản phẩm chi tiết
  // const totalQuantities = productDetailSizes
  //   ? productDetailSizes.reduce((acc, detailSize) => {
  //       if (detailSize.productDetail.productDetailId) {
  //         acc[detailSize.productDetail.productDetailId] =
  //           (acc[detailSize.productDetail.productDetailId] || 0) +
  //           (detailSize.quantity || 0);
  //       }
  //       return acc;
  //     }, {} as Record<number, number>)
  //   : {};

  // Hàm để mở modal chi tiết sản phẩm
  const handleShowDetail = (productDetail: ProductDetail) => {
    setSelectedProductDetail(productDetail);
    setShowDetailModal(true);
  };

  // Hàm để đóng modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProductDetail(null);
  };

  return (
    <>
      <h3
        className="text-center text-danger fw-bold"
        style={{ fontSize: "20px" }}
      >
        Danh sách chi tiết sản phẩm:{" "}
        {productDetails[0]?.product?.name || "Không có tên sản phẩm"} (ID: {id})
      </h3>

      {/* Table hiển thị danh sách ProductDetail */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Màu sắc</th>
            <th>Hình ảnh</th>
            <th>Galleries</th>
            {/* <th>Số lượng tổng</th> */}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {productDetails.length > 0 ? (
            productDetails.map(
              (
                detail,
                index // kiểu ProductDetail
              ) => (
                <tr key={detail.productDetailId}>
                  <td>{index + 1}</td>
                  <td>
                    {detail.color ? (
                      <span className="text-dark"
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "12px",
                          backgroundColor:
                            detail.color === "đỏ"
                              ? "red"
                              : detail.color === "xanh"
                              ? "blue"
                              : detail.color === "vàng"
                              ? "yellow"
                              : detail.color === "trắng"
                              ? "white"
                              : detail.color === "đen"
                              ? "black"
                              : "gray", // Màu mặc định nếu không khớp
                          color: detail.color === "trắng" ? "black" : "white", // Màu chữ
                        }}
                      >
                        {detail.color}
                      </span>
                    ) : (
                      "Không có màu"
                    )}
                  </td>

                  <td>
                    {detail.image ? (
                      <img
                        src={`/images/product-images/${detail.image}`}
                        alt={detail.color}
                        style={{ width: "50px" }}
                      />
                    ) : (
                      "Không có hình ảnh"
                    )}
                  </td>
                  <td>
                    {detail.galleries && detail.galleries.length > 0
                      ? detail.galleries.map((gallery) => (
                          <span key={gallery.galleryId}>
                            {gallery.name}
                            <br />
                          </span>
                        ))
                      : "Không có gallery"}
                  </td>
                 {/*  <td>
                    {totalQuantities[detail.productDetailId] ||
                      "Đang load số lượng"}{" "}
                    Hiển thị tổng số lượng
                  </td> */}
                  <td className="text-center align-middle">
                    <Button
                      variant="primary"
                      onClick={() =>
                        setOpenProductDetailId(
                          openProductDetailId === detail.productDetailId
                            ? null
                            : detail.productDetailId
                        )
                      }
                      aria-controls={`collapse-${detail.productDetailId}`}
                      aria-expanded={
                        openProductDetailId === detail.productDetailId
                      }
                    >
                      {openProductDetailId === detail.productDetailId
                        ? "Ẩn sizes"
                        : "Xem sizes"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleShowDetail(detail)} // Mở modal hiển thị chi tiết sản phẩm
                      className="ms-2" // Thêm khoảng cách giữa hai nút
                    >
                      Xem chi tiết
                    </Button>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                Không có dữ liệu chi tiết sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Collapse section for ProductDetailSize */}
      {openProductDetailId && productDetailSizes && (
        <Collapse in={!!openProductDetailId}>
          <div id={`collapse-${openProductDetailId}`}>
            <h4
              className="text-center text-primary fw-bold"
              style={{ fontSize: "18px" }}
            >
              Danh sách kích cỡ cho ProductDetail ID: {openProductDetailId} -
              Màu sắc:{" "}
              {productDetails.find(
                (detail) => detail.productDetailId === openProductDetailId
              )?.color || "Không có màu"}
            </h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kích cỡ</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {productDetailSizes.length > 0 ? (
                  productDetailSizes.map((detailSize, index) => (
                    <tr key={detailSize.productDetailSizeId}>
                      <td>{index + 1}</td>
                      <td>
                        {detailSize.size
                          ? detailSize.size.sizeName
                          : "Không có kích cỡ"}
                      </td>
                      <td>
                        {detailSize.price
                          ? detailSize.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : "N/A"}
                      </td>
                      <td>{detailSize.quantity || "Không có số lượng"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Không có dữ liệu chi tiết kích cỡ
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Collapse>
      )}
      <Link className="btn btn-secondary" href="/admin/product/">
        Quay lại
      </Link>
      <ProductDetailModalProps
        show={showDetailModal}
        onHide={handleCloseDetailModal}
        productDetail={selectedProductDetail}
        onClose={handleCloseDetailModal}
      />
    </>
  );
}
