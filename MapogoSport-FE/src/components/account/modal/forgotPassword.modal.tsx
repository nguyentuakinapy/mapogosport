'use client'
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface VerificationCodeInputProps {
    onCodeChange: (code: string) => void; // Specify the expected type
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ onCodeChange }) => {
    const [code, setCode] = useState(Array(6).fill('')); // Lưu mã xác nhận 6 ký tự dưới dạng mảng
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        onCodeChange(code.join('')); // Gọi hàm onCodeChange khi mã xác nhận thay đổi
    }, [code]);

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
                            inputRefs.current[index] = el;
                        }}
                        onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                    />
                ))}
            </div>
        </div>
    );
};

interface ForgotPasswordProps {
    showForgotPassword: boolean;
    setShowForgotPassword: (v: boolean) => void;
    showChangePasswordNew: boolean;
    setShowChangePasswordNew: (v: boolean) => void;
}

export default function ForgotPassword(props: ForgotPasswordProps) {
    const { showForgotPassword, setShowForgotPassword } = props;
    const { showChangePasswordNew, setShowChangePasswordNew } = props;

    const [timeLeft, setTimeLeft] = useState(0);

    const [email, setEmail] = useState<string>("");
    const [codeOtp, setCodeOtp] = useState<string>();
    const [otp, setOtp] = useState<string>("");
    const [otpValue, setOtpValue] = useState<string>("");

    const coolDownTime = async () => {
        if (!email) {
            toast.warning("Vui lòng nhập email")!
        } else {
            try {
                const response = await fetch(`http://localhost:8080/rest/user/getbyemail/${email}`);
                if (!response.ok) {
                    toast.warning("Email bạn nhập không đúng!")!
                }
                const dataUser = await response.json();
                sessionStorage.setItem('usernameNewPass', dataUser.username);
                if (dataUser.email == email) {
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
                    if (dataUser.email) {
                        toast.success("Mã xác nhận đang được gửi về email!");
                        const response = await fetch('http://localhost:8080/rest/user/sendMail', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(dataUser.email)
                        });
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const res = await response.text(); // Bạn đang trả về chuỗi OTP từ backend
                        setOtp(res);
                    }
                }
            } catch (error) {
                toast.warning("Email bạn nhập không tồn tại!")!
            }
        }
    }

    useEffect(() => {
        console.log(codeOtp);

    }, [codeOtp])
    // const checkEmail = async () => {
    //     if (emailFetch) {

    //         const response = await fetch('http://localhost:8080/rest/user/sendMail', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json, text/plain, */*',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(emailFetch)
    //         });
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const res = await response.text(); // Bạn đang trả về chuỗi OTP từ backend
    //         setOtp(res);
    //     }
    // }

    const handleCodeChange = (code: string) => {
        setCodeOtp(code); // Cập nhật giá trị mã xác nhận
    };

    const handleSubmit = () => {
        if (!email) {
            toast.warning("Vui lòng nhập email!")
        } else if (codeOtp) {
            if (otp == codeOtp) {
                toast.success("Hoàn tất xác minh tài khoản!")!
                setShowChangePasswordNew(true);
                setShowForgotPassword(false);
            } else {
                toast.error("Mã xác nhận không đúng!")!
            }
        } else {
            toast.warning("Bạn chưa nhập mã xác nhận!")!
        }
    }

    const handleClose = () => {
        setShowForgotPassword(false);
        setEmail("");
        setOtp("");
        setOtpValue("");
        sessionStorage.removeItem('usernameNewPass');
    }

    return (
        <Modal show={showForgotPassword} onHide={handleClose} backdrop="static"
            centered>
            <Modal.Header closeButton className="border-0">
            </Modal.Header>
            <div className="modal-title h3 text-uppercase text-center font-weight-bold ">
                Quên mật khẩu
            </div>
            <Modal.Body>
                <div className="form-login-register">
                    <div className="px-lg-3">
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
                            <input type="email" className="form-control" placeholder="Email *"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                aria-label="Email *" aria-describedby="button-request" />
                            <button
                                className="btn btn-dark"
                                type="submit"
                                id="button-request"
                                onClick={() => {
                                    coolDownTime();
                                }}
                                disabled={timeLeft > 0}
                                style={{ width: '100px' }}
                            >
                                {timeLeft > 0 ? `${timeLeft}s` : 'Gửi mã'}
                            </button>
                        </div>
                        <VerificationCodeInput onCodeChange={handleCodeChange} />
                        <button className="btn btn-submit w-100 mb-3"
                            onClick={() => handleSubmit()}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal >

    );
}
