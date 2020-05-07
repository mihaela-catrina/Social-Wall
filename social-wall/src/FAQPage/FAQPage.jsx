import React from 'react';

import { userService, authenticationService } from '@/_services';

import './FAQPage.css'
import { ProgressBar } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination'

class FAQPage extends React.Component {
    constructor(props) {    
        super(props);

        this.state = {
            messages: [],
            loading: true,
            activePage: 1,
        };

        this.getMessages = this.getMessages.bind(this);
        this.handlePageChanged = this.handlePageChanged.bind(this);
    }

    componentDidMount() {
        this.getMessages();
    }

    getMessages(){
        userService.getImportantMessages()
            .then(messages => {this.setState({messages: messages, loading: false})});
    }

    handlePageChanged(e){
        this.setState({activePage: e.target.text});
    }

    renderMessages(messages) {
        return messages.map((msg, index) => {
            if (index >= (this.state.activePage - 1) * 4 && index < this.state.activePage * 4) {
                return (
                    <div className="question-view-container">
                        <ProgressBar className="progress-question" style={{background: 'linear-gradient(-40deg, rgba(238, 134, 4, 1), rgba(238, 134, 4, 1), rgba(177, 172, 166, 1), rgba(177, 172, 166, 1)'}} now={0} />
                        <div className="question-container">
                            <span className="question">Q: {msg.subject}</span>
                            <br />
                            <span className="answer">A: {msg.response}</span>
                        </div>
                    </div>
                );
            }
        });
    }

    renderPages() {
        let pages = [];
        let noPages = this.state.messages.length / 4 + (this.state.messages.length % 4 == 0 ? 0 : 1);
        for (let i = 1; i <= noPages; i++) {
            pages.push(
                <Pagination.Item  key={i} active={i === this.state.activePage}>
                    {i}
                </Pagination.Item>
            )
        }

        return (
            <Pagination className="pagination" onClick={this.handlePageChanged} style={{background: "orange"}}>
                {pages}
            </Pagination>
        );
    }

    render() {
        const messages = this.state.messages;
        const isLoading = this.state.loading;
        return (
                <div className="FAQpage">
                    <br />
                    <br />
                    <ProgressBar className="progress-style" style={{background: 'linear-gradient(-40deg, rgba(255, 78, 80, 1), rgba(249, 212, 35, 1)'}} now={0} />
                    <h1>Freaquently Asked Question (FAQ)</h1>
                    {!isLoading && this.renderPages()}

                    <div className="faq-questions">
                        {!isLoading && this.renderMessages(messages)}
                    </div>
                </div>
        );
    }
}

export { FAQPage };