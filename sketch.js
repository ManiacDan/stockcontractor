// Stock Contractor Game in p5.js with Bull Scores, Bull Selection, Buck Off, Bull Score-Based Prize Money, Health Recovery, Age in Years and Weeks, Rename, Additional Stats Window, Rival Contractors, Event Results, Top Contractors, and Top Bulls

let currentMode = 'frontPage'; // Start with front page
let frontPageButtons = [];

let gameState = {
  
  
  money: 10000,
  pendingMessage: "", // Add this line
  bulls: [
    { 
      name: "Thunderbolt", 
      overallRating: 80, 
      health: 100, 
      value: 5000, 
      scores: [], 
      buckOffs: [], 
      rested: true, 
      ageWeeks: 260, 
      weight: 1800, 
      eventsCompleted: 0, 
      color: "Black",
      chuteTemperament: 70,
      yearlyScores: []
    },
    { 
      name: "Raging Storm", 
      overallRating: 65, 
      health: 85, 
      value: 3000, 
      scores: [], 
      buckOffs: [], 
      rested: true, 
      ageWeeks: 260, 
      weight: 1650, 
      eventsCompleted: 0, 
      color: "Red",
      chuteTemperament: 60,
      yearlyScores: []
    }
  ],
  week: 1,
  events: [],
  lastEventResults: null,
  message: "Welcome! Manage your bulls and grow your stock contracting business.",
  selectingBull: false,
  renamingBull: false,
  selectedBull: null,
  sellingBull: false,
  sellBullIndex: null,
  contractorName: "",
  showingLegends: false,
  showingMarket: false,
  showingAchievements: false,
  showingEventResults: false,
  showingTopContractors: false,
  showingTopBulls: false,
  showingTraining: false,
  trainingBullIndex: null,
  selectedAnimationBull: null,
  achievements: {
    topAvgScore: { value: 0, bullName: "", eventsCompleted: 0 },
    topBuckOffPct: { value: 0, bullName: "", eventsCompleted: 0 },
    highestBullScore: { value: 0, bullName: "", riderName: "", eventName: "", eventsCompleted: 0 },
    fastestBuckOff: { value: 8.0, bullName: "", riderName: "", eventName: "", eventsCompleted: 0 }
  },
  rivals: [
    { name: "D&H Cattle", bulls: [] },
    { name: "McCoy Rodeo", bulls: [] },
    { name: "Blake Sharp", bulls: [] },
    { name: "Gene Owen", bulls: [] },
    { name: "Chad Berger", bulls: [] }
  ],
  yearlyBullScores: {
    player: [],
    rivals: {
      "D&H Cattle": [],
      "McCoy Rodeo": [],
      "Blake Sharp": [],
      "Gene Owen": [],
      "Chad Berger": []
    }
  },
   showingSaveConfirm: false,
  showingNewGameConfirm: false
};

// Animation variables
let animationWindow;
let showingAnimation = false;
let animationStartTime = 0;
let buckOffTime = null; // Null if ride completes, otherwise time of buck-off
let animationBullColor = "Black";
let animationRiderName = "";
let animationEventName = "";
let animationTorsoColor; // New global variable for torso color

const eventSchedule = [
  { name: "Velocity Tour - Portland, OR", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Tucson, AZ", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Birmingham, AL", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Ontario, CA", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Denver, CO", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - St. Louis, MO", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Charleston, WV", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Wichita, KS", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Bakersfield, CA", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Manchester, NH", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Tulsa, OK", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Albany, NY", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Youngstown, OH", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - New York City, NY", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Memphis, TN", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Chicago, IL", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Reno, NV", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Houston, TX", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Bridgeport, CT", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Pittsburgh, PA", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Bangor, ME", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Sacramento, CA", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Lexington, KY", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Salt Lake City, UT", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Tallahassee, FL", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Indianapolis, IN", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Knoxville, TN", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Jacksonville, FL", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Laredo, TX", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Milwaukee, WI", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Everett, WA", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Little Rock, AR", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - North Charleston, SC", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Louisville, KY", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Grand Rapids, MI", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Palm Springs, CA", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Reading, PA", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Albuquerque, NM", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Dayton, OH", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Sioux Falls, SD", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Grand Forks, ND", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Billings, MT", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Fresno, CA", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Nampa, ID", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Lincoln, NE", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "Unleash The Beast - Tacoma, WA", fee: 1000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Eugene, OR", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "PBR World Finals - Eliminations - Fort Worth, TX", fee: 1500, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Oakland, CA", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "PBR World Finals - Ride for Redemption - Fort Worth, TX", fee: 2000, transportMin: 500, transportMax: 1500, prizeMin: 5000, prizeMax: 10000 },
  { name: "Velocity Tour - Corpus Christi, TX", fee: 500, transportMin: 500, transportMax: 1500, prizeMin: 3000, prizeMax: 5000 },
  { name: "PBR World Finals - Championship - Arlington, TX", fee: 3000, transportMin: 500, transportMax: 1500, prizeMin: 10000, prizeMax: 20000 }
];

// List of unique words for bull names
const bullNameWords = [
  "Thunder", "Strike", "Iron", "Beast", "Storm", "Chaser", "Tornado", "Rage",
"Rampage", "Fury", "Black", "Blaze", "Viper", "Edge", "Wild", "Avalanche",
"Devil", "Roar", "Nightmare", "Scorpion", "King", "Hurricane", "Havoc",
"Toxic", "Shock", "Jaw", "Savage", "Glory", "Predator", "Wrath", "Chaos",
"Rider", "Rebel", "Inferno", "Dark", "Warrior", "Rush",
"Maverick", "Titan", "Phantom", "Grim", "Riptide", "Cinder",
"Blizzard", "Rogue", "Vortex", "Saber", "Fang", "Trouble",
"Crimson", "Havoc", "Lethal", "Feral", "Reaper", "Venom", "Wicked",
"Bulldozer", "Outlaw", "Grizzly", "Max", "Rampant", "Cyclone", "Rapture", "Warlord", "Razor", "Berserker", "Shatter", "Reckoning", "Hunter", "Venomous",
"Blitz", "Prowler", "Vigilante", "Spartan", "Clash", "Stealth",
 "Grit", "Ripper", "Battle", "Onslaught"
];

// Legendary bulls with updated price for Chicken on a Chain
const legendaryBulls = [
  { name: "Bodacious", ageWeeks: 260, overallRating: 95, color: "Yellow", weight: 1900, price: 95000 },
  { name: "Bruiser", ageWeeks: 260, overallRating: 95, color: "Brown", weight: 1700, price: 95000 },
  { name: "Bushwacker", ageWeeks: 260, overallRating: 95, color: "Red with White Face", weight: 1800, price: 100000 },
  { name: "Chicken on a Chain", ageWeeks: 260, overallRating: 95, color: "Brown & White", weight: 2100, price: 70000 },
  { name: "Dillinger", ageWeeks: 260, overallRating: 95, color: "Black with White Face", weight: 1800, price: 85000 },
  { name: "Little Yellow Jacket", ageWeeks: 260, overallRating: 95, color: "Dark Red", weight: 1750, price: 90000 },
  { name: "Mudslinger", ageWeeks: 260, overallRating: 95, color: "Dark Brown", weight: 1580, price: 80000 }
];

// Market bulls
const marketBulls = [
  { ability: "Tour level", ageWeeks: 260, ratingMin: 80, ratingMax: 90, price: 30000 },
  { ability: "Average", ageWeeks: 260, ratingMin: 65, ratingMax: 79, price: 15000 },
  { ability: "Regional", ageWeeks: 260, ratingMin: 50, ratingMax: 64, price: 5000 },
  { ability: "Unknown", ageWeeks: 260, ratingMin: 50, ratingMax: 90, price: 10000 }
];

// Rider lists
const velocityTourRiders = [
  "Afonso Quintino", "Aaron Williams", "Grayson Cole", "Nick Tetz", "Bruno Carvalho",
  "Lucas Martins Costa", "Trace Redd", "Dakota Buttar", "Leandro Zampollo", "Wyatt Rogers",
  "Bob Mitchell", "Ethan Winckler", "João Lucas Campos", "Marcus Mast", "Ky Hamilton",
  "Manoelito de Souza Junior", "Zane Cook", "Jaxton Mortensen", "Callum Miller", "Conner Halverson"
];

const unleashTheBeastRiders = [
  "Cassio Dias", "John Crimber", "Eduardo Aparecido", "Dalton Kasel", "Alan de Souza",
  "Kaiden Loud", "Sage Steele Kimzey", "Brady Fielder", "Kaique Pacheco", "Koltin Hevalow",
  "Thiago Salgado", "Austin Richardson", "João Ricardo Vieira", "Caden Bunch", "Daylon Swearingen",
  "Cort McFadden", "Leonardo Castro", "Julio Cesar Marques", "Cody Jesus", "Alex Cerqueira",
  "Keyshawn Whitehorse", "Silvano Alves", "Wingson Henrique da Silva", "Vitor Losnake", "Felipe Furlan",
  "Mauricio Gulla Moreira", "Clay Guiton", "Boudreaux Campbell", "Paulo Eduardo Rossetto", "Dener Barbosa",
  "Ednélio Almeida", "Wyatt Rogers", "Jesse Petri", "Andrew Alvidrez", "Mason Taylor", "Jose Vitor Leme",
  "Bob Mitchell", "Conner Halverson", "Ezekiel Mitchell", "Kyler Oliver", "Marco Rizzo", "Callum Miller",
  "Luciano De Castro", "Eli Vastbinder", "Dawson Branton", "Braidy Randolph", "Lucas Divino"
];

let statsWindow;
let sellConfirmWindow;
let legendsWindow;
let marketWindow;
let achievementsWindow;
let eventResultsWindow;
let topContractorsWindow;
let topBullsWindow;
let trainingWindow;

function setup() {
  createCanvas(800, 600);
  textSize(16);
  textAlign(CENTER, CENTER);

  // Initialize front page buttons
  frontPageButtons = [
    { text: "Start New Game", x: 400, y: 300, w: 200, h: 50 },
    { text: "Load Game", x: 400, y: 400, w: 200, h: 50 }
  ];

  // Graphics objects will be initialized when entering game mode
}

