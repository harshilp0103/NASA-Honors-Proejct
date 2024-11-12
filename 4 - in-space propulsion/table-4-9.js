import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import { createClient } from '@supabase/supabase-js';
import tableNotification from '../../tableNotification';
import styles from "../../../pages/CompleteSpacecraftPlatforms.module.css";
import { GriddedIonContext } from '../../../context/4/4-9';
import { fetchTableData } from "../../../resources/fetchData";


// Gridded Ion Providers table component
const GriddedIonProviderTable = () => {
  const navigate = useNavigate(); 

  // Bucket page link 
  const handleNavigateToBucket = () => {
    navigate('/bucket');
  };

  // Gridded Ion Providers context
  const { griddedIonData } = useContext(GriddedIonContext);

  // State variables for displaying the loading message while waitng to fetch data
  const [griddedIonLoading, setGriddedIonLoading] = useState(true);

  // State variables for the Gridded Ion filtered data using the column filters
  const [griddedIonFilteredData, setGriddedIonFilteredData] = useState([]);

  // State variables for the selected table components
  const [selectedGriddedIon, setSelectedGriddedIon] = useState([]); 

  // Variables to create the column filtering states
  const [griddedIonColumnFilters, setGriddedIonColumnFilters] = useState({
    manufacturer: '',
    product: '',
    type: '',
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
				const sortedData = await fetchTableData("Table 4-9 Gridded Ion Electric Propulsion");

				setGriddedIonFilteredData(sortedData || []);
			} catch (error) {
				throw new Error("Error fetching data: ", error.message);
			} finally {
				setGriddedIonLoading(false);
			}
		};

		fetchData();
	}, []);

  
  // Effect hook for filtering the Gridded Ion table data values
  useEffect(() => {
    const filtered = griddedIonData.filter(row => {
      const manufacturerLowerCase = String(row.manufacturer || '').toLowerCase();
      const productLowerCase = String(row.product || '').toLowerCase();
      const typeLowerCase = String(row.type || '').toLowerCase();
      const propellantLowerCase = String(row.propellant || '').toLowerCase();
      const specificImpulseLowerCase = String(row.specific_impulse || '').toLowerCase();
      const envelopeLowerCase = String(row.envelope || '').toLowerCase();
      const powerLowerCase = String(row.power || '').toLowerCase();
      const cathodeLowerCase = String(row.cathode_type || '').toLowerCase();
      const pmiLowerCase = String(row.pmi || '').toLowerCase();
      const missionsLowerCase = String(row.missions || '').toLowerCase();
      const referencesLowerCase = String(row.references || '').toLowerCase();
      const countryLowerCase = String(row.country || '').toLowerCase();
      const thrustRangeFilter = parseFloat(griddedIonColumnFilters.thrust);
      const totalImpulseRangeFilter = parseFloat(griddedIonColumnFilters.total_impulse);
      const massRangeFilter = parseFloat(griddedIonColumnFilters.mass);
    
      return (
        (griddedIonColumnFilters.manufacturer === '' || manufacturerLowerCase.includes(griddedIonColumnFilters.manufacturer.toLowerCase())) &&
        (griddedIonColumnFilters.product === '' || productLowerCase.includes(griddedIonColumnFilters.product.toLowerCase())) &&
        (griddedIonColumnFilters.type === '' || typeLowerCase.includes(griddedIonColumnFilters.type.toLowerCase())) &&
        (griddedIonColumnFilters.propellant === '' || propellantLowerCase.includes(griddedIonColumnFilters.propellant.toLowerCase())) &&
        (griddedIonColumnFilters.specific_impulse === '' || specificImpulseLowerCase.includes(griddedIonColumnFilters.specific_impulse.toLowerCase())) &&
        (griddedIonColumnFilters.envelope === '' || envelopeLowerCase.includes(griddedIonColumnFilters.envelope.toLowerCase())) &&
        (griddedIonColumnFilters.power === '' || powerLowerCase.includes(griddedIonColumnFilters.power.toLowerCase())) &&
        (griddedIonColumnFilters.cathode_type === '' || cathodeLowerCase.includes(griddedIonColumnFilters.cathode_type.toLowerCase())) &&
        (griddedIonColumnFilters.pmi === '' || pmiLowerCase.includes(griddedIonColumnFilters.pmi.toLowerCase())) &&
        (griddedIonColumnFilters.missions === '' || missionsLowerCase.includes(griddedIonColumnFilters.missions.toLowerCase())) &&
        (griddedIonColumnFilters.references === '' || referencesLowerCase.includes(griddedIonColumnFilters.references.toLowerCase())) &&
        (griddedIonColumnFilters.country === '' || countryLowerCase.includes(griddedIonColumnFilters.country.toLowerCase())) &&
        (isNaN(thrustRangeFilter) || parseFloat(row.thrust) <= thrustRangeFilter) &&
        (isNaN(totalImpulseRangeFilter) || parseFloat(row.total_impulse) <= totalImpulseRangeFilter) &&
        (isNaN(massRangeFilter) || parseFloat(row.mass) <= massRangeFilter)
      );
    });
  
    setGriddedIonFilteredData(filtered);
  }, [griddedIonData, griddedIonColumnFilters]);
  
  // Effect hook for updating the selected Gridded Ion providers
  useEffect(() => {
    const existingGriddedIon = location.state && location.state.griddedIon ? location.state.griddedIon : [];
    const GriddedIonFromStorage = JSON.parse(localStorage.getItem("selectedGriddedIon")) || [];
    const combinedGriddedIon = [...existingGriddedIon, ...GriddedIonFromStorage];
    setSelectedGriddedIon(combinedGriddedIon);
  }, []);

  // Function for handling the table data during filtering
  const handleFilterChange = useCallback((columnName, value) => {
    setGriddedIonColumnFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value,
    }));
  }, []);
    
  // Define number of items per page
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(20);

  // Function to handle checkbox changes
  const handleCheckboxChange = (row) => {
    // Check if the Gridded Ion is already selected
    const isSelected = selectedGriddedIon.some((p) => p.id === row.id);
    if (isSelected) {
      // If the Gridded Ion is already selected, remove it from the selectedGriddedIon array
      setSelectedGriddedIon((prevGriddedIon) =>
        prevGriddedIon.filter((p) => p.id !== row.id)
      );
    } else {
// If the Gridded Ion is not selected, add it to the selecteGriddedIon array
      setSelectedGriddedIon((prevGriddedIon) => [...prevGriddedIon, row]);
    }
  };

  // Function to handle the table selections
  const handleGriddedIonSelection = () => {
    const storedGriddedIon = JSON.parse(localStorage.getItem("selectedGriddedIon")) || [];
    
    // Check if there are any differences between the current selected GriddedIon and stored Gridded Ion
    const griddedIonChanged = JSON.stringify(selectedGriddedIon) !== JSON.stringify(storedGriddedIon);
  
    if (griddedIonChanged) {
      localStorage.setItem("selectedGriddedIon", JSON.stringify(selectedGriddedIon));
      tableNotification();
    }
  };
 
  // Function to display the GriddedIon row data using the number of visibleItems
  const renderGriddedIonTableRows = () => {
    const visibleData = griddedIonFilteredData.slice(0, visibleItems);

    return visibleData.map((row, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(row)}
            checked={selectedGriddedIon.some((p) => p.id === row.id)}
          />
        </td>
        <td>{row.manufacturer}</td>
        <td>{row.product}</td>
        <td>{row.type}</td>
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
  const handleGriddedIonScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const isScrolledToBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight;
  
    if (isScrolledToBottom) {
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, griddedIonFilteredData.length));
    }
  }, [griddedIonFilteredData.length]);
  
  return (
    <div className={styles.griddedIontableframe}>
      <div> 
        <div className={styles.filterBox}>
          <input
            type="text"
            placeholder="Filter by Manufacturer"
            value={griddedIonColumnFilters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={griddedIonColumnFilters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Type"
            value={griddedIonColumnFilters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Propellant"
            value={griddedIonColumnFilters.propellant}
            onChange={(e) => handleFilterChange('propellant', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Thrust per Thruster"
            value={griddedIonColumnFilters.thrust}
            onChange={(e) => handleFilterChange('thrust', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Specific Impulse"
            value={griddedIonColumnFilters.specific_impulse}
            onChange={(e) => handleFilterChange('specific impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Total Impulse"
            value={griddedIonColumnFilters.total_impulse}
            onChange={(e) => handleFilterChange('total impulse', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Mass"
            value={griddedIonColumnFilters.mass}
            onChange={(e) => handleFilterChange('mass', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Envelope"
            value={griddedIonColumnFilters.envelope}
            onChange={(e) => handleFilterChange('envelope', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Cathode Type"
            value={griddedIonColumnFilters.cathode_type}
            onChange={(e) => handleFilterChange('cathode type', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by PMI Status"
            value={griddedIonColumnFilters.pmi}
            onChange={(e) => handleFilterChange('pmi status', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Missions"
            value={griddedIonColumnFilters.missions}
            onChange={(e) => handleFilterChange('missions', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by References"
            value={griddedIonColumnFilters.references}
            onChange={(e) => handleFilterChange('references', e.target.value)}
          />
           <input
            type="text"
            placeholder="Filter by Country"
            value={griddedIonColumnFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      {griddedIonLoading ? (
        <p>Loading...</p>
      ) : (
        griddedIonFilteredData.length > 0 ? (
        <div className={styles.scrollableTableContainer} onScroll={handleGriddedIonScroll}>
          <button className={styles.addSelectedButton} onClick={handleGriddedIonSelection}>Add Selected to Bucket</button>
          <button className={styles.navigateToBucketButton} onClick={handleNavigateToBucket}>Navigate to Bucket</button>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Manufacturer</th>
                <th>Product</th>
                <th>Type</th>
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
              {renderGriddedIonTableRows()}
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

  export default GriddedIonProviderTable;
