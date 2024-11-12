import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for hall effect Providers
const HallEffectContext = createContext();

// Hall effect Providers componennt
const HallEffectProvider = ({ children }) => {

  // State variables for hall effect data
  const [hallEffectData, setHallEffectData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [hallEffectLoading, setHallEffectLoading] = useState(true);

  // State variables for the selected components from the hall effect table
  const [selectedHallEffect, setSelectedHallEffect] = useState([]);
  
  // Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-10 Hall Effect Electric Propulsion Thrusters");

				setHallEffectData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setHallEffectLoading(false);
			}
		};

		fetchData();
	}, []);


  return (
    <HallEffectContext.Provider value={{ hallEffectData, hallEffectLoading, selectedHallEffect, setSelectedHallEffect }}> 
      {children}
    </HallEffectContext.Provider>
  );
};

export { HallEffectContext, HallEffectProvider };
