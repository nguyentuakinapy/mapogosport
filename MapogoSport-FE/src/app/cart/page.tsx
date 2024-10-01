// "use client";
// import HomeLayout from '@/components/HomeLayout';
// import React, { useState } from 'react';

// const Cart = () => {
//   const [selectAll, setSelectAll] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState([false, false, false]); // Giả định có 3 sản phẩm
//   const [quantities, setQuantities] = useState([1, 1, 1]); // Giả định có 3 sản phẩm và mỗi sản phẩm bắt đầu với số lượng 1

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll; // dùng để để đảo ngược trạng thái hiện tại cua check box
//     setSelectAll(newSelectAll); // cập nhật giá trị bằng giá trị mới là newSelectAll
//     setSelectedProducts(selectedProducts.map(() => newSelectAll)); // cập nhật trạng thái của tất cả phần tử trong mảng sang cùng giá trị
//   };

//   const handleProductSelect = (index: number) => { // để handle select từng sản phẩm
//     const updatedProducts = [...selectedProducts]; // tạo để bản sao và thay đổi giá trị để không anh hưởng bản gốc
//     updatedProducts[index] = !updatedProducts[index]; // đảo ngược trạng thái tại vị trí sản phẩm
//     setSelectedProducts(updatedProducts); // lúc này sẽ set thành cái bản sao vừa tạo
//     setSelectAll(updatedProducts.every(Boolean));
//   };

//   // Hàm tăng số lượng
//   const handleIncrease = (index: number) => {
//     const updatedQuantities = [...quantities];
//     updatedQuantities[index] += 1;
//     setQuantities(updatedQuantities);
//   };

//   // Hàm giảm số lượng
//   const handleDecrease = (index: number) => {
//     const updatedQuantities = [...quantities];
//     if (updatedQuantities[index] > 1) {
//       updatedQuantities[index] -= 1;
//       setQuantities(updatedQuantities);
//     }
//   };

//   return (
//     <HomeLayout>
//       <h1 className="text-center pt-5">Giỏ hàng</h1>
//       <div className="container shadow p-3 mb-5 bg-body rounded">
//         <div className="row">
//           <div className="col-md-8">
//             <div className="table-responsive">
//               <table className="table  table-hover ">
//                 <thead>
//                   <tr>
//                     <th scope="col" style={{ width: '5%' }}>
//                       <input
//                         className='me-2'
//                         type="checkbox"
//                         checked={selectAll}
//                         onChange={handleSelectAll}
//                       />
//                     </th>
//                     <th scope="col">Sản phẩm</th>
//                     <th scope="col">Tên sản phẩm</th>
//                     <th scope="col">Giá</th>
//                     <th scope="col">Số lượng</th>
//                     <th scope="col">Tổng</th>
//                     <th scope="col" style={{ width: '10%' }}>Thao tác</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[...Array(3)].map((_, index) => (
//                     <tr key={index}>
//                       <td>
//                         <input
//                           type="checkbox"
//                           checked={selectedProducts[index]}
//                           onChange={() => handleProductSelect(index)}
//                         />
//                       </td>
//                       <th scope="row">
//                         <img
//                           src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
//                           className="img-fluid me-5 rounded-circle"
//                           style={{ width: '80px', height: '80px' }}
//                           alt=""
//                         />
//                       </th>
//                       <td>
//                         <p className="mb-0">Ống cầu</p>
//                       </td>
//                       <td>
//                         <p className="mb-0">200.000</p>
//                       </td>
//                       <td>
//                         <div className="input-group quantity" style={{ width: '100px' }}>
//                           <button
//                             className="btn btn-sm btn-minus rounded-circle bg-light border"
//                             onClick={() => handleDecrease(index)}
//                           >
//                             <i className="bi bi-dash"></i>
//                           </button>
//                           <input
//                             type="text"
//                             className="form-control form-control-sm text-center border-0 mx-1"
//                             value={quantities[index]}
//                             readOnly
//                           />
//                           <button
//                             className="btn btn-sm btn-plus rounded-circle bg-light border"
//                             onClick={() => handleIncrease(index)}
//                           >
//                             <i className="bi bi-plus-lg"></i>
//                           </button>
//                         </div>
//                       </td>
//                       <td>
//                         <p className="mb-0">{quantities[index] * 200000}</p> {/* Tổng tiền = số lượng * giá */}
//                       </td>
//                       <td>
//                         <button className="btn btn-md rounded-circle bg-light border" style={{ width: '35px', height: '35px', padding: 0 }}>
//                           <i className="text-danger bi bi-x"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="rounded" style={{ backgroundColor: "#f2f2f2" }}>
//               <div className="p-4">
//                 <h1 className="display-6 mb-4 text-primary">Tổng tiền</h1>
//                 <div className="d-flex justify-content-between mb-4">
//                   <h5 className="mb-0">Tạm tính:</h5>
//                   <p className="mb-0">400.000 VND</p>
//                 </div>
//                 <div className="d-flex justify-content-between">
//                   <h5 className="mb-0">Vận chuyển</h5>
//                   <p className="mb-0">Phí vận chuyển: 15.000 VND</p>
//                 </div>
//                 <p className="mb-0 text-end">Vận chuyển đến Kiên Giang</p>
//               </div>
//               <div className="py-4 mb-4 border-top border-bottom border-dark d-flex justify-content-between ">
//                 <h5 className="mb-0 mx-4">Tổng cộng</h5>
//                 <p className="mb-0 mx-4 text-primary fw-bold">415.000 VND</p>
//               </div>
//               <div className=' text-end'>
//                 <button
//                   className="btn border-secondary bg-success rounded-pill px-4 me-3 py-3 text-light text-uppercase mb-4"
//                   type="button">
//                   Xác nhận thanh toán
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </HomeLayout>
//   );
// };

