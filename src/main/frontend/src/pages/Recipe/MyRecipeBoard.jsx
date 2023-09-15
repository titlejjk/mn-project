import React, { useState } from "react";
import SearchBar from "../../component/SearchBar/SearchBar";
import MyRecipeCardList from "../../component/CardList/MyRecipeCardList";
import UserImageCategory from "../../component/ImageCategory/UserImageCategory";
import PetTypeImageCategory from "../../component/ImageCategory/PetTypeImageCategory";

const RecipeBoard = () => {
  return (
    <div className="container">
      {/* 이미지 카테고리 */}
      <p style={titleStyle}>카테고리</p>
      {/* <ImageCategory categories={ImagesCategories} />*/}
      <PetTypeImageCategory />
      {/* 쉐프리스트 카테고리 : card list  + slider 적용 */}
      <p style={titleStyle}>쉐프 소개</p>
      <UserImageCategory />
      {/* 레시피  검색창 */}
      <SearchBar />
      <MyRecipeCardList />
    </div>
  );
};

//스타일 변수

const titleStyle = {
  fontSize: "20px",
  margin: "0 0 27px 0",
  fontWeight: "bold",
};

export default RecipeBoard;
