import { useEffect,useState } from "react";
import React  from 'react';
import axios from "axios";

const MainImg = () => {
    const [mostLikedRecipe, setMostLikedRecipe] = useState([]);

    const [imageData, setImageData] = useState(null);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json', // JSON 형식으로 보낼 것을 명시
        },
    };

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

    useEffect(() => {
        axios.get(`/recipe/like/image/${mostLikedRecipe.mainPath}`, { responseType: 'arraybuffer', ...axiosConfig })
            .then((response) => {
                const base64String = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setImageData(`data:image/jpeg;base64,${base64String}`);
            })
            .catch((error) => {
                //console.error('Error fetching image:', error);
            });
    }, [mostLikedRecipe.mainPath]);

    return (
        <div className="mainImg">
            {mostLikedRecipe && (
                <img
                    src={imageData}
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
};

export default MainImg;