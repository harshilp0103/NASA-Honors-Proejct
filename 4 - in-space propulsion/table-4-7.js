import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { ElectrothermalContext } from '../../../context/4/4-7';
import { fetchTableData } from "../../../resources/fetchData";


// Electrothermal Providers table component
const ElectrothermalProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Electrothermal Providers context
  const { electrothermalData } = useContext(ElectrothermalContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [electrothermalLoading, setElectrothermalLoading] = useState(true);

  // State variables for the Electrothermal filtered data using the column filters
  const [electrothermalFilteredData, setElectrothermalFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedElectrothermal, setSelectedElectrothermal] = useState([]); 

  // Variables to create the column filtering states
  const [electrothermalColumnFilters, setElectrothermalColumnFilters] = useState({
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
            const sortedData = await fetchTableData("Table 4-7 Electrothermal Electric Propulsion");

            setElectrothermalFilteredData(sortedData || []);
        } catch (error) {
            throw new Error("Error fetching data: ", error.message);
        } finally {
          setElectrothermalLoading(false);
        }
    };

    fetchData();
}, []);

  
  // Effect hook for filtering the Electrothermal table data values
  useEffect(() => {
    const filtered = electrothermalData.filter(row => {
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
      const thrustRangeFilter = parseFloat(electrothermalColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(electrothermalColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(electrothermalColumnFilters.mass);
    
      return (
        (electrothermalColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(electrothermalColumnFilters.manufacturer.toLowerCase())) &&
        (electrothermalColumnFilters.product === '' || productLowerCase.includes(electrothermalColumnFilters.product.toLowerCase())) &&
        (electrothermalColumnFilters.propellant === '' || propellantLowerCase.includes(electrothermalColumnFilters.propellant.toLowerCase())) &&
        (electrothermalColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(electrothermalColumnFilters.specific_impulse.toLowerCase())) &&
        (electrothermalColumnFilters.envelope === '' || envelopeLowerCase.includes(electrothermalColumnFilters.envelope.toLowerCase())) &&
        (electrothermalColumnFilters.power === '' || powerLowerCase.includes(electrothermalColumnFilters.power.toLowerCase())) &&
        (electrothermalColumnFilters.acs === '' || acsLowerCase.includes(electrothermalColumnFilters.acs.toLowerCase())) &&
        (electrothermalColumnFilters.pmi === '' || pmiLowerCase.includes(electrothermalColumnFilters.pmi.toLowerCase())) &&
        (electrothermalColumnFilters.missions === '' || missionsLowerCase.includes(electrothermalColumnFilters.missions.toLowerCase())) &&
        (electrothermalColumnFilters.references === '' || referencesLowerCase.includes(electrothermalColumnFilters.references.toLowerCase())) &&
        (electrothermalColumnFilters.country === '' || countryLowerCase.includes(electrothermalColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setElectrothermalFilteredData(filtered);
  }, [electrothermalData, electrothermalColumnFilters]);
  
  // Effect hook for updating the selected Electrothermal providers
  useEffect(() => {
    const existingElectrothermal = location.state && location.state.electrothermal ? location.state.electrothermal : [];
    const ElectrothermalFromStorage = JSON.parse(localStorage.getItem("selectedElectrothermal")) || [];
    const combinedElectrothermal = [...existingElectrothermal, ...ElectrothermalFromStorage];
    setSelectedElectrothermal(combinedElectrothermal);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setElectrothermalColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Electrothermal is already selected
    const isSelected = selectedElectrothermal.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Electrothermal is already selected, remove it from the selectedElectrothermal array
      setSelectedElectrothermal((prevElectrothermal) =>
        prevElectrothermal.filter((p) => p.id !== row.id)
      );
    } else {
// If the Electrothermal is not selected, add it to the selectedElectrothermal array
      setSelectedElectrothermal((prevElectrothermal) => [...prevElectrothermal, row]);
    }
  };

  // Function to handle the table selections
  const handleElectrothermalSelection = () => {
    const storedElectrothermal = JSON.parse(localStorage.getItem("selectedElectrothermal")) || [];
    
    // Check if there are any differences between the current selected Electrothermal and stored Electrothermal
    const electrothermalChanged = JSON.stringify(selectedElectrothermal) !== JSON.stringify(storedElectrothermal);
  
    if (electrothermalChanged) {
      localStorage.setItem("selectedElectrothermal", JSON.stringify(selectedElectrothermal));
      tableNotification();
    }
  };
 
  // Function to display the Electrothermal row data using the number of visibleItems
  const renderElectrothermalTableRows = () => {
    const visibleData = electrothermalFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedElectrothermal.some((p) => p.id === row.id)}
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
  const handleElectrothermalScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, electrothermalFilteredData.length));
    }
  }, [electrothermalFilteredData.length]);
  
  return (
    <div className={styles.electrothermaltableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={electrothermalColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={electrothermalColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={electrothermalColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={electrothermalColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={electrothermalColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={electrothermalColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={electrothermalColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={electrothermalColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by ACS"
            value={electrothermalColumnFilters.acs}
            onChange={(e) => handleFilterChange('acs', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={electrothermalColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={electrothermalColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={electrothermalColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={electrothermalColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {electrothermalLoading ? (
        <p>Loading...</p>
      ) : (
        electrothermalFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleElectrothermalScroll}>
          <button className={styles.addSelectedButton} onClick={handleElectrothermalSelection}>Add Selected to Bucket</button>
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
              {renderElectrothermalTableRows()}
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

  export default ElectrothermalProviderTable;
