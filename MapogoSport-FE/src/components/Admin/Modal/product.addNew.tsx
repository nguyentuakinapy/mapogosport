"use client"; // chưa phân trang
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Modal,
  Nav,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR from "swr";
import "../admin.scss";
import ModalProductAddNewSize from "./product.addNewSize";

interface UserProps {
  showAddProduct: boolean;
  setShowAddProduct: (v: boolean) => void;
  currentProduct?: Product;
  modalType: "add" | "edit";
  categoryProducts: CategoryProduct[];
  // onAddProduct: (product: Product) => void;
  onFetch: any;
  setIsNeedScroll: Dispatch<SetStateAction<boolean>>;
}
const BASE_URL = "http://localhost:8080";

let ProductWasCreated: number;
let canProceed = false;

const ProductAddNew = ({
  showAddProduct,
  setShowAddProduct,
  currentProduct,
  modalType,
  categoryProducts,
  onFetch,
  setIsNeedScroll,
}: UserProps) => {
  const [value, setValue] = useState("");
  const option = [
    { label: "Hết hàng", value: "Hết hàng" },
    { label: "Còn hàng", value: "Còn hàng" },
  ];

  const optionColor = [
    { label: "Xanh", value: "Xanh", style: "green" },
    { label: "Đỏ", value: "Đỏ", style: "red" },
    { label: "Vàng", value: "Vàng", style: "yellow" },
    { label: "Cam", value: "Cam", style: "orange" },
    { label: "Tím", value: "Tím", style: "purple" },
    { label: "Hồng", value: "Hồng", style: "pink" },
    { label: "Đen", value: "Đen", style: "black" },
    { label: "Trắng", value: "Trắng", style: "white" },
    { label: "Xanh biển", value: "Xanh bi?n", style: "blue" },
    { label: "Nâu", value: "Nâu", style: "brown" },
    { label: "Xám", value: "Xám", style: "gray" },
  ];

  // >>>>>>>>>>>>>>>
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const [productDetailWasCreated, setProductDetailWasCreated] = useState<
    number | null
  >(null);

  // State để quản lý productDetailId được mở
  const [openProductDetailId, setOpenProductDetailId] = useState<number | null>(
    null
  ); // lấy ID của sản phẩm hiện tại
  // const [showDetailModal, setShowDetailModal] = useState(false);    // quản lý modal -- hiện chưa dùng
  const [selectedProductDetail, setSelectedProductDetail] =
    // useState<ProductDetail[]>([]); // lấy sản phẩm chi tiết chi tiết theo ID product
    useState<ProductDetail>([]); // lấy sản phẩm chi tiết chi tiết theo ID product

  const [selectedProductDetailSize, setSelectedProductDetailSize] = useState<
    ProductDetailSize[]
  >([]); // lấy sản phẩm chi tiết chi tiết theo ID product

  // Fetch ProductDetail dựa vào productId

  // Chỉ fetch dữ liệu khi currentProduct?.productId có giá trị
  const {
    data: productDetails,
    error: errorProductDetails,
    mutate: mutateProductDetails,
    isLoading: productDetailsLoading,
  } = useSWR<ProductDetail[]>(
    currentProduct?.productId
      ? `${BASE_URL}/rest/product-detail/${currentProduct?.productId}`
      : null,
    fetcher
  );
  useEffect(() => {
    console.log("productDetails", productDetails);
  }, [productDetails]);

  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    const fetchData_productDetailGalleryRes = async () => {
      try {
        const productDetailGalleryRes = await axios.get(
          `http://localhost:8080/rest/gallery/${selectedProductDetail.productDetailId}`
        );
        // Lưu dữ liệu vào state
        setGalleries(productDetailGalleryRes.data); // Dữ liệu từ API
        console.log("galleries ", productDetailGalleryRes.data); // Log dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedProductDetail.productDetailId) {
      fetchData_productDetailGalleryRes();
    }
  }, [selectedProductDetail.productDetailId]); // Chỉ chạy khi productDetailId thay đổi

  const [modalTypeProductDetail, setModalTypeProductDetail] = useState<
    "add" | "edit"
  >("add"); // 'add' hoặc 'edit'

  const [currentProductDetailSize, setCurrentProductDetailSize] =
    useState<ProductDetailSize | null>(null);

  const [isShowAddNewSize, setIsShowAddNewSize] = useState<boolean>(false);

  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [isShowAddColor, setIsShowAddColor] = useState<boolean>(false);

  // >>>> hàm lấy product Id
  const [prodcutDetail_Id, setProdcutDetail_Id] = useState<number | null>(null);

  // Hàm thêm màu sắc
  const [newColor, setNewColor] = useState<string>("");

  // fech data product
  const mutationAddProdcut = useMutation({
    mutationFn: (putData: any) => {
      console.log("=======putData", putData);

      return axios.post(
        `http://localhost:8080/rest/products/admin/create`,
        putData.formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
  });
  // fetch data category
  const mutation = useMutation({
    mutationFn: (putData: any) => {
      console.log("=======putData", putData);

      return axios.put(
        `http://localhost:8080/rest/products/admin/${putData.id}`,
        putData.formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
  });
  // fetch data category
  const mutationAddProductDetail = useMutation({
    mutationFn: (putData: any) => {
      return axios.post(
        `http://localhost:8080/rest/product-detail/create/${putData.id}`, // id product
        putData.formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
  });

  const handleOpenModalAddColor = (selectedProductDetail_color: string) => {
    if (newColor) {
      // Cập nhật màu sắc hiện tại
      selectedProductDetail_color = newColor; // Cập nhật màu sắc hiện tại
    }
    setIsShowAddColor(true); // Đóng modal
  };

  const handleSelectedColor = (detailDemo) => {
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      "name",
      "brand",
      "status",
      "country",
      "price",
      "description",
    ];
    const isFormValid = validateFormFields(formValues, requiredFields);

    if (!isFormValid) {
      return; // Dừng hàm nếu có trường chưa nhập
    }

    setProdcutDetail_Id(detailDemo);
    console.log("product detail Id: ", detailDemo.productDetailId);
    console.log("product detail: ", detailDemo);

    setSelectedProductDetail(detailDemo);
    // setActiveTab("add-details");
  };

  const handleSelectedColorCombobox = (color) => {
    const selectedDetail = productDetails.find(
      (detail) => detail.color === color
    );
    setSelectedProductDetail(selectedDetail);
  };

  const [formValues, setFormValues] = useState<Product>({
    name: "",
    categoryProduct: {
      categoryProductId: 1,
      name: "",
    },
    description: "",
    price: 0,
    status: option[0].value,
    brand: "",
    country: "",
    image: "",
    stock: 0,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null); // Dùng để lưu đường dẫn ảnh xem trước

  const setFormValueNull = () => {
    setFormValues({
      name: "",
      categoryProduct: {
        categoryProductId: 1,
        name: "",
      },
      description: "",
      price: 0,
      status: option[0].value,
      brand: "",
      country: "",
      image: "",
      stock: 0,
    });
    setDisplayPrice("");
    setNewColor("");
    setPreviewImageProductColor(null);
    setPreviewImage(null);
    setSelectedGalleryFiles([]);
    setGalleries([]);
  };

  useEffect(() => {
    if (modalType === "edit" && currentProduct) {
      setFormValues({
        ...currentProduct,
        categoryProduct: {
          ...currentProduct.categoryProduct,
        },
        image: currentProduct.image || "", // Hiển thị ảnh hiện có từ sản phẩm
      });
    } else {
      // trường hợp này là thêm mới nên set form thành rỗng
      setFormValueNull();
    }
  }, [modalType, currentProduct, categoryProducts]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    console.log("selected Input change value: ", value);
  };

  const [displayPrice, setDisplayPrice] = useState<string>("");
  // Hàm xử lý thay đổi giá trị input
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
    const numericValue = Number(rawValue); // Chuyển giá trị thành số

    if (!isNaN(numericValue) && numericValue >= 0) {
      // Cập nhật giá trị số vào formValues
      setFormValues((prevValues) => ({
        ...prevValues,
        price: numericValue,
      }));

      // Cập nhật giá trị hiển thị dạng tiền tệ
      setDisplayPrice(
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(numericValue)
      );
    }
  };
  useEffect(() => {
    if (formValues.price !== 0) {
      setDisplayPrice(
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(formValues.price)
      );
    }
  }, [formValues.price]);

  const handleInputChangeNumber = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    // Check if the value is a valid non-negative number
    if (!isNaN(numericValue) && numericValue >= 0) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: numericValue,
      }));
    } else {
      toast.error("Vui lòng nhập một số không âm"); // Error message for negative or invalid input
    }
  };

  // Handle form input changes

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setValue(value);
    setFormValues((prevValues) => ({ ...prevValues, status: value }));

    console.log("selected value: ", value);
  };

  const handleSelectColor = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (value === "" || value === "Chọn màu sắc --") {
      toast.warning("Vui lòng chọn màu sắc"); // Hiển thị thông báo khi không chọn màu
    } else {
      console.log("Selected color value: ", value);
    }
    setNewColor(value);

    setSelectedProductDetail((prevValues) => ({ ...prevValues, color: value }));

    console.log("selected  color value: ", value);
  };

  const handleCategorySelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value; // Lấy ID của loại sản phẩm đã chọn
    const selectedCategory = categoryProducts.find(
      (cat) => cat.categoryProductId === Number(selectedId)
    );

    setFormValues((prevValues) => ({
      ...prevValues,
      categoryProduct: {
        categoryProductId: Number(selectedId), // Cập nhật ID của loại sản phẩm
        name: selectedCategory?.name || "", // Lấy tên từ loại sản phẩm đã chọn
        image: selectedCategory?.image || "", // Cung cấp thuộc tính image
      },
    }));
  };

  const [newColorImageProductColor, setNewColorImageProductColor] = useState<
    string | File
  >("");
  const [previewImageProductColor, setPreviewImageProductColor] = useState<
    string | null
  >(null); // Dùng để lưu đường dẫn ảnh xem trước

  // Định nghĩa hàm API để lấy gallery

  const handleClose = () => {
    setShowAddProduct(false);
    setSelectedProductDetail([]);
    setFormValueNull(); // onFetch();
    setActiveTab("edit"); // set sang atb edit
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (modalType === "add") {
      console.log("modal type add");

      // Chế độ thêm: chỉ hiển thị ảnh xem trước của tệp đã chọn
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreviewImage(URL.createObjectURL(file)); // Tạo URL xem trước
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          image: file, // Lưu đối tượng File
        }));
      } else {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          image: "", // Đặt hình ảnh thành rỗng nếu không có tệp được chọn
        }));
        setPreviewImage(null); // Xóa ảnh xem trước
      }
    } else if (modalType === "edit") {
      console.log("modal type edit");

      // Chế độ chỉnh sửa: giữ lại ảnh gốc trừ khi có tệp mới được chọn
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước của tệp mới
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          image: file, // Cập nhật formValues với tệp mới
        }));
      } else {
        setPreviewImage(null); // Không có ảnh xem trước, giữ lại ảnh gốc
      }
    }
  };
  const [imageProductDetail, setImageProductDetail] = useState<File | string>(
    ""
  );

  const handleImageChangeProductColor = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Chế độ thêm: chỉ hiển thị ảnh xem trước của tệp đã chọn
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewColorImageProductColor(file);
      console.log("file ", file);

      setPreviewImageProductColor(URL.createObjectURL(file)); // Tạo URL xem trước

      setImageProductDetail(file);
      // setPreviewNewColorImage(null); // Xóa ảnh xem trước
    }
  };
  // Hàm để kiểm tra các trường bắt buộc
  const [errorFields, setErrorFields] = useState({});

  const validateFormFields = (formValues, requiredFields) => {
    const missingFields = requiredFields.filter((field) => !formValues[field]);

    if (missingFields.length > 0) {
      if (!previewImage)
        toast.warning("Vui lòng chọn hình đại diện của sản phẩm.");

      // Hiển thị thông báo lỗi cho từng trường còn thiếu
      missingFields.forEach((field) => {
        if (field === "brand") {
          toast.warning(`Vui lòng nhập trường: thương hiệu`);
        } else if (field === "name") {
          toast.warning(`Vui lòng nhập trường: tên sản phẩm`);
        } else if (field === "status") {
          toast.warning(`Vui lòng nhập trường: trạng thái`);
        } else if (field === "country") {
          toast.warning(`Vui lòng nhập trường: quốc gia`);
        } else if (field === "price") {
          toast.warning(`Vui lòng nhập trường: giá`);
        } else if (field === "description") {
          toast.warning(`Vui lòng nhập trường: mô tả`);
        } else {
          toast.warning(`Vui lòng nhập trường: ${field}`);
        }
      });


      // Cập nhật trạng thái các trường lỗi
      const newErrorFields = {};
      missingFields.forEach((field) => {
        newErrorFields[field] = true;
      });
      setErrorFields(newErrorFields);

      // Focus vào trường đầu tiên gặp lỗi
      const firstMissingField = missingFields[0];
      document.getElementById(firstMissingField)?.focus();

      return false; // Trả về false nếu có trường còn thiếu
    }

    // Xóa lỗi nếu tất cả các trường đều hợp lệ
    setErrorFields({});
    return true;
  };

  const validateForm = () => {
    let isValid = true;

    if (!previewImageProductColor) {
      isValid = false;
      toast.warning("Vui lòng chọn hình đại diện của màu sản phẩm.");
    }

    // if (!selectedProductDetail.color) {
    if (!newColor) {
      isValid = false;
      toast.warning("Vui lòng chọn màu sắc.");
    }

    // Kiểm tra hình ảnh
    if (!selectedProductDetail.image && !previewImageProductColor) {
      isValid = false;
      toast.warning("Vui lòng chọn hình ảnh cho sản phẩm.");
    }

    // Kiểm tra gallery
    if (selectedGalleryFiles.length === 0) {
      isValid = false;
      toast.warning("Vui lòng chọn ít nhất một hình ảnh trong gallery.");
    }

    return isValid;
  };

  const handleSave = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      "name",
      "brand",
      "status",
      "country",
      "price",
      "description",
    ];
    const isFormValid = validateFormFields(formValues, requiredFields);

    if (!isFormValid) {
      return; // Dừng hàm nếu có trường chưa nhập
    }

    try {
      const formData = new FormData();

      // Giữ nguyên hình ảnh gốc nếu không có hình mới
      let imageUrl = currentProduct?.image;

      // Kiểm tra nếu có hình ảnh mới được chọn
      if (previewImage) {
        const file = formValues.image; // Đây là file đã được chọn

        if (file instanceof File) {
          const fileName = `${file.name.replace(/\s+/g, "_")}`;
          imageUrl = fileName; // Cập nhật tên file hình ảnh
          formData.append("fileimage", file); // Thêm file hình ảnh vào FormData
          console.log("image u: ", imageUrl);
          console.log("form value image: ", formValues.image);
        } else {
          console.error("file không phải là một đối tượng File:", file);
        }
      }

      // Tạo đối tượng product với các thuộc tính

      console.log("jjjjjjkl", formValues);

      const productData = {
        name: formValues.name,
        brand: formValues.brand,
        categoryProduct: {
          categoryProductId: formValues.categoryProduct.categoryProductId,
        },
        status: formValues.status,
        country: formValues.country,
        price: formValues.price,
        description: formValues.description,
        image: imageUrl,
        stock: formValues.stock,
      };

      // Thêm product vào FormData dưới dạng chuỗi JSON
      formData.append("product", JSON.stringify(productData));

      // trường hợp thêm dữ liệu Product mới chưa có Product detail
      if (modalType === "add") {
        if (!validateForm()) {
          // check luôn cả Product detail vì 2 cả hai cùng lúc
          return;
        }
        setIsNeedScroll(true);
        await mutationAddProdcut.mutateAsync(
          { formData: formData },
          {
            onError(error, variables) {
              console.log("variables========", variables);
              toast.error("Lỗi thêm sản phẩm");
            },
            onSuccess(data, variables) {
              console.log("variables======== add success", variables);
              console.log("variables======== add data", data);
              if (data) {
                // Lấy ID từ backend trả về thành công
                if (selectedProductDetail) {
                  ProductWasCreated = data.data;
                  console.log("new Id: ", ProductWasCreated);
                  toast.success("Thêm sản phẩm thành công");
                  handleAddNewProductDetail(ProductWasCreated);
                  // handleAddNewSize;
                  handleClose();
                }
              }

              onFetch();
            },
          }
        );
      } else if (modalType === "edit" && currentProduct) {
        // Trường hợp sản phẩm chưa có ProductDetail nào
        if (!productDetails || productDetails.length === 0) {
          // Chỉ cho phép nếu có đủ thông tin để tạo ProductDetail mới
          if (
            newColor !== "" &&
            selectedGalleryFiles.length > 0 &&
            previewImageProductColor !== null
          ) {
            canProceed = true; // Cho phép thêm ProductDetail mới nếu đủ thông tin
          }
        } else {
          // Nếu sản phẩm đã tồn tại ProductDetail
          if (!selectedProductDetail) {
            // Nếu `selectedProductDetail` là mảng rỗng, kiểm tra các điều kiện để thêm mới
            if (
              newColor !== "" &&
              selectedGalleryFiles.length > 0 &&
              previewImageProductColor !== null
            ) {
              canProceed = true; // Có đủ thông tin để thêm mới
            } else {
              canProceed = false; // Ngăn việc tạo mới khi thiếu thông tin
            }
          } else {
            // Trường hợp có `selectedProductDetail` cụ thể để cập nhật
            canProceed = true; // Cho phép cập nhật nếu đã chọn `ProductDetail`
          }
        }

        // Kiểm tra nếu không đủ điều kiện để tiếp tục, dừng xử lý và cảnh báo
        if (!canProceed) {
          toast.warning("Nhập ProductDetail đi, đang trống đấy");
          return;
        }

        await mutation.mutateAsync(
          { formData: formData, id: currentProduct.productId },
          {
            onError(error, variables) {
              console.log("Error updating product:", error);
              toast.error("Lỗi khi cập nhật sản phẩm");
            },
            onSuccess(data, variables) {
              console.log("Cập nhật sản phẩm thành công", variables);

              // Kiểm tra nếu `ProductDetail` trống và yêu cầu nhập thông tin ProductDetail
              if (!productDetails || productDetails.length === 0) {
                if (
                  newColor !== "" ||
                  selectedGalleryFiles.length > 0 ||
                  previewImageProductColor !== null
                ) {
                  // Thêm ProductDetail mới nếu có thay đổi màu sắc
                  handleAddNewProductDetail(currentProduct?.productId);
                } else {
                  toast.info(
                    "Vui lòng điền thông tin ProductDetail trước khi cập nhật Product."
                  );
                  toast.error(
                    "Không thể cập nhật sản phẩm vì thiếu ProductDetail."
                  );
                }
                return; // Ngừng xử lý cập nhật Product
              }

              // Nếu `ProductDetail` đã có đầy đủ, thực hiện cập nhật `ProductDetail` hoặc thêm mới nếu cần
              if (selectedProductDetail?.productDetailId) {
                console.log(
                  "Cập nhật chi tiết sản phẩm với selectedProductDetail"
                );
                handleUpdateProductDetail(
                  selectedProductDetail.productDetailId
                );
                // onFetch();
                mutateProductDetails();
              } else if (newColor !== "") {
                console.log("Thêm ProductDetail mới do có thay đổi màu sắc");
                handleAddNewProductDetail(currentProduct?.productId);
                onFetch();
              }

              // Đóng modal và cập nhật lại danh sách nếu tất cả thông tin đã hoàn tất
              if (productDetails.length > 0) {
                toast.success(
                  "Sản phẩm và chi tiết sản phẩm đã được cập nhật thành công"
                );
                onFetch(); // Làm mới dữ liệu sau khi cập nhật
              }
            },
          }
        );
      }
    } catch (error) {
      toast.error(`Lỗi khi lưu sản phẩm: ${error}`);
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
    onFetch();
    handleClose();
  };

  // // Fetch ProductDetailSize dựa vào productDetailId
  const {
    data: productDetailSizes,
    error: errorProductDetailSizes,
    mutate,
  } = useSWR<ProductDetailSize[]>(
    selectedProductDetail.productDetailId
      ? `${BASE_URL}/rest/product-detail-size/${selectedProductDetail.productDetailId}`
      : null,
    fetcher
  );

  // Đồng bộ dữ liệu với selectedProductDetailSize
  useEffect(() => {
    if (productDetailSizes) {
      setSelectedProductDetailSize(productDetailSizes);
    }
  }, [productDetailSizes]);

  const [isImageValid, setIsImageValid] = useState(true);

  useEffect(() => {
    if (formValues.image) {
      // Kiểm tra nếu ảnh có thể tải được
      fetch(formValues.image)
        .then((response) => {
          if (response.ok) {
            setIsImageValid(true); // Ảnh hợp lệ
          } else {
            setIsImageValid(false); // Ảnh không hợp lệ
          }
        })
        .catch(() => setIsImageValid(false)); // Nếu có lỗi khi tải ảnh
    }
  }, [formValues.image]);
  // Hàm để xóa ảnh trong danh sách đã chọn
  const handleRemoveImage = (index) => {
    // Xóa ảnh khỏi mảng `selectedGalleryFiles`
    const updatedFiles = selectedGalleryFiles.filter((_, i) => i !== index);
    setSelectedGalleryFiles(updatedFiles); // Cập nhật lại state với mảng đã xóa
  };


  // // Xử lý lỗi và trạng thái loading
  if (errorProductDetails)
    return <div>Lỗi loading dữ liệu chi tiết sản phẩm...</div>;
  if (errorProductDetailSizes)
    return <div>Lỗi loading dữ liệu size màu chi tiết sản phẩm...</div>;
  // if (!productDetails)
  //   return <div>Đang loading dữ liệu chi tiết sản phẩm...</div>;
  // const handleOpenTabColor = (tab: string) => {
  //   // Kiểm tra các trường bắt buộc
  //   const requiredFields = [
  //     "name",
  //     "brand",
  //     "status",
  //     "country",
  //     "price",
  //     "description",
  //
  //   ];
  //   const isFormValid = validateFormFields(formValues, requiredFields);

  //   if (!isFormValid) {
  //     return; // Dừng hàm nếu có trường chưa nhập
  //   }

  //   setActiveTab(tab); // Chuyển tab nếu đã chọn màu hoặc là tab khác
  //   // setSelectedProductDetail([])
  //   if(tab === "edit"){
  //   if (
  //     !selectedProductDetail ||
  //     selectedProductDetail.productDetailId == null
  //   ) {
  //     if (
  //       newColor ||
  //       previewImageProductColor ||
  //       selectedGalleryFiles.length > 0
  //     ) {
  //       console.log("giữ nguyên");
  //     } else {
  //       setSelectedProductDetail([]);
  //       setGalleries([]);
  //       setSelectedGalleryFiles([]);
  //     }
  //   } else {
  //     // Nếu đã chọn `selectedProductDetail`, giữ nguyên giá trị hiện tại
  //     console.log(
  //       "Chuyển tab, giữ nguyên ProductDetail đã chọn với ID:",
  //       selectedProductDetail.productDetailId
  //     );
  //     handleSelectedColor(selectedProductDetail);
  //   }
  // }else if(tab ==="add-details"){
  //   setNewColor("")
  //   setPreviewImageProductColor(null)
  //   setSelectedProductDetail([]);
  //   setGalleries([]);
  //   setSelectedGalleryFiles([]);
  // }
  // };
  const handleTabClick = (tab: string) => {
    const requiredFields = [
      "name",
      "brand",
      "status",
      "country",
      "price",
      "description",
    ];
    const isFormValid = validateFormFields(formValues, requiredFields);

    if (!isFormValid) {
      return; // Dừng hàm nếu có trường chưa nhập
    }

    setActiveTab(tab); // Chuyển tab nếu đã chọn màu hoặc là tab khác
    console.log(tab);
    setSelectedProductDetail([]);
    setNewColor("");
    setPreviewImageProductColor(null);
    setGalleries([]);
    setSelectedGalleryFiles([]);
    console.log("form trống hoàn toàn");
  };
  const handleOpenTabColor = (tab: string) => {
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      "name",
      "brand",
      "status",
      "country",
      "price",
      "description",
    ];
    const isFormValid = validateFormFields(formValues, requiredFields);

    if (!isFormValid) {
      return; // Dừng hàm nếu có trường chưa nhập
    }

    setActiveTab(tab); // Chuyển tab nếu đã chọn màu hoặc là tab khác
    console.log(tab);

    if (tab === "edit") {
      // Kiểm tra nếu `selectedProductDetail` đã được chọn
      console.log(
        "selectedProductDetail có null ko",
        selectedProductDetail?.productDetailId
      );

      if (
        selectedProductDetail &&
        selectedProductDetail.productDetailId != null
      ) {
        // Nếu đã có `selectedProductDetail`, giữ nguyên và hiển thị các thông tin hiện tại
        console.log(
          "Chuyển tab, giữ nguyên ProductDetail đã chọn với ID:",
          selectedProductDetail.productDetailId
        );
        handleSelectedColor(selectedProductDetail);
      } else {
        console.log("new cloeeeeeeeee", newColor);

        if (
          newColor != null ||
          previewImageProductColor != null ||
          selectedGalleryFiles != null
        ) {
          console.log("giữu nguyên");
        } else {
          setSelectedProductDetail([]);
          setNewColor("");
          setPreviewImageProductColor(null);
          setGalleries([]);
          setSelectedGalleryFiles([]);
          // console.log("form trống hoàn toàn");
        }
      }
    } else {
      // Nếu không có giá trị nào, để form trống hoàn toàn
      if (!selectedProductDetail) {
        console.log("new cloeeeeeeeee", newColor);

        if (
          newColor != null ||
          previewImageProductColor != null ||
          selectedGalleryFiles != null
        ) {
          console.log("giữu nguyên");
        } else {
          setSelectedProductDetail([]);
          setNewColor("");
          setPreviewImageProductColor(null);
          setGalleries([]);
          setSelectedGalleryFiles([]);
          // console.log("form trống hoàn toàn");
        }
      } else {
        handleSelectedColor(selectedProductDetail);
      }
    }
  };

  // Hàm xử lý khi chọn ảnh
  const handleImageChangeProductGallery = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files); // Convert FileList to Array
      console.log("tên ảnh: ", newFiles);

      setSelectedGalleryFiles((prevFiles) => [...prevFiles, ...newFiles]); // Thêm ảnh mới vào mảng
      console.log("SelectedGalleryFiles", selectedGalleryFiles);
    }
  };

  const handleAddNewSize = () => {
    setModalTypeProductDetail("add");
    setCurrentProductDetailSize(null);
    setIsShowAddNewSize(true); // Hiển thị modal
  };

  const handleEditClickProductSize = (sizeDetail: ProductDetailSize) => {
    console.log("productDetail edit size ", sizeDetail);
    setCurrentProductDetailSize(sizeDetail);
    console.log("currentProductDetailSize ", currentProductDetailSize);
    setModalTypeProductDetail("edit");

    setIsShowAddNewSize(true); // Hiển thị modal
  };

  const isConfirmed = () => {
    return window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
  };

  const deleteProductDetailSize = async (productDetailSizeId: number) => {
    if (!isConfirmed()) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }

    console.log("productDetailSizeId ", productDetailSizeId);

    try {
      const response = await axios.delete(
        `http://localhost:8080/rest/product-detail-size/delete/${productDetailSizeId}`
      );
      toast.success("xóa thành công");
      console.log(response.data);
      mutate(); // Gọi mutate để refetch dữ liệu
      onFetch();
    } catch (error) {
      toast.error("xóa không thành công");
      console.error("Error deleting ProductDetailSize:", error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };

  const handleAddNewProductDetail = async (currentProductID: number) => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại dữ liệu.");
      return; // Ngừng xử lý nếu form không hợp lệ
    }
    try {
      console.log("currentProduct Id: ", currentProductID);

      const formData = new FormData();
      let imageUrl = selectedProductDetail?.image;

      // Kiểm tra nếu có hình ảnh mới được chọn
      if (previewImageProductColor) {
        const file = imageProductDetail; // Đây là file đã được chọn

        if (file instanceof File) {
          const fileName = `${file.name.replace(/\s+/g, "_")}`;
          imageUrl = fileName; // Cập nhật tên file hình ảnh
          formData.append("fileimage", file); // Thêm file hình ảnh vào FormData
          console.log("image u: ", imageUrl);
          console.log("form value image: ", imageProductDetail);
        } else {
          console.error("file không phải là một đối tượng File:", file);
        }
      }

      if (newColor === "") {
        if (selectedProductDetail.color === "") {
          setNewColor("Xám");
        } else {
          setNewColor(selectedProductDetail.color);
        }
      }

      const productDetailData = {
        color: newColor,
        image: imageUrl,
      };
      formData.append("productDetail", JSON.stringify(productDetailData));

      // Kiểm tra và thêm các file gallery đã được chọn vào FormData
      if (selectedGalleryFiles.length > 0) {
        selectedGalleryFiles.forEach((file, index) => {
          console.log("tên file thứ: ", index + 1);
          console.log("tên file: ", file.name);

          formData.append(`galleryFiles`, file); // Thêm từng file gallery vào FormData
        });
      }

      await mutationAddProductDetail.mutateAsync(
        { formData: formData, id: currentProductID },
        {
          onError(error, variables) {
            console.log("variables========", variables);
            toast.error("Lỗi thêm sản phẩm chi tiết");
          },
          onSuccess(data, variables) {
            if (data) {
              console.log("data", data.data);

              setProductDetailWasCreated(data.data); // Đảm bảo bạn lấy giá trị từ data đúng cách

              console.log("ProductDetailWasCreated: ", productDetailWasCreated); // sẽ hiển thị ID
            }

            toast.success("Thêm sản phẩm chi tiết thành công");
            mutateProductDetails();
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateProductDetail = async (productDetailId: number) => {
    try {
      console.log("Bắt đầu cập nhật");

      const formData = new FormData();
      let imageUrl = selectedProductDetail?.image;

      // Nếu có ảnh mới, thêm vào formData
      if (previewImageProductColor && imageProductDetail instanceof File) {
        formData.append("fileimage", imageProductDetail);
      }

      console.log("newColor đầu", newColor);

      // Gán lại giá trị cho `newColor` nếu chưa có
      if (newColor === "") {
        if (selectedProductDetail.color === "") {
          setNewColor("Xám");
        } else {
          setNewColor(selectedProductDetail.color);
        }
      }
      console.log("newColor lúc sau ", newColor);
      console.log("newColor ", imageUrl);

      // Thêm màu và thông tin cập nhật khác
      const productDetailData = {
        color: newColor,
        image: imageUrl,
      };
      formData.append("productDetail", JSON.stringify(productDetailData));

      // Thêm các file gallery mới (nếu có)
      if (selectedGalleryFiles.length > 0) {
        selectedGalleryFiles.forEach((file) => {
          formData.append("galleryFiles", file);
        });
      } else {
        console.log("Không thêm `galleryFiles` vì mảng rỗng");
        formData.append("galleryFiles", JSON.stringify([]));
        console.log("Gửi galleryFiles rỗng");
      }

      // Gọi API
      await axios.put(
        `${BASE_URL}/rest/product-detail/update/${productDetailId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Cập nhật sản phẩm chi tiết thành công");
    } catch (error) {
      console.error("Error updating product detail:", error);
      toast.error("Lỗi cập nhật sản phẩm chi tiết");
    }
  };

  const handleDeleteProductDetail = async (currentProductDetailID: number) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

    if (!confirmed) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    try {
      await axios.delete(
        `${BASE_URL}/rest/product-detail/delete/${currentProductDetailID}`
      );

      toast.success("Xóa sản phẩm chi tiết thành công");
      // handleClose();
      mutateProductDetails();
      onFetch();
    } catch (error) {
      toast.error("Xóa sản phẩm chi tiết không thành công");
      console.error("Error deleting product:", error);
    }
  };
  const handleDeleteProductDetailGallery = async (
    currentProductDetailGalleryID: number
  ) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

    if (!confirmed) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    try {
      await axios.delete(
        `${BASE_URL}/rest/gallery/delete/${currentProductDetailGalleryID}`
      );

      toast.success("Xóa Gallery chi tiết thành công");
    } catch (error) {
      toast.error("Xóa Gallery không thành công");
      console.error("Error deleting product:", error);
    }
  };
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    console.log(
      "ProductDetailWasCreated đã thay đổi: ",
      productDetailWasCreated
    );
  }, [productDetailWasCreated]);

  return (
    <>
      <Modal
        show={showAddProduct}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title className="text-uppercase text-danger">
            {modalType === "add" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
          </Modal.Title>
        </Modal.Header>
        {/* <h5 className="text-danger text-center">
          productId: {currentProduct?.productId}- {currentProduct?.name}
        </h5> */}
        <Modal.Body>
          <Nav variant="tabs" activeKey={activeTab} className="mb-3">
            <Nav.Item>
              {/* <Nav.Link eventKey="edit" onClick={() => setActiveTab("edit")}>
                Chỉnh sửa sản phẩm
              </Nav.Link> */}
              {/* <Nav.Link eventKey="edit" onClick={() => handleTabClick("edit")}> */}
              <Nav.Link
                eventKey="edit"
                onClick={() => handleOpenTabColor("edit")}
              >
                Chỉnh sửa sản phẩm
              </Nav.Link>
            </Nav.Item>
            {
              <Nav.Item>
                <Nav.Link
                  eventKey="add-details"
                  // onClick={() => handleTabClick("add-details")}
                  onClick={() => handleOpenTabColor("add-details")}
                // disabled={selectedProductDetail}
                >
                  Thêm màu sắc & kích cỡ
                </Nav.Link>
              </Nav.Item>
            }
          </Nav>

          {/* Tab Edit tab thứ nhấn */}
          {activeTab === "edit" && (
            <Form>
              <Row>
                <Col xs={8}>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Floating>
                          <Form.Control
                            type="text"
                            placeholder="Tên"
                            name="name"
                            value={formValues.name}
                            onChange={handleInputChange}
                            isInvalid={!!errorFields.name && !formValues.name}
                          />
                          <Form.Label htmlFor="name">
                            Tên sản phẩm <b className="text-danger">*</b>
                          </Form.Label>
                        </Form.Floating>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Floating>
                          <Form.Control
                            type="number"
                            placeholder="Số lượng"
                            // name="stock"
                            disabled
                            value={formValues.stock || 0}
                            onChange={handleInputChangeNumber}
                          // isInvalid={!!errorFields.stock && !formValues.stock}
                          />
                          <Form.Label htmlFor="stock">
                            Số lượng <b className="text-danger">*</b>
                          </Form.Label>
                        </Form.Floating>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Floating>
                          <Form.Control
                            min={0}
                            // type="number"
                            type="text"
                            placeholder="Giá"
                            name="price"
                            // value={formValues.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || ""}
                            // onChange={handleInputChangeNumber}
                            // isInvalid={!!errorFields.price  && !formValues.price}
                            value={displayPrice} // Hiển thị giá trị tiền tệ
                            onChange={handlePriceChange}
                            isInvalid={!formValues.price && !!errorFields.price}
                          />
                          <Form.Label htmlFor="stock">
                            Giá <b className="text-danger">*</b>
                          </Form.Label>
                        </Form.Floating>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Floating>
                          <Form.Control
                            type="text"
                            placeholder="Hãng"
                            name="brand"
                            value={formValues.brand}
                            onChange={handleInputChange}
                            isInvalid={!!errorFields.brand && !formValues.brand}
                          />
                          <Form.Label htmlFor="brand">
                            Hãng <b className="text-danger">*</b>
                          </Form.Label>
                        </Form.Floating>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Floating>
                          <Form.Control
                            as="select"
                            name="categoryProduct"
                            value={formValues.categoryProduct.categoryProductId}
                            onChange={handleCategorySelect}
                          >
                            {categoryProducts.map((category) => (
                              <option
                                key={category.categoryProductId}
                                value={category.categoryProductId}
                              >
                                {category.name}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Label htmlFor="category">
                            Loại sản phẩm <b className="text-danger">*</b>
                          </Form.Label>
                        </Form.Floating>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Floating>
                          <Form.Control
                            as="select"
                            name="status"
                            disabled
                            value={formValues.status}
                            onChange={handleSelect}
                          >
                            {option.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Label htmlFor="status">
                            Trạng thái <b className="text-danger">*</b>
                          </Form.Label>
                        </Form.Floating>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Floating>
                          <Form.Control
                            type="text"
                            placeholder="country"
                            name="country"
                            value={formValues.country}
                            onChange={handleInputChange}
                            isInvalid={
                              !!errorFields.country && !formValues.country
                            }
                          />
                          <Form.Label htmlFor="country">
                            Xuất sứ <b className="text-danger">*</b>
                          </Form.Label>
                        </Form.Floating>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="description">
                          Mô tả <b className="text-danger">*</b>
                        </Form.Label>
                        <Form.Floating>
                          <Form.Control
                            as="textarea"
                            placeholder="Mô tả"
                            name="description"
                            rows={6}
                            value={formValues.description}
                            onChange={handleInputChange}
                            isInvalid={
                              !!errorFields.description &&
                              !formValues.description
                            }
                            style={{
                              width: "100%",
                              height: "150px",
                              padding: "10px",
                            }}
                          />
                        </Form.Floating>
                      </Form.Group>


                      <Form.Group id="formImage d-flex">
                        <Form.Label className="fw-bold">
                          {" "}
                          {!currentProduct?.image && !previewImage && (
                            <p className="text-danger">Vui lòng chọn ảnh.</p>
                          )}
                        </Form.Label>
                        {/* Hình ảnh hiển thị */}
                        <div className="d-flex align-items-center">
                          <div className="image-container">
                            {/* {!previewImage && (
                              <Image
                                src={formValues.image || ""}
                                className="img-thumbnail shadow-sm" // Thêm bóng đổ
                                alt="dsdsdsđs"
                              />
                            )} */}
                            {/* Input để chọn ảnh, được ẩn đi */}
                            <Form.Control
                              id="file"
                              className="file-input"
                              type="file"
                              name="image"
                              onChange={handleImageChange}
                              accept="image/png, image/jpeg, image/jpg"
                            />
                          </div>
                          <div className="image-container-preview">
                            <div className="boder-image">
                              {previewImage ? (
                                <div
                                  className="preview-image"
                                  style={{ marginLeft: "10px" }}
                                >
                                  <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fluid
                                    className="preview-img"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="preview-image"
                                  style={{ marginLeft: "10px" }}
                                >
                                  <Image
                                    src="/images/logo.png"
                                    alt="Preview"
                                    fluid
                                    className="preview-img"
                                  />
                                </div>
                              )}
                              {/* Nút tải ảnh */}
                              <label htmlFor="file" className="upload-icon">
                                <i className="bi bi-cloud-arrow-up"></i>
                              </label>
                            </div>
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col xs={4}>
                  <div>
                    {formValues.image === null ||
                      previewImage ||
                      !isImageValid ? (
                      <Image
                        src="/images/logo.png"

                        alt="Default image"
                        fluid
                        style={{
                          objectFit: "cover", maxHeight: "300px",
                          display: formValues.image ? "none" : "block"
                        }}
                      />
                    ) : previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Preview image"
                        fluid
                        style={{ objectFit: "cover", maxHeight: "300px" }}
                      />
                    ) : (
                      <Image
                        src={formValues.image || "/images/logo.png"} // Fallback image
                        alt="Default image sdsdsd"
                        fluid
                        style={{ objectFit: "cover", maxHeight: "300px" }}
                      />
                    )}
                  </div>

                  <div>
                    {/* {(formValues.image && modalType === "edit") ? (
    <Image
      src={formValues.image}
      alt="formValues.image"
      fluid
      style={{ objectFit: "cover", maxHeight: "300px" }}
    />
  ) : previewImage ? (
    <Image
      src={previewImage}
      alt="Preview image "
      fluid
      style={{ objectFit: "cover", maxHeight: "300px" }}
    />
  ) : (
    <Image
      src="/images/logo.png"// Fallback image
      alt="Default image"
      fluid
      style={{ objectFit: "cover", maxHeight: "300px" }}
    />
  )} */}
                  </div>

                  <div>
                    {previewImage && modalType === "add" && (
                      <div style={{ marginTop: "10px" }}>
                        <p>Hình ảnh minh họa:</p>
                        <Image
                          src={previewImage}
                          alt="Preview"
                          fluid
                          style={{ objectFit: "cover", maxHeight: "300px" }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <div>
                <div className="container mt-3">
                  <div className="d-flex flex-wrap align-items-center">
                    <span className="me-3">Danh sách màu sản phẩm:</span>

                    {/* Nút Thêm màu */}
                    <div className="d-inline-block me-2">
                      <OverlayTrigger overlay={<Tooltip>Thêm màu</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          className="d-flex align-items-center justify-content-center"
                          onClick={() => {
                            // handleOpenTabAddProductDetail("add-details");
                            // handleOpenTabColor("add-details");
                            handleTabClick("add-details");
                          }}
                          style={{
                            borderRadius: "50%",
                            padding: "10px",
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <i
                            className="bi bi-plus-circle"
                            style={{ fontSize: "20px" }}
                          ></i>
                        </Button>
                      </OverlayTrigger>
                    </div>

                    {/* Hiển thị màu sản phẩm */}
                    {currentProduct?.productId &&
                      productDetails &&
                      productDetails.length > 0 ? ( // Kiểm tra nếu có sản phẩm và danh sách màu không rỗng
                      productDetails.map((detailDemo) => {
                        // Tìm màu tương ứng từ optionColor
                        const colorOption = optionColor.find(
                          (color) => color.value === detailDemo.color
                        );
                        const backgroundColor = colorOption
                          ? colorOption.style
                          : detailDemo.color; // Dùng màu từ optionColor hoặc trực tiếp từ detailDemo.color nếu không có trong optionColor

                        return (
                          <div
                            key={detailDemo.productDetailId}
                            className="d-inline-block me-2 position-relative color-wrapper"
                            onClick={() => {
                              setActiveTab("add-details");
                              handleSelectedColor(detailDemo);
                            }} // Sự kiện chọn màu
                          >
                            <OverlayTrigger
                              overlay={<Tooltip>{detailDemo.color}</Tooltip>}
                            >
                              <div
                                className="color-circle d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: backgroundColor, // Áp dụng màu nền
                                }}
                              ></div>
                            </OverlayTrigger>

                            {/* Nút xóa màu */}
                            <OverlayTrigger
                              overlay={<Tooltip>{`Xóa`}</Tooltip>}
                            >
                              <Button
                                variant="danger"
                                className="btn-sm position-absolute button-delete-color"
                                onClick={(event) => {
                                  event.stopPropagation(); // Ngăn sự kiện chọn màu chạy
                                  handleDeleteProductDetail(
                                    detailDemo.productDetailId
                                  );
                                }}
                              >
                                <i className="bi bi-x"></i>
                              </Button>
                            </OverlayTrigger>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-danger">Thêm màu.</span>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          )}

          {activeTab === "add-details" &&
            selectedProductDetail && ( // selectedProductDetail chứa dữ liệu truyền vào
              <Form>
                <Row>

                  <Col>
                    {/* Kiểm tra nếu chưa chọn ảnh và không có ảnh preview, hiển thị thông báo */}
                    {!selectedProductDetail?.image && !previewImageProductColor && (
                      <p className="text-danger">Vui lòng chọn ảnh.</p>
                    )}

                    {/* ẢNH CHÍNH CỦA MÀU */}
                    <Form.Group id="formImage d-flex">
                      <Form.Label className="fw-bold">Hình ảnh:</Form.Label>

                      {/* Hình ảnh hiển thị */}
                      <div className="d-flex align-items-center">
                        <div className="image-container-new">
                          {/* Nếu chưa có ảnh, hiển thị ảnh mặc định */}
                          <img
                            src={selectedProductDetail?.image || previewImageProductColor || "/images/logo.png"}
                            alt="Product image"
                            className="img-thumbnail shadow-sm" // Thêm bóng đổ
                          />

                          {/* Input để chọn ảnh, được ẩn đi */}
                          <Form.Control
                            id="file"
                            className="file-input"
                            type="file"
                            name="image"
                            onChange={handleImageChangeProductColor}
                            accept="image/png, image/jpeg, image/jpg"
                            style={{ display: "none" }} // Ẩn input file
                          />

                          {/* Nút tải ảnh */}
                          <label htmlFor="file" className="upload-icon-new">
                            <i className="bi bi-camera-fill"></i>
                          </label>
                        </div>

                        {/* Hiển thị ảnh xem trước nếu có */}
                        {/* {previewImageProductColor && (
        <div className="preview-image" style={{ marginLeft: "10px" }}>
          <Image
            src={previewImageProductColor}
            alt="Preview"
            fluid
            className="preview-img"
          />
        </div>
      )} */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Floating>
                        <Form.Control
                          as="select"
                          name="color"
                          value={
                            selectedProductDetail
                              ? selectedProductDetail.color
                              : ""
                          }
                          onChange={handleSelectColor}
                        >
                          <option>Chọn màu sắc --</option>
                          {optionColor.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Label htmlFor="status">
                          Màu sắc <b className="text-danger">*</b>
                        </Form.Label>
                      </Form.Floating>
                    </Form.Group>
                    {/* Bảng Gallery mẫu */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fs-6">Chọn thêm ảnh:</Form.Label>

                      {/* Custom File Input */}
                      <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChangeProductGallery}
                        className="d-none" // Hide default file input
                        id="galleryInput"
                      />
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mx-2"
                        onClick={() =>
                          document.getElementById("galleryInput").click()
                        }
                      >
                        <i className="bi bi-plus-circle mx-1"></i>
                      </Button>

                      {/* Display Selected Images */}
                      <div className="mt-3 d-flex flex-wrap gap-2">
                        {selectedGalleryFiles.length > 0 ? (
                          selectedGalleryFiles.map((file, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`gallery-${index}`}
                                className="border img-thumbnail"
                                style={{
                                  objectFit: "cover",
                                  height: "70px",
                                  width: "70px",
                                  borderRadius: "5px",
                                  border: "1px solid #ddd",
                                }}
                              />
                              {/* Nút xóa ảnh */}
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute rounded-circle top-0 end-0"
                                style={{ transform: "translate(25%, -25%)" }}
                                onClick={() => handleRemoveImage(index)}
                              >
                                <i className="bi bi-x-circle"></i>
                              </Button>
                            </div>
                          ))
                        ) : galleries.length === 0 ? (
                          <p className=" text-danger">
                            Chưa có ảnh trong thư viện ảnh.
                          </p>
                        ) : null}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Bảng gallery demo*/}
                {galleries.length > 0 && (
                  <Form.Group id="formGallery">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Thư viện ảnh của sản phẩm:
                      </label>

                      <div className="d-flex flex-wrap align-items-center">
                        {galleries.length > 0 ? (
                          galleries.map((gallery) => (
                            <div
                              key={gallery.galleryId}
                              className="position-relative me-3 mb-3 gallery-image-container" // Thêm lớp cho các hình ảnh trong gallery
                            >
                              <Image
                                src={gallery.name} // Đường dẫn ảnh từ gallery.name
                                alt={`Gallery ${gallery.galleryId}`}
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
                                    top: "-8px",
                                    right: "-8px",
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation(); // Ngăn sự kiện chọn màu chạy
                                    handleDeleteProductDetailGallery(
                                      gallery.galleryId
                                    );
                                  }}
                                >
                                  <i className="bi bi-x fs-6"></i>
                                </Button>
                              </OverlayTrigger>
                            </div>
                          ))
                        ) : (
                          <span className="text-muted">Chưa có gallery</span>
                        )}
                      </div>
                    </div>
                  </Form.Group>
                )}

                {/* Bảng Kích cỡ */}
                {selectedProductDetail.productDetailId && (
                  <Form.Group id="formSize">
                    {/* Khối chứa nút thêm kích cỡ */}
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label className="fw-bold">Kích cỡ:</Form.Label>
                    </div>
                    {/* <span>
                      ProductDetail Id from backend {productDetailWasCreated}
                    </span> */}
                    {isShowAddNewSize && (
                      <ModalProductAddNewSize
                        setIsShowAddNewSize={setIsShowAddNewSize}
                        isShowAddNewSize={isShowAddNewSize}
                        ProductDetailWasCreated={productDetailWasCreated}
                        onFetchProductDetailSize={mutate}
                        currentProductDetailSize={currentProductDetailSize}
                        modalTypeProductDetail={modalTypeProductDetail}
                        selectedProductDetail={selectedProductDetail}
                      />
                    )}
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Stt</th>
                          <th>Tên Kích cỡ</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProductDetailSize.length > 0 ? (
                          selectedProductDetailSize.map((sizeDetail, index) => (
                            <tr key={sizeDetail.productDetailSizeId}>
                              <td>{index + 1}</td>
                              <td>
                                {sizeDetail.size?.sizeName ||
                                  "Không có kích cỡ"}
                              </td>
                              <td>{formatCurrency(sizeDetail.price)}</td>
                              <td>{sizeDetail.quantity}</td>
                              <td className="text-center align-middle">
                                <OverlayTrigger
                                  overlay={<Tooltip>Sửa</Tooltip>}
                                >
                                  <Button
                                    variant="warning"
                                    className="m-1"
                                    onClick={() =>
                                      handleEditClickProductSize(sizeDetail)
                                    }
                                  >
                                    <i className="bi bi-pencil-fill"></i>
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  overlay={<Tooltip>Xóa</Tooltip>}
                                >
                                  <Button
                                    variant="danger"
                                    className="m-1"
                                    onClick={() =>
                                      deleteProductDetailSize(
                                        sizeDetail.productDetailSizeId
                                      )
                                    }
                                  >
                                    <i className="bi bi-trash3-fill"></i>
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">Chưa lấy được kích cỡ</td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan="5">
                            <Button
                              size="sm"
                              className="mx-2"
                              variant="outline-primary"
                              onClick={handleAddNewSize}
                              style={{
                                fontWeight: "bold",
                                borderRadius: "5px",
                              }} // Tăng độ nổi bật
                            >
                              Thêm kích cỡ{" "}
                              <i className="bi bi-plus-circle mx-1"></i>
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Form.Group>
                )}
              </Form>
            )}

          {/* Table hiển thị danh sách ProductDetail */}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={
              mutation.isPending ||
              mutationAddProdcut.isPending ||
              productDetails?.length === 0
            }
          >
            Đóng
          </Button>
          <Button
            type="submit"
            variant="danger"
            onClick={(event) => handleSave(event)}
            disabled={
              mutation.isPending ||
              mutationAddProdcut.isPending ||
              productDetailsLoading
            }
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductAddNew;
