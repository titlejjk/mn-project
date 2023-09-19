// RecipeDetail.jsx
import "./RecipeDetail.css";
import ReplyItem from "../../component/ReplyItem/ReplyItem";
import Pagination from "../../lib/Pagination";
import { useState, useEffect, useRef, useCallback } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import jwt_decode from 'jwt-decode';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// 페이지 로딩 시 출력되는 화면내용
export default function Page() {
    // RecipeDetail 페이지 조회 내용 담는 변수
    const [list, setList] = useState([]);
    // 서브이미지 담는 변수
    const [subImgData, setSubImgData] = useState([]);
    // 팔로잉 기능 연동 시 필요한 followingEmail
    const [followingEmail, setFollowingEmail] = useState("");
    // 현재 팔로잉한 상태인지 아닌지 표시해주는 변수
    const [isFollowing, setIsFollowing] = useState(false);
    // mqtt 버튼 클릭 시 메소드 실행하기 위해 필요한 변수
    const [autoClick, setAutoClick] = useState(false);
    // mqtt 기능 실행 후 받아온 데이터를 담는 변수
    const [topic, setTopic] = useState("");
    // 로그인한 유저의 프로필을 담는 변수
    const [loginProfile, setLoginProfile] = useState("");
    // 작성글 수정을 위한 useNavigate 선언
    const navigate = useNavigate();
    // 입력한 댓글 내용을 담기 위한 useRef 선언
    let inputReply = useRef();
    // 댓글 목록을 받아와 배열로 저장
    const [reply, setReply] = useState([]);
    // 페이징 처리에서 현재 페이지를 표시
    const [currentPage, setCurrentPage] = useState(0);
    //전체 댓글의 개수를 표시
    const [totalReplyCount, setTotalReplyCount] = useState(0);
    //한 페이지에 표시할 댓글의 수를 정의
    const replyPerPage = 6;

    //토큰값 받아오기
    const [userNum, setUserNum] = useState(0);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginNickname, setLoginNickname] = useState("");

    useEffect(() => {
        let decodedToken = null;
        const userToken = localStorage.getItem("login-token");
        if (userToken) {
            // 토큰 해석
            decodedToken = jwt_decode(userToken); // jwt 모듈을 사용하여 토큰 해석
            console.log("토큰 해석")
            if (decodedToken && decodedToken.userNum) {
                // 해석한 토큰에 이메일 정보가 있는지 확인하고, 있다면 이메일 값과 생일, 닉네임을 가져와서 설정
                setUserNum(decodedToken.userNum);
                setLoginEmail(decodedToken.userEmail);
                setLoginNickname(decodedToken.userNickname);
            } else {
            console.error("userNum 없음");
            }
        } else {

        }
    }, []);

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
    // rcpNum 값 추출하여 변수에 담기
    const rcpNum = queryParams.rcpNum;

    // RecipeDetail 페이지 조회를 위한 axios 요청
    const getList = () => {
        axios.get(`http://localhost:9999/recipe/detail?rcpNum=${rcpNum}`)
            .then(res => {
                setList(res.data);
                console.log(res.data);

                // 서브 이미지 경로 배열
                const subImages = res.data.subImgs.map((subImgData) => subImgData.subPath);
                setSubImgData(subImages);
                console.log(subImages);

                // 팔로잉 이메일 업데이트
                setFollowingEmail(res.data.userEmail);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getList();
    }, [])

    // 기존에 팔로잉한 대상인지 확인하는 axios
    useEffect(() => {
        // console.log(loginEmail);
        // console.log(followingEmail);
        axios.get(`http://localhost:9999/follow/isFollowing/${loginEmail}/${followingEmail}`)
            .then(res => {
                if (res.data) {
                    setIsFollowing(true);
                } else {
                    setIsFollowing(false);
                }
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [followingEmail]);

    // mqtt 호출하는 기능
    useEffect(() => {
        let intervalId;

        if (autoClick) {
            // 버튼이 클릭되면 5초마다 함수를 실행하는 인터벌을 설정합니다.
            intervalId = setInterval(() => {
                axios.get('http://localhost:9999/temperature/publish')
                    .then(res => {
                        setTopic(res.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }, 5000);
        } else {
            // 버튼이 클릭되지 않으면 인터벌을 제거합니다.
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌을 제거합니다.
        };
    }, [autoClick]);

    // 로그인한 유저의 프로필을 가져오는 axios
    useEffect(() => {
        axios.get(`http://localhost:9999/user/profile/${loginEmail}`)
            .then(res => {
                setLoginProfile(res.data.userProfile);
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    });

    // 댓글목록 배열을 가져오는 axios 요청
    const getReply = () => {
        axios.get(`http://localhost:9999/recipe/reply/rplList?rcpNum=${rcpNum}`)
            .then(res => {
                setReply(res.data);
                console.log(res.data);
                setTotalReplyCount(res.data.length); // 총 댓글수
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        getReply();
    }, [])

    //현재 페이지에 표시 되어야 할 카드의 시작 위치 계산
    //현재 페이지 * 한페이지에 표시할 카드 수 =  시작위치
    const offset = currentPage * replyPerPage;

    //현재 페이지에 표시되어야 할 카드들의 배열 구성
    //cards 배열에서 offset ~ offeset+cardsperPages범위를 슬라이스해서 현재 페이지에 가져온다.
    const currentReply = reply.slice(offset, offset + replyPerPage);

    //페이지 변경을 처리하며, 현재 페이지에 맞게 표시할 카드들을 슬라이스하여 렌더링하는 함수
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (

        <main className="recipe_detail_main">
            <div className="recipe_detail_image_container">
                {/* 메인 이미지 */}
                <img src={`http://localhost:9999/recipe/image/${list.mainPath}`} alt="main recipe" />
            </div>
            <div className="recipe_detail_summary">
                {/* 새 글 등록 시 제목 부분 */}
                <h2>{list.title}</h2>
                <br />
                {/* 마리 수, 소요 시간, 난이도 모음 */}
                <div className="recipe_detail_info">
                    <div>
                        <div>
                            <img className="dog" width="46" height="46" src="https://img.icons8.com/ios/50/dog--v1.png" alt="dog" />
                        </div>
                        {/* 마리 수 */}
                        <div>{list.servingSize}마리</div>
                    </div>
                    <div>
                        <div>
                            <img src="/images/time.png" alt="info logo"></img>
                        </div>
                        {/* 소요 시간 */}
                        <div>{list.cookingTime}분 이내</div>
                    </div>
                    <div>
                        <div>
                            <CookingLevel level={list.cookingLevel} />
                        </div>
                        {/* 난이도 */}
                        <div>{list.cookingLevel}</div>
                    </div>
                </div>
            </div>
            {/* 구분선 */}
            <Divider />
            {/* 요리에 필요한 재료와 양에 대한 정보 */}
            <div className="recipe_detail_ingre">
                <span className="title">재료</span>
                {/* 재료정보 */}
                <span>{list.ingredients}</span>
            </div>
            <Divider />
            <div className="recipe_detail_step">
                <div className="title">조리설명</div>
                <div className="recipe_detail_step_item">
                    {/* 서브 이미지 */}
                    <div>
                        <DetailSlider
                            items={subImgData}
                        />
                    </div>
                    {/* 조리설명 */}
                    <div
                        className="recipe_detail_step_item_content"
                        dangerouslySetInnerHTML={{ __html: list.content }}
                    />
                </div>
                {/* mqtt 메소드 */}
                <div className="recipe_detail_step_item_mqtt">
                    <p>끓는점 도달 여부</p>
                    <span>{topic}</span>
                    <div>
                        <button onClick={() =>
                            setAutoClick(!autoClick)
                        }>{autoClick ? 'mqtt 중지' : 'mqtt 시작'}</button>
                        <button onClick={() => {
                            axios.get('http://localhost:9999/temperature/reset')
                                .then(res => {
                                    setTopic(false);
                                    setAutoClick(false);
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }}>mqtt리셋</button>
                    </div>
                </div>
                <div className="recipe_detail_user">
                    <div>
                        {/* 작성자 프로필 */}
                        <img src={`http://localhost:9999/recipe/image/${list.userProfile}`} />
                    </div>
                    {/* 작성자 닉네임 */}
                    <div className="title">{list.userNickname}</div>
                    {/* 팔로우 버튼 */}
                    <button
                        style={{ backgroundColor: isFollowing ? '#ff6a10' : '#ba7149' }}
                        onClick={() => {
                            // 로그인 하지 않은 경우 등록 방지
                            if (!loginEmail) {
                                alert("로그인 후 이용해주시기 바랍니다");
                                return;
                            }
                            axios.post("http://localhost:9999/follow/toggle", {
                                followerEmail: loginEmail,
                                followingEmail
                            })
                                .then(res => {
                                    setIsFollowing(!isFollowing);
                                    console.log("눌림")
                                    console.log(res.data);
                                })
                                .catch(error => {
                                    console.log("안눌림")
                                    console.log(error);
                                })
                        }}>
                        {isFollowing ? <Following /> : <Follow />}
                    </button>
                </div>
            </div>
            {list.userNickname === loginNickname && (
                <div className="recipe_detail_update_container">
                    <button
                        onClick={() => {
                            navigate(`/recipeUpdate?rcpNum=${rcpNum}`);
                        }}
                    >
                        수정
                    </button>
                    <button
                        onClick={() => {
                            Swal.fire({
                                title: '정말 삭제하시겠습니까?',
                                text: '다시 되돌릴 수 없습니다. 신중하세요.',
                                icon: 'warning',
                                
                                showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
                                confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
                                cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
                                confirmButtonText: '확인', // confirm 버튼 텍스트 지정
                                cancelButtonText: '취소', // cancel 버튼 텍스트 지정
                            }).then(result => {
                                // 만약 Promise리턴을 받으면,
                                if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
                                    axios
                                    .delete(
                                        `http://localhost:9999/recipe/delete?rcpNum=${rcpNum}`
                                    )
                                    .then((res) => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "삭제되었습니다",
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        navigate("/recipeBoard");
                                    })
                                    .catch((error) => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "삭제 중 오류가 발생했습니다",
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    });
                                }
                            });
                        }}
                    >
                        삭제
                    </button>
                </div>
            )}
            <p className="recipe_detail_viewCount">조회수 : {list.viewCount}</p>
            <Divider />
            <div className="recipe_detail_reply">
                {/* 총 댓글 수 표시 */}
                <div className="title">댓글 {totalReplyCount}</div>
                {/* 댓글 입력 창 */}
                <div className="input">
                    <div>
                        <img
                            src={`http://localhost:9999/user/image/${loginProfile}`}
                            alt="user thumb"
                        />
                    </div>
                    {/* 댓글 입력 시 댓글 목록에 추가되도록 기능 구현 */}
                    <input ref={inputReply} type="text" />
                    <button onClick={() => {
                        const rplContent = inputReply.current.value;
                        inputReply.current.value = "";
                        // 로그인 하지 않은 경우 등록 방지
                        if (!loginEmail) {
                            alert("로그인 후 이용해주시기 바랍니다");
                            return;
                        }
                        // 로그인 한 경우 댓글 등록처리
                        axios.post("http://localhost:9999/recipe/reply/insert", {
                            userNum,
                            rcpNum,
                            rplContent
                        })
                            .then((res) => {
                                console.log(res.data);
                                getReply();
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }}>등록</button>
                </div>
                {/* 등록된 댓글 나열 */}
                {currentReply.map((item, index) => (
                    <ReplyItem key={index} {...item} rcpNum={rcpNum} loginNickname={loginNickname} />
                ))}
                {/* 댓글목록 페이징 처리 */}
                <Pagination pageCount={Math.ceil(reply.length / replyPerPage)} onPageChange={handlePageChange} />

            </div>
        </main>

    );
}



// 구분선
function Divider() {
    return <div className="recipe_detail_divider" />;
}

// 팔로잉 하지 않을 때 활성화되는 버튼
function Follow() {
    return (
        <span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                viewBox="0 -960 960 960"
                width="16"
            >
                <path
                    fill="#f4f4f4"
                    d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z"
                />
            </svg>
            팔로우
        </span>
    )
}

// 팔로잉 클릭 시 활성화되는 버튼
function Following() {
    return (
        <span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="16"
                height="16"
                viewBox="0 0 30 30"
            >
                <path
                    fill="#f4f4f4"
                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                />
            </svg>
            팔로잉
        </span>
    )
}

// 요리 난이도에 따른 이미지 변경
function CookingLevel({ level }) {
    if (level == 'hard') {
        return <img width='110' height='46' src="/images/level3.png" alt="level3 logo"></img>;
    } else if (level == 'normal') {
        return <img width='90' height='46' src="/images/level2.png" alt="level2 logo"></img>;
    } else if (level == 'easy') {
        return <img width='46' height='46' src="/images/level1.png" alt="level1 logo"></img>;
    } else {
        return null;
    }
}

// 조리순서별 이미지 슬라이더 처리
function DetailSlider({ items }) {

    const slickRef = useRef(null);

    const prev = useCallback(() => slickRef.current.slickPrev(), [])
    const next = useCallback(() => slickRef.current.slickNext(), [])

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    }

    return (
        <div>
            <Slider {...settings} ref={slickRef} nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
                {items.map((subImg, index) => (
                    <div key={index}>
                        <img
                            src={`http://localhost:9999/recipe/image/${subImg}`}
                            alt={`Recipe${index}`}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

// 이미지 슬라이더에서 다음 사진으로 넘기는 버튼
function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "block",
                filter: "opacity(0.5) drop-shadow(0 0 0 #625f5f)",
                zoom: "2.5"
            }}
            onClick={onClick}
        />
    );
}

// 이미지 슬라이더에서 이전 사진으로 넘기는 버튼
function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{...style, display: "block", filter: "opacity(0.5) drop-shadow(0 0 0 #625f5f)", zoom: "2.5" }}
            onClick={onClick}
        />
    );
}