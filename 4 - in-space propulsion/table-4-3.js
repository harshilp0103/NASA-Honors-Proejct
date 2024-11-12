import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { PropellantContext } from '../../../context/4/4-3';
import { render } from '@testing-library/react';

import { fetchTableData } from "../../../resources/fetchData";

// Subabase database client
/*const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
); */

// Propellant Propulsion Providers table component
const PropellantProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Propellant Propulsion Providers context
  const { propellantData } = useContext(PropellantContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [propellantLoading, setPropellantLoading] = useState(true);

  // State variables for the propellant propulsion filtered data using the column filters
  const [propellantFilteredData, setPropellantFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedPropellant, setSelectedPropellant] = useState([]); 

  // Variables to create the column filtering states
  const [propellantColumnFilters, setPropellantColumnFilters] = useState({
    manufacturer: '',
    product: '',
    propellant: '',
    thrust: '',
    specific_impulse: '',
    total_impulse: '',
    mass: '',
    envelope: '',
    power: '',
    acs: '',
    pmi: '',
    missions: '',
    references: '',
    country: '',
  });
  
  // Effect hook for fetching the Hosted Payload table data from Supabase
  useEffect(() => {
		const fetchData = async () => {
		try {
   const sortedData = await fetchTableData("Table 4-3 Alternative Monopropellant and Bipropellant Propulsio");

      setPropellantFilteredData(sortedData || []);
		} catch (error) {
			throw new Error("Error fetching data: ", error.message);
		} finally {
			setPropellantLoading(false);
	       	}
			};   
   fetchData();
  }, []); 
  
  // Effect hook for filtering the Propellant Propulsion Providers table data values
  useEffect(() => {
    const filtered = propellantData.filter(row => {
      const manufacturerLowerCase = String(row.manufacturer || '').toLowerCase();
      const productLowerCase = String(row.product || '').toLowerCase();
      const propellantLowerCase = String(row.propellant || '').toLowerCase();
      const specificImpulseLowerCase = String(row.specific_impulse || '').toLowerCase();
      const envelopeLowerCase = String(row.envelope || '').toLowerCase();
      const powerLowerCase = String(row.power || '').toLowerCase();
      const acsLowerCase = String(row.acs || '').toLowerCase();
      const pmiLowerCase = String(row.pmi || '').toLowerCase();
      const missionsLowerCase = String(row.missions || '').toLowerCase();
      const referencesLowerCase = String(row.references || '').toLowerCase();
      const countryLowerCase = String(row.country || '').toLowerCase();
      const thrustRangeFilter = parseFloat(propellantColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(propellantColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(propellantColumnFilters.mass);
    
      return (
        (propellantColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(propellantColumnFilters.manufacturer.toLowerCase())) &&
        (propellantColumnFilters.product === '' || productLowerCase.includes(propellantColumnFilters.product.toLowerCase())) &&
        (propellantColumnFilters.propellant === '' || propellantLowerCase.includes(propellantColumnFilters.propellant.toLowerCase())) &&
        (propellantColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(propellantColumnFilters.specific_impulse.toLowerCase())) &&
        (propellantColumnFilters.envelope === '' || envelopeLowerCase.includes(propellantColumnFilters.envelope.toLowerCase())) &&
        (propellantColumnFilters.power === '' || powerLowerCase.includes(propellantColumnFilters.power.toLowerCase())) &&
        (propellantColumnFilters.acs === '' || acsLowerCase.includes(propellantColumnFilters.acs.toLowerCase())) &&
        (propellantColumnFilters.pmi === '' || pmiLowerCase.includes(propellantColumnFilters.pmi.toLowerCase())) &&
        (propellantColumnFilters.missions === '' || missionsLowerCase.includes(propellantColumnFilters.missions.toLowerCase())) &&
        (propellantColumnFilters.references === '' || referencesLowerCase.includes(propellantColumnFilters.references.toLowerCase())) &&
        (propellantColumnFilters.country === '' || countryLowerCase.includes(propellantColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setPropellantFilteredData(filtered);
  }, [propellantData, propellantColumnFilters]);
  
  // Effect hook for updating the selected propellant propulsion providers
  useEffect(() => {
    const existingPropellant = location.state && location.state.propellant ? location.state.propellant : [];
    const propellantFromStorage = JSON.parse(localStorage.getItem("selectedPropellant")) || [];
    const combinedPropellant = [...existingPropellant, ...propellantFromStorage];
    setSelectedPropellant(combinedPropellant);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setPropellantColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the propellant propulsion is already selected
    const isSelected = selectedPropellant.some((p) => p.id === row.id);
    if (isSelected) {
      // If the propellant propulsion is already selected, remove it from the selectedPropellant array
      setSelectedPropellant((prevPropellant) =>
        prevPropellant.filter((p) => p.id !== row.id)
      );
    } else {
      // If the propellant propulsion is not selected, add it to the selectedPropellant array
      setSelectedPropellant((prevPropellant) => [...prevPropellant, row]);
    }
  };

  // Function to handle the table selections
  const handlePropellantSelection = () => {
    const storedAlternative = JSON.parse(localStorage.getItem("selectedPropellant")) || [];
    
    // Check if there are any differences between the current selected propellant propulsion and stored propellant propulsion
    const propellantChanged = JSON.stringify(selectedPropellant) !== JSON.stringify(storedPropellant);
  
    if (propellantChanged) {
      localStorage.setItem("selectedPropellant", JSON.stringify(selectedPropellant));
      tableNotification();
    }
  };
 
  // Function to display the propellant Propulsion row data using the number of visibleItems
  const renderPropellantTableRows = () => {
    const visibleData = propellantFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedPropellant.some((p) => p.id === row.id)}
          />
        </td>
        <td>{row.manufacturer}</td>
        <td>{row.product}</td>
        <td>{row.propellant}</td>
        <td>{row.thrust}</td>
        <td>{row.specific_impulse}</td>
        <td>{row.total_impulse}</td>
        <td>{row.mass}</td>
        <td>{row.envelope}</td>
        <td>{row.power}</td>
        <td>{row.acs}</td>
        <td>{row.pmi}</td>
        <td>{row.missions}</td>
        <td>{row.references}</td>
        <td>{row.country}</td>
      </tr>
    ));
  };

  // Function to scroll the table data helping to decrease page space and increase usability
  const handlePropellantScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, propellantFilteredData.length));
    }
  }, [propellantFilteredData.length]);
  
  return (
    <div className={styles.propellanttableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={propellantColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={propellantColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={propellantColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={propellantColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={propellantColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={propellantColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={propellantColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={propellantColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={propellantColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={propellantColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={propellantColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={propellantColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={propellantColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {propellantLoading ? (
        <p>Loading...</p>
      ) : (
        propellantFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handlePropellantScroll}>
          <button className={styles.addSelectedButton} onClick={handlePropellantSelection}>Add Selected to Bucket</button>
          <button className={styles.navigateToBucketButton} onClick={handleNavigateToBucket}>Navigate to Bucket</button>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Manufacturer</th>
                <th>Product</th>
                <th>Propellant</th>
                <th>Thrust per Thruster (Quantity)</th>
                <th>Specific Impulse</th>
                <th>Total Impulse</th>
                <th>Mass</th>
                <th>Envelope</th>
                <th>Power</th>
                <th>ACS</th>
                <th>PMI Status</th>
                <th>Missions</th>
                <th>References</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {renderPropellantTableRows()}
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

  export default PropellantProviderTable;
