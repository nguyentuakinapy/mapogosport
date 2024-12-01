import React, { RefObject, useState } from "react";
import { Form } from "react-bootstrap";

interface InputChatProps {
  inputRef: RefObject<HTMLInputElement>;
  handleKeyEnter: (e: React.KeyboardEvent, message: string) => void
}

const InputChat: React.FC<InputChatProps> = ({ inputRef, handleKeyEnter }) => {

  // const { inputRef, handleKeyEnter} = props

  const [inputMessage, setInputMessage] = useState(""); // lưu trữ nội dung người dùng đang nhập vào ô chat

  return (
    <div className="card-footer d-flex p-2">
      <Form.Control
        ref={inputRef}
        type="text"
        placeholder="Nhập câu hỏi tiếp theo của bạn"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleKeyEnter(e, inputMessage);
            setInputMessage("");
          }


        }} // sự kiện key down
        className="me-2"
      />
    </div>
  )
}
export default InputChat