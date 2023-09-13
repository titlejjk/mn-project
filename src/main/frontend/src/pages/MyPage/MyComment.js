import React from "react";
import MyPageNav from "../../component/MyPageNav/MyPageNav";
import Profile from "../../component/Profile/Profile";
import MyCommenList from "../../component/CardList/MyCommenList";

const MyComment = () => {
  return (
    <div>
      <hr />
      <MyPageNav />
      <hr />
      <div className="mypage-content container">
        <Profile />
        <MyCommenList />
      </div>
    </div>
  );
};

export default MyComment;
