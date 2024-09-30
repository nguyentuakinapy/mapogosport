import { Table } from "react-bootstrap";

export default function BookingSport() {
    return (
        <>
            <h3 className="text-center text-danger fw-bold" style={{ fontSize: '20px' }}>LỊCH ĐẶT SÂN</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Tên sân</th>
                        <th>Giá thuê/h</th>
                        <th colSpan={50}>Thời gian thuê</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>30/09/2024</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                    </tr>
                    <tr>
                        <td>30/09/2024</td>
                        <td>Sân bóng 2</td>
                        <td>120.000</td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                    </tr>
                    <tr>
                        <td>31/09/2024</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                    </tr>
                    <tr>
                        <td>32/09/2024</td>
                        <td>Sân bóng 1</td>
                        <td>120.000</td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                        <td><span className="badge text-bg-warning">1h - 2h ( Sân 5 )</span></td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}