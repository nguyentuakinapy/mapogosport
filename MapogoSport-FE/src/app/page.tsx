import { Container } from "react-bootstrap";

export default function Home() {
  return (
    <Container>
      <img src="https://img.thegioithethao.vn/media/icon/thi-cong-cai-tao.webp" className="w-100" alt="" />
      <div className="row mt-2">
        <div className="col">
          <img src="https://img.thegioithethao.vn/media/banner/banner_gio_vang.png" className="w-100" alt="" />
        </div>
        <div className="col">
          <img src="https://img.thegioithethao.vn/media/banner/thi-cong-cai-tao.png" className="w-100" alt="" />
        </div>
      </div>
      {/* Danh mục nổi bật */}
      <div>
        <h3 className="text-center fw-bold mt-5">DANH MỤC NỔI BẬT</h3>
        <div className="row">
          <div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div>
          <div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div>
          <div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div>
          <div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div>
          <div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div><div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div><div className="col-3 text-center img-dm">
            <img src="/images/danhmucnoibat.png" style={{ width: '65%' }} alt="" />
            <h3>Test</h3>
          </div>
        </div>
      </div>
      {/* Deal hot cho bạn */}
      <div>
        <h3 className="text-center fw-bold mt-5">DEAL HOT CHO BẠN</h3>
      </div>
      {/* Sale sốc */}
      <div>
        <h3 className="text-center fw-bold mt-5">SALE SỐC</h3>
      </div>
      {/* Sân thể thao mới */}
      <div>
        <h3 className="fw-bold mt-5">SÂN THỂ THAO MỚI</h3>
      </div>
      {/* Sản phẩm mới */}
      <div>
        <h3 className="fw-bold mt-5">SẢN PHẨM MỚI</h3>
      </div>
      {/* Thông tin nổi bật */}
      <div>
        <h3 className="text-center fw-bold mt-5">THÔNG TIN NỔI BẬT</h3>
      </div>
    </Container>
  );
}
