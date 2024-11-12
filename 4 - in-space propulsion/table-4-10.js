import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { HallEffectContext } from '../../../context/4/4-10';
import { fetchTableData } from "../../../resources/fetchData";


// Hall Effect Providers table component
const HallEffectProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Hall Effect Providers context
  const { hallEffectData } = useContext(HallEffectContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [hallEffectLoading, setHallEffectLoading] = useState(true);

  // State variables for the Hall Effect filtered data using the column filters
  const [hallEffectFilteredData, setHallEffectFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedHallEffect, setSelectedHallEffect] = useState([]); 

  // Variables to create the column filtering states
  const [hallEffectColumnFilters, setHallEffectColumnFilters] = useState({
    manufacturer: '',
    product: '',
    propellant: '',
    thrust: '',
    specific_impulse: '',
    total_impulse: '',
    mass: '',
    envelope: '',
    power: '',
    cathode_type: '',
    pmi: '',
    missions: '',
    references: '',
    country: '',
  });
    
  // Effect hook for fetching the mission table data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				const sortedData = await fetchTableData("Table 4-10 Hall Effect Electric Propulsion Thrusters");

				setHallEffectFilteredData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setHallEffectLoading(false);
			}
		};

		fetchData();
	}, []);

  
  // Effect hook for filtering the Hall Effect table data values
  useEffect(() => {
    const filtered = hallEffectData.filter(row => {
      const manufacturerLowerCase = String(row.manufacturer || '').toLowerCase();
      const productLowerCase = String(row.product || '').toLowerCase();
      const propellantLowerCase = String(row.propellant || '').toLowerCase();
      const specificImpulseLowerCase = String(row.specific_impulse || '').toLowerCase();
      const envelopeLowerCase = String(row.envelope || '').toLowerCase();
      const powerLowerCase = String(row.power || '').toLowerCase();
      const cathodeLowerCase = String(row.cathode_type || '').toLowerCase();
      const pmiLowerCase = String(row.pmi || '').toLowerCase();
      const missionsLowerCase = String(row.missions || '').toLowerCase();
      const referencesLowerCase = String(row.references || '').toLowerCase();
      const countryLowerCase = String(row.country || '').toLowerCase();
      const thrustRangeFilter = parseFloat(hallEffectColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(hallEffectColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(hallEffectColumnFilters.mass);
    
      return (
        (hallEffectColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(hallEffectColumnFilters.manufacturer.toLowerCase())) &&
        (hallEffectColumnFilters.product === '' || productLowerCase.includes(hallEffectColumnFilters.product.toLowerCase())) &&
        (hallEffectColumnFilters.propellant === '' || propellantLowerCase.includes(hallEffectColumnFilters.propellant.toLowerCase())) &&
        (hallEffectColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(hallEffectColumnFilters.specific_impulse.toLowerCase())) &&
        (hallEffectColumnFilters.envelope === '' || envelopeLowerCase.includes(hallEffectColumnFilters.envelope.toLowerCase())) &&
        (hallEffectColumnFilters.power === '' || powerLowerCase.includes(hallEffectColumnFilters.power.toLowerCase())) &&
        (hallEffectColumnFilters.cathode_type === '' || cathodeLowerCase.includes(hallEffectColumnFilters.cathode_type.toLowerCase())) &&
        (hallEffectColumnFilters.pmi === '' || pmiLowerCase.includes(hallEffectColumnFilters.pmi.toLowerCase())) &&
        (hallEffectColumnFilters.missions === '' || missionsLowerCase.includes(hallEffectColumnFilters.missions.toLowerCase())) &&
        (hallEffectColumnFilters.references === '' || referencesLowerCase.includes(hallEffectColumnFilters.references.toLowerCase())) &&
        (hallEffectColumnFilters.country === '' || countryLowerCase.includes(hallEffectColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setHallEffectFilteredData(filtered);
  }, [hallEffectData, hallEffectColumnFilters]);
  
  // Effect hook for updating the selected Hall Effect providers
  useEffect(() => {
    const existingHallEffect = location.state && location.state.hallEffect ? location.state.hallEffect : [];
    const HallEffectFromStorage = JSON.parse(localStorage.getItem("selectedHallEffect")) || [];
    const combinedHallEffect = [...existingHallEffect, ...HallEffectFromStorage];
    setSelectedHallEffect(combinedHallEffect);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setHallEffectColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Hall Effect is already selected
    const isSelected = selectedHallEffect.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Hall Effect is already selected, remove it from the selectedHallEffect array
      setSelectedHallEffect((prevHallEffect) =>
        prevHallEffect.filter((p) => p.id !== row.id)
      );
    } else {
// If the Hall Effect is not selected, add it to the selectedHallEffect array
      setSelectedHallEffect((prevHallEffect) => [...prevHallEffect, row]);
    }
  };

  // Function to handle the table selections
  const handleHallEffectSelection = () => {
    const storedHallEffect = JSON.parse(localStorage.getItem("selectedHallEffect")) || [];
    
    // Check if there are any differences between the current selected Hall Effect and stored Hall Effect
    const hallEffectChanged = JSON.stringify(selectedHallEffect) !== JSON.stringify(storedHallEffect);
  
    if (hallEffectChanged) {
      localStorage.setItem("selectedHallEffect", JSON.stringify(selectedHallEffect));
      tableNotification();
    }
  };
 
  // Function to display the Hall Effect row data using the number of visibleItems
  const renderHallEffectTableRows = () => {
    const visibleData = hallEffectFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedHallEffect.some((p) => p.id === row.id)}
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
        <td>{row.cathode_type}</td>
        <td>{row.pmi}</td>
        <td>{row.missions}</td>
        <td>{row.references}</td>
        <td>{row.country}</td>
      </tr>
    ));
  };

  // Function to scroll the table data helping to decrease page space and increase usability
  const handleHallEffectScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, hallEffectFilteredData.length));
    }
  }, [hallEffectFilteredData.length]);
  
  return (
    <div className={styles.hallEffecttableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={hallEffectColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={hallEffectColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={hallEffectColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={hallEffectColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={hallEffectColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={hallEffectColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={hallEffectColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={hallEffectColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Cathode Type"
            value={hallEffectColumnFilters.cathode_type}
            onChange={(e) => handleFilterChange('cathode type', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={hallEffectColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={hallEffectColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={hallEffectColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={hallEffectColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {hallEffectLoading ? (
        <p>Loading...</p>
      ) : (
        hallEffectFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleHallEffectScroll}>
          <button className={styles.addSelectedButton} onClick={handleHallEffectSelection}>Add Selected to Bucket</button>
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
                <th>Cathode Type</th>
                <th>PMI Status</th>
                <th>Missions</th>
                <th>References</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {renderHallEffectTableRows()}
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

  export default HallEffectProviderTable;
