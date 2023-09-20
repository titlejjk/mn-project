import React, {useEffect, useState} from "react";
import "./MainPage.css";
import Banner from "../../component/Banner/Banner";
import MainPartyCardList from "../../component/CardList/MainPartyCardList";
import axios from "axios";
import RecipeCard from "../../component/CardList/RecipeCard";

function MainPage() {

    const [hotCards, setHotCards] = useState([]);
    const [cards, setCards] = useState([]);

    //초기값을 빈 배열로 설정

    const HotRecipeUrl = 'http://localhost:9999/recipe/like/order';
    useEffect(() => {
        axios.get(HotRecipeUrl)
            .then(response => {
                setHotCards(response.data);
                console.log(' 핫한메인 레시피 카드리스트:',response.data)
            })
            .catch(error => {
                // console.error(' 핫한메인 레시피 카드리스트 Error fetching data:', error);
            });
    }, [])

    const recipeUrl = 'http://localhost:9999/recipe/list';
    useEffect(() => {
        axios.get(recipeUrl)
            .then(response => {
                setCards(response.data);
            })
            .catch(error => {
                //console.error('메인 레시피 카드리스트 Error fetching data:', error);
            });
    }, [])



  return (
    <div className="MainPage container">
      <div className="imgWrapper">
        <Banner className="image" />
      </div>

      <div className="board-title">
        지금 <span style={{ color: "#ff6a10" }}>핫🔥한 </span>레시피
      </div>
        <div className='main-card-list container'>
            <div className="card-list">
                {Array.isArray(hotCards) && hotCards.slice(0,4).map((card, index) => (
                    <RecipeCard key={index} card={card} showTitle={false} showLikeBox={false} />
                ))}
            </div>
        </div>

      <div className="board-title">
        Today <span style={{ color: "#ff6a10" }}>레시피 </span>
      </div>
        <div className='main-card-list container'>
            <div className="card-list">
                {Array.isArray(cards) && cards.slice(0,4).map((card, index) => (
                    <RecipeCard key={index} card={card} showTitle={false} showLikeBox={false} />
                ))}
            </div>
        </div>

      <div className="board-title">
        오늘의 🎉<span style={{ color: "#ff6a10" }}>주인공 </span>
      </div>
      <MainPartyCardList />
    </div>
  );
}

export default MainPage;