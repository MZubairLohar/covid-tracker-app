import React,{ useState, useEffect } from 'react';
import './App.css';
import { FormControl, 
  Select,
  MenuItem, 
  Card, 
  CardContent} 
from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat  } from './Util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';


function App() {
  const [countries, setCountries] = useState([]);
  const [country ,setCountry] = useState('WorldWide');
  const [countryInfo , setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState( { lat: 34.80746, lng: -40.4796 } )
  const [mapZoom, setMapZoom] = useState(3);

useEffect(() => {
  fetch('https://disease.sh/v3/covid-19/all')
  .then(response => response.json())
  .then(data => {
    setCountryInfo(data);
  });
}, []);
 
useEffect(() => {
  
  const getCountriesData = async () => {
   await fetch ('https://disease.sh/v3/covid-19/countries')
    .then((response) => response.json())
    .then((data) => {
      const countries = data.map((country) => ({
        name: country.country,           // united kingdom , pakistan, iran
        value: country.countryInfo.iso2 //uk , pk , ir
      }));
      let sortedData = sortData(data)
      setCountries(countries);
      setMapCountries(data);
      setTableData(sortedData);
    });
  };
    getCountriesData();
}, []);


const onCountryChange = async (e) => {
  const countryCode = e.target.value;
  console.log(countryCode);
  setCountry(countryCode);

  const url = countryCode === 'WorldWide' ?
   "https://disease.sh/v3/covid-19/all" : 
  `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  
  await fetch(url)
  .then((response) => response.json())
  .then(data => {
    setCountry(countryCode);
    setCountryInfo(data); 
    setMapCenter([data.countryInfo.lat ,data.countryInfo.long])
    setMapZoom(4);
  });
};

 console.log('country info ', countryInfo);
  return (
    <div className="app">
      <div className='app__left'>
        

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
        <div className="app_status">
                <InfoBox 
                onclick = {(e) => setCasesType("cases")}
                title="Corona Virus Cases" 
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={numeral(countryInfo.cases).format("0,0a")}/>
                
                <InfoBox
                onclick = {(e) => setCasesType("Recovery")}
                title="Recoverd" 
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total={numeral(countryInfo.recoverd).format("0,0a")}/>

                <InfoBox
                onclick = {(e) => setCasesType("Deaths")}
                title="Deaths" 
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={numeral(countryInfo.deaths).format("0,0a")}/>
        </div>
      
         <Map 
         countries = {mapCountries}
         casesType= {casesType}
         center={mapCenter}
         zoom={mapZoom}
         />
      </div>
      <Card className='app-right'>
                  
                <CardContent>
                  <h3>Live Cases</h3>
                  <Table countries={tableData} />
                  <h3>World wide new Cases</h3>
                
                <LineGraph casesType={casesType}/>
                </CardContent>
      </Card>
    </div>
  );
}

export default App;