'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react'; // Bổ sung useEffect
import { Table, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios'; // Đảm bảo rằng bạn đã cài axios
import ProductDetail from '@/app/product-detail/[idProduct]/page';


export default function ViewListDetail() {
    const { id } = useParams();

    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiProductDetailUrl = `http://localhost:8080/rest/product-detail/${id}`; // Sửa cú pháp chuỗi

                // Gọi API lấy dữ liệu product details
                const productDetailRes = await axios.get(apiProductDetailUrl);

                // Ghi lại dữ liệu product details từ API
                console.log('Product Details đây nè:', productDetailRes.data);

                // Lưu dữ liệu vào state productDetails
                setProductDetails(productDetailRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Gọi hàm fetchData
        fetchData();
    }, [id]); // Đảm bảo chỉ chạy khi `id` thay đổi
        
    useEffect(() => {
        console.log(productDetails);
        
    }, [productDetails])
    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>
                Danh sách chi tiết sản phẩm của Sản phẩm ID: {id}
            </h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Màu sắc</th>
                        <th>Kích cỡ</th>
                        <th>Số lượng</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
               
                    {productDetails.map((detail, index) => (
                        <tr key={detail.productDetailId}>
                            <td>{index + 1}</td>
                            <td>{detail.color}</td>
                            <td>{detail.size}</td>
                            <td>{detail.quantity}</td>
                            <td><img src={detail.image} alt={detail.color} style={{ width: '50px' }} /></td>
                            <td className="text-center align-middle">
                                <OverlayTrigger overlay={<Tooltip>Xem</Tooltip>}>
                                    <Button variant="primary" className="m-1">
                                        <i className="bi bi-eye-fill"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                                    <Button variant="warning" className="m-1">
                                        <i className="bi bi-pencil-fill"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                    <Button variant="danger" className="m-1">
                                        <i className="bi bi-trash3-fill"></i>
                                    </Button>
                                </OverlayTrigger>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Link href={'/admin/product/'}>Quay lại</Link>
        </>
    );
}
