import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { HybridContext } from '../../../context/4/4-4';
import { fetchTableData } from "../../../resources/fetchData";

// Hybrid Providers table component
const HybridProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Hybrid Propulsion Providers context
  const { hybridData } = useContext(HybridContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [hybridLoading, setHybridLoading] = useState(true);

  // State variables for the hybrid propulsion filtered data using the column filters
  const [hybridFilteredData, setHybridFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedHybrid, setSelectedHybrid] = useState([]); 

  // Variables to create the column filtering states
  const [hybridColumnFilters, setHybridColumnFilters] = useState({
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
   const sortedData = await fetchTableData("Table 4-4 Hybrid Chemical Propulsion");

      setHybridFilteredData(sortedData || []);
		} catch (error) {
			throw new Error("Error fetching data: ", error.message);
		} finally {
			setHybridLoading(false);
	       	}
			};   
   fetchData();
  }, []);

  
  // Effect hook for filtering the Hybrid Chemical Propulsion table data values
  useEffect(() => {
    const filtered = hybridData.filter(row => {
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
      const thrustRangeFilter = parseFloat(hybridColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(hybridColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(hybridColumnFilters.mass);
    
      return (
        (hybridColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(hybridColumnFilters.manufacturer.toLowerCase())) &&
        (hybridColumnFilters.product === '' || productLowerCase.includes(hybridColumnFilters.product.toLowerCase())) &&
        (hybridColumnFilters.propellant === '' || propellantLowerCase.includes(hybridColumnFilters.propellant.toLowerCase())) &&
        (hybridColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(hybridColumnFilters.specific_impulse.toLowerCase())) &&
        (hybridColumnFilters.envelope === '' || envelopeLowerCase.includes(hybridColumnFilters.envelope.toLowerCase())) &&
        (hybridColumnFilters.power === '' || powerLowerCase.includes(hybridColumnFilters.power.toLowerCase())) &&
        (hybridColumnFilters.acs === '' || acsLowerCase.includes(hybridColumnFilters.acs.toLowerCase())) &&
        (hybridColumnFilters.pmi === '' || pmiLowerCase.includes(hybridColumnFilters.pmi.toLowerCase())) &&
        (hybridColumnFilters.missions === '' || missionsLowerCase.includes(hybridColumnFilters.missions.toLowerCase())) &&
        (hybridColumnFilters.references === '' || referencesLowerCase.includes(hybridColumnFilters.references.toLowerCase())) &&
        (hybridColumnFilters.country === '' || countryLowerCase.includes(hybridColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setHybridFilteredData(filtered);
  }, [hybridData, hybridColumnFilters]);
  
  // Effect hook for updating the selected Hybrid Propulsion providers
  useEffect(() => {
    const existingHybrid = location.state && location.state.hybrid ? location.state.hybrid : [];
    const HybridFromStorage = JSON.parse(localStorage.getItem("selectedHybrid")) || [];
    const combinedHybrid = [...existingHybrid, ...HybridFromStorage];
    setSelectedHybrid(combinedHybrid);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setHybridColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the hybrid propulsion is already selected
    const isSelected = selectedHybrid.some((p) => p.id === row.id);
    if (isSelected) {
      // If the hybrid propulsion is already selected, remove it from the selectedHybrid array
      setSelectedHybrid((prevHybrid) =>
        prevHybrid.filter((p) => p.id !== row.id)
      );
    } else {
      // If the hybrid propulsion is not selected, add it to the selectedHybrid array
      setSelectedHybrid((prevHybrid) => [...prevHybrid, row]);
    }
  };

  // Function to handle the table selections
  const handleHybridSelection = () => {
    const storedHybrid = JSON.parse(localStorage.getItem("selectedHybrid")) || [];
    
    // Check if there are any differences between the current selected hybrid and stored hybrid
    const hybridChanged = JSON.stringify(selectedHybrid) !== JSON.stringify(storedHybrid);
  
    if (hybridChanged) {
      localStorage.setItem("selectedHybrid", JSON.stringify(selectedHybrid));
      tableNotification();
    }
  };
 
  // Function to display the Hybrid row data using the number of visibleItems
  const renderHybridTableRows = () => {
    const visibleData = hybridFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedHybrid.some((p) => p.id === row.id)}
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
  const handleHybridScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, hybridFilteredData.length));
    }
  }, [hybridFilteredData.length]);
  
  return (
    <div className={styles.hybridtableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={hybridColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={hybridColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={hybridColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={hybridColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={hybridColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={hybridColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={hybridColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={hybridColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={hybridColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={hybridColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={hybridColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={hybridColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={hybridColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {hybridLoading ? (
        <p>Loading...</p>
      ) : (
        hybridFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleHybridScroll}>
          <button className={styles.addSelectedButton} onClick={handleHybridSelection}>Add Selected to Bucket</button>
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
              {renderHybridTableRows()}
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

  export default HybridProviderTable;
