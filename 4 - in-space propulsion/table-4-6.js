import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { SolidMotorContext } from '../../../context/4/4-6';

import { fetchTableData } from "../../../resources/fetchData";


// Solid Motor Providers table component
const SolidMotorProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Solid Motor Providers context
  const { solidMotorData } = useContext(SolidMotorContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [solidMotorLoading, setSolidMotorLoading] = useState(true);

  // State variables for the Solid Motor filtered data using the column filters
  const [solidMotorFilteredData, setSolidMotorFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedSolidMotor, setSelectedSolidMotor] = useState([]); 

  // Variables to create the column filtering states
  const [solidMotorColumnFilters, setSolidMotorColumnFilters] = useState({
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
				const sortedData = await fetchTableData("Table 4-6 Solid Motor Chemical Propulsion");

				setSolidMotorFilteredData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setSolidMotorLoading(false);
			}
		};

		fetchData();
	}, []);
  
  // Effect hook for filtering the Solid Motor table data values
  useEffect(() => {
    const filtered = solidMotorData.filter(row => {
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
      const thrustRangeFilter = parseFloat(solidMotorColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(solidMotorColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(solidMotorColumnFilters.mass);
    
      return (
        (solidMotorColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(solidMotorColumnFilters.manufacturer.toLowerCase())) &&
        (solidMotorColumnFilters.product === '' || productLowerCase.includes(solidMotorColumnFilters.product.toLowerCase())) &&
        (solidMotorColumnFilters.propellant === '' || propellantLowerCase.includes(solidMotorColumnFilters.propellant.toLowerCase())) &&
        (solidMotorColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(solidMotorColumnFilters.specific_impulse.toLowerCase())) &&
        (solidMotorColumnFilters.envelope === '' || envelopeLowerCase.includes(solidMotorColumnFilters.envelope.toLowerCase())) &&
        (solidMotorColumnFilters.power === '' || powerLowerCase.includes(solidMotorColumnFilters.power.toLowerCase())) &&
        (solidMotorColumnFilters.acs === '' || acsLowerCase.includes(solidMotorColumnFilters.acs.toLowerCase())) &&
        (solidMotorColumnFilters.pmi === '' || pmiLowerCase.includes(solidMotorColumnFilters.pmi.toLowerCase())) &&
        (solidMotorColumnFilters.missions === '' || missionsLowerCase.includes(solidMotorColumnFilters.missions.toLowerCase())) &&
        (solidMotorColumnFilters.references === '' || referencesLowerCase.includes(solidMotorColumnFilters.references.toLowerCase())) &&
        (solidMotorColumnFilters.country === '' || countryLowerCase.includes(solidMotorColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setSolidMotorFilteredData(filtered);
  }, [solidMotorData, solidMotorColumnFilters]);
  
  // Effect hook for updating the selected Solid Motor providers
  useEffect(() => {
    const existingSolidMotor = location.state && location.state.solidMotor ? location.state.solidMotor : [];
    const SolidMotorFromStorage = JSON.parse(localStorage.getItem("selectedSolidMotor")) || [];
    const combinedSolidMotor = [...existingSolidMotor, ...SolidMotorFromStorage];
    setSelectedSolidMotor(combinedSolidMotor);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setSolidMotorColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Solid Motor is already selected
    const isSelected = selectedSolidMotor.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Solid Motor is already selected, remove it from the selectedSolidMotor array
      setSelectedSolidMotor((prevSolidMotor) =>
        prevSolidMotor.filter((p) => p.id !== row.id)
      );
    } else {
// If the Solid Motor is not selected, add it to the selectedSolidMotor array
      setSelectedSolidMotor((prevSolidMotor) => [...prevSolidMotor, row]);
    }
  };

  // Function to handle the table selections
  const handleSolidMotorSelection = () => {
    const storedSolidMotor = JSON.parse(localStorage.getItem("selectedSolidMotor")) || [];
    
    // Check if there are any differences between the current selected Solid Motor and stored Solid Motor
    const solidMotorChanged = JSON.stringify(selectedSolidMotor) !== JSON.stringify(storedSolidMotor);
  
    if (solidMotorChanged) {
      localStorage.setItem("selectedSolidMotor", JSON.stringify(selectedSolidMotor));
      tableNotification();
    }
  };
 
  // Function to display the Solid Motor row data using the number of visibleItems
  const renderSolidMotorTableRows = () => {
    const visibleData = solidMotorFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedSolidMotor.some((p) => p.id === row.id)}
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
  const handleSolidMotorScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, solidMotorFilteredData.length));
    }
  }, [solidMotorFilteredData.length]);
  
  return (
    <div className={styles.solidmotortableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={solidMotorColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={solidMotorColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={solidMotorColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={solidMotorColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={solidMotorColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={solidMotorColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={solidMotorColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={solidMotorColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={solidMotorColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={solidMotorColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={solidMotorColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={solidMotorColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={solidMotorColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {solidMotorLoading ? (
        <p>Loading...</p>
      ) : (
        solidMotorFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleSolidMotorScroll}>
          <button className={styles.addSelectedButton} onClick={handleSolidMotorSelection}>Add Selected to Bucket</button>
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
              {renderSolidMotorTableRows()}
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

  export default SolidMotorProviderTable;
