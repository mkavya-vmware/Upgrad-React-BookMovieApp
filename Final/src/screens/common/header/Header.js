import React, { Component } from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import logo from '../../../assets/logo.svg';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link } from 'react-router-dom';



const loginStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

const TabContainer = function (props) {
    return (
        <Typography component="div" /*style={{ padding: 0, textAlign: 'center' }}*/>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            value: 0,
            username: "",
            password: "",
            email: "",
            firstname: "",
            lastname: "",
            mobile: "",
            passwordReg: "",
            isRegistrationSuccess: false,
            loggedIn: sessionStorage.getItem('access-token') == null ? false : true,

            usernameRequired: "dispNone",
            passwordRequired: "dispNone",
            emailRequired: "dispNone",
            firstnameRequired: "dispNone",
            lastnameRequired: "dispNone",
            mobileRequired: "dispNone",
            passwordRegRequired: "dispNone"
        };
    }

    openModalHandler = () => {
        this.setState({ modalIsOpen: true })
    }

    closeModalHandler = () => {
        this.setState({ modalIsOpen: false })
    }
    modalTabChangeHandler = (event, value) => {
        this.setState({ value });
    }

    loginHandler = async () => {
        if (this.state.username === "" || this.state.password === "") 
        { return }

        await fetch(this.props.baseUrl + "auth/login",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + window.btoa(this.state.username + ":" + this.state.password),
                    'Cache-Control': 'no-cache'
                },
            })
            .then(async response => {
                const data = await response.json();

                sessionStorage.setItem('uuid', data.id);
                sessionStorage.setItem('access-token', response.headers.get('access-token'));

                this.setState({ loggedIn: true })
            })
            .then(this.closeModalHandler());

    }

    usernameInputHandler = (event) => {
        this.setState({ username: event.target.value })
    }

    passwordInputHandler = (event) => {
        this.setState({ password: event.target.value })
    }


    emailInputHandler = (event) => {
        this.setState({ email: event.target.value })

    }

    firstnameInputHandler = (event) => {
        this.setState({ firstname: event.target.value })

    }

    lastnameInputHandler = (event) => {
        this.setState({ lastname: event.target.value })

    }

    mobileInputHandler = (event) => {
        this.setState({ mobile: event.target.value })

    }

    passwordRegInputHandler = (event) => {
        this.setState({ passwordReg: event.target.value })

    }

    logoutHandler = () => {
        sessionStorage.removeItem('uuid');
        sessionStorage.removeItem('access-token');
        this.setState({ loggedIn: false })

    }

    registerHandler = async () => {
        if (this.state.email === "" || this.state.firstname === "" || this.state.lastname === "" || this.state.mobile === "" || this.state.passwordReg === "") 
        { return; }

        await fetch(this.props.baseUrl + "signup",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
            })
            .then(async response => {
                this.setState({ registrationSuccess: true })
            })
    }



    render() {
        return (
            <div>
                <header className="header">
                    <img src={logo} className="logo" alt="logo" />
                    {!this.state.loggedIn ?
                        <div className="login-button">
                            <Button variant="contained" color="default" onClick={this.openModalHandler}>Login</Button>
                        </div>
                        :
                        <div className="login-button">
                            <Button variant="contained" color="default" onClick={this.logoutHandler}>Logout</Button>
                        </div>
                    }

                    {this.props.showBookShowButton === "true" && !this.state.loggedIn ?
                        <div className="bookshow-button">
                            <Button variant="contained" onClick={this.openModalHandler} color="primary">
                                BOOK SHOW</Button>
                        </div> 
                        : 
                        ""
                    }

                    {this.props.showBookShowButton === "true" && this.state.loggedIn ?
                        <div className="bookshow-button">
                            <Link to={"/bookshow/" + this.props.id}><Button variant="contained" color="primary">
                                BOOK SHOW</Button></Link>
                        </div> 
                        : 
                        ""
                    }

                </header>

                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={loginStyles}>

                    <Tabs className="tabs" value={this.state.value} onChange={this.modalTabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {this.state.value === 0 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="username"> Username </InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.usernameInputHandler} />
                                <FormHelperText className={this.state.usernameRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password"> Password </InputLabel>
                                <Input id="password" type="password" onChange={this.passwordInputHandler} />
                                <FormHelperText className={this.state.passwordRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginHandler}>LOGIN</Button>
                        </TabContainer>
                    }

                    {this.state.value === 1 && 
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" onChange={this.emailInputHandler} />
                            <FormHelperText className={this.state.emailRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" onChange={this.firstnameInputHandler} />
                            <FormHelperText className={this.state.firstnameRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" onChange={this.lastnameInputHandler} />
                            <FormHelperText className={this.state.lastnameRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="mobile">Mobile Number</InputLabel>
                            <Input id="mobile" onChange={this.mobileNumberInputHandler} />
                            <FormHelperText className={this.state.mobileRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required aria-describedby="name-helper-text">
                            <InputLabel htmlFor="passwordReg">Password</InputLabel>
                            <Input type="password" id="passwordReg" onChange={this.passwordRegInputHandler} />
                            <FormHelperText className={this.state.passwordRegRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        {this.state.isRegistrationSuccess === true &&
                            <FormControl>
                                <span className="successMessage"> Your Registration is Successful!! </span>
                            </FormControl>}<br /><br />
                        <Button variant="contained" color="primary" onClick={this.registerHandler}>
                            REGISTER
                        </Button>
                    </TabContainer>
                    }
                </Modal>
            </div>
        )
    }
}

export default Header;
