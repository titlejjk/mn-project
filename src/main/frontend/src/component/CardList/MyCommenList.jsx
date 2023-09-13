import React, { useState, useEffect } from "react";
import "./MyComment.css";
import axios from "axios";
import { Link } from "react-router-dom"; // 라우터에서 Link 컴포넌트 임포트
import jwt_decode from "jwt-decode";

const MyCommentList = () => {
    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecipeCount, setTotalRecipeCount] = useState(0);
    const cardsPerPage = 9;
    const [activeButton, setActiveButton] = useState("my-rccomment-button");
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
                                console.log(response.data);
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

    const handleButtonClick = (buttonType) => {
        // 버튼 클릭 로직 추가
    };

    const offset = currentPage * cardsPerPage;
    const currentCards = cards.slice(offset, offset + cardsPerPage);

    return (
        <div className="my-comment-card-list container">
            <div className="my-comment-list-top">
                <div>
                    <button
                        className={`my-recipe-button ${
                            activeButton === "my-rccomment-button" ? "active" : ""
                        }`}
                        onClick={() => handleButtonClick("my-recipe-button")}
                    >
                        레시피
                    </button>
                    <button
                        className={`my-party-button ${
                            activeButton === "my-ptcomment-button" ? "active" : ""
                        }`}
                        onClick={() => handleButtonClick("my-party-button")}
                    >
                        축하파티
                    </button>
                </div>
                <p className="my-comment-list-total-count">
                    전체 {totalRecipeCount} 개{" "}
                </p>
            </div>
            <div className="my-comment-card-list">
                {Array.isArray(currentCards) &&
                    currentCards.map((card, index) => (
                        <div key={index} className="my-comment-card-item">
                            {/* rplContent를 화면에 보여주고, 해당 항목을 클릭하면 댓글 디테일 페이지로 이동 */}
                            <Link to={`/RecipeDetail?rcpNum=${card.rcpNum}`}>
                                {card.rplContent}
                            </Link>
                            <br />
                            <span>{card.rplRegdate}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MyCommentList;
