import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface SportFieldProps {
    showSportFieldModal: boolean;
    setShowSportFieldModal: (v: boolean) => void;
    selectedSportField?: SportField | null;
    username: string | null;
}

const ModalCreateSportField = (props: SportFieldProps) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const { showSportFieldModal, setShowSportFieldModal, selectedSportField, username } = props;
    const [fieldName, setFieldName] = useState<string>("");
    const [openTime, setOpenTime] = useState<string | null>(null);
    const [closeTime, setCloseTime] = useState<string | null>(null);
    const [selectedFieldType, setSelectedFieldType] = useState<number>(0);
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [avatar, setAvatar] = useState<File | string>("/images/logo.png");  // Chọn avatar chính
    const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);  // Chọn ảnh gallery phụ
    const [galleryImages, setGalleryImages] = useState<GalleryField[]>([]);  // Chọn ảnh gallery phụ
    const [openHour, setOpenHour] = useState<number>(0);
    const [openMinute, setOpenMinute] = useState<number>(0);
    const [closeHour, setCloseHour] = useState<number>(0);
    const [closeMinute, setCloseMinute] = useState<number>(0);

    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [addressDetail, setAddressDetail] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedSportField) {
            setFieldName("");
            setOpenTime(null);
            setCloseTime(null);
            setSelectedFieldType(0);
            setAddress("");
            setDescription("");
            setStatus("");
            setOpenHour(0);
            setCloseHour(0);
            setCloseMinute(0);
            setOpenMinute(0);

            setSelectedProvince("");
            setSelectedDistrict("");
            setSelectedWard("");
            setAddressDetail("");
            setAvatar("/images/logo.png");
            setLoading(false);
        } else {
            setFieldName(selectedSportField.name);
            setOpenTime(selectedSportField.opening);
            const [hourStr, minuteStr] = selectedSportField.opening.split('h');
            setOpenHour(parseInt(hourStr, 10));
            setOpenMinute(parseInt(minuteStr, 10));
            setCloseTime(selectedSportField.closing);
            const [hourStr1, minuteStr1] = selectedSportField.closing.split('h');
            setCloseHour(parseInt(hourStr1, 10));
            setCloseMinute(parseInt(minuteStr1, 10));
            setSelectedFieldType(selectedSportField.categoriesField.categoriesFieldId);
            setAddress(selectedSportField.address);
            setDescription(selectedSportField.decription);
            setStatus(selectedSportField.status);
            setAvatar(selectedSportField.image || "/images/logo.png");

            const addressArray = selectedSportField.address.split(',');

            setSelectedProvince(addressArray[3]?.trim());
            setSelectedDistrict(addressArray[2]?.trim());
            setSelectedWard(addressArray[1]?.trim());
            setAddressDetail(addressArray[0]?.trim());

            const selectedProvinceData = apiAddress?.find((province: Province) => province.Name === addressArray[3]?.trim());
            setDistricts(selectedProvinceData?.Districts || []);
            const selectedDistrictData = selectedProvinceData?.Districts.find((district: District) => district.Name === addressArray[2]?.trim());
            setWards(selectedDistrictData?.Wards || []);
        }
    }, [selectedSportField, showSportFieldModal]);


    const { data: fieldTypes } = useSWR<CategoryField[]>(`${BASE_URL}rest/category_field`, fetcher);

    const { data } = useSWR(selectedSportField &&
        `${BASE_URL}rest/sportfield/gallery/${selectedSportField.sportFieldId}`, fetcher);

    useEffect(() => {
        if (data) {
            setGalleryImages(data);
        }
    }, [data]);

    const { data: apiAddress } = useSWR<ApiAddressResponse>("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceName = e.target.value;
        setSelectedProvince(provinceName);
        const selectedProvinceData = apiAddress?.find(
            (province: Province) => province.Name === provinceName
        );
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

    const getAddress = () => {
        const addressParts = [addressDetail, selectedWard, selectedDistrict, selectedProvince];
        return addressParts.filter(part => part).join(', ');
    }

    // Đóng modal và reset các trường nhập liệu
    const handleClose = () => {
        setSelectedDistrict("");
        setSelectedProvince("");
        setSelectedWard("");
        setAddressDetail("");
        setFieldName("");
        setOpenTime(null);
        setCloseTime(null);
        setSelectedFieldType(0);
        setAddress("");
        setDescription("");
        setStatus("");
        setAvatar("/images/logo.png");
        setSelectedGalleryFiles([]);
        setGalleryImages([]);
        setOpenHour(0);
        setCloseHour(0);
        setLoading(false);
        setShowSportFieldModal(false);

    };

    // Xử lý thay đổi ảnh đại diện (avatar)
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) setAvatar(file);
    };

    // Xử lý thay đổi ảnh gallery
    const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setSelectedGalleryFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    useEffect(() => {
        if (openHour !== null && openMinute !== null) {
            setOpenTime(`${openHour}h${openMinute.toString().padStart(2, '0')}`);
        }
    }, [openHour, openMinute]);

    // Cập nhật lại closeTime khi giờ/phút thay đổi
    useEffect(() => {
        if (closeHour !== null && closeMinute !== null) {
            setCloseTime(`${closeHour}h${closeMinute.toString().padStart(2, '0')}`);
        }
    }, [closeHour, closeMinute]);




    const checkForm = () => {
        setLoading(true);
        console.log(fieldName);

        const errors = [];

        if (!fieldName) {
            errors.push("Vui lòng nhập tên sân.");
        }
        if (!openTime) {
            errors.push("Vui lòng nhập giờ mở cửa.");
        }
        if (!closeTime) {
            errors.push("Vui lòng nhập giờ đóng cửa.");
        }
        if (!selectedFieldType) {
            errors.push("Vui lòng chọn loại sân.");
        }
        if (!getAddress()) {
            errors.push("Vui lòng nhập địa chỉ.");
        }
        // if (!description) {
        //     errors.push("Vui lòng nhập mô tả.");
        // }

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            setLoading(false);
            return false;
        }

        return true;
    };

    const handleUpdate = () => {
        if (checkForm()) {

            const sportFieldData = {
                sportFieldId: selectedSportField?.sportFieldId,
                name: fieldName,
                opening: `${openTime}`,
                closing: `${closeTime}`,
                categoriesField: selectedFieldType,
                address: getAddress(),
                decription: description,
                status: status,
            };

            // Tạo FormData để gửi dữ liệu dưới dạng multipart/form-data
            const formData = new FormData();
            formData.append("sportFieldData", new Blob([JSON.stringify(sportFieldData)], { type: "application/json" }));

            // Chỉ thêm avatar nếu nó là file mới hoặc khác ảnh gốc
            if (avatar instanceof File || avatar !== selectedSportField?.image) {
                formData.append("avatar", avatar as File);
            }

            // Thêm từng ảnh trong selectedGalleryFiles vào FormData
            if (selectedGalleryFiles && selectedGalleryFiles.length > 0) {
                selectedGalleryFiles.forEach(file => {
                    formData.append("galleryFiles", file); // Tên phải trùng với tên yêu cầu trong API
                });
            }

            axios.post(`${BASE_URL}rest/sportfield/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log("Thông tin sân đã được lưu thay đổi:", response.data);
                    mutate(`${BASE_URL}rest/sportfields/lists/${username}`);
                    handleClose();
                })
                .catch(error => {
                    console.error("Lỗi khi lưu thay đổi thông tin sân:", error.response ? error.response.data : error.message);
                });
        }
    }

    // Lưu thông tin sân thể thao và gửi ảnh lên server
    const handleSave = () => {
        if (checkForm()) {
            const sportFieldData = {
                name: fieldName,
                opening: `${openTime}`,
                closing: `${closeTime}`,
                categoriesField: selectedFieldType,
                address: getAddress(),
                decription: description,
                status: status,
                owner: username
            };

            // Tạo FormData để gửi dữ liệu dưới dạng multipart/form-data
            const formData = new FormData();
            formData.append("sportFieldData", new Blob([JSON.stringify(sportFieldData)], { type: "application/json" }));

            // Thêm ảnh đại diện nếu có
            if (avatar instanceof File) {
                formData.append("avatar", avatar);
            }

            // Thêm từng ảnh trong selectedGalleryFiles vào FormData
            if (selectedGalleryFiles && selectedGalleryFiles.length > 0) {
                selectedGalleryFiles.forEach(file => {
                    formData.append("galleryFiles", file); // Tên phải trùng với tên yêu cầu trong API
                });
            }

            axios.post(`${BASE_URL}rest/sportfield/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log("Thông tin sân đã được lưu:", response.data);
                    mutate(`${BASE_URL}rest/sportfields/lists/${username}`);
                    handleClose();
                })
                .catch(error => {
                    console.error("Lỗi khi lưu thông tin sân:", error.response ? error.response.data : error.message);
                });
        }
    };

    //xóa hình
    const handleDeleteGallery = async (gallerySportFieldId: number) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

        if (!confirmed) {
            return; // Nếu người dùng không xác nhận, thoát khỏi hàm
        }
        try {
            await axios.delete(
                `${BASE_URL}rest/gallerySportField/delete/${gallerySportFieldId}`
            );

            setGalleryImages(prevImages => prevImages.filter(image => image.gallerySportFieldId !== gallerySportFieldId));
            toast.success("Xóa ảnh trong thư viện thành công");
        } catch (error) {
            toast.error("Xóa ảnh trong thư viện không thành công");
            console.error("Error deleting product:", error);
        }
    };

    const handleDeleteGalleryNew = async (index: number) => {
        const updatedGalleryFiles = [...selectedGalleryFiles]; // Tạo một bản sao của mảng
        updatedGalleryFiles.splice(index, 1); // Xóa phần tử tại index
        // Cập nhật lại state nếu cần
        setSelectedGalleryFiles(updatedGalleryFiles);
    };

    return (
        <Modal show={showSportFieldModal} size="xl" centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title className="text-danger text-uppercase d-flex m-auto">{selectedSportField ? 'Sửa Khu Vực' : 'Thêm Khu Vực'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col className="col-8">
                        <FloatingLabel controlId="floatingFieldName" label={<span>Tên sân <b className="text-danger">*</b></span>} className="mb-3">
                            <Form.Control type="text" placeholder="Tên sân" value={fieldName}
                                onChange={(e) => setFieldName(e.target.value)}
                            />
                        </FloatingLabel>
                        <Row>
                            <Col className="col-6">
                                <label className="">
                                    Giờ mở cửa <b className="text-danger">*</b> : {openHour !== 0 && openMinute !== null ? `${openHour}h${openMinute.toString().padStart(2, '0')}` : "Chưa chọn"}
                                </label>
                                <div className="d-flex">
                                    <Form.Select value={openHour ?? ''} onChange={(e) => { setOpenHour(parseInt(e.target.value, 10)); }} className="me-2">
                                        <option>Chọn giờ</option>
                                        {[...Array(24).keys()].map((hour) => (
                                            <option key={hour} value={hour}>
                                                {hour}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Select
                                        value={openMinute ?? ''}
                                        onChange={(e) => {
                                            setOpenMinute(parseInt(e.target.value, 10));
                                        }}>
                                        {[0, 30].map((minute) => (
                                            <option key={minute} value={minute}>
                                                {minute}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Col>

                            <Col className="col-6 mb-3">
                                <label className="">
                                    Giờ đóng cửa <b className="text-danger">*</b> : {closeHour !== 0 && closeMinute !== null ? `${closeHour}h${closeMinute.toString().padStart(2, '0')}` : "Chưa chọn"}
                                </label>
                                <div className="d-flex">
                                    <Form.Select
                                        value={closeHour ?? ''}
                                        onChange={(e) => {
                                            setCloseHour(parseInt(e.target.value, 10));
                                        }}
                                        className="me-2"
                                    >
                                        <option>Chọn giờ</option>
                                        {[...Array(24).keys()].filter((hour) => hour > (openHour ?? -1)).map((hour) => (
                                            <option key={hour} value={hour}>
                                                {hour}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Select
                                        value={closeMinute ?? ''}
                                        onChange={(e) => {
                                            setCloseMinute(parseInt(e.target.value, 10));

                                        }}
                                    >
                                        {[0, 30].map((minute) => (
                                            <option key={minute} value={minute}>
                                                {minute}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-6">
                                <FloatingLabel controlId="floatingFieldType" label={<span>Loại sân <b className="text-danger">*</b></span>} className="mb-3">
                                    <Form.Select value={selectedFieldType} onChange={(e) => setSelectedFieldType(Number(e.target.value))}>
                                        <option value="">Chọn loại sân</option>
                                        {fieldTypes && fieldTypes.length > 0 ? (
                                            fieldTypes.map((type) => (
                                                <option key={type.categoriesFieldId} value={type.categoriesFieldId}>
                                                    {type.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">Đang tải...</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col className="col-6">
                                <FloatingLabel controlId="floatingStatus" label={<span>Trạng thái <b className="text-danger">*</b></span>} className="mb-3">
                                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Chọn trạng thái</option>
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Tạm đóng">Tạm đóng</option>
                                        <option value="Sửa chữa">Sửa chữa</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>


                        {/* tỉnh */}
                        <div className="form-floating mb-2">
                            <FloatingLabel controlId="city" label={<span>Tỉnh/Thành <b className="text-danger">*</b></span>}>
                                <Form.Select onChange={handleProvinceChange} value={selectedProvince ?? ''} >
                                    <option>-- Nhấn để chọn --</option>
                                    {apiAddress?.map((province: Province) => (
                                        <option key={province.Id} value={province.Name}>{province.Name}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </div>
                        {/* huyện */}
                        <div className="form-floating mb-2">
                            <FloatingLabel controlId="district" label={<span>Quận/Huyện <b className="text-danger">*</b></span>}>
                                <Form.Select onChange={handleDistrictChange} value={selectedDistrict ?? ''} disabled={!selectedProvince}>
                                    <option value="">-- Nhấn để chọn --</option>
                                    {districts.map((district) => (
                                        <option key={district.Id} value={district.Name}>{district.Name}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </div>
                        {/* xã */}
                        <div className="form-floating mb-2">
                            <FloatingLabel controlId="ward" label={<span>Phường/Xã <b className="text-danger">*</b></span>}>
                                <Form.Select onChange={handleWardChange} value={selectedWard ?? ''} disabled={!selectedDistrict}>
                                    <option value="">-- Nhấn để chọn --</option>
                                    {wards.map((ward) => (
                                        <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </div>
                        {/* Địa chỉ cụ thể */}
                        <div className="form-floating mb-2">
                            <Form.Floating>
                                <Form.Control size="sm" type="text" placeholder="Địa chỉ chi tiết"
                                    value={addressDetail ?? ''} onChange={(e) => setAddressDetail(e.target.value)} />
                                <Form.Label htmlFor="detailAddress">Địa chỉ chi tiết <b className='text-danger'>*</b></Form.Label>
                            </Form.Floating>
                        </div>
                        <FloatingLabel controlId="floatingDescription" label="Mô tả" className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Mô tả"
                                value={description}
                                style={{ resize: "none", height: "auto" }}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        {/* Phần 1: Avatar */}
                        <h5>Ảnh đại diện <b className="text-danger">*</b></h5>
                        <Image src={avatar instanceof File ? URL.createObjectURL(avatar) : avatar} alt="Sport field avatar" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                        <Form.Group controlId="avatarInput" className="mt-2">
                            <Form.Label>{selectedSportField ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} className="d-none" />
                            <Button variant="outline-primary" size="sm" onClick={() => document.getElementById("avatarInput")!.click()}>
                                <i className="bi bi-person-circle mx-1"></i>
                            </Button>
                        </Form.Group>

                        {/* Phần 2: Gallery */}
                        <h5 className="mt-4">Thư viện ảnh</h5>

                        <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
                            {galleryImages.length > 0 ? (
                                galleryImages.map((image) => (
                                    <div key={image.gallerySportFieldId} className="position-relative me-3 mb-3">
                                        <Image
                                            src={image.image}
                                            alt={`gallery-${image.gallerySportFieldId}`}
                                            width={70} // Chiều rộng ảnh, có thể tùy chỉnh
                                            height={70} // Chiều cao ảnh, có thể tùy chỉnh
                                            className="border"
                                            style={{
                                                objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                        <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                            <Button
                                                variant="danger"
                                                className="btn-sm position-absolute"
                                                style={{
                                                    top: "-8px", right: "-8px", width: "24px", height: "24px", borderRadius: "50%",
                                                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                }}
                                                onClick={() => {
                                                    handleDeleteGallery(
                                                        image.gallerySportFieldId
                                                    );
                                                }}
                                            >
                                                <i className="bi bi-x fs-6"></i>
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                ))
                            ) : (
                                <p className="text-danger">Chưa có ảnh trong thư viện.</p>
                            )}
                        </div>
                        <Form.Group controlId="galleryInput" className="mt-2">
                            <Form.Label>Thêm ảnh vào thư viện</Form.Label>
                            <Form.Control type="file" multiple accept="image/*" onChange={handleGalleryChange} className="d-none" />
                            <Button variant="outline-primary" size="sm" onClick={() => document.getElementById("galleryInput")!.click()}>
                                <i className="bi bi-images mx-1"></i> Thêm ảnh
                            </Button>
                            <p>Ảnh mới</p>
                            <div className="d-flex flex-wrap align-items-center">
                                {selectedGalleryFiles.length > 0 && selectedGalleryFiles.map((file, index) => (
                                    <div key={index} className="position-relative me-3 mb-3">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`gallery-${index}`}
                                            width={70} // Chiều rộng ảnh, có thể tùy chỉnh
                                            height={70} // Chiều cao ảnh, có thể tùy chỉnh
                                            className="border"
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                        <OverlayTrigger overlay={<Tooltip>Xóa</Tooltip>}>
                                            <Button
                                                variant="danger"
                                                className="btn-sm position-absolute"
                                                style={{
                                                    top: "-8px", right: "-8px", width: "24px", height: "24px", borderRadius: "50%", display: "flex",
                                                    alignItems: "center", justifyContent: "center", padding: "0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                }}
                                                onClick={() => {
                                                    handleDeleteGalleryNew(
                                                        index
                                                    );
                                                }}
                                            >
                                                <i className="bi bi-x fs-6"></i>
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body >
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button style={{ background: '#142239' }} onClick={selectedSportField ? handleUpdate : handleSave} disabled={loading}>
                    {selectedSportField ? 'Lưu Thay Đổi' : 'Thêm Khu Vực'}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalCreateSportField;
