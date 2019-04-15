import React, { Component } from 'react';

class NewUserPage extends Component {

    //data will be the username
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }
    }

    //new user form submit event handler
    formSubmission = (e) => {
        e.preventDefault();
        fetch('/users/newUser',{
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
            .then(data=>console.log("New User: " + data))
    };

    //new user form
    render() {
        return (
            <div>
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
                        <button>Create User</button>
                    </div>
                </form>
            </div>

        );
    }
}

export default NewUserPage;