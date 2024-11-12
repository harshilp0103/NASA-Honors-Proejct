import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for ambipolar Providers
const AmbipolarContext = createContext();

// Ambipolar Providers componennt
const AmbipolarProvider = ({ children }) => {

  // State variables for ambipolar data
  const [ambipolarData, setAmbipolarData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [ambipolarLoading, setAmbipolarLoading] = useState(true);

  // State variables for the selected components from the ambipolar table
  const [selectedAmbipolar, setSelectedAmbipolar] = useState([]);
  
  // Effect hook for fetching the mission table data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortedData = await fetchTableData("Table 4-12 Ambipolar Electric Propulsion");

        setAmbipolarData(sortedData || []);
      } catch (error) {
        throw new Error("Error fetching data: ", error.message);
      } finally {
        setAmbipolarLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AmbipolarContext.Provider value={{ ambipolarData, ambipolarLoading, selectedAmbipolar, setSelectedAmbipolar }}> 
      {children}
    </AmbipolarContext.Provider>
  );
};

export { AmbipolarContext, AmbipolarProvider };
