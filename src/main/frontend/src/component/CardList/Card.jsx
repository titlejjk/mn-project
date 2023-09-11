import React, { useState , useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom"
import  axios from 'axios'

const Card = ({ card, showTitle, showLikeBox }) => {

    // card 객체에서 rcpNum 값을 가져옴
    //console.log("showTitle value:", showTitle); // showTitle 값 로깅

    // 레시피를 like 버튼을 누르면 서버에 전송
     //const [likes, setLikes] = useState(item.likes);

    const [userNum, setUserNum] = useState(0);
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
            
        }
    }, []);


    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        // 이미지를 Axios로 불러옵니다.
        axios
            .get(`/recipe/image/${card.mainPath}`, { responseType: 'arraybuffer' })
            .then((response) => {
                const base64String = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setImageData(`data:image/jpeg;base64,${base64String}`);
            })
            .catch((error) => {
                console.error('Error fetching image:', error);
            });
    }, [card.mainPath]);
    // 아이콘 like를 눌렀을 때
    const [isLiked, setIsLiked ] = useState(false);
    const handleToggleLike = (rcpNum, userNum) => {
        // 좋아요 상태를 토글
        setIsLiked((prevIsLiked) => !prevIsLiked);
        // 서버로 좋아요 토글 요청 보내기
        axios.post('http://localhost:9999/recipe/like/toggle', { rcpNum,userNum })
            .then((response) => {
                // 요청이 성공한 경우 서버 응답에 따라 추가 작업 수행
                if (response.data === 'Like Inserted') {
                    // 좋아요가 추가되었을 때 수행할 작업
                    console.log('좋아요 추가됨');
                } else {
                    // 좋아요가 취소되었을 때 수행할 작업
                    console.log('좋아요 취소됨');
                }
            })
            .catch((error) => {
                // 요청이 실패한 경우 에러 처리
                console.error('좋아요 토글 요청 실패:', error);
            });
    };


    return (
        <div className="card">
            <Link to={`/RecipeDetail?rcpNum=${card.rcpNum}`}>
                <img className="card-img" src={imageData}  alt={card.title} />
            </Link>

            <div className='card-box'>
            {showTitle && (
                <div className='card-title-box'>
                    <h2 className="cardList-title">{card.title}</h2>
                </div>
            )}
            {showLikeBox && (
                <div className='like-box'>
                        <button className='heart-btn' onClick={() => handleToggleLike(card.rcpNum, userNum)}>
                            <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} style={{ color: isLiked ? '#ff6a10' : 'black' }} />
                        </button>
                        {/* <p>{likes}</p> */}
                    </div>
            )}
            </div>
        </div>
    );
};

export default Card;