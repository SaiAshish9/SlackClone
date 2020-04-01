import React, { Component } from 'react'

import {Image,Grid,Header,Icon, Dropdown} from 'semantic-ui-react'

import firebase from '../../firebase'



class UserPanel extends Component {
  
state={
    user:this.props.currentUser
}




  handleSignOut=()=>{

    firebase
    .auth()
    .signOut()
    .then(()=>{
        console.log('Signed Out ')
    })

  }
  
  dropdownOptions=()=>[
      {   key:'user',
          disabled:true,
  text:<span>Signed in as <strong>{this.state.user&&this.state.user.displayName}</strong></span>
      },
      {   key:'avatar',
          text:<span>Change Avatar</span>
      },
      {   key:'signout',
          text:<span onClick={
              this.handleSignOut
          }>Sign Out</span>
      }
  ]
  
  
  
    render() {

        const {user}=this.state

        const {primaryColor}= this.props

        return (
            <Grid style={{background:primaryColor}}>
                <Grid.Column >
                    <Grid.Row style={{padding:'1.2em',margin:0}}>
                        <Header inverted floated="left" as="h2">
<Icon name="react"/>

                            <Header.Content>
                                SlackChat

                            </Header.Content>

                        </Header>
                    </Grid.Row>


<Header style={{padding:'0.25em'}} as="h4" inverted>
<Dropdown trigger={
<span>

<Image src={user.photoURL} spaced="right" avatar/>

    {user.displayName}
</span>
}
options={this.dropdownOptions()}
/>
</Header>


                </Grid.Column>
            </Grid>
        )
    }
}



export default UserPanel