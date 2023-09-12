import React, { useState, useEffect} from 'react';
import './CardList.css';
import PartyCard from './PartyCard';
import axios from 'axios';

const MainPartyCardList = () => {

    const [cards, setCards] = useState([]);
     //초기값을 빈 배열로 설정
    
    useEffect(() => { 
        axios.get('http://localhost:9999/party')
        .then(response => {
            setCards(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}, [])
   

    return (
        <div className='main-card-list container'>
        <div className="card-list">
            {Array.isArray(cards) && cards.slice(0,4).map((card, index) => (
                <PartyCard key={index} card={card} showTitle={false} showLikeBox={false}/>
            ))}
        </div>
        </div>
    );
};

export default MainPartyCardList;





