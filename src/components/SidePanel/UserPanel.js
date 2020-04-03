import React, { Component } from 'react'

import {Button,Image,Grid,Header,Icon, Dropdown,Modal,Input} from 'semantic-ui-react'

import firebase from '../../firebase'

import AvatarEditor from 'react-avatar-editor'  

class UserPanel extends Component {
  
state={
    user:this.props.currentUser,
    modal:false,
    previewImage:'',
    croppedImage:'',
    blob:'',
    uploadedCroppedImage:'',
    storageRef:firebase.storage().ref(),
    userRef:firebase.auth().currentUser,
    usersRef: firebase.database().ref('users') ,
    metadata:{
        contentType:'image/jpeg'
    }
}

openModal=()=>this.setState({modal:true})

closeModal=()=>this.setState({modal:false})


uploadCroppedImage=()=>{

    const { storageRef,userRef,blob,metadata }=this.state


    storageRef
    .child(`avatar/users/${userRef.user}`)
    .put(blob,metadata)
    .then(snap=>{
        snap.ref.getDownloadURL().then(downloadURL=>{

            this.setState({uploadedCroppedImage:downloadURL},()=>{
                this.changeAvatar()
            })

        })
    })

}

changeAvatar=()=>{
    this.state.userRef
    .updateProfile({
        photoURL:this.state.uploadedCroppedImage
    })
    .then(()=>{
        console.log('PhotoURL updated')
        this.closeModal()
    })
    .catch(err=>{
        console.error(err)
    })

this.state.usersRef
.child(this.state.user.uid)
.update({avatar:this.state.uploadedCroppedImage})
.then(()=>{
    console.log('user avatar updated')
})
.catch(err=>{
    console.error(err)
})

}

handleCropImage=()=>{

   if(this.avatarEditor){
       this.avatarEditor.getImageScaledToCanvas().toBlob(blob=>{

         let imageUrl=URL.createObjectURL(blob)

         this.setState({
             croppedImage:imageUrl,
             blob
         })

       })
   }
}


handleChange=e=>{
   
    const file=e.target.files[0]
    const reader=new FileReader()

if(file){
    reader.readAsDataURL(file)

    reader.addEventListener('load',()=>{
       
       this.setState({previewImage:reader.result})


    })

}


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
          text:<span onClick={this.openModal}  >Change Avatar</span>
      },
      {   key:'signout',
          text:<span onClick={
              this.handleSignOut
          }>Sign Out</span>
      }
  ]
  
  
  
    render() {

        const {user , modal ,previewImage, croppedImage  }=this.state

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


<Modal basic open={modal} onClose={this.closeModal}>

<Modal.Header>
    Change Avatar
</Modal.Header>

<Modal.Content>

<Input 
fluid
type='file'
label='New Avatar'
name='previewImage'
onChange={this.handleChange}

/>


<Grid centered stackable columns={2} >

<Grid.Row centered >

<Grid.Column className='ui center aligned grid' >


{previewImage && (

<AvatarEditor
  image={previewImage}
  width={120}
  height={120}
  border={50}
  scale={1.2}
  ref={node=>(this.avatarEditor=node  )}

/>

)}


</Grid.Column>


<Grid.Column>


{
    croppedImage && (
        <Image  
        style={{margin:'3.5em auto'}}
        width={100}
        height={100}
        src={croppedImage}
        />
    )
}


</Grid.Column>



</Grid.Row>


</Grid>


</Modal.Content>

<Modal.Actions>

{croppedImage && <Button color="green" inverted 
onClick={this.uploadCroppedImage}
 >

<Icon name="save"  /> Change Avatar


</Button>}

<Button color="green" inverted onClick={this.handleCropImage} >

<Icon name="image"  /> Preview


</Button>

<Button color="red" inverted onClick={this.closeModal} >

<Icon name="remove"  /> Cancel


</Button>


</Modal.Actions>


</Modal>

                </Grid.Column>
            </Grid>
        )
    }
}



export default UserPanel