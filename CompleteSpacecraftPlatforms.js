import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// React context components for selecting data from the tables
import { HostedPayloadProvider } from '../context/2/2-1';
import { MissionProvider } from '../context/2/2-2';
import { PocketQubesProvider } from '../context/2/2-3';
import { ThreeUProvider } from '../context/2/2-4';
import { SixUProvider } from '../context/2/2-5';
import { TwelveUProvider } from '../context/2/2-6';
import { SixteenUProvider } from '../context/2/2-7';
import { ESPAProvider } from '../context/2/2-8';
import { ContactProvider } from '../context/2/2-9';

// Table components for displaying specific data associated with each table
import HostedPayloadProvidersTable from '../components/tables/2 - integrated spacecraft platforms/table-2-1';
import MissionProviderTable from '../components/tables/2 - integrated spacecraft platforms/table-2-2';
import PocketQubesMarketSolutionsTable from '../components/tables/2 - integrated spacecraft platforms/table-2-3';
import ThreeUMarketSolutionsTable from '../components/tables/2 - integrated spacecraft platforms/table-2-4';
import SixUMarketSolutionsTable from '../components/tables/2 - integrated spacecraft platforms/table-2-5';
import TwelveUMarketSolutionsTable from '../components/tables/2 - integrated spacecraft platforms/table-2-6';
import SixteenUMarketSolutionsTable from '../components/tables/2 - integrated spacecraft platforms/table-2-7';
import ESPAProviderTable from '../components/tables/2 - integrated spacecraft platforms/table-2-8';
import ContactProviderTable from '../components/tables/2 - integrated spacecraft platforms/table-2-9';

import Footer from '../components/Footer';
import styles from "./CompleteSpacecraftPlatforms.module.css";