// export default Cart;

"use client";
import HomeLayout from '@/components/HomeLayout';
import React, { useState } from 'react';
import { Table, Button, InputGroup, FormControl, Card,Row, Col } from 'react-bootstrap';

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([false, false, false]);
  // const [quantities, setQuantities] = useState([1, 5, 1]); //  là 3 sản phẩm có số lượng lần lượt là 1,5,1

  const products = [
    {
      id: 1,
      name: "Ống cầu lông",
      price: 200000,
      quantity: 2,
      imageUrl: "https://www.example.com/images/badminton-tube.jpg"
    },
    {
      id: 2,
      name: "Vợt cầu lông",
      price: 500000,
      quantity: 1,
      imageUrl: "https://www.example.com/images/badminton-racket.jpg"
    },
    {
      id: 3,
      name: "Giày cầu lông",
      price: 300000,
      quantity: 3,
      imageUrl: "https://www.example.com/images/badminton-shoes.jpg"
    }
  ];
  
  const initialQualities = products.map(sp => sp.quantity);
  console.log("sản phẩm " ,initialQualities)
  
  const [quantities, setQuantities] = useState(initialQualities); //  là 3 sản phẩm có số lượng lần lượt là 1,5,1


  // chọn tất cả sản phẩm
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedProducts(selectedProducts.map(() => newSelectAll));
  };
  // chọn từng sản phẩm
  const handleProductSelect = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = !updatedProducts[index];
    setSelectedProducts(updatedProducts);
    setSelectAll(updatedProducts.every(Boolean));
  };
  // tăng
  const handleIncrease = (index: number) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += 1;
    setQuantities(updatedQuantities);
  };
  // giảm
  const handleDecrease = (index: number) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);
    }
  };
                    // 1,5,1    
  const totalPrice = quantities.reduce((total, qty) => total + qty * 200000, 0 );
  //  cú phá:      // array.reduce((tích lũy, phần tử thứ I) => logic xử lý, giá trị khỏi tạo của giá trị tích lũy)
  // hàm reduce dùng để thay thế cho vòng lặp for hoặc for each khi cần tính tổng của các phần tử trong một mảng
  const shippingCost = 15000;
  const finalTotal = totalPrice + shippingCost;

  return (
    <HomeLayout>
      <h1 className="text-center pt-5">Giỏ hàng</h1>
      <div className="container shadow p-3 mb-5 bg-body rounded">
          <Row>
          <Col xs={12} md={8}>
          
        <Table hover responsive>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Sản phẩm</th>
              <th style={{ width: '20%' }}>Tên sản phẩm</th>
              <th>Giá</th>
              <th style={{ width: '10%' }}>Số lượng</th>
              <th>Tổng</th>
              <th style={{ width: '10%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts[index]}
                    onChange={() => handleProductSelect(index)}
                  />
                </td>
                <td>
                  <img
                    src="https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1654120169"
                    className="img-fluid me-5 rounded-circle"
                    style={{ width: '80px', height: '80px' }}
                    alt="Product"
                  />
                </td>
                <td>
                  <p className="mb-0">Ống cầu</p>
                </td>
                <td>
                  <p className="mb-0">200.000</p>
                </td>
                <td>
                  <InputGroup className='me-5' style={{ width: '125px' }}>
                    <Button
                      variant="light"
                      onClick={() => handleDecrease(index)}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <FormControl
                      className="text-center border-0 "
                      value={quantities[index]}
                      readOnly
                    />
                    <Button
                      variant="light"
                      onClick={() => handleIncrease(index)}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </Button>
                  </InputGroup>
                </td>
                <td>
                  <p className="mb-0">{quantities[index] * 200000}</p>
                </td>
                <td>
                  <Button variant="light" className="text-danger" >
                    <i className="bi bi-x"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
          </Col >
          <Col xs={12} md={4}> 
        <Card className="rounded mt-4" style={{ backgroundColor: "#f2f2f2" }}>
          <Card.Body>
            <h1 className="display-6 mb-4 text-primary">Tổng tiền</h1>
            <div className="d-flex justify-content-between mb-4">
              <h5 className="mb-0">Tạm tính:</h5>
              <p className="mb-0">{totalPrice} VND</p>
            </div>
            <div className="d-flex justify-content-between">
              <h5 className="mb-0">Vận chuyển</h5>
              <p className="mb-0">Phí vận chuyển: {shippingCost} VND</p>
            </div>
            <p className="mb-0 text-end">Vận chuyển đến Kiên Giang</p>
          </Card.Body>
          <div className="py-4 mb-4 border-top border-bottom border-dark d-flex justify-content-between ">
            <h5 className="mb-0 mx-4">Tổng cộng</h5>
            <p className="mb-0 mx-4 text-primary fw-bold">{finalTotal} VND</p>
          </div>
          <div className='text-end'>
            <Button
              className="rounded-pill px-4 me-3 py-3 text-light text-uppercase mb-4"
              variant="success"
            >
              Xác nhận thanh toán
            </Button>
          </div>
        </Card>
        </Col>
        </Row>
      </div>
    </HomeLayout>
  );
};

export default Cart;
