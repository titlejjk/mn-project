import React,{useState} from 'react';
import SearchBar from '../../component/SearchBar/SearchBar';
import MainImg from '../../component/MainImg/MainImg';
import BoardRecipeCardList from '../../component/CardList/BoardRecipeCardList';
import UserImageCategory from "../../component/ImageCategory/UserImageCategory";
import PetTypeImageCategory from "../../component/ImageCategory/PetTypeImageCategory";

const RecipeBoard = () => {

    return ( 
      
      <div className='container'>
            {/* 메인 이미지 :  가장 좋아요가 많은 이미지가 출력된다. */}
          <div className='RecipeBoard-mainImg'>
              <MainImg/>
          </div>

          {/* 이미지 카테고리 */}
          <p style={titleStyle}>카테고리</p>
          <PetTypeImageCategory/>

          {/* 쉐프리스트 카테고리 */}
          <p  style={titleStyle }>쉐프 소개</p>
          <UserImageCategory/>

          {/* 레시피  검색창 */}
          <SearchBar />
                  
          {/* 레시피 전체 리스트 출력됨 */}
          <BoardRecipeCardList/>
      </div>
      
        
      );
  };


  //스타일 변수


  const titleStyle = {
    fontSize:'20px',
    margin:'0 0 27px 0',
    fontWeight: 'bold',
    
  };

export default RecipeBoard;