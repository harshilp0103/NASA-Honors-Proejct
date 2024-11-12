import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for electrospray Providers
const ElectrosprayContext = createContext();

// Electrospray Providers componennt
const ElectrosprayProvider = ({ children }) => {

  // State variables for electrospray data
  const [electrosprayData, setElectrosprayData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [electrosprayLoading, setElectrosprayLoading] = useState(true);

  // State variables for the selected components from the electrospray table
  const [selectedElectrospray, setSelectedElectrospray] = useState([]);
  
  // Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-8 Electrospray Electric Propulsion");

				setElectrosprayData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setElectrosprayLoading(false);
			}
		};

		fetchData();
	}, []);


  return (
    <ElectrosprayContext.Provider value={{ electrosprayData, electrosprayLoading, selectedElectrospray, setSelectedElectrospray }}> 
      {children}
    </ElectrosprayContext.Provider>
  );
};

export { ElectrosprayContext, ElectrosprayProvider };
