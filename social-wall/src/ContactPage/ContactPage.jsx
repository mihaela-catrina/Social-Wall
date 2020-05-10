import React from "react";
import { Formik, Field, Form, ErrorMessage, Textarea } from 'formik';
import * as Yup from 'yup';
import { store } from 'react-notifications-component';


import { userService, authenticationService } from '@/_services';

import './ContactPage.css'

class ContactPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="bg-contact">
		    <div class="container-contact">
			    <div class="wrap-contact">
                    <span class="contact-form-title">
                        Get in touch
                    </span>
                    <Formik
                        initialValues={{
                            subject: '',
                            message: ''
                        }}
                        validationSchema={Yup.object().shape({
                            subject: Yup.string().required('Subject is required'),
                            message: Yup.string().required('Message is required')
                        })}
                        onSubmit={({ subject, message }, { setStatus, setSubmitting, resetForm }) => {
                            setStatus();
                            userService.postMessage(subject, message, authenticationService.currentUserValue.id)
                                .then(
                                    data => {
                                        store.addNotification({
                                            title: 'Confirmation',
                                            message: data.msg,
                                            type: 'warning',                         
                                            container: 'bottom-left',                // where to position the notifications
                                            animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                                            animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                                            dismiss: {
                                            duration: 5000 
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
                            <Form className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <Field name="subject" type="text" placeholder='Subject...' className={'wrap-input' + (errors.subject && touched.subject ? ' is-invalid' : '')} />
                                    <ErrorMessage name="subject" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <Field name="message" component="textarea" rows={6} placeholder='Questions/Comments...' className={'wrap-input' + (errors.message && touched.message ? ' is-invalid' : '')} />
                                    <ErrorMessage name="message" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="contact-form-btn btn-success btn-block" disabled={isSubmitting}>Submit</button>
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
	</div>
        );
    }
}


export { ContactPage };