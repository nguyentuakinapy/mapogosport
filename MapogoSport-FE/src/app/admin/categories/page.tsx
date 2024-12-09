'use client';
import Link from 'next/link';
import { Form, Button, Table, Image, Nav, Pagination } from "react-bootstrap";
import '../adminStyle.scss';
import { useState, useEffect, useMemo, Suspense } from "react";
import CategoryAddNew from "@/components/Admin/Modal/categoryProduct.addNew";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { RobotoBase64 } from '../../../../public/font/Roboto-Regular';
import { toast } from "react-toastify";
import CategoryFieldAddNew from '@/components/Admin/Modal/categoryField.addNew';
import autoTable from 'jspdf-autotable';
import useSWR from 'swr';

const AdminProduct = () => {
    // const BASE_URL = 'http://localhost:8080/rest/';
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentCategoryProduct, setCurrentCategoryProduct] = useState<CategoryProduct | null>(null); // Updated type to allow null
    const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([]);
    const [categoryField, setCategoryField] = useState<CategoryField[]>([]);
    const [currentCategoryField, setCurrentCategoryField] = useState<CategoryField | null>(null); // Updated type to allow null
    const [activeTab, setActiveTab] = useState<string>('categoriesProduct');
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const { data: cateProductData, mutate: mutateProduct } = useSWR(`${BASE_URL}rest/category_product/category-products`, fetcher);
    const { data: cateFieldData, mutate: mutateField } = useSWR(`${BASE_URL}rest/category_field`, fetcher);

    useEffect(() => {
        if (cateProductData && cateFieldData) {
            setCategoryProducts(cateProductData);
            setCategoryField(cateFieldData);
        }
    }, [cateProductData, cateFieldData]);

    const handleCreateClick = () => {
        setCurrentCategoryProduct(null);
        setCurrentCategoryField(null);
        setShowModal(true);
    };

    const handleDeleteProduct = async (id: number) => {
        if (typeof window !== 'undefined') {
            if (window.confirm('Bạn có chắc muốn xóa loại sản phẩm này?')) {
               try {
                await fetch(`${BASE_URL}rest/category_product/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    }
                }).then((res) => {
                    if (!res.ok) {
                        toast.error('Xóa sản phẩm thất bại');
                        return;
                    }
                    toast.success('Sản phẩm đã được xóa thành công');
                    mutateProduct();
                });
               } catch (error) {
                console.error("Error deleting category product: ", error)
                toast.error("Không được xóa loại sản phẩm này")
               }
                
            }
        }
    };

    const handleDeleteField = async (id: number) => {
        if (typeof window !== 'undefined') {
            if (window.confirm('Bạn có chắc muốn xóa loại sân này?')) {
                try {
                    await fetch(`${BASE_URL}rest/category_field/delete/category_field/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                        }
                    }).then((res) => {
                        if (!res.ok) {
                            toast.error('Xóa loại sân thất bại!');
                            return;
                        }
                        toast.success('Loại sân đã được xóa thành công');
                        mutateField();
                    })
                } catch (error) {
                    console.log("Error deleting field: ", error)
                    toast.error("Không được phép xóa loại sân.")
                }
                
            }
        }
    };

    const filteredCategoryProducts = useMemo(() =>
        categoryProducts.filter(product => product.name.toLowerCase().includes(searchTerm)),
        [categoryProducts, searchTerm]
    );

    const filteredCategoryField = useMemo(() =>
        categoryField.filter(field => field.name.toLowerCase().includes(searchTerm)),
        [categoryField, searchTerm]
    );

    const renderContentProduct = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredCategoryProducts.slice(indexOfFirstItem, indexOfLastItem);
        return renderTableProduct(currentItems);
    };

    const renderContentField = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredCategoryField.slice(indexOfFirstItem, indexOfLastItem);
        return renderTableField(currentItems);
    };

    const exportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Loại sản phẩm');

            worksheet.columns = [
                { header: 'Số thứ tự', key: 'stt', width: 15 },
                { header: 'Tên hình ảnh', key: 'nameImage', width: 25 },
                { header: 'ID loại sản phẩm', key: 'id', width: 15 },
                { header: 'Tên loại sản phẩm', key: 'name', width: 20 },
            ];
            if (activeTab === 'categoriesField') {
                worksheet.columns = [
                    { header: 'Số thứ tự', key: 'stt', width: 15 },
                    { header: 'Tên hình ảnh', key: 'nameImage', width: 25 },
                    { header: 'ID loại sân', key: 'id', width: 15 },
                    { header: 'Tên loại sân', key: 'name', width: 20 },
                ];

                filteredCategoryField.forEach((field, index) => {
                    worksheet.addRow({
                        stt: `#${index + 1}`,
                        nameImage: field.image,
                        id: field.categoriesFieldId,
                        name: field.name,
                    });
                });
            } else {
                worksheet.columns = [
                    { header: 'Số thứ tự', key: 'stt', width: 15 },
                    { header: 'Tên hình ảnh', key: 'nameImage', width: 25 },
                    { header: 'ID loại sản phẩm', key: 'id', width: 15 },
                    { header: 'Tên loại sản phẩm', key: 'name', width: 20 },
                ];

                filteredCategoryProducts.forEach((product, index) => {
                    worksheet.addRow({
                        stt: `#${index + 1}`,
                        nameImage: product.image,
                        id: product.categoryProductId,
                        name: product.name,
                    });
                });
            }

            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day;

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `QuanLyLoai(${formattedDay}/${formattedMonth}).xlsx`);
            toast.success('Đã xuất file Excel thành công!');
        } catch (error) {
            toast.error('Xuất file Excel không thành công! Vui lòng thử lại sau!');
        }
    };

    const exportPDF = () => {
        try {
            const doc: jsPDF = new jsPDF();

            doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");

            doc.text("Danh Sách Quản Lý Loại", 14, 16);
            if (activeTab === 'categoriesField') {
                const tableColumn = ["Số thứ tự", "Tên hình ảnh", "ID loại sân", "Tên loại sân"];
                const tableRows: string[][] = [];

                filteredCategoryField.forEach((categories, index) => {
                    const categoryData = [
                        `#${index + 1}`,
                        categories.image,
                        categories.categoriesFieldId.toString(),
                        categories.name
                    ];
                    tableRows.push(categoryData);
                    autoTable(doc, {
                        head: [tableColumn],
                        body: tableRows,
                        startY: 20,
                        theme: 'grid',
                        styles: {
                            font: 'Roboto',
                            fontSize: 10,
                            cellPadding: 2,
                            valign: 'middle',
                        },
                        columnStyles: {
                            0: { halign: 'left', cellWidth: 30 },
                            1: { halign: 'left' },
                            2: { halign: 'center' },
                            3: { halign: 'right', cellWidth: 30 },
                            4: { halign: 'left' },
                        },
                        didParseCell: (data) => {
                            if (data.cell.text.length > 0) {
                                data.cell.text[0] = data.cell.text[0];
                            }
                        }
                    })
                })
            } else {
                const tableColumn = ["Số thứ tự", "Tên hình ảnh", "ID loại sản phẩm", "Tên loại sản phẩm"];
                const tableRows: string[][] = [];

                filteredCategoryProducts.forEach((product, index) => {
                    const categoryProductData = [
                        `#${index + 1}`,
                        product.image,
                        product.categoryProductId.toString(),
                        product.name
                    ];
                    tableRows.push(categoryProductData);
                });
                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 20,
                    theme: 'grid',
                    styles: {
                        font: 'Roboto',
                        fontSize: 10,
                        cellPadding: 2,
                        valign: 'middle',
                    },
                    columnStyles: {
                        0: { halign: 'left' },
                        1: { halign: 'left' },
                        2: { halign: 'center' },
                        3: { halign: 'right', cellWidth: 30 },
                        4: { halign: 'left' },
                    },
                    didParseCell: (data) => {
                        if (data.cell.text.length > 0) {
                            data.cell.text[0] = data.cell.text[0];
                        }
                    }
                });
            }
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day;

            doc.save(`QuanLyLoai-Mapogo(${formattedDay}/${formattedMonth}).pdf`);
            toast.success("Đã xuất file PDF thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình xuất file! Vui lòng thử lại sau!");
        }
    };

    const renderTableProduct = (filteredCategoryProducts: CategoryProduct[]) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return (
            <div className="box-table-border mb-4">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>STT</th>
                            <th style={{ width: '300px' }}>Hình ảnh</th>
                            <th style={{ width: '300px' }}>Thông tin sản phẩm</th>
                            <th style={{ width: '200px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategoryProducts.map((category, index) => (
                            <tr id={`category-${category.categoryProductId}`} key={category.categoryProductId}>
                                <td className="text-center align-middle">{indexOfFirstItem + index + 1}</td>
                                <td className="text-center align-middle">
                                    <Link href="#">
                                        <Image src={`${category.image}`} style={{ width: '150px', height: 'auto' }}
                                            className="mx-2" alt={category.image} />
                                    </Link>
                                </td>
                                <td className="text-start align-middle">
                                    <div className='text-center'>
                                        <strong className="text-dark">{category.name}</strong>
                                    </div>
                                </td>
                                <td className="text-center align-middle">
                                    <Button variant="warning" className="mx-1" onClick={() => {
                                        setCurrentCategoryProduct(category);
                                        setShowModal(true);
                                    }}> <i className="bi bi-pencil-fill"></i></Button>
                                    <Button variant="danger" className="mx-1" onClick={() => handleDeleteProduct(category.categoryProductId)}>
                                        <i className="bi bi-trash3-fill"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <CategoryAddNew showAddCategory={showModal} setShowAddCategory={setShowModal} currentCategory={currentCategoryProduct} />
            </div>
        );
    }

    const renderTableField = (filteredCategoryField: CategoryField[]) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return (
            <div className="box-table-border mb-4 text-center">
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>STT</th>
                            <th style={{ width: '300px' }}>Hình ảnh</th>
                            <th style={{ width: '300px' }}>Thông tin sản phẩm</th>
                            <th style={{ width: '200px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategoryField.map((category, index) => (
                            <tr id={`category-${category.categoriesFieldId}`} key={category.categoriesFieldId}>
                                <td className="text-center align-middle">{indexOfFirstItem + index + 1}</td>
                                <td className="text-center align-middle">
                                    <Link href="#">
                                        <Image src={`${category.image}`} style={{ width: '150px', height: 'auto' }}
                                            className="mx-2" alt={category.image} />
                                    </Link>
                                </td>
                                <td className="text-start align-middle">
                                    <div className='text-center'>
                                        <strong className="text-dark">{category.name}</strong>
                                    </div>
                                </td>
                                <td className="text-center align-middle">
                                    <Button variant="warning" className="mx-1" onClick={() => {
                                        setCurrentCategoryField(category);
                                        setShowModal(true);
                                    }}><i className="bi bi-pencil-fill"></i></Button>
                                    <Button variant="danger" className="mx-1" onClick={() => handleDeleteField(category.categoriesFieldId)}>
                                        <i className="bi bi-trash3-fill"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
                <CategoryFieldAddNew showAddCategory={showModal} setShowAddCategory={setShowModal} currentCategory={currentCategoryField} />
            </div>
        );
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredCategoryProducts.length / itemsPerPage);
        const pages = [];

        if (totalPages <= 1) return null;

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
            );
        }

        return (
            <Pagination>
                <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };
    if (typeof window !== 'undefined') {
        return (
            <Suspense fallback={<div>Đang tải...</div>}>
                <div style={{ fontSize: '14px' }}>
                    <div className="box-ultil">
                        <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Loại</b>
                        <div>
                            <Form.Control type="text" placeholder="Tìm theo tên loại..." onChange={handleSearch} />
                        </div>
                        <div>
                            <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={handleCreateClick}>
                                <i className="bi bi-plus-square-fill"></i><span className='mx-1'>Tạo mới</span>
                            </Button>
                            <Button className="btn-sd-admin mx-2" style={{ fontSize: '15px' }} onClick={exportPDF}>
                                <i className="bi bi-file-earmark-pdf"></i><span className='mx-1'>Export PDF</span>

                            </Button>
                            <Button className="btn-sd-admin" style={{ fontSize: '15px' }} onClick={exportExcel}>
                                <i className="bi bi-file-earmark-excel"></i><span className='mx-1'>Export Excel</span>

                            </Button>
                        </div>
                    </div>
                    <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs my-3">
                        <Nav.Item>
                            <Nav.Link eventKey="categoriesProduct" className="tab-link">Loại sản phẩm</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="categoriesField" className="tab-link">Loại sân</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="mt-3">
                        {activeTab === "categoriesField" ? renderContentField() : renderContentProduct()}
                        {renderPagination()}
                    </div>
                </div>
            </Suspense>
        );
    }
}

export default AdminProduct;
