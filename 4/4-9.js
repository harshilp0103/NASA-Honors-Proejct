import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for gridded ion Providers
const GriddedIonContext = createContext();

// Gridded ion Providers componennt
const GriddedIonProvider = ({ children }) => {

  // State variables for gridded ion data
  const [griddedIonData, setGriddedIonData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [griddedIonLoading, setGriddedIonLoading] = useState(true);

  // State variables for the selected components from the gridded ion table
  const [selectedGriddedIon, setSelectedGriddedIon] = useState([]);
  
  // Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-9 Gridded Ion Electric Propulsion");

				setGriddedIonData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setGriddedIonLoading(false);
			}
		};

		fetchData();
	}, []);


  return (
    <GriddedIonContext.Provider value={{ griddedIonData, griddedIonLoading, selectedGriddedIon, setSelectedGriddedIon }}> 
      {children}
    </GriddedIonContext.Provider>
  );
};

export { GriddedIonContext, GriddedIonProvider };
