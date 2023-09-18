import React, { useState, useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "react-quill/dist/quill.snow.css";
import "./RecipeWrite.css";
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"
import "../../component/Editor/Editor.css"
import Swal from "sweetalert2";

function RecipeUpdate() {
  const [userNum, setUserNum] = useState(0); //유저 번호
  const [petNum, setPetNum] = useState(1); //펫 카테고리
  const [title, setTitle] = useState(""); //제목
  const [servingSize, setServingSize] = useState(0); //n인분
  const [cookingTime, setCookingTime] = useState(0); //조리 시간
  const [cookingLevel, setCookingLevel] = useState(""); //조리 난이도
  const [ingredients, setIngredients] = useState("");
  const [content, setContent] = useState(""); //내용
  const [mainImg, setMainImg] = useState("");
  const [subImgs, setSubImgs] = useState([]); //서브 이미지
  const [viewCount, setViewCount] = useState(0); //조회수
  const [list, setList] = useState([]);
  // subNum 배열 담는 변수
  const [subNums, setSubNums] = useState([]);

  const navigate = useNavigate();

  // 현재 페이지의 URL 가져오기
  const currentURL = window.location.href;
  // URL에서 쿼리 문자열 추출
  const queryString = currentURL.split("?")[1]; // ? 뒤의 쿼리 문자열 추출
  // 쿼리 문자열을 파싱하여 객체로 변환
  const queryParams = {};
  if (queryString) {
    const queryParts = queryString.split("&");
    for (const part of queryParts) {
      const [key, value] = part.split("=");
      queryParams[key] = decodeURIComponent(value);
    }
  }
  // rcpNum 값 추출하여 변수에 담기
  const rcpNum = queryParams.rcpNum;

  const getData = () => {
    axios
      .get(`http://localhost:9999/recipe/detail?rcpNum=${rcpNum}`)
      .then((res) => {
        setList(res.data);

        // subNum 배열 subNums에 담기
        const subNumArray = res.data.subImgs.map((subImgData) => subImgData.subNum);
        setSubNums(subNumArray);
        console.log(subNumArray);
        
        setServingSize(res.data.servingSize);
        setCookingTime(res.data.cookingTime);
        setCookingLevel(res.data.cookingLevel);
        setIngredients(res.data.ingredients);
        setTitle(res.data.title);
        setContent(res.data.content);
        setViewCount(res.data.viewCount);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const newToken = localStorage.getItem("login-token");
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

  const handleMainImg = (e) => {
    setMainImg([...e.target.files]);
  };

  const handlePetNum = (e) => {
    setPetNum(e.target.value);
  };

  const handleSize = (e) => {
    setServingSize(e.target.value);
  };

  const handleTime = (e) => {
    setCookingTime(e.target.value);
  };

  const handleLevel = (e) => {
    setCookingLevel(e.target.value);
  };

  const handleIngred = (e) => {
    setIngredients(e.target.value);
  };

  const handleSubImgs = (e) => {
    setSubImgs([...e.target.files]);
  };

  const handleUploadRecipe = (e) => {
    e.preventDefault();
    const formData = new FormData();
    // formData.append("userNum", userNum); //유저 번호
    formData.append("title", title); //제목
    // formData.append("petNum", petNum); //카테고리
    formData.append("servingSize", servingSize); //제공 분량
    formData.append("cookingTime", cookingTime); //조리 시간
    formData.append("cookingLevel", cookingLevel); //난이도
    formData.append("ingredients", ingredients); //재료
    formData.append("content", content); //글 내용
    formData.append("imageFile", mainImg[0]); //썸네일 사진

    formData.append("subNums", subNums); //subNum 배열

    subImgs.map(
      (subImg) => formData.append("subImages", subImg) //조리 사진
    );
    // formData.append("viewCount", viewCount); //조회수

    axios
      .post(`http://localhost:9999/recipe/update?rcpNum=${rcpNum}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      .then((response) => {
        console.log("레시피 수정 성공:", response.data);
        // 성공 시 메시지 표시 및 디테일페이지로 이동
        Swal.fire({
          icon: "success",
          title: "레시피가 수정되었습니다",
          showConfirmButton: false,
          timer: 1500
      })
        navigate(`/recipeDetail?rcpNum=${rcpNum}`);
      })
      .catch((error) => {
        console.error("레시피 수정 실패:", error);
        // 실패 시 오류 메시지 표시
        Swal.fire({
          icon: "error",
          title: "레시피 수정에 실패했습니다",
          showConfirmButton: false,
          timer: 1500
      })
      });
  };

  const handleCancelRecipe = () => {
    Swal.fire({
      icon: "error",
      title: "레시피 수정을 취소합니다",
      showConfirmButton: false,
      timer: 1500
  })
    navigate(`/recipeDetail?rcpNum=${rcpNum}`);
  };

  return (
    <div className="container">
      <div className="main-container">
        <input
          type="file"
          id="mainInput"
          style={{
            display: "none",
          }}
          accept="image/*"
          onChange={handleMainImg}
        />
        <label htmlFor="mainInput" className="mainImg-upload-button scroll">
            {mainImg.length > 0 ? (
                        mainImg.map((img, index) => (
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

      <div className="recipe-info">
        <p className="recipe-info-text">레시피 정보</p>
        카테고리
        <select
          className="recipe-info-select"
          name="size"
          id="size"
          value={petNum}
          onChange={handlePetNum}
        >
          <option value="">선택</option>
          <option value="1">반려견</option>
          <option value="2">반려묘</option>
          <option value="3">반려조</option>
          <option value="4">반려햄</option>
          <option value="5">기타</option>
        </select>
        기준
        <select
          className="recipe-info-select"
          name="size"
          id="size"
          value={servingSize}
          onChange={handleSize}
        >
          <option value="">선택</option>
          <option value="1">1마리</option>
          <option value="2">2마리</option>
          <option value="3">3마리</option>
          <option value="4">4마리</option>
          <option value="5">5마리 이상</option>
        </select>
        시간
        <select
          className="recipe-info-select"
          name="time"
          id="time"
          value={cookingTime}
          onChange={handleTime}
        >
          <option value="">선택</option>
          <option value="10">10분 이내</option>
          <option value="20">20분</option>
          <option value="30">30분</option>
          <option value="40">40분</option>
          <option value="50">50분</option>
          <option value="60">60분 이상</option>
        </select>
        난이도
        <select
          className="recipe-info-select"
          name="level"
          id="level"
          value={cookingLevel}
          onChange={handleLevel}
        >
          <option value="">선택</option>
          <option value="easy">쉬움</option>
          <option value="normal">보통</option>
          <option value="hard">어려움</option>
        </select>
      </div>

      <div className="ingred-info">
        <label htmlFor="ingred">재료</label>
        <input
          className="ingred-info-input"
          type="text"
          id="ingred"
          value={ingredients}
          onChange={handleIngred}
          placeholder="예) 바나나 10g, 꿀 3g"
        />
      </div>

      <div className="recipe-editor">
        {/*
            component: react-quill Editor
            props: content, setContent
            => to pass data from child component(Editor) to parent component(NoticeWrite)
          */}
        <Editor title={title} content={content} setTitle={setTitle} setContent={setContent} />
        <div className="sub-container">
          <input
            type="file"
            id="subInput"
            multiple
            style={{
              display: "none",
            }}
            accept="image/*"
            onChange={handleSubImgs}
          />
          <label htmlFor="subInput" className="subImgs-upload-button">
            첨부파일
          </label>

          {/* selected file names */}
          <div className="selected-files scroll">
            {subImgs.map((subImg, index) => (
              <div className="file-name" key={index}>
                {subImg.name}
              </div>
            ))}
          </div>
        </div>

        <div className="button-container">
          <button
            className="submit-button"
            onClick={handleUploadRecipe}
            // onClick={handleUploadRecipe}
          >
            수정
          </button>
          <button className="cancel-button" onClick={handleCancelRecipe}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeUpdate;


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