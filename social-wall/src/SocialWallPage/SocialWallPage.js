import React from "react";
import "./SocialWallPage.css";

class SocialWallPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="SocialWallPage">
                <div className="lander">
                    <h1>Social Wall</h1>
                    <p>A simple note taking app</p>
                </div>
            </div>
        );
    }
}

export { SocialWallPage };
