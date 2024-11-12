import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { AmbipolarContext } from '../../../context/4/4-12';
import { fetchTableData } from "../../../resources/fetchData";

// Ambipolar Providers table component
const AmbipolarProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Ambipolar Providers context
  const { ambipolarData } = useContext(AmbipolarContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [ambipolarLoading, setAmbipolarLoading] = useState(true);

  // State variables for the Ambipolar filtered data using the column filters
  const [ambipolarFilteredData, setAmbipolarFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedAmbipolar, setSelectedAmbipolar] = useState([]); 

  // Variables to create the column filtering states
  const [ambipolarColumnFilters, setAmbipolarColumnFilters] = useState({
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
    
  	// Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-12 Ambipolar Electric Propulsion");

				setAmbipolarFilteredData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setAmbipolarLoading(false);
			}
		};

		fetchData();
	}, []);

  
  // Effect hook for filtering the Ambipolar table data values
  useEffect(() => {
    const filtered = ambipolarData.filter(row => {
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
      const thrustRangeFilter = parseFloat(ambipolarColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(ambipolarColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(ambipolarColumnFilters.mass);
    
      return (
        (ambipolarColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(ambipolarColumnFilters.manufacturer.toLowerCase())) &&
        (ambipolarColumnFilters.product === '' || productLowerCase.includes(ambipolarColumnFilters.product.toLowerCase())) &&
        (ambipolarColumnFilters.propellant === '' || propellantLowerCase.includes(ambipolarColumnFilters.propellant.toLowerCase())) &&
        (ambipolarColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(ambipolarColumnFilters.specific_impulse.toLowerCase())) &&
        (ambipolarColumnFilters.envelope === '' || envelopeLowerCase.includes(ambipolarColumnFilters.envelope.toLowerCase())) &&
        (ambipolarColumnFilters.power === '' || powerLowerCase.includes(ambipolarColumnFilters.power.toLowerCase())) &&
        (ambipolarColumnFilters.acs === '' || acsLowerCase.includes(ambipolarColumnFilters.acs.toLowerCase())) &&
        (ambipolarColumnFilters.pmi === '' || pmiLowerCase.includes(ambipolarColumnFilters.pmi.toLowerCase())) &&
        (ambipolarColumnFilters.missions === '' || missionsLowerCase.includes(ambipolarColumnFilters.missions.toLowerCase())) &&
        (ambipolarColumnFilters.references === '' || referencesLowerCase.includes(ambipolarColumnFilters.references.toLowerCase())) &&
        (ambipolarColumnFilters.country === '' || countryLowerCase.includes(ambipolarColumnFilters.country.toLowerCase())) && 
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setAmbipolarFilteredData(filtered);
  }, [ambipolarData, ambipolarColumnFilters]);
  
  // Effect hook for updating the selected Ambipolar providers
  useEffect(() => {
    const existingAmbipolar = location.state && location.state.ambipolar ? location.state.ambipolar : [];
    const AmbipolarFromStorage = JSON.parse(localStorage.getItem("selectedAmbipolar")) || [];
    const combinedAmbipolar = [...existingAmbipolar, ...AmbipolarFromStorage];
    setSelectedAmbipolar(combinedAmbipolar);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setAmbipolarColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Ambipolar is already selected
    const isSelected = selectedAmbipolar.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Ambipolar is already selected, remove it from the selectedAmbipolar array
      setSelectedAmbipolar((prevAmbipolar) =>
        prevAmbipolar.filter((p) => p.id !== row.id)
      );
    } else {
// If the Ambipolar is not selected, add it to the selectedAmbipolar array
      setSelectedAmbipolar((prevAmbipolar) => [...prevAmbipolar, row]);
    }
  };

  // Function to handle the table selections
  const handleAmbipolarSelection = () => {
    const storedAmbipolar = JSON.parse(localStorage.getItem("selectedAmbipolar")) || [];
    
    // Check if there are any differences between the current selected Ambipolar and stored Ambipolar
    const ambipolarChanged = JSON.stringify(selectedAmbipolar) !== JSON.stringify(storedAmbipolar);
  
    if (ambipolarChanged) {
      localStorage.setItem("selectedAmbipolar", JSON.stringify(selectedAmbipolar));
      tableNotification();
    }
  };
 
  // Function to display the Ambipolar row data using the number of visibleItems
  const renderAmbipolarTableRows = () => {
    const visibleData = ambipolarFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedAmbipolar.some((p) => p.id === row.id)}
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
  const handleAmbipolarScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, ambipolarFilteredData.length));
    }
  }, [ambipolarFilteredData.length]);
  
  return (
    <div className={styles.ambipolartableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={ambipolarColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={ambipolarColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={ambipolarColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust*"
            value={ambipolarColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={ambipolarColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={ambipolarColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={ambipolarColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={ambipolarColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={ambipolarColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={ambipolarColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={ambipolarColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={ambipolarColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={ambipolarColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {ambipolarLoading ? (
        <p>Loading...</p>
      ) : (
        ambipolarFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleAmbipolarScroll}>
          <button className={styles.addSelectedButton} onClick={handleAmbipolarSelection}>Add Selected to Bucket</button>
          <button className={styles.navigateToBucketButton} onClick={handleNavigateToBucket}>Navigate to Bucket</button>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Manufacturer</th>
                <th>Product</th>
                <th>Propellant</th>
                <th>Thrust*</th>
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
              {renderAmbipolarTableRows()}
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

  export default AmbipolarProviderTable;
