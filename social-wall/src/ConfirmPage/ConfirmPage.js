import React from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { store } from 'react-notifications-component';

import Spinner from './Spinner'
import { API_URL } from '../config'

class ConfirmPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { confirming: true };
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({confirming: false});
    this.props.history.push('/');
  }

  // When the component mounts the mongo id for the user is pulled  from the 
  // params in React Router. This id is then sent to the server to confirm that 
  // the user has clicked on the link in the email. The link in the email will 
  // look something like this: 
  // 
  // http://localhost:8080/confirm?id=5c40d7607d259400989a9d42
  // 
  // where 5c40d...a9d42 is the unique id created by Mongo
  componentDidMount = () => {
    const values = queryString.parse(this.props.location.search)

    fetch(`${API_URL}/confirm/${values.id}`)
      .then(res => res.json())
      .then(data => {
        this.reset();
        store.addNotification({
          title: 'Confirmed',
          message: data.msg,
          type: 'info',                         
          container: 'bottom-left',                // where to position the notifications
          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
          dismiss: {
            duration: 3000 
          }
        })
      })
      .catch(err => console.log(err))
  }

  // While the email address is being confirmed on the server a spinner is 
  // shown that gives visual feedback. Once the email has been confirmed the 
  // spinner is stopped and turned into a button that takes the user back to the 
  // <Landing > component so they can confirm another email address.
  render = () =>
    <div className='confirm'>
          <React.Fragment>
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-danger" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-info" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </React.Fragment>
    </div>
}

export { ConfirmPage }; 