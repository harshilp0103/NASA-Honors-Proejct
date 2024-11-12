import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for cold gas Providers
const ColdGasContext = createContext();

// Cold gas Providers componennt
const ColdGasProvider = ({ children }) => {

  // State variables for cold gas data
  const [coldGasData, setColdGasData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [coldGasLoading, setColdGasLoading] = useState(true);

  // State variables for the selected components from the cold gas table
  const [selectedColdGas, setSelectedColdGas] = useState([]);
  
    // Effect hook for fetching the Hosted Payload table data from Supabase
    useEffect(() => {
      const fetchData = async () => {
      try {
     const sortedData = await fetchTableData("Table 4-5 Cold Gas Propulsion");
  
     setColdGasData(sortedData || []);
      } catch (error) {
        throw new Error("Error fetching data: ", error.message);
      } finally {
        setColdGasLoading(false);
             }
        };   
     fetchData();
    }, []); 

  return (
    <ColdGasContext.Provider value={{ coldGasData, coldGasLoading, selectedColdGas, setSelectedColdGas }}> 
      {children}
    </ColdGasContext.Provider>
  );
};

export { ColdGasContext, ColdGasProvider };