// Function to initialize game state and graphics
function initializeGame(isNewGame) {
  if (isNewGame) {
    let name = prompt("Enter your Stock Contractor name:", "ABC Bucking Bulls");
    gameState.contractorName = (name && name.trim() !== "") ? name.trim() : "Unnamed Contractor";
  } // If loading, contractorName comes from saved data

  if (isNewGame) {
    // Reset bulls only for new game
    gameState.bulls = [
      { 
        name: "Thunderbolt", 
        overallRating: 80, 
        health: 100, 
        value: 5000, 
        scores: [], 
        buckOffs: [], 
        rested: true, 
        ageWeeks: 260, 
        weight: 1800, 
        eventsCompleted: 0, 
        color: "Black",
        chuteTemperament: 70,
        yearlyScores: []
      },
      { 
        name: "Raging Storm", 
        overallRating: 65, 
        health: 85, 
        value: 3000, 
        scores: [], 
        buckOffs: [], 
        rested: true, 
        ageWeeks: 260, 
        weight: 1650, 
        eventsCompleted: 0, 
        color: "Red",
        chuteTemperament: 60,
        yearlyScores: []
      }
    ];
    gameState.money = 10000;
    gameState.week = 1;
    gameState.events = [];
    gameState.message = "Welcome! Manage your bulls and grow your stock contracting business.";
  }

  // Initialize rival bulls (for both new and loaded games, unless loaded data overrides)
  if (isNewGame) {
    for (let rival of gameState.rivals) {
      rival.bulls = [];
      for (let i = 0; i < 6; i++) {
        let colors = ["Black", "Red", "Brown", "White", "Gray", "Spotted", "Yellow"];
        let word1 = random(bullNameWords);
        let word2 = random(bullNameWords);
        while (word2 === word1) word2 = random(bullNameWords);
        let bullName = word1 + " " + word2;
        let overallRating = Math.floor(random(50, 91));
        let bull = {
          name: bullName,
          overallRating: overallRating,
          health: 100,
          value: Math.floor(overallRating * 100),
          scores: [],
          buckOffs: [],
          rested: true,
          ageWeeks: Math.floor(random(156, 364)),
          weight: Math.floor(random(1500, 2000)),
          eventsCompleted: 0,
          color: random(colors),
          chuteTemperament: Math.floor(random(50, 100)),
          yearlyScores: []
        };
        setInitialTraits(bull);
        rival.bulls.push(bull);
      }
    }
  }

  // Set initial traits for player bulls
  gameState.bulls.forEach(bull => setInitialTraits(bull));

  // Generate initial event if new game
  if (isNewGame && gameState.events.length === 0) {
    generateEvent();
  }

  // Initialize graphics objects
  statsWindow = createGraphics(300, 440);
  statsWindow.textSize(16);
  statsWindow.textAlign(LEFT);

  sellConfirmWindow = createGraphics(300, 150);
  sellConfirmWindow.textSize(16);
  sellConfirmWindow.textAlign(LEFT);

  legendsWindow = createGraphics(400, 300);
  legendsWindow.textSize(16);
  legendsWindow.textAlign(LEFT);

  marketWindow = createGraphics(400, 220);
  marketWindow.textSize(16);
  marketWindow.textAlign(LEFT);

  achievementsWindow = createGraphics(500, 280);
  achievementsWindow.textSize(16);
  achievementsWindow.textAlign(LEFT);

  eventResultsWindow = createGraphics(600, 400);
  eventResultsWindow.textSize(16);
  eventResultsWindow.textAlign(LEFT);

  topContractorsWindow = createGraphics(400, 220);
  topContractorsWindow.textSize(16);
  topContractorsWindow.textAlign(LEFT);

  topBullsWindow = createGraphics(500, 220);
  topBullsWindow.textSize(16);
  topBullsWindow.textAlign(LEFT);

  trainingWindow = createGraphics(300, 400);
  trainingWindow.textSize(16);
  trainingWindow.textAlign(LEFT);

  saveConfirmWindow = createGraphics(300, 150);
  saveConfirmWindow.textSize(16);
  saveConfirmWindow.textAlign(LEFT);

  animationWindow = createGraphics(800, 600);
  animationWindow.textSize(16);
  animationWindow.textAlign(CENTER, CENTER);

  textAlign(LEFT); // Reset for game
}


// Define drawBull (unchanged from your original)
function drawBull(x, y, bullColor, scaleFactor = 1, animate = true) {
  push();
  translate(x, y);
  scale(scaleFactor);
  
  let bullFill;
  switch(bullColor.toLowerCase()) {
    case "black": bullFill = color(40, 40, 40); break;
    case "red": bullFill = color(150, 50, 50); break;
    case "brown": bullFill = color(139, 69, 19); break;
    case "white": bullFill = color(200, 200, 200); break;
    case "gray": bullFill = color(128, 128, 128); break;
    case "spotted": bullFill = color(200, 200, 200); break;
    case "yellow": bullFill = color(170, 140, 0); break;
    case "red with white face": bullFill = color(150, 50, 50); break;
    case "brown & white": bullFill = color(139, 69, 19); break;
    case "black with white face": bullFill = color(40, 40, 40); break;
    case "dark red": bullFill = color(120, 30, 30); break;
    case "dark brown": bullFill = color(101, 67, 33); break;
    default: bullFill = color(100, 100, 100);
  }

  let headOffset = animate ? sin(frameCount * 0.05) * 2 : 0;

  fill(bullFill);
  noStroke();
  ellipse(0, 0, 40, 30);

  rect(-15, 10, 5, 15);
  rect(10, 10, 5, 15);
  rect(-10, 10, 5, 15);
  rect(15, 10, 5, 15);

  push();
  translate(-20, headOffset - 5);
  ellipse(0, 0, 20, 15);
  
  stroke(200);
  strokeWeight(2);
  line(-8, -5, -12, -10);
  line(8, -5, 12, -10);
  
  noStroke();
  fill(255);
  ellipse(-4, 2, 4, 4);
  ellipse(4, 2, 4, 4);
  fill(0);
  ellipse(-4, 2, 2, 2);
  ellipse(4, 2, 2, 2);
  pop();

  if (bullColor.toLowerCase() === "spotted") {
    fill(100);
    ellipse(-10, 0, 8, 8);
    ellipse(10, 5, 6, 6);
  } else if (bullColor.toLowerCase().includes("white face")) {
    fill(240);
    ellipse(-20, -5, 20, 15);
  } else if (bullColor.toLowerCase() === "brown & white") {
    fill(240);
    ellipse(10, 0, 20, 15);
  }

  stroke(bullFill);
  strokeWeight(2);
  line(20, 0, 25, sin(frameCount * 0.1) * 5);
  
  pop();
}

// Restored original animateBullAndRider function from your provided code
function animateBullAndRider(window, elapsedTime, buckOffTime) {
  window.push();
  window.translate(400, 400); // Center in 800x600 window
  window.scale(1.5); // Scale up by 1.5x to make it more prominent
  
  let rideTime = buckOffTime !== null ? buckOffTime / 1000 : 8;
  let isRiding = elapsedTime < rideTime;
  
  // Bull animation parameters
  let rearAngle = sin(elapsedTime * PI * 2) * 30 * (1 + sin(elapsedTime * 0.6));
  let twistAngle = sin(elapsedTime * PI * 1.5) * 25;
  let kickHeight = sin(elapsedTime * PI * 3) * 20;
  let headToss = sin(elapsedTime * PI * 4) * 15;
  
  // Dust effect for realism
  window.noStroke();
  window.fill(139, 69, 19, 60);
  for (let i = 0; i < 4; i++) {
    let dustOffset = sin(elapsedTime * PI + i) * 15;
    window.ellipse(dustOffset + random(-25, 25), 50 + random(-10, 10), 40 + kickHeight / 2, 20);
  }
  
  // Draw bull
  window.push();
  window.rotate(radians(twistAngle));
  window.translate(0, kickHeight);
  
  let bullFill;
  switch(animationBullColor.toLowerCase()) {
    case "black": bullFill = color(40, 40, 40); break;
    case "red": bullFill = color(150, 50, 50); break;
    case "brown": bullFill = color(139, 69, 19); break;
    case "white": bullFill = color(200, 200, 200); break;
    case "gray": bullFill = color(128, 128, 128); break;
    case "spotted": bullFill = color(200, 200, 200); break;
    case "yellow": bullFill = color(170, 140, 0); break;
    case "red with white face": bullFill = color(150, 50, 50); break;
    case "brown & white": bullFill = color(139, 69, 19); break;
    case "black with white face": bullFill = color(40, 40, 40); break;
    case "dark red": bullFill = color(120, 30, 30); break;
    case "dark brown": bullFill = color(101, 67, 33); break;
    default: bullFill = color(100, 100, 100);
  }
  window.fill(bullFill);
  window.noStroke();
  window.push();
  window.rotate(radians(rearAngle));
  
  // Bull body
  window.beginShape();
  window.vertex(-35, -5);
  window.bezierVertex(-25, -15, 25, -15, 35, -5);
  window.vertex(35, 25);
  window.bezierVertex(25, 35, -25, 35, -35, 25);
  window.endShape(CLOSE);
  window.fill(red(bullFill) * 0.8, green(bullFill) * 0.8, blue(bullFill) * 0.8);
  window.ellipse(-10, 0, 20, 15);
  window.ellipse(20, 10, 25, 20);
  
  // Front legs
  window.push();
  window.translate(-25, 25);
  window.rotate(radians(-rearAngle * 0.6));
  window.rect(-4, 0, 8, 20, 5);
  window.translate(0, 20);
  window.rotate(radians(15));
  window.rect(-4, 0, 8, 15, 5);
  window.pop();
  window.push();
  window.translate(-10, 25);
  window.rotate(radians(-rearAngle * 0.6));
  window.rect(-4, 0, 8, 20, 5);
  window.translate(0, 20);
  window.rotate(radians(15));
  window.rect(-4, 0, 8, 15, 5);
  window.pop();
  
  // Back legs
  window.push();
  window.translate(20, 25);
  window.rotate(radians(-kickHeight * 2));
  window.rect(-4, 0, 8, 20, 5);
  window.rotate(radians(25));
  window.rect(-4, 20, 8, 15, 5);
  window.pop();
  window.push();
  window.translate(35, 25);
  window.rotate(radians(-kickHeight * 2.5));
  window.rect(-4, 0, 8, 20, 5);
  window.rotate(radians(25));
  window.rect(-4, 20, 8, 15, 5);
  window.pop();
  
  // Tail
  window.stroke(bullFill);
  window.strokeWeight(3);
  window.push();
  window.translate(40, 10);
  window.rotate(radians(sin(elapsedTime * PI * 5) * 40));
  window.line(0, 0, 0, 20);
  window.noStroke();
  window.fill(bullFill);
  window.triangle(0, 20, -3, 25, 3, 25);
  window.pop();
  
  // Bull head
  window.push();
  window.translate(-40, -10);
  window.rotate(radians(-rearAngle / 2 + headToss));
  let headFill = bullFill;
  if (animationBullColor.toLowerCase().includes("with white face") || animationBullColor.toLowerCase() === "spotted") {
    headFill = color(240, 240, 240);
  } else if (animationBullColor.toLowerCase() === "brown & white") {
    headFill = color(240, 240, 240);
  }
  window.fill(headFill);
  window.beginShape();
  window.vertex(-15, -12);
  window.bezierVertex(-18, -8, -20, 0, -18, 8);
  window.vertex(-12, 15);
  window.bezierVertex(-6, 18, 6, 18, 12, 15);
  window.vertex(18, 8);
  window.bezierVertex(20, 0, 18, -8, 15, -12);
  window.endShape(CLOSE);
  window.fill(red(headFill) * 0.9, green(headFill) * 0.9, blue(headFill) * 0.9, 150);
  window.ellipse(0, 0, 25, 15);
  window.fill(200);
  window.push();
  window.translate(-15, -10);
  window.rotate(radians(sin(elapsedTime * PI * 2) * 5));
  window.triangle(0, 0, -6, -5, -3, 5);
  window.pop();
  window.push();
  window.translate(15, -10);
  window.rotate(radians(sin(elapsedTime * PI * 2) * -5));
  window.triangle(0, 0, 6, -5, 3, 5);
  window.pop();
  window.stroke(200);
  window.strokeWeight(3);
  window.noFill();
  window.beginShape();
  window.vertex(-12, -8);
  window.bezierVertex(-18, -14, -22, -12, -20, -18);
  window.endShape();
  window.beginShape();
  window.vertex(12, -8);
  window.bezierVertex(18, -14, 22, -12, 20, -18);
  window.endShape();
  window.noStroke();
  window.fill(255);
  window.ellipse(-6, 2, 6, 4);
  window.ellipse(6, 2, 6, 4);
  window.fill(0);
  window.ellipse(-6 + sin(elapsedTime * PI) * 1, 2, 2, 3);
  window.ellipse(6 + sin(elapsedTime * PI) * 1, 2, 2, 3);
  window.fill(red(headFill) * 0.8, green(headFill) * 0.8, blue(headFill) * 0.8);
  window.arc(-6, 1, 6, 4, PI, TWO_PI);
  window.arc(6, 1, 6, 4, PI, TWO_PI);
  window.fill(red(headFill) * 0.7, green(headFill) * 0.7, blue(headFill) * 0.7);
  window.ellipse(0, 15, 12, 6);
  window.fill(50);
  window.ellipse(-4, 14, 4, 3);
  window.ellipse(4, 14, 4, 3);
  window.pop();
  
  window.pop();
  window.pop();
  
  // Chaps color
  let chapsColor;
  switch(animationBullColor.toLowerCase()) {
    case "black": chapsColor = color(255, 215, 0); break;
    case "red": case "dark red": chapsColor = color(0, 191, 255); break;
    case "brown": case "dark brown": case "brown & white": chapsColor = color(255, 165, 0); break;
    case "white": chapsColor = color(139, 0, 139); break;
    case "gray": chapsColor = color(255, 69, 0); break;
    case "spotted": chapsColor = color(0, 128, 0); break;
    case "yellow": chapsColor = color(0, 0, 139); break;
    case "red with white face": chapsColor = color(0, 191, 255); break;
    case "black with white face": chapsColor = color(255, 215, 0); break;
    default: chapsColor = color(139, 69, 19);
  }
  
  // Draw rider with straddling posture
  if (isRiding) {
    window.push();
    window.rotate(radians(twistAngle));
    window.translate(0, kickHeight - 25);
    window.rotate(radians(rearAngle * 0.6 + headToss * 0.2));
    
    window.fill(210, 140, 90);
    window.noStroke();
    window.ellipse(0, -20, 12, 12);
    
    window.fill(255);
    window.ellipse(-3, -19, 2, 2);
    window.ellipse(3, -19, 2, 2);
    window.fill(0);
    window.ellipse(-3, -19, 1, 1);
    window.ellipse(3, -19, 1, 1);
    window.fill(255, 100, 100);
    window.arc(0, -15, 4, 2, 0, PI);
    
    window.fill(139, 69, 19);
    window.beginShape();
    window.vertex(-12, -22);
    window.bezierVertex(-15, -25, -10, -28, 0, -28);
    window.bezierVertex(10, -28, 15, -25, 12, -22);
    window.vertex(12, -24);
    window.bezierVertex(14, -26, 10, -26, 0, -26);
    window.bezierVertex(-10, -26, -14, -26, -12, -24);
    window.endShape(CLOSE);
    window.beginShape();
    window.vertex(-6, -24);
    window.bezierVertex(-5, -30, -2, -32, 0, -32);
    window.bezierVertex(2, -32, 5, -30, 6, -24);
    window.vertex(6, -24);
    window.line(6, -24, -6, -24);
    window.endShape(CLOSE);
    
    window.fill(animationTorsoColor);
    window.rect(-6, -15, 12, 20);
    
    window.stroke(139, 69, 19);
    window.strokeWeight(2);
    window.line(4, 5, 12, 20);
    window.line(12, 20, 14, 30);
    
    window.fill(chapsColor);
    window.noStroke();
    window.beginShape();
    window.vertex(4, 5);
    window.vertex(12, 25);
    window.vertex(6, 25);
    window.vertex(2, 5);
    window.endShape(CLOSE);
    window.beginShape();
    window.vertex(-4, 5);
    window.vertex(-6, 15);
    window.vertex(-2, 15);
    window.vertex(-2, 5);
    window.endShape(CLOSE);
    
    window.stroke(animationTorsoColor);
    window.strokeWeight(2);
    window.line(6, -15, 12, -5);
    window.line(12, -5, 10, 5);
    window.line(-6, -15, -12, -25);
    window.line(-12, -25, -15 + sin(elapsedTime * PI * 2) * 5, -35);
    
    window.noStroke();
    window.pop();
  } else if (elapsedTime < rideTime + 2) {
    let fallTime = elapsedTime - rideTime;
    window.push();
    window.translate(40 + fallTime * 50, -30 + fallTime * 70);
    window.rotate(radians(fallTime * 150));
    
    window.fill(210, 140, 90);
    window.noStroke();
    window.ellipse(0, -20, 12, 12);
    
    window.fill(255);
    window.ellipse(-3, -19, 2, 2);
    window.ellipse(3, -19, 2, 2);
    window.fill(0);
    window.ellipse(-3, -19, 1, 1);
    window.ellipse(3, -19, 1, 1);
    window.fill(255, 100, 100);
    window.arc(0, -15, 4, 2, PI, 0);
    
    window.fill(139, 69, 19);
    window.beginShape();
    window.vertex(-12, -22);
    window.bezierVertex(-15, -25, -10, -28, 0, -28);
    window.bezierVertex(10, -28, 15, -25, 12, -22);
    window.vertex(12, -24);
    window.bezierVertex(14, -26, 10, -26, 0, -26);
    window.bezierVertex(-10, -26, -14, -26, -12, -24);
    window.endShape(CLOSE);
    window.beginShape();
    window.vertex(-6, -24);
    window.bezierVertex(-5, -30, -2, -32, 0, -32);
    window.bezierVertex(2, -32, 5, -30, 6, -24);
    window.vertex(6, -24);
    window.line(6, -24, -6, -24);
    window.endShape(CLOSE);
    
    window.fill(animationTorsoColor);
    window.rect(-6, -15, 12, 20);
    
    window.fill(chapsColor);
    window.beginShape();
    window.vertex(-8, 5);
    window.vertex(-12, 25);
    window.vertex(-6, 25);
    window.vertex(-4, 5);
    window.endShape(CLOSE);
    window.beginShape();
    window.vertex(8, 5);
    window.vertex(12, 25);
    window.vertex(6, 25);
    window.vertex(4, 5);
    window.endShape(CLOSE);
    
    window.stroke(animationTorsoColor);
    window.strokeWeight(2);
    window.line(6, -15, 12, -5);
    window.line(12, -5, 10, 5);
    window.line(-6, -15, -12, -25);
    window.line(-12, -25, -15, -35);
    
    window.stroke(139, 69, 19);
    window.line(-4, 5, -12, 20);
    window.line(4, 5, 12, 20);
    
    window.noStroke();
    window.pop();
  }
  
  window.pop();
}

// Amended enterEvent function with bull selection fix
function enterEvent(bullIndex) {
  let evt = gameState.events[0];
  let totalCost = evt.fee + evt.transport;
  if (gameState.money >= totalCost) {
    gameState.money -= totalCost;
    let bull = gameState.bulls[bullIndex];
    
    let riderPool = evt.name.includes("Velocity Tour") ? [...velocityTourRiders] : [...unleashTheBeastRiders];
    let usedRiders = [];
    
    let playerResult = simulateBullPerformance(bull, evt, gameState.contractorName, riderPool);
    usedRiders.push(playerResult.riderName);
    gameState.yearlyBullScores.player.push(playerResult.bullScore);
    
    let winnings = Math.floor(evt.prize * (playerResult.bullScore / 49.75));
    gameState.money += winnings;
    
    let results = [playerResult];
    
    for (let rival of gameState.rivals) {
      let rivalBull = random(rival.bulls);
      let rivalResult = simulateBullPerformance(rivalBull, evt, rival.name, riderPool);
      usedRiders.push(rivalResult.riderName);
      gameState.yearlyBullScores.rivals[rival.name].push(rivalResult.bullScore);
      results.push(rivalResult);
    }
    
    gameState.lastEventResults = { eventName: evt.name, results };
    
    let totalScore = playerResult.buckedOff ? playerResult.bullScore : (playerResult.bullScore + playerResult.riderScore);
    let scoreText = playerResult.buckedOff 
      ? `Bull: ${playerResult.bullScore.toFixed(2)}` 
      : `${totalScore.toFixed(2)} (Bull: ${playerResult.bullScore.toFixed(2)}, Rider: ${playerResult.riderScore.toFixed(2)})`;
    
    gameState.pendingMessage = `${bull.name} ${playerResult.buckedOff ? `bucked off at ${playerResult.buckOffTime}s` : "rode for 8s"}, scored ${scoreText} at ${evt.name}.\nWon $${winnings} vs ${playerResult.riderName}, health reduced by ${bull.health <= 0 ? "all" : playerResult.buckedOff ? Math.floor(map(parseFloat(playerResult.buckOffTime), 0.1, 8, 3, 10)) : 10}.`;
    
    if (bull.health <= 0) {
      gameState.bulls.splice(bullIndex, 1);
      if (gameState.selectedBull === bullIndex) gameState.selectedBull = null;
      else if (gameState.selectedBull > bullIndex) gameState.selectedBull--;
      gameState.pendingMessage += `\n${bull.name} has been retired due to poor health.`;
    }
    
    if (bull.eventsCompleted >= 10) {
      let avgScore = bull.scores.reduce((a, b) => a + b, 0) / bull.scores.length;
      let buckOffPct = (bull.buckOffs.filter(b => b.buckedOff).length / bull.buckOffs.length) * 100;
      if (avgScore > gameState.achievements.topAvgScore.value) {
        gameState.achievements.topAvgScore = { value: avgScore, bullName: bull.name, eventsCompleted: bull.eventsCompleted };
      }
      if (buckOffPct > gameState.achievements.topBuckOffPct.value) {
        gameState.achievements.topBuckOffPct = { value: buckOffPct, bullName: bull.name, eventsCompleted: bull.eventsCompleted };
      }
    }
    if (bull.eventsCompleted >= 1) {
      if (playerResult.bullScore > gameState.achievements.highestBullScore.value) {
        gameState.achievements.highestBullScore = { value: playerResult.bullScore, bullName: bull.name, riderName: playerResult.riderName, eventName: evt.name, eventsCompleted: bull.eventsCompleted };
      }
      if (playerResult.buckedOff && parseFloat(playerResult.buckOffTime) < gameState.achievements.fastestBuckOff.value) {
        gameState.achievements.fastestBuckOff = { value: parseFloat(playerResult.buckOffTime), bullName: bull.name, riderName: playerResult.riderName, eventName: evt.name, eventsCompleted: bull.eventsCompleted };
      }
    }
    
    showingAnimation = true;
    animationStartTime = millis();
    buckOffTime = playerResult.buckedOff ? parseFloat(playerResult.buckOffTime) * 1000 : null; // Convert to milliseconds
    animationBullColor = bull.color;
    animationRiderName = playerResult.riderName;
    animationEventName = evt.name;
    gameState.selectedAnimationBull = bull; // Store the specific bull object
    let torsoColors = [
      color(40, 40, 40),   // Black
      color(0, 100, 200),  // Blue
      color(139, 69, 19),  // Brown
      color(150, 50, 50)   // Red
    ];
    animationTorsoColor = random(torsoColors); // Set once per event
    
    gameState.events.shift();
  } else {
    gameState.message = "Not enough money to cover entry fee and transport!";
  }
}

// Amended draw function with bull selection fix and restored animation
function draw() {
  background(220);

  if (currentMode === 'frontPage') {
    fill(0);
    textSize(32);
    text("Stock Contractor Game", width / 2, 100);
    textSize(16);

    for (let button of frontPageButtons) {
      fill(200);
      rectMode(CENTER);
      rect(button.x, button.y, button.w, button.h, 10);
      fill(0);
      text(button.text, button.x, button.y);
    }
  } else if (currentMode === 'game') {
    // Existing game drawing code
  
  fill(0);
  text(`${gameState.contractorName}`, 20, 20);
  text(`Week: ${gameState.week} | Money: $${gameState.money} | Bulls Owned: ${gameState.bulls.length}/6`, 20, 40);
  if (!showingAnimation) {
    text(gameState.message, 20, 60);
  } else {
    text("Event in progress...", 20, 60);
  }
  text("Your Bulls (click name for more stats):", 20, 120);
  for (let i = 0; i < gameState.bulls.length; i++) {
    let bull = gameState.bulls[i];
    let avgScore = bull.scores.length > 0 ? (bull.scores.reduce((a, b) => a + b, 0) / bull.scores.length).toFixed(1) : "N/A";
    let buckOffRate = bull.buckOffs.length > 0 ? ((bull.buckOffs.filter(b => b.buckedOff).length / bull.buckOffs.length) * 100).toFixed(1) + "%" : "N/A";
    
    drawBull(40, 135 + i * 20, bull.color, 0.5);
    
    text(`${i + 1}. ${bull.name} - Overall: ${bull.overallRating}, Health: ${bull.health}, Value: $${bull.value}, Avg Score: ${avgScore}, BuckOff%: ${buckOffRate}`, 
         80, 140 + i * 20);
  }
  
  if (gameState.events.length > 0) {
    let evt = gameState.events[0];
    text("Current Event:", 20, 300);
    text(`${evt.name} - Entry Fee: $${evt.fee}, Transport: $${evt.transport}, Prize: $${evt.prize}`, 40, 320);
    if (gameState.selectingBull) {
      text("Select a bull to enter (1-" + gameState.bulls.length + ")", 40, 340);
    } else if (gameState.renamingBull) {
      text("Select a bull to rename (1-" + gameState.bulls.length + ")", 40, 340);
    } else if (gameState.showingTraining && gameState.trainingBullIndex === null) {
      text("Select a bull to train (1-" + gameState.bulls.length + ")", 40, 340);
    } else {
      text("Press E to enter a bull, N to skip/next week", 40, 340);
    }
  } else {
    text("No events this week. Press 'N' for next week.", 20, 300);
  }
  
  text("Controls:", 20, 400);
  text("S - Sell a bull (select by number)", 40, 420);
  text("R - Rename a bull (select by number)", 40, 440);
  text("T - Train a bull (select by number)", 40, 460);
  text("L - Legends (buy a legendary bull)", 40, 480);
  text("M - Market (buy a market bull)", 40, 500);
  text("A - Achievements", 40, 520);
  text("V - Event (view last event results)", 40, 540);
  text("C - Top Stock Contractors", 40, 560);
  text("X - Top Bulls", 40, 580);
  text("Z - Save Game", 40, 600); // Add save control
  
    // Add save confirmation window
    if (gameState.showingSaveConfirm) {
      saveConfirmWindow.background(240);
      saveConfirmWindow.fill(0);
      saveConfirmWindow.text("Save current game progress?", 10, 30);
      saveConfirmWindow.fill(200);
      saveConfirmWindow.rect(10, 60, 80, 30);
      saveConfirmWindow.rect(100, 60, 80, 30);
      saveConfirmWindow.fill(0);
      saveConfirmWindow.text("Yes", 35, 80);
      saveConfirmWindow.text("No", 130, 80);
      
      image(saveConfirmWindow, width / 2 - saveConfirmWindow.width / 2, height / 2 - saveConfirmWindow.height / 2);
    }
    
  if (gameState.selectedBull !== null) {
    let bull = gameState.bulls[gameState.selectedBull];
    let years = Math.floor(bull.ageWeeks / 52);
    let weeks = bull.ageWeeks % 52;
    let buckOffCount = bull.buckOffs.filter(b => b.buckedOff).length;
    let rides = bull.eventsCompleted - buckOffCount;
    statsWindow.background(240);
    statsWindow.fill(0);
    statsWindow.text("Additional Stats:", 10, 30);
    statsWindow.text(`Name: ${bull.name}`, 10, 50);
    statsWindow.text(`Age: ${years} years, ${weeks} weeks`, 10, 70);
    statsWindow.text(`Weight: ${bull.weight} lbs`, 10, 90);
    statsWindow.text(`Color: ${bull.color}`, 10, 110);
    statsWindow.text(`Agility: ${bull.agility}`, 10, 130);
    statsWindow.text(`Head Movement: ${bull.headMovement}`, 10, 150);
    statsWindow.text(`Spin: ${bull.spin}`, 10, 170);
    statsWindow.text(`Direction Change: ${bull.directionChange}`, 10, 190);
    statsWindow.text(`Aggression: ${bull.aggression}`, 10, 210);
    statsWindow.text(`Kicking Speed: ${bull.kickingSpeed}`, 10, 230);
    statsWindow.text(`Kicking Power: ${bull.kickingPower}`, 10, 250);
    statsWindow.text(`Jumping Height: ${bull.jumpingHeight}`, 10, 270);
    statsWindow.text(`Speed: ${bull.speed}`, 10, 290);
    statsWindow.text(`Power: ${bull.power}`, 10, 310);
    statsWindow.text(`Chute Temperament: ${bull.chuteTemperament}`, 10, 330);
    statsWindow.text(`Events/Outs: ${bull.eventsCompleted}`, 10, 350);
    statsWindow.text(`Buck-Offs: ${buckOffCount}`, 10, 370);
    statsWindow.text(`Rides: ${rides}`, 10, 390);
    statsWindow.fill(200);
    statsWindow.rect(10, 400, 80, 30);
    statsWindow.fill(0);
    statsWindow.text("Back", 30, 420);
    
    image(statsWindow, width / 2 - statsWindow.width / 2, height / 2 - statsWindow.height / 2);
  }

  if (gameState.sellingBull && gameState.sellBullIndex !== null) {
    let bull = gameState.bulls[gameState.sellBullIndex];
    sellConfirmWindow.background(240);
    sellConfirmWindow.fill(0);
    sellConfirmWindow.text(`Sell ${bull.name} for $${bull.value}?`, 10, 30);
    sellConfirmWindow.fill(200);
    sellConfirmWindow.rect(10, 60, 80, 30);
    sellConfirmWindow.rect(100, 60, 80, 30);
    sellConfirmWindow.fill(0);
    sellConfirmWindow.text("Confirm", 20, 80);
    sellConfirmWindow.text("Cancel", 115, 80);
    
    image(sellConfirmWindow, width / 2 - sellConfirmWindow.width / 2, height / 2 - sellConfirmWindow.height / 2);
  }

  if (gameState.showingLegends) {
    legendsWindow.background(240);
    legendsWindow.fill(0);
    legendsWindow.text("Legendary Bulls (Press number to buy):", 10, 30);
    for (let i = 0; i < legendaryBulls.length; i++) {
      let legend = legendaryBulls[i];
      legendsWindow.text(`${i + 1}. ${legend.name} - Price: $${legend.price}`, 20, 50 + i * 20);
    }
    legendsWindow.fill(200);
    legendsWindow.rect(10, 260, 80, 30);
    legendsWindow.fill(0);
    legendsWindow.text("Back", 30, 280);
    
    image(legendsWindow, width / 2 - legendsWindow.width / 2, height / 2 - legendsWindow.height / 2);
  }

  if (gameState.showingMarket) {
    marketWindow.background(240);
    marketWindow.fill(0);
    marketWindow.text("Market Bulls (Press number to buy):", 10, 30);
    for (let i = 0; i < marketBulls.length; i++) {
      let marketBull = marketBulls[i];
      marketWindow.text(`${i + 1}. ${marketBull.ability} - Price: $${marketBull.price}`, 20, 50 + i * 20);
    }
    marketWindow.fill(200);
    marketWindow.rect(10, 180, 80, 30);
    marketWindow.fill(0);
    marketWindow.text("Back", 30, 200);
    
    image(marketWindow, width / 2 - marketWindow.width / 2, height / 2 - marketWindow.height / 2);
  }

  if (gameState.showingAchievements) {
    let topAvgScore = gameState.achievements.topAvgScore;
    let topBuckOffPct = gameState.achievements.topBuckOffPct;

    gameState.bulls.forEach(bull => {
      if (bull.eventsCompleted >= 10) {
        let avgScore = bull.scores.reduce((a, b) => a + b, 0) / bull.scores.length;
        let buckOffPct = (bull.buckOffs.filter(b => b.buckedOff).length / bull.buckOffs.length) * 100;

        if (avgScore > topAvgScore.value) {
          topAvgScore = { value: avgScore, bullName: bull.name, eventsCompleted: bull.eventsCompleted, contractorName: gameState.contractorName };
        }
        if (buckOffPct > topBuckOffPct.value) {
          topBuckOffPct = { value: buckOffPct, bullName: bull.name, eventsCompleted: bull.eventsCompleted, contractorName: gameState.contractorName };
        }
      }
    });

    achievementsWindow.background(240);
    achievementsWindow.fill(0);
    achievementsWindow.text("Your All-Time Achievements (10+ Events for Avg/Buck-Off, 1+ for Others):", 10, 30);
    achievementsWindow.text(`Top Avg Score: ${topAvgScore.value.toFixed(1)} - ${topAvgScore.bullName}`, 20, 50);
    achievementsWindow.text(`Events: ${topAvgScore.eventsCompleted}`, 20, 70);
    achievementsWindow.text(`Top Buck-Off %: ${topBuckOffPct.value.toFixed(1)}% - ${topBuckOffPct.bullName}`, 20, 90);
    achievementsWindow.text(`Events: ${topBuckOffPct.eventsCompleted}`, 20, 110);
    achievementsWindow.text(`Highest Bull Score: ${gameState.achievements.highestBullScore.value.toFixed(2)} - ${gameState.achievements.highestBullScore.bullName} (${gameState.achievements.highestBullScore.riderName})`, 20, 130);
    achievementsWindow.text(`Event: ${gameState.achievements.highestBullScore.eventName}`, 20, 150);
    achievementsWindow.text(`Fastest Buck-Off: ${gameState.achievements.fastestBuckOff.value.toFixed(1)}s - ${gameState.achievements.fastestBuckOff.bullName} (${gameState.achievements.fastestBuckOff.riderName})`, 20, 170);
    achievementsWindow.text(`Event: ${gameState.achievements.fastestBuckOff.eventName}`, 20, 190);
    achievementsWindow.fill(200);
    achievementsWindow.rect(10, 240, 80, 30);
    achievementsWindow.fill(0);
    achievementsWindow.text("Back", 30, 260);
    
    image(achievementsWindow, width / 2 - achievementsWindow.width / 2, height / 2 - achievementsWindow.height / 2);
  }

  if (gameState.showingEventResults && gameState.lastEventResults) {
    eventResultsWindow.background(240);
    eventResultsWindow.fill(0);
    eventResultsWindow.text(gameState.lastEventResults.eventName, 20, 40);
    let y = 70;
    for (let result of gameState.lastEventResults.results) {
      let scoreText = result.buckedOff 
        ? `${result.bullName} - Bull Score: ${result.bullScore.toFixed(2)} vs ${result.riderName} (Bucked Off at ${result.buckOffTime}s)`
        : `${result.bullName} - Bull Score: ${result.bullScore.toFixed(2)}, Rider Score: ${result.riderScore.toFixed(2)} vs ${result.riderName}`;
      eventResultsWindow.text(scoreText, 30, y);
      eventResultsWindow.text(`Stock Contractor: ${result.contractorName}`, 30, y + 25);
      y += 50;
    }
    eventResultsWindow.fill(200);
    eventResultsWindow.rect(20, 350, 80, 30);
    eventResultsWindow.fill(0);
    eventResultsWindow.text("Back", 40, 370);
    
    image(eventResultsWindow, width / 2 - eventResultsWindow.width / 2, height / 2 - eventResultsWindow.height / 2);
  }

  if (gameState.showingTopContractors) {
    topContractorsWindow.background(240);
    topContractorsWindow.fill(0);
    topContractorsWindow.text("Top Stock Contractors (Year-to-Date):", 10, 30);
    let contractors = [
      { name: gameState.contractorName, scores: gameState.yearlyBullScores.player }
    ].concat(gameState.rivals.map(r => ({ name: r.name, scores: gameState.yearlyBullScores.rivals[r.name] })));
    contractors.sort((a, b) => {
      let avgA = a.scores.length > 0 ? a.scores.reduce((sum, s) => sum + s, 0) / a.scores.length : 0;
      let avgB = b.scores.length > 0 ? b.scores.reduce((sum, s) => sum + s, 0) / b.scores.length : 0;
      return avgB - avgA;
    });
    for (let i = 0; i < Math.min(6, contractors.length); i++) {
      let avg = contractors[i].scores.length > 0 ? (contractors[i].scores.reduce((sum, s) => sum + s, 0) / contractors[i].scores.length).toFixed(2) : "N/A";
      topContractorsWindow.text(`${i + 1}. ${contractors[i].name} - Avg Bull Score: ${avg}`, 20, 50 + i * 20);
    }
    topContractorsWindow.fill(200);
    topContractorsWindow.rect(10, 180, 80, 30);
    topContractorsWindow.fill(0);
    topContractorsWindow.text("Back", 30, 200);
    
    image(topContractorsWindow, width / 2 - topContractorsWindow.width / 2, height / 2 - topContractorsWindow.height / 2);
  }

  if (gameState.showingTopBulls) {
    topBullsWindow.background(240);
    topBullsWindow.fill(0);
    topBullsWindow.text("Top Bulls (Year-to-Date):", 10, 30);
    let allBulls = [];
    gameState.bulls.forEach(bull => allBulls.push({ name: bull.name, scores: bull.yearlyScores, contractor: gameState.contractorName }));
    gameState.rivals.forEach(rival => {
      rival.bulls.forEach(bull => allBulls.push({ name: bull.name, scores: bull.yearlyScores, contractor: rival.name }));
    });
    allBulls.sort((a, b) => {
      let avgA = a.scores.length > 0 ? a.scores.reduce((sum, s) => sum + s, 0) / a.scores.length : 0;
      let avgB = b.scores.length > 0 ? b.scores.reduce((sum, s) => sum + s, 0) / b.scores.length : 0;
      return avgB - avgA;
    });
    for (let i = 0; i < Math.min(6, allBulls.length); i++) {
      let avg = allBulls[i].scores.length > 0 ? (allBulls[i].scores.reduce((sum, s) => sum + s, 0) / allBulls[i].scores.length).toFixed(2) : "N/A";
      topBullsWindow.text(`${i + 1}. ${allBulls[i].name} - Avg: ${avg} (${allBulls[i].contractor})`, 20, 50 + i * 20);
    }
    topBullsWindow.fill(200);
    topBullsWindow.rect(10, 180, 80, 30);
    topBullsWindow.fill(0);
    topBullsWindow.text("Back", 30, 200);
    
    image(topBullsWindow, width / 2 - topBullsWindow.width / 2, height / 2 - topBullsWindow.height / 2);
  }

  if (gameState.showingTraining && gameState.trainingBullIndex !== null) {
    let bull = gameState.bulls[gameState.trainingBullIndex];
    trainingWindow.background(240);
    trainingWindow.fill(0);
    trainingWindow.text(`Train ${bull.name} ($1000 each):`, 10, 30);
    trainingWindow.text(`Agility: ${bull.agility}`, 10, 50);
    trainingWindow.text(`Spin: ${bull.spin}`, 10, 70);
    trainingWindow.text(`Aggression: ${bull.aggression}`, 10, 90);
    trainingWindow.text(`Kicking Power: ${bull.kickingPower}`, 10, 110);
    trainingWindow.text(`Power: ${bull.power}`, 10, 130);
    trainingWindow.text(`Head Movement: ${bull.headMovement}`, 10, 150);
    trainingWindow.text(`Direction Change: ${bull.directionChange}`, 10, 170);
    trainingWindow.text(`Kicking Speed: ${bull.kickingSpeed}`, 10, 190);
    trainingWindow.text(`Jumping Height: ${bull.jumpingHeight}`, 10, 210);
    trainingWindow.text(`Speed: ${bull.speed}`, 10, 230);
    for (let i = 0; i < 10; i++) {
      trainingWindow.fill(200);
      trainingWindow.rect(200, 30 + i * 20, 80, 20);
      trainingWindow.fill(0);
      trainingWindow.text("+3", 230, 45 + i * 20);
    }
    trainingWindow.fill(200);
    trainingWindow.rect(10, 360, 80, 30);
    trainingWindow.fill(0);
    trainingWindow.text("Back", 30, 380);
    
    image(trainingWindow, width / 2 - trainingWindow.width / 2, height / 2 - trainingWindow.height / 2);
  }

  // Animation window (full screen) with restored animation
  if (showingAnimation) {
    let elapsedTime = (millis() - animationStartTime) / 1000; // Time in seconds
    let rideTime = Math.min(elapsedTime, buckOffTime !== null ? buckOffTime / 1000 : 8);
    
    animationWindow.background(240); // Light gray background
    animationWindow.fill(0);
    animationWindow.text(`${animationEventName}`, 400, 50); // Adjusted for larger window
    animationWindow.text(`${animationRiderName} vs ${gameState.selectedAnimationBull.name}`, 400, 100); // Use specific bull name
    
    animationWindow.fill(255, 0, 0);
    animationWindow.text(`Time: ${rideTime.toFixed(1)}s`, 400, 150);
    
    animateBullAndRider(animationWindow, elapsedTime, buckOffTime);
    
    image(animationWindow, 0, 0); // Top-left corner, full size
    
    if (elapsedTime >= 10) {
      showingAnimation = false;
      gameState.message = gameState.pendingMessage;
      gameState.pendingMessage = "";
      gameState.selectedAnimationBull = null;
    }
  }
}

function mousePressed() {
  if (currentMode === 'frontPage') {
    for (let button of frontPageButtons) {
      if (mouseX > button.x - button.w / 2 && mouseX < button.x + button.w / 2 &&
          mouseY > button.y - button.h / 2 && mouseY < button.y + button.h / 2) {
        if (button.text === "Start New Game") {
          currentMode = 'game';
          initializeGame(true);
        } else if (button.text === "Load Game") {
          const savedGame = localStorage.getItem('stockContractorSave');
          if (savedGame) {
            try {
              gameState = JSON.parse(savedGame);
              currentMode = 'game';
              initializeGame(false);
              gameState.message = "Game loaded successfully!";
            } catch (e) {
              alert("Error loading saved game: " + e.message + "\nStarting new game instead.");
              currentMode = 'game';
              initializeGame(true);
            }
          } else {
            alert("No saved game found! Starting new game.");
            currentMode = 'game';
            initializeGame(true);
          }
        }
      }
    }
  } else if (currentMode === 'game') {
    if (gameState.showingSaveConfirm) {
      let windowX = width / 2 - saveConfirmWindow.width / 2;
      let windowY = height / 2 - saveConfirmWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 60 && mouseY <= windowY + 90) {
        try {
          localStorage.setItem('stockContractorSave', JSON.stringify(gameState));
          gameState.message = "Game saved successfully!";
        } catch (e) {
          gameState.message = "Failed to save game: " + e.message;
        }
        gameState.showingSaveConfirm = false;
        return;
      }
      if (mouseX >= windowX + 100 && mouseX <= windowX + 180 && 
          mouseY >= windowY + 60 && mouseY <= windowY + 90) {
        gameState.showingSaveConfirm = false;
        gameState.message = "Save cancelled.";
        return;
      }
    } // Removed extra brace here
    else if (gameState.selectedBull !== null) {
      let windowX = width / 2 - statsWindow.width / 2;
      let windowY = height / 2 - statsWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 400 && mouseY <= windowY + 430) {
        gameState.selectedBull = null;
        gameState.message = "Additional stats closed.";
        return;
      }
    } else if (gameState.sellingBull && gameState.sellBullIndex !== null) {
      let windowX = width / 2 - sellConfirmWindow.width / 2;
      let windowY = height / 2 - sellConfirmWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 60 && mouseY <= windowY + 90) {
        sellBull(gameState.sellBullIndex);
        gameState.sellingBull = false;
        gameState.sellBullIndex = null;
        return;
      }
      if (mouseX >= windowX + 100 && mouseX <= windowX + 180 && 
          mouseY >= windowY + 60 && mouseY <= windowY + 90) {
        gameState.sellingBull = false;
        gameState.sellBullIndex = null;
        gameState.message = "Sell cancelled.";
        return;
      }
    } else if (gameState.showingLegends) {
      let windowX = width / 2 - legendsWindow.width / 2;
      let windowY = height / 2 - legendsWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 260 && mouseY <= windowY + 290) {
        gameState.showingLegends = false;
        gameState.message = "Legends window closed.";
        return;
      }
    } else if (gameState.showingMarket) {
      let windowX = width / 2 - marketWindow.width / 2;
      let windowY = height / 2 - marketWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 180 && mouseY <= windowY + 210) {
        gameState.showingMarket = false;
        gameState.message = "Market window closed.";
        return;
      }
    } else if (gameState.showingAchievements) {
      let windowX = width / 2 - achievementsWindow.width / 2;
      let windowY = height / 2 - achievementsWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 240 && mouseY <= windowY + 270) {
        gameState.showingAchievements = false;
        gameState.message = "Achievements window closed.";
        return;
      }
    } else if (gameState.showingEventResults) {
      let windowX = width / 2 - eventResultsWindow.width / 2;
      let windowY = height / 2 - eventResultsWindow.height / 2;
      if (mouseX >= windowX + 20 && mouseX <= windowX + 100 && 
          mouseY >= windowY + 350 && mouseY <= windowY + 380) {
        gameState.showingEventResults = false;
        gameState.message = "Event results closed.";
        return;
      }
    } else if (gameState.showingTopContractors) {
      let windowX = width / 2 - topContractorsWindow.width / 2;
      let windowY = height / 2 - topContractorsWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 180 && mouseY <= windowY + 210) {
        gameState.showingTopContractors = false;
        gameState.message = "Top Contractors window closed.";
        return;
      }
    } else if (gameState.showingTopBulls) {
      let windowX = width / 2 - topBullsWindow.width / 2;
      let windowY = height / 2 - topBullsWindow.height / 2;
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 180 && mouseY <= windowY + 210) {
        gameState.showingTopBulls = false;
        gameState.message = "Top Bulls window closed.";
        return;
      }
    } else if (gameState.showingTraining && gameState.trainingBullIndex !== null) {
      let windowX = width / 2 - trainingWindow.width / 2;
      let windowY = height / 2 - trainingWindow.height / 2;
      for (let i = 0; i < 10; i++) {
        if (mouseX >= windowX + 200 && mouseX <= windowX + 280 && 
            mouseY >= windowY + 30 + i * 20 && mouseY <= windowY + 50 + i * 20) {
          trainBull(gameState.trainingBullIndex, i + 1);
          gameState.showingTraining = false;
          gameState.trainingBullIndex = null;
          return;
        }
      }
      if (mouseX >= windowX + 10 && mouseX <= windowX + 90 && 
          mouseY >= windowY + 360 && mouseY <= windowY + 390) {
        gameState.showingTraining = false;
        gameState.trainingBullIndex = null;
        gameState.message = "Training window closed.";
        return;
      }
    } else {
      for (let i = 0; i < gameState.bulls.length; i++) {
        let y = 140 + i * 20;
        let nameWidth = textWidth(`${i + 1}. ${gameState.bulls[i].name}`);
        if (mouseX >= 80 && mouseX <= 80 + nameWidth && mouseY >= y - 16 && mouseY <= y) {
          gameState.selectedBull = i;
          gameState.message = `Showing additional stats for ${gameState.bulls[i].name}.`;
          return;
        }
      }
    }
  } // Closing brace for currentMode === 'game'
} // Closing brace for function#
  
function keyPressed() {
    if (currentMode === 'game') {
        if (gameState.selectingBull) {
            let bullIndex = parseInt(key) - 1;
            if (bullIndex >= 0 && bullIndex < gameState.bulls.length) {
                enterEvent(bullIndex);
                gameState.selectingBull = false;
            }
        } else if (gameState.renamingBull) {
            let bullIndex = parseInt(key) - 1;
            if (bullIndex >= 0 && bullIndex < gameState.bulls.length) {
                renameBull(bullIndex);
                gameState.renamingBull = false;
            }
        } else if (gameState.sellingBull) {
            let bullIndex = parseInt(key) - 1;
            if (bullIndex >= 0 && bullIndex < gameState.bulls.length) {
                gameState.sellBullIndex = bullIndex;
                gameState.message = `Confirm selling ${gameState.bulls[bullIndex].name}?`;
            }
        } else if (gameState.showingLegends) {
            let legendIndex = parseInt(key) - 1;
            if (legendIndex >= 0 && legendIndex < legendaryBulls.length) {
                buyLegendaryBull(legendIndex);
            }
        } else if (gameState.showingMarket) {
            let marketIndex = parseInt(key) - 1;
            if (marketIndex >= 0 && marketIndex < marketBulls.length) {
                buyMarketBull(marketIndex);
            }
        } else if (gameState.showingTraining && gameState.trainingBullIndex === null) {
            let bullIndex = parseInt(key) - 1;
            if (bullIndex >= 0 && bullIndex < gameState.bulls.length) {
                gameState.trainingBullIndex = bullIndex;
                gameState.message = `Select a trait to train for ${gameState.bulls[bullIndex].name}.`;
            }
        } else if (key === 'S' || key === 's') {
            if (gameState.bulls.length === 0) {
                gameState.message = "You have no bulls to sell!";
            } else {
                gameState.sellingBull = true;
                gameState.message = "Select bull to sell (1-" + gameState.bulls.length + ")";
            }
        } else if (key === 'R' || key === 'r') {
            if (gameState.bulls.length === 0) {
                gameState.message = "You have no bulls to rename!";
            } else {
                gameState.renamingBull = true;
                gameState.message = "Choose a bull to rename.";
            }
        } else if (key === 'T' || key === 't') {
            if (gameState.bulls.length === 0) {
                gameState.message = "You have no bulls to train!";
            } else {
                gameState.showingTraining = true;
                gameState.message = "Select bull to train (1-" + gameState.bulls.length + ")";
            }
        } else if (key === 'N' || key === 'n') {
            nextWeek();
        } else if (key === 'L' || key === 'l') {
            if (gameState.bulls.length >= 6) {
                gameState.message = "You already own the maximum of 6 bulls!";
            } else {
                gameState.showingLegends = true;
                gameState.message = "Select a legendary bull to buy (1-7).";
            }
        } else if (key === 'M' || key === 'm') {
            if (gameState.bulls.length >= 6) {
                gameState.message = "You already own the maximum of 6 bulls!";
            } else {
                gameState.showingMarket = true;
                gameState.message = "Select a market bull to buy (1-4).";
            }
        } else if (key === 'A' || key === 'a') {
            gameState.showingAchievements = true;
            gameState.message = "Viewing all-time achievements.";
        } else if (key === 'E' || key === 'e') {
            if (gameState.events.length > 0) {
                if (gameState.bulls.length === 0) {
                    gameState.message = "You have no bulls to enter!";
                } else {
                    gameState.selectingBull = true;
                    gameState.message = "Choose a bull to enter the event.";
                }
            }
        } else if (key === 'V' || key === 'v') {
            if (gameState.lastEventResults) {
                gameState.showingEventResults = true;
                gameState.message = "Viewing last event results.";
            } else {
                gameState.message = "No event results available yet.";
            }
        } else if (key === 'C' || key === 'c') {
            gameState.showingTopContractors = true;
            gameState.message = "Viewing Top Stock Contractors.";
        } else if (key === 'X' || key === 'x') {
            gameState.showingTopBulls = true;
            gameState.message = "Viewing Top Bulls.";
        } else if (key === 'Z' || key === 'z') {  // Moved to proper else if level
            gameState.showingSaveConfirm = true;
            gameState.message = "Confirm save game?";
        }
    }  // Closes if (currentMode === 'game')
}  // Closes function

function calculateOverallRating(bull) {
  return Math.floor(
    (bull.agility * 0.15 +
     bull.spin * 0.15 +
     bull.aggression * 0.15 +
     bull.kickingPower * 0.15 +
     bull.power * 0.15 +
     bull.headMovement * 0.10 +
     bull.directionChange * 0.10 +
     bull.kickingSpeed * 0.10 +
     bull.jumpingHeight * 0.10 +
     bull.speed * 0.10)
  );
}

function setInitialTraits(bull) {
  let targetRating = bull.overallRating;
  let baseValue = Math.floor(targetRating / 1.25);
  let variation = Math.floor((100 - baseValue) / 2);

  bull.agility = constrain(baseValue + Math.floor(random(-variation, variation + 5)), 50, 100);
  bull.spin = constrain(baseValue + Math.floor(random(-variation, variation + 5)), 50, 100);
  bull.aggression = constrain(baseValue + Math.floor(random(-variation, variation + 5)), 50, 100);
  bull.kickingPower = constrain(baseValue + Math.floor(random(-variation, variation + 5)), 50, 100);
  bull.power = constrain(baseValue + Math.floor(random(-variation, variation + 5)), 50, 100);

  bull.headMovement = constrain(baseValue + Math.floor(random(-variation, variation)), 50, 100);
  bull.directionChange = constrain(baseValue + Math.floor(random(-variation, variation)), 50, 100);
  bull.kickingSpeed = constrain(baseValue + Math.floor(random(-variation, variation)), 50, 100);
  bull.jumpingHeight = constrain(baseValue + Math.floor(random(-variation, variation)), 50, 100);
  bull.speed = constrain(baseValue + Math.floor(random(-variation, variation)), 50, 100);

  let currentRating = calculateOverallRating(bull);
  let adjustment = targetRating - currentRating;
  if (adjustment !== 0) {
    let keyAdjust = Math.floor(adjustment / 5);
    bull.agility = constrain(bull.agility + keyAdjust, 50, 100);
    bull.spin = constrain(bull.spin + keyAdjust, 50, 100);
    bull.aggression = constrain(bull.aggression + keyAdjust, 50, 100);
    bull.kickingPower = constrain(bull.kickingPower + keyAdjust, 50, 100);
    bull.power = constrain(bull.power + keyAdjust, 50, 100);
  }
}

function buyLegendaryBull(index) {
  let legend = legendaryBulls[index];
  if (gameState.money >= legend.price) {
    let newBull = {
      name: legend.name,
      overallRating: legend.overallRating,
      health: 100,
      value: legend.price,
      scores: [],
      buckOffs: [],
      rested: true,
      ageWeeks: legend.ageWeeks,
      weight: legend.weight,
      eventsCompleted: 0,
      color: legend.color,
      chuteTemperament: Math.floor(random(85, 100)),
      yearlyScores: []
    };
    setInitialTraits(newBull);
    gameState.bulls.push(newBull);
    gameState.money -= legend.price;
    gameState.message = `Bought legendary ${newBull.name} for $${legend.price}!`;
    gameState.showingLegends = false;
  } else {
    gameState.message = `Not enough money to buy ${legend.name}! Need $${legend.price}.`;
    gameState.showingLegends = false;
  }
}
function buyMarketBull(index) {
  let marketBull = marketBulls[index];
  let purchasePrice = marketBull.price; // Capture the price at the time of purchase
  
  if (gameState.money >= purchasePrice) {
    let colors = ["Black", "Red", "Brown", "White", "Gray", "Spotted", "Yellow"];
    let word1 = random(bullNameWords);
    let word2 = random(bullNameWords);
    while (word2 === word1) {
      word2 = random(bullNameWords);
    }
    let bullName = word1 + " " + word2;
    
    // Create the new bull with initial value set to purchase price
    let newBull = {
      name: bullName,
      overallRating: Math.floor(random(marketBull.ratingMin, marketBull.ratingMax + 1)),
      health: 100,
      value: purchasePrice, // Initially set to the purchase price
      scores: [],
      buckOffs: [],
      rested: true,
      ageWeeks: marketBull.ageWeeks,
      weight: Math.floor(random(1500, 2000)),
      eventsCompleted: 0,
      color: random(colors),
      chuteTemperament: Math.floor(random(50, 100)),
      yearlyScores: []
    };
    
    // Set initial traits
    setInitialTraits(newBull);
    
    // Decrease the bull's value by 5% immediately after purchase
    newBull.value = Math.floor(newBull.value * 0.95);
    // Ensure value doesn't drop below a minimum (e.g., 100)
    newBull.value = Math.max(newBull.value, 100);
    
    // Add the bull to the inventory and deduct the purchase price
    gameState.bulls.push(newBull);
    gameState.money -= purchasePrice;
        
    // Update the message to show both purchase price and new value
    gameState.message = `Bought ${newBull.name} (${marketBull.ability}) for $${purchasePrice}! Value set to $${newBull.value}.`;
    gameState.showingMarket = false;
  } else {
    gameState.message = `Not enough money to buy a ${marketBull.ability} bull! Need $${purchasePrice}.`;
    gameState.showingMarket = false;
  }
}

function sellBull(index) {
  if (index >= 0 && index < gameState.bulls.length) {
    let bull = gameState.bulls[index];
    gameState.money += bull.value;
    gameState.message = `Sold ${bull.name} for $${bull.value}!`;
    if (gameState.selectedBull === index) {
      gameState.selectedBull = null;
    } else if (gameState.selectedBull > index) {
      gameState.selectedBull--;
    }
    gameState.bulls.splice(index, 1);
  }
}

function renameBull(index) {
  let bull = gameState.bulls[index];
  let newName = prompt("Enter new name for " + bull.name + ":", bull.name);
  if (newName && newName.trim() !== "") {
    let oldName = bull.name;
    bull.name = newName.trim();
    gameState.message = `Renamed ${oldName} to ${bull.name}!`;
  } else {
    gameState.message = "Rename cancelled or invalid name entered.";
  }
}

function trainBull(index, traitIndex) {
  let bull = gameState.bulls[index];
  let cost = 1000;

  if (bull.overallRating >= 90) {
    gameState.message = `${bull.name} is fully trained! No further training possible.`;
    return;
  }

  if (gameState.money < cost) {
    gameState.message = "Not enough money to train! Need $1000.";
    return;
  }

  gameState.money -= cost;
  let increase = 3;
  let traitName;
  let originalRating = bull.overallRating;

  switch (traitIndex) {
    case 1: 
      bull.agility = constrain(bull.agility + increase, 50, 100); 
      traitName = "Agility"; 
      break;
    case 2: 
      bull.spin = constrain(bull.spin + increase, 50, 100); 
      traitName = "Spin"; 
      break;
    case 3: 
      bull.aggression = constrain(bull.aggression + increase, 50, 100); 
      traitName = "Aggression"; 
      break;
    case 4: 
      bull.kickingPower = constrain(bull.kickingPower + increase, 50, 100); 
      traitName = "Kicking Power"; 
      break;
    case 5: 
      bull.power = constrain(bull.power + increase, 50, 100); 
      traitName = "Power"; 
      break;
    case 6: 
      bull.headMovement = constrain(bull.headMovement + increase, 50, 100); 
      traitName = "Head Movement"; 
      break;
    case 7: 
      bull.directionChange = constrain(bull.directionChange + increase, 50, 100); 
      traitName = "Direction Change"; 
      break;
    case 8: 
      bull.kickingSpeed = constrain(bull.kickingSpeed + increase, 50, 100); 
      traitName = "Kicking Speed"; 
      break;
    case 9: 
      bull.jumpingHeight = constrain(bull.jumpingHeight + increase, 50, 100); 
      traitName = "Jumping Height"; 
      break;
    case 10: 
      bull.speed = constrain(bull.speed + increase, 50, 100); 
      traitName = "Speed"; 
      break;
  }

  let newRating = calculateOverallRating(bull);
  bull.overallRating = Math.min(90, Math.max(originalRating, Math.min(originalRating + 1, newRating)));

  gameState.message = `Trained ${bull.name}'s ${traitName} (+${increase}) for $1000. New Overall Rating: ${bull.overallRating}`;
}

function generateEvent() {
  let weekIndex = (gameState.week - 1) % 52;
  let eventTemplate = eventSchedule[weekIndex];
  gameState.events.push({
    name: eventTemplate.name,
    fee: eventTemplate.fee,
    transport: Math.floor(random(eventTemplate.transportMin, eventTemplate.transportMax + 1)),
    prize: Math.floor(random(eventTemplate.prizeMin, eventTemplate.prizeMax + 1))
  });
}

function simulateBullPerformance(bull, evt, contractorName, availableRiders) {
  bull.rested = false;
  bull.eventsCompleted++;
  
  let baseBuckOffChance = 0.012 * bull.overallRating - 0.3;
  let healthFactor = bull.health / 100;
  let buckOffChance = baseBuckOffChance * healthFactor;
  let buckedOff = random() < buckOffChance;
  
  let baseScore = map(bull.overallRating, 50, 95, 35, 49.75);
  let bullScore = constrain(baseScore * random(0.9, 1.1) * healthFactor, 35, 49.75);
  bull.scores.push(bullScore);
  bull.yearlyScores.push(bullScore);
  
  let rider = random(availableRiders);
  availableRiders.splice(availableRiders.indexOf(rider), 1);
  
  if (buckedOff) {
    let buckOffTime = random(0.1, 7.9).toFixed(1);
    bull.buckOffs.push({ buckedOff: true, time: buckOffTime });
    let healthLoss = Math.floor(map(parseFloat(buckOffTime), 0.1, 8, 3, 10));
    bull.health -= healthLoss;
    bull.value += Math.floor(bullScore * 10);
    return { bullName: bull.name, bullScore, riderName: rider, buckedOff: true, buckOffTime, contractorName };
  } else {
    let riderScore = random() < 0.9 ? constrain(bullScore + random(0.5, 14.75), 35, 49.75) : random(35, bullScore + 0.5);
    bull.buckOffs.push({ buckedOff: false, time: 8.0 });
    bull.health -= 10;
    bull.value += Math.floor(bullScore * 0.3);
    return { bullName: bull.name, bullScore, riderScore, riderName: rider, buckedOff: false, contractorName };
  }
}

function enterEvent(bullIndex) {
  let evt = gameState.events[0];
  let totalCost = evt.fee + evt.transport;
  if (gameState.money >= totalCost) {
    gameState.money -= totalCost;
    let bull = gameState.bulls[bullIndex];
    
    let riderPool = evt.name.includes("Velocity Tour") ? [...velocityTourRiders] : [...unleashTheBeastRiders];
    let usedRiders = [];
    
    let playerResult = simulateBullPerformance(bull, evt, gameState.contractorName, riderPool);
    usedRiders.push(playerResult.riderName);
    gameState.yearlyBullScores.player.push(playerResult.bullScore);
    
    let winnings = Math.floor(evt.prize * (playerResult.bullScore / 49.75));
    gameState.money += winnings;
    
    let results = [playerResult];
    
    for (let rival of gameState.rivals) {
      let rivalBull = random(rival.bulls);
      let rivalResult = simulateBullPerformance(rivalBull, evt, rival.name, riderPool);
      usedRiders.push(rivalResult.riderName);
      gameState.yearlyBullScores.rivals[rival.name].push(rivalResult.bullScore);
      results.push(rivalResult);
    }
    
    gameState.lastEventResults = { eventName: evt.name, results };
    
    // Calculate total score for 8-second rides
    let totalScore = playerResult.buckedOff ? playerResult.bullScore : (playerResult.bullScore + playerResult.riderScore);
    let scoreText = playerResult.buckedOff 
      ? `Bull: ${playerResult.bullScore.toFixed(2)}` 
      : `${totalScore.toFixed(2)} (Bull: ${playerResult.bullScore.toFixed(2)}, Rider: ${playerResult.riderScore.toFixed(2)})`;
    
    gameState.pendingMessage = `${bull.name} ${playerResult.buckedOff ? `bucked off at ${playerResult.buckOffTime}s` : "rode for 8s"}, scored ${scoreText} at ${evt.name}.\nWon $${winnings} vs ${playerResult.riderName}, health reduced by ${bull.health <= 0 ? "all" : playerResult.buckedOff ? Math.floor(map(parseFloat(playerResult.buckOffTime), 0.1, 8, 3, 10)) : 10}.`;
    
    if (bull.health <= 0) {
      gameState.bulls.splice(bullIndex, 1);
      if (gameState.selectedBull === bullIndex) gameState.selectedBull = null;
      else if (gameState.selectedBull > bullIndex) gameState.selectedBull--;
      gameState.pendingMessage += `\n${bull.name} has been retired due to poor health.`;
    }
    
    if (bull.eventsCompleted >= 10) {
      let avgScore = bull.scores.reduce((a, b) => a + b, 0) / bull.scores.length;
      let buckOffPct = (bull.buckOffs.filter(b => b.buckedOff).length / bull.buckOffs.length) * 100;
      if (avgScore > gameState.achievements.topAvgScore.value) {
        gameState.achievements.topAvgScore = { value: avgScore, bullName: bull.name, eventsCompleted: bull.eventsCompleted };
      }
      if (buckOffPct > gameState.achievements.topBuckOffPct.value) {
        gameState.achievements.topBuckOffPct = { value: buckOffPct, bullName: bull.name, eventsCompleted: bull.eventsCompleted };
      }
    }
    if (bull.eventsCompleted >= 1) {
      if (playerResult.bullScore > gameState.achievements.highestBullScore.value) {
        gameState.achievements.highestBullScore = { value: playerResult.bullScore, bullName: bull.name, riderName: playerResult.riderName, eventName: evt.name, eventsCompleted: bull.eventsCompleted };
      }
      if (playerResult.buckedOff && parseFloat(playerResult.buckOffTime) < gameState.achievements.fastestBuckOff.value) {
        gameState.achievements.fastestBuckOff = { value: parseFloat(playerResult.buckOffTime), bullName: bull.name, riderName: playerResult.riderName, eventName: evt.name, eventsCompleted: bull.eventsCompleted };
      }
    }
    
    // Start animation with the specific bull object
    showingAnimation = true;
    animationStartTime = millis();
    buckOffTime = playerResult.buckedOff ? parseFloat(playerResult.buckOffTime) * 1000 : null; // Convert to milliseconds
    animationBullColor = bull.color; // Still needed for drawing
    animationRiderName = playerResult.riderName;
    animationEventName = evt.name;
    // Store the specific bull object or index for animation
    gameState.selectedAnimationBull = bull; // Add this to gameState to track the exact bull
    // Set random torso color
    let torsoColors = [
      color(40, 40, 40),   // Black
      color(0, 100, 200),  // Blue
      color(139, 69, 19),  // Brown
      color(150, 50, 50)   // Red
    ];
    animationTorsoColor = random(torsoColors); // Set once per event
    
    gameState.events.shift();
  } else {
    gameState.message = "Not enough money to cover entry fee and transport!";
  }
}

function nextWeek() {
  gameState.message = "";
  if (gameState.events.length > 0) {
    gameState.events.shift();
  }
  gameState.week++;
  let maintenance = gameState.bulls.length * 100;
  gameState.money -= maintenance;
  if (gameState.money < 0) {
    gameState.message = "You're bankrupt! Game Over.";
    noLoop();
    return;
  }
  
  if (gameState.week % 52 === 0) {
    let contractors = [
      { name: gameState.contractorName, scores: gameState.yearlyBullScores.player }
    ].concat(gameState.rivals.map(r => ({ name: r.name, scores: gameState.yearlyBullScores.rivals[r.name] })));
    contractors.sort((a, b) => {
      let avgA = a.scores.length > 0 ? a.scores.reduce((sum, s) => sum + s, 0) / a.scores.length : 0;
      let avgB = b.scores.length > 0 ? b.scores.reduce((sum, s) => sum + s, 0) / b.scores.length : 0;
      return avgB - avgA;
    });
    if (contractors.length > 0) {
      if (contractors[0].name === gameState.contractorName) {
        gameState.money += 100000;
        gameState.message += `You won 1st place Stock Contractor of the Year! +$100,000 bonus.\n`;
      } else {
        gameState.message += `${contractors[0].name} won 1st place Stock Contractor of the Year.\n`;
      }
    }
    if (contractors.length > 1) {
      if (contractors[1].name === gameState.contractorName) {
        gameState.money += 50000;
        gameState.message += `You won 2nd place Stock Contractor of the Year! +$50,000 bonus.\n`;
      } else {
        gameState.message += `${contractors[1].name} won 2nd place Stock Contractor of the Year.\n`;
      }
    }
    if (contractors.length > 2) {
      if (contractors[2].name === gameState.contractorName) {
        gameState.money += 25000;
        gameState.message += `You won 3rd place Stock Contractor of the Year! +$25,000 bonus.\n`;
      } else {
        gameState.message += `${contractors[2].name} won 3rd place Stock Contractor of the Year.\n`;
      }
    }

    let allBulls = [];
    gameState.bulls.forEach(bull => allBulls.push({ name: bull.name, scores: bull.yearlyScores, contractor: gameState.contractorName }));
    gameState.rivals.forEach(rival => {
      rival.bulls.forEach(bull => allBulls.push({ name: bull.name, scores: bull.yearlyScores, contractor: rival.name }));
    });
    allBulls.sort((a, b) => {
      let avgA = a.scores.length > 0 ? a.scores.reduce((sum, s) => sum + s, 0) / a.scores.length : 0;
      let avgB = b.scores.length > 0 ? b.scores.reduce((sum, s) => sum + s, 0) / b.scores.length : 0;
      return avgB - avgA;
    });
    if (allBulls.length > 0) {
      if (allBulls[0].contractor === gameState.contractorName) {
        gameState.money += 100000;
        gameState.message += `${allBulls[0].name} won 1st place Bull of the Year! +$100,000 bonus.\n`;
      } else {
        gameState.message += `${allBulls[0].name} (${allBulls[0].contractor}) won 1st place Bull of the Year.\n`;
      }
    }
    if (allBulls.length > 1) {
      if (allBulls[1].contractor === gameState.contractorName) {
        gameState.money += 50000;
        gameState.message += `${allBulls[1].name} won 2nd place Bull of the Year! +$50,000 bonus.\n`;
      } else {
        gameState.message += `${allBulls[1].name} (${allBulls[1].contractor}) won 2nd place Bull of the Year.\n`;
      }
    }
    if (allBulls.length > 2) {
      if (allBulls[2].contractor === gameState.contractorName) {
        gameState.money += 25000;
        gameState.message += `${allBulls[2].name} won 3rd place Bull of the Year! +$25,000 bonus.\n`;
      } else {
        gameState.message += `${allBulls[2].name} (${allBulls[2].contractor}) won 3rd place Bull of the Year.\n`;
      }
    }

    gameState.yearlyBullScores.player = [];
    for (let rival in gameState.yearlyBullScores.rivals) {
      gameState.yearlyBullScores.rivals[rival] = [];
    }
    gameState.bulls.forEach(bull => bull.yearlyScores = []);
    gameState.rivals.forEach(rival => rival.bulls.forEach(bull => bull.yearlyScores = []));
    gameState.message += "Yearly rankings reset!\n";
  }
  
  for (let i = gameState.bulls.length - 1; i >= 0; i--) {
    let bull = gameState.bulls[i];
    if (bull.rested && bull.health < 100) {
      let healthGain = Math.floor(random(5, 15));
      bull.health = Math.min(100, bull.health + healthGain);
      gameState.message += `${bull.name} rested and gained ${healthGain} health.`;
    }
    bull.rested = true;
    bull.ageWeeks++;
    if (bull.ageWeeks >= 416 && bull.ageWeeks % 52 === 0) {
      let valueReduction = Math.floor(bull.value * 0.05);
      bull.value = Math.max(500, bull.value - valueReduction);
      if (valueReduction > 0) gameState.message += ` ${bull.name}'s value reduced by $${valueReduction} due to age.`;
      let ratingReduction = Math.floor(bull.overallRating * 0.05);
      bull.overallRating = Math.max(50, bull.overallRating - ratingReduction);
      if (ratingReduction > 0) gameState.message += ` ${bull.name}'s overall rating dropped to ${bull.overallRating} due to age.`;
    }
    if (bull.ageWeeks >= 520) {
      gameState.bulls.splice(i, 1);
      if (gameState.selectedBull === i) gameState.selectedBull = null;
      else if (gameState.selectedBull > i) gameState.selectedBull--;
      let years = Math.floor(bull.ageWeeks / 52);
      let weeks = bull.ageWeeks % 52;
      gameState.message += ` ${bull.name} retired at ${years} years, ${weeks} weeks.`;
    }
  }
  
  for (let rival of gameState.rivals) {
    for (let i = rival.bulls.length - 1; i >= 0; i--) {
      let bull = rival.bulls[i];
      if (bull.rested && bull.health < 100) {
        bull.health = Math.min(100, bull.health + Math.floor(random(5, 15)));
      }
      bull.rested = true;
      bull.ageWeeks++;
      if (bull.ageWeeks >= 416 && bull.ageWeeks % 52 === 0) {
        bull.value = Math.max(500, bull.value - Math.floor(bull.value * 0.05));
        bull.overallRating = Math.max(50, bull.overallRating - Math.floor(bull.overallRating * 0.05));
      }
      if (bull.ageWeeks >= 520 || bull.health <= 0) {
        rival.bulls.splice(i, 1);
        let colors = ["Black", "Red", "Brown", "White", "Gray", "Spotted", "Yellow"];
        let word1 = random(bullNameWords);
        let word2 = random(bullNameWords);
        while (word2 === word1) word2 = random(bullNameWords);
        let bullName = word1 + " " + word2;
        let overallRating = Math.floor(random(50, 91));
        let newBull = {
          name: bullName,
          overallRating: overallRating,
          health: 100,
          value: Math.floor(overallRating * 100),
          scores: [],
          buckOffs: [],
          rested: true,
          ageWeeks: Math.floor(random(156, 364)),
          weight: Math.floor(random(1500, 2000)),
          eventsCompleted: 0,
          color: random(colors),
          chuteTemperament: Math.floor(random(50, 100)),
          yearlyScores: []
        };
        setInitialTraits(newBull);
        rival.bulls.push(newBull);
      }
    }
  }
  
  generateEvent();
}  }
