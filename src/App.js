import React, { Component } from 'react';
import moment from 'moment';
import './App.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import InfoBox from './InfoBox';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null,
      hoverLoc: null,
      activePoint: null,
	  number_of_months:null
	  
    }
  }
  handleChartHover(hoverLoc, activePoint){
	this.setState({
	hoverLoc: hoverLoc,
	activePoint: activePoint
	})
  }
  
  handleChange = (e) => {
	this.setState({
		[e.target.number_of_months]: e.target.value
			
	})
  }
 
  isPrime(value){
    //test if number is prime
    for(var j=2; j < value; j++){
		if(value % j === 0){
		  return false;
		}
	  }
	  return true;
   }  
   sumPrimes(num) {
	  var output = 0;

	  //loop through all numbers from 2 up to input value

	  for(var j=2; j <= num; j++){   

		//sum only prime numbers, skip all the rest
		if(this.isPrime(j)){
		  output += j;
		}
	  }
	  return output;
  }
  componentDidMount(){
	const getData = () => {
	  var query = window.location.search.substring();
	  var vars = query.split("=");
	  let no_of_momths =vars[1];
	  let start_date = moment().subtract(1, 'months').format('YYYY-MM-DD');
	  if ( no_of_momths!==undefined &&  (no_of_momths>6 || no_of_momths<1))
	  {
		  alert("Months must be between 1 and 6.");
	  }
	  if (no_of_momths!==undefined && no_of_momths!=="" && no_of_momths<=6){
		start_date = moment().subtract(no_of_momths, 'months').format('YYYY-MM-DD');

	  }else{
		//if number of months is more than 6, default to 1 months
		start_date = moment().subtract(1, 'months').format('YYYY-MM-DD');
	  }
	  
	  let end_date =moment().format('YYYY-MM-DD');
	 
      const url = 'https://api.coindesk.com/v1/bpi/historical/close.json?start='+start_date+'&end='+end_date;

      fetch(url).then( r => r.json())
        .then((bitcoinData) => {
          const sortedData = [];
          let count = 0;
          for (let date in bitcoinData.bpi){
            sortedData.push({
              d: moment(date).format('MMM DD'),
              p: bitcoinData.bpi[date].toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
              x: count, //previous days
              y: bitcoinData.bpi[date] // numerical price
            });
            count++;
			//if is prime number on that day console log/alert the results
			if (this.isPrime(this.sumPrimes(bitcoinData.bpi[date]))==true){
				//console data
				console.log("Date: ",date," Bitcoin Price: ",this.sumPrimes(bitcoinData.bpi[date])," Is Prime Result:",this.isPrime(this.sumPrimes(bitcoinData.bpi[date])));
				//alert data
				alert("Date: "+date+" Bitcoin Price: "+this.sumPrimes(bitcoinData.bpi[date])+" Is Prime Result: "+this.isPrime(this.sumPrimes(bitcoinData.bpi[date])));
			}
		  

          }
          this.setState({
            data: sortedData,
            fetchingData: false			
          })
        })
        .catch((e) => {
          console.log(e);
        });
    }
    getData();
  }
  onSubmit = (e) => {
       e.preventDefault();
       const form = {
        number_of_months: this.state.number_of_months
       }
  }
 
  render() {
    return (	 
      <div className='container'>'
	  
	  <form >
	  <label>
          Number of months (Max 6):
	  <input
            type="text"
			name="number_of_months"
			placeholder="Enter of Months (Max 6)"
			value={this.state.number_of_months} 
			onChange={e => this.handleChange(e)}
         />
		 </label>
		 <input type="submit" value="Update Results" />
		 </form>
        <div className='row'>
          <h1>Bitcoin Price Chart</h1>
        </div>
        <div className='row'>
          { !this.state.fetchingData ?
          <InfoBox data={this.state.data} />
          : null }
        </div>
        <div className='row'>
          <div className='popup'>
            {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint}/> : null}
          </div>
        </div>
        <div className='row'>
          <div className='chart'>
            { !this.state.fetchingData ?
              <LineChart data={this.state.data} onChartHover={ (a,b) => this.handleChartHover(a,b) }/>
              : null }
          </div>
        </div>
      </div>

    );
  }
}

export default App;
