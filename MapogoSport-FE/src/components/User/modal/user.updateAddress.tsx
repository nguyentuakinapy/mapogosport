import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from 'swr';

interface UserProps {
    showUpdateAddress: boolean;
    setShowUpdateAddress: (v: boolean) => void;
    addressUser: any;
}

const ModalAddAddress = (props: UserProps) => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const { showUpdateAddress, setShowUpdateAddress, addressUser } = props;

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
    const [phone, setPhone] = useState<string>('');
    const [addressDetail, setAddressDetail] = useState<string>('');

    useEffect(() => {
        if (addressUser) {
            setSelectedProvince(addressUser.address.province);
            setSelectedDistrict(addressUser.address.district);
            setSelectedWard(addressUser.address.ward);
            setPhone(addressUser.phoneNumber);
            setAddressDetail(addressUser.addressDetail);

            const selectedProvinceData = data?.find((province: any) => province.Name === addressUser.address.province);
            setDistricts(selectedProvinceData?.Districts || []);
            const selectedDistrictData = selectedProvinceData?.Districts.find((district: any) => district.Name === addressUser.address.district);
            setWards(selectedDistrictData?.Wards || []);
        }
    }, [addressUser, data]);

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
        setShowUpdateAddress(false);
    };

    const handleUpdate = () => {
        if (!selectedProvince || !selectedDistrict || !selectedWard || !phone || !addressDetail) {
            toast.error("Hãy điền đầy đủ thông tin!");
            return;
        }
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            fetch(`http://localhost:8080/rest/user/address/${addressUser.addressUserId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: {
                        province: selectedProvince,
                        district: selectedDistrict,
                        ward: selectedWard
                    },
                    phoneNumber: phone,
                    addressDetail: addressDetail
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    toast.error(`Cập nhật không thành công! Chi tiết lỗi: ${errorText}`);
                    return
                }
                handleClose();
                mutate(`http://localhost:8080/rest/user/${parsedUserData.username}`);
                toast.success('Cập nhật thành công!');
            }).catch((error) => {
                toast.error(`Đã xảy ra lỗi: ${error.message}`);
            });
        }
    };
    if (error) {
        return (
            <Modal show={showUpdateAddress} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
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
        <Modal show={showUpdateAddress} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
            centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title className="text-uppercase text-danger">Cập nhật địa chỉ</Modal.Title>
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
                                    <Form.Control size="sm" type="text" placeholder="Số điện thoại"
                                        value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <Form.Label htmlFor="phone">Số điện thoại <b className="text-danger">*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group>
                        <Form.Floating>
                            <Form.Control size="sm" type="text" placeholder="Địa chỉ chi tiết"
                                value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
                            <Form.Label htmlFor="detailAddress">Địa chỉ chi tiết <b className='text-danger'>*</b></Form.Label>
                        </Form.Floating>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>Hủy</Button>
                <Button style={{ backgroundColor: "#142239" }} onClick={() => handleUpdate()}>Xác nhận</Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalAddAddress;