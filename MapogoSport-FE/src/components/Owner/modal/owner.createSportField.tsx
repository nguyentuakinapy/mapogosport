import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface SportFieldProps {
    showSportFieldModal: boolean;
    setShowSportFieldModal: (v: boolean) => void;
}
interface SportFieldProps {
    showSportFieldModal: boolean;
    setShowSportFieldModal: (v: boolean) => void;
    selectedSportField: any; // Thay thế `any` bằng kiểu dữ liệu cụ thể nếu có
    setSelectedSportField: (field: any) => void;
}
const ModalCreateSportField = (props: SportFieldProps) => {
    const { showSportFieldModal, setShowSportFieldModal, selectedSportField, setSelectedSportField } = props;

    const [fieldName, setFieldName] = useState("");
    const [openTime, setOpenTime] = useState<number | null>(null);
    const [closeTime, setCloseTime] = useState<number | null>(null);
    const [selectedFieldType, setSelectedFieldType] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [avatar, setAvatar] = useState<File | string>("/images/logo.png");  // Chọn avatar chính
    const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);  // Chọn ảnh gallery phụ
    const [fieldTypes, setFieldTypes] = useState([]);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);  // Chọn ảnh gallery phụ

    const userSession = sessionStorage.getItem("user");
    const user = userSession ? JSON.parse(userSession) : null;

    useEffect(() => {
        if (showSportFieldModal) {
            if (!selectedSportField) {
                setFieldName("");
                setOpenTime(null);
                setCloseTime(null);
                setSelectedFieldType("");
                setAddress("");
                setDescription("");
                setStatus("");
            } else {
                setFieldName(selectedSportField.name);
                setOpenTime(selectedSportField.opening.replace('h', '')); // Chỉnh sửa nếu cần
                setCloseTime(selectedSportField.closing.replace('h', ''));
                setSelectedFieldType(selectedSportField.categoriesField.categoriesFieldId);
                setAddress(selectedSportField.address);
                setDescription(selectedSportField.decription);
                setStatus(selectedSportField.status);
                // Không quên đặt avatar nếu có
                setAvatar(selectedSportField.image || "/images/logo.png");
                // Nếu bạn có ảnh gallery, có thể thêm ở đây
            }
        }
    }, [showSportFieldModal, selectedSportField]);


    // Lấy danh sách loại sân từ API khi modal mở
    useEffect(() => {
        if (showSportFieldModal) {
            axios.get("http://localhost:8080/rest/category_field")
                .then(response => setFieldTypes(response.data))
                .catch(error => console.error("Lỗi khi tải danh sách loại sân:", error));
        }
    }, [showSportFieldModal]);

    useEffect(() => {
        if (showSportFieldModal && selectedSportField) {
            // Gọi API để lấy danh sách ảnh gallery
            axios.get(`http://localhost:8080/rest/sportfield/gallery/${selectedSportField.sportFieldId}`)
                .then(response => {
                    setGalleryImages(response.data);
                })
                .catch(error => {
                    console.error("Lỗi khi tải danh sách ảnh gallery:", error);
                });
        }
    }, [showSportFieldModal, selectedSportField]);

    // Đóng modal và reset các trường nhập liệu
    const handleClose = () => {
        setShowSportFieldModal(false);
        setFieldName("");
        setOpenTime(null);
        setCloseTime(null);
        setSelectedFieldType("");
        setAddress("");
        setDescription("");
        setStatus("");
        setAvatar("/images/logo.png");
        setSelectedGalleryFiles([]);
        setGalleryImages([]);
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

    const checkForm = () => {
        const errors = []; // Mảng lưu trữ các thông báo lỗi

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
        if (!address) {
            errors.push("Vui lòng nhập địa chỉ.");
        }
        if (!description) {
            errors.push("Vui lòng nhập mô tả.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n")); // Hiển thị tất cả lỗi trên một alert
            return false; // Trả về false để biểu thị rằng kiểm tra không thành công
        }

        return true; // Trả về true nếu tất cả các trường hợp đều hợp lệ
    };

    const handleUpdate = () => {
        if (!checkForm()) return;

        const sportFieldData = {
            sportFieldId: selectedSportField.sportFieldId,
            name: fieldName,
            opening: `${openTime}h`,
            closing: `${closeTime}h`,
            categoriesField: selectedFieldType,
            address: address,
            decription: description,
            status: status,
        };

        // Tạo FormData để gửi dữ liệu dưới dạng multipart/form-data
        const formData = new FormData();
        formData.append("sportFieldData", new Blob([JSON.stringify(sportFieldData)], { type: "application/json" }));

        // Chỉ thêm avatar nếu nó là file mới hoặc khác ảnh gốc
        if (avatar instanceof File || avatar !== selectedSportField.image) {
            formData.append("avatar", avatar as File);
        }

        // Thêm từng ảnh trong selectedGalleryFiles vào FormData
        if (selectedGalleryFiles && selectedGalleryFiles.length > 0) {
            selectedGalleryFiles.forEach(file => {
                formData.append("galleryFiles", file); // Tên phải trùng với tên yêu cầu trong API
            });
        }

        axios.post("http://localhost:8080/rest/sportfield/update", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log("Thông tin sân đã được lưu thay đổi:", response.data);
                mutate(`http://localhost:8080/rest/sportfields/lists/${user.username}`);
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi lưu thay đổi thông tin sân:", error.response ? error.response.data : error.message);
            });

    }
    const [loading, setLoading] = useState(false);

    // Lưu thông tin sân thể thao và gửi ảnh lên server
    const handleSave = () => {
        setLoading(true);
        if (!checkForm()) return;
        const sportFieldData = {
            name: fieldName,
            opening: `${openTime}h`,
            closing: `${closeTime}h`,
            categoriesField: selectedFieldType,
            address: address,
            decription: description,
            status: status,
            owner: user?.username
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

        axios.post("http://localhost:8080/rest/sportfield/create", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log("Thông tin sân đã được lưu:", response.data);
                mutate(`http://localhost:8080/rest/sportfields/lists/${user.username}`);
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi lưu thông tin sân:", error.response ? error.response.data : error.message);
            });
    };

    const handleDeleteGallery = async (
        gallerySportFieldId: number
    ) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

        if (!confirmed) {
            return; // Nếu người dùng không xác nhận, thoát khỏi hàm
        }
        try {
            await axios.delete(
                `http://localhost:8080/rest/gallerySportField/delete/${gallerySportFieldId}`
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
        <Modal show={showSportFieldModal} onHide={handleClose} size="xl" centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedSportField ? 'Sửa Khu Vực' : 'Thêm Khu Vực'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col className="col-8">
                        <FloatingLabel controlId="floatingFieldName" label="Tên sân" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Tên sân"
                                value={fieldName}
                                onChange={(e) => setFieldName(e.target.value)}
                            />
                        </FloatingLabel>
                        <Row>
                            <Col className="col-6">
                                <FloatingLabel controlId="floatingOpenTime" label="Giờ mở cửa (0-24h)" className="mb-3">
                                    <Form.Control
                                        type="number"
                                        placeholder="Giờ mở cửa"
                                        value={openTime ?? ''}
                                        min={0} // Giới hạn giá trị tối thiểu
                                        max={24} // Giới hạn giá trị tối đa
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setOpenTime(value);
                                        }}
                                        onBlur={() => {
                                            if (openTime < 0 || openTime > 24) {
                                                alert("Giờ mở cửa phải nằm trong khoảng từ 0 đến 24!");
                                                setOpenTime(null);
                                            }
                                        }}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col className="col-6">
                                <FloatingLabel controlId="floatingCloseTime" label="Giờ đóng cửa (0-24h)" className="mb-3">
                                    <Form.Control
                                        type="number"
                                        placeholder="Giờ đóng cửa"
                                        value={closeTime ?? ''}
                                        min={0} // Giới hạn giá trị tối thiểu
                                        max={24} // Giới hạn giá trị tối đa
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setCloseTime(value);
                                        }}
                                        onBlur={() => {
                                            if (closeTime < 0 || closeTime > 24) {
                                                alert("Giờ đóng cửa phải nằm trong khoảng từ 0 đến 24!");
                                                setCloseTime(null); // Hoặc có thể không làm gì nếu không muốn reset
                                            }
                                        }}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-6">
                                <FloatingLabel controlId="floatingFieldType" label="Loại sân" className="mb-3">
                                    <Form.Select
                                        aria-label="Loại sân"
                                        value={selectedFieldType}
                                        onChange={(e) => setSelectedFieldType(e.target.value)} // Đảm bảo lưu ID
                                    >
                                        <option value="">Chọn loại sân</option>
                                        {fieldTypes.length > 0 ? (
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
                                <FloatingLabel controlId="floatingStatus" label="Trạng thái" className="mb-3">
                                    <Form.Select
                                        aria-label="Trạng thái"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">Chọn trạng thái</option>
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Tạm đóng">Tạm đóng</option>
                                        <option value="Sửa chữa">Sửa chữa</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <FloatingLabel controlId="floatingAddress" label="Địa chỉ" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Địa chỉ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingDescription" label="Mô tả" className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="Mô tả"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        {/* Phần 1: Avatar */}
                        <h5>Ảnh đại diện</h5>
                        <img src={avatar instanceof File ? URL.createObjectURL(avatar) : avatar} alt="Sport field avatar" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                        <Form.Group controlId="avatarInput" className="mt-2">
                            <Form.Label>{selectedSportField ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} className="d-none" />
                            <Button variant="outline-primary" size="sm" onClick={() => document.getElementById("avatarInput").click()}>
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
                                                onClick={(event) => {
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
                            <Button variant="outline-primary" size="sm" onClick={() => document.getElementById("galleryInput").click()}>
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
                                                onClick={(event) => {
                                                    // event.stopPropagation(); // Ngăn sự kiện chọn màu chạy
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="success" onClick={selectedSportField ? handleUpdate : handleSave} disabled={loading}>
                    {selectedSportField ? 'Lưu Thay Đổi' : 'Thêm Khu Vực'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCreateSportField;
