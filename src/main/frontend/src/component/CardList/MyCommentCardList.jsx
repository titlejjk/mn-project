import React, { useState, useEffect } from "react";
import "./MyPageCardList.css";
import MyPageCard from "./MyPageCard";
import axios from "axios";
import Pagination from "../../lib/Pagination.jsx";
import jwt_decode from "jwt-decode"; // jwt_decode를 임포트

const MyCommentCardList = () => {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecipeCount, setTotalRecipeCount] = useState(0);
  const cardsPerPage = 9;
  const userToken = localStorage.getItem("login-token");

  useEffect(() => {
    if (userToken) {
      const decodedToken = jwt_decode(userToken);

      if (decodedToken && decodedToken.userNum) {
        const userNum = decodedToken.userNum;

        // 첫 번째 axios 호출: 사용자의 userNum을 백엔드에 전달하여 rcpNum 배열을 받아옵니다.
        axios
          .get(`/recipe/rcpNum?userNum=${userNum}`)
          .then((rcpResponse) => {
            const rcpNumArray = rcpResponse.data;
            console.log(rcpNumArray);

            // 각각의 rcpNum에 대해 데이터를 가져옵니다.
            const fetchDataForRcpNum = async () => {
              const promises = rcpNumArray.map(async (rcpNum) => {
                const response = await axios.get(
                  `/recipe/reply/myRplList?userNum=${userNum}&rcpNum=${rcpNum}`
                );
                return response.data;
              });

              // 모든 데이터를 병렬로 가져온 후 합칩니다.
              Promise.all(promises)
                .then((responses) => {
                  // responses는 각 rcpNum에 대한 데이터 배열을 포함합니다.
                  const allData = responses.flat(); // 배열을 하나로 합칩니다.
                  console.log(allData);
                  setCards(allData);
                  setTotalRecipeCount(allData.length);
                })
                .catch((error) => {
                  console.error("Error fetching data:", error);
                });
            };
            // fetchDataForRcpNum 함수 실행
            fetchDataForRcpNum();
          })
          .catch((error) => {
            console.error("Error fetching rcpNum:", error);
          });
      } else {
        console.error("토큰에서 userNum 정보를 찾을 수 없습니다.");
      }
    }
  }, [currentPage, userToken]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * cardsPerPage;
  const currentCards = cards.slice(offset, offset + cardsPerPage);

  return (
    <div className="my-page-card-list container">
      <div className="my-page-list-top">
        <p className="my-page-list-total-count">전체 {totalRecipeCount} 개 </p>
      </div>
      <div className="my-page-card-list">
        {Array.isArray(currentCards) &&
          currentCards.map((card, index) => (
            <MyPageCard key={index} card={card} showTitle={true} />
          ))}
      </div>
      <Pagination
        pageCount={Math.ceil(cards.length / cardsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyCommentCardList;
