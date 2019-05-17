import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class AddEntry extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      category: "aerobic",
      description: "",
      duration1: "12:00",
      duration2: "12:30",
      date: moment()
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.dateChange = this.dateChange.bind(this);
  }
  
  dateChange(d){
    this.setState({date: d});
  }
  
  onChange(e){
    console.log(e);
    
    switch(e.target.id){
      case 'category':
        this.setState({category: e.target.value});
        break;
      case 'description':
        this.setState({description: e.target.value});
        break;
      case 'duration1':
        this.setState({duration1: e.target.value});
        break;
      case 'duration2':
        this.setState({duration2: e.target.value});
        break;
    }

  }
  
  onSubmit(e){
    e.preventDefault();
    console.log(this.state);
    // action='/api/updatedata' method='put'
  }
  
  render(){    
    return(      
      <div>
          <div className="col-md-6">
            <h2>New Entry</h2>

            <form id="exercise_form" onSubmit={this.onSubmit}>
              <div className="form-group">
                <label>Choose the category of your exercise</label>
                <select onChange={this.onChange} id="category" className="form-control" name="category" required>
                  <option value="aerobic" selected>aerobic</option>
                  <option value="strength">strength</option>
                  <option value="flexibility">flexibility</option>
                  <option value="balance">balance</option>
                </select>
 	            </div>
              <div className="form-group">
                <label>Description of your exercise</label>
                <textarea onChange={this.onChange} value={this.state.description} className="form-control" id="description" name='description' required />
	            </div>
              <div className="form-group mx-1">
                <label>Provide the duration of your exercise</label>
                <input type='time' className="mx-1" onChange={this.onChange} id='duration1' name='duration1' min="00:00" max="24:00" value={this.state.duration1} required />
                <p style={{display: "inline"}}>to</p>
                <input className="mx-1" 
                  type='time' 
                  onChange={this.onChange} 
                  id='duration2' name='duration2' min="00:00" 
                  max="24:00" value={this.state.duration2} required />
	            </div>
              <div className="from-group">
                <div className="input-group date">
                  <label>Choose the date of your exercise</label>
                  <DatePicker
                    selected={this.state.date}
                    onChange={this.dateChange} 
                    filterDate={this.isWeekday}
                    id='datepicker' 
                    name="date" 
                    required />
                  <span className="input-group-addon">
                    <span className="glyphicon glyphicon-calendar" />
                  </span>
                </div>
	            </div>
              <input type='submit' 
                className="btn my-2 btn-block btn-primary" 
                name='submit' 
                value='add new entry' />
	         </form>
	        </div>
        </div>
    );
  }
}

export default AddEntry;