import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { HydrazineContext } from '../../../context/4/4-2';
import { fetchTableData } from "../../../resources/fetchData";

// Hydrazine Providers table component
const HydrazineProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Hydrazine Providers context
  const { hydrazineData } = useContext(HydrazineContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [hydrazineLoading, setHydrazineLoading] = useState(true);

  // State variables for the hydrazine filtered data using the column filters
  const [hydrazineFilteredData, setHydrazineFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedHydrazine, setSelectedHydrazine] = useState([]); 

  // Variables to create the column filtering states
  const [hydrazineColumnFilters, setHydrazineColumnFilters] = useState({
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
   const sortedData = await fetchTableData("Table 4-2 Hydrazine Chemical Propulsion");

      setHydrazineFilteredData(sortedData || []);
		} catch (error) {
			throw new Error("Error fetching data: ", error.message);
		} finally {
			setHydrazineLoading(false);
	       	}
			};   
   fetchData();
  }, []); 

  
  // Effect hook for filtering the Hydrazine Providers table data values
  useEffect(() => {
    const filtered = hydrazineData.filter(row => {
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
      const thrustRangeFilter = parseFloat(hydrazineColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(hydrazineColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(hydrazineColumnFilters.mass);
    
      return (
        (hydrazineColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(hydrazineColumnFilters.manufacturer.toLowerCase())) &&
        (hydrazineColumnFilters.product === '' || productLowerCase.includes(hydrazineColumnFilters.product.toLowerCase())) &&
        (hydrazineColumnFilters.propellant === '' || propellantLowerCase.includes(hydrazineColumnFilters.propellant.toLowerCase())) &&
        (hydrazineColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(hydrazineColumnFilters.specific_impulse.toLowerCase())) &&
        (hydrazineColumnFilters.envelope === '' || envelopeLowerCase.includes(hydrazineColumnFilters.envelope.toLowerCase())) &&
        (hydrazineColumnFilters.power === '' || powerLowerCase.includes(hydrazineColumnFilters.power.toLowerCase())) &&
        (hydrazineColumnFilters.acs === '' || acsLowerCase.includes(hydrazineColumnFilters.acs.toLowerCase())) &&
        (hydrazineColumnFilters.pmi === '' || pmiLowerCase.includes(hydrazineColumnFilters.pmi.toLowerCase())) &&
        (hydrazineColumnFilters.missions === '' || missionsLowerCase.includes(hydrazineColumnFilters.missions.toLowerCase())) &&
        (hydrazineColumnFilters.references === '' || referencesLowerCase.includes(hydrazineColumnFilters.references.toLowerCase())) &&
        (hydrazineColumnFilters.country === '' || countryLowerCase.includes(hydrazineColumnFilters.country.toLowerCase())) && 
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) && 
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setHydrazineFilteredData(filtered);
  }, [hydrazineData, hydrazineColumnFilters]);
  
  // Effect hook for updating the selected Hydrazine providers
  useEffect(() => {
    const existingHydrazine = location.state && location.state.hydrazine ? location.state.hydrazine : [];
    const HydrazineFromStorage = JSON.parse(localStorage.getItem("selectedHydrazine")) || [];
    const combinedHydrazine = [...existingHydrazine, ...HydrazineFromStorage];
    setSelectedHydrazine(combinedHydrazine);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setHydrazineColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the hydrazine is already selected
    const isSelected = selectedHydrazine.some((p) => p.id === row.id);
    if (isSelected) {
      // If the hydrazine is already selected, remove it from the selectedHydrazine array
      setSelectedHydrazine((prevHydrazine) =>
        prevHydrazine.filter((p) => p.id !== row.id)
      );
    } else {
      // If the hydrazine is not selected, add it to the selectedHydrazine array
      setSelectedHydrazine((prevHydrazine) => [...prevHydrazine, row]);
    }
  };

  // Function to handle the table selections
  const handleHydrazineSelection = () => {
    const storedHydrazine = JSON.parse(localStorage.getItem("selectedHydrazine")) || [];
    
    // Check if there are any differences between the current selected hydrazine and stored hydrazine
    const hydrazineChanged = JSON.stringify(selectedHydrazine) !== JSON.stringify(storedHydrazine);
  
    if (hydrazineChanged) {
      localStorage.setItem("selectedHydrazine", JSON.stringify(selectedHydrazine));
      tableNotification();
    }
  };
 
  // Function to display the Hydrazine row data using the number of visibleItems
  const renderHydrazineTableRows = () => {
    const visibleData = hydrazineFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedHydrazine.some((p) => p.id === row.id)}
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
  const handleHydrazineScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, hydrazineFilteredData.length));
    }
  }, [hydrazineFilteredData.length]);
  
  return (
    <div className={styles.hydrazinetableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={hydrazineColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={hydrazineColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={hydrazineColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={hydrazineColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={hydrazineColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={hydrazineColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={hydrazineColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={hydrazineColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={hydrazineColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={hydrazineColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={hydrazineColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={hydrazineColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={hydrazineColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {hydrazineLoading ? (
        <p>Loading...</p>
      ) : (
        hydrazineFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleHydrazineScroll}>
          <button className={styles.addSelectedButton} onClick={handleHydrazineSelection}>Add Selected to Bucket</button>
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
              {renderHydrazineTableRows()}
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

  export default HydrazineProviderTable;
