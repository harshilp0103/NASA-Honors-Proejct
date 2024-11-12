import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for hydrazine Providers
const HydrazineContext = createContext();

// Hydrazine Providers componennt
const HydrazineProvider = ({ children }) => {

  // State variables for hydrazine data
  const [hydrazineData, setHydrazineData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [hydrazineLoading, setHydrazineLoading] = useState(true);

  // State variables for the selected components from the hydrazine table
  const [selectedHydrazine, setSelectedHydrazine] = useState([]);
  
    // Effect hook for fetching the Hosted Payload table data from Supabase
    useEffect(() => {
      const fetchData = async () => {
      try {
     const sortedData = await fetchTableData("Table 4-2 Hydrazine Chemical Propulsion");
  
      setHydrazineData(sortedData || []);
      } catch (error) {
        throw new Error("Error fetching data: ", error.message);
      } finally {
        setHydrazineLoading(false);
             }
        };   
     fetchData();
    }, []); 

  return (
    <HydrazineContext.Provider value={{ hydrazineData, hydrazineLoading, selectedHydrazine, setSelectedHydrazine }}> 
      {children}
    </HydrazineContext.Provider>
  );
};

export { HydrazineContext, HydrazineProvider };
