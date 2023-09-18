import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "react-quill/dist/quill.snow.css";
import "./PartyWrite.css";
import ReactQuill from "react-quill"
import "../../component/Editor/Editor.css"
import Swal from "sweetalert2";

function PartyWrite() {
  const [userNum, setUserNum] = useState(0);  //유저 번호
  const [title, setTitle] = useState(""); //제목
  const [content, setContent] = useState(""); //내용
  const [image, setImage] = useState(""); //썸네일 사진
  const [list, setList] = useState([]);

  const navigate = useNavigate();

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
  const postId = queryParams.postId;

   // PartyDetail 데이터 조회하여 초기값에 넣어주기
   const getData = () => {
    axios.get(`http://localhost:9999/party/${postId}`)
      .then(res => {
        setList(res.data);
        console.log("게시글 데이터")
        console.log(res.data);

        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    getData();
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

  const handleImage = (e) => {
    setImage([...e.target.files]);
    console.log(image)
  };

  const handleUploadParty = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userNum", userNum);  //유저 번호
    formData.append("title", title); //제목
    formData.append("content", content); //글 내용
    formData.append("image", image[0]); //썸네일 사진

    console.log("이미지")
    console.log(image);
    console.log(
      userNum + "\n" +
      title + "\n" +
      content + "\n" + 
      image + "\n"
    );

    axios
      .post(`http://localhost:9999/party/update?postId=${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("파티 업로드 성공:", response.data);
        // 성공 시 메시지 표시 및 마이페이지로 이동
        Swal.fire({
          icon: "success",
          title: "파티 게시글 수정이 성공했습니다",
          showConfirmButton: false,
          timer: 1500
      })
        navigate(`/partyDetail?postId=${postId}`);
      })
      .catch((error) => {
        console.error("파티 수정 실패:", error);
        // 실패 시 오류 메시지 표시
        Swal.fire({
          icon: "error",
          title: "파티 게시글 수정이 실패했습니다",
          showConfirmButton: false,
          timer: 1500
      })
      });
  };

  const handleCancelParty = () => {
    Swal.fire({
      icon: "error",
      title: "파티 게시글 수정을 취소합니다",
      showConfirmButton: false,
      timer: 1500
  })
    navigate(`/partyDetail?postId=${postId}`);
  }

  return (
    <div className="container">
      <div className="main-container">
        <input
          type="file"
          id="fileInput"
          multiple
          style={{
            display: "none",
          }}
          accept="image/*"
          onChange={handleImage}
        />
        <label htmlFor="fileInput" className="mainImg-upload-button scroll">
          {image.length > 0 ? (
            image.map((img, index) => (
              <div key={index} className="mainImg">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Thumbnail ${index}`}
                />
              </div>
            ))
          ) : (
            <div className="mainImg-placeholder">썸네일 이미지 선택</div>
          )}
        </label>
      </div>
      <div className="recipe-editor">
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

        <div className="button-container">
          <button
            className="submit-button"
            // onClick={() => alert(content)}
            onClick={handleUploadParty}
          >
            수정
          </button>
          <button 
            className="cancel-button" 
            onClick={handleCancelParty}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default PartyWrite;


function Editor({title, content, setTitle, setContent}) {
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