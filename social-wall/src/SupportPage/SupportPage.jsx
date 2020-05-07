import React from 'react';
import { Button } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'

import Sidebar from './SupportPageSideBar'
import MessageCard from './MessageCard.js'
import { userService } from '@/_services';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import { store } from 'react-notifications-component';
import * as Yup from 'yup';


import './SupportPage.css'

class SupportPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            loading: true,
            activePage: 1,
            userId: '',
            originalMessage: {title:'', content: ''},
            sendingResponse: false,
            viewMessages: false,
            dashBoardItems: null
        };

        this.getMessages = this.getMessages.bind(this);
        this.getDashboardItems = this.getDashboardItems.bind(this);
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSetImportant = this.handleSetImportant.bind(this);
        this.viewMessages = this.viewMessages.bind(this);
    }

    componentDidMount() {
        this.getMessages();
        this.getDashboardItems();
    }

    handlePageChanged(e){
        this.setState({activePage: e.target.text});
    }

    getMessages(){
        userService.getAllMessages().then(messages => this.setState({ messages: messages, loading: false}));
    }

    viewMessages() {
        userService.getAllMessages().then(messages => this.setState({ messages: messages, sendingResponse: false, viewMessages: true}));
    }

    getDashboardItems() {
        const items = [
            <div>
                <li class="nav-item">
                    <Button variant="outline-info" size="md" block onClick={this.editSupport}>Fa cevaaa</Button>
                </li>
                <li class="nav-item">
                    <Button variant="outline-info" size="md" block onClick={this.viewMessages}>View Messages</Button>
                </li>
            </div>
        ]

        this.setState({dashBoardItems: items})
    }

    handleResponse(id) {
        const message = this.state.messages.find(x => x._id === id)
        this.setState({sendingResponse: true, viewMessages: false, userId: message.userId, originalMessage: message});
    }

    handleDelete(id) {
        userService.deleteMessage(id).then(resp => {
            this.setState({loading: true});
            this.getMessages();
            store.addNotification({
                title: 'Delete Message',
                message: resp.msg,
                type: 'info',                         
                container: 'bottom-left',                // where to position the notifications
                animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                dismiss: {
                  duration: 5000 
                }
            });
        })
    }

    handleSetImportant(id) {
        userService.setImportantMessage(id).then(resp => {
            this.setState({loading: true});
            this.getMessages();
            store.addNotification({
                title: 'Important',
                message: resp.msg,
                type: 'info',                         
                container: 'bottom-left',                // where to position the notifications
                animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                dismiss: {
                  duration: 5000 
                }
            });
        })
    }

    renderMessages(messages) {
        let contents = [];
        messages.map((msg, i) => {
            let name= "";
            if (msg.important)
                name = "important";
            else if (msg.resolved)
                name = "resolved";
            else
                name = "default";
            let content = {
                title: msg.subject,
                message: msg.message,
                resolved: msg.resolved,
                important: msg.important,
                user: msg.userId,
                id: msg._id,
                header: name,
            }
            contents.push(content);
        });

        return contents.map((msg, index) => {
            if (index >= (this.state.activePage - 1) * 5 && index < this.state.activePage * 5) {
                return (
                    <MessageCard content={msg} handleResponse={this.handleResponse} handleDelete={this.handleDelete} handleSetImportant={this.handleSetImportant}/>
                );
            }
        });
    }

    renderResponseForm(userId, originalMessage) {
        return (
            <div className="Response">
                <div className='container4'>
                    <h4 align="center">Complete Response</h4>
                </div>
                <Formik
                    initialValues={{
                        response: ''
                    }}
                    validationSchema={Yup.object().shape({
                        response: Yup.string().required('A response is required'),
                    })}
                    onSubmit={({ response }, { setStatus, setSubmitting, resetForm }) => {
                        setStatus();
                        userService.sendResponse( response, userId, originalMessage )
                            .then(
                                data => {
                                    store.addNotification({
                                        title: 'Message!',
                                        message: data.msg,
                                        type: 'info',                         
                                        container: 'bottom-left',                // where to position the notifications
                                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                                        dismiss: {
                                          duration: 3000 
                                        }
                                      })

                                      setSubmitting(false);
                                      resetForm();
                                      this.setState({sendingResponse: false});
                                },
                                error => {
                                    setSubmitting(false);
                                    setStatus(error);
                                }
                            );
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <Field name="response" component="textarea" rows={6} placeholder='Response...' className={'wrap-input' + (errors.response && touched.response ? ' is-invalid' : '')} />
                                <ErrorMessage name="response" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success btn-block" disabled={isSubmitting}>Send</button>
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
        );
    }

    renderPages() {
        let pages = [];
        let noPages = this.state.messages.length / 5 + (this.state.messages.length % 5 == 0 ? 0 : 1);
        for (let i = 1; i <= noPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={i === this.state.activePage}>
                    {i}
                </Pagination.Item>
            )
        }

        return (
            <Pagination onClick={this.handlePageChanged}>
                {pages}
            </Pagination>
        );
    }


    render() {
        const items = this.state.dashBoardItems;
        const messages = this.state.messages;
        const isLoading = this.state.loading;
        const viewMessagesActive = this.state.viewMessages;
        const sendingResponse = this.state.sendingResponse;
        const userId = this.state.userId;
        const originalMessage = this.state.originalMessage;
        return (
            <div class="AdminDashboard">
                <div>
                    <Sidebar items={ items } />
                </div>
                <h2 align="center">Support Dashboard</h2>
                <p align="center">This page can only be accessed by tehncial support users.</p>
                {!isLoading && viewMessagesActive && this.renderMessages(messages)}
                {!isLoading && viewMessagesActive && this.renderPages()}
                {!isLoading && !viewMessagesActive && sendingResponse && this.renderResponseForm(userId, originalMessage)}
            </div>
        );
    }
}

export { SupportPage };