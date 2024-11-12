import React, { createContext, useState, useEffect } from 'react';

import { fetchTableData } from "../../resources/fetchData";

// Create context for propulsion summary Providers
const PropulsionSummaryContext = createContext();

// Propulsion summary Providers componennt
const PropulsionSummaryProvider = ({ children }) => {

  // State variables for propulsion summary data
  const [propulsionSummaryData, setPropulsionSummaryData] = useState([]);

  // Sate variables for loading message when table data is loading
  const [propulsionSummaryLoading, setPropulsionSummaryLoading] = useState(true);

  // State variables for the selected components from the propulsion summary table
  const [selectedPropulsionSummary, setSelectedPropulsionSummary] = useState([]);
  
 	// Effect hook for fetching the Hosted Payload table data
   useEffect(() => {
	  const fetchData = async () => {
		try {
			const sortedData = await fetchTableData("Table 4-1 Summary of Propulsion Technologies Surveyed");

			setPropulsionSummaryData(sortedData || []);
		} catch (error) {
			throw new Error("Error fetching data: ", error.message);
		} finally {
			setPropulsionSummaryLoading(false);
		}
	}; 
  
   fetchData();
  }, []); 


  return (
    <PropulsionSummaryContext.Provider value={{ propulsionSummaryData, propulsionSummaryLoading, selectedPropulsionSummary, setSelectedPropulsionSummary }}> 
      {children}
    </PropulsionSummaryContext.Provider>
  );
};

export { PropulsionSummaryContext, PropulsionSummaryProvider };
