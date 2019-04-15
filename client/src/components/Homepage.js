import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import NewUserPage from "./NewUserPage";
import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";

class Homepage extends Component {

    //set up userInfo
    constructor(props) {
        super(props);
        this.state ={
            userInfo:{
                username:null,
                isLoggedIn:false,
            }
        }
    }

    //on load run cookie check
    componentDidMount() {
        this.cookieCheck();
    }

    //check to see if the user has cookies for the site and set userInfo if applicable
    cookieCheck = () => {
      fetch("/users")
          .then(data=>{return data.text()})
          .then(data => this.setState({userInfo:
                  {username:data,isLoggedIn: true}}))
    };

    //login function passed to login component
    loggedInUserInfo = (username,isLoggedIn) =>{
        this.setState({userInfo:
                {username:username, isLoggedIn:isLoggedIn,}}
            )
    };

    //log out function
    loggedOut = () =>{
        fetch('/users/logout')
            .then(data=>{return data.text()})
            .then(()=>this.loggedInUserInfo(undefined, false))
            .then(()=>console.log('logged out'))
    };

    //render nav bar with links to components and logged in user flag
    render() {
        return (
            <div>
                <Router>
                    <h1>Welcome</h1>
                    <Link className={'linkSpace'} to={"/"}>Home</Link>
                    <Link className={'linkSpace'} to={"/newUser"}>New User</Link>
                    <Link className={'linkSpace'} to={"/login"}>Login</Link>
                    <Link className={'linkSpace'} to={"/logout"} onClick={this.loggedOut}>Logout</Link>

                    {this.state.isLoggedIn? <h1>Welcome {this.state.username}</h1>:""}

                    <Route path={'/newUser'} component={NewUserPage}/>
                    <Route path={'/login'} component={()=>{return <LoginPage userInfo={this.state.userInfo} loggedInUserInfo={this.loggedInUserInfo}/>}}/>
                    <Route path={'/logout'} component={LogoutPage}/>
                </Router>
            </div>
        );
    }
}

export default Homepage;
