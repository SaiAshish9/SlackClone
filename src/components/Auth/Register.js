import React from "react";

import {Image,Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'

import ChatPic from './chat.jpeg'

import firebase from '../../firebase'

import { Link } from 'react-router-dom'

class Register extends React.Component {

state={
username:'',
email:'',
password:'',
passwordConfirmation:'' 
}

handleChange=e=>{
this.setState({[e.target.name]:e.target.value})
}

handleSubmit=e=>{
  e.preventDefault()
  
  firebase
  .auth()
  .createUserWithEmailAndPassword(this.state.email, this.state.password)
  .then((user)=>{
    console.log(user)
  })
  .catch((err)=>{console.log(err)})


}

  render() {

const {username, password,passwordConfirmation,email}=this.state

    return (
      <React.Fragment>
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{maxWidth:450}}>
            <Header as="h2" icon color="purple"   >
                <Icon name="react" color="purple"/>
            </Header>

            <Header as="h2" icon color="purple"   >
            <Icon name="slack" color="purple" />
           </Header>

           <Header as="h2" icon color="purple" textAlign="center"  >
       Register for Sai's SlackChat
           </Header>

<Form size="large"
onSubmit={this.handleSubmit}
>

<Segment stacked>
  <Form.Input
  value={username}
   fluid name="username"
    icon="user" iconPosition="left" placeholder="Username"  type="text" onChange={this.handleChange} autoComplete="off" />
 
  <Form.Input 
  value={email}
  fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" type="email" onChange={this.handleChange} autoComplete="off" />
  
  
  <Form.Input 
  value={password}
  fluid name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" onChange={this.handleChange} />
  
  
  <Form.Input
  value={passwordConfirmation}
  fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" type="password"  onChange={this.handleChange} />

  <Button color="purple" fluid size="large"  >
  Submit
</Button>

</Segment>

</Form>

<Message>
  already a user?
  <Link to="/login">
Login
  </Link>
  </Message>

        </Grid.Column>

      </Grid>

    </React.Fragment>
    )
  }
}

export default Register;
