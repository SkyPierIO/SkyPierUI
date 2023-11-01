import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "~~/utils/scaffold-eth";
import { MapPinIcon } from "@heroicons/react/24/outline";


export const CurrentIP = () => {
  const [currentIP, setCurrentIP] = useState<string>("Where am I?");
  const [country, setCountry] = useState<string>("Earth");

  const IpAddr = async () => {
    try {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
      };
      const response = await axios.get(`http://ip-api.com/json/?fields=country,query`, config);
      console.log(response.status)
      if (response.status === 200) {
        if (response.data.query) {
          setCurrentIP(response.data.query);
        } else  {
          notification.error("Cannot get current IP address.");
        }
        if (response.data.country) {
          setCountry(response.data.country);
        } else  {
          notification.error("Cannot get current country.");
        }
      }
    } catch (error) {
      console.error(error);
      notification.error("Error.");

    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      IpAddr()
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div onClick={() => IpAddr()} className="flex flex-col items-center mr-1">
      <button className="btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent min-h-0 h-auto">
        <div className="w-full flex items-center justify-center">
          <span className="text-[0.8em] font-bold mr-1"><MapPinIcon className="h-5 w-5"/></span>
          <span>{currentIP}</span>
        </div>
      </button>
      <span className="text-xs text-[#0975f6]">{country}</span>
    </div>
  );
};
