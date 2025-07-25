import React, {useState, useEffect} from 'react';

import { ClientMessage } from '../Context'

import { motion } from "framer-motion";

import './App.scss'

const App = () => {
  const [SelectVehicleList, setSelectVehicleList] = useState({VehModel:'', VehText: '', plate:''});
  const [isVehicleList, setVehicleList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [UIName, setUIName] = useState('EYES STORE');
  const [isPage, setPage] = useState(1);
  const [InGarage, setInGarage] = useState(1);
  const [SelectState, setSelectState] = useState(false);
  const [Price, setPrice] = useState(0);
  const [VehStats, setVehStats] = useState({Fuel: 0, Speed: 0, Traction: 0});

  const VehicleInfo = (data) => {
    setPage(2)
    new Promise(function () {
      const https = new XMLHttpRequest();
      https.open("POST", `https://es_garagev2/VehicleInfo`);
      https.send(JSON.stringify({ data: data }));
      https.onload = function() {
        setVehStats(JSON.parse(this.response));
      };
    });
  }

  const VehStatsSVG = (data) => {
    if (data < 20) {
      return (
        <>
          <rect x="0.9375" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect opacity="0.2" x="27.8828" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
          <rect opacity="0.2" x="54.8262" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
          <rect opacity="0.2" x="81.7715" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
          <rect opacity="0.2" x="108.715" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
        </>
      )
    } else if (data < 40) {
      return (
        <>
          <rect x="0.9375" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="27.8828" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect opacity="0.2" x="54.8262" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
          <rect opacity="0.2" x="81.7715" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
          <rect opacity="0.2" x="108.715" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
        </>
      )
    } else if (data < 60) {
      return (
        <>
          <rect x="0.9375" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="27.8828" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="54.8262" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect opacity="0.2" x="81.7715" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
          <rect opacity="0.2" x="108.715" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
        </>
      )
    } else if (data < 80) {
      return (
        <>
          <rect x="0.9375" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="27.8828" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="54.8262" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="81.7715" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect opacity="0.2" x="108.715" width="1.443rem" height="0.241rem" rx="1.9246" fill="white"/>
        </>
      )
    } else if (data > 80) {
      return (
        <>
          <rect x="0.9375" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="27.8828" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="54.8262" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="81.7715" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
          <rect x="108.715" width="1.443rem" height="0.241rem" rx="1.9246" fill="#59ACFF"/>
        </>
      )
    }
  }

  let holding = false
  useEffect(() => {
      const SendNUIMessage = (event) => {
        const { action, data } = event.data;
        if (action === 'setOpen') {
          setOpen(true)
          setPage(1)
          setUIName(data.setName)
          setVehicleList(data.setVeh)
          setfilterData(data.setVeh)
          setInGarage(data.inGarage)
          setPrice(data.Price)
        } else if (action === 'Close') {
          ClientMessage("Close")
          setOpen(false)
          setPage(1)
        }
      }

      const SendNUIKeydown = (event) => {
        if (event.keyCode === 27) {
          ClientMessage("Close")
          setOpen(false)
          setPage(1)
        }
      }

      let direction = "", oldx = 0
      const NUIMouseMove = (e) => {
        if (e.pageX < oldx) { direction = "left" } else if (e.pageX > oldx) { direction = "right" }
        oldx = e.pageX;
        if (direction == "left" && holding) {
          if (e.target.classList.contains("move")) {
            ClientMessage("rotateright")
          }
        }
        if (direction == "right" && holding) {
          if (e.target.classList.contains("move")) {
            ClientMessage("rotateleft")
          }
        }
      }
      window.addEventListener("message", SendNUIMessage);
      window.addEventListener('keydown', SendNUIKeydown);
      document.addEventListener('mousemove', NUIMouseMove);
      document.addEventListener('mousedown', (e) => holding = true)
      document.addEventListener('mouseup', (e) => holding = false)
    return () => {
      window.removeEventListener("message", SendNUIMessage);
      window.removeEventListener('keydown', SendNUIKeydown);
      document.removeEventListener('mousemove', NUIMouseMove);
    }
  });

  const [filterData, setfilterData] = useState(isVehicleList);

  const Filter = (event) => {
    const updatedList = isVehicleList.filter((item) => {
      return (
        item.VehModel.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      );
    });
    setfilterData(updatedList);
  };

  return (
    <motion.div className="Main" animate={isOpen ? { opacity:1 } : { opacity:0 } }>

          <div className="move"></div>

          <div className="Label1">{UIName}</div>
          <div className="Label2">GARAGE</div>


          <motion.div className="Page1" animate={(isPage === 1) ? { opacity: 1 } : { opacity: 0 } }>
            <div className="input">
                <svg className='InputSVG' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.0357 11.3725L10.0125 8.34929C10.4838 7.57574 10.7324 6.6871 10.7309 5.78129C10.7309 3.04769 8.36209 0.679688 5.62849 0.679688C4.97857 0.679582 4.335 0.807515 3.73454 1.05618C3.13408 1.30484 2.58848 1.66936 2.12892 2.12892C1.66936 2.58848 1.30484 3.13408 1.05618 3.73454C0.807515 4.335 0.679582 4.97857 0.679688 5.62849C0.679688 8.36129 3.04849 10.7301 5.78129 10.7301C6.65725 10.7309 7.51754 10.4978 8.27329 10.0549L11.3125 13.0957C11.4554 13.2382 11.649 13.3183 11.8509 13.3183C12.0527 13.3183 12.2464 13.2382 12.3893 13.0957L13.1437 12.3413C13.4405 12.0445 13.3325 11.6693 13.0357 11.3725ZM2.20289 5.62849C2.20278 5.17856 2.29131 4.73303 2.46342 4.31732C2.63552 3.90162 2.88783 3.52389 3.20594 3.20571C3.52405 2.88752 3.90172 2.63512 4.31738 2.46292C4.73305 2.29072 5.17856 2.20209 5.62849 2.20209C7.52129 2.20209 9.20769 3.88769 9.20769 5.78129C9.20748 6.68996 8.84641 7.56136 8.20388 8.20388C7.56136 8.84641 6.68996 9.20748 5.78129 9.20769C3.88849 9.20689 2.20289 7.52049 2.20289 5.62849V5.62849Z" fill="#F8F8F8"/>
                </svg>
                <input type="text" onChange={Filter} placeholder='Type car name here ...' required/>
              </div>

              <motion.div className="Total" onClick={() => setSelectState(true)} animate={SelectState ? {borderBottom:'.2rem solid #59ACFF', height:'1.5rem'} : {borderBottom:'.0rem solid #59acff00', height:'1.7rem'}}>
                <div className="Label">Total:</div>
                <p><span>{isVehicleList.length}</span>/60</p>
              </motion.div>
              <motion.div className="InGarage" onClick={() => setSelectState(false)} animate={SelectState ? {borderBottom:'0 solid #59acff00', height:'1.7rem'} : {borderBottom:'.2rem solid #59ACFF', height:'1.5rem'}}>
                <div className="Label">in garage:</div>
                <p><span>{InGarage}</span>/60</p>
              </motion.div>
              <div className="List">

                {filterData.map((data, index) => { 
                  if (!SelectState && data.state === 1) { return (
                    <motion.div className="Vehicle" initial={{opacity: 0, scale:.4}} animate={{opacity: 1, scale:1}} onClick={() => {
                      VehicleInfo(data)
                      setSelectVehicleList(data)
                      }}>
                      <div className="VehName"><p>{data.VehModel}</p></div>
                      <div className="VehClass"><p>{data.VehText}</p></div>
                      <div className="Select"></div>
                      <div className="Image" style={{backgroundImage: 'url(/resources/images/'+data.VehModel+'.png)'}}></div>
                      <svg className='ImgBackground' width="204" height="87" viewBox="0 0 204 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.4" filter="url(#filter0_f_172_6395)">
                          <path d="M179 26.9991C179 32.522 146.66 55.9992 108 55.9992C69.3401 55.9992 25.5 65.522 25.5 59.9991C25.5 54.4763 69.3401 35.9992 108 35.9992C146.66 35.9992 179 21.4763 179 26.9991Z" fill="#59ACFF"/>
                        </g>
                        <defs>
                          <filter id="filter0_f_172_6395" x="0.5" y="0.746094" width="203.5" height="85.9766" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feGaussianBlur stdDeviation="12.5" result="effect1_foregroundBlur_172_6395"/>
                          </filter>
                        </defs>
                      </svg>
                    </motion.div>
                  )} else if (SelectState) { return (
                    <motion.div className="Vehicle" transition={{duration:.32}} initial={{opacity: 0, scale:.4}} animate={{opacity: 1, scale:1}} onClick={(data.state === 1 || data.state === 2) ? () => {
                      VehicleInfo(data)
                      setSelectVehicleList(data)
                    } : null}>
                      <div className="VehName"><p>{data.VehModel}</p></div>
                      <div className="VehClass"><p>{data.VehText}</p></div>
                      <div className="Select" style={(data.state === 1 || data.state === 2) ? { background: '#59ACFF' } : { background: '#c01010' }}></div>
                      <div className="Image" style={{backgroundImage: 'url(/resources/images/'+data.VehModel+'.png)'}}></div>
                      <svg className='ImgBackground' width="204" height="87" viewBox="0 0 204 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.4" filter="url(#filter0_f_172_6395)">
                          <path d="M179 26.9991C179 32.522 146.66 55.9992 108 55.9992C69.3401 55.9992 25.5 65.522 25.5 59.9991C25.5 54.4763 69.3401 35.9992 108 35.9992C146.66 35.9992 179 21.4763 179 26.9991Z" fill="#59ACFF"/>
                        </g>
                        <defs>
                          <filter id="filter0_f_172_6395" x="0.5" y="0.746094" width="203.5" height="85.9766" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feGaussianBlur stdDeviation="12.5" result="effect1_foregroundBlur_172_6395"/>
                          </filter>
                        </defs>
                      </svg>
                    </motion.div>
                  )}
                
                }
                )}

              </div>
          </motion.div>

          <motion.div className="Page2" animate={(isPage === 2) ? { opacity: 1 } : { opacity: 0 } }>
            <div div className="BackPage" onClick={() => {
               ClientMessage("BackPage")
               setPage(1)
            }}>
                <p>Go back</p>
                <svg style={{position: 'absolute',top:'.45rem', left:'.3rem'}} width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.89961 2.25078L2.64961 6.50078L6.89961 10.7508L6.04961 12.4508L0.0996094 6.50078L6.04961 0.550781L6.89961 2.25078Z" fill="#59ACFF"/>
                </svg>
            </div>

            <div className="SelectBox">
                <div className="Vehicle">
                  <div className="VehName"><p>{SelectVehicleList.VehModel}</p></div>
                  <div className="VehClass"><p>{SelectVehicleList.VehText}</p></div>
                  <div className="Image" style={(SelectVehicleList.VehModel === '') ?{backgroundImage: 'url(https://cdn.discordapp.com/attachments/969012565088809010/992397661686743051/image.png)'} : {backgroundImage: 'url(/resources/images/'+SelectVehicleList.VehModel+'.png)'}}></div>
                  <svg className='ImgBackground' width="204" height="87" viewBox="0 0 204 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.4" filter="url(#filter0_f_172_6395)">
                      <path d="M179 26.9991C179 32.522 146.66 55.9992 108 55.9992C69.3401 55.9992 25.5 65.522 25.5 59.9991C25.5 54.4763 69.3401 35.9992 108 35.9992C146.66 35.9992 179 21.4763 179 26.9991Z" fill="#59ACFF"/>
                    </g>
                    <defs>
                      <filter id="filter0_f_172_6395" x="0.5" y="0.746094" width="203.5" height="85.9766" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="12.5" result="effect1_foregroundBlur_172_6395"/>
                      </filter>
                    </defs>
                  </svg>
                </div>


                <div className="VehInfo">
                  <div className="Header">Max speed:</div>
                  <div className="Label">{Math.ceil(VehStats.Speed)} KM/H</div>
                  <svg className='Image' width=".813rem" height=".625rem" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.15811 1.55078C6.2602 1.55078 6.3581 1.59134 6.43029 1.66352C6.50248 1.73571 6.54303 1.83361 6.54303 1.9357V3.09046C6.54303 3.19255 6.50248 3.29046 6.43029 3.36264C6.3581 3.43483 6.2602 3.47538 6.15811 3.47538C6.05602 3.47538 5.95812 3.43483 5.88593 3.36264C5.81374 3.29046 5.77319 3.19255 5.77319 3.09046V1.9357C5.77319 1.83361 5.81374 1.73571 5.88593 1.66352C5.95812 1.59134 6.05602 1.55078 6.15811 1.55078ZM2.87243 2.88415C2.94461 2.81198 3.0425 2.77145 3.14457 2.77145C3.24663 2.77145 3.34452 2.81198 3.41671 2.88415L4.12111 3.58778C4.1569 3.62357 4.18529 3.66606 4.20466 3.71282C4.22402 3.75958 4.23399 3.80969 4.23399 3.86031C4.23399 3.91092 4.22402 3.96103 4.20466 4.00779C4.18529 4.05455 4.1569 4.09704 4.12111 4.13283C4.08532 4.16862 4.04283 4.19701 3.99608 4.21637C3.94932 4.23574 3.8992 4.24571 3.84859 4.24571C3.79797 4.24571 3.74786 4.23574 3.7011 4.21637C3.65434 4.19701 3.61185 4.16862 3.57606 4.13283L2.87243 3.42842C2.80027 3.35624 2.75973 3.25835 2.75973 3.15629C2.75973 3.05422 2.80027 2.95633 2.87243 2.88415ZM1.53906 6.16983C1.53906 6.06774 1.57962 5.96984 1.6518 5.89765C1.72399 5.82546 1.8219 5.78491 1.92398 5.78491H3.14495C3.24704 5.78491 3.34494 5.82546 3.41713 5.89765C3.48932 5.96984 3.52987 6.06774 3.52987 6.16983C3.52987 6.27192 3.48932 6.36982 3.41713 6.44201C3.34494 6.5142 3.24704 6.55475 3.14495 6.55475H1.92398C1.8219 6.55475 1.72399 6.5142 1.6518 6.44201C1.57962 6.36982 1.53906 6.27192 1.53906 6.16983ZM8.85255 6.16983C8.85255 6.06774 8.89311 5.96984 8.96529 5.89765C9.03748 5.82546 9.13539 5.78491 9.23747 5.78491H10.3922C10.4943 5.78491 10.5922 5.82546 10.6644 5.89765C10.7366 5.96984 10.7772 6.06774 10.7772 6.16983C10.7772 6.27192 10.7366 6.36982 10.6644 6.44201C10.5922 6.5142 10.4943 6.55475 10.3922 6.55475H9.23747C9.13539 6.55475 9.03748 6.5142 8.96529 6.44201C8.89311 6.36982 8.85255 6.27192 8.85255 6.16983ZM9.43301 2.90108C9.37968 2.84803 9.30834 2.81699 9.23317 2.81414C9.158 2.81129 9.08451 2.83683 9.02731 2.88569L5.80937 5.63864C5.7344 5.70181 5.67351 5.78001 5.63066 5.86819C5.58781 5.95637 5.56395 6.05257 5.56061 6.15055C5.55728 6.24853 5.57455 6.34612 5.6113 6.43701C5.64806 6.5279 5.70348 6.61007 5.77398 6.67819C5.84449 6.74631 5.92851 6.79888 6.02061 6.83249C6.11271 6.8661 6.21083 6.88 6.30865 6.8733C6.40646 6.8666 6.50177 6.83944 6.58843 6.79359C6.67508 6.74773 6.75115 6.6842 6.81171 6.6071L9.45534 3.29909C9.50133 3.24152 9.52448 3.16901 9.52037 3.09544C9.51625 3.02186 9.48515 2.95239 9.43301 2.90031V2.90108Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.08619e-06 6.16883C0.000808855 5.27258 0.197217 4.3873 0.575516 3.57481C0.953815 2.76231 1.50489 2.04217 2.19027 1.46466C2.87565 0.887147 3.67881 0.466184 4.5437 0.231156C5.40858 -0.00387178 6.31434 -0.0473008 7.19774 0.103901C8.08114 0.255103 8.9209 0.597292 9.65839 1.10658C10.3959 1.61587 11.0133 2.27998 11.4676 3.05256C11.9219 3.82513 12.2021 4.68755 12.2887 5.57961C12.3752 6.47167 12.266 7.37187 11.9687 8.21737C11.6285 9.18198 10.5484 9.45066 9.71155 9.17968C8.70614 8.85403 7.29425 8.47835 6.15873 8.47835C5.02399 8.47835 3.61056 8.85403 2.60592 9.17968C1.7691 9.45066 0.689012 9.18198 0.348742 8.21737C0.117129 7.55925 -0.00080019 6.86651 4.08619e-06 6.16883ZM6.15873 0.779936C5.2968 0.779714 4.44738 0.986249 3.68178 1.38221C2.91617 1.77817 2.25672 2.352 1.75876 3.05554C1.2608 3.75908 0.93886 4.5718 0.819967 5.4255C0.701074 6.27919 0.788694 7.14896 1.07547 7.96179C1.23175 8.40445 1.78604 8.63617 2.36881 8.44679C3.385 8.11883 4.89466 7.70851 6.15873 7.70851C7.42281 7.70851 8.93324 8.11806 9.94866 8.44756C10.5314 8.63617 11.0857 8.40445 11.242 7.96179C11.5288 7.14896 11.6164 6.27919 11.4975 5.4255C11.3786 4.5718 11.0567 3.75908 10.5587 3.05554C10.0608 2.352 9.40129 1.77817 8.63569 1.38221C7.87009 0.986249 7.02067 0.779714 6.15873 0.779936Z" fill="white"/>
                  </svg>

                  <svg className="LoadBarSVG" width="8.25rem" height=".25rem" viewBox="0 0 132 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {VehStatsSVG(Math.ceil(VehStats.Speed / 2))}
                  </svg>

                </div>

                <div className="VehInfo">
                  <div className="Header">Fuel consumption:</div>
                  <div className="Label">{VehStats.Fuel}/100 L</div>
                  <svg className='Image' width="0.75rem" height="0.75rem" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6743 4.92613V9.44253C10.6743 9.55143 10.631 9.65586 10.554 9.73286C10.477 9.80986 10.3726 9.85312 10.2637 9.85312C10.1548 9.85312 10.0504 9.80986 9.97337 9.73286C9.89637 9.65586 9.85312 9.55143 9.85312 9.44253V7.80021C9.85312 7.47353 9.72334 7.16023 9.49235 6.92923C9.26135 6.69823 8.94805 6.56846 8.62137 6.56846H7.38962V1.64148C7.38962 1.42369 7.30311 1.21482 7.14911 1.06083C6.99511 0.906828 6.78625 0.820313 6.56846 0.820312H1.64148C1.42369 0.820313 1.21482 0.906828 1.06083 1.06083C0.906828 1.21482 0.820313 1.42369 0.820312 1.64148V10.6743C0.820313 10.8921 0.906828 11.1009 1.06083 11.2549C1.21482 11.4089 1.42369 11.4954 1.64148 11.4954H6.56846C6.78625 11.4954 6.99511 11.4089 7.14911 11.2549C7.30311 11.1009 7.38962 10.8921 7.38962 10.6743V7.38962H8.62137C8.73026 7.38962 8.8347 7.43288 8.9117 7.50988C8.9887 7.58688 9.03195 7.69131 9.03195 7.80021V9.44253C9.03195 9.76921 9.16173 10.0825 9.39272 10.3135C9.62372 10.5445 9.93702 10.6743 10.2637 10.6743C10.5904 10.6743 10.9037 10.5445 11.1347 10.3135C11.3657 10.0825 11.4954 9.76921 11.4954 9.44253V4.10497C11.4954 3.88718 11.4089 3.67832 11.2549 3.52432C11.1009 3.37032 10.8921 3.2838 10.6743 3.2838V2.04385C10.6721 1.93638 10.6279 1.83405 10.5512 1.75882C10.4744 1.68358 10.3712 1.64145 10.2637 1.64148C10.2065 1.64242 10.1501 1.65507 10.098 1.67863C10.0459 1.7022 9.9992 1.73619 9.96073 1.7785C9.92227 1.82082 9.89287 1.87056 9.87436 1.92467C9.85585 1.97878 9.84862 2.03611 9.85312 2.09312V4.10497C9.85312 4.26738 9.90128 4.42614 9.99151 4.56118C10.0817 4.69622 10.21 4.80147 10.36 4.86363C10.5101 4.92578 10.6752 4.94204 10.8345 4.91035C10.9938 4.87867 11.1401 4.80046 11.2549 4.68562C11.3698 4.57078 11.448 4.42446 11.4797 4.26517C11.5114 4.10588 11.4951 3.94077 11.4329 3.79072C11.3708 3.64067 11.2655 3.51243 11.1305 3.4222C10.9955 3.33196 10.8367 3.2838 10.6743 3.2838V4.92613ZM6.56846 5.33671C6.56846 5.44561 6.5252 5.55004 6.4482 5.62704C6.3712 5.70404 6.26677 5.7473 6.15788 5.7473H2.05206C1.94317 5.7473 1.83873 5.70404 1.76173 5.62704C1.68473 5.55004 1.64148 5.44561 1.64148 5.33671V2.87322C1.64148 2.76433 1.68473 2.6599 1.76173 2.5829C1.83873 2.5059 1.94317 2.46264 2.05206 2.46264H6.15788C6.26677 2.46264 6.3712 2.5059 6.4482 2.5829C6.5252 2.6599 6.56846 2.76433 6.56846 2.87322V5.33671Z" fill="white"/>
                  </svg>
                  <svg className="LoadBarSVG" width="8.25rem" height=".25rem" viewBox="0 0 132 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {VehStatsSVG(VehStats.Fuel)}
                  </svg>
                </div>
                
                <div className="VehInfo">
                  <div className="Header">Traction:</div>
                  <div className="Label">{Math.ceil(3 * VehStats.Traction)}</div>
                  <svg className='Image' width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.984753 7.44223C0.984753 7.7988 1.28199 8 1.64857 8C2.01515 8 2.31227 7.79903 2.31227 7.44223V6.67424H6.60021V7.44223C6.60021 7.7988 6.89745 8 7.26379 8C7.6306 8 7.92772 7.79903 7.92772 7.44223V6.53537C8.55872 6.28693 9 5.72971 9 5.08218V4.39877C9 3.67329 8.44605 3.06089 7.6916 2.86938L7.46486 1.63798C7.27512 0.597095 6.53979 0 5.44753 0H3.46831C2.48895 0 1.73844 0.597969 1.46 1.59964L1.22002 2.89436C0.511402 3.10976 0 3.70199 0 4.39863V5.08204C0 5.69907 0.400988 6.23414 0.984686 6.49821L0.984753 7.44223ZM6.92601 4.00598C7.34678 4.00598 7.68781 4.33787 7.68781 4.74744C7.68781 5.15678 7.34681 5.4889 6.92601 5.4889C6.50544 5.4889 6.16432 5.15678 6.16432 4.74744C6.16443 4.33802 6.50544 4.00598 6.92601 4.00598ZM2.34755 1.8142C2.4496 1.4606 2.72895 0.889609 3.46845 0.889609H5.44814C6.10642 0.889609 6.45093 1.16811 6.56499 1.79427L6.75168 2.80652L2.16482 2.80641L2.34755 1.8142ZM1.9425 4.00598C2.36307 4.00598 2.70419 4.33787 2.70419 4.74744C2.7043 5.15678 2.36319 5.4889 1.9425 5.4889C1.52173 5.4889 1.1807 5.15678 1.1807 4.74744C1.1807 4.33802 1.5217 4.00598 1.9425 4.00598Z" fill="white"/>
                  </svg>
                  <svg className="LoadBarSVG" width="8.25rem" height=".25rem" viewBox="0 0 132 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {VehStatsSVG(Math.ceil(3 * VehStats.Traction))}
                  </svg>
                </div>

                <div className="VehInfo">
                  <div className="Header">Acceleration:</div>
                  <div className="Label">{Math.ceil(90 * VehStats.Acceleration)}</div>
                  <svg className='Image' width="0.75rem" height="0.75rem" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.01549 7.89933C0.80918 7.07518 0.794667 6.21532 0.973045 5.3848C1.15142 4.55427 1.51804 3.77476 2.04524 3.10526C2.57244 2.43576 3.24643 1.89381 4.01628 1.52051C4.78613 1.14721 5.63161 0.952367 6.48873 0.950791C7.34585 0.949214 8.19206 1.14094 8.9633 1.51141C9.73454 1.88188 10.4106 2.42135 10.9403 3.08891C11.47 3.75646 11.8395 4.53462 12.021 5.36449C12.2025 6.19435 12.1912 7.05425 11.988 7.87915" stroke="white" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="4.84922" y="8.84922" width="3.33" height="1.23" rx="0.15" stroke="white" stroke-width="0.3"/>
                    <rect x="4.19922" y="2.30078" width="1" height="0.3" rx="0.15" transform="rotate(60 4.19922 2.30078)" fill="white"/>
                    <rect x="9.05078" y="2.44922" width="1" height="0.3" rx="0.15" transform="rotate(120 9.05078 2.44922)" fill="white"/>
                    <rect x="10.4004" y="6.39844" width="1" height="0.3" rx="0.15" fill="white"/>
                    <rect x="1.59961" y="6.39844" width="1" height="0.3" rx="0.15" fill="white"/>
                    <rect x="5.19922" y="7.14844" width="0.6" height="0.3" rx="0.15" transform="rotate(-22.2425 5.19922 7.14844)" fill="white"/>
                    <rect x="3.59961" y="7.60156" width="0.5" height="0.3" rx="0.15" transform="rotate(-96.3077 3.59961 7.60156)" fill="white"/>
                    <rect x="10.3008" y="4.44922" width="0.3" height="0.3" rx="0.15" transform="rotate(-96.3077 10.3008 4.44922)" fill="white"/>
                    <rect x="2.44922" y="4.44922" width="0.3" height="0.3" rx="0.15" transform="rotate(-96.3077 2.44922 4.44922)" fill="white"/>
                    <rect x="6.36914" y="2.17969" width="0.3" height="0.3" rx="0.15" transform="rotate(-96.3077 6.36914 2.17969)" fill="white"/>
                    <path d="M6.42064 4.67223C6.35007 4.71563 6.32805 4.80801 6.37145 4.87858C6.41485 4.94915 6.50723 4.97117 6.5778 4.92777L6.42064 4.67223ZM7.8 4L7.87858 4.12777C7.9206 4.10192 7.94723 4.05707 7.9498 4.0078C7.95236 3.95853 7.93054 3.91115 7.89142 3.88108L7.8 4ZM6.49922 3L6.59064 2.88108C6.54534 2.84626 6.48419 2.84019 6.43294 2.86544C6.38168 2.89069 6.34922 2.94286 6.34922 3H6.49922ZM6.49922 4L6.46284 4.14552C6.50765 4.15672 6.55512 4.14666 6.59153 4.11823C6.62794 4.0898 6.64922 4.04619 6.64922 4H6.49922ZM3.55089 6.47769C3.53857 6.55961 3.59499 6.63601 3.67691 6.64833C3.75883 6.66065 3.83523 6.60423 3.84755 6.52231L3.55089 6.47769ZM6.5778 4.92777L7.87858 4.12777L7.72142 3.87223L6.42064 4.67223L6.5778 4.92777ZM7.89142 3.88108L6.59064 2.88108L6.4078 3.11892L7.70858 4.11892L7.89142 3.88108ZM6.34922 3V4H6.64922V3H6.34922ZM6.5356 3.85448C6.33568 3.8045 6.06878 3.82006 5.785 3.8939C5.49801 3.96856 5.18118 4.10599 4.87736 4.31367C4.26791 4.73027 3.70817 5.43188 3.55089 6.47769L3.84755 6.52231C3.99105 5.56812 4.49797 4.9364 5.04666 4.56133C5.32191 4.37318 5.60702 4.25019 5.86054 4.18423C6.11726 4.11744 6.32942 4.11217 6.46284 4.14552L6.5356 3.85448Z" fill="white"/>
                    <rect x="7.16016" y="6.47656" width="2.89913" height="0.3" rx="0.15" transform="rotate(-18.8623 7.16016 6.47656)" fill="white"/>
                    <circle cx="6.57969" cy="6.79844" r="0.75" stroke="white" stroke-width="0.3"/>
                  </svg>
                  <svg className="LoadBarSVG" width="8.25rem" height=".25rem" viewBox="0 0 132 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {VehStatsSVG(Math.ceil(90 * VehStats.Acceleration))}
                  </svg>
                </div>


                  <div className="Price"><span>$</span>{Price}</div>
                <div className="Plate">
                  <div className="Header">LOS-SANTOS</div>
                  <div className="Text">{SelectVehicleList.plate}</div>
                </div>
                <div className="SelectButton" onClick={() => ClientMessage("SpawnVehicle", JSON.stringify({ Table: SelectVehicleList, Price: Price }))}>SPAWN</div>
            </div>
          </motion.div>



          <div className="Test"></div>

          <svg width="120rem" height="67.5rem" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_172_6370)">
              <rect width="1122" height="1080" fill="url(#paint0_linear_172_6370)"/>
              <rect width="1122" height="1080" fill="url(#paint1_linear_172_6370)"/>
              <g opacity="0.5" filter="url(#filter0_f_172_6370)">
                <rect x="-426" y="865.633" width="651.634" height="545.63" rx="272.815" transform="rotate(-90 -426 865.633)" fill="url(#paint2_linear_172_6370)"/>
              </g>
            </g>
            <defs>
              <filter id="filter0_f_172_6370" x="-926" y="-286" width="1545.63" height="1651.63" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_172_6370"/>
              </filter>
              <linearGradient id="paint0_linear_172_6370" x1="0" y1="540" x2="1122" y2="540" gradientUnits="userSpaceOnUse">
              <stop offset="0.21875"/>
              <stop offset="1" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="paint1_linear_172_6370" x1="0" y1="540" x2="1122" y2="540" gradientUnits="userSpaceOnUse">
              <stop offset="0.21875"/>
              <stop offset="1" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="paint2_linear_172_6370" x1="-426.278" y1="1138.81" x2="225.356" y2="1138.81" gradientUnits="userSpaceOnUse">
              <stop stop-color="#406CDE"/>
              </linearGradient>
              <clipPath id="clip0_172_6370">
              <rect width="1920" height="1080" fill="white"/>
              </clipPath>
            </defs>
          </svg>

    </motion.div>
  );
}
export default App;