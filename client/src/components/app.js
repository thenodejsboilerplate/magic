import React, { Component } from 'react';

//we wrap {this.props.children} in a container div. This is where our components from the routes will be placed.
class App extends Component {  
  render() {
    return (
      <div>
      <p>Header here</p>

      <div className="container">
        {this.props.children}
      </div>

      <p>Footer here</p>
      </div>
    );
  }
}

export default App;  