import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { PlasmaContext } from '../../../context/4/4-11';
import { fetchTableData } from "../../../resources/fetchData";


// Plasma Providers table component
const PlasmaProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Plasma Providers context
  const { plasmaData } = useContext(PlasmaContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [plasmaLoading, setPlasmaLoading] = useState(true);

  // State variables for the Plasma filtered data using the column filters
  const [plasmaFilteredData, setPlasmaFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedPlasma, setSelectedPlasma] = useState([]); 

  // Variables to create the column filtering states
  const [plasmaColumnFilters, setPlasmaColumnFilters] = useState({
    manufacturer: '',
    product: '',
    propellant: '',
    thrust: '',
    impulse_bit: '',
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
				const sortedData = await fetchTableData("Table 4-11 Pulsed Plasma and Vaccum Arc Electric Propulsion");

				setPlasmaFilteredData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setPlasmaLoading(false);
			}
		};

		fetchData();
	}, []);

  
  // Effect hook for filtering the Plasma table data values
  useEffect(() => {
    const filtered = plasmaData.filter(row => {
      const manufacturerLowerCase = String(row.manufacturer || '').toLowerCase();
      const productLowerCase = String(row.product || '').toLowerCase();
      const propellantLowerCase = String(row.propellant || '').toLowerCase();
      const impulseBitLowerCase = String(row.impulse_bit || '').toLowerCase();
      const specificImpulseLowerCase = String(row.specific_impulse || '').toLowerCase();
      const envelopeLowerCase = String(row.envelope || '').toLowerCase();
      const powerLowerCase = String(row.power || '').toLowerCase();
      const acsLowerCase = String(row.acs || '').toLowerCase();
      const pmiLowerCase = String(row.pmi || '').toLowerCase();
      const missionsLowerCase = String(row.missions || '').toLowerCase();
      const referencesLowerCase = String(row.references || '').toLowerCase();
      const countryLowerCase = String(row.country || '').toLowerCase();
      const thrustRangeFilter = parseFloat(plasmaColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(plasmaColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(plasmaColumnFilters.mass);
    
      return (
        (plasmaColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(plasmaColumnFilters.manufacturer.toLowerCase())) &&
        (plasmaColumnFilters.product === '' || productLowerCase.includes(plasmaColumnFilters.product.toLowerCase())) &&
        (plasmaColumnFilters.propellant === '' || propellantLowerCase.includes(plasmaColumnFilters.propellant.toLowerCase())) &&
        (plasmaColumnFilters.impulse_bit === '' || impulseBitLowerCase.includes(plasmaColumnFilters.impulse_bit.toLowerCase())) &&
        (plasmaColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(plasmaColumnFilters.specific_impulse.toLowerCase())) &&
        (plasmaColumnFilters.envelope === '' || envelopeLowerCase.includes(plasmaColumnFilters.envelope.toLowerCase())) &&
        (plasmaColumnFilters.power === '' || powerLowerCase.includes(plasmaColumnFilters.power.toLowerCase())) &&
        (plasmaColumnFilters.acs === '' || acsLowerCase.includes(plasmaColumnFilters.acs.toLowerCase())) &&
        (plasmaColumnFilters.pmi === '' || pmiLowerCase.includes(plasmaColumnFilters.pmi.toLowerCase())) &&
        (plasmaColumnFilters.missions === '' || missionsLowerCase.includes(plasmaColumnFilters.missions.toLowerCase())) &&
        (plasmaColumnFilters.references === '' || referencesLowerCase.includes(plasmaColumnFilters.references.toLowerCase())) &&
        (plasmaColumnFilters.country === '' || countryLowerCase.includes(plasmaColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setPlasmaFilteredData(filtered);
  }, [plasmaData, plasmaColumnFilters]);
  
  // Effect hook for updating the selected Plasma providers
  useEffect(() => {
    const existingPlasma = location.state && location.state.plasma ? location.state.plasma : [];
    const PlasmaFromStorage = JSON.parse(localStorage.getItem("selectedPlasma")) || [];
    const combinedPlasma = [...existingPlasma, ...PlasmaFromStorage];
    setSelectedPlasma(combinedPlasma);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setPlasmaColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Plasma is already selected
    const isSelected = selectedPlasma.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Plasma is already selected, remove it from the selectedPlasma array
      setSelectedPlasma((prevPlasma) =>
        prevPlasma.filter((p) => p.id !== row.id)
      );
    } else {
// If the Plasma is not selected, add it to the selectedPlasma array
      setSelectedPlasma((prevPlasma) => [...prevPlasma, row]);
    }
  };

  // Function to handle the table selections
  const handlePlasmaSelection = () => {
    const storedPlasma = JSON.parse(localStorage.getItem("selectedPlasma")) || [];
    
    // Check if there are any differences between the current selected Plasma and stored Plasma
    const plasmaChanged = JSON.stringify(selectedPlasma) !== JSON.stringify(storedPlasma);
  
    if (plasmaChanged) {
      localStorage.setItem("selectedPlasma", JSON.stringify(selectedPlasma));
      tableNotification();
    }
  };
 
  // Function to display the Plasma row data using the number of visibleItems
  const renderPlasmaTableRows = () => {
    const visibleData = plasmaFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedPlasma.some((p) => p.id === row.id)}
          />
        </td>
        <td>{row.manufacturer}</td>
        <td>{row.product}</td>
        <td>{row.propellant}</td>
        <td>{row.thrust}</td>
        <td>{row.impulse_bit}</td>
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
  const handlePlasmaScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, plasmaFilteredData.length));
    }
  }, [plasmaFilteredData.length]);
  
  return (
    <div className={styles.plasmatableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={plasmaColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={plasmaColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={plasmaColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={plasmaColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Impulse Bit"
            value={plasmaColumnFilters.impulse_bit}
            onChange={(e) => handleFilterChange('impulse bit', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={plasmaColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={plasmaColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={plasmaColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={plasmaColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={plasmaColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={plasmaColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={plasmaColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={plasmaColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={plasmaColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {plasmaLoading ? (
        <p>Loading...</p>
      ) : (
        plasmaFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handlePlasmaScroll}>
          <button className={styles.addSelectedButton} onClick={handlePlasmaSelection}>Add Selected to Bucket</button>
          <button className={styles.navigateToBucketButton} onClick={handleNavigateToBucket}>Navigate to Bucket</button>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Manufacturer</th>
                <th>Product</th>
                <th>Propellant</th>
                <th>Thrust*</th>
                <th>Impulse Bit</th>
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
              {renderPlasmaTableRows()}
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

  export default PlasmaProviderTable;
