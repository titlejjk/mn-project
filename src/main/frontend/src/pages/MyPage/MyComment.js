import React from "react";
import MyPageNav from "../../component/MyPageNav/MyPageNav";
import Profile from "../../component/Profile/Profile";
import MyCommentList from "../../component/CardList/MyCommentList";
import "./MyPage.css";

const MyComment = () => {
  return (
    <div>
      <hr />
      <MyPageNav />
      <hr />
      <div className="mypage-content container">
      <Profile />
      <MyCommentList />
      </div>
    </div>
  );
};

export default MyComment;