// PartyDetail.js
import './PartyDetail.css';
import Pagination from "../../lib/Pagination";
import { useState, useEffect, useRef } from "react";
import jwt_decode from 'jwt-decode';
import axios from "axios";

//import { useParams } from 'react-router-dom';   //id값을 전달하기 위한 params
//const { id } = useParams(); // URL 파라미터에서 id 추출
// 백엔드와 연동할 데이터 모음


// 페이지 로딩 시 출력되는 화면내용
export default function Page() {

    const [imageData, setImageData] = useState(null);

    const [profileImage, setProfileImage] = useState(null);

    const [followingEmail, setFollowingEmail] = useState("");

    const [list, setList] = useState([]);

    let inputReply = useRef();

    const [isFollowing, setIsFollowing] = useState(false);

    const [autoClick, setAutoClick] = useState(false);

    const [topic, setTopic] = useState("");

    const [reply, setReply] = useState([]);
     //초기값을 빈 배열로 설정

    const [currentPage, setCurrentPage] = useState(0);
    // 페이징 처리에 관련한 로직 및 상태 추가

    const [totalReplyCount, setTotalReplyCount] = useState(0);
    //전체 댓글의 개수를 표시

    const replyPerPage = 6;
    //한 페이지에 표시할 댓글의 수를 정의
    // 추가

    //토큰값 받아오기
    const userToken = localStorage.getItem('login-token');
    const decodedToken = jwt_decode(userToken);
    const userNum = decodedToken.userNum;
    const loginEmail = decodedToken.userEmail;

    // 현재 페이지의 URL을 가져옵니다.
    const currentURL = window.location.href;

    // URL에서 쿼리 문자열을 추출합니다.
    const queryString = currentURL.split('?')[1]; // ? 뒤의 쿼리 문자열을 추출합니다.

    // 쿼리 문자열을 파싱하여 객체로 변환합니다.
    const queryParams = {};
    if (queryString) {
      const queryParts = queryString.split('&');
      for (const part of queryParts) {
        const [key, value] = part.split('=');
        queryParams[key] = decodeURIComponent(value);
      }
    }

    // rcpNum 값을 추출합니다.
    const postId = queryParams.postId;

    const getList = ()=>{
      axios.get("http://localhost:9999/party/"+postId)
      .then(res=>{
        setList(res.data);
        console.log(res.data);
        // setFollowingEmail(res.data.userEmail);
      })
      .catch(error=>{
        console.log(error);
      });
    }

    useEffect(()=>{
      getList();
    }, [])

    //메인 이미지의 userProfile 불러오는 Axios
    useEffect(() => {
            // 이미지를 Axios로 불러옵니다.
            axios
                .get(`/party/image/${list.imageUrl}`, { responseType: 'arraybuffer' })
                .then((response) => {
                    const base64String = btoa(
                        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                    setImageData(`data:image/jpeg;base64,${base64String}`);
                })
                .catch((error) => {
                    console.error('Error fetching image:', error);
                });
        }, [list.imageUrl]);

    //글작성자의 userProfile 불러오는 Axios
    useEffect(() => {
      // 이미지를 Axios로 불러옵니다.
      axios
          .get(`/recipe/image/${list.userProfile}`, { responseType: 'arraybuffer' })
          .then((response) => {
              const base64String = btoa(
                  new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
              );
              setProfileImage(`data:image/png;base64,${base64String}`);
          })
          .catch((error) => {
              console.error('Error fetching image:', error);
          });
    }, [list.userProfile]);

    const getReply = ()=>{
      axios.get('http://localhost:9999/party/comment/rplList/'+postId)
      .then(res => {
        setReply(res.data);
        console.log(res.data);
        setTotalReplyCount(res.data.length); // 레시피 개수 설정
      })
      .catch(error => {
        console.log(error);
      });
    }

    useEffect(() => {
        getReply();
    }, [])
    //axios로 json데이터 가져오기


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

        <main className="party_detail_main">
          <div className="party_detail_image_container">
            {/* 메인 이미지 */}
            <img src={imageData} alt="main party" />
          </div>
          <div className="party_detail_summary">
            {/* 새 글 등록 시 제목 부분 */}
            <h2>{list.title}</h2>
          </div>
          {/* 구분선 */}
          <Divider />
          <div className="party_detail_step">
            <div className="title">축하내용</div>
            <div className="party_detail_step_item">
              <div className="party_detail_step_item_content">
                {list.content}
              </div>
            </div>
            <div className="party_detail_user">
              <div>
                <img src={profileImage} />
              </div>
              {/* 작성자 닉네임 */}
              <div className="title">{list.userNickname}</div>
              {/* 팔로우 버튼 */}
              <button
                style={{backgroundColor: isFollowing ? '#ff6a10' : '#ba7149'}}
                onClick={()=>{
                  axios.post("http://localhost:9999/follow/toggle", {
                    followerEmail: loginEmail,
                    followingEmail
                  })
                  .then(res=>{
                    setIsFollowing(!isFollowing);
                    console.log(res.data);
                  })
                  .catch(error=>{
                    console.log(error);
                  })
                }}>
                {isFollowing ? <Following /> : <Follow />}
              </button>
            </div>
          </div>
          <Divider />
          <div className="party_detail_reply">
            {/* 총 댓글 수 표시 */}
            <div className="title">댓글 {totalReplyCount}</div>
            {/* 댓글 입력 창 */}
            <div className="input">
              <div>
                <img
                  src="/images/chef01.png"
                  alt="user thumb"
                />
              </div>
              {/* 댓글 입력 시 댓글 목록에 추가되도록 기능 구현 */}
              <input ref={inputReply} type="text" />
              <button onClick={(e)=>{
                const content = inputReply.current.value;
                inputReply.current.value = "";
                axios.post("http://localhost:9999/party/comment/insert", {
                  postId,
                  userNum,
                  content
                })
                .then((res)=>{
                  console.log(res.data);
                  getReply();
                })
                .catch((error)=>{
                  console.log(error);
                });
              }}>등록</button>
            </div>
            {/* 등록된 댓글 나열 */}
            {currentReply.map((item, index) => (
                <div key={index} className="party_detail_reply_item">
                  <div className="image_container">
                    <img src="/images/chef01.png" alt="reply thumb" />
                  </div>
                  <div>
                    <div className="insight">
                      <span>{item.userNickname}</span>
                      <span>{item.createdAt}</span>
                    </div>
                    <p>{item.content}</p>
                  </div>
                </div>
              ))}

            <Pagination pageCount={Math.ceil(reply.length / replyPerPage)} onPageChange={handlePageChange} />

          </div>
        </main>

  );
}



// 구분선
function Divider() {
  return <div className="party_detail_divider" />;
}

function Follow(){
  return(
    // 팔로잉 하지 않을 때 활성화되는 버튼
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

function Following(){
  return(
    // 팔로잉 클릭 시 활성화되는 버튼
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