import React, { useState , useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import  axios from 'axios'
const PartyCard = ({ card, showTitle, showLikeBox }) => {
    const [userNum, setUserNum] = useState(0);
    const [imageData, setImageData] = useState(null);
    const [isLiked, setIsLiked] = useState(null);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json', // JSON 형식으로 보낼 것을 명시
        },
    };

    useEffect(() => {
        const newToken = localStorage.getItem('login-token');
        if (newToken) {
            const decodedToken = jwt_decode(newToken);
            if (decodedToken && decodedToken.userNum) {
                setUserNum(decodedToken.userNum);
            } else {
                console.error("userNum 없음");
            }
        } else {
            // 토큰이 없는 경우에 대한 처리
        }
    }, []);

    useEffect(() => {
        axios.get(`/party/image/${card.imageUrl}`, { responseType: 'arraybuffer', ...axiosConfig })
            .then((response) => {
                const base64String = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setImageData(`data:image/jpeg;base64,${base64String}`);
            })
            .catch((error) => {
                console.error('Error fetching image:', error);
            });
    }, [card.imageUrl]);

    useEffect(() => {
        axios.get(`http://localhost:9999/party/like/isLiked`, { userNum },axiosConfig)
            .then((response) => {
                setIsLiked(response.data === "Liked");
            })
            .catch((error) => {
                console.error("좋아요 상태 가져오기 실패:", error);

                // 좀 더 자세한 오류 정보를 클라이언트에 표시하려면 다음과 같이 수정합니다.
                if (error.response) {
                    console.error('서버 응답 상태 코드:', error.response.status);
                    console.error('서버 응답 데이터:', error.response.data);
                } else if (error.request) {
                    console.error('서버 응답 없음');
                } else {
                    console.error('요청 전 오류:', error.message);
                }
            });
    }, [userNum]);


    const handleToggleLike = (rcpNum) => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
        axios.post('http://localhost:9999/party/like/toggle', { rcpNum, userNum }, axiosConfig)
            .then((response) => {
                if (response.data === 'Like Inserted!') {
                    console.log('좋아요 추가됨');
                } else {
                    console.log('좋아요 취소됨');
                }
            })
            .catch((error) => {
                console.error('좋아요 토글 요청 실패:', error);

                // 좀 더 자세한 오류 정보를 클라이언트에 표시하려면 다음과 같이 수정합니다.
                if (error.response) {
                    console.error('서버 응답 상태 코드:', error.response.status);
                    console.error('서버 응답 데이터:', error.response.data);
                } else if (error.request) {
                    console.error('서버 응답 없음');
                } else {
                    console.error('요청 전 오류:', error.message);
                }
            });
    };

    return (
        <div className="card">
            <Link to={`/partyDetail?postNum=${card.postNum}`}>
                <img className="card-img" src={imageData} alt={card.title} />
            </Link>

            <div className='card-box'>
                {showTitle && (
                    <div className='card-title-box'>
                        <h2 className="cardList-title">{card.title}</h2>
                    </div>
                )}
                {showLikeBox && (
                    <div className='like-box'>
                        <button className='heart-btn' onClick={() => handleToggleLike(card.rcpNum)}>
                            <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} style={{ color: isLiked ? '#ff6a10' : 'black' }} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartyCard;

