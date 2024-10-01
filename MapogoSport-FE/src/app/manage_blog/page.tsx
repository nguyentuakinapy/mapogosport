'use client'
import React, { useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Table, Button, Modal, Form, Row, Col, FormCheck } from 'react-bootstrap';

const BlogManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'sửa' hoặc 'tạo'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedBlogs, setSelectedBlogs] = useState([]); // Danh sách các blog đã chọn
  const [selectAll, setSelectAll] = useState(false); // Trạng thái của checkbox "Chọn tất cả"
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      author: "John Doe",
      imagePost: "post-1.jpg",
      title: "Cơ Bản về React",
      content: "Đây là một bài viết về cơ bản của React.",
      createdAt: "2023-09-29",
      updatedAt: "2023-09-30",
      status: "Đã xuất bản",
    },
    {
      id: 2,
      author: "Jane Smith",
      imagePost: "post-1.jpg",
      title: "JavaScript Nâng Cao",
      content: "Một hướng dẫn chi tiết về JavaScript.",
      createdAt: "2023-09-25",
      updatedAt: "2023-09-28",
      status: "Bản nháp",
    }
  ]);

  // Hàm chọn tất cả các blog
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBlogs([]); // Nếu đang chọn tất cả, bỏ chọn
    } else {
      setSelectedBlogs(blogPosts.map((post) => post.id)); // Nếu chưa chọn tất cả, chọn tất cả
    }
    setSelectAll(!selectAll);
  };

  // Hàm chọn từng blog
  const handleSelectBlog = (id) => {
    if (selectedBlogs.includes(id)) {
      setSelectedBlogs(selectedBlogs.filter((blogId) => blogId !== id)); // Bỏ chọn blog
    } else {
      setSelectedBlogs([...selectedBlogs, id]); // Chọn blog
    }
  };

  const handleEditClick = (blog) => {
    setModalType('edit');
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setModalType('create');
    setSelectedBlog(null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
    setShowModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedBlog = {
      id: selectedBlog?.id || blogPosts.length + 1,
      author: formData.get("author"),
      title: formData.get("title"),
      content: formData.get("content"),
      createdAt: selectedBlog ? selectedBlog.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: formData.get("status"),
    };
    if (modalType === 'edit') {
      setBlogPosts(
        blogPosts.map(post => (post.id === selectedBlog.id ? updatedBlog : post))
      );
    } else {
      setBlogPosts([...blogPosts, updatedBlog]);
    }
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        {/* Bảng cho các bài viết blog */}
        <h4 className="text-center mb-4">QUẢN LÝ BLOG</h4>
        <Button variant="success" className="mb-4" onClick={handleCreateClick}>
          <i className="bi bi-plus-square-fill"><span className='mx-1'> Tạo mới</span></i>
        </Button>
        <Button
          variant="danger"
          className="mb-4 mx-2 "
          disabled={selectedBlogs.length === 0}
          onClick={() => {
            setBlogPosts(blogPosts.filter(post => !selectedBlogs.includes(post.id)));
            setSelectedBlogs([]);
            setSelectAll(false);
          }}
        >
          <i className="bi bi-trash-fill"></i> Xóa đã chọn
        </Button>
        <Table bordered hover>
          <thead className="text-center">
            <tr>
              <th>
                <FormCheck
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>STT</th>
              <th>Hình ảnh</th>
              <th>Thông tin bài viết</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post, index) => (
              <tr key={post.id}>
                {/* Checkbox chọn blog */}
                <td className="text-center align-middle ">
                  <FormCheck
                    type="checkbox"
                    checked={selectedBlogs.includes(post.id)}
                    onChange={() => handleSelectBlog(post.id)}
                  />
                </td>

                {/* STT */}
                <td className="text-center align-middle">{index + 1}</td>

                {/* Hình ảnh */}
                <td className="text-center align-middle">
                  <img
                    src={`/chat_page/assets/images/posts/${post.imagePost}`}
                    alt="Hình ảnh bài viết"
                    style={{ width: '150px', height: 'auto' }}
                  />
                </td>

                {/* Chi tiết bài viết */}
                <td className="text-start align-middle">
                  {/* Tiêu đề */}
                  <div>
                    <strong>Tiêu đề:</strong> <span>{post.title}</span>
                  </div>

                  {/* Tác giả */}
                  <div>
                    <strong>Tác giả:</strong> <span>{post.author}</span>
                  </div>

                  {/* Nội dung */}
                  <div>
                    <strong>Nội dung:</strong> <span>{post.content}</span>
                  </div>

                  {/* Ngày tạo */}
                  <div>
                    <strong>Ngày tạo:</strong> <span>{post.createdAt}</span>
                  </div>

                  {/* Ngày cập nhật */}
                  <div>
                    <strong>Ngày cập nhật:</strong> <span>{post.updatedAt}</span>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <strong>Trạng thái:</strong> <span>{post.status}</span>
                  </div>
                </td>

                {/* Nút hành động */}
                <td className="text-center align-middle">
                  {/* Nút sửa */}
                  <Button variant="warning" className="m-2" onClick={() => handleEditClick(post)}>
                    <i className="bi bi-pencil-fill"></i> Sửa
                  </Button>

                  {/* Nút xóa */}
                  <Button variant="danger" onClick={() => handleDelete(post.id)}>
                    <i className="bi bi-trash3-fill"></i> Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal cho Tạo/Sửa Blog */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered className='modal-xl'>
          <Modal.Header closeButton>
            <Modal.Title>{modalType === 'edit' ? 'Sửa Blog' : 'Tạo Mới Blog'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleFormSubmit}>
            <Modal.Body>
              <Row>
                {/* Form bên trái */}
                <Col md={6}>
                  <Form.Group controlId="author">
                    <Form.Label>Người viết</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      defaultValue={selectedBlog?.author || ''}
                      placeholder="Nhập tên người viết"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="title" className="mt-3">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      defaultValue={selectedBlog?.title || ''}
                      placeholder="Nhập tiêu đề"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="content" className="mt-3">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="content"
                      rows={10}
                      defaultValue={selectedBlog?.content || ''}
                      placeholder="Nhập nội dung"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Form bên phải */}
                <Col md={6}>
                  <Form.Group controlId="status">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Control
                      type="text"
                      name="status"
                      defaultValue={selectedBlog?.status || ''}
                      placeholder="Nhập trạng thái"
                      required
                    />
                  </Form.Group>

                  {/* Các trường bổ sung cho hình ảnh và ngày tháng */}
                  <Form.Group controlId="imagePost" className="mt-3">
                    <Form.Label>Ảnh</Form.Label>
                    <Form.Control
                      type="file"
                      name="imagePost"
                      onChange={(e) => handleImageUpload(e)} // Thêm logic tải hình ảnh ở đây
                    />
                    {selectedBlog?.imagePost && (
                      <img
                        src={`/chat_page/assets/images/posts/${selectedBlog.imagePost}`}
                        alt="Hình ảnh Blog"
                        style={{ width: '100px', marginTop: '10px' }}
                      />
                    )}
                  </Form.Group>

                  {/* Ngày tạo */}
                  <Form.Group controlId="createdAt" className="mt-3">
                    <Form.Label>Ngày tạo</Form.Label>
                    <Form.Control
                      type="date"
                      name="createdAt"
                      defaultValue={selectedBlog?.createdAt || ''}
                      required
                    />
                  </Form.Group>

                  {/* Ngày cập nhật (chỉ đọc, tự động xử lý khi bài viết được sửa) */}
                  <Form.Group controlId="updatedAt" className="mt-3">
                    <Form.Label>Ngày cập nhật</Form.Label>
                    <Form.Control
                      type="text"
                      name="updatedAt"
                      value={selectedBlog?.updatedAt || new Date().toISOString().split("T")[0]}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              {modalType === 'edit' && (
                <Button variant="danger" onClick={() => handleDelete(selectedBlog.id)}>
                  Xóa
                </Button>
              )}
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {modalType === 'edit' ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
