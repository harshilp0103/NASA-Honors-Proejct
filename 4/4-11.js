import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for plasma Providers
const PlasmaContext = createContext();

// Plasma Providers componennt
const PlasmaProvider = ({ children }) => {

  // State variables for plasma data
  const [plasmaData, setPlasmaData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [plasmaLoading, setPlasmaLoading] = useState(true);

  // State variables for the selected components from the plasma table
  const [selectedPlasma, setSelectedPlasma] = useState([]);
  
  // Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-11 Pulsed Plasma and Vaccum Arc Electric Propulsion");

				setPlasmaData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setPlasmaLoading(false);
			}
		};

		fetchData();
	}, []);


  return (
    <PlasmaContext.Provider value={{ plasmaData, plasmaLoading, selectedPlasma, setSelectedPlasma }}> 
      {children}
    </PlasmaContext.Provider>
  );
};

export { PlasmaContext, PlasmaProvider };
