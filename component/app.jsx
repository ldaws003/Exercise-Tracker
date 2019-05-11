import React from 'react';
import AddEntry from './add_entry.jsx';
import ProgressGraph from './progress_graph.jsx';
import Journal from './journal.jsx';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {};
  }
  
  render(){
    
    return(
      
      <div>
        <AddEntry />
        <ProgressGraph />
        <Journal />
      </div>
      
    );
  }
}

export default App;