import React from 'react';
import { Button, ProgressBar } from 'react-bootstrap'
import Card from "react-bootstrap/Card";

import { store } from 'react-notifications-component';


import { userService } from '@/_services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons'
import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

import './LocalAuthPage.css'

class LocalAuthPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isIdeasWallActive: false,
            isIdeaFormActive: false,
            isPersonalIdeasViewActive: false,
            loading: true,
            ideas: []
        };

        this.handleToggleIdeaForm = this.handleToggleIdeaForm.bind(this);
        this.handleToggleIdeasWall = this.handleToggleIdeasWall.bind(this);
        this.getIdeas = this.getIdeas.bind(this);
        this.renderIdeasWall = this.renderIdeasWall.bind(this);
        this.renderIdeas = this.renderIdeas.bind(this);
        this.handleLevelUp = this.handleLevelUp.bind(this);
        this.handleToggleDefaultView = this.handleToggleDefaultView.bind(this);
        this.handleTogglePersonalIdeasView = this.handleTogglePersonalIdeasView.bind(this);
    }

    componentDidMount() {
        this.getIdeas();
    }

    handleToggleIdeasWall() {
        this.getIdeas();
        this.setState({isIdeasWallActive: true, isIdeaFormActive: false, isPersonalIdeasViewActive: false});
    }

    handleToggleIdeaForm() {
        this.setState({isIdeaFormActive: true, isIdeasWallActive: false, isPersonalIdeasViewActive: false});
    }

    handleToggleDefaultView() {
        this.setState({isIdeaFormActive: false, isIdeasWallActive: false, isPersonalIdeasViewActive: false});
    }

    handleTogglePersonalIdeasView() {
        this.getIdeas();
        this.setState({isIdeaFormActive: false, isIdeasWallActive: false, isPersonalIdeasViewActive: true});
    }

    getIdeas() {
        userService.getAllIdeas().then(ideas => {
            ideas.sort((a,b) => (a.thumbUp - a.thumbDown + a.heart < b.thumbUp - b.thumbDown + b.heart) ? 1 : -1); 
            this.setState({ ideas: ideas, loading: false})
        });
    }

    handleLevelUp(id) {
        userService.levelUpIdea(id).then(res=> {
            this.getIdeas();
            store.addNotification({
                title: 'Thumb Up',
                message: res.msg,
                type: 'warning',                         
                container: 'bottom-left',                // where to position the notifications
                animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                dismiss: {
                duration: 2000 
                }
           })
       });
    }

    handleLevelDown(id) {
        userService.levelDownIdea(id).then(res=> {
            this.getIdeas();
            store.addNotification({
                title: 'Thumb Down',
                message: res.msg,
                type: 'warning',                         
                container: 'bottom-left',                // where to position the notifications
                animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                dismiss: {
                duration: 2000 
                }
           })
       });
    }


    handleHeart(id) {
        userService.levelUpHeartsIdea(id).then(res=> {
            this.getIdeas();
            store.addNotification({
                title: 'Thumb Down',
                message: res.msg,
                type: 'warning',                         
                container: 'bottom-left',                // where to position the notifications
                animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                dismiss: {
                duration: 2000 
                }
           })
       });
    }

    renderIdeas(ideas) {

        const rows = [];
        for (let i = 0; i < ideas.length; i+=2)
            rows.push (
                <div className="IdeasWall-ideas-row">
                     <Card className="p-3 IdeasWall-idea-card">
                        <Card.Body className="IdeasWall-idea-card-body">
                            <Card.Title>{ideas[i].subject}</Card.Title>
                            <Card.Text> {ideas[i].description} </Card.Text>
                            <blockquote className="blockquote mb-0 card-body">
                                <footer className="blockquote-footer">
                                    <small className="text-muted">
                                    {ideas[i].user} in <cite title="Source Title">{ideas[i].tags}</cite>
                                    </small>
                            </footer>
                            </blockquote>
                            <div className="idea-reactionButtons">
                                <Button className="idea-level-up"  onClick={() => this.handleLevelUp(ideas[i]._id)}> <p>{ideas[i].thumbUp}</p><FontAwesomeIcon icon={faLevelUpAlt} /></Button>
                                <Button className="idea-level-down" onClick={() => this.handleLevelDown(ideas[i]._id)}> <p>{ideas[i].thumbDown}</p><FontAwesomeIcon icon={faLevelDownAlt} /></Button>
                                <Button className="idea-level-love" onClick={() => this.handleHeart(ideas[i]._id)}> <p>{ideas[i].heart}</p><FontAwesomeIcon icon={faHeart} /></Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {i + 1 !== ideas.length ?        
                        <Card className="p-3 IdeasWall-idea-card">
                            <Card.Body className="IdeasWall-idea-card-body">
                                <Card.Title>{ideas[i+1].subject}</Card.Title>
                                <Card.Text> {ideas[i+1].description} </Card.Text>
                                <blockquote className="blockquote mb-0 card-body">
                                    <footer className="blockquote-footer">
                                        <small className="text-muted">
                                        {ideas[i+1].user} in <cite title="Source Title">{ideas[i+1].tags}</cite>
                                        </small>
                                </footer>
                                </blockquote>
                                <div className="idea-reactionButtons">
                                    <Button className="idea-level-up"  onClick={() => this.handleLevelUp(ideas[i+1]._id)}><p>{ideas[i+1].thumbUp}</p><FontAwesomeIcon icon={faLevelUpAlt} /></Button>
                                    <Button className="idea-level-down"  onClick={() => this.handleLevelDown(ideas[i+1]._id)}><p>{ideas[i+1].thumbDown}</p><FontAwesomeIcon icon={faLevelDownAlt} /></Button>
                                    <Button className="idea-level-love"  onClick={() => this.handleHeart(ideas[i+1]._id)}><p>{ideas[i+1].heart}</p><FontAwesomeIcon icon={faHeart} /></Button>
                                </div>
                            </Card.Body>
                        </Card>
                    : null}
                </div>
            );

        return rows;
    }

    renderIdeasWall(ideas) {
        return (
            <div className="IdeasWall">
                    <div className='IdeasWall-container-heading'>
                        <span>A bunch of ideas from our users!</span>
                        <p className="subdescription">All ideas are sorted by relevance and number of votes</p>
                    </div>

                    <div className="IdeaForm-container-wraper">
                        {this.renderIdeas(ideas)}
                    </div>
            </div>
        );
    }


    render() {
        const isLoading = this.state.loading;
        const ideas = this.state.ideas;
    
        return (
            <div className="wall-wraper">
                {!isLoading && this.renderIdeasWall(ideas)}
            </div>
        );
    }
}

export { LocalAuthPage };