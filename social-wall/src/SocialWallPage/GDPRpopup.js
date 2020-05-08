import { Form, Button } from 'react-bootstrap'
import React from "react";

class Popup extends React.Component {
    render() {
      return (
        <div className='popup-backgroud'>
          <div className='popup'>
                <div className='popup-wraper'>
                    <div className="popup-inner-content">
                        <div className="popup-text-wraper">
                            <div className="popup-headline-text">
                                <p> GDPR consent </p>
                            </div>

                            <div className="popup-secondary-text">
                                <p> We use cookies to enhance your experience on the platform. </p>
                                <p> Select below the cookies that you accept:</p>
                            </div>

                            <div className="cookies">
                                <Form>
                                    <div key="default-checkbox" className="checkbox">
                                        <Form.Check
                                            disabled
                                            checked
                                            type='checkbox'
                                            label='Necessary'
                                            id="Necessary"
                                            className="checkbox-disabled"
                                        />

                                        <Form.Check
                                            className="checkbox"
                                            type='checkbox'
                                            label='Preferences'
                                            id="Preferences"
                                            className="checkbox-enabled "
                                        />

                                        <Form.Check
                                            type='checkbox'
                                            label='Analytics'
                                            id="Analytics"
                                            className="checkbox-enabled "
                                        />
                                    </div>
                                </Form>
                            </div>

                            <div className="buttons-gdpr">
                                <Button className="button-accept" onClick={this.props.closePopup} > Accept </Button>
                                <div className="divider"></div>
                                <Button className="button-decline" onClick={this.props.closePopup} > Decline </Button>
                            </div>

                        </div>
                    </div>
                </div>
          </div>
        </div>
      );
    }
}

export {Popup}