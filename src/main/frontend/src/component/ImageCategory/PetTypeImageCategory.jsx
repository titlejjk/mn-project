import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import './ImageCategory.css'

//만든 categories를 map으로 category 객체와 index 값을 가져와서 각각의 key값과 대입이 되어야 할 값을 넣어준다
const PetTypeImageCategory= () => {
    //console.log(categories)


    const ImagesCategories = [
        { categoryName: '반려묘',categoryImage: '/images/animal01.png' , petNum:1 },
        { categoryName: '반려견', categoryImage: '/images/animal02.png', petNum:2},
        { categoryName: '반려조', categoryImage: '/images/animal03.png' , petNum:3},
        { categoryName: '반려햄', categoryImage: '/images/animal04.png' , petNum:4},
        { categoryName: '기타', categoryImage: '/images/animal05.png' , petNum:5},
    ];


    return (
        //categoryList를 새로 만들었다
        <div className="PetType-category-list">
            {ImagesCategories && ImagesCategories.map((ImagesCategory, index) => (
                <div key={index} className="images-category">
                    <Link to={`/boardRecipeCardList/`+ ImagesCategory.petNum}className="category">
                        <img src={ImagesCategory.categoryImage} alt={ImagesCategory.categoryName} />
                        <p>{ImagesCategory.categoryName}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default PetTypeImageCategory;