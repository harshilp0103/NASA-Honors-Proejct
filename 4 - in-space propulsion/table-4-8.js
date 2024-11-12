import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { ElectrosprayContext } from '../../../context/4/4-8';
import { fetchTableData } from "../../../resources/fetchData";

// Electrospray Providers table component
const ElectrosprayProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Electrospray Providers context
  const { electrosprayData } = useContext(ElectrosprayContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [electrosprayLoading, setElectrosprayLoading] = useState(true);

  // State variables for the Electrospray filtered data using the column filters
  const [electrosprayFilteredData, setElectrosprayFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedElectrospray, setSelectedElectrospray] = useState([]); 

  // Variables to create the column filtering states
  const [electrosprayColumnFilters, setElectrosprayColumnFilters] = useState({
    manufacturer: '',
    product: '',
    propellant: '',
    thrust: '',
    specific_impulse: '',
    total_impulse: '',
    mass: '',
    envelope: '',
    power: '',
    neutralizer: '',
    pmi: '',
    missions: '',
    references: '',
    country: '',
  });

	// Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-8 Electrospray Electric Propulsion");

				setElectrosprayFilteredData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setElectrosprayLoading(false);
			}
		};

		fetchData();
	}, []);

  // Effect hook for filtering the Electrospray table data values
  useEffect(() => {
    const filtered = electrosprayData.filter(row => {
      const manufacturerLowerCase = String(row.manufacturer || '').toLowerCase();
      const productLowerCase = String(row.product || '').toLowerCase();
      const propellantLowerCase = String(row.propellant || '').toLowerCase();
      const specificImpulseLowerCase = String(row.specific_impulse || '').toLowerCase();
      const envelopeLowerCase = String(row.envelope || '').toLowerCase();
      const powerLowerCase = String(row.power || '').toLowerCase();
      const neutralizerLowerCase = String(row.neutralizer || '').toLowerCase();
      const pmiLowerCase = String(row.pmi || '').toLowerCase();
      const missionsLowerCase = String(row.missions || '').toLowerCase();
      const referencesLowerCase = String(row.references || '').toLowerCase();
      const countryLowerCase = String(row.country || '').toLowerCase();
      const thrustRangeFilter = parseFloat(electrosprayColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(electrosprayColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(electrosprayColumnFilters.mass);
    
      return (
        (electrosprayColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(electrosprayColumnFilters.manufacturer.toLowerCase())) &&
        (electrosprayColumnFilters.product === '' || productLowerCase.includes(electrosprayColumnFilters.product.toLowerCase())) &&
        (electrosprayColumnFilters.propellant === '' || propellantLowerCase.includes(electrosprayColumnFilters.propellant.toLowerCase())) &&
        (electrosprayColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(electrosprayColumnFilters.specific_impulse.toLowerCase())) &&
        (electrosprayColumnFilters.envelope === '' || envelopeLowerCase.includes(electrosprayColumnFilters.envelope.toLowerCase())) &&
        (electrosprayColumnFilters.power === '' || powerLowerCase.includes(electrosprayColumnFilters.power.toLowerCase())) &&
        (electrosprayColumnFilters.neutralizer === '' || neutralizerLowerCase.includes(electrosprayColumnFilters.neutralizer.toLowerCase())) &&
        (electrosprayColumnFilters.pmi === '' || pmiLowerCase.includes(electrosprayColumnFilters.pmi.toLowerCase())) &&
        (electrosprayColumnFilters.missions === '' || missionsLowerCase.includes(electrosprayColumnFilters.missions.toLowerCase())) &&
        (electrosprayColumnFilters.references === '' || referencesLowerCase.includes(electrosprayColumnFilters.references.toLowerCase())) &&
        (electrosprayColumnFilters.country === '' || countryLowerCase.includes(electrosprayColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setElectrosprayFilteredData(filtered);
  }, [electrosprayData, electrosprayColumnFilters]);
  
  // Effect hook for updating the selected Electrospray providers
  useEffect(() => {
    const existingElectrospray = location.state && location.state.electrospray ? location.state.electrospray : [];
    const ElectrosprayFromStorage = JSON.parse(localStorage.getItem("selectedElectrospray")) || [];
    const combinedElectrospray = [...existingElectrospray, ...ElectrosprayFromStorage];
    setSelectedElectrospray(combinedElectrospray);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setElectrosprayColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Electrospray is already selected
    const isSelected = selectedElectrospray.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Electrospray is already selected, remove it from the selectedElectrospray array
      setSelectedElectrospray((prevElectrospray) =>
        prevElectrospray.filter((p) => p.id !== row.id)
      );
    } else {
// If the Electrospray is not selected, add it to the selectedElectrospray array
      setSelectedElectrospray((prevElectrospray) => [...prevElectrospray, row]);
    }
  };

  // Function to handle the table selections
  const handleElectrospraySelection = () => {
    const storedElectrospray = JSON.parse(localStorage.getItem("selectedElectrospray")) || [];
    
    // Check if there are any differences between the current selected Electrospray and stored Electrospray
    const electrosprayChanged = JSON.stringify(selectedElectrospray) !== JSON.stringify(storedElectrospray);
  
    if (electrosprayChanged) {
      localStorage.setItem("selectedElectrospray", JSON.stringify(selectedElectrospray));
      tableNotification();
    }
  };
 
  // Function to display the Electrospray row data using the number of visibleItems
  const renderElectrosprayTableRows = () => {
    const visibleData = electrosprayFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedElectrospray.some((p) => p.id === row.id)}
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
        <td>{row.neutralizer}</td>
        <td>{row.pmi}</td>
        <td>{row.missions}</td>
        <td>{row.references}</td>
        <td>{row.country}</td>
      </tr>
    ));
  };

  // Function to scroll the table data helping to decrease page space and increase usability
  const handleElectrosprayScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, electrosprayFilteredData.length));
    }
  }, [electrosprayFilteredData.length]);
  
  return (
    <div className={styles.electrospraytableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={electrosprayColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={electrosprayColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={electrosprayColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={electrosprayColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={electrosprayColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={electrosprayColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={electrosprayColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={electrosprayColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Neutralizer"
            value={electrosprayColumnFilters.neutralizer}
            onChange={(e) => handleFilterChange('neutralizer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={electrosprayColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={electrosprayColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={electrosprayColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={electrosprayColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {electrosprayLoading ? (
        <p>Loading...</p>
      ) : (
        electrosprayFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleElectrosprayScroll}>
          <button className={styles.addSelectedButton} onClick={handleElectrospraySelection}>Add Selected to Bucket</button>
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
                <th>Neutralizer</th>
                <th>PMI Status</th>
                <th>Missions</th>
                <th>References</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {renderElectrosprayTableRows()}
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

  export default ElectrosprayProviderTable;
