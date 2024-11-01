import { Button, Col, Form, Modal, Row, Image } from "react-bootstrap";
import "../admin.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";


interface CategoryField{
    categoriesFieldId?: number
    name: string
    image: string
}

interface CategoryFieldProps {
    showAddCategory: boolean;
    setShowAddCategory: (v: boolean) => void;
    currentCategory: CategoryField | null; // Updated to use the new CategoryProduct interface
    modalType: "add" | "edit";
    onSave: (newCategory: CategoryField) => void; // Callback to refresh data
}

const CategoryFieldAddNew = ({
    showAddCategory,
    setShowAddCategory,
    currentCategory,
    modalType,
    onSave,
}: CategoryFieldProps) => {

    const [formValues, setFormValues] = useState<CategoryField>({
        name: "",
        image: "",
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview selected image

    useEffect(() => {
        if (modalType === "edit" && currentCategory) {
            setFormValues({
                name: currentCategory.name,
                image: currentCategory.image || "", // Display existing image from category
            });
            setPreviewImage(currentCategory.image || null); // Set preview to current image
        } else {
            setFormValues({
                name: "",
                image: "",
            });
            setPreviewImage(null); // Reset preview for new category
        }
    }, [modalType, currentCategory]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleClose = () => {
        setShowAddCategory(false);
        setFormValues({
            name: "",
            image: "",
        });
        setPreviewImage(null); // Reset preview for new category
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreviewImage(URL.createObjectURL(file)); // Create URL for preview
            setFormValues((prevFormValues) => ({
                ...prevFormValues,
                image: file, // Store the file object
            }));
        } else {
            setFormValues((prevFormValues) => ({
                ...prevFormValues,
                image: '', // Reset image if no file is selected
            }));
            setPreviewImage(null); // Clear preview image
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            // If editing, retain the existing image unless a new one is selected
            let imageUrl = currentCategory?.image;

            const file = formValues.image; // This is the File object
            if (file instanceof File) {
                const fileName = `${file.name.replace(/\s+/g, "_")}`;
                imageUrl = fileName; // Use the new file name for the image
                formData.append("fileImage", file); // Append the file to FormData
            }

            // Create category data object
            const categoryData = {
                name: formValues.name,
                image: imageUrl,
            };

            formData.append("category", JSON.stringify(categoryData)); // Append JSON data to FormData
            if (file) {
                formData.append("fileImage", file);
            }
            // Check if image is required for adding
            if (!formData.has("fileImage") && modalType === "add") {
                throw new Error("Hình ảnh không được chọn");
            }

            // Send data to backend
            const apiUrl = `http://localhost:8080/rest/${modalType === "add" ? "create/category_field" : `update/category_field/${currentCategory?.categoriesFieldId}`}`;
            const response = await fetch(apiUrl, {
                method: modalType === "add" ? 'POST' : 'PUT',
                body: formData, // FormData already sets content type
            });

            if (response.ok) {
                const newCategory = await response.json();
                onSave(newCategory); // Call the onSave callback
                toast.success(modalType === "add" ? "Thêm loại sân thành công" : "Loại sân đã được cập nhật");
            } else {
                throw new Error("Lỗi từ server");
            }
        } catch (error) {
            toast.error(`Lỗi khi lưu loại sân: ${error.message}`);
        }

        handleClose(); // Close modal after saving
    };

    return (
        <Modal
            show={showAddCategory}
            onHide={handleClose}
            centered
            backdrop="static"
            keyboard={true}
            size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title className="text-uppercase text-danger">
                    {modalType === "add" ? "Thêm loại sân" : "Chỉnh sửa loại sân"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row>
                        <Col xs={8}>
                            <Form.Group className="mb-3">
                                <Form.Floating>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên"
                                        name="name"
                                        value={formValues.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Label htmlFor="name">
                                        Tên loại sân <b className="text-danger">*</b>
                                    </Form.Label>
                                </Form.Floating>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="image" className="text-danger">
                                    Chọn hình ảnh
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/png, image/jpeg, image/jpg"
                                />
                                {previewImage && (
                                    <div className="preview-image" style={{ marginTop: "10px", display: "flex" }}>
                                        <Image
                                            src={previewImage}
                                            alt="Xem trước"
                                            fluid
                                            style={{
                                                objectFit: "cover",
                                                maxHeight: "70px",
                                                maxWidth: "100px",
                                                borderRadius: "5px",
                                            }}
                                        />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            {/* Display existing image if editing */}
                            {modalType === "edit" && formValues.image && (
                                <Image
                                    src={formValues.image} // Assuming this is the image URL
                                    alt={formValues.image}
                                    fluid
                                    style={{ objectFit: "cover", maxHeight: "300px" }}
                                />
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={handleSave}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryFieldAddNew;