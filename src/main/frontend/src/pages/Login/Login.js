import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css"; // 기존 스타일 파일 임포트
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const Login = ({tokenChanged}) => {
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 이메일, 패스워드 정규식 표현
  const emailRegEx =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

  const emailCheck = (username) => {
    return emailRegEx.test(username);
  };

  const passwordCheck = (password) => {
    if (password.match(passwordRegEx) === null) {
      setPasswordError("비밀번호 형식을 확인해주세요");
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    // URL 파라미터에서 이메일 값을 읽어와 email 상태에 설정
    const queryParams = new URLSearchParams(location.search);
    const defaultEmail = queryParams.get("email") || "";
    setUserEmail(defaultEmail);
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailCheck(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (password.match(passwordRegEx) === null) {
      setPasswordError("비밀번호 형식을 확인해주세요");
      return;
    }

    try {
      // 실제 로그인 요청 처리 (axios를 사용하여 백엔드 API 호출)
      const response = await axios.post("/auth/login", {
        userEmail: email,
        userPassword: password,
      });
      // 로컬스토리지에 token 값 저장
      const token = response.data.token; // 응답 본문에서 토큰 추출
      localStorage.setItem("login-token", token); // 토큰 저장
      tokenChanged(token);
      const decodedToken = jwt_decode(token);
      console.log(decodedToken.roles);

      if (decodedToken.roles) {
        // 백엔드에서 받은 역할(role) 확인
        if (decodedToken.roles === "ADMIN") {
          Swal.fire({
            icon: "success",
            title: "관리자 로그인 성공😎",
            showConfirmButton: false,
            timer: 1500
          })
          navigate("/admin"); // 관리자 페이지로 이동
        } else {
          Swal.fire({
            icon: "success",
            title: "로그인 성공😊",
            showConfirmButton: false,
            timer: 1500
          })
          navigate("/"); // 일반 사용자 페이지로 이동
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "로그인 실패!",
        text: "아이디와 비밀번호를 다시 확인해주세요🤔",
        showConfirmButton: false,
        timer: 1500
      })
      console.error("로그인 오류:", error);
    }
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    if (!emailCheck(e.target.value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    passwordCheck(e.target.value);
  };

  return (
      <div className="login-container">
        <form className="login-form">
          <img src="images/mnLogo04.png" alt="mnLogo01" className="login-logo" />
          <input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
          />
          {emailError && <p className="error-message">{emailError}</p>}
          <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
          <button className="login-button" onClick={handleLogin}>
            로그인
          </button>
          <div className="login-links">
            <Link to="/ResetPwd" className="reset">
              비밀번호 재설정
            </Link>
            <Link to="/Signup">회원가입하기</Link>
          </div>
        </form>
      </div>
  );
};

export default Login;