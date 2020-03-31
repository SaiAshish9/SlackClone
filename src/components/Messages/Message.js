import React from 'react'

import {Comment,Image} from 'semantic-ui-react'

import moment from 'moment'

const isOwnMessage=(message,user) =>{


    return message.user.id===user.id?{ borderLeft:' 2px solid orange',paddingLeft:'8px'}:{}


}

const timeFromNow=timestamp=> moment(timestamp).fromNow()

const isImage=(message)=>{
return message.hasOwnProperty('image')&&!message.hasOwnProperty('content')
}


const Message = ({message,user}) => {
    return (
        <Comment>
            
            <Comment.Avatar src={message.user.avatar} />
            <Comment.Content style={isOwnMessage(message,user)}>
                 
            <Comment.Author as="a">

{message.user.name}

            </Comment.Author>

        <Comment.Metadata>

        {timeFromNow(message.timestamp)}    
            
        </Comment.Metadata>         






{isImage(message)?<Image src={message.image} style={{padding:'1em'}}/>:
<Comment.Text>
    {message.content}
</Comment.Text>

    }

            </Comment.Content>

        </Comment>
    )
}

export default Message
