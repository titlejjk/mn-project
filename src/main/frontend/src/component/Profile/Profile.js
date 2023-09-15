import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const userToken = localStorage.getItem("login-token");
  const decodedToken = jwt_decode(userToken);
  const userNickname = decodedToken.userNickname;

  const [profileData, setProfileData] = useState({
    nickname: userNickname,
    followers: 0,
    following: 0,
    bio: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (userToken) {
          const decodedToken = jwt_decode(userToken);

          if (decodedToken && decodedToken.userEmail) {
            // 이메일 토큰 추출
            const userEmail = decodedToken.userEmail;

            // 프로필 데이터 가져오기
            const profileResponse = await axios.get(
              `/user/profile/${userEmail}`
            );
            const userData = profileResponse.data;
            const userProfile = userData.userProfile; // 프로필 이미지 파일 이름으로 수정
            console.log(userData);

            // 팔로워 수 가져오기
            const followersResponse = await axios.get(
              `/follow/followers/count/${userEmail}`
            );
            const followerCount = followersResponse.data;

            // 팔로잉 수 가져오기
            const followingResponse = await axios.get(
              `/follow/followings/count/${userEmail}`
            );
            const followingCount = followingResponse.data;

            // 프로필 이미지 가져오기
            const profileImageResponse = await axios.get(
              `/user/image/${userProfile}`,
              {
                responseType: "arraybuffer", // 이미지 데이터로 받음
              }
            );
            const profileImage = `data:image/jpeg;base64,${btoa(
              new Uint8Array(profileImageResponse.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )}`;

            // 프로필 데이터 업데이트
            setProfileData({
              nickname: decodedToken.userNickname,
              bio: userData.userIntroduction,
              profileImage: profileImage,
              followers: followerCount,
              following: followingCount,
            });
          } else {
            console.error("토큰에서 이메일 정보를 찾을 수 없습니다.");
          }
        }
      } catch (error) {
        console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-image">
        <img
          src={profileData.profileImage || "images/default_profile.png"}
          alt="Profile"
        />
      </div>
      <div className="profile-info">
        <h2>{profileData.nickname || "닉네임을 설정해주세요"}</h2>
        <div className="followers">
          <span>팔로워 {profileData.followers || 0}</span>
          <span>팔로잉 {profileData.following || 0}</span>
        </div>
        <hr />
        <p className="bio">{profileData.bio || "비어있음"}</p>
      </div>
    </div>
  );
};

export default Profile;