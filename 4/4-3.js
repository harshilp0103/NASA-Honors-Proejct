import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for propellant Providers
const PropellantContext = createContext();

// Propellant Providers componennt
const PropellantProvider = ({ children }) => {

  // State variables for propellant data
  const [propellantData, setPropellantData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [propellantLoading, setPropellantLoading] = useState(true);

  // State variables for the selected components from the propellant table
  const [selectedPropellant, setSelectedPropellant] = useState([]);
  
    // Effect hook for fetching the Hosted Payload table data from Supabase
    useEffect(() => {
      const fetchData = async () => {
      try {
     const sortedData = await fetchTableData("Table 4-3 Alternative Monopropellant and Bipropellant Propulsio");
  
     setPropellantData(sortedData || []);
      } catch (error) {
        throw new Error("Error fetching data: ", error.message);
      } finally {
        setPropellantLoading(false);
             }
        };   
     fetchData();
    }, []); 

  return (
    <PropellantContext.Provider value={{ propellantData, propellantLoading, selectedPropellant, setSelectedPropellant }}> 
      {children}
    </PropellantContext.Provider>
  );
};

export { PropellantContext, PropellantProvider };
