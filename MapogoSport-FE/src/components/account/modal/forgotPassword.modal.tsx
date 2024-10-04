'use client'
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const VerificationCodeInput = () => {
    const [code, setCode] = useState(Array(6).fill('')); // Lưu mã xác nhận 6 ký tự dưới dạng mảng
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        // Chỉ cho phép nhập số
        if (isNaN(Number(value))) return;

        const updatedCode = [...code];
        updatedCode[index] = value;
        setCode(updatedCode);

        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus(); // Sử dụng toán tử điều kiện
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const key = e.key;

        if (key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus(); // Quay lại ô nhập trước đó khi xóa
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData('text').split('').slice(0, 6); // Lấy 6 ký tự đầu tiên từ dữ liệu dán
        const updatedCode = pasteData.map((char, i) => (isNaN(Number(char)) ? '' : char)); // Chỉ lấy ký tự là số
        setCode(updatedCode);

        updatedCode.forEach((_, i) => {
            if (inputRefs.current[i]) {
                inputRefs.current[i].value = updatedCode[i]; // Cập nhật giá trị cho các ô nhập
            }
        });

        // Di chuyển đến ô cuối cùng đã được nhập
        const lastFilledIndex = updatedCode.findIndex((value) => value === '');
        if (lastFilledIndex !== -1) {
            inputRefs.current[lastFilledIndex]?.focus();
        } else {
            inputRefs.current[5]?.focus(); // Nếu tất cả đã nhập, di chuyển đến ô cuối cùng
        }
    };

    return (
        <div className="mb-3">
            <label htmlFor="mxn" className="mb-2">Mã xác nhận <span className="text-danger">*</span></label>
            <div className="row verification d-flex justify-content-evenly">
                {[...Array(6)].map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        className={`col-2`}
                        maxLength={1}
                        ref={(el) => {
                            inputRefs.current[index] = el; // Gán el, không cần kiểm tra null
                        }}
                        onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>, index)} // Xử lý khi nhập liệu
                        onKeyDown={(e) => handleKeyDown(e, index)} // Xử lý khi bấm phím xóa
                        onPaste={handlePaste} // Xử lý khi dán mã
                    />
                ))}
            </div>
        </div>
    );
};

export default function ForgotPassword() {
    const [timeLeft, setTimeLeft] = useState(0);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [forgotPassword, setForgotPassword] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [otpValue, setOtpValue] = useState<string>("");

    const coolDownTime = () => {
        if (timeLeft) {
            clearInterval(timeLeft);
        }

        setTimeLeft(60);

        const newTimerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 1) {
                    clearInterval(newTimerId); // Dừng bộ đếm khi thời gian bằng 0
                }
                return prevTime - 1;
            });
        }, 1000);
    }

    const handleSendCode = () => {
    };

    const checkEmail = async () => {
        if (username) {
            const response = await fetch('http://localhost:8080/rest/user/sendMail', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(username)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const res = await response.text(); // Bạn đang trả về chuỗi OTP từ backend
            setOtp(res);
        }
    }

    return (
        <>
            <div className="modal fade" id="forgotModal" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-custom">
                    <div className="modal-content">
                        <div className="modal-header border-0 ">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="modal-title h2 text-uppercase text-center font-weight-bold pt-lg-3 pt-2">
                                Quên mật khẩu
                            </div>
                            <form className="form-login-register" action="/member/ajax-login" method="post" autoComplete="off">
                                <div className="p-lg-5 p-4">
                                    <div className="row border border-danger rounded ms-1 mb-3 me-1">
                                        <div className="col-2 d-flex justify-content-center align-items-center">
                                            <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '36px', color: 'red' }} />
                                        </div>
                                        <div className="col-10">
                                            <div className="fw-bold mt-2">Khôi phục mật khẩu qua email</div>
                                            <p>Mã sẽ gửi qua email bạn đăng ký để thay đổi mật khẩu</p>
                                        </div>
                                    </div>

                                    <div className="input-group mb-3">
                                        <input type="email" className="form-control" placeholder="Email *" aria-label="Email *" aria-describedby="button-request" />
                                        <button
                                            className="btn btn-dark"
                                            type="submit"
                                            id="button-request"
                                            onClick={() => {
                                                coolDownTime();
                                                handleSendCode();
                                            }}
                                            disabled={timeLeft > 0}
                                            style={{ width: '100px' }}
                                        >
                                            {timeLeft > 0 ? `${timeLeft}s` : 'Gửi mã'}
                                        </button>
                                    </div>

                                    {/* Sử dụng thành phần VerificationCodeInput tại đây */}
                                    <VerificationCodeInput />
                                    <div className="row mb-3">
                                        <div className="form-group col-6">
                                            <input type="password" className="form-control"
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Mật khẩu *" />
                                        </div>
                                        <div className="form-group col-6">
                                            <input type="password" className="form-control"
                                                value={forgotPassword} onChange={(e) => setForgotPassword(e.target.value)}
                                                placeholder="Nhập lại mật khẩu *" />
                                        </div>
                                    </div>
                                    <button className="btn btn-submit w-100 mb-3">
                                        Đăng ký
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
