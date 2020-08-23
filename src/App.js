import React,{ useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select,MenuItem, Card, CardContent} 
from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './Util';
import LineGraph from './LineGraph'



function App() {
  const [countries, setCountries] = useState([]);
  const [country ,setCountry] = useState('WorldWide');
  const [countryInfo , setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);


useEffect(() => {
  fetch('https://disease.sh/v3/covid-19/all')
  .then(response => response.json())
  .then(data => {
    setCountryInfo(data);
  })
}, [])
 
useEffect(() => {
  
  const getCountriesData = async () => {
   await fetch ('https://disease.sh/v3/covid-19/countries')
    .then((response) => response.json())
    .then((data) => {
      const countries = data.map((country) => ({
        name: country.country,           // united kingdom , pakistan, iran
        value: country.countryInfo.iso2 //uk , pk , ir
      }));
      const sortedData = sortData(data)
      setTableData(sortedData);
      setCountries(countries);
    });
  };
    getCountriesData();
}, []);


const onCountryChange = async (e) => {
  const countryCode = e.target.value;
  console.log('check it ',countryCode);
  setCountry(countryCode);

  const url = countryCode === 'WorldWide' ?
   "https://disease.sh/v3/covid-19/all" : 
  `https://disease.sh/v3/covid-19/countries/${countryCode}`
  
  await fetch(url)
  .then(response => response.json())
  .then(data => {
    setCountry(countryCode);
    setCountryInfo(data); 
  })
};

 console.log('country info ', countryInfo);
  return (
    <div className="app">
      <div className='app-left'>
        

      <div className='app__header'>
        <h1 className="heading">Covid-19 Tracker App</h1>
       <Card>
       <FormControl >
          <Select 
          variant ='outlined'
          value = {country}
          onChange={onCountryChange}
          >
            <MenuItem value="WorldWide" color='white' >World Wide</MenuItem>
            {
              countries.map((country) => (
                <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>
              )) }
            </Select>
            </FormControl>
       </Card>
        </div>
        
        {/* header */}

        {/* input + dropout field */}
        <div className="app_status">
                <InfoBox title="Corona Virus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
                
                <InfoBox title="Recoverd" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>

                <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        {/* info box */}
        {/* info box */}
        {/* info box */}
        
        {/* map */}
         <Map />
      </div>
      <Card className='app-right'>
                  {/* table */}
                  
                  {/* graph */}
                <CardContent>
                  <h3>Live Cases</h3>
                  <Table countries={tableData} />
                  <h3>World wide new Cases</h3>
                </CardContent>
                <LineGraph />
      </Card>
    </div>
  );
}

export default App;