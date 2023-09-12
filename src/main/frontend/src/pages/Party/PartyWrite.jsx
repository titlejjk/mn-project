import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "react-quill/dist/quill.snow.css";
import "./PartyWrite.css";
import Editor from "../../component/Editor/Editor";

function PartyWrite() {
  const [userNum, setUserNum] = useState(0);  //유저 번호
  const [title, setTitle] = useState(""); //제목
  const [content, setContent] = useState(""); //내용
  const [image, setImage] = useState(""); //썸네일 사진
  const navigate = useNavigate();

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
  };

  const handleUploadParty = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userNum", userNum);  //유저 번호
    formData.append("title", title); //제목
    formData.append("content", content); //글 내용
    formData.append("image", image[0]); //썸네일 사진

    console.log(formData);
    console.log(
      userNum + "\n" +
      title + "\n" +
      content + "\n" + 
      image + "\n"
    );

    axios
      .post("/party/insert", formData, {
        headers: {
          "Content-Type": "multipart/image",
        },
      })
      .then((response) => {
        console.log("파티 업로드 성공:", response.data);
        // 성공 시 메시지 표시 및 마이페이지로 이동
        alert("파티 게시글이 업로드 되었습니다");
        navigate("/partyBoard");
      })
      .catch((error) => {
        console.error("파티 업로드 실패:", error);
        // 실패 시 오류 메시지 표시
        alert("파티 게시글 업로드가 실패했습니다.");
      });
  };

  const handleCancelParty = () => {
    alert("파티 게시글 작성을 취소합니다");
    navigate("/partyBoard");
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
          setTitle={setTitle} 
          setContent={setContent} 
        />

        <div className="button-container">
          <button
            className="submit-button"
            // onClick={() => alert(content)}
            onClick={handleUploadParty}
          >
            작성
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
