import React from "react";
import Typed from 'react-typed';

import "./SocialWallPage.css";

class SocialWallPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage-container">
                <div class="banner-color"></div>
                <div class="homepage-title">
                    <div class="grid__item two">
                        <div className="h1 SocialWallPage">Social Wall</div>
                    </div>
                    
                    <div class="grid__item one">
                        <div class="h1 inline push-quarter--bottom push-quarter--right palm--flush--right palm--block lap--block">Power your</div>
                        <div class="typedjs" style={{ fontSize: "60px", fontFamily: "Roboto Mono" }}>
                            <Typed
                                strings={[
                                    'private',
                                    'volunteer',
                                    'personal']}
                                    typeSpeed={70}
                                    backSpeed={30}
                                    preStringTyped={(arrayPos, obj) => {
                                        if (arrayPos === 0) {
                                            document.getElementsByClassName("banner-color")[0].style.backgroundColor = 'rgb(17, 153, 142)';
                                            document.getElementsByClassName("banner-color")[0].style.backgroundImage = 'linear-gradient(-40deg, rgba(56, 239, 125, 0.8), rgba(255, 255, 255, 0))';
                                        }
                                        if (arrayPos === 1) {
                                            document.getElementsByClassName("banner-color")[0].style.backgroundColor = 'rgb(255, 95, 109)';
                                            document.getElementsByClassName("banner-color")[0].style.backgroundImage ='linear-gradient(-40deg, rgba(255, 195, 113, 0.8), rgba(255, 255, 255, 0))';
                                        }
                                        if (arrayPos === 2) {
                                            document.getElementsByClassName("banner-color")[0].style.backgroundColor = 'rgb(29, 38, 113)';
                                            document.getElementsByClassName("banner-color")[0].style.backgroundImage ='linear-gradient(-40deg, rgba(195, 54, 116, 0.8), rgba(255, 255, 255, 0))';
                                        }
                                    }}
                                    loop >
                            </Typed>
                        </div>
                        <div class="h1 palm--push-quarter--top">community portal</div>
                        <h3 class="product-subtitle push-double--ends palm--push--top">All-in-one. Easy to set up.</h3>
                    </div>
                    <div class="grid__item three">
                        <img class="homeimage" src="https://dpp9m9ej5oell.cloudfront.net/assets/homepage/index/header-ec6c42bbc0aef1d2827beeeed791f61c879668da7d58e8857cd3842d84effeb6.png" ></img>
                    </div>
                </div>
                    
            </div>
        );
    }
}

export { SocialWallPage };



