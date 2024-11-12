import React, { createContext, useState, useEffect } from 'react';
import { fetchTableData } from "../../resources/fetchData";

// Create context for hybrid Providers
const HybridContext = createContext();

// Hybrud Providers componennt
const HybridProvider = ({ children }) => {

  // State variables for hybrid data
  const [hybridData, setHybridData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [hybridLoading, setHybridLoading] = useState(true);

  // State variables for the selected components from the hybrid table
  const [selectedHybrid, setSelectedHybrid] = useState([]);
  
    // Effect hook for fetching the Hosted Payload table data from Supabase
    useEffect(() => {
      const fetchData = async () => {
      try {
     const sortedData = await fetchTableData("Table 4-4 Hybrid Chemical Propulsion");
  
     setHybridData(sortedData || []);
      } catch (error) {
        throw new Error("Error fetching data: ", error.message);
      } finally {
        setHybridLoading(false);
             }
        };   
     fetchData();
    }, []);


  return (
    <HybridContext.Provider value={{ hybridData, hybridLoading, selectedHybrid, setSelectedHybrid }}> 
      {children}
    </HybridContext.Provider>
  );
};

export { HybridContext, HybridProvider };
