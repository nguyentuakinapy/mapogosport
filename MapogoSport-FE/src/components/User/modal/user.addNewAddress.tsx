import { useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from 'swr';

interface UserProps {
    showAddAddress: boolean;
    setShowAddAddress: (v: boolean) => void;
}

const ModalAddAddress = (props: UserProps) => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const { showAddAddress, setShowAddAddress } = props;

    const { data, error } = useSWR("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [addressDetail, setAddressDetail] = useState<string>('');

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceName = e.target.value;
        setSelectedProvince(provinceName);
        const selectedProvinceData = data.find((province: any) => province.Name === provinceName);
        setDistricts(selectedProvinceData?.Districts || []);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = e.target.value;
        setSelectedDistrict(districtName);
        const selectedDistrictData = districts.find((district: any) => district.Name === districtName);
        setWards(selectedDistrictData?.Wards || []);
        setSelectedWard('');
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardName = e.target.value;
        setSelectedWard(wardName);
    };

    const handleClose = () => {
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setShowAddAddress(false);
    };

    const handleSave = () => {
        if (!selectedProvince || !selectedDistrict || !selectedWard || !addressDetail) {
            toast.error("Hãy điền đầy đủ thông tin!");
            return;
        }
        const username = localStorage.getItem('username');
        if (username) {
            fetch(`http://localhost:8080/rest/user/address/${username}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{
                    address: {
                        province: selectedProvince,
                        district: selectedDistrict,
                        ward: selectedWard
                    },
                    addressDetail: addressDetail
                }]),
            }).then(res => res.json()).then(res => {
                if (res) {
                    toast.success("Thêm địa chỉ mới thành công!")
                    handleClose();
                    mutate(`http://localhost:8080/rest/user/${username}`);
                } else {
                    toast.error("Thêm địa chỉ mới thất bại!")
                }
            });
        }

    };
    if (error) {
        return (
            <Modal show={showAddAddress} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Thêm địa chỉ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Đã xảy ra lỗi trong khi tải dữ liệu! Vui lòng thử lại sau hoặc báo cho quản trị viên!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>Hủy</Button>
                </Modal.Footer>
            </Modal >
        )
    }
    return (
        <Modal show={showAddAddress} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
            centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title className="text-uppercase text-danger">Thêm địa chỉ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="city" label={<span>Tỉnh/Thành <b className="text-danger">*</b></span>}>
                                    <Form.Select aria-label="Floating label select example"
                                        onChange={handleProvinceChange} value={selectedProvince}>
                                        <option>-- Nhấn để chọn --</option>
                                        {data?.map((province: any) => (
                                            <option key={province.Id} value={province.Name}>{province.Name}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="ward" label={<span>Phường/Xã <b className="text-danger">*</b></span>}>
                                    <Form.Select aria-label="Floating label select example" onChange={handleWardChange}
                                        value={selectedWard} disabled={!selectedDistrict}>
                                        <option value="">-- Nhấn để chọn --</option>
                                        {wards.map((ward) => (
                                            <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="district" label={<span>Quận/Huyện <b className="text-danger">*</b></span>}>
                                    <Form.Select aria-label="Floating label select example" onChange={handleDistrictChange}
                                        value={selectedDistrict} disabled={!selectedProvince}>
                                        <option value="">-- Nhấn để chọn --</option>
                                        {districts.map((district) => (
                                            <option key={district.Id} value={district.Name}>{district.Name}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Floating>
                                    <Form.Control size="sm" type="text" placeholder="Địa chỉ chi tiết"
                                        onChange={(e) => setAddressDetail(e.target.value)} />
                                    <Form.Label htmlFor="detailAddress">Địa chỉ chi tiết <b className='text-danger'>*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>Hủy</Button>
                <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalAddAddress;