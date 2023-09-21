import React, { useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import jwt_decode from "jwt-decode";
import "react-quill/dist/quill.snow.css"
import "./NoticeWrite.css"
import ReactQuill from "react-quill"
import { useNavigate } from "react-router-dom"

function NoticeUpdate() {
    const navigate = useNavigate();

    const [userNum, setUserNum] = useState(0);  //유저 번호
    const [writer, setWriter] = useState("관리자")
    const [title, setTitle] = useState("")
    //variable: react-quill Editor content
    const [content, setContent] = useState("")
    //variable: attachment
    const [files, setFiles] = useState([]);
    const [list, setList] = useState([]);

    // 현재 페이지의 URL 가져오기
    const currentURL = window.location.href;
    // URL에서 쿼리 문자열 추출
    const queryString = currentURL.split('?')[1]; // ? 뒤의 쿼리 문자열 추출
    // 쿼리 문자열을 파싱하여 객체로 변환
    const queryParams = {};
    if (queryString) {
        const queryParts = queryString.split('&');
        for (const part of queryParts) {
            const [key, value] = part.split('=');
            queryParams[key] = decodeURIComponent(value);
        }
    }
    // postId 값 추출하여 변수에 담기
    const id = queryParams.id;

    // NoticeDetail 페이지 조회하여 초기값에 넣어주기
    const getList = () => {
        axios.get("http://localhost:9999/notice/list/" + id)
            .then(res => {
                setList(res.data);
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getList();
    }, [])

    useEffect(() => {
        const newToken = localStorage.getItem('login-token');
        if (newToken) {
            // 토큰 해석
            const decodedToken = jwt_decode(newToken); // jwt 모듈을 사용하여 토큰 해석
            if (decodedToken && decodedToken.userNum) {
                // 해석한 토큰에 이메일 정보가 있는지 확인하고, 있다면 이메일 값과 생일, 닉네임을 가져와서 설정
                setUserNum(decodedToken.userNum);
            } else {
                console.error("userNum 없음");
            }
        } else {
            //만약, 로그인이 안되어있다면 로그인페이지로 이동w
            navigate("/login");
        }
    }, []);

    //function: input onChange for attachments
    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleUploadNotice = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("userNum", userNum);  //유저 번호
        formData.append("writer", writer);  //작성자(관리자)
        formData.append("title", title);  //제목
        formData.append("content", content);  //글 내용
        files.map((file) => (
            formData.append("files", file)  //첨부 파일
        ));

        axios
            .post(`http://localhost:9999/notice/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("공지 업로드 성공:", response.data);
                // 성공 시 메시지 표시 및 마이페이지로 이동
                alert("공지 게시글이 수정 되었습니다");
                navigate(`/noticeDetail?id=${id}`);
            })
            .catch((error) => {
                console.error("공지 수정 실패:", error);
                // 실패 시 오류 메시지 표시
                alert("공지 게시글 수정에 실패했습니다.");
            });
    };

    const handleCancelNotice = () => {
        alert("공지사항 작성을 취소합니다");
        navigate(`/noticeDetail?id=${id}`);
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
                    title={title}
                    content={content}
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

export default NoticeUpdate;


function Editor({ title, content, setTitle, setContent }) {
    const quillRef = useRef()

    //modules for quill toolbar
    //useMemo => to prevent editor disappear bug when module renders
    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
                    ["blockquote", "link"]
                ],
            }
        }
    }, [])

    const onChangeContents = (contents) => {
        // const editorContents = quillRef.current.getEditor().getContents();
        // const contentText = editorContents.ops.map(op => op.insert).join("\n");
        // props.setContent(contentText);
        // console.log(editorContents);

        setContent(contents);
    }

    return (
        <>
            <div className="title-container">
                <input
                    className="title"
                    type="text"
                    ref={quillRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="content-container">
                <ReactQuill
                    placeholder="내용을 입력하세요"
                    ref={quillRef}
                    value={content}
                    onChange={onChangeContents}
                    modules={modules}
                    style={{
                        height: "100px"
                    }}
                />
            </div>
        </>
    )
}