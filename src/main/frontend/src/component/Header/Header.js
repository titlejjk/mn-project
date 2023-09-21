import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import Swal from "sweetalert2";

function Header({ currentToken, tokenChanged }) {
  // public 폴더까지의 상대 경로 계산: 빌드 환경에 따라 사용하는 것이 좋습니다.
  const publicPath = process.env.PUBLIC_URL;
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (currentToken) {
      console.log("토큰o: " + currentToken);
    } else {
      localStorage.removeItem("login-token");
      console.log("토큰x: " + currentToken);
    }
  }, [currentToken]);

  const logout = () => {
    localStorage.removeItem('login-token');
    tokenChanged(null);
    Swal.fire({
      title: "로그아웃 되셨습니다🤗 <br/> 또 만나요!",
      showConfirmButton: false,
      timer: 1500
    })
  };

  const loginLink = (
      <ul>
        <li>
          <Link to="/myPage">마이페이지</Link>
        </li>
        <li>
          <Link to="/" onClick={logout}>
            로그아웃
          </Link>
        </li>
      </ul>
  );

  const logoutLink = (
      <ul>
        <li>
          <Link to="/login">로그인</Link>
        </li>
        <li>
          <Link to="/signup">회원가입</Link>
        </li>
      </ul>
  );

  const searchInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    console.log("검색어: ", keyword);
  };

  return (
      <div className="header-container">
        <div className="header">
          <div className="header-left">
            <img
                className="logo"
                src={`${publicPath}/images/mnLogo02.png`}
                alt="logo"
            />
            <nav className="main-nav">
              <ul>
                <li>
                  <Link
                      className={`navbar ${
                          location.pathname === "/" ? "active" : ""
                      }`}
                      to={"/"}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                      className={`navbar ${
                          location.pathname === "/noticeBoard" ? "active" : ""
                      }`}
                      to={"/noticeBoard"}
                  >
                    공지
                  </Link>
                </li>
                <li>
                  <Link
                      className={`navbar ${
                          location.pathname === "/recipeBoard" ? "active" : ""
                      }`}
                      to={"/recipeBoard"}
                  >
                    레시피
                  </Link>
                </li>
                <li>
                  <Link
                      className={`navbar ${
                          location.pathname === "/partyBoard" ? "active" : ""
                      }`}
                      to={"/partyBoard"}
                  >
                    축하파티
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <nav className="sub-nav">
              {currentToken ? loginLink : logoutLink}
            </nav>
            <form onSubmit={searchSubmit}>
              <div className="search">
                <input
                    className="search-input"
                    type="text"
                    placeholder="통합 검색"
                    value={keyword}
                    onChange={searchInputChange}
                />
                <button id="searchBtn" type="submit"></button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default Header;