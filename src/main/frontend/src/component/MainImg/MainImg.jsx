import { useEffect,useState } from "react";
import React  from 'react';
import axios from "axios";

const MainImg = () => {
    const [mostLikedRecipe, setMostLikedRecipe] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:9999/recipe/like/order')
            .then((response) => {
                // 데이터를 받아왔을 때, 첫 번째 레시피를 가져옵니다.
                const recipes = response.data;
                if (recipes.length > 0) {
                    const firstRecipe = recipes[0];
                    setMostLikedRecipe(firstRecipe);
                }
                console.log(recipes)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="mainImg">
            {mostLikedRecipe && (
                <img  src={`http://localhost:9999/recipe/image/${mostLikedRecipe.mainPath}`}
                    alt={mostLikedRecipe.title}
                    style={mainImg}
                />
            )}
        </div>
    );
};

const mainImg = {
    width: '1280px',
    height: '500px',
    margin: '5px 0 50px',
    objectFit: "cover"
};

export default MainImg;