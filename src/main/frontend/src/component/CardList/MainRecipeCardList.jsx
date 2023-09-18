import React, { useState, useEffect} from 'react';
import './CardList.css';
import RecipeCard from './RecipeCard';
import axios from 'axios';

//paging 처리 없는 main 카드리스트
const MainRecipeCardList = () => {
    const [cards, setCards] = useState([]);
     //초기값을 빈 배열로 설정

    const recipeUrl = 'http://localhost:9999/recipe/list';
    useEffect(() => { 
        axios.get(recipeUrl)
        .then(response => {
            setCards(response.data);
        })
        .catch(error => {
           console.error('메인 레시피 카드리스트 Error fetching data:', error);
        });
    }, [])
   
    return (
        <div className='main-card-list container'>
        <div className="card-list">
            {Array.isArray(cards) && cards.slice(0,4).map((card, index) => (
                <RecipeCard key={index} card={card} showTitle={false} showLikeBox={false} />
            ))}
                </div>
                </div>
    );
};

export default MainRecipeCardList;





