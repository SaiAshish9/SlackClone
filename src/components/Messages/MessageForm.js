import React, { Component } from 'react'

import {Segment,Button,Input} from 'semantic-ui-react'

import firebase from '../../firebase'

import FileModal from './FileModal'

import uuidv4 from 'uuid/v4'
import ProgressBar from './ProgressBar'


class MessageForm extends Component {

state={
    storageRef:firebase.storage().ref(),
    uploadState:'',
    uploadTask:null,
    message:'',
    loading:false,
    channel:this.props.currentChannel,
    user:this.props.currentUser,
    errors:[],
    modal:false,
    percentUploaded:0
}


handleChange=e=>{
    this.setState({[e.target.name]:e.target.value})
}


openModal=()=>{
this.setState({modal:true})    
}


closeModal=()=>{
    this.setState({modal:false})    
    }


createMessage=(fileUrl=null)=>{
   
    const message={
        timestamp:firebase.database.ServerValue.TIMESTAMP,
        user:{
        id:this.state.user.uid,
        name:this.state.user.displayName,
        avatar:this.state.user.photoURL
        },

    }

    if(fileUrl !== null){
        message['image']=fileUrl
    }else{
        message['content']=this.state.message
    }
return message

}

sendMessage=()=>{
    const { messagesRef }=this.props

    const { message,channel }=this.state

    if(message){
        
        this.setState({loading:true})

        messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(()=>{
            this.setState({loading:false,message:'',errors:[]})
        })
        .catch(e=>{
            console.error(e)
            this.setState({loading:false,errors:this.state.errors.concat(e)})
        })

    }else{

this.setState({
    errors:this.state.errors.concat({message:'Add a message'})
})
          
    }


}


uploadFile=(file,metadata)=>{

const pathToUpload=this.state.channel.id

const ref=this.props.messagesRef

const filePath=`chat/public/${uuidv4()}.jpg`

this.setState({
   
    uploadState:'uploading',
    uploadTask:this.state.storageRef.child(filePath).put(file,metadata)

},
()=>{
    this.state.uploadTask.on('state_changed',snap=>{
       
        const percentUploaded=Math.round(snap.bytesTransferred/snap.totalBytes)*100
        
        this.setState({percentUploaded})

    },
    err=>{

       console.error(err)

       this.setState({
           error:this.state.errors.concat(err),
           uploadState:'error',
           uploadTask:null
       })

    },
    ()=>{
        this.state.uploadTask.snapshot.ref.getDownloadURL()
        .then(url=>{
    this.sendFileMessage(url,ref,pathToUpload)

        })
        .catch( err=>{

            console.error(err)
     
            this.setState({
                error:this.state.errors.concat(err),
                uploadState:'error',
                uploadTask:null
            })
     
         }
         )

    }
    
    
    )
}


)

}

sendFileMessage=(url,ref,pathToUpload)=>{

  ref.child(pathToUpload)
     .push()
     .set(this.createMessage(url))
     .then(()=>{
         this.setState({uploadState:'done'})
     })
     .catch(e=>{
         console.error(e)


         this.setState({
             errors:this.state.errors.concat(e)
         })

     })

}


    render() {


const {errors,message,loading,modal,uploadState,percentUploaded}=this.state

        return (
            <Segment className="message__form">
                <Input
                fluid
                name="message"
                onChange={this.handleChange}
                style={{marginBottom:'0.7em'}}
                label={<Button icon={'add'} />}
                value={message}
                labelPosition="left"
                autoComplete="off"
                className={
                   errors.some(e=>e.message.includes('message'))?"error":"" 
                }
                placeholder="Write your message"
                />
              
              <Button.Group icon widths="2">

                  <Button
                  onClick={this.sendMessage}
                  disabled={loading}
                  color="orange"
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit" 
                  />

                 <Button
                  color="teal"
                  disabled={uploadState==='uploading'}
                  onClick={this.openModal}
                  content="Upload Media"
                  labelPosition="right"
                  icon="cloud upload" 
                  />



            
              </Button.Group>



              <FileModal
              
              modal={modal}
              closeModal={this.closeModal}
              uploadFile={this.uploadFile}              
              
              /> 
              <ProgressBar
              
              uploadState={uploadState}
              percentUploaded={percentUploaded}
              
              
              />


            </Segment>
        )
    }
}

export default MessageForm
