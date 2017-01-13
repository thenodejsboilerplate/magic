import React, { Component } from 'react';  
import { connect } from 'react-redux';  
import * as actions from '../actions';

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.props.protectedTest();
  }

  renderContent() {
    if(this.props.content) {
      return (
        <p>{this.props.content}</p>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps(state) {  
  return { content: state.auth.content };
}

export default connect(mapStateToProps, actions)(Dashboard);  



// In this snippet, there are several key things to mention and come to understand. We are using connect to connect our React component to our Redux store. By encapsulating our router, and therefore contained components, within the Provider, we made our Redux store available to be connected. Our mapStateToProps function is how we subscribe our component to specific state updates from our Redux store. In that function, we are making state.auth.content accessible to our component at this.props.content. We are also injecting our action creators. In this instance, we injected all of our action creators, but you can inject select action creators by calling them specifically (e.g., { protectedTest } in this instance). To better explain what's happening in this component, without having built our action creators or reducers, let's start in our constructor. We are calling our protectedTest() function to run when the component is first called. This function (which we will soon write) will send an HTTP GET request to our API's protected test route. We wrote a function, renderContent(), which will return this.props.content if it exists, otherwise it will do nothing. We mapped state.auth.content (a piece of our Redux state) to this.props.content. After our protectedTest() request returns, it will dispatch the payload, or response, from that request to our auth reducer, which will map the response to the appropriate piece of state and send back the updated state. Our component, which is subscribed to updates in this piece of state, will then be updated with the new state.