import React from "react";

import {Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'


import md5 from 'md5'

import firebase from '../../firebase'

import { Link } from 'react-router-dom'

class Register extends React.Component {

state={
username:'',
email:'',
password:'',
passwordConfirmation:'',
errors:[] ,
loading:false,
userRef:firebase.database().ref('users')
}


isFormValid=()=>{

let errors=[]
let error

  if(this.isFormEmpty(this.state)){

error={message:'Fill details in all the fields'}
this.setState({errors:errors.concat(error),loading:false})
return false

  }else if(!this.isPasswordValid(this.state)){

error={message:"Passwords don't match"}

this.setState({errors:errors.concat(error),loading:false})

return false

  } else{
    return true
  }
}


isFormEmpty=({username,email,password,passwordConfirmation})=>{

return !username.length || !email.length || !password.length || !passwordConfirmation.length

}


isPasswordValid=({password,passwordConfirmation})=>{

  if(password.length<6||passwordConfirmation.length<6){
    return false
  }else if(password!==passwordConfirmation){
    return false
  }else{
    return true
  }

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
this.setState({errors:[],loading:true})


  if(this.isFormValid()){
  firebase
  .auth()
  .createUserWithEmailAndPassword(this.state.email, this.state.password)
  .then((user)=>{

    console.log(user)

    user.user.updateProfile({
          
      displayName:this.state.username,
      photoURL:`http://gravatar.com/avatar/${md5(user.user.email)}?d=identicon`

    }).then(()=>{

this.saveUser(user)
.then(()=>{
  console.log('user saved')
})

    }).catch(err=>{

      this.setState({errors:this.state.errors.concat(err),loading:false})

    })


  })
  .catch((err)=>{console.log(err)
  
    this.setState({errors:this.state.errors.concat(err),loading:false})
  
  })
  
  }

}


saveUser=user=>{
  return this.state.userRef.child(user.user.uid).set({
    name:user.user.displayName,
    avatar:user.user.photoURL
  })
}

handleInputError=(errors,input)=>{

  return errors.some(e=>
    e.message.toLowerCase().includes(input)
  )
    ?'error':''
  
}


  render() {

const {username, password,passwordConfirmation,email,errors,loading}=this.state

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
  className={this.handleInputError(errors,'email')}
  fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" type="email" onChange={this.handleChange} autoComplete="off" />
  
  
  <Form.Input 
  value={password}
  className={this.handleInputError(errors,'password')}
  fluid name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" onChange={this.handleChange} />
  
  
  <Form.Input
  value={passwordConfirmation}
  className={this.handleInputError(errors,'password')}
  fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" type="password"  onChange={this.handleChange} />

  <Button disabled={loading} className={loading?'loading':''} color="purple" fluid size="large"  >
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
