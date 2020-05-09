import React from 'react';
import { Button } from 'react-bootstrap'

import { Formik, Field, Form, ErrorMessage } from 'formik';
import { store } from 'react-notifications-component';
import * as Yup from 'yup';

import { userService } from '@/_services';
import { registrationService } from '@/_services';
import Sidebar from './AdminSideBar'

import './sidebar.css'


class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            pendingUsers: [],
            editActive: false,
            viewActive: false,
            viewPendingRequests: false,
            dashBoardItems: null
        };

        this.editSupport = this.editSupport.bind(this);
        this.viewUsers = this.viewUsers.bind(this);
        this.getDashboardItems = this.getDashboardItems.bind(this);
        this.viewPendingRequests = this.viewPendingRequests.bind(this);
        this.renderPendingRequests = this.renderPendingRequests.bind(this);
        this.approve = this.approve.bind(this);
        this.getPendingUsers = this.getPendingUsers.bind(this);
    }

    componentWillMount() {
        this.getDashboardItems();
    }


    editSupport() {
        this.setState({viewActive: false});
        this.setState({viewPendingRequests: false});
        this.setState({editActive: true});
    }

    viewUsers() {
        userService.getAll().then(users => this.setState({ users: users,  editActive: false, viewPendingRequests: false, viewActive: true}));
    }

    getPendingUsers() {
        userService.viewPendingRequests().then(users=>this.setState({pendingUsers: users}));
    }

    viewPendingRequests() {
        userService.viewPendingRequests().then(users=>
        {
            this.setState({pendingUsers: users});
            this.setState({viewActive: false});
            this.setState({editActive: false});
            this.setState({viewPendingRequests: true});
        });
    }

    approve(id) {
        userService.approveRequest(id).then(resp => {
            store.addNotification({
                title: 'Approved',
                message: resp.msg,
                type: 'warning',                         
                container: 'bottom-left',                // where to position the notifications
                animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                dismiss: {
                  duration: 3000 
                }
            })
            this.getPendingUsers()
        });
    }

    renderPendingRequests() {
        return (
            <div className="pending-requests-container">
                {this.state.pendingUsers.map((user, i) => {
                    return (
                        <div className="pending-requests-container-row">
                            <Button className="pending-approve-btn" variant="outline-warning" size="md" block onClick={() => this.approve(user._id)}>Approve</Button>
                            <span className="pending-users-name">{user.firstName} {user.lastName}   -   {user.email}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderRegisterSupportForm() {
        return (
            <div className="SupportForm">
                <div className='container4'>
                    <h4 align="center">Add tehnical support</h4>
                </div>
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required')
                    })}
                    onSubmit={({ username, password }, { setStatus, setSubmitting, resetForm }) => {
                        setStatus();
                        registrationService.registerSupport("tehnical_support", username, password )
                            .then(
                                data => {
                                    console.log(data);
                                    store.addNotification({
                                        title: 'Register',
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
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" placeholder='Enter username' className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" placeholder='Enter password' className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success btn-block submit-form-brn-admin" disabled={isSubmitting}>Register</button>
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


    getDashboardItems() {
        const items = [
            <div>
                <li class="nav-item">
                    <Button className="Admin-dasboard-button" variant="outline-warning" size="md" block onClick={this.editSupport}>Add Tehnical Support User</Button>
                </li>
                <li class="nav-item">
                    <Button className="Admin-dasboard-button" variant="outline-warning" size="md" block onClick={this.viewUsers}>View Users</Button>
                </li>
                <li class="nav-item">
                    <Button className="Admin-dasboard-button" variant="outline-warning" size="md" block onClick={this.viewPendingRequests}> View Pending Requests </Button>
                </li>
            </div>
        ]

        this.setState({dashBoardItems: items})
    }

    render() {
        const items = this.state.dashBoardItems;
        const links = [];
        if (this.state.viewActive) {
            this.state.users.map(user => {
                if (user.role === "user")
                    links.push(<li key={user.id}>{user.firstName} {user.lastName}</li>)

                if (user.role === "tehnical_support")
                    links.push(<li key={user.id}>Tehnical Support user -> {user.username}</li>)
            });
            console.log(this.state.users);
        }
        return (
            <div class="AdminDashboard">
                <div>
                    <Sidebar items={ items } />
                </div>

                <h2 align="center">Admin Dashboard</h2>
                <p align="center">This page can only be accessed by administrators.</p>

                { this.state.viewActive && 
                    <div>
                        <h4 align="center">All users from secure (admin only) api end point:</h4>
                        
                        {this.state.users &&
                            <ul class="link">
                                {links}
                            </ul>
                        }
                    </div>
                }
                
                { this.state.editActive &&
                    <div> 
                        {this.renderRegisterSupportForm()}
                    </div>
                }

                { this.state.viewPendingRequests && this.renderPendingRequests()}
            </div>
        );
    }
}

export { AdminPage };