// PartyDetail.js
import './PartyDetail.css';
import Pagination from "../../lib/Pagination";
import { useState, useEffect, useRef } from "react";
import jwt_decode from 'jwt-decode';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// 페이지 로딩 시 출력되는 화면내용
export default function Page() {
  // PartyDetail 페이지 조회 내용 담는 변수
  const [list, setList] = useState([]);
  // 팔로잉 기능 연동 시 필요한 followingEmail
  const [followingEmail, setFollowingEmail] = useState("");
  // 현재 팔로잉한 상태인지 아닌지 표시해주는 변수
  const [isFollowing, setIsFollowing] = useState(false);
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
  // postId 값 추출하여 변수에 담기
  const postId = queryParams.postId;

  // PartyDetail 페이지 조회를 위한 axios 요청
  const getList = () => {
    axios.get(`http://localhost:9999/party/${postId}`)
      .then(res => {
        setList(res.data);
        console.log(res.data);

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
    axios.get(`http://localhost:9999/party/comment/commentList/${postId}`)
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
        <img src={`http://localhost:9999/party/image/${list.imageUrl}`} alt="main party" />
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
          <div 
            // 축하내용
            className="party_detail_step_item_content"
            dangerouslySetInnerHTML={{ __html: list.content }}
          />
        </div>
        <div className="party_detail_user">
          <div>
            {/* 작성자 프로필 */}
            <img src={`http://localhost:9999/party/image/${list.userProfile}`} />
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
                  console.log(res.data);
                })
                .catch(error => {
                  console.log(error);
                })
            }}>
            {isFollowing ? <Following /> : <Follow />}
          </button>
        </div>
      </div>
      {list.userNickname === loginNickname && (
        <div className="party_detail_update_container">
          <button
            onClick={() => {
              navigate(`/partyUpdate?postId=${postId}`);
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
                        `http://localhost:9999/party/${postId}`
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
      <p className="party_detail_viewCount">조회수 : {list.viewCount}</p>
      <Divider />
      <div className="party_detail_reply">
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
          <button onClick={(e) => {
            const content = inputReply.current.value;
            inputReply.current.value = "";
            // 로그인 하지 않은 경우 등록 방지
            if (!loginEmail) {
              alert("로그인 후 이용해주시기 바랍니다");
              return;
            }
            axios.post("http://localhost:9999/party/comment/insert", {
              postId,
              userNum,
              content
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
        {currentReply.map((item, index) => {
          return (
            <PartyReply
              item={item}
              list={list}
              postId={postId}
              loginNickname={loginNickname}
            />
          );
        })}
        {/* 댓글목록 페이징 처리 */}
        <Pagination pageCount={Math.ceil(reply.length / replyPerPage)} onPageChange={handlePageChange} />

      </div>
    </main>

  );
}



// 구분선
function Divider() {
  return <div className="party_detail_divider" />;
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

function PartyReply({ item, list, postId, loginNickname }) {

  // 편집 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  // 편집한 댓글 내용
  const [editedContent, setEditedContent] = useState(item.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .post(`http://localhost:9999/party/comment/delete/${item.commentId}`)
        .then((res) => {
          alert("삭제 되었습니다.");
          setEditedContent("삭제된 댓글입니다");
        })
        .catch((error) => {
          alert("삭제 중 오류가 발생하였습니다.");
        });
    }
  };

  const handleSaveEdit = () => {
    axios
      .post("http://localhost:9999/recipe/reply/update", {
        commentId: item.commentId,
        content: editedContent
      })
      .then((res) => {
        alert("댓글이 수정되었습니다.");
        setIsEditing(false);
        setEditedContent(editedContent);
      })
      .catch((error) => {
        alert("삭제 중 오류가 발생하였습니다.");
      });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(item.content);
  };

  return (
    <div key={item.commentId} className="party_detail_reply_item">
      <div className="image_container">
        {/* 댓글 작성자 프로필 */}
        <img src={`http://localhost:9999/user/image/${list.userProfile}`} alt="reply thumb" />
      </div>
      <div>
        <div className="insight">
          {/* 댓글 작성자 닉네임 */}
          <span>{item.userNickname}</span>
          {/* 댓글 작성일자 */}
          <span>{item.createdAt}</span>
          {item.userNickname === loginNickname && !isEditing && (
            <>
              <button onClick={handleEditClick}>수정</button>
              <button onClick={handleDeleteClick}>삭제</button>
            </>
          )}
        </div>
        {isEditing ? (
          // 수정 모드에서는 입력창을 표시하고 버튼으로 저장 및 취소 기능 제공
          <div className="party_detail_reply_update_container">
            <textarea
              rows="4"
              cols="50"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div>
              <button onClick={handleCancelEdit}>취소</button>
              <button onClick={handleSaveEdit}>저장</button>
            </div>
          </div>
        ) : (
          // 수정 모드가 아닐 때는 댓글 내용 표시
          <p>{item.deleted==='yes' ? "삭제된 댓글입니다" : editedContent}</p>
        )}
      </div>
    </div>
  )
}