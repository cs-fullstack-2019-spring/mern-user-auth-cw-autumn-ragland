import React, { Component } from 'react';

class LoginPage extends Component {

    //data will be the username
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }
    }

    //login form submit event handler
    formSubmission = (e) => {
        e.preventDefault();
        fetch('/users/login',{
            method:'POST',
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                username:e.target.username.value,
                password:e.target.password.value,
                email:e.target.email.value,
            }),
        })
            .then(data => {return data.text()})
            .then(data=>console.log("Logged in: " + data))
            .then(data => {
                if(data)
                    return this.props.loggedInUserInfo(data,true);
                else
                    return this.props.loggedInUserInfo(data,false);
            })


    };

    //login form
    render() {
        return (
            <form className={'formClass'} onSubmit={this.formSubmission}>
                <div>
                    <label htmlFor={'username'}>Username: </label>
                    <input type="text" name={'username'} id={'username'} placeholder={'enter username'}/>
                </div>
                <br/>
                <div>
                    <label htmlFor={'password'}>Password: </label>
                    <input type="password" name={'password'} id={'password'} placeholder={'enter password'}/>
                </div>
                <br/>
                <div>
                    <label htmlFor={'email'}>Email: </label>
                    <input type="text" name={'email'} id={'email'} placeholder={'enter email'}/>
                </div>
                <br/>
                <div>
                    <button>Login</button>
                </div>
            </form>
        );
    }
}

export default LoginPage;