import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for electrothermal Providers
const ElectrothermalContext = createContext();

// Electrothermal Providers componennt
const ElectrothermalProvider = ({ children }) => {

  // State variables for electrothermal data
  const [electrothermalData, setElectrothermalData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [electrothermalLoading, setElectrothermalLoading] = useState(true);

  // State variables for the selected components from the electrothermal table
  const [selectedElectrothermal, setSelectedElectrothermal] = useState([]);
  
    
  // Effect hook for fetching the mission table data from Supabase
    
  useEffect(() => {
    const fetchData = async () => {
        try {
            const sortedData = await fetchTableData("Table 4-7 Electrothermal Electric Propulsion");

            setElectrothermalData(sortedData || []);
        } catch (error) {
            throw new Error("Error fetching data: ", error.message);
        } finally {
          setElectrothermalLoading(false);
        }
    };

      fetchData();
  }, []);
  

  return (
    <ElectrothermalContext.Provider value={{ electrothermalData, electrothermalLoading, selectedElectrothermal, setSelectedElectrothermal }}> 
      {children}
    </ElectrothermalContext.Provider>
  );
};

export { ElectrothermalContext, ElectrothermalProvider };
