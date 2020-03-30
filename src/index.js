import React,{ Component} from "react";
import ReactDOM from "react-dom";

import {setUser,clearUser} from './actions' 

import firebase from './firebase'


import Spinner from './Spinner/Spinner'

import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import registerServiceWorker from "./registerServiceWorker";

import 'semantic-ui-css/semantic.min.css'

import { BrowserRouter as Router, Switch, Route,withRouter } from "react-router-dom";

import rootReducer from './reducers'

import {createStore } from 'redux'

import {Provider,connect} from 'react-redux'

import { composeWithDevTools } from 'redux-devtools-extension'


const store=createStore(
  rootReducer,
  composeWithDevTools()
)


const mapStateToProps =state=>({
  isLoading:state.user.isLoading
})



class Root extends Component{
 

  componentDidMount(){

  firebase.auth().onAuthStateChanged(user=>{
    if(user){
      this.props.setUser(user)
      this.props.history.push('/')
    }else{

this.props.history.push('/login')
this.props.clearUser()
    }

  })

  }
 
 render(){
 


  return this.props.isLoading?<Spinner/>:(
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  )
  
 }
}

const RootWithAuth =withRouter(connect(mapStateToProps,{setUser,clearUser})(Root))

ReactDOM.render(

<Provider store={store}>
<Router>
<RootWithAuth />
</Router>
</Provider>



  
  , document.getElementById("root"));
registerServiceWorker();
