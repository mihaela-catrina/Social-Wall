import React from 'react';
import { Router, Route, Link, Switch, HashRouter } from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap'
import ReactNotifications from 'react-notifications-component';

import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { AdminPage } from '@/AdminPage';
import { LoginPage } from '@/LoginPage';
import { RegisterPage } from '@/RegisterPage';
import { SocialWallPage } from '@/SocialWallPage';
import { ConfirmPage } from '@/ConfirmPage';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser, isAdmin } = this.state;
        return (
            <Router history={history}>
                <div className="App">
                    <ReactNotifications />
                    <Navbar collapseOnSelect>
                        <Navbar.Brand href="/">Social Wall</Navbar.Brand>
                        <Navbar.Toggle />
                        {currentUser &&
                            <React.Fragment>
                                <Nav>
                                    {isAdmin && <Nav.Link href="/admin">Admin</Nav.Link>}
                                </Nav>
                                <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text>
                                        Signed in as: <a href="/profile">{currentUser.firstName + " " + currentUser.lastName}</a>
                                    </Navbar.Text>
                                    <Nav className="logout-button">
                                        <Button onClick={this.logout} variant="outline-info">Logout</Button>
                                    </Nav>
                                </Navbar.Collapse> 
                            </React.Fragment>
                        }
                        {!currentUser &&
                            <React.Fragment>
                                <Navbar.Collapse className="justify-content-end">
                                    <Nav className="login-button">
                                        <Button href="/login" variant="outline-info">Login</Button>
                                    </Nav>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                </Navbar.Collapse>
                            </React.Fragment>
                        }
                    </Navbar>

                    <div className="relative homepage_header">
                            <div className="relative">
                                <Route exact path="/" component={SocialWallPage} />
                                <PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
                                <Route path="/confirm" component={ConfirmPage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                                <Route path="/profile" component={HomePage} />
                            </div>
                    </div>
                </div>
            </Router>
        );
    }
}


export { App }; 