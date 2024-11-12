import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { PropellantLessContext } from '../../../context/4/4-13';
import { fetchTableData } from "../../../resources/fetchData";

// PropellantLess Providers table component
const PropellantLessProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // PropellantLess Providers context
  const { propellantLessData } = useContext(PropellantLessContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [propellantLessLoading, setPropellantLessLoading] = useState(true);

  // State variables for the PropellantLess filtered data using the column filters
  const [propellantLessFilteredData, setPropellantLessFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedPropellantLess, setSelectedPropellantLess] = useState([]); 

  // Variables to create the column filtering states
  const [propellantLessColumnFilters, setPropellantLessColumnFilters] = useState({
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
				const sortedData = await fetchTableData("Table 4-13 Propellant-less Propulsion");

				setPropellantLessFilteredData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setPropellantLessLoading(false);
			}
		};

		fetchData();
	}, []);
  
  // Effect hook for filtering the PropellantLess table data values
  useEffect(() => {
    const filtered = propellantLessData.filter(row => {
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
      const thrustRangeFilter = parseFloat(propellantLessColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(propellantLessColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(propellantLessColumnFilters.mass);
    
      return (
        (propellantLessColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(propellantLessColumnFilters.manufacturer.toLowerCase())) &&
        (propellantLessColumnFilters.product === '' || productLowerCase.includes(propellantLessColumnFilters.product.toLowerCase())) &&
        (propellantLessColumnFilters.propellant === '' || propellantLowerCase.includes(propellantLessColumnFilters.propellant.toLowerCase())) &&
        (propellantLessColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(propellantLessColumnFilters.specific_impulse.toLowerCase())) &&
        (propellantLessColumnFilters.envelope === '' || envelopeLowerCase.includes(propellantLessColumnFilters.envelope.toLowerCase())) &&
        (propellantLessColumnFilters.power === '' || powerLowerCase.includes(propellantLessColumnFilters.power.toLowerCase())) &&
        (propellantLessColumnFilters.acs === '' || acsLowerCase.includes(propellantLessColumnFilters.acs.toLowerCase())) &&
        (propellantLessColumnFilters.pmi === '' || pmiLowerCase.includes(propellantLessColumnFilters.pmi.toLowerCase())) &&
        (propellantLessColumnFilters.missions === '' || missionsLowerCase.includes(propellantLessColumnFilters.missions.toLowerCase())) &&
        (propellantLessColumnFilters.references === '' || referencesLowerCase.includes(propellantLessColumnFilters.references.toLowerCase())) &&
        (propellantLessColumnFilters.country === '' || countryLowerCase.includes(propellantLessColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setPropellantLessFilteredData(filtered);
  }, [propellantLessData, propellantLessColumnFilters]);
  
  // Effect hook for updating the selected PropellantLess providers
  useEffect(() => {
  const existingPropellantLess = location.state && location.state.propellantLess ? location.state.propellantLess : [];
    const PropellantLessFromStorage = JSON.parse(localStorage.getItem("selectedPropellantLess")) || [];
    const combinedPropellantLess = [...existingPropellantLess, ...PropellantLessFromStorage];
    setSelectedPropellantLess(combinedPropellantLess);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setPropellantLessColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the PropellantLess is already selected
    const isSelected = selectedPropellantLess.some((p) => p.id === row.id);
    if (isSelected) {
      // If the PropellantLess is already selected, remove it from the selectedPropellantLess array
      setSelectedPropellantLess((prevPropellantLess) =>
        prevPropellantLess.filter((p) => p.id !== row.id)
      );
    } else {
// If the PropellantLess is not selected, add it to the selectedPropellantLess array
      setSelectedPropellantLess((prevPropellantLess) => [...prevPropellantLess, row]);
    }
  };

  // Function to handle the table selections
  const handlePropellantLessSelection = () => {
    const storedPropellantLess = JSON.parse(localStorage.getItem("selectedPropellantLess")) || [];
    
    // Check if there are any differences between the current selected PropellantLess and stored PropellantLess
    const propellantLessChanged = JSON.stringify(selectedPropellantLess) !== JSON.stringify(storedPropellantLess);
  
    if (propellantLessChanged) {
      localStorage.setItem("selectedPropellantLess", JSON.stringify(selectedPropellantLess));
      tableNotification();
    }
  };
 
  // Function to display the PropellantLess row data using the number of visibleItems
  const renderPropellantLessTableRows = () => {
    const visibleData = propellantLessFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedPropellantLess.some((p) => p.id === row.id)}
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
  const handlePropellantLessScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, propellantLessFilteredData.length));
    }
  }, [propellantLessFilteredData.length]);
  
  return (
    <div className={styles.propellantlesstableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={propellantLessColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={propellantLessColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={propellantLessColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust*"
            value={propellantLessColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={propellantLessColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={propellantLessColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={propellantLessColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={propellantLessColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={propellantLessColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={propellantLessColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={propellantLessColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={propellantLessColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={propellantLessColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {propellantLessLoading ? (
        <p>Loading...</p>
      ) : (
        propellantLessFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handlePropellantLessScroll}>
          <button className={styles.addSelectedButton} onClick={handlePropellantLessSelection}>Add Selected to Bucket</button>
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
              {renderPropellantLessTableRows()}
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

  export default PropellantLessProviderTable;
