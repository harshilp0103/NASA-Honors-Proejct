import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import VideoPlayer from "../components/VideoPlayer.js";
import video1 from "../components/propulsion/dartPropulsionVid.mp4";
import video2 from "../components/propulsion/neaScoutSatVid.mp4";

// React context components for selecting data from the tables
import { PropulsionSummaryProvider } from "../context/4/4-1.js";
import { HydrazineProvider } from "../context/4/4-2.js";
import { PropellantProvider } from "../context/4/4-3.js";
import { HybridProvider } from "../context/4/4-4.js";
import { ColdGasProvider } from "../context/4/4-5.js";
import { SolidMotorProvider } from "../context/4/4-6.js";
import { ElectrothermalProvider } from "../context/4/4-7.js";
import { ElectrosprayProvider } from "../context/4/4-8.js";
import { GriddedIonProvider } from "../context/4/4-9.js";
import { HallEffectProvider } from "../context/4/4-10.js";
import { PlasmaProvider } from "../context/4/4-11.js";
import { AmbipolarProvider } from "../context/4/4-12.js";
import { PropellantLessProvider } from "../context/4/4-13.js";

// Table components for displaying specific data associated with each table
import PropulsionSummaryProviderTable from "../components/tables/4 - in-space propulsion/table-4-1.js";
import HydrazineProviderTable from "../components/tables/4 - in-space propulsion/table-4-2.js";
import PropellantProviderTable from "../components/tables/4 - in-space propulsion/table-4-3.js";
import HybridProviderTable from "../components/tables/4 - in-space propulsion/table-4-4.js";
import ColdGasProviderTable from "../components/tables/4 - in-space propulsion/table-4-5.js";
import SolidMotorProviderTable from "../components/tables/4 - in-space propulsion/table-4-6.js";
import ElectrothermalProviderTable from "../components/tables/4 - in-space propulsion/table-4-7.js";
import ElectrosprayProviderTable from "../components/tables/4 - in-space propulsion/table-4-8.js";
import GriddedIonProviderTable from "../components/tables/4 - in-space propulsion/table-4-9.js";
import HallEffectProviderTable from "../components/tables/4 - in-space propulsion/table-4-10.js";
import PlasmaProviderTable from "../components/tables/4 - in-space propulsion/table-4-11.js";
import AmbipolarProviderTable from "../components/tables/4 - in-space propulsion/table-4-12.js";
import PropellantLessProviderTable from "../components/tables/4 - in-space propulsion/table-4-13.js";

import Footer from '../components/Footer.js';
import styles from "./InSpacePropulsion.module.css";


