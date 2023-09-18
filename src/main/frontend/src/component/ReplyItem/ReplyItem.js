// ReplyItem.js

import './ReplyItem.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 댓글을 생성하는 function
function ReplyItem({ rcpNum, rplNum, userProfile, userNickname, rplContent, rplRegdate, rplDeleted, loginNickname }) {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태 관리
    const [editedContent, setEditedContent] = useState(rplContent); // 편집한 댓글 내용

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const handleDeleteClick = () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        axios
          .post(`http://localhost:9999/recipe/reply/delete?rplNum=${rplNum}`)
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
      // editedContent를 서버에 업데이트하는 로직을 추가해야 합니다.
      // 예를 들어, axios를 사용하여 서버에 업데이트 요청을 보낼 수 있습니다.
      // 업데이트가 성공하면 setIsEditing(false); 를 호출하여 편집 모드를 끝냅니다.
      // 업데이트가 실패하면 오류를 처리할 수 있습니다.
      axios
          .post("http://localhost:9999/recipe/reply/update", {
            rplNum: rplNum,
            rplContent: editedContent
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
      setEditedContent(rplContent);
    };

    return (
      <div className="recipe_detail_reply_item">
        <div className="image_container">
          {/* 작성자 프로필 */}
          <img src={`http://localhost:9999/recipe/image/${userProfile}`} alt="reply thumb" />
        </div>
        <div>
          <div className="insight">
            <span>{userNickname}</span>
            <span>{rplRegdate}</span>
            {userNickname === loginNickname && !isEditing && (
              <>
                <button onClick={handleEditClick}>수정</button>
                <button onClick={handleDeleteClick}>삭제</button>
              </>
            )}
          </div>
          {isEditing ? (
            // 수정 모드에서는 입력창을 표시하고 버튼으로 저장 및 취소 기능 제공
            <div className="recipe_detail_reply_update_container">
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
            <p>{editedContent}</p>
          )}
        </div>
      </div>
    );
}

export default ReplyItem;