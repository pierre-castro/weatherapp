import React, { useState, useEffect } from 'react'
import './WeatherApp.css'

import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import humidity_icon from '../Assets/humidity.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import location_icon from '../Assets/location.png'



const WeatherApp = () => {
    
    let api_key = import.meta.env.VITE_API_KEY;
    
    const [wicon, setWicon] = useState(clear_icon);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        getUserLocation();
    }, []);

    useEffect(() => {
        if (userLocation != null){
            searchByCoords();
        }
    }, [userLocation]);
    
    const getUserLocation = () =>{
        if (navigator.geolocation){

            navigator.permissions
                .query({name: "geolocation"})
                .then((result)=>{
                    if (result.state === "granted") {
                        //If granted then you can directly call your function here
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const {latitude, longitude} = position.coords;
                                setUserLocation({latitude, longitude});
                            },
                            (error) => {
                                console.error('Error getting user location :', error);
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 5000,
                                maximumAge: 0,
                            }
            
                        );

                      } else if (result.state === "prompt") {
                        //If prompt then the user will be asked to give permission
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const {latitude, longitude} = position.coords;
                                setUserLocation({latitude, longitude});
                                console.log("Success");
                            },
                            (error) => {
                                console.error('Error getting user location :', error);
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 5000,
                                maximumAge: 0,
                            }
            
                        );

                      } else if (result.state === "denied") {
                        //If denied then you have to show instructions to enable location
                      }
                })
        }
        else{
            console.error("Geolocation is not supported");
        }
    };

        
    const fillWeather = (data) =>{

        const humidity = document.getElementsByClassName("humidity-percent");
        const wind = document.getElementsByClassName("wind-speed");
        const temperature = document.getElementsByClassName("weather-temp");
        const location = document.getElementsByClassName("weather-location");
        
        humidity[0].innerHTML = data.main.humidity + " %";
        wind[0].innerHTML = data.wind.speed + " m/sec";
        temperature[0].innerHTML = Math.round(data.main.temp * 10) / 10 + " °c";
        location[0].innerHTML = data.name;
        
        if(data.weather[0].icon === "01d" || data.weather[0].icon === "01n"){
            setWicon(clear_icon);
        }
        else if(data.weather[0].icon === "02d" || data.weather[0].icon === "02n"){
            setWicon(cloud_icon);
        }
        else if(data.weather[0].icon === "03d" || data.weather[0].icon === "03n"){
            setWicon(drizzle_icon);
        }
        else if(data.weather[0].icon === "04d" || data.weather[0].icon === "04n"){
            setWicon(drizzle_icon);
        }
        else if(data.weather[0].icon === "09d" || data.weather[0].icon === "09n"){
            setWicon(rain_icon);
        }
        else if(data.weather[0].icon === "10d" || data.weather[0].icon === "10n"){
            setWicon(rain_icon);
        }
        else if(data.weather[0].icon === "11d" || data.weather[0].icon === "11n"){
            setWicon(rain_icon);
        }
        else if(data.weather[0].icon === "13d" || data.weather[0].icon === "13n"){
            setWicon(snow_icon);
        }
        else{
            setWicon(clear_icon);
        }
    };

    
    const searchByTown = async () => {

        const element = document.getElementsByClassName("cityInput");

        if(element[0].value===""){
            return 0;
        }
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&lang=fr&appid=${api_key}`;
        
        let response = await fetch(url);
        let data = await response.json();

        if (data.cod == 404){
            window.alert("City not found.\nPlease type in a valid city name.");
            return 1;
        }
        else{
            fillWeather(data);
        }
        return 0;
    };

    const searchByCoords = async () => {
        
        if (userLocation){
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&units=Metric&lang=fr&appid=${api_key}`;
            
            let response = await fetch(url);
            let data = await response.json();
            
            fillWeather(data);
            
            return 0;
        }
        else{
            window.alert("Please let us know you location to use this feature !");
        }
    };

  return (
    <div className='container'>
        <div className='top-bar'>
            <input type="text" className="cityInput" placeholder='Search city' onKeyDown={(e) => {
                if (e.key === "Enter"){
                    searchByTown();
                }
                }}
            />
            <div className="search-icon" onClick={()=>(searchByTown())}>
                <img src={search_icon} alt="" />
            </div>
            <div className="location-icon" onClick={()=>(searchByCoords())}>
                <img src={location_icon} alt="Search current location" />
            </div>
        </div>
        <div className="weather-image">
            <img src={wicon} alt="" />
        </div>
        <div className="weather-temp"></div>
        <div className="weather-location"></div>
        <div className="data-container">
            <div className="element">
                <img src={humidity_icon} alt="" className="icon" />
                <div className="data">
                    <div className="humidity-percent"></div>
                    <div className="text">Humidity</div>  
                </div>
            </div>
            <div className="element">
                <img src={wind_icon} alt="" className="icon" />
                <div className="data">
                    <div className="wind-speed"></div>
                    <div className="text">Wind Speed</div>  
                </div>
            </div>
        </div>
    </div>
  )
};

export default WeatherApp;
