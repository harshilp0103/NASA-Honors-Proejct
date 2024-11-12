import React, { createContext, useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// // Supabase database client
// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_ANON_KEY
// );
import { fetchTableData } from "../../resources/fetchData";

// Create context for propellant less Providers
const PropellantLessContext = createContext();

// Propellant less Providers componennt
const PropellantLessProvider = ({ children }) => {

  // State variables for propellant less data
  const [propellantLessData, setPropellantLessData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [propellantLessLoading, setPropellantLessLoading] = useState(true);

  // State variables for the selected components from the propellant less table
  const [selectedPropellantLess, setSelectedPropellantLess] = useState([]);
  
  // Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-13 Propellant-less Propulsion");

				setPropellantLessData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setPropellantLessLoading(false);
			}
		};

		fetchData();
	}, []);


  return (
    <PropellantLessContext.Provider value={{ propellantLessData, propellantLessLoading, selectedPropellantLess, setSelectedPropellantLess }}> 
      {children}
    </PropellantLessContext.Provider>
  );
};

export { PropellantLessContext, PropellantLessProvider };
