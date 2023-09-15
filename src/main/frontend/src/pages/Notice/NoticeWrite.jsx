import React, { useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import "react-quill/dist/quill.snow.css"
import "./NoticeWrite.css"
import Editor from '../../component/Editor/Editor'
import { useNavigate } from "react-router-dom"

function NoticeWrite() {
    const navigate = useNavigate();

    const [writer, setWriter] = useState("관리자")
    const [title, setTitle] = useState("")
    //variable: react-quill Editor content
    const [content, setContent] = useState("")
    //variable: attachment
    const [files, setFiles] = useState([]);

    //function: input onChange for attachments
    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleUploadNotice = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("writer", writer);  //작성자(관리자)
        formData.append("title", title);  //제목
        formData.append("content", content);  //글 내용
        files.map((file) => (
            formData.append("files", file)  //첨부 파일
        ));

        axios
            .post("/notice/insert", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }})
            .then((response) => {
                console.log("공지사항 업로드 성공:", response.data);
                // 성공 시 메시지 표시 및 마이페이지로 이동
                alert("공지사항이 업로드 되었습니다");
                navigate("/noticeBoard");
            })
            .catch((error) => {
                console.error("공지사항 업로드 실패:", error);
                // 실패 시 오류 메시지 표시
                alert("공지사항 업로드가 실패했습니다.");

            });
    };

    const handleCancelNotice = () => {
        alert("공지사항 작성을 취소합니다");
        navigate("/noticeBoard");
    }

    return (
        <div className="container">
            <div className="editor-container">
                {/*
            component: react-quill Editor
            props: content, setContent
            => to pass data from child component(Editor) to parent component(NoticeWrite)
          */}
                <Editor
                    setTitle={setTitle}
                    setContent={setContent}
                />
                <div className="file-container">
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="fileInput" className="upload-button">
                        첨부파일
                    </label>

                    {/* selected file names */}
                    <div className="selected-files">
                        {files.map((file, index) => (
                            <div className="file-name" key={index}>
                                {file.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="button-container">
                    <button
                        className="submit-button"
                        onClick={handleUploadNotice}>
                        작성
                    </button>
                    <button
                        className="cancel-button"
                        onClick={handleCancelNotice}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NoticeWrite;