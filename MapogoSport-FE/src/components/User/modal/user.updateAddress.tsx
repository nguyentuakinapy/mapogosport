import { decodeString } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from 'swr';

interface UserProps {
    showUpdateAddress: boolean;
    setShowUpdateAddress: (v: boolean) => void;
    addressUser?: AddressUsers;
}

const ModalUpdateAddress = (props: UserProps) => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const { showUpdateAddress, setShowUpdateAddress, addressUser } = props;

    const { data, error } = useSWR("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [addressDetail, setAddressDetail] = useState<string>('');

    useEffect(() => {
        if (addressUser) {
            setSelectedProvince(addressUser.address.province);
            setSelectedDistrict(addressUser.address.district);
            setSelectedWard(addressUser.address.ward);
            setAddressDetail(addressUser.addressDetail);

            const selectedProvinceData = data?.find((province: Province) => province.Name === addressUser.address.province);
            setDistricts(selectedProvinceData?.Districts || []);
            const selectedDistrictData = selectedProvinceData?.Districts.find((district: District) => district.Name === addressUser.address.district);
            setWards(selectedDistrictData?.Wards || []);
        }
    }, [addressUser, data]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceName = e.target.value;
        setSelectedProvince(provinceName);
        const selectedProvinceData = data.find((province: Province) => province.Name === provinceName);
        setDistricts(selectedProvinceData?.Districts || []);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = e.target.value;
        setSelectedDistrict(districtName);
        const selectedDistrictData = districts.find((district: District) => district.Name === districtName);
        setWards(selectedDistrictData?.Wards || []);
        setSelectedWard('');
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardName = e.target.value;
        setSelectedWard(wardName);
    };

    const handleClose = () => {
        setShowUpdateAddress(false);
    };

    const handleUpdate = () => {
        if (!selectedProvince || !selectedDistrict || !selectedWard || !addressDetail) {
            toast.error("Hãy điền đầy đủ thông tin!");
            return;
        }
        const username = decodeString(String(localStorage.getItem('username')));
        if (username) {
            fetch(`http://localhost:8080/rest/user/address/${addressUser?.addressUserId}`, {
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
                    addressDetail: addressDetail
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Cập nhật không thành công! Vui lòng thử lại!`);
                    return
                }
                handleClose();
                mutate(`http://localhost:8080/rest/user/${username}`);
                toast.success('Cập nhật thành công!');
            })
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
                                        {data?.map((province: Province) => (
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
                                        value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
                                    <Form.Label htmlFor="detailAddress">Địa chỉ chi tiết <b className='text-danger'>*</b></Form.Label>
                                </Form.Floating>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>Hủy</Button>
                <Button style={{ backgroundColor: "#142239" }} onClick={() => handleUpdate()}>Xác nhận</Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalUpdateAddress;