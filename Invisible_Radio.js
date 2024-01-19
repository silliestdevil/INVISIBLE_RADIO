// Parabolic anetnna 
let myModel;
let modelX = 0;
let modelY = 150;
let modelZ = 0;
let rotation1X = 0; 
let rotation1Y = 0;  
let rotation1Z = 0;  
let rotationAngleX = 0;
let rotationAngleY = 0;
let rotationSpeed = 0.01;
//radio 
let radioPlayer;
let currentStation = '';
//volume
let volumeControl;
let amp;
let newVolume;
let stopButton;
let volume;
//API Geocoding and CSV population data
let cityDistrict; 
let data;
let pops;
let index;
let population;

let mousePressed = false;

window.onload = () => {
  //ref: https://www.youtube.com/watch?v=J_hHYKu6rpo
  // Check if the Geolocation API is available
  if ('geolocation' in navigator) {
      // Ask for location access
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
          if (permissionStatus.state === 'granted') {
              // Geolocation permission granted, proceed with getting the current position
              navigator.geolocation.getCurrentPosition(position => {
                  const { latitude, longitude } = position.coords;

                  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

                  fetch(url)
                      .then(res => res.json())//convert to json data
                      .then(data => {
                        console.table(data.address); //The whole address 
                        cityDistrict = data.address.city_district; //just the city district
                        console.log('API =', cityDistrict);

                        preload();
          
                      })
                      .catch(() => {
                          console.log("Error fetching data from API");
                      });
              });
          } else if (permissionStatus.state === 'prompt') {
              // The user will be prompted to allow location access
              console.log("Waiting for location permission...");
          } else {
              // Geolocation permission denied
              console.log("Geolocation permission denied");
          }
      });
  } else {
      console.log("Geolocation is not supported by your browser");
  }};

  function preload() {
    myModel = loadModel('Assets/anteni.obj'); //load the model 
    textur = loadImage('Assets/black.png');//load the texture (fill)
    data = loadTable('populationdata.csv','csv','header', processData);// load CSV data on population density
    // data ref:https://en.wikipedia.org/wiki/List_of_English_districts_by_population_density

  }

function processData(table) {
  console.log('Data =', table); // process CSV data
  let districts = table.getColumn('district'); // district referring to city district
  pops = table.getColumn('pop'); // pop referring to population density per square meter
  console.log(districts);

  let population; 
  // Check if cityDistrict is in the list of districts
  index = districts.indexOf(cityDistrict);
  if (index !== -1) {
    console.log(`${cityDistrict} found in the data`);
    population = console.log(`${pops[index]}`);//check the population density against the city district
    population = pops[index];
    setVolume(population); //set the volume based on the City Districts population data
  } else {
    console.log(`${cityDistrict} not found in the data`);
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // main canvas with 3D model,  Help function 
  extraCanvas = createGraphics(300,100); //canvas displaying selected radio station
  extraCanvas.background (0);
  locationCanvas = createGraphics(400,250); // canvas displaying location, population and volume 
  locationCanvas.background(0); 
  switchCanvas = createGraphics(100,200);//canvas displaying stop button
  switchCanvas.background( 0); 
  wireCanvas = createGraphics(100,200);//canvas displaying part of wire
  wireCanvas.background(0);
  wireCanvas2 = createGraphics(300,100);//canvas displaying part of wire
  wireCanvas2.background(0);

//radio station ref: https://github.com/IrtizaNasar/CCI-Diploma23-CreativeCoding/tree/main/week%2007/examples/webradio-p5
radioPlayer = select("#radioPlayer");
radioPlayer.elt.addEventListener('play', () => { isLoading = true; });
radioPlayer.elt.addEventListener('playing', () => { isLoading = false; });
}


function playRadioStation(url, stationName) {
  if (radioPlayer.elt.src !== url) {
      radioPlayer.elt.src = url;
      radioPlayer.elt.load(); // reload audio to apply new source
      currentStation = stationName; // Update the current station
  }
  radioPlayer.elt.play();
}


function draw() {
  background(0);
  image(extraCanvas, -545, -200); //display canvas'
  image(locationCanvas, -550, -50); 
  image(switchCanvas, 350, -100); 
  image(wireCanvas, 320, 20); 
  image(wireCanvas2, 20, 150); 

  extraCanvas.textSize(28); //extra Canvas settings
  extraCanvas.textFont('courier'); 
  extraCanvas.fill(225); 


  // set the position of the Parabolic anetnna model
  translate(modelX, modelY, modelZ);


  rotateX(PI);  // Invert the rotation on the X-axis as model originally displays upside down 

  let rotationY = (map(mouseX, 0, width, -PI, PI));
  rotateY(rotationY); //The rotation of the Parabolic anetnna on the Y axis is mouse controlled

  wireCanvas.fill(0) //First part of wire settings
  wireCanvas.stroke(225)
  wireCanvas.strokeWeight(2);
  wireCanvas.curve( 10,-1000, 60, 0, 0 ,190,100, 10); //the wire is draw through a curve
  
  wireCanvas2.fill(0) //Second part of wire settings (they are seperate as it was easier to draw shape of curve)
  wireCanvas2.stroke(225)
  wireCanvas2.strokeWeight(2);
  wireCanvas2.curve(1000, 150, 10, 20, 300, 60, 300, 100);//the wire is draw through a curve
  
  extraCanvas.text("RADIO STATION:", 0, 30);//text displaying radi station
  if (mouseIsPressed && rotationY > -2 && rotationY < -1) { // if model rotation on Y axis is between -2 and - 1
      playRadioStation("https://stream-mixtape-geo.ntslive.net/mixtape22", 'NTS RAP'); // click to play NTS RAP 
      
      extraCanvas.background(0);
      extraCanvas.text(currentStation, 0, 60);  
  } 


    
  if (mouseIsPressed && rotationY > 0 && rotationY < 1) {// if model rotation on Y axis is between 0 and 1
    playRadioStation("https://stream-relay-geo.ntslive.net/stream", 'NTS 1'); // click to play NTS 1 
    extraCanvas.background(0);
    extraCanvas.text(currentStation, 0, 60);  
}

if (mouseIsPressed && rotationY > 2 && rotationY < 3) {// if model rotation on Y axis is between 2 and 3
  playRadioStation("https://stream-relay-geo.ntslive.net/stream2", 'NTS 2'); // click to play NTS 2
  extraCanvas.background(0);
  extraCanvas.text(currentStation, 0, 60);  //each of the station declares the background before the text so the text clears and doesn't overlay
}
  
  // Set the rotation of the model
  rotateX(rotation1X);
  rotateY(rotationAngleY);
  rotateZ(rotation1Z);
//settings of the model 
  scale(17);
  strokeWeight(0.5);
  stroke(255);//so it has an outline
  texture(textur);//apply the texture
//display the model 
  model(myModel);
  
  //the switch has a background of a rectangle with the button placed on top - this makes it look like a button
  switchCanvas.rect(10,20,50,100);
  switchCanvas.fill(225);
  switchCanvas.stroke(129);
  switchCanvas.strokeWeight(2);
  
  let stopButton = createButton('STOP'); // to stop radio 
  //to make the button a red square
  stopButton.style('height: 30px; width: 30px')
  stopButton.style('color: rgb(255, 255, 255, 0);')
  stopButton.style('background-color: rgb(88, 21, 21);')
  stopButton.style('border-color: rgb(44, 21,21);') 

  stopButton.mousePressed(stopRadio); //stop Radio function when mouse is pressed
  mousePressed = !mousePressed;
  if (mouseIsPressed) {
    mousePressed = true; 
    stopButton.style('background-colour: rgb')
    switchCanvas.fill(225);
  } else {
    stopButton.position(994, 257);
  }

 
      
   let helpButton = createButton('?'); // instructions to help navigate how the web radio works 
   helpButton.position(70, 450);
   helpButton.style('background-color: rgb(0,0,0);')
   helpButton.style('color: rgb(255, 255, 255);')
   helpButton.style('fontSize: 30px;')
   helpButton.style('height: 60px; width: 60px')
   helpButton.style('display: block;')
   helpButton.style('border: none;')
   helpButton.style('font-family:Cambria, Cochin, Georgia, Times, serif;')
  //the help buttons instructions are created through an alert
   helpButton.mousePressed(function() {
    alert('Welcome to Web Radio.                                                                                                                                             PRESS OK for INSTRUCTIONS')                                                                                                                       
    alert('To PLAY the RADIO STATION navigate the parabolic antenna with your MOUSE and CLICK to select station. PRESS the red button to STOP the radio.                                                                                                  Your VOLUME is based off your current locations population density per square meter; this helps control noise pollution in your area.')});

  }
    
// set the volume based on the population density in the area
    function setVolume(population) {
      const lowest = 2000; // the lowest population density per square kilometer
      const highest = 16000; // the highest
    
      // the population of the area defines the volumes level 
      const ratio = map(population, lowest, highest, 0.0, 1.0); // map the ratio to lowest and highest volume
      const constrainedRatio = constrain(ratio, 0.0, 1.0); // constrain the ratio between 0.0 and 1.0
      const newVolume = constrainedRatio; // use this ratio to map volume
    
      radioPlayer.volume = newVolume; // make newVolume the actual volume
      console.log('VolumePop =', newVolume); 

      //text displaying data information 
      locationCanvas.textFont('courier'); 
      locationCanvas.textSize(17);
      locationCanvas.fill(225);
        if (cityDistrict) { // while its collecting both the API and CSV data it displays "fetching"
        locationCanvas.background(0);
        locationCanvas.text("Location:", 10, 20); // current district location 
        locationCanvas.text("Population Density:", 10, 60); // the population density of that district
        locationCanvas.text("Volume:", 10, 120); // the volume thats been calculated as a result of that 
      } else {
        locationCanvas.background(0);
        locationCanvas.text("Fetching location...", 10, 20); // untill the is presented on the interface itll display that its fetching 
        locationCanvas.text("Fetching population density...", 10, 60);
        locationCanvas.text("Fetching volume...", 10, 120);
      }
      locationCanvas.textSize(15);
      locationCanvas.text(`${cityDistrict}`, 10, 40); //the city district
      locationCanvas.text(`${pops[index]} per Square Kilometer`, 10, 80); //the population density 
      var roundedVolume = Math.ceil(newVolume *100)//the volume is then rounded up  
      locationCanvas.text(roundedVolume + ' Percent', 10, 140); // volume 
  
    }

    function stopRadio() { // stop the radio from playing 
      radioPlayer.elt.pause();
      radioPlayer.elt.src = ''; // clear the audio source
      loadingMessage.style('display', 'none');
      currentStation = ''; // Clear the current station
      stopButton.position(994, 247);
      switchCanvas.fill(225);
    }







