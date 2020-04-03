import React,{ Component} from 'react'

import { Sidebar,Menu,Divider,Button,Modal,Icon,Label,Segment } from 'semantic-ui-react'

import {SliderPicker} from 'react-color'

import firebase from '../../firebase'


import {connect} from 'react-redux'

import {setColors} from '../../actions'

class ColorPanel extends Component {



state={

    modal:false,
    primary:'',
    secondary:'',
    usersRef:firebase.database().ref('users'),
    user:this.props.currentUser,
    userColors:[]

}



componentDidMount(){

    if(this.state.user){
        this.addListener(this.state.user.uid)
    }

}


componentWillUnmount(){
    this.removeListener()
}


removeListener=()=>{

this.state.usersRef
.child(`${this.state.user.uid}/colors`).off()


}




displayUserColors=colors=>(

    colors.length>0 && colors.map((color,i)=>((


<React.Fragment key={i} >


<Divider/>

<div className="color__container" style={{position: 'relative',overflow:'hidden',width:'35px',borderRadius:'5px',cursor:'pointer'}}

onClick={()=>this.props.setColors(color.primary,color.secondary)}

>

<div className="color__square" style={{background:color.primary,width:'35px',height:'35px'}}>


<div className="color__overlay" style={{background:color.secondary,width:'85px',height:'35px',transform:'rotate(225deg)'}}>

</div>


</div>

</div>



</React.Fragment>


    )))

)

addListener=userId=>{


let userColors=[];

this.state.usersRef
.child(`${userId}/colors`)
.on('child_added',snap=>{
    
    userColors.unshift(snap.val())


   this.setState({userColors})

})

}


handleChangePrimary= color  =>{

this.setState({
    primary:color.hex})


}


handleSaveColors=()=>{


    if(this.state.primary && this.state.secondary){

this.saveColors(this.state.primary,this.state.secondary)


    }

}


saveColors=(primary,secondary)=>{


this.state.usersRef
.child(`${this.state.user.uid}/colors`)
.push()
.update({
    primary,
    secondary
})
.then(()=>{
    console.log('Colors added')
    this.closeModal()
})
.catch(err => console.error(err))

}


handleChangeSecondary= color  =>{
    this.setState({
        secondary:color.hex})
}



openModal=()=>this.setState({modal:true})

closeModal=()=>this.setState({modal:false})


render(){

    const {modal,primary,secondary,userColors}=this.state


    return (
       
<Sidebar
as={Menu}
icon='labeled'
inverted
vertical
visible
width="very thin"
>

<Divider/>

<Button icon="add" size="small" color="blue" onClick={this.openModal} />

{ 
this.displayUserColors(userColors)
}

<Modal basic open={modal} onClose={this.closeModal} >

<Modal.Header>
    Choose App Colors
</Modal.Header>


<Modal.Content>

<Segment inverted>

<Label content="Primary Color" />

<SliderPicker color={primary} onChange={this.handleChangePrimary} />

</Segment>


<Segment inverted>

<Label content="Secondary Color" />

<SliderPicker color={secondary} onChange={this.handleChangeSecondary} />

</Segment>



</Modal.Content>

<Modal.Actions>

<Button color="green" inverted onClick={this.handleSaveColors} >

<Icon name='checkmark' /> Save Colors

</Button>


<Button color="red" inverted onClick={this.closeModal}>

<Icon name='remove'  /> Cancel

</Button>


</Modal.Actions>


</Modal>

</Sidebar>


    )
}
}

export default connect(null,{setColors})(ColorPanel)
