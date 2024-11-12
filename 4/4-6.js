import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for solid motor Providers
const SolidMotorContext = createContext();

// Solid motor Providers componennt
const SolidMotorProvider = ({ children }) => {

  // State variables for solid motor data
  const [solidMotorData, setSolidMotorData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [solidMotorLoading, setSolidMotorLoading] = useState(true);

  // State variables for the selected components from the solid motor table
  const [selectedSolidMotor, setSelectedSolidMotor] = useState([]);
    	
  // Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-6 Solid Motor Chemical Propulsion");

				setSolidMotorData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setSolidMotorLoading(false);
			}
		};

		fetchData();
	}, []);
  

  return (
    <SolidMotorContext.Provider value={{ solidMotorData, solidMotorLoading, selectedSolidMotor, setSelectedSolidMotor }}> 
      {children}
    </SolidMotorContext.Provider>
  );
};

export { SolidMotorContext, SolidMotorProvider };
