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
      date: moment().format('DD/MM/YYYY')
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  onChange(e){
    e.preventDefault();
    
    switch(e.target.id){
      case 'category':
        break;
      case 'description':
        break;
      case 'duration1':
        break;
      case 'duration2':
        break;
      case 'date':
        break;
    }
    console.log(e.target.value);
  }
  
  onSubmit(e){
    e.preventDefault();
    console.log(this.state);
    // action='/api/updatedata' method='put'
  }
  
  render(){    
    return(      
      <React.Fragment>
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
                    className="form-control mx-1 date" 
                    selected={this.state.date}
                    onChange={this.onChange} 
                    id='datepicker' 
                    name="date" 
                    placeholder="MM/DD/YYYY" required />
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
        </React.Fragment>
    );
  }
}

export default AddEntry;