// In-Space Propulsion page
const InSpacePropulsion = () => {
  const navigate = useNavigate();

  // Logo Link to navigate back to homepage
  const onSotaAppLogoImageClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Bucket page link
  const onBucketTextClick = useCallback(() => {
    navigate("/bucket");
  }, [navigate]);

  // Modules Portal page link
  const onModulesTextClick = useCallback(() => {
    navigate("/modules");
  }, [navigate]);

  // NASA+ power and propulsion video link 
  const onPropulsionFrameFourContainerClick = useCallback(() => {
    window.open("https://plus.nasa.gov/video/power-and-propulsion/");
  }, []);

  // NASA electric propulsion article link
  const onPropulsionFrameThreeContainerClick = useCallback(() => {
    window.open("https://www.nasa.gov/humans-in-space/the-propulsion-were-supplying-its-electrifying/");
  }, []);

  // Function to handle the table component selections
  const handleComponentSelection = (componentId) => {
    setSelectedComponents(prevSelectedComponents => [...prevSelectedComponents, componentId]);
  };

  // Object containing the table components for each chapter 3 section
 const tableComponents = {
    'Summary of Propulsion Technologies Surveyed': <PropulsionSummaryProviderTable />,
    'Hydrazine Chemical Propulsion': <HydrazineProviderTable />,
    'Alternative Monopropellant and Bipropellant Propulsion': <PropellantProviderTable />,
    'Hybrid Chemical Propulsion': <HybridProviderTable />,
    'Cold Gas Propulsion': <ColdGasProviderTable />,
    'Solid Motor Chemical Propulsion': <SolidMotorProviderTable />,
    'Electrothermal Electric Propulsion': <ElectrothermalProviderTable />,
    'Electrospray Electric Propulsion': <ElectrosprayProviderTable />,
    'Gridded-Ion Electric Propulsion': <GriddedIonProviderTable />,
    'Hall-Effect Electric Propulsion Thrusters': <HallEffectProviderTable />,
    'Pulsed Plasma and Vacuum Arc Electric Propulsion': <PlasmaProviderTable />,
    'Ambipolar Electric Propulsion': <AmbipolarProviderTable />,
    'Propellant-less Propulsion': <PropellantLessProviderTable />,
  }; 

  return (
    <PropulsionSummaryProvider>
      <HydrazineProvider>
        <PropellantProvider>
          <HybridProvider>
            <ColdGasProvider>
              <SolidMotorProvider>
                <ElectrothermalProvider>
                  <ElectrosprayProvider>
                    <GriddedIonProvider>
                      <HallEffectProvider>
                        <PlasmaProvider>
                          <AmbipolarProvider>
                            <PropellantLessProvider>

                              <div className={styles.inSpacePropulsion}>
                                <div className={styles.modulepagesheader}>
                                  <img
                                    className={styles.sotaapplogoIcon}
                                    alt=""
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
                                <div className={styles.propulsionintroframe}>
                                  <img
                                    className={styles.capstoneimageIcon}
                                    alt=""
                                    src="/capstoneImage.png"
                                  />
                                  <b className={styles.inSpacePropulsionTitle}>In-Space Propulsion</b>
                                </div>
                                <div className={styles.propulsiondescriptionframe}>
                                  <b className={styles.propulsionContainer}>
                                    <span> Propulsion - </span>
                                    <span className={styles.althoughAMix}>
                                      Although a mix of small spacecraft propulsion devices have
                                      established flight heritage, the market for new propulsion products
                                      continues to prove dynamic and evolving. In some instances, systems
                                      and components with past flight heritage are being reconsidered to
                                      meet the needs of smaller spacecraft. This approach minimizes new
                                      product development risk and time to market by creating devices
                                      similar to those with existing spaceflight heritage, although
                                      accounting for small spacecraft volume, mass, power, safety and cost
                                      considerations. Such incremental advancement benefits from existing
                                      spaceflight data, physics-based models, and customer acceptance of
                                      the heritage technologies, which eases mission infusion. In other
                                      instances, novel technologies are being conceived specifically for
                                      small spacecraft using innovative approaches to propulsion system
                                      design, manufacturing, and integration.
                                    </span>
                                  </b>
                                </div>
                                <div className={styles.pmidescriptionframe}>
                                  <b className={styles.moduleContainer}>
                                    <p className={styles.module}>
                                      This module avoids a direct technology maturity assessment (TMA)
                                      based on the NASA Technology Readiness Level (TRL) scale,
                                      recognizing insufficient in-depth technical insight into current
                                      propulsion devices to perform such an assessment accurately and
                                      uniformly. Rather than attempting to assess TRL in the absence of
                                      sufficient data, this module introduces a novel classification
                                      system that simply recognizes Progress toward Mission Infusion (PMI)
                                      as an early indicator of the efficacy of the manufacturers’ approach
                                      to system maturation and mission infusion. This is a classification
                                      system first introduced in the S3VI Small Spacecraft Technology
                                      State-of-the-Art Report.
                                    </p>
                                  </b>
                                </div>
                                <div className={styles.pmidecriptionimageframe}>
                                  <img
                                    className={styles.propulsionpmimageIcon}
                                    alt=""
                                    src="/propulsionImage.png"
                                  />
                                </div>
                                <div className={styles.inspacepropulsiontypesframe}>
                                  <b className={styles.inSpacePropulsionTypes}>
                                    In-Space Propulsion Types
                                  </b>
                                  <div className={styles.inspacepropulsiontypestable} />
                                </div>
                                <div className={styles.inspacepropulsionimagevidframe}>
                                  <div className={styles.propulsionframefive}>
                                    <b className={styles.nearEarthAsteroid}>
                                      Near Earth Asteroid Scout Satellite Video robotic reconnaissance
                                    </b>
                                    <div className={styles.propulsionfivevidframe}>
                                      <VideoPlayer videoSrc={video2} className={styles.videoPlayer} />
                                    </div>
                                  </div>
                                  <div
                                    className={styles.propulsionframefour}
                                    onClick={onPropulsionFrameFourContainerClick}
                                  >
                                    <img
                                      className={styles.propulsionfourimageframeIcon}
                                      alt=""
                                      src="/propulsionFourImageFrame.png"
                                    />
                                    <b className={styles.powerAndPropulsion}>
                                      Power and Propulsion [NASA+]
                                    </b>
                                  </div>
                                  <div
                                    className={styles.propulsionframethree}
                                    onClick={onPropulsionFrameThreeContainerClick}
                                  >
                                    <b className={styles.inSpaceElectricPropulsion}>
                                      In-Space Electric Propulsion [NASA Article]
                                    </b>
                                    <img
                                      className={styles.propulsionthreeimageframeIcon}
                                      alt=""
                                      src="/propulsionThreeImageFrame.png"
                                    />
                                  </div>
                                  <div className={styles.propulsionframetwo}>
                                    <b className={styles.smallSpacecraftInSpace}>
                                      Small Spacecraft in-space propulsion
                                    </b>
                                    <img
                                      className={styles.propulsiontwoimageframeIcon}
                                      alt=""
                                      src="/propulsionTwoImageFrame.png"
                                    />
                                  </div>
                                  <div className={styles.propulsionframeone}>
                                    <b className={styles.dartPropulsionTest}>
                                      DART Propulsion Test
                                    </b>
                                    <div className={styles.dartonevidframe}>
                                      <VideoPlayer videoSrc={video1} className={styles.videoPlayer} />
                                    </div>
                                  </div>
                                </div>
                                <h2>Summary of Propulsion Technologies Surveyed</h2>
                                <PropulsionSummaryProviderTable onSelect={handleComponentSelection} />
                                <h2>Hydrazine Chemical Propulsion</h2>
                                <HydrazineProviderTable onSelect={handleComponentSelection} />
                                <h2>Alternative Monopropellant and Bipropellant Propulsion</h2>
                                <PropellantProviderTable onSelect={handleComponentSelection} />
                                <h2>Hybrid Chemical Propulsion</h2>
                                <HybridProviderTable onSelect={handleComponentSelection} />
                                <h2>Cold Gas Propulsion</h2>
                                <ColdGasProviderTable onSelect={handleComponentSelection} />
                                <h2>Solid Motor Chemical Propulsion</h2>
                                <SolidMotorProviderTable onSelect={handleComponentSelection} />
                                <h2>Electrothermal Electric Propulsion</h2>
                                <ElectrothermalProviderTable onSelect={handleComponentSelection} />
                                <h2>Electrospray Electric Propulsion</h2>
                                <ElectrosprayProviderTable onSelect={handleComponentSelection} />
                                <h2>Gridded-Ion Electric Propulsion</h2>
                                <GriddedIonProviderTable onSelect={handleComponentSelection} />
                                <h2>Hall-Effect Electric Propulsion Thrusters</h2>
                                <HallEffectProviderTable onSelect={handleComponentSelection} />
                                <h2>Pulsed Plasma and Vacuum Arc Electric Propulsion</h2>
                                <PlasmaProviderTable onSelect={handleComponentSelection} />
                                <h2>Ambipolar Electric Propulsion</h2>
                                <AmbipolarProviderTable onSelect={handleComponentSelection} />
                                <h2>Propellant-less Propulsion</h2>
                                <PropellantLessProviderTable onSelect={handleComponentSelection} />

                              </div>

                            </PropellantLessProvider>
                          </AmbipolarProvider>
                        </PlasmaProvider>
                      </HallEffectProvider>
                    </GriddedIonProvider>
                  </ElectrosprayProvider>
                </ElectrothermalProvider>
              </SolidMotorProvider>
            </ColdGasProvider>
          </HybridProvider>
        </PropellantProvider>
      </HydrazineProvider>
    </PropulsionSummaryProvider>
  );
};

export default InSpacePropulsion;