// Complete Spacecraft Platforms Page
const CompleteSpacecraftPlatforms = () => {
  const navigate = useNavigate();

  // Logo Link to navigate back to homepage
  const onSotaAppLogoImageClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Bucket page link
  const onBucketTextClick = () => {
    navigate('/bucket', { selectedComponents });
  };

  // Modules Portal link
  const onModulesTextClick = useCallback(() => {
    navigate('/modules');
  }, [navigate]);

  // State for handling which Dedicated Spacecraft Bus table is selected, initialized with
  //  the 0.25U-3U Market Solutions table
  const [selectedTableSize, setSelectedTableSize] = useState('0.25U-3U Market Solutions'); 

  // Function to handle the Dedicated Spacecraft Bus table change
  const handleTableSizeChange = (e) => {
    setSelectedTableSize(e.target.value);
  };
  
  // State for the selected table components
  const [selectedComponents, setSelectedComponents] = useState([]);

  // Function to handle the table component selections
  const handleComponentSelection = (componentId) => {
    setSelectedComponents(prevSelectedComponents => [...prevSelectedComponents, componentId]);
  };

  // Object containing the table components for each Dedicated Spacecraft Bus section
  const tableComponents = {
    '0.25U-3U Market Solutions': <ThreeUMarketSolutionsTable />,
    '6U Market Solutions': <SixUMarketSolutionsTable />,
    '12U Market Solutions': <TwelveUMarketSolutionsTable />,
    '16U+ Market Solutions': <SixteenUMarketSolutionsTable />,
    'PocketQubes Market Solutions': <PocketQubesMarketSolutionsTable />, 
  };

  return (
    <HostedPayloadProvider> 
    <MissionProvider>
    <PocketQubesProvider>
    <ThreeUProvider> 
    <SixUProvider>
    <TwelveUProvider>
    <SixteenUProvider>
    <ESPAProvider>
    <ContactProvider>
      
    <div className={styles.completeSpacecraftPlatforms}>
      {/* Component Selcted Notification using toastify */}
      <ToastContainer position="bottom-center" />
        <div className={styles.modulepagesheader}>
          <img
            className={styles.sotaapplogoIcon}
            alt="Web app logo, animation featuring a small spacecraft orbiting the earth. 
                Blue circular background with a blue and white planet"
            src="/sotaAppLogo.png"
            onClick={onSotaAppLogoImageClick}
          />
          <b className={styles.bucket} onClick={onBucketTextClick}>
              Bucket
          </b>
          <b className={styles.modules} onClick={onModulesTextClick}>
              Modules
           </b>
        </div>
          <div className={styles.completeSpacecraftPlatformIntro}>
            <img
              className={styles.capstoneimageIcon}
              alt="A microwave oven–sized CubeSat weighing just 55 pounds is the 
                    first spacecraft to test a unique, elliptical lunar orbit as part 
                    of the Cislunar Autonomous Positioning System Technology Operations 
                    and Navigation Experiment, referred to as Capstone "
              src="/capstoneImage.png"
            />
            <b className={styles.completeSpacecraftPlatformsPageTitle}>
              Complete Spacecraft Platforms
            </b>
          </div>
          <div className={styles.payloadDescriptionFrame}>
            <b className={styles.payloadDescriptionContainer}>
              <p className={styles.payloadDescription}>
                For years, the SmallSat market has provided a variety of
                mission-enabling components. Along with a large variety of new and
                proven components, companies are now offering entire spacecraft bus
                solutions. Spacecraft bus refers to the side of the mission flight
                segment that provides essential services to the payload.
                There are 2 distinct types of SmallSat market options in terms of complete 
                spacecraft platforms. Including Hosted payload and Dedicated spacecraft bus. 
              </p>
            </b>
          </div>
          <div className={styles.hostedPayloadDescriptionFrame}>
            <img
              className={styles.hostedpayloadimageIcon}
              alt="Representation of NASA’s FASTSAT minisatellite."
              src="/hostedPayloadImage.png"
            />
            <b className={styles.hostedPayloadsAlsoContainer}>
              <p className={styles.payloadDescription}>
                <span className={styles.hostedPayloads}>Hosted payloads</span>
                <span>
                  , also referred as “satellite-as-a-service,” “hitchhiking” or
                  “piggybacking,” is increasing in popularity due to its cost
                  savings. The idea is to share the spacecraft bus platform with
                  other payloads and still achieve mission success.
                </span>
              </p>
              <p className={styles.payloadDescription}>&nbsp;</p>
              <p className={styles.payloadDescription}>
                Configurations of a hosted payload platform are typically scalable,
                and several spacecraft platform vendors provide hosted payload services
              </p>
            </b>
          </div>
          <h2>Hosted Payload Providers</h2>
          <HostedPayloadProvidersTable onSelect={handleComponentSelection} />
          <div className={styles.dedicatedSpacecraftBusIntro}>
            <b className={styles.dedicatedSpacecraftBusContainer}>
              <p className={styles.payloadDescription}>
                <span
                  className={styles.hostedPayloads}>
                  Dedicated Spacecraft Bus 
                </span>
                <span>
                  – the entirety of the spacecraft bus is at the disposal of a
                  single customer or mission
                </span>
              </p>
              <p
                className={styles.payloadDescription}>
                The dedicated small spacecraft bus section is further divided into three offerings:
              </p>
            </b>
            <img
              className={styles.dedicatedBusImageIcon}
              alt=""
              src="/dedicatedBusImage.png"
            />
            <b className={styles.pocketqubeContainer}>
              <p className={styles.payloadDescription}> o PocketQube</p>
              <p className={styles.payloadDescription}> o CubeSat</p>
              <p className={styles.payloadDescription}> o ESPA-Class</p>
            </b>
          </div>
          <div className={styles.pocketqubeReferenceFrame}>
            <b className={styles.pocketqubesReferContainer}>
              <span>PocketQubes</span>
              <span className={styles.busDescriptions}>
                {" "}
                - refer to small satellites that conform to a form factor of 5 cm
                cubes.
              </span>
            </b>
            <img
              className={styles.pocketqubesReferenceImageIcon}
              alt=""
              src="/pocketqubesReferenceImage.png"
            />
          </div>
          <div className={styles.cubesatReferenceFrame}>
            <b className={styles.cubesatsReferContainer}>
              <span>CubeSats -</span>
              <span className={styles.busDescriptions}>
                {" "}
                refer to small satellites that conform to a form factor of 10 cm
                cubes.
              </span>
            </b>
            <img
              className={styles.cubesatreferenceimageIcon}
              alt=""
              src="/cubesatReferenceImage.png"
            />
          </div>
          <div className={styles.espaReferenceFrame}>
            <b className={styles.espaClassReferContainer}>
              <span>ESPA-Class -</span>
              <span className={styles.busDescriptions}>
                {" "}
                refer to Evolved Expendable Launch Vehicle (EELV) Secondary Payload
                Adapter (SPA) or smaller configurations.
              </span>
            </b>
            <img
              className={styles.espaReferenceImageIcon}
              alt=""
              src="/espaReferenceImage.png"
            />
          </div>
          <h2>Mission Implementation Flexibility</h2>
          <MissionProviderTable onSelect={handleComponentSelection} />
          <h2>ESPA-Class Market Solutions</h2>
          <ESPAProviderTable onSelect={handleComponentSelection} />
          <h2>List of Contact Information for Organizations in this Chapter</h2>
          <ContactProviderTable onSelect={handleComponentSelection} />
          <h2>Dedicated Spacecraft Bus</h2>
          {/* Dedicated Spacecraft Bus table dropdown */}
          <label>Select Spacecraft Size:</label>
          <div className={styles.selectContainer}>
                <select value={selectedTableSize} onChange={handleTableSizeChange}>
                  {Object.keys(tableComponents).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              {tableComponents[selectedTableSize]}
          </div>
          <Footer/>
        </div>
    </ContactProvider>
    </ESPAProvider>
    </SixteenUProvider>
    </TwelveUProvider>
    </SixUProvider>
    </ThreeUProvider>
    </PocketQubesProvider>
    </MissionProvider>
    </HostedPayloadProvider>
  );
};

export default CompleteSpacecraftPlatforms;
