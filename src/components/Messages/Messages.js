import React from 'react'

import { Segment,Comment} from 'semantic-ui-react'

import MessagesHeader from './MessagesHeader'

import MessageForm from './MessageForm'

import Message from './Message'

import Typing from './Typing'

import firebase from '../../firebase'

import {connect} from 'react-redux'

import {setUserPosts} from '../../actions'

import Skeleton from './Skeleton'


class Messages extends React.Component  {

state={ 
    privateChannel:this.props.isPrivateChannel,
    messagesRef:firebase.database().ref('messages'),
    channel:this.props.currentChannel,
    user:this.props.currentUser,
    messages:[],
    usersRef:firebase.database().ref('users'),
    isChannelStarred:false,
    messagesLoading:true,
    numUniqueUsers:'',
    searchTerm:'',
    searchLoading:false,
    searchResults:[],
    privateMessagesRef:firebase.database().ref('privateMessages'),
    typingRef:firebase.database().ref('typing'),
    typingUsers:[],
    connectedRef:firebase.database().ref('.info/connected'),
    listeners:[]
}


componentDidMount(){
 
    const {channel,user,listeners}=this.state


    if(channel&&user){


        this.removeListeners(listeners)

        this.addListeners(channel.id)

        this.addUserStarsListener(channel.id,user.uid)

    }


}


componentWillUnMount(){

    this.removeListeners(this.state.listeners)

    this.state.connectedRef.off()

}


removeListeners=listeners=>{
    listeners.forEach(listener=>{
        listener.ref.child(listener.id).off(listener.event)
    })
}

componentDidUpdate(prevProps,prevState){

if(this.messagesEnd){
    this.scrollToBottom()
}

}

addToListeners=(id,ref,event)=>{

const index=this.state.listeners.findIndex(listener=>{

return listener.id===id && listener.ref===ref&&listener.event===event

})


if(index===-1){


const newListener={id,ref,event}

this.state.listeners.concat(newListener)

}


}


scrollToBottom=()=>{
    this.messagesEnd.scrollIntoView({behavior:'smooth'})
}



addUserStarsListener=( channelId,userId )=>{


this.state.usersRef
.child(userId)
.child('starred')
.once('value')
.then(data=>{
    if(data.val()!== null ){
        const channelIds=Object.keys(data.val())
        const prevStarred=channelIds.includes(channelId)
this.setState({
    isChannelStarred:prevStarred
})


    }
})


}

addListeners=channelId=>{
   
    this.addMessageListener(channelId)
    this.addTypingListeners(channelId)

}


addTypingListeners=channelId=>{

   let typingUsers=[]

  this.state.typingRef.child(channelId)
  .on('child_added',snap=>{

     if(snap.key !== this.state.user.uid){


        typingUsers=typingUsers.concat({
            id:snap.key,
            name:snap.val()
        })

this.setState({typingUsers})

     }

  })

this.addToListeners(channelId,this.state.typingRef,'child_added')


this.state.typingRef
.child(channelId)
.on('child_removed',snap=>{

const index = typingUsers.findIndex(user=>user.id === snap.key)

if(index !== -1){
    typingUsers=typingUsers.filter(user=>user.id!==snap.key)
    this.setState({typingUsers})

}

})

this.addToListeners(channelId,this.state.typingRef,'child_removed')



this.state.connectedRef.on('value',snap=>{
   
    if(snap.val()=== true){

      this.state.typingRef
      .child(channelId)
      .child(this.state.user.uid)
      .onDisconnect()
      .remove(err=>{
        
        if(err!==null){
            console.error(err)
        }


      })



    }


})

}



displayTypingUsers=users=>{

users.length>0 && users.map(user=>(
    <div key={user.id} style={{display:'flex',alignItems:'center',marginBottom:'0.2em'}} >

<span style={{fontStyle:'Italic',fontWeight:'bold',marginRight:'3px'}} >

{user.name}
</span>

<Typing/>

</div>
))

}




getMessagesRef=()=>{


    const {messagesRef,privateMessagesRef,privateChannel}=this.state

    return privateChannel?privateMessagesRef:messagesRef

}


handleStar=()=>{
  this.setState(prevState => ({

isChannelStarred:!prevState.isChannelStarred



  }),()=>{

this.starChannel()


  } )  
}

starChannel=()=>{
    if(this.state.isChannelStarred){

this.state.usersRef
.child(`${this.state.user.uid}/starred`)
.update({
    [this.state.channel.id]:{
        name:this.state.channel.name,
        details:this.state.channel.details,
        createdBy:{
           name:this.state.channel.createdBy.name,
           avatar:this.state.channel.createdBy.avatar
        }
    }
})

    }else{


this.state.usersRef
.child(`${this.state.user.uid}/starred`)
.child(this.state.channel.id)
.remove(err=>{
    if(err!==null){
        console.error(err)
    }
})


    }
}



countUserPosts=messages=>{

    let userPosts=messages.reduce(
        (acc,message)=>{
            if(message.user.name in acc ){
                acc[message.user.name].count+=1
            }else{
               acc[message.user.name] ={
                   avatar:message.user.avatar,
                   count:1
               }
            }
            return acc
        },{}
    )

this.props.setUserPosts(userPosts)

}



addMessageListener=channelId=>{
    let loadedMessages=[]
    
const ref=this.getMessagesRef()

    ref.child(channelId).on('child_added',snap=>{
        loadedMessages.push(snap.val())

      this.setState({
         messages:loadedMessages,
         messagesLoading:false 
      })

this.countUniqueUsers(loadedMessages)
this.countUserPosts(loadedMessages)


    })


this.addToListeners(channelId,ref,'child_added')


}


countUniqueUsers=messages=>{
  
    const uniqueUsers=messages.reduce((acc,message)=>{

        if(!acc.includes(message.user.name)){
            acc.push(message.user.name)
        }
        return acc
    },[])

const plural=uniqueUsers.length>1 || uniqueUsers.length===0

    const numUniqueUsers=`${uniqueUsers.length} user${plural?'s':''}`

this.setState({numUniqueUsers})

}

displayMessages=messages=>(

messages.length>0 && messages.map(message=>(
    <Message 
    
    key={message.timestamp}
    message={message}
    user={this.state.user}
    
    />
))

)

displayChannelName=channel=>{

   return channel?`${this.state.privateChannel?'@':'#'}${channel.name}`:""

}


handleSearchChange=e=>{

   this.setState({
       searchTerm: e.target.value,
       searchLoading:true
   },()=>this.handleSearchMessages()
   
   )
   
}


handleSearchMessages=()=>{

  const channelMessages=[...this.state.messages]

  const regex=new RegExp(this.state.searchTerm,'gi')

  const searchResults=channelMessages.reduce((acc,message)=>{
     
    if(message.content &&  message.content.match(regex) ||message.user.name.match(regex) ){
        acc.push(message)
    }

return acc

  },[])

this.setState({searchResults})

setTimeout(()=>{
    this.setState({searchLoading: false})

},1000)


}

displayMessageSkeleton=loading=>
    loading?(
        <React.Fragment>
            {[...Array(10)].map((_,i)=>(
                <Skeleton key={i} />
            ))}
        </React.Fragment>
    ):null



    render(){

const {messagesRef,messages,channel,user,numUniqueUsers,searchResults,searchTerm,searchLoading,privateChannel,isChannelStarred,typingUsers,messagesLoading} = this.state

    return (
 <React.Fragment>

     <MessagesHeader
     channelName={this.displayChannelName(channel)}
     numUniqueUsers={numUniqueUsers}
     handleSearchChange={this.handleSearchChange}
     searchLoading={searchLoading}
     isPrivateChannel={privateChannel}
     handleStar={this.handleStar}
     isChannelStarred={isChannelStarred}
     />


<Segment>
    <Comment.Group className="messages">

{
    this.displayMessageSkeleton(messagesLoading)
}


{
  searchTerm?this.displayMessages(searchResults):
  this.displayMessages(messages)

}


{this.displayTypingUsers(typingUsers)}

<div ref={node =>(this.messagesEnd=node) }>

</div>

    </Comment.Group>
</Segment>

<MessageForm

messagesRef={messagesRef}
currentChannel={channel}
currentUser={user}
isPrivateChannel={privateChannel}
getMessagesRef={this.getMessagesRef}
/>

 </React.Fragment>
    )
}
}

export default connect(null,{setUserPosts})(Messages)
