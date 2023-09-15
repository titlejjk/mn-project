import React, { useState, useEffect } from "react";
import "./MyComment.css";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const MyCommentList = () => {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCommentCount, setTotalCommentCount] = useState(0);
  const cardsPerPage = 9;
  const userToken = localStorage.getItem("login-token");
  const [buttonType, setButtonType] = useState("recipe"); // 기본값은 'recipe'

  const fetchData = async (type) => {
    if (userToken) {
      const decodedToken = jwt_decode(userToken);

      if (decodedToken && decodedToken.userNum) {
        const userNum = decodedToken.userNum;

        let url, params;

        if (type === "party") {
          url = `/party/postId/${userNum}`;
          params = { userNum };
        } else {
          url = `/recipe/rcpNum?userNum=${userNum}`;
        }

        try {
          const rcpResponse = await axios.get(url, { params });
          const rcpNumArray = rcpResponse.data;
          console.log(rcpNumArray);

          const fetchDataForRcpNum = async () => {
            const promises = rcpNumArray.map(async (id) => {
              let response;
              if (type === "party") {
                response = await axios.get(
                  `/party/comment/myRplList/${userNum}/${id}`
                );
              } else {
                response = await axios.get(
                  `/recipe/reply/myRplList?userNum=${userNum}&rcpNum=${id}`
                );
              }
              console.log(response.data);
              return response.data;
            });

            try {
              const responses = await Promise.all(promises);
              const allData = responses.flat();
              console.log(allData);
              setCards(allData);
              setTotalCommentCount(allData.length);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };

          fetchDataForRcpNum();
        } catch (error) {
          console.error("Error fetching comment data:", error);
        }
      } else {
        console.error("토큰에서 userNum 정보를 찾을 수 없습니다.");
      }
    }
  };

  useEffect(() => {
    fetchData(buttonType);
  }, [buttonType]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleButtonClick = (type) => {
    setButtonType(type);
    setCurrentPage(0);
  };

  const offset = currentPage * cardsPerPage;
  const currentCards = cards.slice(offset, offset + cardsPerPage);

  return (
    <div className="my-comment-card-list container">
      <div className="my-comment-list-top">
        <div>
          <button
            className={`my-recipe-button ${
              buttonType === "recipe" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("recipe")}
          >
            레시피
          </button>
          <button
            className={`my-party-button ${
              buttonType === "party" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("party")}
          >
            축하파티
          </button>
        </div>
        <p className="my-comment-list-total-count">
          전체 {totalCommentCount} 개{" "}
        </p>
      </div>
      <div
        className={
          buttonType === "recipe"
            ? "my-comment-card-list"
            : "my-ptcomment-card-list"
        }
      >
        {Array.isArray(currentCards) &&
          currentCards.map((card, index) => (
            <div key={index} className="my-comment-card-item">
              {buttonType === "recipe" ? (
                <Link to={`/RecipeDetail?rcpNum=${card.rcpNum}`}>
                  <div className="my-comment-content">{card.rplContent}</div>
                  <div className="my-comment-date">
                    <span>{card.rplRegdate}</span>
                  </div>
                </Link>
              ) : (
                <Link to={`/PartyDetail?postId=${card.postId}`}>
                  <div className="my-comment-content">{card.content}</div>
                  <div className="my-comment-date">
                    <span>{card.createdAt}</span>
                  </div>
                </Link>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyCommentList;
