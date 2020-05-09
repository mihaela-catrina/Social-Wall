import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import * as Yup from 'yup';

import './RegisterPage.css'

import { registrationService } from '@/_services';

const roleOptions = [
    { value: 'user', label: 'Citizen' },
    { value: 'local-authority', label:"Local authority representant"}
]

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="RegisterPage">
                <div className='container4'>
                    <h2 align="center">Register</h2>
                </div>
                <Formik
                    initialValues={{
                        role: undefined,
                        email: '',
                        firstName:'',
                        lastName:'',
                        username: '',
                        password: '',
                        confirmPassword:''
                    }}
                    validationSchema={Yup.object().shape({
                        role: Yup.string().ensure().required('Pick your role, please!'),
                        email: Yup.string().required('Email is required'),
                        firstName: Yup.string().required('Fisrt name is required'),
                        lastName: Yup.string().required('Last name is required'),
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required'),
                        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords don't match").required('Confirm Password is required'),
                    })}
                    onSubmit={({
                            role,
                            email,
                            firstName,
                            lastName,
                            username,
                            password,
                            confirmPassword 
                        }, 
                        { 
                            setStatus,
                            setSubmitting,
                            resetForm
                        }) => {
                        setStatus();

                        registrationService.register(role.value, email, firstName, lastName, username, password )
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
                            <div className="form-group" >
                                <label htmlFor="role">Role</label>
                                <Select className={'role' + (errors.role && touched.role ? ' is-invalid' : '')} 
                                        onChange={value => setFieldValue("role", value)}
                                        onBlur={() => setFieldTouched("role", true)}
                                        value={values.role}
                                        options={roleOptions}/>
                                <ErrorMessage name="role" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="email" placeholder='Enter your email' className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" placeholder='Enter username' className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <Field name="firstName" type="text" placeholder='Enter your first name' className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <Field name="lastName" type="text" placeholder='Enter your last name' className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" placeholder='Enter password' className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <Field name="confirmPassword" type="password" placeholder='Confirm password' className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success btn-block" disabled={isSubmitting}>Register</button>
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
        )
    }
}

export { RegisterPage }; 