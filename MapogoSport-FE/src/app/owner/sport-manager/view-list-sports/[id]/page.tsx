'use client'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Table } from 'react-bootstrap';

export default function ViewSport() {

    const { id } = useParams();

    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>DANH SÁCH SÂN "TÊN SÂN"</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sân</th>
                        <th>Giá thuê/h</th>
                        <th>Kích thước</th>
                        <th>Trạng thái</th>
                        <th>Giờ vàng</th>
                        <th>Giá giờ vàng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td>Sân 5</td>
                        <td><span className="badge text-bg-primary">Đang trống</span></td>
                        <td>10h - 12h</td>
                        <td>150.000</td>
                        <td><button className='btn btn-secondary'><i className="bi bi-pencil-square"></i></button></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td>Sân 5</td>
                        <td><span className="badge text-bg-danger">Tạm đóng</span></td>
                        <td>10h - 12h</td>
                        <td>150.000</td>
                        <td><button className='btn btn-secondary'><i className="bi bi-pencil-square"></i></button></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td>Sân 5</td>
                        <td><span className="badge text-bg-warning">Đã đặt</span></td>
                        <td>10h - 12h</td>
                        <td>150.000</td>
                        <td><button className='btn btn-secondary'><i className="bi bi-pencil-square"></i></button></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td>Sân 5</td>
                        <td>Đang trống</td>
                        <td>10h - 12h</td>
                        <td>150.000</td>
                        <td><button className='btn btn-secondary'><i className="bi bi-pencil-square"></i></button></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td>Sân 5</td>
                        <td>Đang trống</td>
                        <td>10h - 12h</td>
                        <td>150.000</td>
                        <td><button className='btn btn-secondary'><i className="bi bi-pencil-square"></i></button></td>
                    </tr>
                </tbody>
            </Table>
            Sport View ID: {id}
            <Link href={'/owner/sport-manager'}>Quay lại</Link>
        </>
    )
}