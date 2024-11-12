import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { PropulsionSummaryContext } from '../../../context/4/4-1';  
import tableNotification from '../../tableNotification';

import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";

import { fetchTableData } from "../../../resources/fetchData";


// Propulsion Summary Providers table component
const PropulsionSummaryProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Propulsion Summary Providers context
  const { propulsionSummaryData } = useContext(PropulsionSummaryContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [propulsionSummaryLoading, setPropulsionSummaryLoading] = useState(true);

  // State variables for the subsystem filtered data using the column filters
  const [propulsionSummaryFilteredData, setPropulsionSummaryFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedPropulsionSummary, setSelectedPropulsionSummary] = useState([]); 

  // Variables to create the column filtering states
  const [propulsionSummaryColumnFilters, setPropulsionSummaryColumnFilters] = useState({
    technology: '',
    thrust_range: '',
    impulse_range: '',
  });
    
 	// Effect hook for fetching the Hosted Payload table data
   useEffect(() => {
	  const fetchData = async () => {
		try {
			const sortedData = await fetchTableData("Table 4-1 Summary of Propulsion Technologies Surveyed");

			setPropulsionSummaryFilteredData(sortedData || []);
		} catch (error) {
			throw new Error("Error fetching data: ", error.message);
		} finally {
			setPropulsionSummaryLoading(false);
		}
	}; 
  
   fetchData();
  }, []); 

  
  // Effect hook for filtering the Propulsion Summary Providers table data values
  useEffect(() => {
    const filtered = propulsionSummaryData.filter(row => {
      const technologyLowerCase = String(row.technology || '').toLowerCase();
      const impulseRangeLowerCase = String(row.impulse_range || '').toLowerCase();
      const thrustRangeFilter = parseFloat(propulsionSummaryColumnFilters.thrust_range);
    
      return (
        (propulsionSummaryColumnFilters.technology === '' || technologyLowerCase.includes(propulsionSummaryColumnFilters.technology.toLowerCase())) &&
        (propulsionSummaryColumnFilters.impulse_range === '' || impulseRangeLowerCase.includes(propulsionSummaryColumnFilters.impulse_range.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust_range) <= thrustRangeFilter)
      );
    });
  
    setPropulsionSummaryFilteredData(filtered);
  }, [propulsionSummaryData, propulsionSummaryColumnFilters]);
  
  // Effect hook for updating the selected Propulsion Summary providers
  useEffect(() => {
    const existingPropulsionSummary = location.state && location.state.propulsionSummary ? location.state.propulsionSummary : [];
    const propulsionSummaryFromStorage = JSON.parse(localStorage.getItem("selectedPropulsionSummary")) || [];
    const combinedPropulsionSummary = [...existingPropulsionSummary, ...propulsionSummaryFromStorage];
    setSelectedPropulsionSummary(combinedPropulsionSummary);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setPropulsionSummaryColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the propulsion summary is already selected
    const isSelected = selectedPropulsionSummary.some((p) => p.id === row.id);
    if (isSelected) {
      // If the propulsion summary is already selected, remove it from the selectedSubsystems array
      setSelectedPropulsionSummary((prevPropulsionSummary) =>
        prevPropulsionSummary.filter((p) => p.id !== row.id)
      );
    } else {
      // If the subsystem is not selected, add it to the selectedSubsystems array
      setSelectedPropulsionSummary((prevPropulsionSummary) => [...prevPropulsionSummary, row]);
    }
  };

  // Function to handle the table selections
  const handlePropulsionSummarySelection = () => {
    const storedPropulsionSummary = JSON.parse(localStorage.getItem("selectedPropulsionSummary")) || [];
    
    // Check if there are any differences between the current selected propulsion summary and stored propulsion summary
    const propulsionSummaryChanged = JSON.stringify(selectedPropulsionSummary) !== JSON.stringify(storedPropulsionSummary);
  
    if (propulsionSummaryChanged) {
      localStorage.setItem("selectedPropulsionSummary", JSON.stringify(selectedPropulsionSummary));
      tableNotification();
    }
  };
 
  // Function to display the Propulsion Summary row data using the number of visibleItems
  const renderPropulsionSummaryTableRows = () => {
    const visibleData = propulsionSummaryFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedPropulsionSummary.some((p) => p.id === row.id)}
          />
        </td>
        <td>{row.technology}</td>
        <td>{row.thrust_range}</td>
        <td>{row.impulse_range}</td>
      </tr>
    ));
  };

  // Function to scroll the table data helping to decrease page space and increase usability
  const handlePropulsionSummaryScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, propulsionSummaryFilteredData.length));
    }
  }, [propulsionSummaryFilteredData.length]);
  
  return (
    <div className={styles.propulsionsummarytableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Technology"
            value={propulsionSummaryColumnFilters.technology}
            onChange={(e) => handleFilterChange('technology', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust Range"
            value={propulsionSummaryColumnFilters.thrust_range}
            onChange={(e) => handleFilterChange('thrust range', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse Range"
            value={propulsionSummaryColumnFilters.impulse_range}
            onChange={(e) => handleFilterChange('specific impulse range', e.target.value)}
          />
        </div>
      </div>
      {propulsionSummaryLoading ? (
        <p>Loading...</p>
      ) : (
        propulsionSummaryFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handlePropulsionSummaryScroll}>
          <button className={styles.addSelectedButton} onClick={handlePropulsionSummarySelection}>Add Selected to Bucket</button>
          <button className={styles.navigateToBucketButton} onClick={handleNavigateToBucket}>Navigate to Bucket</button>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Technology</th>
                <th>Thrust Range</th>
                <th>Specific Impulse Range [sec]</th>
              </tr>
            </thead>
            <tbody>
              {renderPropulsionSummaryTableRows()}
            </tbody>
          </table>
        </div>
        ) : (
          <p>No data available</p>
        )
      )}
    </div>
    );
  };

  export default PropulsionSummaryProviderTable;