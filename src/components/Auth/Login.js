import React from "react";

import {Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'


import firebase from '../../firebase'

import { Link } from 'react-router-dom'

class Login extends React.Component {

state={
email:'',
password:'',
errors:[] ,
loading:false
}

displayErrors=errors => errors.map((e,i)=>{
  return (
    <p style={{color:'red'}} key={i}>
{e.message}
    </p>
  )
})


handleChange=e=>{
this.setState({[e.target.name]:e.target.value})
}

handleSubmit=e=>{

  e.preventDefault()


  if(this.isFormValid(this.state)){

    this.setState({errors:[],loading:true})

firebase
.auth()
.signInWithEmailAndPassword(this.state.email, this.state.password)
.then((user)=>{
console.log(user)
this.setState({loading:false})

})
.catch(e=>{
  console.log(e)
this.setState({errors:this.state.errors.concat(e),loading:false})

})


}

}


isFormValid=({email,password})=>{
  return email && password
}

handleInputError=(errors,input)=>{

  return errors.some(e=>
    e.message.toLowerCase().includes(input)
  )
    ?'error':''
  
}


  render() {

const {password,email,errors,loading}=this.state

    return (
      <React.Fragment>
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{maxWidth:450}}>
            <Header as="h2" icon color="blue"   >
                <Icon name="react" color="blue"/>
            </Header>

            <Header as="h2" icon color="blue"   >
            <Icon name="slack" color="blue" />
           </Header>

           <Header as="h2" icon color="blue" textAlign="center"  >
       Login to Sai's SlackChat
           </Header>

<Form size="large"
onSubmit={this.handleSubmit}
>

<Segment stacked>

 
  <Form.Input 
  value={email}
  className={this.handleInputError(errors,'email')}
  fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" type="email" onChange={this.handleChange} autoComplete="off" />
  
  
  <Form.Input 
  value={password}
  className={this.handleInputError(errors,'password')}
  fluid name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" onChange={this.handleChange} />
  
  

  <Button disabled={loading} className={loading?'loading':''} color="blue" fluid size="large"  >
  Submit
</Button>

</Segment>

</Form>

{this.state.errors.length>0&&(
  <Message error>
<h3>
  Error :
</h3>
  {this.displayErrors(errors)}
  </Message>
)}

<Message>
  Don't have an account?
  <Link to="/register">
Create One
  </Link>
  </Message>

        </Grid.Column>

      </Grid>

    </React.Fragment>
    )
  }
}

export default Login;
