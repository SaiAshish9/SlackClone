import React, { Component } from 'react'

import {Label,Menu,Icon,Modal,Form,Input,Button} from 'semantic-ui-react'

import {setCurrentChannel,setPrivateChannel} from '../../actions'

import {connect} from 'react-redux'

import firebase from '../../firebase'

class Channels extends Component {


state={
    user:this.props.currentUser,
    channels:[],
    activeChannel:'',
    modal:false,
    channelName:'',
    channel:null,
    channelDetails:'',
    messagesRef:firebase.database().ref('messages'),
    channelsRef:firebase.database().ref('channels'),
    notifications:[],
    firstLoad:true
}

componentDidMount(){
    this.addListeners()
}

componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  };


addNotificationListener=channelId=>{

   this.state.messagesRef.child(channelId).on('value',snap=>{
       if(this.state.channel){
           
          this.handleNotifications(channelId,this.state.channel.id,this.state.notifications,snap)
          
       }
   })

}


handleNotifications=(currentChannelId,channelId,notifications,snap)=>{

let lastTotal=0;

let index=notifications.findIndex(notification=>notification.id===channelId);

if(index !== -1){



    if(channelId!==currentChannelId){
        lastTotal=notifications[index].total
        
        if(snap.numChildren()-lastTotal>0){
            

notifications[index].count=snap.numChildren()-lastTotal

        }

notifications[index].lastKnownTotal=snap.numChildren()

    }

}else{
    notifications.push({
       id:channelId,
       total:snap.numChildren(),
       lastKnownTotal:snap.numChildren(),
       count:0
    })
}

this.setState({notifications})
}


addListeners=()=>{

    let loadedChannels=[]

    this.state.channelsRef.on('child_added',snap=>{


    loadedChannels.push(snap.val())

    this.setState({channels:loadedChannels},()=>{
        this.setFirstChannel()
    })

this.addNotificationListener(snap.key)


    })

}


setFirstChannel=()=>{

const firstChannel=this.state.channels[0]

if(this.state.firstLoad&&this.state.channels.length>0){
this.setActiveChannel(firstChannel)

this.setState({channel:firstChannel})

this.props.setCurrentChannel(firstChannel)
    }

    this.setState({firstLoad:false})

}


changeChannel=channel=>{
    
    this.props.setCurrentChannel(channel)
    
    this.setActiveChannel(channel)

    this.props.setPrivateChannel(false)
    
    this.setState({channel})


    this.clearNotifications()
}


clearNotifications=()=>{
   let index=this.state.notifications.findIndex(notification=>notification.id===this.state.channel.id)


if(index!==-1){

let updatedNotifications=[...this.state.notifications]
updatedNotifications[index].total=this.state.notifications[index].lastKnownTotal
updatedNotifications[index].count=0
this.setState({notifications:updatedNotifications})



}



}


setActiveChannel=channel =>{
    this.setState({activeChannel:channel.id})
}

addChannel=()=>{

   const {channelsRef,channelName,channelDetails,user} = this.state
   
   const key = channelsRef.push().key

   const newChannel={
     id:key,
     name:channelName,
     details:channelDetails,
     createdBy:{
         name:user.displayName,
         avatar:user.photoURL
     }
   }

   channelsRef
    .child(key)
    .update(newChannel)
    .then(()=>{
        this.setState({channelName:"",channelDetails:''})
        this.closeModal()        
        console.log('channel added')
    })
    .catch(e=>{
        console.log(e)
    })
}

handleSubmit=e => {
  e.preventDefault()
  if(this.isFormValid(this.state)){

    this.addChannel()

}
}


displayChannels=channels=>
    channels.length>0&&channels.map(channel=>(

<Menu.Item
key={channel.id}
onClick={()=>this.changeChannel(channel)}
name={channel.name}
style={{opacity:0.7}}
active={channel.id===this.state.activeChannel}
>
{this.getNotificationCount(channel)&&(
    <Label color="red">
       {this.getNotificationCount(channel)}
    </Label>
)}

#{channel.name}

</Menu.Item>
    ))



handleChange=e=>{
    this.setState({[e.target.name]:e.target.value})
}

isFormValid=({channelName,channelDetails})=>channelName && channelDetails


closeModal=()=>this.setState({modal:false})

openModal=()=>this.setState({modal:true})


getNotificationCount=channel=>{
    let count=0

this.state.notifications.forEach(notification=>{
    if(notification.id===channel.id){
        count=notification.count
    }
})

if(count>0)return count;

}

    render() {

const {channels,modal} = this.state

        return (

<React.Fragment>


        <Menu.Menu style={{paddingBottom:'2em'}}>
        
            <Menu.Item>
                <span>
                    <Icon name='exchange'/> CHANNELS
                </span>{" "}
({ channels.length }) <Icon name='add' style={{cursor: 'pointer'}} onClick={this.openModal} />

            </Menu.Item>

{this.displayChannels(channels)}

        </Menu.Menu>


<Modal basic open={modal} onClose={this.closeModal} >

   <Modal.Header>
       Add a Channel
   </Modal.Header>
   
   <Modal.Content>

   <Form onSubmit={this.handleSubmit}>
       <Form.Field>
            <Input
            fluid
            label="Name of Channel"
            name="channelName"
            onChange={this.handleChange}
            />
       </Form.Field>

       <Form.Field>
            <Input
            fluid
            label="About the Channel"
            name="channelDetails"
            onChange={this.handleChange}
            />
       </Form.Field>


   </Form>

   </Modal.Content>


<Modal.Actions>
    <Button color="green" inverted onClick={this.handleSubmit} >

        <Icon name="checkmark" />Add

    </Button>

    <Button color="red" inverted onClick={this.closeModal} >

        <Icon name="remove" />Cancel

    </Button>


</Modal.Actions>


</Modal>

</React.Fragment>


        )
    }
}

export default connect(

    null,
    {setCurrentChannel,setPrivateChannel}
)(Channels)