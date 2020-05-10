import React from 'react';
import { Button, ProgressBar } from 'react-bootstrap'
import Card from "react-bootstrap/Card";


import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select'
import { store } from 'react-notifications-component';
import * as Yup from 'yup';

import { userService } from '@/_services';
import { authenticationService } from '../_services/authentication.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons'
import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

import './CommunityPortalPage.css'

const authorityOptions = [
    { value: 'local-police', label: 'Local Police' },
    { value: 'town-hall-officials', label: 'Town Hall Officials' },
    { value: 'environmental-guard', label: 'Environmental guard'},
    { value: 'local-schools', label: 'Local schools'},
];

const tagsOptions = [
    { value: 'local-park', label: '#localpark' },
    { value: 'street', label: '#steet' },
    { value: 'environment', label: '#environment'},
    { value: 'community', label: '#community'},
    {value: 'people', label: '#people'}
]


class CommunityPortalPage extends React.Component {
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

    renderDefaultView() {
        return (
                <div className="wall-lander">
                    <div className="heading_wall_section">
                        <h1 className="heading_wall_section_title"> Ideas Wall</h1>
                        <h6 class="heading_wall_section_subtitle">
                            A showcase of ideas, 
                            <br class="hidden-xs-down"/>
                            experiments and thoughts
                        </h6>
                        <div className="progress-bar-wall-section">
                            <ProgressBar className="progress-style-wall" style={{background: 'linear-gradient(-40deg, rgba(255, 78, 80, 1), rgba(249, 212, 35, 1)'}} now={0} />
                        </div>
                    </div>

                    <div className="wall-lander-row-section">
                        <div className="wall-lander-row-section_add_idea">
                            <div className="wall-lander-row-section_backgroud">
                                <Button variant="outline-warning" className="btn-add-idea" size="md" block onClick={this.handleToggleIdeaForm}>
                                    <h3 className="add_idea_item"> Tell us </h3>
                                    <h3 className="add_idea_item"> your idea </h3>
                                </Button>
                            </div>
                        </div>

                        <div className="wall-lander-row-section_view_ideas">
                            <div className="wall-lander-row-section_backgroud">
                                <Button variant="outline-warning" className="btn-add-idea" size="md" block onClick={this.handleToggleIdeasWall}>
                                    <h3 className="add_idea_item"> View our </h3>
                                    <h3 className="add_idea_item"> ideas wall </h3>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }

    renderFormView() {
        return (
            <div className="IdeaForm">
                <div className='IdeaForm-container-heading'>
                    <span>Tell Us Your Idea</span>
                </div>
                <div className="IdeaForm-container-wraper">
                    <Formik
                        initialValues={{
                            subject: '',
                            description: '',
                            authority: '',
                            tags: ''
                        }}
                        validationSchema={Yup.object().shape({
                            subject: Yup.string().required('Subject is required'),
                            description: Yup.string().required('Description is required')
                        })}
                        onSubmit={({ subject, description, authority, tags }, { setStatus, setSubmitting, resetForm }) => {
                            setStatus();
                            userService.postIdea(subject, description, authority, tags, authenticationService.currentUserValue.id)
                                .then(
                                    data => {
                                        store.addNotification({
                                            title: 'Register',
                                            message: data.msg,
                                            type: 'warning',                         
                                            container: 'bottom-left',                // where to position the notifications
                                            animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                                            animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                                            dismiss: {
                                            duration: 3000 
                                            }
                                        })

                                        setSubmitting(false);
                                        resetForm();
                                    },
                                    error => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                        }}
                        render={({ errors, status, touched, isSubmitting, values, setFieldTouched, setFieldValue }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <Field name="subject" type="text" placeholder='A short title for your idea' className={'wrap-form-control' + (errors.subject && touched.subject ? ' is-invalid' : '')} />
                                    <ErrorMessage name="subject" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <Field name="description" component={ "textarea" } rows={4} placeholder='Try to be concise in description' className={'wrap-form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                    <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="authority">The authority that may be interested</label>
                                    <Select className={'authority' + (errors.authority && touched.authority ? ' is-invalid' : '')} 
                                            onChange={value => setFieldValue("authority", value)}
                                            onBlur={() => setFieldTouched("authority", true)}
                                            value={values.authority}
                                            options={authorityOptions}/>
                                    <ErrorMessage name="authority" component="div" className="invalid-feedback" />
                                </div>

                                <div className="form-group" >
                                    <label htmlFor="tags">What do you think about setting some tags?</label>
                                    <Select isMulti className={'tags' + (errors.tags && touched.tags ? ' is-invalid' : '')} 
                                            onChange={value => setFieldValue("tags", value)}
                                            onBlur={() => setFieldTouched("tags", true)}
                                            value={values.tags}
                                            options={tagsOptions}/>
                                    <ErrorMessage name="tags" component="div" className="invalid-feedback" />

                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-warning btn-block IdeaForm-button" disabled={isSubmitting}>Submit</button>
                                    {isSubmitting &&
                                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                    }
                                </div>
                                {status &&
                                    <div className={'alert alert-danger'}>{status}</div>
                                }
                            </Form>
                        )}
                    />
                </div>
            </div>
        );
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
                        <span>Together We Create!</span>
                    </div>

                    <div className="IdeaForm-container-wraper">
                        {this.renderIdeas(ideas)}
                    </div>
            </div>
        );
    }

    renderPersonalIdeas(ideas) {
        const personalIdeas = ideas.filter(idea => idea.userId === authenticationService.currentUserValue.id);
        return (
            <div className="IdeasWall">
                    <div className='IdeasWall-container-heading'>
                        <span> Personal wall</span>
                        <h6 class="heading_wall_section_subtitle">
                            Here you can see 
                            <br class="hidden-xs-down"/>
                            all the ideas you shared with the community
                        </h6>
                    </div>

                    <div className="IdeaForm-container-wraper">
                        {this.renderIdeas(personalIdeas)}
                    </div>
            </div>
        );
    }


    render() {
        const isIdeasWallActive = this.state.isIdeasWallActive;
        const isIdeaFormActive= this.state.isIdeaFormActive;
        const isPersonalIdeasViewActive = this.state.isPersonalIdeasViewActive;
        const isLoading = this.state.loading;
        const ideas = this.state.ideas;
    
        return (
            <div className="wall-wraper">
                <div className="menu">
                    <div className="menu-content">
                        <Button variant="outline-warning" className="menu-link" size="md" block onClick={this.handleToggleDefaultView}>
                            <h3 className="menu-link-title"> Ideas Wall </h3>
                        </Button>
                        <Button variant="outline-warning" className="menu-link" size="md" block onClick={this.handleTogglePersonalIdeasView}>
                            <h3 className="menu-link-title"> Your Ideas </h3>
                        </Button>
                        <Button variant="outline-warning" className="menu-link" size="md" block onClick={this.editSupport} disabled>
                            <h3 className="menu-link-title"> Forums</h3>
                        </Button>
                    </div>
                </div>
                {!isIdeaFormActive && !isIdeasWallActive && !isPersonalIdeasViewActive && this.renderDefaultView()}
                {isIdeaFormActive && this.renderFormView()}
                {!isLoading && isIdeasWallActive && this.renderIdeasWall(ideas)}
                {!isLoading && isPersonalIdeasViewActive && this.renderPersonalIdeas(ideas)}
            </div>
        );
    }
}

export { CommunityPortalPage };