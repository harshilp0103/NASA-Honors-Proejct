import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { ColdGasContext } from '../../../context/4/4-5';
import { fetchTableData } from "../../../resources/fetchData";


// Cold Gas Propulsion Providers table component
const ColdGasProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Cold Gas Propulsion Providers context
  const { coldGasData } = useContext(ColdGasContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [coldGasLoading, setColdGasLoading] = useState(true);

  // State variables for the Cold Gas Propulsion filtered data using the column filters
  const [coldGasFilteredData, setColdGasFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedColdGas, setSelectedColdGas] = useState([]); 

  // Variables to create the column filtering states
  const [coldGasColumnFilters, setColdGasColumnFilters] = useState({
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
   const sortedData = await fetchTableData("Table 4-5 Cold Gas Propulsion");

      setColdGasFilteredData(sortedData || []);
		} catch (error) {
			throw new Error("Error fetching data: ", error.message);
		} finally {
			setColdGasLoading(false);
	       	}
			};   
   fetchData();
  }, []); 
  
  // Effect hook for filtering the Cold Gas Propulsion table data values
  useEffect(() => {
    const filtered = coldGasData.filter(row => {
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
      const thrustRangeFilter = parseFloat(coldGasColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(coldGasColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(coldGasColumnFilters.mass);
    
      return (
        (coldGasColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(coldGasColumnFilters.manufacturer.toLowerCase())) &&
        (coldGasColumnFilters.product === '' || productLowerCase.includes(coldGasColumnFilters.product.toLowerCase())) &&
        (coldGasColumnFilters.propellant === '' || propellantLowerCase.includes(coldGasColumnFilters.propellant.toLowerCase())) &&
        (coldGasColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(coldGasColumnFilters.specific_impulse.toLowerCase())) &&
        (coldGasColumnFilters.envelope === '' || envelopeLowerCase.includes(coldGasColumnFilters.envelope.toLowerCase())) &&
        (coldGasColumnFilters.power === '' || powerLowerCase.includes(coldGasColumnFilters.power.toLowerCase())) &&
        (coldGasColumnFilters.acs === '' || acsLowerCase.includes(coldGasColumnFilters.acs.toLowerCase())) &&
        (coldGasColumnFilters.pmi === '' || pmiLowerCase.includes(coldGasColumnFilters.pmi.toLowerCase())) &&
        (coldGasColumnFilters.missions === '' || missionsLowerCase.includes(coldGasColumnFilters.missions.toLowerCase())) &&
        (coldGasColumnFilters.references === '' || referencesLowerCase.includes(coldGasColumnFilters.references.toLowerCase())) &&
        (coldGasColumnFilters.country === '' || countryLowerCase.includes(coldGasColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setColdGasFilteredData(filtered);
  }, [coldGasData, coldGasColumnFilters]);
  
  // Effect hook for updating the selected Cold Gas Propulsion providers
  useEffect(() => {
    const existingColdGas = location.state && location.state.coldGas ? location.state.coldGas : [];
    const ColdGasFromStorage = JSON.parse(localStorage.getItem("selectedColdGas")) || [];
    const combinedColdGas = [...existingColdGas, ...ColdGasFromStorage];
    setSelectedColdGas(combinedColdGas);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setColdGasColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Cold Gas Propulsion is already selected
    const isSelected = selectedColdGas.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Cold Gas Propulsion is already selected, remove it from the selectedColdGas array
      setSelectedColdGas((prevColdGas) =>
        prevColdGas.filter((p) => p.id !== row.id)
      );
    } else {
// If the Cold Gas Propulsion is not selected, add it to the selectedColdGas array
      setSelectedColdGas((prevColdGas) => [...prevColdGas, row]);
    }
  };

  // Function to handle the table selections
  const handleColdGasSelection = () => {
    const storedColdGas = JSON.parse(localStorage.getItem("selectedColdGas")) || [];
    
    // Check if there are any differences between the current selected Cold Gas Propulsion and stored Cold Gas Propulsion
    const coldGasChanged = JSON.stringify(selectedColdGas) !== JSON.stringify(storedColdGas);
  
    if (coldGasChanged) {
      localStorage.setItem("selectedColdGas", JSON.stringify(selectedColdGas));
      tableNotification();
    }
  };
 
  // Function to display the Cold Gas Propulsion row data using the number of visibleItems
  const renderColdGasTableRows = () => {
    const visibleData = coldGasFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedColdGas.some((p) => p.id === row.id)}
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
  const handleColdGasScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, coldGasFilteredData.length));
    }
  }, [coldGasFilteredData.length]);
  
  return (
    <div className={styles.coldgastableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={coldGasColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={coldGasColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={coldGasColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={coldGasColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={coldGasColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={coldGasColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={coldGasColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={coldGasColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={coldGasColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={coldGasColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={coldGasColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={coldGasColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={coldGasColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {coldGasLoading ? (
        <p>Loading...</p>
      ) : (
        coldGasFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleColdGasScroll}>
          <button className={styles.addSelectedButton} onClick={handleColdGasSelection}>Add Selected to Bucket</button>
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
              {renderColdGasTableRows()}
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

  export default ColdGasProviderTable;
