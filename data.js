// FIFA World Cup 2026 Data Store

const WC_TEAMS = [
  // Group A
  { id: "MEX", name: "Mexico", group: "A", flag: "🇲🇽", p: 1, w: 1, d: 0, l: 0, gf: 2, ga: 1, gd: 1, pts: 3, form: ["W"] },
  { id: "RSA", name: "South Africa", group: "A", flag: "🇿🇦", p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 2, gd: -1, pts: 0, form: ["L"] },
  { id: "KOR", name: "South Korea", group: "A", flag: "🇰🇷", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "CZE", name: "Czechia", group: "A", flag: "🇨🇿", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group B
  { id: "CAN", name: "Canada", group: "B", flag: "🇨🇦", p: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, gd: 0, pts: 1, form: ["D"] },
  { id: "SUI", name: "Switzerland", group: "B", flag: "🇨🇭", p: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, gd: 0, pts: 1, form: ["D"] },
  { id: "BIH", name: "Bosnia & Herzegovina", group: "B", flag: "🇧🇦", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "QAT", name: "Qatar", group: "B", flag: "🇶🇦", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group C
  { id: "BRA", name: "Brazil", group: "C", flag: "🇧🇷", p: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, gd: 2, pts: 3, form: ["W"] },
  { id: "SCO", name: "Scotland", group: "C", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", p: 1, w: 0, d: 0, l: 1, gf: 0, ga: 2, gd: -2, pts: 0, form: ["L"] },
  { id: "MAR", name: "Morocco", group: "C", flag: "🇲🇦", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "HAI", name: "Haiti", group: "C", flag: "🇭🇹", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group D
  { id: "USA", name: "United States", group: "D", flag: "🇺🇸", p: 1, w: 1, d: 0, l: 0, gf: 3, ga: 1, gd: 2, pts: 3, form: ["W"] },
  { id: "AUS", name: "Australia", group: "D", flag: "🇦🇺", p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, gd: -2, pts: 0, form: ["L"] },
  { id: "PAR", name: "Paraguay", group: "D", flag: "🇵🇾", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "TUR", name: "Türkiye", group: "D", flag: "🇹🇷", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group E
  { id: "GER", name: "Germany", group: "E", flag: "🇩🇪", p: 1, w: 0, d: 1, l: 0, gf: 2, ga: 2, gd: 0, pts: 1, form: ["D"] },
  { id: "CIV", name: "Côte d'Ivoire", group: "E", flag: "🇨🇮", p: 1, w: 0, d: 1, l: 0, gf: 2, ga: 2, gd: 0, pts: 1, form: ["D"] },
  { id: "ECU", name: "Ecuador", group: "E", flag: "🇪🇨", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "CUW", name: "Curaçao", group: "E", flag: "🇨🇼", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group F
  { id: "NED", name: "Netherlands", group: "F", flag: "🇳🇱", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "JPN", name: "Japan", group: "F", flag: "🇯🇵", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "SWE", name: "Sweden", group: "F", flag: "🇸🇪", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "TUN", name: "Tunisia", group: "F", flag: "🇹🇳", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group G
  { id: "BEL", name: "Belgium", group: "G", flag: "🇧🇪", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "EGY", name: "Egypt", group: "G", flag: "🇪🇬", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "IRN", name: "Iran", group: "G", flag: "🇮🇷", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "NZL", name: "New Zealand", group: "G", flag: "🇳🇿", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group H
  { id: "ESP", name: "Spain", group: "H", flag: "🇪🇸", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "URU", name: "Uruguay", group: "H", flag: "🇺🇾", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "KSA", name: "Saudi Arabia", group: "H", flag: "🇸🇦", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "CPV", name: "Cape Verde", group: "H", flag: "🇨🇻", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group I
  { id: "FRA", name: "France", group: "I", flag: "🇫🇷", p: 1, w: 1, d: 0, l: 0, gf: 3, ga: 0, gd: 3, pts: 3, form: ["W"] },
  { id: "SEN", name: "Senegal", group: "I", flag: "🇸🇳", p: 1, w: 0, d: 0, l: 1, gf: 0, ga: 3, gd: -3, pts: 0, form: ["L"] },
  { id: "NOR", name: "Norway", group: "I", flag: "🇳🇴", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "IRQ", name: "Iraq", group: "I", flag: "🇮🇶", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group J
  { id: "ARG", name: "Argentina", group: "J", flag: "🇦🇷", p: 1, w: 1, d: 0, l: 0, gf: 2, ga: 1, gd: 1, pts: 3, form: ["W"] },
  { id: "AUT", name: "Austria", group: "J", flag: "🇦🇹", p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 2, gd: -1, pts: 0, form: ["L"] },
  { id: "ALG", name: "Algeria", group: "J", flag: "🇩🇿", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "JOR", name: "Jordan", group: "J", flag: "🇯🇴", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group K
  { id: "POR", name: "Portugal", group: "K", flag: "🇵🇹", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "COL", name: "Colombia", group: "K", flag: "🇨🇴", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "COD", name: "DR Congo", group: "K", flag: "🇨🇩", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "UZB", name: "Uzbekistan", group: "K", flag: "🇺🇿", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },

  // Group L
  { id: "ENG", name: "England", group: "L", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "GHA", name: "Ghana", group: "L", flag: "🇬🇭", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "CRO", name: "Croatia", group: "L", flag: "🇭🇷", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
  { id: "PAN", name: "Panama", group: "L", flag: "🇵🇦", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] }
];

const WC_VENUES = [
  { id: "LA", city: "Los Angeles", country: "USA", stadium: "Los Angeles Stadium (SoFi)", capacity: "70,240", image: "assets/stadium.png" },
  { id: "NYNJ", city: "New York/New Jersey", country: "USA", stadium: "MetLife Stadium", capacity: "82,500", image: "assets/hero.png" },
  { id: "DAL", city: "Dallas", country: "USA", stadium: "AT&T Stadium", capacity: "80,000", image: "assets/stadium.png" },
  { id: "MEX_C", city: "Mexico City", country: "Mexico", stadium: "Estadio Azteca", capacity: "87,523", image: "assets/hero.png" },
  { id: "MIA", city: "Miami", country: "USA", stadium: "Hard Rock Stadium", capacity: "64,767", image: "assets/stadium.png" },
  { id: "VAN", city: "Vancouver", country: "Canada", stadium: "BC Place", capacity: "54,500", image: "assets/fans.png" },
  { id: "TOR", city: "Toronto", country: "Canada", stadium: "BMO Field", capacity: "45,000", image: "assets/hero.png" },
  { id: "GDL", city: "Guadalajara", country: "Mexico", stadium: "Estadio Akron", capacity: "48,071", image: "assets/stadium.png" },
  { id: "MTY", city: "Monterrey", country: "Mexico", stadium: "Estadio BBVA", capacity: "53,500", image: "assets/fans.png" },
  { id: "ATL", city: "Atlanta", country: "USA", stadium: "Mercedes-Benz Stadium", capacity: "71,000", image: "assets/hero.png" },
  { id: "BOS", city: "Boston", country: "USA", stadium: "Gillette Stadium", capacity: "65,878", image: "assets/stadium.png" },
  { id: "HOU", city: "Houston", country: "USA", stadium: "NRG Stadium", capacity: "72,220", image: "assets/hero.png" },
  { id: "KC", city: "Kansas City", country: "USA", stadium: "Arrowhead Stadium", capacity: "76,416", image: "assets/fans.png" },
  { id: "PHI", city: "Philadelphia", country: "USA", stadium: "Lincoln Financial Field", capacity: "69,796", image: "assets/stadium.png" },
  { id: "SF", city: "San Francisco", country: "USA", stadium: "Levi's Stadium", capacity: "68,500", image: "assets/hero.png" },
  { id: "SEA", city: "Seattle", country: "USA", stadium: "Lumen Field", capacity: "69,000", image: "assets/stadium.png" }
];

const WC_MATCHES = [
  // Completed Matches
  { id: 1, group: "A", home: "MEX", away: "RSA", homeScore: 2, awayScore: 1, status: "completed", date: "2026-06-11", time: "18:00", venue: "Estadio Azteca, Mexico City", details: "Mexico secured an emotional victory in the opening match of the tournament. Goals from Santiago Giménez and Hirving Lozano sealed the win." },
  { id: 2, group: "D", home: "USA", away: "AUS", homeScore: 3, awayScore: 1, status: "completed", date: "2026-06-12", time: "20:00", venue: "MetLife Stadium, NY/NJ", details: "A brilliant performance from Christian Pulisic, who scored twice, led the USA to a convincing victory against Australia in their opener." },
  { id: 3, group: "B", home: "CAN", away: "SUI", homeScore: 1, awayScore: 1, status: "completed", date: "2026-06-12", time: "16:00", venue: "BC Place, Vancouver", details: "Alphonso Davies rescued a point for Canada with a stunning solo effort in the second half, cancelling out Breel Embolo's early header." },
  { id: 4, group: "C", home: "BRA", away: "SCO", homeScore: 2, awayScore: 0, status: "completed", date: "2026-06-13", time: "19:00", venue: "AT&T Stadium, Dallas", details: "Vinicius Jr. shone as Brazil dominated Scotland, scoring one goal and assisting Rodrygo for the second." },
  { id: 5, group: "E", home: "GER", away: "CIV", homeScore: 2, awayScore: 2, status: "completed", date: "2026-06-14", time: "15:00", venue: "Hard Rock Stadium, Miami", details: "A thrilling encounter ended in a draw, with Côte d'Ivoire fighting back from two goals down against the former world champions." },
  { id: 6, group: "I", home: "FRA", away: "SEN", homeScore: 3, awayScore: 0, status: "completed", date: "2026-06-15", time: "21:00", venue: "Mercedes-Benz Stadium, Atlanta", details: "Kylian Mbappé orchestrated a masterclass, scoring one and setting up two more as France cruised past a stubborn Senegal side." },
  { id: 7, group: "J", home: "ARG", away: "AUT", homeScore: 2, awayScore: 1, status: "completed", date: "2026-06-15", time: "17:00", venue: "NRG Stadium, Houston", details: "Lionel Messi scored a signature free-kick to guide Argentina to victory in what is expected to be his final World Cup campaign." },

  // Live Matches (Simulated for June 16, 2026)
  { id: 8, group: "G", home: "IRN", away: "NZL", homeScore: 1, awayScore: 1, status: "live", minute: 74, date: "2026-06-16", time: "12:00", venue: "Los Angeles Stadium (SoFi)", details: "A highly intense match in LA. Mehdi Taremi equalized for Iran in the 52nd minute after Chris Wood put New Zealand ahead in the first half." },
  { id: 9, group: "L", home: "ENG", away: "GHA", homeScore: 0, awayScore: 0, status: "live", minute: 15, date: "2026-06-16", time: "13:00", venue: "MetLife Stadium, NY/NJ", details: "The match has kicked off under stadium lights. England is dominating possession, but Ghana is looking extremely dangerous on counter-attacks." },

  // Upcoming Matches
  { id: 10, group: "H", home: "ESP", away: "URU", homeScore: null, awayScore: null, status: "upcoming", date: "2026-06-17", time: "15:00", venue: "AT&T Stadium, Dallas", details: "One of the most anticipated matches of the group stage. Spain's possession-based style will be tested by Uruguay's aggressive and quick transitions." },
  { id: 11, group: "K", home: "POR", away: "COL", homeScore: null, awayScore: null, status: "upcoming", date: "2026-06-17", time: "18:00", venue: "Hard Rock Stadium, Miami", details: "Portugal kicks off their campaign with Bruno Fernandes leading the midfield against Luis Díaz and a high-flying Colombian squad." },
  { id: 12, group: "F", home: "NED", away: "JPN", homeScore: null, awayScore: null, status: "upcoming", date: "2026-06-18", time: "14:00", venue: "Levi's Stadium, San Francisco", details: "An exciting tactical battle awaits as the tactical discipline of Japan faces the fluid, attacking football of the Oranje." },
  { id: 13, group: "G", home: "BEL", away: "EGY", homeScore: null, awayScore: null, status: "upcoming", date: "2026-06-18", time: "17:00", venue: "Lumen Field, Seattle", details: "Belgium's golden generation transition begins against Egypt, who will rely on the legendary Mohamed Salah for attacking inspiration." },
  { id: 14, group: "A", home: "KOR", away: "CZE", homeScore: null, awayScore: null, status: "upcoming", date: "2026-06-19", time: "13:00", venue: "BMO Field, Toronto", details: "South Korea and Czechia face off in a must-win game to keep pace with Mexico in Group A." },
  { id: 15, group: "L", home: "CRO", away: "PAN", homeScore: null, awayScore: null, status: "upcoming", date: "2026-06-19", time: "16:00", venue: "Estadio Akron, Guadalajara", details: "Croatia looks to control the midfield tempo against a physical and energetic Panama squad looking to pull off a surprise." }
];

const INITIAL_ARTICLES = [
  {
    id: "post-1",
    title: "World Cup 2026 Kicks Off in Style: Mexico Triumphs at Estadio Azteca",
    category: "Match Reports",
    author: "Elena Rostova",
    date: "June 11, 2026",
    summary: "The 2026 FIFA World Cup has officially begun! Mexico took home the opening 3 points after a thrilling victory against South Africa in front of an energetic 87,000 capacity crowd.",
    content: `Mexico kicked off the 2026 World Cup in the best possible way, securing a hard-fought 2-1 victory over South Africa at the legendary Estadio Azteca. The atmospheric stadium was a sea of green, white, and red, and the crowd got exactly what they wanted.
    
    Santiago Giménez opened the scoring in the 32nd minute with a bullet header from a Hirving Lozano cross. South Africa responded strongly in the second half, with Percy Tau equalizing in the 61st minute after a defensive mix-up.
    
    However, Lozano became the hero of the night, curling in a beautiful shot in the 78th minute to secure the three points for the co-hosts. Group A is already looking intense!`,
    image: "assets/hero.png",
    likes: 412,
    comments: [
      { author: "SoccerFan99", text: "Estadio Azteca is the greatest venue in football history! What a game!", date: "June 11, 2026" },
      { author: "BafanaBoy", text: "We played well, but Mexico's home advantage was just too strong. Keep heads high, South Africa!", date: "June 11, 2026" }
    ],
    tags: ["Mexico", "South Africa", "Group A", "Opening Match"]
  },
  {
    id: "post-2",
    title: "USA Dominates Opening Clash Against Australia Behind Pulisic Masterclass",
    category: "Match Reports",
    author: "Marcus Vance",
    date: "June 12, 2026",
    summary: "The USMNT kicked off their home World Cup campaign with a resounding 3-1 win over Australia at MetLife Stadium. Christian Pulisic was the star, scoring two brilliant goals.",
    content: `The United States Men's National Team made a statement in their opening match of the 2026 World Cup, defeating Australia 3-1 at a sold-out MetLife Stadium. 
    
    Christian Pulisic put on a captain's performance. He opened the scoring in the 14th minute after a sleek combination play with Gio Reyna. Australia equalized against the run of play through Harry Souttar's header from a corner, but the USMNT did not waver.
    
    Timothy Weah restored the lead in the 58th minute with a thunderous strike, and Pulisic sealed the win with a beautiful solo run and finish in the 79th minute. The stadium erupted, marking a brilliant start to the tournament for the co-hosts.`,
    image: "assets/stadium.png",
    likes: 589,
    comments: [
      { author: "USMNT_Loyal", text: "PULISIC IS THE GOAT! Let's go USMNT!", date: "June 12, 2026" },
      { author: "AussieRulez", text: "Tough match. Our defense was caught sleeping. Good luck to USA though.", date: "June 12, 2026" }
    ],
    tags: ["USA", "Australia", "Pulisic", "MetLife"]
  },
  {
    id: "post-3",
    title: "Host Cities Spectacle: How 16 Venues Across North America Prepared for History",
    category: "Venue Spotlights",
    author: "Sofia Martinez",
    date: "June 14, 2026",
    summary: "From Toronto's BMO Field to Mexico City's historic Estadio Azteca, we take an inside look at the 16 architectural wonders hosting the 48-team mega-tournament.",
    content: `The 2026 World Cup is a massive undertaking, spanning three countries and sixteen host cities. The preparation has been years in the making, and the results are spectacular. 
    
    From SoFi Stadium in Los Angeles, which features a futuristic dual-sided video board, to the historic Estadio Azteca, which has undergone major renovations to host its third World Cup, each venue brings its own unique character.
    
    In Canada, Toronto's BMO Field and Vancouver's BC Place have expanded their capacities and installed state-of-the-art turf systems. In the US, massive NFL stadiums like MetLife in New Jersey and AT&T in Dallas have been transformed into soccer cathedrals. This tournament represents the pinnacle of modern sports infrastructure.`,
    image: "assets/trophy.png",
    likes: 324,
    comments: [
      { author: "ArchLover", text: "The stadium designs are absolutely insane. SoFi looks like a spaceship!", date: "June 14, 2026" }
    ],
    tags: ["Stadiums", "Host Cities", "Infrastructure", "North America"]
  },
  {
    id: "post-4",
    title: "Is This Messi's Last Dance? Argentina Starts Campaign with Hard-Fought Win Over Austria",
    category: "Team Analysis",
    author: "Diego Ortega",
    date: "June 15, 2026",
    summary: "Lionel Messi's quest for a second World Cup title got off to a flying start as he scored a trademark free-kick to secure a 2-1 win for Argentina over Austria.",
    content: `All eyes were on Houston's NRG Stadium as reigning world champions Argentina began their 2026 campaign. Lionel Messi, at 38, is playing in what he has confirmed will be his final World Cup, and he started it in dramatic fashion.
    
    Austria proved to be a stubborn opponent, pressing aggressively and frustrating the Albiceleste. Argentina took the lead through Lautaro Martínez in the 41st minute, but Austria equalized early in the second half through a header from Christoph Baumgartner.
    
    Then came the moment of magic. In the 76th minute, Argentina won a free-kick 25 yards out. Messi stepped up and curled a breathtaking shot into the top-right corner, leaving the goalkeeper helpless. Argentina held on to win, sending their massive travelling support into wild celebrations.`,
    image: "assets/fans.png",
    likes: 845,
    comments: [
      { author: "Messi10", text: "Simply magical. We are privileged to watch him play.", date: "June 15, 2026" },
      { author: "AustrianVoice", text: "We played with courage. Proud of the boys despite Messi's genius.", date: "June 15, 2026" }
    ],
    tags: ["Messi", "Argentina", "Austria", "Houston"]
  }
];
