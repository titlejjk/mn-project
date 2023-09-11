// ReplyItem.js

import './ReplyItem.css';
import Pagination from '../../lib/Pagination';

// 댓글을 생성하는 function
function ReplyItem({ userProfile, userNickname, rplContent, rplRegdate }) {
    return (
      <div className="recipe_detail_reply_item">
        <div className="image_container">
          <img src={userProfile} alt="reply thumb" />
        </div>
        <div>
          <div className="insight">
            <span>{userNickname}</span>
            <span>{rplRegdate}</span>
            <span>수정</span>
            <span>삭제</span>
          </div>
          <p>{rplContent}</p>
        </div>
      </div>
    );
}

export default ReplyItem;