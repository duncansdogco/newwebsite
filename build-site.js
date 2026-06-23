const fs = require("fs");
const path = require("path");

// Build: 2026-05-22
const ROOT = __dirname;
const SITE = "https://duncansdogco.com";
const assetVersion = "2026-05-22-14";
const videoHero = "https://video.wixstatic.com/video/4d2311_8d73542c956846bbac4039b0b7d1acd8/720p/mp4/file.mp4";

const areas = [
  ["cobham", "Cobham", "local Cobham drop-off or short local collection routes near the A3 and M25"],
  ["wimbledon", "Wimbledon", "SW London collection routes via Raynes Park, New Malden and the A3"],
  ["clapham", "Clapham", "south west London collection routes heading out through Wandsworth and Putney"],
  ["wandsworth", "Wandsworth", "collection routes linking Wandsworth, Putney and the A3 corridor"],
  ["putney", "Putney", "collection routes from Putney toward the A3 and Cobham"],
  ["esher", "Esher", "short Surrey collection routes through Claygate, Hinchley Wood and Cobham"],
  ["balham", "Balham", "SW London collection routes via Clapham, Tooting and the A3"],
  ["earlsfield", "Earlsfield", "collection routes through Southfields, Wandsworth and Wimbledon"],
  ["southfields", "Southfields", "collection routes via Wimbledon, Putney and the A3"],
  ["raynes-park", "Raynes Park", "collection routes via New Malden, Motspur Park and the A3"],
  ["new-malden", "New Malden", "fast access to Cobham via the A3 corridor"],
  ["morden", "Morden", "collection routes via Raynes Park, New Malden and the A3"],
  ["tooting", "Tooting", "collection routes through Balham, Earlsfield and Wandsworth"],
  ["weybridge", "Weybridge", "Surrey collection routes close to Cobham, Walton and Byfleet"],
  ["walton-on-thames", "Walton-on-Thames", "Surrey collection routes through Hersham, Weybridge and Cobham"],
  ["hersham", "Hersham", "short collection routes toward Esher, Walton and Cobham"],
  ["claygate", "Claygate", "short local collection routes via Esher and Cobham"],
  ["oxshott", "Oxshott", "short Surrey collection routes close to the Cobham woodland site"],
  ["byfleet", "Byfleet", "Surrey collection routes via West Byfleet, Weybridge and Cobham"],
  ["west-byfleet", "West Byfleet", "collection routes via Byfleet, Weybridge and Cobham"],
  ["effingham", "Effingham", "Surrey collection routes toward Cobham via the local village network"],
  ["horsley", "Horsley", "collection routes along the A246/A3 side of Surrey"],
  ["st-georges-hill", "St George's Hill", "premium local collection routes near Weybridge and Cobham"],
  ["copse-hill", "Copse Hill", "SW London collection routes close to Wimbledon and Raynes Park"],
  ["motspur-park", "Motspur Park", "collection routes via New Malden, Raynes Park and the A3"]
];

const areaDetails = {
  cobham:            { postcode: "KT11", journeyMins: 5,  mainRoad: "A245 or A3",      intro: "Cobham dogs are on our doorstep. The woodland site sits just off the A245, minutes from the town centre and KT11 postcodes. Most Cobham families drop off on their morning commute and collect on the way home." },
  wimbledon:         { postcode: "SW19", journeyMins: 30, mainRoad: "A3",              intro: "We collect from Wimbledon and SW19 postcodes along the A3 corridor. The journey to our Cobham woodland takes around 30 minutes, and dogs travel with the same familiar faces from collection through to home time." },
  clapham:           { postcode: "SW4",  journeyMins: 40, mainRoad: "South Circular then A3", intro: "Collection from Clapham and SW4 runs south via the South Circular and onto the A3, reaching our Cobham woodland in around 40 minutes. Routes are planned to group Clapham dogs efficiently." },
  wandsworth:        { postcode: "SW18", journeyMins: 35, mainRoad: "A3",              intro: "Wandsworth and SW18 dogs travel south on the A3 to reach our Cobham woodland in around 35 minutes, with the same handlers from the moment of collection." },
  putney:            { postcode: "SW15", journeyMins: 35, mainRoad: "A3",              intro: "Putney is one of our busiest SW London collection areas. SW15 dogs join the A3 route south, arriving at the Cobham woodland in time for a full morning of supervised outdoor exercise." },
  esher:             { postcode: "KT10", journeyMins: 10, mainRoad: "A244 or A3",      intro: "Esher and KT10 dogs are on our doorstep. Just 10 minutes from the Cobham woodland via the A244, Esher is one of our closest and most popular collection areas." },
  balham:            { postcode: "SW12", journeyMins: 40, mainRoad: "A24 or A3",       intro: "Balham and SW12 dogs travel south via the A24 or A3 corridor to our Cobham woodland in around 40 minutes, riding with handlers they will come to know well." },
  earlsfield:        { postcode: "SW18", journeyMins: 35, mainRoad: "A3",              intro: "Earlsfield dogs join our A3 collection route south to Cobham, arriving at the woodland in around 35 minutes for a full day of supervised outdoor care." },
  southfields:       { postcode: "SW18", journeyMins: 35, mainRoad: "A3",              intro: "Southfields and SW18 dogs join our A3 corridor route to the Cobham woodland, a 35-minute journey with the same trusted team from door to woodland and back." },
  "raynes-park":     { postcode: "SW20", journeyMins: 30, mainRoad: "A3",              intro: "Raynes Park and SW20 dogs are well placed for our A3 collection route, with the Cobham woodland around 30 minutes south. One of our most established SW London pickup areas." },
  "new-malden":      { postcode: "KT3",  journeyMins: 25, mainRoad: "A3",              intro: "New Malden and KT3 dogs are just 25 minutes from our Cobham woodland via the A3, making this one of the most convenient Surrey border areas for daily collection." },
  morden:            { postcode: "SM4",  journeyMins: 35, mainRoad: "A24 or A297",     intro: "Morden and SM4 dogs travel south via the A24 corridor to our Cobham woodland in around 35 minutes. A reliable collection area for families on the southern edge of London." },
  tooting:           { postcode: "SW17", journeyMins: 40, mainRoad: "A24",             intro: "Tooting and SW17 dogs join the A24 route south toward Cobham, reaching the woodland in around 40 minutes with collection and drop-off available subject to route capacity." },
  weybridge:         { postcode: "KT13", journeyMins: 15, mainRoad: "A317 or A3",      intro: "Weybridge and KT13 dogs are close to our Cobham woodland, just 15 minutes via the A317. Early collection and consistent daily routines are easy to manage from this area." },
  "walton-on-thames":{ postcode: "KT12", journeyMins: 15, mainRoad: "A3050 or A244",   intro: "Walton-on-Thames and KT12 dogs reach our Cobham woodland in around 15 minutes. A well-established collection area with strong take-up from local families." },
  hersham:           { postcode: "KT12", journeyMins: 10, mainRoad: "A244",            intro: "Hersham dogs are just 10 minutes from the Cobham woodland via the A244 — one of our closest collection areas, ideal for families who want an early, efficient start." },
  claygate:          { postcode: "KT10", journeyMins: 12, mainRoad: "A309 or A3",      intro: "Claygate and KT10 dogs are a short drive from our Cobham woodland, around 12 minutes via the A309. One of our most consistent Surrey collection areas." },
  oxshott:           { postcode: "KT22", journeyMins: 10, mainRoad: "A244",            intro: "Oxshott and KT22 dogs are neighbours to our Cobham woodland, just 10 minutes via the A244. One of the easiest collection areas we serve, with reliable morning routines." },
  byfleet:           { postcode: "KT14", journeyMins: 20, mainRoad: "A245",            intro: "Byfleet and KT14 dogs travel to our Cobham woodland in around 20 minutes via the A245, joining a well-established Surrey route with consistent morning pickup times." },
  "west-byfleet":    { postcode: "KT14", journeyMins: 20, mainRoad: "A245",            intro: "West Byfleet and KT14 dogs reach the Cobham woodland in about 20 minutes via the A245. Collection and daily drop-off routines work well from this area." },
  effingham:         { postcode: "KT24", journeyMins: 20, mainRoad: "B2039",           intro: "Effingham and KT24 dogs reach our Cobham woodland via quiet Surrey lanes in around 20 minutes — a calm start for dogs from this corner of rural Surrey." },
  horsley:           { postcode: "KT24", journeyMins: 25, mainRoad: "A246",            intro: "Horsley and KT24 dogs travel via the A246 to our Cobham woodland in around 25 minutes. A popular area for Surrey families who want structured, licensed outdoor care." },
  "st-georges-hill": { postcode: "KT13", journeyMins: 10, mainRoad: "A317",            intro: "St George's Hill dogs are minutes from our Cobham woodland, around 10 minutes via the A317. We collect from this private estate area for established daycare clients." },
  "copse-hill":      { postcode: "SW20", journeyMins: 30, mainRoad: "A3",              intro: "Copse Hill and SW20 dogs join our A3 collection route south to Cobham, around 30 minutes from this quiet corner of Wimbledon to our private woodland." },
  "motspur-park":    { postcode: "KT3",  journeyMins: 30, mainRoad: "A3",              intro: "Motspur Park and KT3 dogs travel down the A3 to our Cobham woodland in about 30 minutes, part of our established New Malden and Raynes Park collection corridor." }
};

const servicePages = [
  {
    slug: "rescue",
    nav: "Rescue Dogs",
    title: "Rescue Dog Daycare in Cobham",
    description: "Rescue dog daycare in Cobham with calm introductions, gentle socialisation and woodland enrichment at Duncan's Dog Co.",
    keywords: "rescue dog daycare Cobham, rescue dog socialisation Surrey, dog daycare for rescue dogs",
    intro: "Gentle woodland care for rescue dogs who need patience, routine and a team willing to go at their pace.",
    heroData: {
      eyebrow: "Rescue Dogs · Cobham, Surrey",
      displayTitle: "Calm, gentle care.<br><span>No pressure. No rush.</span>",
      text: "A patient woodland daycare path for rescue dogs who need trust, routine and kind introductions.",
      video: videoHero,
      stats: [["All", "Breeds<br>Welcome"], ["Slow", "Introductions"], ["5★", "Licensed<br>Rating"]]
    },
    sections: [
      ["No pressure, no rush", "Rescue dogs can need slower introductions, quieter handling and time to build trust. We shape the plan around the individual dog."],
      ["Calm socialisation", "When social contact is right, we introduce suitable dogs carefully and watch body language closely."],
      ["A known routine", "Consistent handlers, familiar routes and repeat attendance can help rescue dogs settle into daycare safely."]
    ],
    faqs: [
      ["Can nervous rescue dogs attend daycare?", "Sometimes, yes. We start with a careful enquiry and visit to understand whether daycare is the right environment."],
      ["Do rescue dogs have to mix with groups?", "No. Introductions are gradual and guided by the dog's confidence and behaviour."],
      ["Can you collect rescue dogs?", "Collection depends on the dog, route and travel confidence. We discuss this before regular bookings."]
    ]
  },
  {
    slug: "daycare",
    nav: "Daycare",
    title: "Woodland Dog Daycare in Cobham, Surrey",
    description: "Woodland dog daycare in Cobham, Surrey, with safe collection across Surrey and SW London, 40 acres of private woodland, and 5-star licensed care.",
    keywords: "dog daycare Cobham, doggy daycare Cobham, dog daycare Surrey, woodland dog daycare, dog daycare with collection",
    intro: "Duncan's Dog Co. gives dogs a real outdoor day: supervised woodland walks, social time, rest, enrichment and transport that fits busy owners.",
    heroData: {
      eyebrow: "Doggy Daycare · Cobham, Surrey",
      displayTitle: "One family.<br><span>One facility. The same woodland your dog has loved since 2011.</span>",
      text: "Open 365 days a year. Collection and drop-off available. All breeds welcome. No exceptions.",
      video: "https://video.wixstatic.com/video/4d2311_4f69513e7b90432091a736d2048ba14b/720p/mp4/file.mp4",
      stats: [["15+", "Years<br>Running"], ["40+", "Acres of<br>Woodland"], ["1:6", "Staff<br>Ratio"], ["5★", "Licensed<br>Rating"]]
    },
    sections: [
      ["Why woodland daycare works", "Our Cobham site gives dogs space to move, sniff and decompress. Days are structured around safe social groups, handler supervision and the kind of natural enrichment that indoor daycare cannot match."],
      ["Collection and drop-off", "We offer dog daycare with collection across many Surrey and South West London routes. Drop-off at Cobham is also available and works well for families near the A3 or M25."],
      ["What is included", "A full daycare day includes supervised woodland exercise, socialisation, rest breaks, handler care, photo updates where practical, and a team who know your dog as an individual."]
    ],
    faqs: [
      ["Is this dog daycare in Cobham suitable for nervous dogs?", "Often, yes. We assess dogs individually and introduce them gently, starting with a visit before regular daycare begins."],
      ["Do you collect dogs from SW London?", "Yes, route-dependent collection is available across areas including Wimbledon, Clapham, Putney, Wandsworth, Balham and Earlsfield."],
      ["Is woodland daycare better than a dog walker?", "It depends on the dog. Daycare suits dogs who benefit from longer enrichment, supervised social groups and a consistent routine."]
    ]
  },
  {
    slug: "puppies",
    nav: "Puppies",
    title: "Puppy Daycare and Puppy School in Cobham",
    description: "Puppy daycare and puppy school in Cobham for young dogs across Surrey and SW London, with gentle socialisation, confidence building and woodland enrichment.",
    keywords: "puppy daycare Surrey, puppy school Cobham, puppy daycare Cobham",
    intro: "The puppy pathway helps young dogs learn the world carefully: calm handling, safe socialisation, recall foundations, travel confidence and positive woodland experiences.",
    heroData: {
      eyebrow: "Puppy Daycare · Cobham, Surrey",
      displayTitle: "The best start<br><span>your puppy will ever get.</span>",
      text: "Socialisation, training, habituation and woodland adventure, woven into every single day.",
      video: "https://video.wixstatic.com/video/4d2311_5b23afdf17844bf682dc5825d78931c9/720p/mp4/file.mp4",
      stats: [["15+", "Years<br>Running"], ["Small", "Puppy<br>Groups"], ["1:6", "Staff<br>Ratio"], ["5★", "Licensed<br>Rating"]]
    },
    sections: [
      ["A calmer start", "Puppies need more than exercise. They need appropriate exposure, rest, kind handling and trusted adults who can read their body language."],
      ["Socialisation without overwhelm", "We build confidence gradually with suitable dogs, quiet moments and practical learning, avoiding the chaos that can make puppies worried or over-aroused."],
      ["From puppy school to daycare", "As your puppy matures, we can help them move into regular woodland daycare when they are ready for longer days and bigger adventures."]
    ],
    faqs: [
      ["What age can puppies start?", "This depends on vaccinations, temperament and confidence. Enquire and we will advise the right first step."],
      ["Is puppy school in Cobham outdoors?", "Much of the learning is built around real-world woodland and handling experiences at our Cobham site."],
      ["Do you collect puppies?", "Collection may be available once your puppy is settled and the route works for their age and routine."]
    ]
  },
  {
    slug: "sleepovers",
    nav: "Sleepovers",
    title: "Dog Boarding and Sleepovers in Cobham",
    description: "Dog boarding and sleepovers in Cobham for settled Duncan's Dog Co. dogs. A familiar alternative to kennels for Surrey families.",
    keywords: "dog boarding Cobham, dog sleepovers Surrey, dog boarding Surrey, not kennels",
    intro: "Sleepovers are for dogs who already know us, so overnight care feels familiar, calm and connected to their usual daycare routine.",
    heroData: {
      eyebrow: "Sleepovers · Cobham, Surrey",
      displayTitle: "Full days.<br><span>Calm nights.</span>",
      text: "Home-from-home overnight boarding at our Cobham cottage. A full day in the woodland with every stay.",
      video: "https://video.wixstatic.com/video/4d2311_8044be8e15474641973691fadcdbc012/1080p/mp4/file.mp4",
      stats: [["5★", "Licensed<br>Boarding"], ["40+", "Acres of<br>Woodland"], ["1:6", "Staff<br>Ratio"], ["15+", "Years<br>Running"]]
    },
    sections: [
      ["Not kennels", "Our sleepovers are designed around familiar people, known routines and dogs who are already comfortable with Duncan's Dog Co."],
      ["Best for existing dogs", "Boarding works best when your dog has already attended daycare or completed a proper introduction, so we know their needs before an overnight stay."],
      ["Peace of mind", "You get continuity: the same care philosophy, the same woodland setting and a team who already understands your dog."]
    ],
    faqs: [
      ["Can new dogs book sleepovers immediately?", "Usually sleepovers are best for dogs already settled with us. Start with an enquiry and trial day."],
      ["Is this dog boarding in Cobham licensed?", "Duncan's Dog Co. lists daycare and boarding licence details in the site footer and enquiry materials."],
      ["How is this different from kennels?", "The emphasis is on familiarity, small-team care and known dogs rather than a kennel-style environment."]
    ]
  }
];

const blogPosts = [
  ["woodland-dog-daycare-vs-indoor-dog-daycare", "Woodland vs Indoor Dog Daycare", "Discover why woodland dog daycare gives dogs more space, richer scents, natural shelter and calmer enrichment compared to indoor daycare facilities in Cobham and Surrey.", "blogFresh1"],
  ["dog-daycare-with-collection-wimbledon", "Dog Daycare with Collection in Wimbledon", "Everything Wimbledon dog owners should know about safe daily collection, journey times and arriving at Duncan's Dog Co. woodland daycare in Cobham.", "blogFresh2"],
  ["dog-daycare-collection-clapham-putney-wandsworth", "Dog Daycare: Clapham, Putney & Wandsworth", "How daily collection works for dogs in Clapham, Putney and Wandsworth travelling to Duncan's Dog Co. woodland daycare in Cobham, Surrey.", "blogFresh3"],
  ["dog-boarding-vs-kennels", "Dog Boarding vs Kennels", "A practical comparison of dog boarding, kennels, home care and sleepovers to help owners in Cobham and Surrey choose the right overnight care for their dog.", "blogFresh4"],
  ["what-to-look-for-in-licensed-dog-daycare", "Licensed Dog Daycare: What to Look For", "What every owner should check before choosing a dog daycare: licensing, staff ratios, trial days, safety protocols and honest care standards in Cobham and Surrey.", "blogFresh5"],
  ["puppy-daycare-vs-puppy-classes", "Puppy Daycare vs Puppy Classes", "Puppy daycare and puppy classes serve different purposes. Find out how each supports socialisation, training and development, and what to consider in Cobham and Surrey.", "blogFresh6"],
  ["how-trial-days-work", "How Trial Days Work", "Find out how our trial day process works at Duncan's Dog Co. in Cobham: what we assess, how dogs are introduced to the group and what to expect on the day.", "blogFresh7"],
  ["why-collection-is-part-of-care", "Why Dog Collection Is Part of the Care", "Why safe collection and drop-off is a core part of quality dog daycare, not just a convenience. How Duncan's Dog Co. approaches transport across Surrey and SW London.", "blogFresh8"],
  ["rescue-dog-daycare-gentle-introductions", "Rescue Dog Daycare: Gentle Introductions", "A gentle guide for rescue dog owners considering daycare in Cobham. How to introduce rescue dogs to group settings slowly, safely and at the right pace.", "blogFresh9"],
  ["woodland-daycare-when-it-rains", "Woodland Daycare in Wet Weather", "How Duncan's Dog Co. keeps woodland daycare enjoyable in wet British weather, with natural shelter, drying routines and dog comfort built into every session.", "blogFresh10"],
  ["dog-daycare-vs-dog-walker", "Dog Daycare vs Dog Walker: Which Is Right for Your Dog?", "A practical guide to help Surrey and South West London owners decide between a dog walker and woodland dog daycare — and what really makes the difference for your dog's day.", "woodlandPack"],
  ["is-my-dog-ready-for-daycare", "How to Know If Your Dog Is Ready for Daycare", "Not every dog is ready for group daycare straight away. Here is how to read the signs, what to expect from a good trial day and how to find the right pace for your dog.", "goldenPair"],
  ["dog-daycare-cobham-guide", "Dog Daycare in Cobham: A Guide for Surrey Families", "Everything local families should know about choosing dog daycare in Cobham — what a good day looks like, how collection works across Surrey, and what licensed care actually means.", "handler"]
];

const blogArticleContent = {
  "woodland-dog-daycare-vs-indoor-dog-daycare": [
    ["The main difference", ["Indoor daycare can suit some dogs, but woodland daycare gives dogs space, scent and natural variety. They are not just kept busy; they are using their senses outside."]],
    ["Why it helps", ["Trees, tracks, weather, leaves and smells make the day naturally enriching. The woodland also gives dogs room to pause, sniff, move and settle without feeling crowded."]],
    ["How Duncan's does it", ["Our Cobham site combines outdoor freedom with structure: known groups, familiar staff, rest, supervision and safe routines from collection to home time."]]
  ],
  "dog-daycare-with-collection-wimbledon": [
    ["A practical option for Wimbledon owners", ["Collection makes woodland daycare possible for busy Wimbledon families who cannot drive to Cobham every week. We check each postcode against current route capacity before confirming."]],
    ["The journey matters", ["Dogs travel in people carriers with our daycare team. The same familiar staff stay involved when the dogs arrive, so collection feels part of the care day rather than a separate handover."]],
    ["Getting started", ["Send an enquiry with your Wimbledon postcode and your dog's details. We will talk through collection, meet and greet, trial day and the right weekly routine."]]
  ],
  "dog-daycare-collection-clapham-putney-wandsworth": [
    ["SW London to Cobham", ["Clapham, Putney and Wandsworth owners often need proper daycare with collection, not just a quick local walk. Our routes are planned around the dogs attending that day."]],
    ["What to ask before booking", ["Ask who drives, how dogs are grouped, how long journeys usually take and whether the driver is part of the daycare team. Those details matter for safety and confidence."]],
    ["Why the woodland is worth the trip", ["Once dogs arrive, they get a full outdoor day in private Cobham woodland with supervised groups, rest and familiar handlers."]]
  ],
  "dog-boarding-vs-kennels": [
    ["Kennels can work for some dogs", ["Traditional kennels are practical, but they can feel separate from a dog's normal routine. Some confident dogs cope well; others need something softer."]],
    ["Sleepovers feel familiar", ["Our sleepovers are for dogs who already know Duncan's Dog Co. They spend the day in the woodland, then settle overnight with familiar people, not in a kennel block."]],
    ["Best after a trial", ["A successful daycare visit helps us understand your dog first. That makes overnight care calmer, kinder and more predictable."]]
  ],
  "what-to-look-for-in-licensed-dog-daycare": [
    ["Check the basics", ["Look for licensing, insurance, clear ratios, safe spaces, proper records and a team who can explain how the day works. A good daycare should be open about its standards."]],
    ["Ask about introductions", ["Dogs should not be thrown straight into a group. Ask about meet and greets, trial days, grouping, rest, handling and what happens if a dog needs a slower plan."]],
    ["Look for consistency", ["Dogs settle best when routines and people are familiar. At Duncan's, the same connected team supports dogs from collection through to home time."]]
  ],
  "puppy-daycare-vs-puppy-classes": [
    ["They do different jobs", ["Puppy classes teach skills in short sessions. Puppy daycare supports confidence through routine, socialisation, rest, handling, travel and real-world experiences."]],
    ["Puppies need gentle structure", ["Young dogs should not be overwhelmed. They need short positive exposures, calm introductions and plenty of rest while they learn how the world works."]],
    ["Our puppy pathway", ["Puppy School at Duncan's is built around age-appropriate woodland experiences, positive handling and gradual confidence, separate from busy adult groups until puppies are ready."]]
  ],
  "how-trial-days-work": [
    ["Why we do them", ["Trial days help us understand whether daycare is the right fit. We look at confidence, travel comfort, sociability, play style, recovery and how your dog responds to the team."]],
    ["Before the day", ["It starts with an enquiry and meet and greet. We talk through your dog, your area, their routine and whether collection or drop-off makes most sense."]],
    ["After the trial", ["We will be honest. Some dogs are ready to join, some need a slower plan, and some may be better suited to another type of care."]]
  ],
  "why-collection-is-part-of-care": [
    ["It starts at the front door", ["For many dogs, the daycare day starts when we collect them. A calm, familiar collection can set the tone for the whole day."]],
    ["Same team, less handover", ["Our drivers are part of the daycare team. That means the people collecting your dog understand behaviour, routine and how the dog is doing that day."]],
    ["Safer, calmer journeys", ["We use people carriers and plan routes carefully. Dogs are grouped thoughtfully so travel feels as settled as possible."]]
  ],
  "rescue-dog-daycare-gentle-introductions": [
    ["No pressure, no rush", ["Rescue dogs often need time to understand new people, new dogs and new routines. Daycare should never be forced."]],
    ["What we look for", ["We look at confidence, body language, recovery time, dog sociability and whether the woodland environment feels helpful or too much."]],
    ["A gentle route in", ["Some rescue dogs settle beautifully with calm introductions and familiar handlers. Others need a slower plan. The honest answer is always the kindest one."]]
  ],
  "woodland-daycare-when-it-rains": [
    ["Rain does not stop the day", ["We are an outdoor woodland daycare, so British weather is part of the routine. Most dogs love the smells, puddles and adventure that come with rain."]],
    ["Shelter and comfort matter", ["Our woodland gives a natural canopy from the rain, and we also have indoor spaces for rest, drying and comfort when dogs need a break."]],
    ["Home happy, not miserable", ["Dogs are towel-dried and settled before heading home. The aim is a proper outdoor day, followed by comfort and care before drop-off."]]
  ],
  "dog-daycare-vs-dog-walker": [
    ["What each one actually does", [
      "A dog walker takes your dog out for 30 to 60 minutes, usually with a group of other dogs from different households, then returns them home. It solves the toilet break problem and gets some fresh air into the day.",
      "Dog daycare is a full day of structured care. Dogs are collected in the morning, spend the day in a managed group with qualified staff, and are returned home in the evening. It is not just exercise — it is routine, socialisation, rest and consistency."
    ]],
    ["When a dog walker is the right choice", [
      "Dog walkers work well for dogs who are settled at home, do not show signs of boredom or separation anxiety, and just need a midday break. If your dog is content with their own company and does not need much stimulation, a good walker may be exactly enough.",
      "They can also work alongside daycare — some owners use daycare two or three days a week and a walker on other days, giving dogs variety without overloading them."
    ]],
    ["When daycare works better", [
      "If your dog struggles when left alone, becomes destructive or anxious, barks continuously, or needs more than a short walk can give them, daycare is usually the better fit. Dogs who are highly social, energetic or still young often thrive with the structure and company of a full daycare day.",
      "Daycare also suits owners who are out of the house for long hours. A 30-minute walk in the middle of a nine-hour absence is not enough for most dogs. Daycare removes that problem entirely."
    ]],
    ["What to ask before you choose", [
      "For a dog walker, ask how many dogs are in each walk, whether they are all known to each other, and what happens if a dog has an incident on the walk. Ask to see their insurance and check they have first aid training.",
      "For a daycare, ask about licensing, staff ratios, how dogs are grouped, what the trial day looks like, and whether the same team is with the dogs all day. The answers will tell you a lot about how seriously they take the care."
    ]],
    ["What woodland daycare adds", [
      "At Duncan's Dog Co., dogs spend their day outdoors in 40 acres of private woodland in Cobham. They move, sniff, rest and explore in a way that a park walk or garden simply cannot replicate. The sensory richness of the woodland — the scents, the textures, the natural shelter — makes for a genuinely tired and settled dog at the end of the day.",
      "Collection is available across Surrey and South West London, so families in Wimbledon, Putney, Esher and beyond can access proper daycare without needing to travel themselves. If you are weighing up a walker versus daycare, feel free to get in touch and talk it through."
    ]]
  ],
  "is-my-dog-ready-for-daycare": [
    ["The signs worth looking for", [
      "Dogs who do well in daycare tend to show curiosity around other dogs, recover quickly from new situations and settle back into calm after excitement. They do not need to be the most confident dog in the room — plenty of quieter dogs thrive in the right daycare environment — but they should be able to engage with other dogs without consistent fear or aggression.",
      "If your dog shows strong anxiety in new environments, reacts badly to unfamiliar dogs or has a history of serious incidents with other animals, daycare may not be the right fit right now. A slower, more gradual introduction to group settings is usually a better starting point."
    ]],
    ["Age and energy are not everything", [
      "Young, energetic dogs often do brilliantly in daycare, but so do older dogs who enjoy gentle social time and a change of scenery. The right daycare will adapt to the dog in front of them, not just the stereotype of what a daycare dog looks like.",
      "Puppies from around 12 weeks old can join a puppy-specific programme rather than full adult daycare. This gives younger dogs the right pace, the right group and the right amount of stimulation without overwhelming them."
    ]],
    ["What a good trial day looks like", [
      "Any reputable daycare should offer a trial day before asking for a full commitment. This is not just a formality — it is the most honest way to assess whether daycare is genuinely right for your dog. During a trial, good staff will observe how your dog settles, how they interact with the group, how they travel, and how they recover from new experiences.",
      "At Duncan's, the trial day starts with a meet and greet at the facility. We talk through your dog's history, temperament and routine before they join a group. After the trial, we give you honest feedback. Some dogs are ready to start; others benefit from a slower introduction; and occasionally a dog is simply better suited to a different type of care."
    ]],
    ["Dogs who need more time", [
      "Not being ready for daycare now does not mean never. Some dogs need a few months of basic training and confidence building before group care is the right step. Others need their recall, their reactivity or their anxiety addressed first.",
      "If a daycare tells you your dog is not ready, take that seriously. It is a sign they are being honest with you rather than just taking the booking. A slower route in — one that matches where your dog actually is — will always produce better long-term results."
    ]],
    ["Getting started from Cobham, Surrey and SW London", [
      "If you think your dog might be ready, or you are not sure and want a professional opinion, the best first step is a conversation. Tell us about your dog, your area and what you are hoping daycare will do for them. We will be straightforward about whether it sounds like a good fit.",
      "Collection is available across Surrey and South West London including Wimbledon, Esher, Putney, Wandsworth, Weybridge and more. Enquire through the website and we will take it from there."
    ]]
  ],
  "dog-daycare-cobham-guide": [
    ["Why Cobham works as a daycare base", [
      "Cobham sits at a natural meeting point for collection routes running south from London and east from Surrey. The A3 brings dogs in from Wimbledon, Putney and Clapham. The A244 and local roads connect Esher, Hersham, Weybridge and Walton-on-Thames. That geography means a single woodland site can serve a wide catchment without impractically long journeys.",
      "Duncan's Dog Co. has operated from this Cobham site since 2011. The facility is built around 40 acres of private woodland — not a shared park, not a fenced paddock, but a genuine woodland environment managed specifically for dog daycare."
    ]],
    ["What a good daycare day actually looks like", [
      "Dogs are collected in the morning by the daycare team and transported to the woodland site. Once there, they spend the day in managed groups — not all together, but in groups matched by size, temperament and energy level. The day involves outdoor time, rest, social interaction and supervised play.",
      "Good daycare is not just managed chaos. Dogs should have rest periods built in, particularly younger or less experienced dogs. They should always have access to water, shade and somewhere calm. And the same familiar faces should be with them throughout — not a rotating door of different staff."
    ]],
    ["How collection works across Surrey", [
      "Collection is one of the things that makes a Cobham woodland daycare genuinely practical for families who cannot drive out themselves. Route capacity is limited so that dogs are not sitting in vehicles for unreasonable lengths of time. Most collection journeys from the core areas take between 10 and 40 minutes depending on the postcode.",
      "Families in Wimbledon, Clapham, Putney, Wandsworth, Balham, Earlsfield and Southfields make up our South West London routes. Surrey collection covers Esher, Cobham, Claygate, Oxshott, Hersham, Weybridge, Walton-on-Thames and the surrounding areas. If you are unsure whether your postcode is covered, it is always worth asking."
    ]],
    ["What licensed daycare actually means", [
      "Dog daycare in England is regulated under the Animal Welfare (Licensing of Activities Involving Animals) Regulations 2018. Any business providing group dog daycare for money must hold a licence issued by their local council. The licence involves an inspection against set welfare standards covering space, staffing, safety, records and animal handling.",
      "Duncan's Dog Co. holds a 5-star daycare licence issued by Elmbridge Borough Council. That rating reflects our standards across welfare, facilities, staffing and record keeping. It is not self-awarded — it is assessed by an independent council inspector. When choosing daycare, always ask to see the licence certificate and check the rating."
    ]],
    ["Getting started", [
      "The first step is an enquiry. Tell us your postcode, a little about your dog and what kind of routine you are looking for. We will check collection availability and arrange a meet and greet at the facility so you can see the woodland and meet the team before any commitment is made.",
      "After a successful meet and greet, we arrange a trial day. That gives us the chance to see how your dog settles, and gives you honest feedback on whether daycare is the right fit. There is no pressure and no obligation. If daycare is right for your dog, we will make it work."
    ]]
  ]
};

const socialLinks = [
  ["Instagram", "https://www.instagram.com/duncansdogco"],
  ["Facebook", "https://www.facebook.com/duncansdogco"],
  ["TikTok", "https://www.tiktok.com/@duncansdogco_"]
];

const gallery = {
  woodlandSolo: "PHOTO-2025-05-20-11-36-26 (1).jpg",
  woodlandGroup: "PHOTO-2025-11-18-21-34-53.jpg",
  handler: "PHOTO-2025-11-20-01-47-02.jpg",
  goldenPair: "PHOTO-2025-11-21-21-52-24.jpg",
  groupLineup: "PHOTO-2025-11-21-21-52-29.jpg",
  woodlandPack: "PHOTO-2025-12-02-19-20-08.jpg",
  portrait: "PHOTO-2025-12-10-21-59-58.jpg",
  bridgePack: "PHOTO-2025-12-10-22-00-15.jpg",
  bridgePackWide: "PHOTO-2025-12-10-22-00-17.jpg",
  familyRunTeam: "family-run-team-certificates.png",
  puppyWoodland: "PHOTO-2026-01-18-17-26-48.jpg",
  puppyWoodlandCloseup: "puppy-woodland-closeup.jpg",
  puppyCutout: "puppy-cutout.png",
  puppyDesensitisationVideo: "puppy-desensitisation.mp4",
  homeRescue: "PHOTO-2026-03-25-19-53-52.jpg",
  homeDaycare: "PHOTO-2026-05-08-20-55-17.jpg",
  homePuppy: "PHOTO-2026-01-18-17-26-48.jpg",
  homeSleepover: "PHOTO-2026-01-22-20-42-33.jpg",
  homeSplit: "family-run-team-certificates.png",
  homeQuote: "PHOTO-2026-03-25-19-16-19.jpg",
  blogFresh1: "blog-fresh-01.jpeg",
  blogFresh2: "blog-fresh-02.jpeg",
  blogFresh3: "blog-fresh-03.jpeg",
  blogFresh4: "blog-fresh-04.jpeg",
  blogFresh5: "blog-fresh-05.jpeg",
  blogFresh6: "blog-fresh-06.jpeg",
  blogFresh7: "blog-fresh-07.jpeg",
  blogFresh8: "blog-fresh-08.jpeg",
  blogFresh9: "blog-fresh-09.jpeg",
  blogFresh10: "blog-fresh-10.jpeg"
};

const teamMembers = [
  {
    name: "Duncan",
    role: "Co-Founder",
    tenure: "Since 2011",
    image: "https://static.wixstatic.com/media/4d2311_71d31db36d044db68e9c682627720df9~mv2.avif/v1/fill/w_886,h_862,al_c,q_85,enc_avif,quality_auto/DDDheadshots18%20(118%20of%20355).avif",
    bio: "Growing up, Duncan's mum's best friend was a German Shepherd trainer, so he was always surrounded by incredible dogs. He was known as the 'crazy dog man', and that early connection turned into a lifelong passion and a business he's proud of.",
    label: "Favourite breed",
    value: "German Shepherds"
  },
  {
    name: "Jess",
    role: "Co-Founder",
    tenure: "Since 2011",
    image: "https://static.wixstatic.com/media/4d2311_2cf2add1a8d542ec8885bdb55b96c277~mv2.avif/v1/fill/w_886,h_862,al_c,q_85,enc_avif,quality_auto/DDDheadshots18%20(67%20of%20355).avif",
    bio: "Jess grew up surrounded by German Shepherds and horses, which sparked a lifelong love for animals. That passion has shaped the way she connects with and cares for every dog at Duncan's.",
    label: "Favourite breed",
    value: "Cane Corso"
  },
  {
    name: "Becks",
    role: "Daycare Manager",
    tenure: "13 years",
    image: "https://static.wixstatic.com/media/4d2311_a7691b5ffe5f4bcd8718763a55b3b92f~mv2.avif/v1/fill/w_886,h_862,al_c,q_85,enc_avif,quality_auto/Becks.avif",
    bio: "After years in events and a stint running a brand roadshow for Nestle Purina, Becks discovered her love for working with dogs and went on to study canine behaviour. She joined DDC in its early days, back when it was just a field and some waterproofs, and has helped shape everything since.",
    label: "At DDC since",
    value: "The very early days"
  },
  {
    name: "Nick",
    role: "Operations Manager",
    tenure: "8 years",
    image: "https://static.wixstatic.com/media/4d2311_cb2be3e63fe04dff83c65a13ab626bc9~mv2.avif/v1/fill/w_886,h_862,al_c,q_85,enc_avif,quality_auto/7FFD924C-CF35-4839-B806-7F7E6E723D8C.avif",
    bio: "Nick describes working at DDC as owning 100 dogs but getting to give them back at the end of the day. He grew up with Border Collies and loves the connections he builds with dogs and their owners out in the woodland.",
    label: "Favourite breed",
    value: "Border Collie"
  },
  {
    name: "Kelly",
    role: "Company Secretary",
    tenure: "10 years",
    image: "https://static.wixstatic.com/media/4d2311_7316226d90044df3afb4293738eeb277~mv2.avif/v1/fill/w_886,h_862,al_c,q_85,enc_avif,quality_auto/DDDheadshots18%20(262%20of%20355).avif",
    bio: "Kelly joined as Grooming Manager ten years ago, bringing nearly 20 years of grooming expertise. She now runs operations as Company Secretary and is one of the longest-serving and most integral members of the DDC family.",
    label: "Her dog",
    value: "Margot, a Cane Corso"
  },
  {
    name: "Eleanor",
    role: "Puppy Manager & Driver",
    tenure: "4 years",
    image: "https://static.wixstatic.com/media/4d2311_637a60a900824e39a55374001c480b09~mv2.avif/v1/fill/w_886,h_862,al_c,q_85,enc_avif,quality_auto/IMG_1690_JPG.avif",
    bio: "Eleanor leads our puppy programme and holds dog behaviour qualifications. She eats, sleeps and breathes puppies. She knows every pup's personality, reads their body language instinctively, and builds the kind of trust that means nervous arrivals leave as confident, happy dogs. She is the reason our puppy families come back year after year.",
    label: "Her dog",
    value: "Pippin, a toy Yorkie"
  },
  {
    name: "Michaela",
    role: "Driver & Carer",
    tenure: "6 years",
    image: "https://static.wixstatic.com/media/4d2311_232bf220cb304fcfa3ffef1e7c12cd6e~mv2.jpg/v1/fill/w_980,h_1742,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-02-07%20at%2010_05_edited.jpg",
    bio: "Michaela has been at DDC for six years and loves every day of it. She builds real relationships with every dog and every owner, and you may well recognise her from the DDC TikTok.",
    label: "Best part of the job",
    value: "The dogs and their owners"
  },
  {
    name: "Holly",
    role: "Boarding Manager",
    tenure: "3 years",
    image: "https://static.wixstatic.com/media/4d2311_2706ef08752e4e39acf208b3af521bd7~mv2.jpg/v1/fill/w_980,h_1316,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/PHOTO-2025-02-25-10-48-41%202.jpg",
    bio: "Holly grew up with a Springer Spaniel called Peppa and has always loved dogs. She manages all boarding at DDC, making sure every overnight guest feels completely at home, and she'll tell you it's nothing like a typical 9-5.",
    label: "Favourite breed",
    value: "Spaniels"
  },
  {
    name: "Becky",
    role: "Social Media & Driver",
    tenure: "Since 2024",
    image: "https://static.wixstatic.com/media/4d2311_3455d69b1898477080e19e48298653cb~mv2.jpeg/v1/fill/w_980,h_1277,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-02-07%20at%2011_08_37.jpeg",
    bio: "Becky joined in June 2024 and covers the Earlsfield area. She has a Spaniel of her own, so she knows exactly what makes them tick, and she's built brilliant relationships with her dogs and their owners along the way.",
    label: "Favourite breed",
    value: "Spaniels"
  },
  {
    name: "Carlton",
    role: "Driver & Carer",
    tenure: "",
    image: "https://static.wixstatic.com/media/4d2311_7268ad1d66b64770a00d7b22cd3195b3~mv2.jpeg/v1/fill/w_980,h_1457,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-11-10%20at%2022_32_24.jpeg",
    bio: "Carlton spends his time off exploring woods and parks on his mountain bike with his dog, so working at DDC is a natural fit. He doesn't have a favourite breed; every dog has a different personality and he loves them for it.",
    label: "Favourite breed",
    value: "All of them"
  },
  {
    name: "Laura",
    role: "Social Media & Driver",
    tenure: "Since 2025",
    image: "https://static.wixstatic.com/media/4d2311_8f292cb9cdf44b9987595c429bb2a034~mv2.jpeg/v1/fill/w_848,h_1093,al_c,q_85,enc_avif,quality_auto/WhatsApp%20Image%202025-11-12%20at%2017_52_52.jpeg",
    bio: "Laura joined in April 2025 and has embraced every part of the role. She grew up with a Border Collie and more recently a Golden Retriever, and dogs have always been a big part of her life. Working with them every day is something she genuinely loves.",
    label: "Favourite breed",
    value: "Border Collies & Goldens"
  },
  {
    name: "Dan",
    role: "Driver & Carer",
    tenure: "",
    image: "",
    bio: "Bio coming soon.",
    label: "",
    value: ""
  },
  {
    name: "Macey",
    role: "Driver & Carer",
    tenure: "",
    image: "",
    bio: "Bio coming soon.",
    label: "",
    value: ""
  }
];

function gallerySrc(name) {
  return `/assets/gallery/${encodeURI(name)}`;
}

function clean() {
  for (const entry of fs.readdirSync(ROOT)) {
    if ([".git", ".gitignore", ".netlify", "netlify", "assets", "build-site.js", "styles.css", "script.js", "netlify.toml", "gallery-contact.html", "video-contact.html", "enquiry-detect.html"].includes(entry)) continue;
    fs.rmSync(path.join(ROOT, entry), { recursive: true, force: true });
  }
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writePage(route, html) {
  const file = route === "/" ? path.join(ROOT, "index.html") : path.join(ROOT, route, "index.html");
  ensureDir(file);
  fs.writeFileSync(file, html);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function plainText(value) {
  return String(value || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function displayTitleHtml(value) {
  return String(value || "")
    .replace(/\n\s*/g, "")
    .replace(/<br\s*\/?>/gi, "<br>")
    .replace(/<span[^>]*>/gi, "<span>")
    .replace(/<\/span>/gi, "</span>")
    .replace(/<(?!\/?span\b|br\b)[^>]+>/gi, "")
    .trim();
}

function matchText(html, regex) {
  const match = html.match(regex);
  return match ? plainText(match[1]) : "";
}

function legacyAreaPage(slug) {
  const file = path.join(process.env.HOME || "", "Downloads", "ddc-netlify", `${slug}.html`);
  if (!fs.existsSync(file)) {
    const manual = {
      cobham: {
        heroEyebrow: "Doggy Daycare · Cobham, Surrey",
        heroTitle: "Woodland daycare<br><span>right here in Cobham.</span>",
        heroText: "Our Cobham site is home to Duncan's Dog Co.: private Surrey woodland, familiar handlers, drop-off options and local collection routes close to the A3 and M25.",
        whyEyebrow: "Doggy Daycare in Cobham",
        whyTitle: "The woodland is the destination.",
        whyText: "Cobham families are closest to our woodland home. Dogs join us for supervised outdoor days with room to run, sniff, rest and build a routine with the same trusted team.",
        collectionKicker: "Local Drop-Off & Collection",
        collectionTitle: "Easy access from Cobham.",
        collectionIntro: "Drop-off at our Cobham facility works well for local families, with short collection routes available subject to schedule, suitability and route capacity.",
        routes: [["Local Route", "Cobham and nearby roads", "We confirm local Cobham collection options around your postcode and your dog's routine."], ["Drop Off", "Closest to the woodland", "Drop-off is the simplest option for many Cobham families, with easy access near the A3 and M25."]]
      },
      wandsworth: {
        heroEyebrow: "Doggy Daycare · Wandsworth, South West London",
        heroTitle: "From Wandsworth<br><span>to Surrey woodland.</span>",
        heroText: "We collect from Wandsworth where route capacity allows, care for your dog in private Surrey woodland, and bring them home after a full day outside.",
        whyEyebrow: "Doggy Daycare in Wandsworth",
        whyTitle: "City routine, woodland day.",
        whyText: "Wandsworth dogs do not need to spend the day in a small indoor space. Our route links South West London to our Cobham woodland for proper outdoor exercise, enrichment and rest.",
        collectionKicker: "Collection & Drop-Off",
        collectionTitle: "Route-aware collection from Wandsworth.",
        collectionIntro: "Wandsworth collection is route-dependent and usually links with Putney, Earlsfield and the A3 corridor. We will confirm availability before booking a trial day.",
        routes: [["South West London Route", "Wandsworth, Putney and Earlsfield", "We plan Wandsworth collection around current route capacity and sensible journey times."], ["Drop Off Yourself", "Prefer to drive in?", "Drop-off at Cobham can work well if your commute connects to the A3 or M25."]]
      }
    };
    return manual[slug] || null;
  }
  const html = fs.readFileSync(file, "utf8");
  const heroTitleRaw = (html.match(/<div class="hero-text">[\s\S]*?<h1>([\s\S]*?)<\/h1>/) || [])[1];
  const source = {
    heroEyebrow: matchText(html, /<span class="eyebrow">([\s\S]*?)<\/span>/),
    heroTitle: displayTitleHtml(heroTitleRaw),
    heroText: matchText(html, /<div class="hero-text">[\s\S]*?<p>([\s\S]*?)<\/p>/),
    video: (html.match(/<source src="([^"]+)"/) || html.match(/<video src="([^"]+)"/) || [])[1],
    whyEyebrow: matchText(html, /<span class="eyebrow-dark">([\s\S]*?)<\/span>/),
    whyTitle: matchText(html, /<section class="why-section">[\s\S]*?<h2>([\s\S]*?)<\/h2>/),
    whyText: matchText(html, /<section class="why-section">[\s\S]*?<h2>[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/),
    image: (html.match(/<div class="why-right"[\s\S]*?<img src="([^"]+)"/) || [])[1],
    collectionKicker: matchText(html, /<section class="collection-section">[\s\S]*?<span class="eyebrow-dark"[^>]*>([\s\S]*?)<\/span>/),
    collectionTitle: matchText(html, /<section class="collection-section">[\s\S]*?<h2>([\s\S]*?)<\/h2>/),
    collectionIntro: matchText(html, /<p class="collection-intro">([\s\S]*?)<\/p>/),
    vehicleFact: matchText(html, /<div class="vehicle-fact">[\s\S]*?<p>([\s\S]*?)<\/p>/),
    features: [],
    routes: [],
    areaTags: []
  };
  for (const match of html.matchAll(/<div class="feature-text">([\s\S]*?)<span>([\s\S]*?)<\/span><\/div>/g)) {
    source.features.push([plainText(match[1]), plainText(match[2])]);
  }
  for (const match of html.matchAll(/<div class="route-card">[\s\S]*?<span class="route-card-label">([\s\S]*?)<\/span>[\s\S]*?<div class="route-card-title">([\s\S]*?)<\/div>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)) {
    source.routes.push([plainText(match[1]), plainText(match[2]), plainText(match[3])]);
  }
  for (const match of html.matchAll(/<a href="https:\/\/www\.duncansdogco\.com\/([^"]+)" class="area-tag([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    source.areaTags.push({ slug: match[1], active: match[2].includes("home"), label: plainText(match[3]).replace(/^📍\s*/, "") });
  }
  return source;
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function localBusinessJson() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE}/#business`,
    name: "Duncan's Dog Co.",
    url: SITE,
    telephone: "+447731798899",
    email: "info@duncansdogco.com",
    foundingDate: "2011",
    priceRange: "££",
    description: "Woodland dog daycare in Cobham, with safe collection across Surrey and South West London.",
    address: { "@type": "PostalAddress", addressLocality: "Cobham", addressRegion: "Surrey", postalCode: "KT11", addressCountry: "GB" },
    areaServed: areas.map(([, name]) => name),
    openingHours: "Mo-Su 07:45-18:30",
    image: `${SITE}/assets/woodland.jpg`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "49",
      bestRating: "5",
      worstRating: "1"
    }
  };
}

function breadcrumbJson(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE}${item.url}`
    }))
  };
}

function faqJson(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  };
}

function serviceJson(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.description,
    provider: { "@id": `${SITE}/#business` },
    areaServed: areas.map(([, name]) => name),
    serviceType: page.nav,
    url: `${SITE}/${page.slug}/`
  };
}

function layout({ route, title, description, keywords, h1, intro, body, hero = false, heroData = null, image = "assets/woodland.jpg", structured = [], noindex = false, scripts = "" }) {
  const url = `${SITE}${route === "/" ? "/" : `/${route}/`}`;
  const routeClass = route === "/" ? "home" : route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  const ogImage = image && image.startsWith("http") ? image : `${SITE}/${image || "assets/woodland.jpg"}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KDP8MF95');</script>
  <!-- End Google Tag Manager -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="google-site-verification" content="TTdcRBaSCQeuUwJ6KgRK_-dK04RkrZshhgFN0s3QoLI">
  <meta name="google-site-verification" content="palKBdTaR-xBpZdDW5XCzxZlThymVMeO4Jf1Wpo4Ets">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/styles.css?v=${assetVersion}">
  ${[localBusinessJson(), ...structured].map(jsonLd).join("\n  ")}
</head>
<body class="page-${routeClass}">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KDP8MF95" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <header class="site-header" data-header>
    <a class="brand" href="/" aria-label="Duncan's Dog Co. home"><img src="/assets/logo.png" alt="" aria-hidden="true"><span>Duncan's Dog Co.</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle><span></span><span></span><span></span></button>
    <nav class="site-nav" id="site-nav" data-nav>
      <a href="/daycare/">Daycare</a>
      <a href="/puppies/">Puppies</a>
      <a href="/sleepovers/">Sleepovers</a>
      <a href="/splash/">SPLASH</a>
      <a href="/rescue/">Rescue</a>
      <a href="/pricing/">Pricing</a>
      <a href="/about-us/">About</a>
      <a href="/contact/">Contact</a>
      <a href="/faq/">FAQ</a>
      <a class="nav-cta" href="/contact/">Enquire</a>
    </nav>
  </header>
  <main>
    ${route === "pricing" ? pricingHero(h1, intro) : hero ? heroBlock(h1, intro) : heroData ? livePageHero(h1, heroData) : pageHero(h1, intro, image)}
    ${body}
  </main>
  ${footer()}
  <script src="/script.js?v=${assetVersion}"></script>
  ${scripts}
</body>
</html>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <strong>Duncan's Dog Co.</strong>
        <span>Woodland dog daycare in Cobham, with collection across Surrey and South West London.</span>
        <div class="social-links">${socialLinks.map(([name, href]) => `<a href="${href}" target="_blank" rel="noopener" aria-label="${esc(name)}: ${href.replace("https://www.", "")}" title="${esc(name)}">${socialIcon(name)}<span>${esc(name)}</span></a>`).join("")}</div>
        <a href="https://generasoftware.com" class="genera-badge" target="_blank" rel="noopener" aria-label="Website built by Genera Software">
          <svg class="genera-icon" viewBox="0 0 175.51 161.41" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M73.79,53.42c-5.3,4.1-11.93,4.82-17.92,2.15-10.49-4.68-15.79-16.71-16.42-27.95-.43-7.78,1.67-15.39,6.75-21.25,7.4-8.55,19.07-8.29,27.1-.35,9.01,8.91,12.15,22.82,8.6,34.83-1.47,4.97-3.95,9.37-8.1,12.57Z" fill="#003E45"/>
            <path d="M125.39,54.11c-4.4,2.68-9.39,3.85-14.32,2.46-6.55-1.85-11.24-6.89-13.63-13.22-3.95-10.44-2.76-21.98,2.99-31.51,4.83-8.01,13.91-13.84,23.12-11.19,5.16,1.49,8.91,5.25,11.51,9.81,2.55,4.48,3.54,9.21,3.72,14.4.27,8.1-1.71,16.08-6.51,22.62-1.93,2.63-4,4.87-6.87,6.62Z" fill="#003E45"/>
            <path d="M24.6,94.92c-6.08.64-12.02-2.72-16.25-7.12C.4,79.54-2.81,64.99,2.89,55.23c4.94-8.46,14.18-10.56,22.89-5.86,4.07,2.19,7.12,5.39,9.6,9.29,4.35,6.84,5.87,15.05,3.88,22.91-1.81,7.12-7.31,12.58-14.65,13.36Z" fill="#003E45"/>
            <path d="M166.1,89.1c-5.73,5.26-13.42,7.74-20.56,4.23-3.51-1.73-5.96-4.44-7.62-8-1.78-3.8-2.22-7.74-2.07-12.07.29-8.18,4-15.98,10.24-21.27,8.01-6.79,18.64-7.1,25.06,1.01,4.65,5.88,5.1,13.34,3.56,20.63-1.26,5.97-4.15,11.38-8.62,15.48Z" fill="#003E45"/>
            <path d="M148.74,112.24c-2.15-3.24-4.87-5.79-7.8-8.29-3.43-2.93-6.58-5.84-9.68-9.18-5.37-5.8-8.8-12.74-13.13-17.85-6.27-7.39-14.77-11.71-24.47-12.62-3.14-.3-6.27-.36-9.4.04-10.27,1.32-20.03,6.58-25.86,15.11l-5.86,8.57c-3.29,4.82-7.07,8.99-11.49,12.87-2.99,2.63-6.04,4.91-8.66,7.94-3.33,3.86-5.81,8.09-7.2,13.05-2.18,7.72-2.15,15.86.82,23.37,2.95,7.48,10.14,12.82,17.87,14.83,9.85,2.56,20.15,1.16,29.66-2.33,11.7-4.29,20.08-4.22,31.71-.07,7.62,2.72,15.42,4.35,23.5,3.52,7.64-.79,14.76-3.77,19.88-9.53,4.22-4.74,5.9-10.96,6.28-17.26.47-7.84-1.82-15.62-6.16-22.16ZM94.98,143.87h-27.38c-4.68,0-8.48-3.8-8.48-8.48v-40.57c0-4.69,3.8-8.49,8.49-8.48h5.97s0,43.1,0,43.1h21.59s-.2,14.43-.2,14.43ZM102.32,143.87l.02-21.59h-21.59s0-14.38,0-14.38h27.53c4.68,0,8.48,3.8,8.48,8.48v26.53s0,.96,0,.96h-14.44ZM80.75,100.8v-14.47s27.53,0,27.53,0c4.68,0,8.48,3.79,8.48,8.48v5.99s-36.01,0-36.01,0Z" fill="#003E45"/>
          </svg>
          <div class="genera-text">
            <span class="genera-powered-by">Powered by</span>
            <span class="genera-name">GENERA</span>
            <span class="genera-tagline">A Better Breed of Software</span>
          </div>
        </a>
      </div>
      <div><h2>Services</h2><a href="/daycare/">Doggy Daycare</a><a href="/puppies/">Puppy School</a><a href="/sleepovers/">Sleepovers</a><a href="/splash/">SPLASH Swimming</a><a href="/rescue/">Rescue Dogs</a><a href="/pricing/">Pricing</a></div>
      <div><h2>Company</h2><a href="/about-us/">About Us</a><a href="/areas/">Collection Areas</a><a href="/startup-support/">Startup Support</a><a href="/careers/">Careers</a><a href="/blog/">Blog</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a><a href="https://customers.duncansdoggydaycare.com/accounts/login/?next=/daycare/" target="_blank" rel="noopener">Client Bookings</a></div>
      <div><h2>Contact</h2><a href="tel:07731798899">07731 798 899</a><a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><address><span>Cobham, Surrey, KT11</span></address><span>Daycare LN/201800994</span><span>Boarding LN/202400651</span></div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Duncan's Dog Co. All rights reserved.</span>
      <nav aria-label="Legal"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-conditions/">Terms & Conditions</a></nav>
    </div>
    <a class="whatsapp-float" href="https://wa.me/447731798899?text=Hi%20Duncan%27s%20Dog%20Co%2C%20I%27d%20like%20to%20enquire%20about%20dog%20daycare." target="_blank" rel="noopener" aria-label="WhatsApp Duncan's Dog Co. on 07731 798 899">${whatsappIcon()}<span>WhatsApp us</span></a>
  </footer>`;
}

function whatsappIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.1 2a9.8 9.8 0 0 0-8.4 14.9L2.5 22l5.3-1.2A9.8 9.8 0 1 0 12.1 2Zm0 2a7.8 7.8 0 0 1 0 15.6c-1.3 0-2.6-.3-3.7-.9l-.4-.2-2.6.6.6-2.5-.3-.4A7.8 7.8 0 0 1 12.1 4Zm-3.3 3.8c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.7.5 0 1.6-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.5-.4l-1.8-.9c-.3-.1-.5-.2-.7.2l-.7.9c-.2.2-.3.3-.6.1-.3-.1-1.1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.7-.1-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.6l-.8-1.9c-.2-.5-.4-.5-.6-.5h-.5Z"/></svg>`;
}

function socialIcon(name) {
  const key = String(name).toLowerCase();
  if (key === "instagram") return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.7 2.1a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>`;
  if (key === "facebook") return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.2V6.6c0-.8.4-1.2 1.3-1.2H17V2.3c-.8-.1-1.7-.2-2.7-.2-2.7 0-4.6 1.6-4.6 4.4v1.7H7v3.5h2.7V22H14V11.7h2.9l.5-3.5H14Z"/></svg>`;
  if (key === "tiktok") return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.1 2c.4 2.7 1.9 4.4 4.5 4.6v3.4a8 8 0 0 1-4.5-1.4v6.5c0 4.4-2.8 6.9-6.5 6.9A6.2 6.2 0 0 1 3.4 16c0-3.7 2.8-6.3 6.9-6.3.4 0 .8 0 1.2.1v3.7c-.4-.1-.8-.2-1.2-.2-1.6 0-2.8 1-2.8 2.6s1.1 2.6 2.6 2.6c1.7 0 2.8-1 2.8-3.1V2h3.2Z"/></svg>`;
  return "";
}

function heroBlock(h1, intro) {
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="hero-media" aria-label="Dogs exploring Duncan's Dog Co. woodland"><video src="${videoHero}" poster="/assets/woodland.jpg" autoplay muted loop playsinline preload="auto"></video></div>
  <div class="hero-copy reveal"><div class="hero-pills" aria-label="Duncan's Dog Co. highlights"><span>Family-run since 2011</span><span>40 acres private woodland</span><span>Collection available</span></div><p class="eyebrow">Cobham, Surrey · Est. 2011</p><h1 id="hero-title" class="home-hero-title"><span>Dog Daycare in Cobham</span><span>with Collection Across SW London</span></h1><div class="squiggle-line" aria-hidden="true"></div><p class="hero-lede">${esc(intro)}</p><div class="hero-actions"><a class="button primary" href="/contact/#enquiry-form">Book a trial day</a><a class="button secondary" href="tel:07731798899">Call 07731 798 899</a></div></div>
  <div class="star-spray paw-spray-a" aria-hidden="true"></div>
  <div class="star-spray paw-spray-b" aria-hidden="true"></div>
</section>`;
}

function pageHero(h1, intro, image) {
  return `<section class="page-hero"><div class="reveal"><div class="hero-pills compact"><span>Open since 2011</span><span>5-star licensed</span></div><p class="eyebrow">Duncan's Dog Co.</p><h1>${esc(h1)}</h1><div class="squiggle-line" aria-hidden="true"></div><p>${esc(intro)}</p></div><img class="reveal" src="/${image}" alt="Duncan's Dog Co. woodland dog care"><div class="star-spray page-stars" aria-hidden="true"></div></section>`;
}

function pricingHero(h1, intro) {
  return `<section class="pricing-hero">
    <div class="pricing-hero-copy reveal">
      <p class="pricing-eyebrow">Duncan's Dog Co</p>
      <h1>${esc(h1)}</h1>
      <p>${esc(intro)}</p>
    </div>
    <img class="pricing-hero-img reveal" src="/assets/woodland-wide.jpg" alt="Dogs running in the woodland at Duncan's Dog Co. Cobham" width="1200" height="500" loading="lazy">
  </section>`;
}

function livePageHero(h1, data) {
  return `<section class="live-page-hero" aria-labelledby="page-title">
    <div class="live-page-copy reveal">
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h1 id="page-title" class="sr-only">${esc(h1)}</h1>
      ${data.logo ? `<img class="hero-logo-badge" src="${esc(data.logo)}" alt="${esc(h1)}" aria-hidden="true">` : `<div class="live-display-title" aria-hidden="true">${data.displayTitle}</div>`}
      <p>${esc(data.text)}</p>
      ${data.stats && data.stats.length ? `<div class="live-stats">${data.stats.map(([num, label]) => `<div class="live-stat-pill"><span>${esc(num)}</span><small>${label}</small></div>`).join("")}</div>` : ""}
      <a class="hero-cta-live" href="${data.ctaHref || "/contact/"}">${esc(data.ctaText || "Enquire Now")} →</a>
    </div>
    <div class="live-page-video reveal"><video src="${data.video}" poster="${esc(data.videoPoster || "/assets/woodland.jpg")}" autoplay muted loop playsinline preload="auto"></video></div>
  </section>`;
}

function motifIcon(title) {
  const key = String(title).toLowerCase();
  if (key.includes("social")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 19c0-3 1.8-5 4-5s4 2 4 5H4Zm8 0c0-1.7-.5-3.1-1.3-4.2A4.6 4.6 0 0 1 16 14c2.2 0 4 2 4 5h-8Z"/></svg>`;
  if (key.includes("train") || key.includes("template") || key.includes("learn")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 4-8 4-8-4 8-4Zm-5 7.2 5 2.5 5-2.5V16c0 1.7-2.2 3-5 3s-5-1.3-5-3v-4.8Z"/></svg>`;
  if (key.includes("habituation") || key.includes("confidence") || key.includes("calm")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5c4.3 0 7.8 3.5 7.8 7.8 0 5.1-5.8 8.4-7.8 9.2-2-.8-7.8-4.1-7.8-9.2A7.8 7.8 0 0 1 12 3.5Zm0 4a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"/></svg>`;
  if (key.includes("recall") || key.includes("route") || key.includes("position")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 20l7-3 7 3-7-17Zm0 5.4 2.6 7.1-2.6-1.1-2.6 1.1L12 8.4Z"/></svg>`;
  if (key.includes("routine") || key.includes("structure") || key.includes("system")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v3h3v15H4V6h3V3Zm1 7h8V8H8v2Zm0 4h8v-2H8v2Zm0 4h5v-2H8v2Z"/></svg>`;
  if (key.includes("support") || key.includes("family") || key.includes("team")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.1-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.9-7 10-7 10Z"/></svg>`;
  if (key.includes("collection") || key.includes("travel") || key.includes("ride")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h11l3 4v6h-2a2.5 2.5 0 0 1-5 0H9a2.5 2.5 0 0 1-5 0H3V9c0-1.1.9-2 2-2Zm11 2v3h2.2L16 9ZM6.5 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>`;
  if (key.includes("woodland") || key.includes("outdoor") || key.includes("enrichment")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.8 4.1 6 7.3 6 10a6 6 0 0 1-12 0c0-2.7 2.2-5.9 6-10Zm0 5v11m0-5 3-3m-3 3-3-3"/></svg>`;
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5c-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9-1.3-2.9-2.9-2.9ZM6.3 8.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm11.4 0a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM7.5 18.5h9c-.2-2.6-2.1-4.5-4.5-4.5s-4.3 1.9-4.5 4.5Z"/></svg>`;
}

function cards(items) {
  return `<div class="service-grid mixed-card-grid">${items.map(([title, text], index) => `<article class="service-card reveal"><span class="service-icon">${String(index + 1).padStart(2, "0")}</span><span class="mini-icon" aria-hidden="true">${motifIcon(title)}</span><h2>${esc(title)}</h2><p>${esc(text)}</p></article>`).join("")}</div>`;
}

function homepageServiceStrip() {
  const items = [
    {
      href: "/rescue/",
      image: gallerySrc(gallery.homeRescue),
      tag: "All breeds welcome",
      title: "Rescue Dogs",
      text: "Calm, gentle socialisation at their own pace with one-to-one attention, no pressure and no rush."
    },
    {
      href: "/daycare/",
      image: gallerySrc(gallery.homeDaycare),
      tag: "365 days a year",
      title: "Doggy Daycare",
      text: "A full day of woodland exploration, play and enrichment. Collection and drop-off available."
    },
    {
      href: "/puppies/",
      image: gallerySrc(gallery.homePuppy),
      tag: "Puppy pathway",
      title: "Puppy School",
      text: "Socialisation, training, habituation and woodland adventure for a confident start."
    },
    {
      href: "/sleepovers/",
      image: gallerySrc(gallery.homeSleepover),
      tag: "Licensed boarding",
      title: "Sleepovers",
      text: "Home-from-home overnight boarding with familiar care throughout."
    }
  ];

  const splashPill = `<a class="splash-pill reveal" href="/splash/"><img src="/assets/splash/pool-session.jpg" alt="SPLASH Swimming at Duncan's Dog Co." loading="lazy"><div class="splash-pill-overlay"></div><span class="splash-pill-badge">Now open</span><div class="splash-pill-content"><div class="splash-pill-left"><span class="card-num">05</span><h2>SPLASH Swimming</h2><p>Supervised 1-to-1 dog swimming at our Cobham pool. Built for dogs who love the water.</p></div><span class="card-link">Book a taster <span aria-hidden="true">→</span></span></div></a>`;

  return `<section class="section live-service-strip"><div class="section-heading-row reveal"><div><p class="section-kicker">What We Offer</p><h2>Our Services</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>Everything your dog needs, built around a family cottage deep in the Surrey woodland.</p></div><div class="live-card-grid">${items.map((item, index) => `<a class="live-card reveal" href="${item.href}"><img src="${item.image}" alt="${esc(item.title)} at Duncan's Dog Co."><span class="card-tag">${esc(item.tag)}</span><div class="live-card-overlay"></div><div class="live-card-content"><span class="card-num">${String(index + 1).padStart(2, "0")}</span><h2>${esc(item.title)}</h2><p>${esc(item.text)}</p><span class="card-link">Find out more <span aria-hidden="true">→</span></span></div></a>`).join("")}</div>${splashPill}</section>`;
}

function homeTestimonials() {
  const reviews = [
    { initial: "H", quote: "The facility is amazing, right in the woods but completely secure. Herbie enjoys his time with everyone and is always exhausted when he gets home — exactly what you want.", name: "Herbie's mum", dog: "Herbie · Cobham" },
    { initial: "L", quote: "Leila absolutely adores her time at Duncan's. We've been so impressed at the difference in her confidence and behaviour since she started coming.", name: "Leila's mum", dog: "Leila · Wimbledon" },
    { initial: "G", quote: "He runs in the forest, paddles in the lake, chases the other puppies and comes home happy and exhausted. It's everything I hoped dog daycare would be.", name: "Galileo's dad", dog: "Galileo · Esher" },
    { initial: "A", quote: "They truly have everything a dog could possibly want or need. But what really makes Duncan's so special is the people — attentive, caring, and clearly love what they do. Alfie's PitPat shows him breaking records every day, and he comes home completely exhausted. Always the best sign.", name: "Alfie's owner", dog: "Alfie · Google Review" },
    { initial: "J", quote: "Our dog has been going to Duncan's since he was a puppy — 7 years now — and he is always so happy to go in each day. Michaela is Jasper's favourite person in the whole world. We can not thank her enough for the love she shows our dog.", name: "Jasper's owner", dog: "Jasper · 7 years · Google Review" }
  ];
  const starSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  const stars = starSvg.repeat(5);
  const cards = reviews.map((r, i) => `
    <article class="ht-card" data-card="${i}" role="article" aria-label="Review from ${esc(r.name)}">
      <div class="ht-stars" aria-label="5 stars">${stars}</div>
      <blockquote class="ht-quote">${esc(r.quote)}</blockquote>
      <footer class="ht-footer">
        <div class="ht-avatar" aria-hidden="true">${esc(r.initial)}</div>
        <div>
          <div class="ht-name">${esc(r.name)}</div>
          <div class="ht-dog">${esc(r.dog)}</div>
        </div>
      </footer>
    </article>`).join("");
  const dots = reviews.map((_, i) => `<button class="ht-dot${i === 0 ? " active" : ""}" data-dot="${i}" aria-label="Review ${i + 1}" aria-pressed="${i === 0}"></button>`).join("");

  return `<section class="home-testimonials-v2">
  <div class="ht-scroll-driver" id="ht-driver">
    <div class="ht-sticky">
      <div class="ht-left">
        <p class="section-kicker">Loved by local families</p>
        <h2 class="ht-heading">What owners<br><em>say.</em></h2>
        <p class="ht-sub">A few words from owners whose dogs know the woodland, the team and the daily routine.</p>
        <div class="ht-google-badge">
          <div class="ht-g-dot" aria-hidden="true">G</div>
          <div class="ht-badge-stars" aria-hidden="true">${starSvg.repeat(5)}</div>
          <span class="ht-badge-text">5.0 · Google Reviews</span>
        </div>
        <div class="ht-dots" role="tablist" aria-label="Reviews">${dots}</div>
        <a class="ht-cta" href="https://g.page/r/CREp4sOxl7KREAE/review" target="_blank" rel="noopener">
          Read all reviews on Google
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </a>
      </div>
      <div class="ht-stack" id="ht-stack" aria-live="polite">${cards}</div>
    </div>
  </div>
</section>`;
}

function homeTrialFormSection() {
  return `<section class="home-trial-section" id="homepage-enquiry">
    <div class="home-trial-image reveal"><img src="${gallerySrc(gallery.homeQuote)}" alt="Happy dog enjoying Duncan's Dog Co. woodland daycare"></div>
    <div class="home-trial-panel reveal">
      <p class="section-kicker">Start here</p>
      <h2>Book a trial day.</h2>
      <p>Send us an enquiry and we will arrange a meet and greet so we can get to know your dog properly. Then we can get a trial day set up and talk through the best routine for your dog.</p>
      <div class="home-trial-actions"><a class="button primary" href="/contact/#enquiry-form">Open enquiry form</a><a class="button secondary dark" href="tel:07731798899">Call 07731 798 899</a></div>
    </div>
  </section>`;
}

function catchmentSection() {
  const swLondon = ["wimbledon", "clapham", "wandsworth", "putney", "balham", "earlsfield", "southfields", "raynes-park", "new-malden", "morden", "tooting", "copse-hill", "motspur-park"];
  const surrey = ["cobham", "esher", "oxshott", "claygate", "hersham", "st-georges-hill", "weybridge", "walton-on-thames", "byfleet", "west-byfleet", "effingham", "horsley"];
  const areaBySlug = Object.fromEntries(areas.map(([slug, name]) => [slug, name]));
  const links = (slugs) => slugs.map((slug) => `<a href="/areas/${slug}/"><span></span>${areaBySlug[slug]}</a>`).join("");

  return `<section class="catchment-section" aria-labelledby="catchment-title">
    <div class="catchment-header reveal">
      <p class="section-kicker">Collection Catchment</p>
      <h2 id="catchment-title">Dog daycare collection across Surrey and South West London.</h2>
      <p>Our Cobham woodland is the calm centre point. Collection routes are planned carefully around dogs, journey times and regular weekly attendance.</p>
    </div>
    <div class="catchment-map reveal">
      <div class="catchment-list">
        <span class="catchment-label">South West London collection</span>
        ${links(swLondon)}
      </div>
      <div class="catchment-hub" aria-label="Cobham woodland hub">
        <div class="hub-ring"><strong>Cobham</strong><span>40 acres<br>private woodland</span></div>
        <div class="route-note">A3 · M25 · Door-to-door collection · Drop-off available</div>
      </div>
      <div class="catchment-list catchment-list-right">
        <span class="catchment-label">Surrey collection</span>
        ${links(surrey)}
      </div>
    </div>
    <div class="catchment-footer reveal">
      <p><strong>Not sure if we collect from you?</strong> Send your postcode and we will check the current route. Drop-off to Cobham is always worth considering if collection is not the best fit.</p>
      <a class="button primary" href="/areas/">View all areas</a>
      <a class="button secondary dark" href="/contact/#enquiry-form">Check your postcode</a>
    </div>
  </section>`;
}

function faqMarkup(faqs) {
  // answers are hardcoded build-time content so raw HTML is safe here
  return `<div class="faq-grid">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join("")}</div>`;
}

function linkPanel() {
  return `<div class="internal-links"><a href="/daycare/">Dog daycare</a><a href="/pricing/">Pricing</a><a href="/faq/">FAQ</a><a href="/puppies/">Puppy daycare</a><a href="/sleepovers/">Sleepovers</a><a href="/rescue/">Rescue dogs</a></div>`;
}

function richFeatureGrid(items) {
  return `<div class="rich-feature-grid icon-feature-grid">${items.map(([title, text]) => `<article class="rich-feature-card reveal"><span class="mini-icon" aria-hidden="true">${motifIcon(title)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}</div>`;
}

function teamMembersSection() {
  return `<section class="section about-team-section">
    <div class="section-heading-row reveal">
      <div><p class="section-kicker">The Team</p><h2>The people your dog loves.</h2><div class="squiggle-line" aria-hidden="true"></div></div>
      <p>Most of the team have been with us for years. They know the dogs by name, by habit and by personality.</p>
    </div>
    <div class="about-team-grid">
      ${teamMembers.map((member) => {
        const initial = esc(member.name.charAt(0));
        const photo = member.image ? `<img src="${member.image}" alt="${esc(member.name)} from Duncan's Dog Co." loading="lazy" onerror="this.parentNode.innerHTML='&lt;div class=&quot;about-team-fallback&quot;&gt;${initial}&lt;/div&gt;'">` : `<div class="about-team-fallback">${initial}</div>`;
        const meta = member.label && member.value ? `<div class="about-team-fave"><span>${esc(member.label)}</span><strong>${esc(member.value)}</strong></div>` : "";
        return `<article class="about-team-card reveal" id="${member.name.toLowerCase()}">
          <div class="about-team-photo">${photo}</div>
          <div class="about-team-bar"><div><h3>${esc(member.name)}</h3><p>${esc(member.role)}</p></div>${member.tenure ? `<span>${esc(member.tenure)}</span>` : ""}</div>
          <div class="about-team-body"><p class="${member.bio === "Bio coming soon." ? "pending" : ""}">${esc(member.bio)}</p>${meta}</div>
        </article>`;
      }).join("")}
    </div>
  </section>`;
}

function liveIntro({ kicker, title, paragraphs, badge, image, alt }) {
  return `<section class="live-intro-section"><div class="live-intro-grid"><div class="live-intro-copy reveal"><p class="section-kicker">${esc(kicker)}</p><h2>${esc(title)}</h2>${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}${badge ? `<div class="info-badge"><span>★</span>${esc(badge)}</div>` : ""}</div><div class="live-intro-image reveal"><img src="${image}" alt="${esc(alt)}" loading="lazy"></div></div></section>`;
}

function authenticPhotoRibbon({ kicker = "Life at Duncan's", title = "Real dogs, real woodland, real care.", text = "A few proper glimpses of the team, the dogs and the Cobham woodland that families recognise from Duncan's Dog Co.", className = "" } = {}) {
  const photos = [
    [gallerySrc(gallery.familyRunTeam), "Duncan's Dog Co. family-run team with certificates", "Known team"],
    [gallerySrc(gallery.woodlandGroup), "Dogs exploring together in Duncan's Dog Co. woodland", "Woodland days"],
    [gallerySrc(gallery.portrait), "Happy dog at Duncan's Dog Co.", "Happy dogs"],
    [gallerySrc(gallery.bridgePack), "Dogs together in the Cobham woodland", "Private space"]
  ];
  return `<section class="authentic-ribbon ${esc(className)}">
    <div class="authentic-ribbon-copy reveal">
      <p class="section-kicker">${esc(kicker)}</p>
      <h2>${esc(title)}</h2>
      <div class="squiggle-line" aria-hidden="true"></div>
      <p>${esc(text)}</p>
    </div>
    <div class="authentic-ribbon-photos reveal">
      ${photos.map(([src, alt, label]) => `<figure><img src="${src}" alt="${esc(alt)}" loading="lazy"><figcaption>${esc(label)}</figcaption></figure>`).join("")}
    </div>
  </section>`;
}

function puppyVideoBreak() {
  return `<section class="puppy-video-break">
    <div class="puppy-video-frame reveal">
      <video src="${gallerySrc(gallery.puppyDesensitisationVideo)}" autoplay muted loop playsinline controls preload="metadata"></video>
    </div>
    <div class="puppy-video-copy reveal">
      <p class="section-kicker">Real-world confidence</p>
      <h2>Gentle desensitisation, done calmly.</h2>
      <div class="squiggle-line" aria-hidden="true"></div>
      <p>Short, positive exposure helps puppies take in new sounds, surfaces, people and situations without overwhelm.</p>
    </div>
  </section>`;
}

function daycareDifferenceSection() {
  const stripPhotos = [
    [gallerySrc(gallery.familyRunTeam), "Duncan's Dog Co. family-run team with certificates", "Family-run"],
    [gallerySrc(gallery.goldenPair), "Dogs in private Cobham woodland", "Private woodland"],
    [gallerySrc(gallery.groupLineup), "Dogs socialising in the woodland", "Managed groups"],
    [gallerySrc(gallery.portrait), "Relaxed dog at Duncan's Dog Co.", "Known dogs"]
  ];
  const features = [
    ["01", "Ride in style", "Custom people carriers for collection and drop-off, not cramped van transport."],
    ["02", "Flexible care", "A routine built around real families, regular days and sensible route planning."],
    ["03", "No breed discrimination", "All breeds are welcome when daycare is the right fit for the individual dog."],
    ["04", "Natural enrichment", "Sensory stimulation is part of being in nature: scent, texture, weather, sound and space to explore."],
    ["05", "One familiar team", "The same staff are with the dogs from collection through to home time, keeping the whole day familiar."]
  ];
  const stats = [["15+", "Years Running"], ["40+", "Acres of Woodland"], ["1:6", "Staff Ratio"], ["365", "Days a Year"], ["5★", "Licensed Rating"]];
  return `<section class="daycare-difference-section">
    <div class="difference-header reveal">
      <p class="section-kicker">Duncan's Dog Co. · Est. 2011</p>
      <h2>Why We're Different</h2>
      <div class="squiggle-line" aria-hidden="true"></div>
      <p>Woodland daycare works best when the setting, people and routine all feel known. Our private woodland gives dogs natural shelter from the British weather, sensory stimulation from being outside, and a familiar team from collection through to home time.</p>
    </div>
    <div class="difference-photo-strip">
      ${stripPhotos.map(([src, alt, label]) => `<figure class="difference-photo reveal"><img src="${src}" alt="${esc(alt)}" loading="lazy"><figcaption>${esc(label)}</figcaption></figure>`).join("")}
    </div>
    <div class="difference-features">
      ${features.map(([number, title, text]) => `<article class="difference-feature reveal"><span>${number}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}
    </div>
    <div class="difference-stats">
      ${stats.map(([number, label]) => `<div class="reveal"><strong>${esc(number)}</strong><span>${esc(label)}</span></div>`).join("")}
    </div>
  </section>`;
}

function puppyBuiltSection() {
  const items = [
    ["Socialisation", "Positive, consensual interactions with other dogs, learning to read cues, play safely and build confidence with their peers."],
    ["Training", "Positive reinforcement and reward-based methods. Good manners, recall foundations and calm handling are built naturally into the day."],
    ["Habituation", "Calm, gradual exposure to sights, sounds and real-world experiences, reducing anxiety and building lasting confidence."],
    ["Recall & Independence", "Off-lead confidence, safe woodland recall and learning to self-regulate with guidance from the team."],
    ["Routine & Structure", "A consistent rhythm helps puppies understand expectations and settle faster with the same environment and calm approach."],
    ["Woodland Adventure", "A dedicated puppy pathway in our woodland setting: safe, enriching and full of things to explore."]
  ];
  return `<section class="puppy-built-section">
    <div class="puppy-built-header reveal">
      <p class="section-kicker">Built for where they are</p>
      <h2>Built into every day.</h2>
      <p>Not a course. Not a programme. Just consistent, expert care, woven into everything we do from day one.</p>
    </div>
    <div class="puppy-built-grid">
      ${items.map(([title, text], index) => `<article class="puppy-built-card reveal"><span aria-hidden="true">${["●", "◆", "✓", "↻", "□", "•"][index]}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}
    </div>
  </section>`;
}

function puppySupportSection() {
  return `<section class="puppy-support-section">
    <div class="puppy-support-copy reveal">
      <p class="section-kicker">Progress & support</p>
      <h2>We keep you in the loop.</h2>
      <div class="squiggle-line" aria-hidden="true"></div>
      <p>Bringing a puppy into the family is a big deal. We take that seriously. Our team provides regular updates, progress notes and honest guidance on how your puppy is developing, both with us and at home.</p>
      <p>If you have questions about behaviour, training at home or how your pup is settling in, just ask. We're here throughout, not just during daycare hours.</p>
    </div>
    <div class="puppy-support-image reveal">
      <img src="${gallerySrc(gallery.familyRunTeam)}" alt="Duncan's Dog Co. trained family-run team with certificates" loading="lazy">
    </div>
  </section>`;
}

function ctaBand(kicker, title, text, href = "/contact/#enquiry-form", label = "Enquire Now") {
  return `<section class="cta-band"><p class="section-kicker">${esc(kicker)}</p><h2>${esc(title)}</h2><p>${esc(text)}</p><a class="button primary" href="${href}">${esc(label)}</a></section>`;
}

function startupSupportBody() {
  const problemCards = [
    ["Planning Permission", "Most people underestimate the planning process and what their local council will expect. Getting this wrong early can cost months and significant money."],
    ["Licensing & DEFRA Rules", "The paperwork and licensing standards confuse new businesses. Knowing exactly what inspectors look for before they arrive makes all the difference."],
    ["Operations & Pricing", "Many daycares open with the wrong pricing structure or insufficient systems and struggle to become profitable. Getting this right from the start matters."]
  ];
  const coverCards = [
    ["Licensing & Compliance Templates", "Ready-to-use policy documents, staff training records and DEFRA compliance templates built from our own inspection experience."],
    ["Planning & Council Guidance", "Practical advice on navigating the planning process, what councils look for, and how to present your application effectively."],
    ["Pricing & Business Structure", "How to price your services from day one, what to charge for, and how to structure memberships, deposits and late fees."],
    ["Day-to-Day Operations", "The systems, routines and staff management structures we use to run a 90-dog-a-day operation smoothly and safely."],
    ["Staffing & HR Foundations", "Induction templates, role structures, training logs and the frameworks we use to hire and retain a reliable team."],
    ["Direct Access to Experience", "Ask us directly. We answer from 15 years of doing this, not from a course, a book or secondhand knowledge."]
  ];
  const stats = [
    ["15+", "Years in the industry", "Established in 2011. We've been through every stage of growth, change and challenge a daycare can face."],
    ["5★", "Licensed daycare", "One of the first daycares to be inspected under the Animal Welfare licensing framework. We know what it takes."],
    ["90+", "Dogs a day at peak", "Our advice comes from running a genuinely large operation, not a small hobby setup. The systems scale."],
    ["100%", "Real experience", "Every template, document and piece of guidance we share is something we use or have used ourselves."]
  ];
  return `<section class="section live-content startup-problem-section">
    <div class="section-heading-row reveal">
      <div><p class="section-kicker">The Reality</p><h2>The problem new daycares face.</h2><div class="squiggle-line" aria-hidden="true"></div></div>
      <p>Starting a dog daycare is not as simple as renting a field and opening the gates. Most people run into the same three walls.</p>
    </div>
    ${richFeatureGrid(problemCards)}
  </section>
  ${liveIntro({
    kicker: "Where This Comes From",
    title: "We're sharing what we wish we'd had.",
    paragraphs: [
      "Duncan's Dog Co. started in 2011 with a simple idea: create a place where dogs could run, play and be cared for properly.",
      "When licensing first came into the industry, we were one of the early businesses going through the process. At the time there was very little guidance available.",
      "We had no templates. No handbook. No clear roadmap. Like many small businesses, we figured a lot of it out as we went along.",
      "Every policy, procedure and system had to be built from scratch. Over time, those lessons became the foundations of the business. The advice and templates we now share come directly from that experience: from the real, day-to-day running of a licensed dog daycare."
    ],
    badge: "Family-run since 2011",
    image: "https://static.wixstatic.com/media/4d2311_6bfcbec812394349a50fe4ebdc5a53d2~mv2.jpg/v1/fill/w_980,h_1307,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/PHOTO-2025-11-09-19-08-48.jpg",
    alt: "Duncan's Dog Co. woodland dog daycare founder story"
  })}
  <section class="section live-content startup-cover-section">
    <div class="section-heading-row reveal">
      <div><p class="section-kicker">How We Help</p><h2>What we cover.</h2><div class="squiggle-line" aria-hidden="true"></div></div>
      <p>Everything we share is grounded in real experience. Not theory: what actually works when you're building and running a licensed daycare.</p>
    </div>
    ${richFeatureGrid(coverCards)}
  </section>
  <section class="startup-proof-section">
    <div class="startup-proof-header reveal">
      <p class="section-kicker">Why People Come to Us</p>
      <h2>Advice grounded in reality.</h2>
      <div class="squiggle-line" aria-hidden="true"></div>
    </div>
    <div class="startup-stat-grid">
      ${stats.map(([number, label, text]) => `<article class="startup-stat-card reveal"><strong>${esc(number)}</strong><span>${esc(label)}</span><p>${esc(text)}</p></article>`).join("")}
    </div>
  </section>
  ${ctaBand("Get Started", "Ready to build your daycare?", "Reach out and we'll have a conversation about where you are and how we can help. No pressure, no sales pitch.", "mailto:becks@duncansdogco.com?subject=Enquiry%20about%20help%20with%20my%20licensing", "Contact Us")}`;
}

function serviceBody(page) {
  if (page.slug === "rescue") {
    return `<section class="section live-content rescue-care-section">
      <div class="section-heading-row reveal">
        <div><p class="section-kicker">Rescue dog daycare</p><h2>Trust first, daycare second.</h2><div class="squiggle-line" aria-hidden="true"></div></div>
        <p>Rescue dogs often need time, consistency and careful reading. We start gently, keep expectations realistic and build confidence at the dog's pace.</p>
      </div>
      ${richFeatureGrid([["No pressure, no rush", "Some rescue dogs need slower introductions, quieter handling and time to build trust before joining a routine."], ["Calm socialisation", "When social contact is right, we introduce suitable dogs carefully and watch body language closely."], ["Familiar routine", "The same Cobham facility, familiar handlers and repeat attendance can help dogs settle safely."], ["One connected team", "Our staff stay connected from collection through to home time, so dogs are not passed between unknown people."], ["Woodland confidence", "The natural setting gives dogs space to sniff, decompress and build confidence without a busy indoor environment."], ["Individual fit", "Daycare is not forced. We talk through your dog's background, confidence and needs before planning the right first step."]])}
    </section>
    ${authenticPhotoRibbon({ kicker: "Why we're different", title: "Gentle care in a familiar woodland setting.", text: "Rescue dogs are never rushed into a one-size-fits-all day. We keep introductions calm, routines familiar and the woodland experience positive, so each dog can settle with trust.", className: "rescue-ribbon" })}
    <section class="section faqs"><div class="section-kicker">FAQs</div><h2>Questions about rescue dogs</h2>${faqMarkup(page.faqs)}${linkPanel()}</section>
    <section class="contact-section"><div><p class="section-kicker">Next Step</p><h2>Book a trial day.</h2><p>Tell us about your dog and we will talk through confidence, collection options and the right introduction.</p></div><div class="contact-card"><a class="contact-link" href="tel:07731798899">07731 798 899</a><a class="contact-link" href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><a class="button primary" href="/contact/#enquiry-form">Enquire now</a></div></section>`;
  }

  if (page.slug === "daycare") {
    return `<section class="daycare-story-section">
      <div class="daycare-story-copy reveal">
        <p class="section-kicker">What We Do</p>
        <h2>Our Doggy Daycare.</h2>
        <div class="squiggle-line" aria-hidden="true"></div>
        <p>Welcome to Duncan's Dog Co., a family-owned dog daycare business that has been caring for dogs since 2011.</p>
        <p>Nestled in a cottage surrounded by acres of enriching woodland, we give dogs a natural, safe place to explore, play and thrive.</p>
        <p>The trees create a natural canopy from the British weather: shade from the sun when we get it, and shelter when the rain arrives. Scent, sound, texture and changing seasons make each day naturally stimulating.</p>
        <p>We are one facility, not a chain or a handover system. Our staff are with the dogs from collection all the way through to home time, keeping faces, routines and care familiar.</p>
        <div class="info-badge"><span>★</span>Family-run since 2011 · all breeds welcome</div>
      </div>
      <div class="daycare-photo-stack reveal">
        <img src="${gallerySrc(gallery.woodlandGroup)}" alt="Duncan's Dog Co. dogs together in woodland">
        <img src="${gallerySrc(gallery.goldenPair)}" alt="Dogs playing together at Duncan's Dog Co.">
      </div>
    </section>
    ${daycareDifferenceSection()}
    <section class="section daycare-included-section">
      <div class="section-heading-row reveal"><div><p class="section-kicker">Daycare essentials</p><h2>Built into every booking.</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>These are the practical standards families rely on each week: transport, space, weather-wise woodland, welfare, licensing and a team who know the dogs properly.</p></div>
      <div class="daycare-standards-panel reveal">
        <div class="standards-image">
          <img src="${gallerySrc(gallery.bridgePackWide)}" alt="Dogs enjoying woodland daycare at Duncan's Dog Co." loading="lazy">
        </div>
        <div class="standards-list">
          <article><span>01</span><div><h2>Collection routes</h2><p>Door-to-door collection and drop-off across selected Surrey and South West London routes.</p></div></article>
          <article><span>02</span><div><h2>Private woodland</h2><p>A natural Cobham setting with room to sniff, explore, decompress and enjoy a proper outdoor day beneath the trees.</p></div></article>
          <article><span>03</span><div><h2>Managed groups</h2><p>Dogs are placed thoughtfully with suitable companions and supervised by handlers who know their routines.</p></div></article>
          <article><span>04</span><div><h2>Familiar staff</h2><p>The team collecting your dog are part of the same daycare team, so care stays connected from pick-up to home time.</p></div></article>
          <article><span>05</span><div><h2>Open all year</h2><p>Care available 365 days a year, including weekends and bank holidays, subject to availability.</p></div></article>
          <article><span>06</span><div><h2>Licensed and insured</h2><p>Inspected, fully insured and rated 5-star by Elmbridge Council for dog daycare.</p></div></article>
        </div>
      </div>
    </section>
    <section class="section local-steps-section">
      <div class="section-heading-row reveal"><div><p class="section-kicker">Joining Duncan's</p><h2>How your dog starts.</h2></div><p>This section is the onboarding journey: the steps before your dog becomes part of the woodland routine.</p></div>
      <div class="local-steps-grid">
        <article class="reveal"><span>01</span><h2>Enquiry</h2><p>Send us your postcode, your dog's details and the care you are looking for.</p></article>
        <article class="reveal"><span>02</span><h2>Conversation</h2><p>We talk through suitability, current routes, temperament and any practical needs.</p></article>
        <article class="reveal"><span>03</span><h2>Introduction</h2><p>Your dog meets us carefully so we can understand confidence, travel comfort and sociability.</p></article>
        <article class="reveal"><span>04</span><h2>Regular rhythm</h2><p>If everyone is happy, we agree attendance and build them into the daycare routine.</p></article>
      </div>
    </section>
    <section class="daycare-pricing-teaser">
      <div><h2>Transparent pricing.</h2><p>Our pricing page explains daycare, collection, drop-off, sleepovers, minimum attendance and trial day information in proper text.</p></div>
      <a class="button secondary dark" href="/pricing/">View Pricing</a>
    </section>
    <section class="daycare-final-cta">
      <div class="daycare-final-photo reveal"><img src="${gallerySrc(gallery.groupLineup)}" alt="Group of dogs together in Duncan's Dog Co. woodland daycare" loading="lazy"></div>
      <div class="daycare-final-copy reveal">
        <p class="section-kicker">Ready to get started?</p>
        <h2>We'd love to meet your dog.</h2>
        <div class="squiggle-line" aria-hidden="true"></div>
        <p>Enquire now and we'll be in touch within 24 hours.</p>
        <a class="button primary" href="/contact/#enquiry-form">Enquire now</a>
      </div>
    </section>`;
  }

  if (page.slug === "puppies") {
    const puppyFaqs = [["How old does my puppy need to be?", "We accept puppies from 12 weeks old, provided they have had their primary vaccinations and received veterinary clearance to socialise with other dogs."], ["Is Puppy School different to regular daycare?", "It is daycare. Same collection and drop-off times, same woodland, same familiar team. The difference is structure: puppies have a gentler pace, more built-in rest, and introductions matched to where they are developmentally. They are not kept entirely separate from adult dogs. Calm, well-socialised adults play an important role: they model good manners and help puppies understand how to behave in a group. Think of them as the matriarchs of the pack. It is all closely supervised and completely safe."], ["Who leads the puppy programme?", "Eleanor is our puppy specialist. She holds dog behaviour qualifications and genuinely lives and breathes puppy development. She knows every pup's personality and has a rare ability to read early signals before they become problems. <a href='/about-us/#eleanor'>Meet Eleanor on our team page.</a>"], ["Do you offer door-to-door collection for Puppy School?", "Yes, collection and drop-off is included for Puppy School just as it is for regular daycare."], ["When does Puppy School transition to full daycare?", "There is no fixed age. It depends on your puppy's development, confidence and readiness."]];
    return `${liveIntro({ kicker: "About puppy school", title: "Puppy-focused. Gently socialised.", paragraphs: ["Puppy School at Duncan's Dog Co. is daycare. The same collection times, the same woodland, the same familiar team. What changes is the structure: more rest, gentler introductions, and a pace that matches each puppy's development rather than the group's energy.", "Puppies are not kept separate from adult dogs. Calm, well-socialised adults are a deliberate part of the day. They model good manners, demonstrate how to interact in a group, and help puppies feel settled. Eleanor, our puppy specialist, oversees the programme. She holds dog behaviour qualifications and knows every pup by name, temperament and tell.", "Everything we do is focused on building confidence, positive associations with new dogs and people, and the calm, happy temperament that makes for a great adult dog."], badge: "Accepting puppies from 12 weeks old", image: gallerySrc(gallery.puppyWoodlandCloseup), alt: "Puppy exploring the woodland at Duncan's Dog Co." })}${authenticPhotoRibbon({ kicker: "Why we're different", title: "Real-world confidence, built gently.", text: "Puppies learn through calm handling, careful socialisation, familiar people and positive woodland experiences. We keep introductions gentle and matched to each puppy's age and confidence, including calm adult role models where that supports their learning.", className: "puppy-ribbon" })}<section class="section live-content puppy-care-section"><div class="section-heading-row reveal"><div><p class="section-kicker">Built into every day</p><h2>Built for where they are.</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>Not a course. Not a programme. Just consistent, expert care woven into each puppy day from the start.</p></div>${richFeatureGrid([["Socialisation", "Positive, consensual interactions with puppies and suitable adult dogs, learning to read cues, play safely and build confidence with good role models."], ["Training", "Reward-based methods, good manners, recall foundations and calm handling built naturally into the day."], ["Habituation", "Gradual exposure to new sights, sounds and experiences so puppies build confidence without overwhelm."], ["Recall & independence", "Off-lead confidence, safe woodland recall and learning to self-regulate with guidance from the team."], ["Routine & structure", "A consistent rhythm helps puppies understand expectations and settle faster with the same calm approach."], ["Progress & support", "Regular updates, honest guidance and help with questions about behaviour, training and settling at home."]])}</section><section class="section faqs puppy-faq-section"><div class="section-kicker">Common questions</div><h2>Puppy School FAQs.</h2>${faqMarkup(puppyFaqs)}</section>${ctaBand("Ready for Puppy School?", "Book a puppy introduction.", "Spaces in Puppy School are limited. Get in touch to check availability and arrange the right first step.", "/contact/#enquiry-form", "Enquire about Puppy School")}`;
  }

  if (page.slug === "sleepovers") {
    return `${liveIntro({ kicker: "About sleepovers", title: "Not a kennel. Our home.", paragraphs: ["Dog sleepovers at Duncan's Dog Co. are exactly what they sound like. Your dog stays overnight at our woodland facility as part of the family. They sleep in our home alongside the team.", "This matters because it means a familiar environment, familiar faces, and a familiar routine. If your dog already comes to us for daycare, a sleepover is a seamless extension of their normal day.", "We handle sleepovers for holidays, work trips, weekends away, or any time you need peace of mind that your dog is genuinely well cared for. Boarding licence LN/202400651."], badge: "Licensed overnight boarding · LN/202400651", image: "https://static.wixstatic.com/media/4d2311_df80b335345d4af4ac284e695581bee2~mv2.jpg", alt: "Dog sleepover at Duncan's Dog Co." })}${authenticPhotoRibbon({ kicker: "Home-from-home feel", title: "Sleepovers still feel familiar.", text: "A sleepover is an extension of your dog's normal Duncan's day: familiar people, familiar woodland, full daytime care and a calm overnight routine in our home, never a kennel block." })}<section class="section live-content"><div class="section-heading-row reveal"><div><p class="section-kicker">What to expect</p><h2>Everything included.</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>Familiar care, full woodland days and calm overnight routines.</p></div>${richFeatureGrid([["Full days in daycare", "Every sleepover includes a full woodland day. Same exercise, same familiar team, same routines. Your dog arrives at bedtime genuinely tired and happy."], ["Calm nights at home", "When the day winds down, dogs settle in with the team at our home. Warm, comfortable and familiar. Never a kennel."], ["24-hour supervision", "Someone is always on hand through the night. The same care standards, around the clock."], ["Available 365 days", "Sleepovers are available every night of the year, including Christmas, New Year and bank holidays."], ["Regular updates", "We will keep you updated while you are away, because owners like to know their dog is happy."], ["Licensed and insured", "Boarding licence LN/202400651 is granted by Elmbridge Council. Fully insured and inspected."]])}</section>${ctaBand("Planning a trip?", "Book your dog's sleepover.", "Sleepover spaces are limited, especially over holidays. Get in touch early to check availability for your dates.")}`;
  }

  return `<section class="section">${cards(page.sections)}</section>${authenticPhotoRibbon({ kicker: page.nav, title: `${page.nav} with the Duncan's Dog Co. feel.`, text: "More genuine imagery helps these pages feel closer to the live site while the written content stays clearer for visitors and search." })}<section class="section faqs"><div class="section-kicker">FAQs</div><h2>Questions about ${esc(page.nav.toLowerCase())}</h2>${faqMarkup(page.faqs)}${linkPanel()}</section><section class="contact-section"><div><p class="section-kicker">Next Step</p><h2>Book a trial day.</h2><p>Tell us about your dog and we will advise availability, route options and the right introduction.</p></div><div class="contact-card"><a class="contact-link" href="tel:07731798899">07731 798 899</a><a class="contact-link" href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><a class="button primary" href="/contact/#enquiry-form">Enquire now</a></div></section>`;
}

function home() {
  const body = `${homepageServiceStrip()}
  <section class="feature-split"><div class="split-image reveal"><img src="${gallerySrc(gallery.homeSplit)}" alt="Duncan's Dog Co. team in front of the woodland daycare cottage"></div><div class="split-copy reveal"><p class="section-kicker">Why Families Choose Us</p><h2>Known dogs. Known team. Real woodland.</h2><div class="squiggle-line" aria-hidden="true"></div><p>Premium care is built on trust. We are one Cobham facility, with familiar staff from collection all the way through to home time. Dogs get real woodland days with natural shelter, sensory stimulation and a calm approach to social groups.</p><div class="split-actions"><a class="button primary" href="/about-us/">Meet the team</a><a class="button secondary dark" href="/contact/#enquiry-form">Book a trial day</a></div></div></section>
  ${homeTestimonials()}
  ${catchmentSection()}
  ${homeTrialFormSection()}`;
  const htMotionScript = `<script>
  (function() {
    var driver = document.getElementById('ht-driver');
    if (!driver) return;
    var stack   = document.getElementById('ht-stack');
    var allCards = Array.from(document.querySelectorAll('.ht-card'));
    var dots     = Array.from(document.querySelectorAll('.ht-dot'));
    var TOTAL    = allCards.length;
    var deskCards = allCards.slice().reverse();
    var observer  = null;

    function isMobile() { return window.innerWidth <= 980; }

    /* ── Desktop: vertical scroll stack ── */
    function setStack(progress) {
      var raw    = Math.max(0, Math.min(TOTAL, progress * TOTAL));
      var active = Math.min(Math.floor(raw), TOTAL - 1);
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === active);
        d.setAttribute('aria-pressed', String(i === active));
      });
      deskCards.forEach(function(card, i) {
        var cp = raw - i;
        if (cp <= 0) {
          var behind = Math.min(-cp, TOTAL - 1);
          card.style.transform = 'translateY(' + (behind * 10) + 'px) scale(' + (1 - behind * 0.035) + ') translateZ(' + (-behind * 24) + 'px)';
          card.style.opacity   = String(Math.max(0.35, 1 - Math.min(behind, 2) * 0.14));
          card.style.zIndex    = String(TOTAL - Math.floor(behind));
        } else if (cp < 1) {
          card.style.transform = 'translateY(' + (cp * -140) + '%) rotate(' + (cp * -10) + 'deg) scale(' + (1 - cp * 0.04) + ')';
          card.style.opacity   = String(Math.max(0, 1 - cp * 1.8));
          card.style.zIndex    = String(TOTAL + 1);
        } else {
          card.style.transform = 'translateY(-200%) rotate(-12deg)';
          card.style.opacity   = '0';
          card.style.zIndex    = '0';
        }
      });
    }

    function getProgress() {
      var rect  = driver.getBoundingClientRect();
      var vh    = window.innerHeight;
      var range = driver.offsetHeight - vh;
      return range > 0 ? Math.max(0, Math.min(1, -rect.top / range)) : 0;
    }

    /* ── Mobile: horizontal swipe carousel ── */
    function setupMobile() {
      allCards.forEach(function(c) { c.style.transform = c.style.opacity = c.style.zIndex = ''; });
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            var idx = parseInt(e.target.getAttribute('data-card'), 10);
            dots.forEach(function(d, i) {
              d.classList.toggle('active', i === idx);
              d.setAttribute('aria-pressed', String(i === idx));
            });
          }
        });
      }, { root: stack, threshold: 0.55 });
      allCards.forEach(function(c) { observer.observe(c); });
    }

    function setupDesktop() {
      if (observer) { observer.disconnect(); observer = null; }
      setStack(getProgress());
    }

    /* ── Init & resize ── */
    if (isMobile()) { setupMobile(); } else { setStack(0); }

    window.addEventListener('scroll', function() { if (!isMobile()) setStack(getProgress()); }, { passive: true });
    window.addEventListener('resize', function() {
      if (isMobile()) { setupMobile(); } else { setupDesktop(); }
    }, { passive: true });
  })();
<\/script>`;

  writePage("/", layout({
    route: "/",
    title: "Dog Daycare Cobham & SW London | Duncan's Dog Co.",
    description: "Dog daycare in Cobham with collection across Surrey and SW London. 40 acres of private woodland, puppy daycare, sleepovers and 5-star licensed care.",
    keywords: "dog daycare Cobham, doggy daycare Cobham, dog daycare Surrey, woodland dog daycare, dog daycare with collection, dog daycare SW London",
    h1: "Dog Daycare in Cobham with Collection Across SW London",
    intro: "Woodland dog daycare in Cobham, with safe collection across Surrey and South West London.",
    hero: true,
    body,
    structured: [breadcrumbJson([{ name: "Home", url: "/" }])],
    scripts: htMotionScript
  }));
}

function splashPageBody() {
  const splashFaqs = [
    ["What happens at the taster session?", "Your dog gets the sole attention of the SPLASH team while we assess their confidence, ability and genuine enjoyment in the water. Not every dog enjoys swimming and that is completely fine. The taster is designed to find out whether SPLASH is right for your dog while making sure their first experience is positive and stress-free."],
    ["How do I book?", "Get in touch via the form below and we will get back to you within 24 hours about availability, next steps and everything you need ahead of your first session."],
    ["What is included in the £40 taster session?", "A dedicated 1-to-1 swimming experience, a full assessment by the SPLASH team, a First Swim Session Report, and photos and videos of your dog's first swim."],
    ["Is swimming safe for my dog?", "Yes. All sessions are 1-to-1 with the SPLASH team and every dog wears a correctly fitted buoyancy aid for their first session. We assess each dog individually and will never push a dog beyond what they are comfortable with."],
    ["Are there discounts for regular bookings?", "Yes. We offer discounted rates for customers who commit to recurring bookings, as well as savings on bulk session packages. Full pricing is confirmed following your dog's assessment."],
    ["Does every dog enjoy swimming?", "Not every dog takes to the water and that is completely okay. The taster exists to find out in a safe, positive way. If it is not the right fit, we will tell you honestly."]
  ];

  return `${liveIntro({ kicker: "About SPLASH", title: "Your dog's first swim.", paragraphs: [
    "Your dog's first SPLASH session is a 1-to-1 taster, priced at £40. During the session your dog has the sole attention of the SPLASH team while we assess their confidence, ability and genuine enjoyment in the water.",
    "Not every dog takes to the water and that is completely fine. The taster is designed to find out whether SPLASH is the right fit for your dog, while making sure their first experience is positive and stress-free.",
    "If SPLASH is a good fit, we confirm next steps and get you set up for regular sessions."
  ], badge: "Taster session £40 · 1-to-1 with the SPLASH team", image: "/assets/splash/sign.jpg", alt: "Chocolate Labrador at SPLASH at Duncan's Dog Co." })}
  <section class="splash-photo-grid-section">
    <figure class="reveal"><img src="/assets/splash/pool-session.jpg" alt="SPLASH team guiding a dog through the pool at Duncan's Dog Co." loading="lazy"></figure>
    <figure class="reveal"><img src="/assets/splash/poolside.jpg" alt="Dog on the poolside with the SPLASH team at Duncan's Dog Co." loading="lazy"></figure>
    <figure class="reveal"><img src="/assets/splash/shake.jpg" alt="Happy dog after a SPLASH swimming session at Duncan's Dog Co." loading="lazy"></figure>
    <figure class="reveal"><img src="/assets/splash/team.jpg" alt="SPLASH team supporting a dog in the water at Duncan's Dog Co." loading="lazy"></figure>
  </section>
  <section class="splash-benefits-section">
    <div class="splash-bubbles" aria-hidden="true">
      <span class="bubble" style="width:24px;height:24px;left:8%;bottom:10%;--dur:6s;--delay:0s"></span>
      <span class="bubble" style="width:16px;height:16px;left:18%;bottom:25%;--dur:8s;--delay:1.5s"></span>
      <span class="bubble" style="width:32px;height:32px;left:35%;bottom:5%;--dur:7s;--delay:0.8s"></span>
      <span class="bubble" style="width:12px;height:12px;left:52%;bottom:15%;--dur:9s;--delay:2.2s"></span>
      <span class="bubble" style="width:20px;height:20px;left:65%;bottom:8%;--dur:6.5s;--delay:1s"></span>
      <span class="bubble" style="width:28px;height:28px;left:78%;bottom:20%;--dur:8.5s;--delay:0.3s"></span>
      <span class="bubble" style="width:14px;height:14px;left:88%;bottom:12%;--dur:7.5s;--delay:1.8s"></span>
      <span class="bubble" style="width:22px;height:22px;left:42%;bottom:30%;--dur:10s;--delay:3s"></span>
    </div>
    <div class="splash-benefits-inner section">
      <div class="splash-benefits-heading reveal">
        <p class="section-kicker">Why swimming?</p>
        <h2>Good for body.<br>Good for mind.</h2>
        <p>Swimming offers something a walk cannot. Low-impact, full-body, genuinely joyful. Here is what your dog gets from a regular dip.</p>
      </div>
      <div class="splash-benefits-grid reveal">
        <div class="splash-benefit-card">
          <svg class="splash-benefit-icon icon-waves" aria-hidden="true" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10 Q7 5 12 10 Q17 15 22 10 Q24 8 26 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M2 18 Q7 13 12 18 Q17 23 22 18 Q24 16 26 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          <div class="splash-benefit-num">01</div>
          <h3>Joint-friendly exercise</h3>
          <p>Zero impact on joints. Ideal for dogs with arthritis, post-surgery recovery, or any breed prone to joint problems.</p>
        </div>
        <div class="splash-benefit-card">
          <svg class="splash-benefit-icon icon-drop" aria-hidden="true" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4 C14 4 6 12 6 17 A8 8 0 0 0 22 17 C22 12 14 4 14 4Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19 Q12 17 14 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/></svg>
          <div class="splash-benefit-num">02</div>
          <h3>Full body workout</h3>
          <p>Every stroke uses more muscles than a land walk. Strong core, strong legs, genuinely tired dog.</p>
        </div>
        <div class="splash-benefit-card">
          <svg class="splash-benefit-icon icon-ripple" aria-hidden="true" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="2.5" fill="currentColor"/><circle cx="14" cy="14" r="6" stroke="currentColor" stroke-width="2"/><circle class="ripple-ring" cx="14" cy="14" r="11" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.5"/></svg>
          <div class="splash-benefit-num">03</div>
          <h3>Confidence in water</h3>
          <p>A positive first experience builds calm around water for life. Especially valuable for nervous or cautious dogs.</p>
        </div>
        <div class="splash-benefit-card">
          <svg class="splash-benefit-icon icon-spark" aria-hidden="true" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 3 L9 15 L14 15 L13 25 L20 13 L15 13 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="currentColor" fill-opacity="0.2"/></svg>
          <div class="splash-benefit-num">04</div>
          <h3>Mental enrichment</h3>
          <p>New sensations, new environment, new challenge. Swimming tires a busy brain as much as the body.</p>
        </div>
        <div class="splash-benefit-card">
          <svg class="splash-benefit-icon icon-heart" aria-hidden="true" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 23 C14 23 4 16 4 10 A5.5 5.5 0 0 1 14 7.5 A5.5 5.5 0 0 1 24 10 C24 16 14 23 14 23Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>
          <div class="splash-benefit-num">05</div>
          <h3>Great for senior dogs</h3>
          <p>Older dogs who struggle on walks often thrive in the water. Supported movement they can actually enjoy.</p>
        </div>
        <div class="splash-benefit-card">
          <svg class="splash-benefit-icon icon-burst" aria-hidden="true" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="3.5" fill="currentColor"/><line x1="14" y1="2" x2="14" y2="7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="22.2" y1="5.8" x2="18.8" y2="9.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="26" y1="14" x2="21" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="22.2" y1="22.2" x2="18.8" y2="18.8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="14" y1="26" x2="14" y2="21" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="5.8" y1="22.2" x2="9.2" y2="18.8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="2" y1="14" x2="7" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="5.8" y1="5.8" x2="9.2" y2="9.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          <div class="splash-benefit-num">06</div>
          <h3>Pure fun</h3>
          <p>Some dogs are simply born for the water. SPLASH gives them somewhere to be exactly that.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section live-content splash-taster-list-section">
    <div class="section-heading-row reveal">
      <div><p class="section-kicker">What's included</p><h2>Everything in your taster.</h2><div class="squiggle-line" aria-hidden="true"></div></div>
      <p>One session covers everything we need to know about your dog and everything you need to know about SPLASH.</p>
    </div>
    <ul class="splash-taster-list reveal">
      <li><strong>1-to-1 swimming</strong><span>Your dog has the full attention of the SPLASH team throughout. No distractions, no group pressure.</span></li>
      <li><strong>Full assessment</strong><span>We observe confidence, ability and genuine enjoyment. If SPLASH is not right for your dog, we will say so honestly.</span></li>
      <li><strong>First Swim Session Report</strong><span>A written summary of your dog's session, their confidence in the water and our recommendations.</span></li>
      <li><strong>Photos and videos</strong><span>We capture your dog's first swim so you can see exactly how they got on.</span></li>
      <li><strong>Personalised next steps</strong><span>Guidance on frequency and whether ongoing sessions are the right fit for your dog.</span></li>
      <li><strong>Easy booking</strong><span>If SPLASH is a good fit, we get you set up so regular sessions are simple to manage.</span></li>
    </ul>
  </section>
  <section class="section splash-faq-section">
    <div class="section-heading-row reveal">
      <div>
        <p class="section-kicker">Common questions</p>
        <h2>SPLASH FAQs.</h2>
        <div class="squiggle-line" aria-hidden="true"></div>
      </div>
    </div>
    <div class="splash-faq-list">${splashFaqs.map(([q, a], i) => `<div class="splash-faq-item reveal">
      <span class="splash-faq-num">0${i + 1}</span>
      <div class="splash-faq-body">
        <h3>${esc(q)}</h3>
        <p>${a}</p>
      </div>
    </div>`).join("")}</div>
  </section>
  <section class="section splash-rental-section">
    <div class="splash-rental-inner reveal">
      <div class="splash-rental-copy">
        <p class="section-kicker">Private hire</p>
        <h2>Private pool rental.</h2>
        <div class="squiggle-line" aria-hidden="true"></div>
        <p>The pool is available for private hire outside of regular sessions. Ideal for dog groups, training sessions or a dedicated swim with your own dogs. Get in touch to enquire about availability and pricing.</p>
        <a class="button primary" href="mailto:info@duncansdogco.com?subject=Private%20Pool%20Rental%20Enquiry">Enquire: info@duncansdogco.com</a>
      </div>
      <figure class="splash-rental-photo">
        <img src="/assets/splash/team.jpg" alt="The SPLASH team in the pool at Duncan's Dog Co." loading="lazy">
      </figure>
    </div>
  </section>
  <section class="splash-cta-band" style="background-image:url('/assets/splash/taster.jpg')">
    <div class="splash-cta-inner">
      <p class="section-kicker">Ready to dive in?</p>
      <h2>Book a SPLASH taster.</h2>
      <p>Get in touch and we will get back to you within 24 hours about availability and everything you need ahead of your first session.</p>
      <a class="button primary" href="/contact/#enquiry-form">Register your interest</a>
    </div>
  </section>`;
}

function services() {
  for (const page of servicePages) {
    const body = serviceBody(page);
    writePage(page.slug, layout({
      route: page.slug,
      title: `${page.title} | Duncan's Dog Co.`,
      description: page.description,
      keywords: page.keywords,
      h1: page.title,
      intro: page.intro,
      heroData: page.heroData,
      body,
      structured: [serviceJson(page), faqJson(page.faqs), breadcrumbJson([{ name: "Home", url: "/" }, { name: page.title, url: `/${page.slug}/` }])]
    }));
  }
}

function splash() {
  writePage("splash", layout({
    route: "splash",
    title: "SPLASH Dog Swimming at Duncan's Dog Co. | Cobham Surrey",
    description: "Supervised 1-to-1 dog swimming sessions at Duncan's Dog Co. in Cobham, Surrey. Taster sessions from £40. Assessed by the SPLASH team with photos, videos and a full report.",
    keywords: "dog swimming Cobham, dog swimming Surrey, SPLASH dog swimming, dog pool Cobham, dog hydrotherapy Surrey",
    h1: "SPLASH Dog Swimming at Duncan's Dog Co.",
    intro: "Supervised 1-to-1 swimming for dogs at our Cobham facility. Taster sessions from £40.",
    heroData: {
      eyebrow: "SPLASH · Cobham, Surrey",
      logo: "/assets/splash/splash-logo-transparent.png",
      text: "A supervised 1-to-1 swimming programme for dogs who love the water. Taster sessions from £40.",
      video: "/assets/splash/hero.mp4",
      videoPoster: "/assets/splash/hero-poster.jpg",
      ctaHref: "/contact/#enquiry-form",
      ctaText: "Book a Taster",
      stats: []
    },
    body: splashPageBody(),
    structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "SPLASH Dog Swimming", url: "/splash/" }])]
  }));
}

function pricing() {
  const faqs = [["Do I need to walk my dog before daycare?", "No. Please do not walk them in the morning so they are home when we arrive and start the day fresh. They will have a full day of woodland walks, play, rest and enrichment."], ["What should I expect after their first day?", "Most dogs are very sleepy afterwards. Some high-energy dogs get a second wind when they get home, then crash the next day. We call this the daycare hangover."], ["Is collection included?", "Home collection and drop-off is included for the weekly daycare rates shown. Customer drop-off and weekend rates are separate options."], ["Is there a minimum attendance?", "Yes. A 4 day minimum charge per calendar month applies so dogs can settle into a consistent routine."]];
  const priceCards = [
    ["Per Week", "1 Day", "65", "Per Day", "", ""],
    ["Per Week", "2 Days", "60", "Per Day", "", ""],
    ["Per Week", "3+ Days", "55", "Per Day", "featured", "Most Popular"],
    ["", "Customer Drop-Off", "55", "Per Day", "", ""],
    ["Weekends & Bank Holidays", "Weekend Rate", "75", "Per Day", "sage", "Weekend and bank holiday rate."]
  ];
  const included = ["Council licensed", "Woodland adventures", "Home collection & drop-off", "Family-run team", "Safe travel in people carriers", "Play and rest balance", "Puppies welcome once fully vaccinated", "Enrichment activities", "Emergency vet support"];
  const calcSection = `<section class="pricing-calc-section">
  <div class="pricing-calc-inner">
    <div class="pricing-calc-header reveal">
      <p class="section-kicker">Estimate your cost</p>
      <h2>Work out your monthly rate.</h2>
      <p>Choose how often your dog would come and we will work it out instantly.</p>
    </div>
    <div class="pricing-calc-card reveal">
      <div class="calc-steps">
        <div class="calc-step">
          <span class="calc-step-label">Days per week</span>
          <div class="calc-day-btns">
            <button class="calc-day-btn active" data-days="1" type="button">1</button>
            <button class="calc-day-btn" data-days="2" type="button">2</button>
            <button class="calc-day-btn" data-days="3" type="button">3</button>
            <button class="calc-day-btn" data-days="4" type="button">4</button>
            <button class="calc-day-btn" data-days="5" type="button">5</button>
          </div>
        </div>
        <div class="calc-step">
          <span class="calc-step-label">Transport</span>
          <div class="calc-toggle">
            <button class="calc-toggle-btn active" data-type="collection" type="button">Collection included</button>
            <button class="calc-toggle-btn" data-type="dropoff" type="button">I'll drop off myself</button>
          </div>
        </div>
        <div class="calc-step">
          <span class="calc-step-label">Weekend days <em>(£75 each)</em></span>
          <div class="calc-counter">
            <button class="calc-counter-btn" id="c-minus" type="button" aria-label="Fewer weekend days">−</button>
            <span id="c-count">0</span>
            <button class="calc-counter-btn" id="c-plus" type="button" aria-label="More weekend days">+</button>
          </div>
        </div>
      </div>
      <div class="calc-result">
        <div class="calc-result-col">
          <span class="calc-result-label">Day rate</span>
          <strong class="calc-result-price" id="c-rate">£65</strong>
          <span class="calc-result-sub" id="c-note">1 day/week, collection included</span>
        </div>
        <div class="calc-result-divider" aria-hidden="true"></div>
        <div class="calc-result-col">
          <span class="calc-result-label">Monthly estimate</span>
          <strong class="calc-result-price calc-result-big" id="c-monthly">£282</strong>
          <span class="calc-result-sub">Based on 4.33 weeks per month</span>
        </div>
      </div>
      <p class="calc-small-print">Minimum 4 days per calendar month applies. Weekend and bank holiday days charged at £75 per day.</p>
      <a class="button primary" href="/contact/#enquiry-form">Book a trial day</a>
    </div>
  </div>
  <script>
  (function(){
    var days=1,weekend=0,dropoff=false;
    function rate(){return dropoff?55:days===1?65:days===2?60:55;}
    function note(){return dropoff?'Drop-off rate, any frequency':days===1?'1 day/week, collection included':days===2?'2 days/week, collection included':'3+ days/week, collection included';}
    function monthly(){return Math.round(((days-weekend)*rate()+weekend*75)*52/12);}
    function render(){
      document.querySelectorAll('.calc-day-btn').forEach(function(b){b.classList.toggle('active',+b.dataset.days===days);});
      document.querySelectorAll('.calc-toggle-btn').forEach(function(b){b.classList.toggle('active',(b.dataset.type==='dropoff')===dropoff);});
      weekend=Math.min(weekend,Math.min(days,2));
      document.getElementById('c-count').textContent=weekend;
      document.getElementById('c-minus').disabled=weekend===0;
      document.getElementById('c-plus').disabled=weekend>=Math.min(days,2);
      document.getElementById('c-rate').textContent='£'+rate();
      document.getElementById('c-note').textContent=note();
      document.getElementById('c-monthly').textContent='£'+monthly();
    }
    document.querySelectorAll('.calc-day-btn').forEach(function(b){b.addEventListener('click',function(){days=+this.dataset.days;render();});});
    document.querySelectorAll('.calc-toggle-btn').forEach(function(b){b.addEventListener('click',function(){dropoff=this.dataset.type==='dropoff';render();});});
    document.getElementById('c-minus').addEventListener('click',function(){if(weekend>0){weekend--;render();}});
    document.getElementById('c-plus').addEventListener('click',function(){if(weekend<Math.min(days,2)){weekend++;render();}});
    render();
  })();
  <\/script>
</section>`;
  const body = `<section class="pricing-live-section">
    <div class="pricing-live-inner">
      <div class="pricing-card-grid">
        ${priceCards.map(([period, title, price, per, tone, note]) => `<article class="price-card ${tone} reveal">
          ${tone === "featured" ? `<div class="price-badge">+ ${esc(note)} +</div>` : ""}
          <span class="card-period">${esc(period)}</span>
          <h2>${esc(title)}</h2>
          <div class="card-divider"></div>
          <div class="price-amount"><span class="price-symbol">£</span><span class="price-number">${esc(price)}</span></div>
          <span class="price-per">${esc(per)}</span>
          <span class="mini-icon price-paw" aria-hidden="true">${motifIcon(title)}</span>
          ${note && tone !== "featured" ? `<p>${esc(note)}</p>` : ""}
        </article>`).join("")}
      </div>
      <div class="pricing-info-strip reveal" aria-label="Important pricing notes">
        <span><i aria-hidden="true">i</i> Prices are based on weekly visits</span>
        <span><i aria-hidden="true">i</i> A 4-day minimum charge per calendar month applies</span>
        <span><i aria-hidden="true">i</i> Collection and drop-off included in all weekly daycare prices</span>
      </div>
      <div class="blue-light-strip reveal">
        <span class="blue-light-icon" aria-hidden="true">${motifIcon("licensed")}</span>
        <p><strong>Blue Light Card holders receive 10% off.</strong> Simply show your card when signing up and we'll apply the discount automatically.</p>
      </div>
      <p class="pricing-note"><strong>Prices are based on weekly visits.</strong> A 4 day minimum charge per calendar month applies.</p>
    </div>
  </section>
  ${calcSection}
  <section class="section faqs pricing-faq-section"><div class="section-kicker">Pricing FAQs</div><h2>Questions before you book.</h2>${faqMarkup(faqs)}${linkPanel()}</section>`;
  writePage("pricing", layout({
    route: "pricing",
    title: "Dog Daycare Pricing in Cobham | Duncan's Dog Co.",
    description: "Dog daycare pricing in Cobham. Weekly daycare from £65 per day, 3+ day rate from £55 per day, customer drop-off and weekend pricing.",
    keywords: "dog daycare pricing Cobham, dog daycare with collection, dog sleepover pricing Surrey",
    h1: "Our Price List",
    intro: "Clear daycare rates for woodland dog daycare in Cobham, with collection, drop-off and weekend options.",
    body,
    structured: [faqJson(faqs), breadcrumbJson([{ name: "Home", url: "/" }, { name: "Pricing", url: "/pricing/" }])]
  }));
}

function areaIndex() {
  const body = `<section class="section"><div class="section-heading-row"><h2>Collection areas for woodland dog daycare.</h2><p>Each local page includes collection and drop-off context, nearby route information, local FAQs and a clear trial day CTA.</p></div><div class="area-layout">${areas.map(([slug, name, route]) => `<article class="area-panel"><h2><a href="/areas/${slug}/">Dog daycare collection in ${name}</a></h2><p>${esc(route)}.</p></article>`).join("")}</div></section>`;
  writePage("areas", layout({
    route: "areas",
    title: "Dog Daycare Collection Areas | Surrey & SW London",
    description: "Dog daycare collection areas for Duncan's Dog Co. across Cobham, Surrey and South West London.",
    keywords: "dog daycare SW London, dog daycare Surrey, dog daycare with collection",
    h1: "Dog Daycare Collection Across Surrey and SW London",
    intro: "Find your local collection page and book a trial day from your area.",
    body,
    structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Areas", url: "/areas/" }])]
  }));
}

function areaPages() {
  for (const [slug, name, route] of areas) {
    const legacy = legacyAreaPage(slug);
    const detail = areaDetails[slug] || {};
    const h1 = `Dog Daycare Collection in ${name}`;
    const dropOffOnly = legacy && /don't collect/i.test(legacy.collectionIntro || "");
    const journeyText = detail.journeyMins ? `around ${detail.journeyMins} minutes` : "a short drive";
    const postcodeText = detail.postcode ? ` (${detail.postcode})` : "";
    const roadText = detail.mainRoad || route;
    const faqs = [
      [`Do you collect dogs from ${name}?`, dropOffOnly ? `${name}${postcodeText} is currently best suited to drop-off at our Cobham facility, with easy access from nearby main routes.` : `Yes. Collection from ${name}${postcodeText} is available subject to route capacity and your dog's routine. The journey to our Cobham woodland takes ${journeyText} via the ${roadText}.`],
      [`How long does the journey from ${name} take?`, `Dogs travelling from ${name}${postcodeText} typically reach our Cobham woodland in ${journeyText} via the ${roadText}. They travel in our bespoke people carriers with familiar handlers throughout.`],
      [`Can I drop off my dog from ${name}?`, `Yes. Drop-off at our Cobham facility works well for ${name} families, especially those commuting via the ${roadText} or nearby Surrey routes. It is a straightforward drive to the site.`]
    ];
    const featureItems = (legacy?.features?.length ? legacy.features : [
      ["Open 7 days a week, 365 days a year", "Including weekends and bank holidays, for consistent care whenever you need it."],
      ["Exclusive access to private, secure woodland", "Over 40 acres of Surrey woodland with space to run, explore and be a dog."],
      [dropOffOnly ? `Easy access from ${name}` : "Door-to-door collection from 7:45am", dropOffOnly ? "Drop-off at our Cobham facility works well for families using the A3, M25 or nearby Surrey routes." : "We come to you in custom people carriers, with routes planned carefully around the dogs."],
      ["5-star licensed by Elmbridge Council", "One of the first daycares in the country to be inspected and rated."]
    ]);
    const routeItems = (legacy?.routes?.length ? legacy.routes : [
      [dropOffOnly ? "Drop Off" : "Collection Route", `${name} ${dropOffOnly ? "to Cobham" : "and surrounding areas"}`, legacy?.collectionIntro || `We will confirm the most sensible ${name} option before booking a trial day.`],
      ["Drop Off Yourself", "Prefer to drive in?", "Our Cobham facility is convenient for many families using the A3, M25 and surrounding Surrey routes."]
    ]);
    const areaTags = legacy?.areaTags?.length ? legacy.areaTags : areas.map(([areaSlug, areaName]) => ({ slug: areaSlug, label: areaName, active: areaSlug === slug }));
    const locationLinks = areaTags
      .filter((tag) => areas.some(([areaSlug]) => areaSlug === tag.slug))
      .map((tag) => `<a class="${tag.active ? "is-active" : ""}" href="/areas/${tag.slug}/">${tag.active ? "Current: " : ""}${esc(tag.label)}</a>`)
      .join("");
    const body = `<section class="location-intro-section">
      <div class="location-intro-copy reveal">
        <p class="section-kicker">${esc(legacy?.whyEyebrow || `Doggy Daycare in ${name}`)}</p>
        <h2>${esc(legacy?.whyTitle || `Woodland dog daycare for ${name} dogs.`)}</h2>
        <div class="squiggle-line" aria-hidden="true"></div>
        <p>${esc(legacy?.whyText || detail.intro || `Duncan's Dog Co. gives ${name} dogs a real outdoor day in private Cobham woodland, with collection and drop-off options planned around sensible routes.`)}</p>
        <div class="local-feature-list">${featureItems.map(([title, text]) => `<div class="local-feature"><span></span><p><strong>${esc(title)}</strong>${esc(text)}</p></div>`).join("")}</div>
      </div>
      <div class="location-intro-image reveal"><img src="${esc(legacy?.image || "/assets/woodland-wide.jpg")}" alt="Dog daycare for ${esc(name)} dogs at Duncan's Dog Co."></div>
    </section>
    <section class="local-route-section">
      <div class="local-route-heading reveal">
        <p class="section-kicker">${esc(legacy?.collectionKicker || "Collection & Drop-Off")}</p>
        <h2>${esc(legacy?.collectionTitle || `Collection and drop-off for ${name}.`)}</h2>
        <p>${esc(legacy?.collectionIntro || `We will confirm the current ${name} route, collection availability and drop-off options when you enquire.`)}</p>
      </div>
      <div class="local-route-grid">${routeItems.map(([label, title, text]) => `<article class="local-route-card reveal"><span>${esc(label)}</span><h2>${esc(title)}</h2><p>${esc(text)}</p></article>`).join("")}</div>
      <div class="vehicle-note reveal"><strong>${esc((legacy?.vehicleFact || "Routes are planned carefully every day.").split(". ")[0])}.</strong> ${esc((legacy?.vehicleFact || "Routes are planned carefully every day.").split(". ").slice(1).join(". "))}</div>
      <div class="local-area-cloud reveal"><span>Areas we serve - click to find out more</span><div>${locationLinks}</div></div>
    </section>
    <section class="section local-steps-section">
      <div class="section-heading-row reveal"><div><p class="section-kicker">Getting Started</p><h2>How it works.</h2></div><p>Every new dog starts with a proper conversation and introduction, so we understand their routine, confidence and suitability before they join the woodland group.</p></div>
      <div class="local-steps-grid">
        <article><span>01</span><h2>Get in touch</h2><p>Fill in our enquiry form or give us a call. Tell us about your dog, your area and what kind of weekly care you need.</p></article>
        <article><span>02</span><h2>Meet & greet</h2><p>We arrange a complimentary visit to our Cobham facility so your dog can see the space and our team can meet them properly.</p></article>
        <article><span>03</span><h2>Assessment day</h2><p>Every dog does a settling-in session before joining the group. We take it at their pace with no rushing and no pressure.</p></article>
        <article><span>04</span><h2>First woodland day</h2><p>${dropOffOnly ? "Drop them at our facility each morning and we will care for them all day, ready to head home happy and tired." : "Once everyone is happy, your dog joins us. We collect from your door, care for them all day and drop them home happy and tired."}</p></article>
      </div>
    </section>
    <section class="section local-services-section"><div class="section-heading-row reveal"><div><p class="section-kicker">Useful next pages</p><h2>Plan your dog's care.</h2></div><p>Compare daycare, puppy care, sleepovers, pricing and FAQs before you enquire from ${esc(name)}.</p></div>${linkPanel()}</section>
    <section class="section faqs"><div class="section-kicker">Local FAQs</div><h2>Dog daycare questions for ${esc(name)}</h2>${faqMarkup(faqs)}</section>
    <section class="contact-section"><div><p class="section-kicker">Trial Day</p><h2>Book a trial day from ${esc(name)}.</h2><p>Tell us about your dog and we will check collection, drop-off and suitability.</p></div><div class="contact-card"><a class="contact-link" href="tel:07731798899">07731 798 899</a><a class="contact-link" href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><a class="button primary" href="/contact/#enquiry-form">Book a trial day from ${esc(name)}</a></div></section>`;
    writePage(`areas/${slug}`, layout({
      route: `areas/${slug}`,
      title: (`Dog Daycare Collection in ${name} | Duncan's Dog Co.`.length > 60) ? `Dog Daycare in ${name} | Duncan's Dog Co.` : `${h1} | Duncan's Dog Co.`,
      description: `Dog daycare collection in ${name}${postcodeText} — ${journeyText} to our private Cobham woodland via the ${roadText}. Licensed, family-run care with door-to-door collection.`,
      keywords: `dog daycare ${name}, dog daycare collection ${name}, dog daycare with collection, dog daycare Surrey, dog daycare SW London`,
      h1,
      intro: legacy?.heroText || `Woodland dog daycare in Cobham with collection and drop-off options for ${name} families.`,
      heroData: legacy ? { eyebrow: legacy.heroEyebrow || `Doggy Daycare · ${name}`, displayTitle: legacy.heroTitle || `${esc(name)} dogs.<br><span>Private woodland days.</span>`, text: legacy.heroText, video: legacy.video || videoHero, ctaHref: "/contact/#enquiry-form", ctaText: "Enquire Now", stats: [["5★", "Licensed<br>Rating"], ["365", "Days<br>a Year"], ["40+", "Acres of<br>Woodland"]] } : null,
      body,
      structured: [faqJson(faqs), breadcrumbJson([{ name: "Home", url: "/" }, { name: "Areas", url: "/areas/" }, { name, url: `/areas/${slug}/` }])]
    }));
  }
}

const fullFaqSections = [
  {
    title: "Getting Started",
    intro: "Meet and greets, trial days and what happens before your dog joins us.",
    faqs: [
      ["Can we meet you before starting?", "Absolutely. We offer complimentary meet-and-greet sessions at our Cobham facility. This lets us get to know your dog's needs, temperament and energy levels, and gives you the chance to see exactly how everything works before committing."],
      ["Do you offer a trial or assessment day?", "Yes. All dogs complete an assessment and settling-in session before joining daycare. This lets us see how your dog interacts with the group, and gives your dog the chance to settle at their own pace without any pressure."],
      ["Is my dog suitable for daycare?", "Daycare suits social, people-friendly dogs who enjoy group environments. Every dog is assessed individually. All breeds are welcome, and if we have any concerns we'll always have an honest conversation rather than just saying no."],
      ["What are the next steps after enquiring?", "After you get in touch, we'll arrange a meet and greet at the facility. Once everyone's happy, you register online, add your dog's details and care notes, then manage bookings from there. On the day, we collect your dog, look after them all day and drop them home safe and happy."]
    ]
  },
  {
    title: "Collection & Transport",
    intro: "How dogs travel to Cobham and why the same team stays involved all day.",
    faqs: [
      ["What vehicles do you use?", "We use people carriers, not vans: bright, airy vehicles with custom-built guards for safety. Dogs are not caged individually. The vehicles are unbranded for discretion, and your dog can see and interact with the driver throughout the journey."],
      ["How long are dogs in the car?", "Routes are planned every single night to minimise travel time for each dog. We do not run fixed routes. We work out the most efficient order each evening based on who is coming the next day, so no dog is in the car any longer than necessary."],
      ["Who does the driving?", "Our own daycare staff do the driving: the same people who care for your dog throughout the day. The driver who collects your dog in the morning is part of the same team looking after them in the woodland. No strangers, no handoffs."],
      ["What time does collection start?", "Collection begins from 7:45am. Drop-off in the afternoon is included in all weekly daycare prices. If you have specific timing requirements, speak to us when you sign up and we'll do our best to accommodate you."],
      ["How are the collection groups organised?", "Our team plans each vehicle's passengers thoughtfully, grouping dogs by route, temperament and existing friendships. Dogs who know each other travel together where possible, making the journey calmer for everyone."]
    ]
  },
  {
    title: "Daily Life",
    intro: "What dogs do during the day, how groups work and what happens in all weather.",
    faqs: [
      ["What does a typical day look like?", "A balanced mix of woodland play, enrichment activities and structured rest. Dogs are not running flat out all day. We build in proper downtime so they return home happy and tired, not overstimulated. Every dog is supervised from collection to drop-off."],
      ["How are dogs grouped?", "Dogs are grouped carefully by size, age, energy level and existing friendships. We keep low staff-to-dog ratios throughout the day with consistent experienced carers in each group. We pay close attention to compatibility and adjust groupings if needed."],
      ["How many dogs do you care for each day?", "We are licensed for up to 150 dogs but typically care for around 90 on peak days. With over 40 acres of private woodland, every dog has space to explore, play and roam freely without it feeling crowded."],
      ["What happens when it rains?", "We embrace the outdoors. Rain does not stop play at Duncan's. We have indoor spaces for shelter and downtime, and every dog is thoroughly towel-dried and made comfortable before heading home."],
      ["Who looks after the dogs?", "A close-knit, consistent team. The same people who collect your dog are the ones who look after them all day. We do not separate collection from care. Our staff build real relationships with every dog, which means they notice changes in mood or behaviour quickly."],
      ["Are you open on weekends and bank holidays?", "Yes. We're open 7 days a week, 365 days a year including bank holidays. On bank holidays we operate with reduced numbers and adjusted routes, so timings may differ slightly. Weekend availability can be limited, so we recommend booking ahead."]
    ]
  },
  {
    title: "Puppies",
    intro: "How Puppy School works and how young dogs are introduced gently.",
    faqs: [
      ["Do you take puppies?", "Yes, once fully vaccinated. We introduce puppies gradually and provide extra support as they settle in. Puppies are introduced carefully, with one-to-one time from our team to build their confidence before joining wider daycare life."],
      ["What is Puppy School?", "Our puppy programme is for fully vaccinated puppies from 12 weeks. Sessions run in our woodland setting using positive reinforcement only. We cover socialisation, basic manners, recall foundations, lead walking, exposure to new environments and structured rest."],
      ["How do you handle puppies differently to adult dogs?", "Puppies have the same collection and drop-off times as regular daycare, but the structure of their day is different: more rest, gentler introductions and a slower pace. They are not kept entirely separate from adult dogs. Calm, well-socialised adults play an important part: they model good behaviour and help puppies learn what appropriate interaction looks like. Our team are experienced at reading early signals of stress and adjust the day accordingly."]
    ]
  },
  {
    title: "Sleepovers",
    intro: "Overnight care for dogs who already know the team and routine.",
    faqs: [
      ["How do sleepovers work?", "Your dog stays in our family home, nestled within the daycare grounds. They enjoy a full day of daycare with familiar friends, come into the family home at the end of the day, have dinner, wind down and sleep in a cosy room. There is always someone there, and dogs are never left alone overnight."],
      ["What do I need to provide for a sleepover?", "Bring your dog's usual food, any medication they need and optional comfort items such as a favourite toy or their own bedding. Familiar smells can help them settle quickly."],
      ["Does my dog need to have done daycare before a sleepover?", "Yes. A successful trial daycare visit is required before any overnight stay. Dogs who are already settled into daycare take to sleepovers much more naturally because the environment and team are already familiar."],
      ["Do school holidays book up quickly?", "Yes. If you're planning an overnight stay during a school holiday period, please enquire well in advance to avoid disappointment."]
    ]
  },
  {
    title: "Health & Wellbeing",
    intro: "First aid, neutering, seasons, rescue dogs and individual suitability.",
    faqs: [
      ["What if my dog is unwell or there's an incident?", "Our team is first-aid trained. If your dog is unwell or hurt during the day, you'll be contacted immediately and we'll arrange vet care if needed. We never wait and hope. If something does not look right, we act on it and keep you informed."],
      ["What's your neutering policy?", "We do not have a blanket neutering requirement. What matters to us is behaviour, not neuter status. If your female dog comes into season, she will need 10 days at home after her final day of bleeding and her slot is held during this time. Beyond seasons, we assess each dog individually and will have an open conversation if we feel anything needs to change."],
      ["What if my dog isn't neutered?", "Unneutered dogs are welcome. We assess suitability on behaviour, not neuter status. If a dog's behaviour becomes disruptive in the group we will have a conversation about it, but we do not make neutering a blanket condition of attendance."],
      ["How do you handle different sizes and temperaments?", "Dogs are grouped carefully by energy level, size and existing friendships. A small, nervous dog will not be put in with a large, boisterous group. Our consistent team know each dog's personality well and spot tension before it becomes a problem."],
      ["Do you have rescue dog support?", "Yes. Our rescue dog service is tailored to support the unique needs of rescue dogs, building confidence, gentle socialisation and a calm environment free from pressure. All breeds are welcome, and our team works closely with each rescue dog at their own pace."]
    ]
  },
  {
    title: "Pricing & Booking",
    intro: "Minimum attendance, bookings, discounts and what is included.",
    pricing: true,
    faqs: [
      ["What's your minimum attendance policy?", "We require a minimum of 4 days per calendar month. This helps dogs settle, stay socialised and maintain their routine within the pack. It reduces separation anxiety and keeps them familiar with our team."],
      ["How do I manage bookings?", "Once you've completed your meet and greet, you'll register online and create a profile for your dog. From there you can manage bookings, update care notes and keep everything in one place."],
      ["Do you offer any discounts?", "Yes. Blue Light Card holders receive 10% off. Simply show your card when signing up and we'll apply the discount automatically. Multi-day pricing also means the more days your dog attends each week, the better value it becomes."],
      ["What about sleepover pricing?", "Sleepover pricing is separate from daycare rates. Please get in touch directly for current overnight pricing and availability."]
    ]
  }
];

function flattenFaqSections(sections = fullFaqSections) {
  return sections.flatMap((section) => section.faqs);
}

function faqSectionMarkup(section, index) {
  const pricingPanel = section.pricing ? `<div class="faq-price-panel reveal">
    <span class="section-kicker">Current Pricing</span>
    <div class="faq-price-grid">
      <div><span>1 day/week</span><strong>£65</strong><small>per day</small></div>
      <div><span>2 days/week</span><strong>£60</strong><small>per day</small></div>
      <div class="is-featured"><span>3+ days/week</span><strong>£55</strong><small>per day</small></div>
      <div><span>Weekends & BH</span><strong>£75</strong><small>per day</small></div>
    </div>
    <p>Prices are based on weekly visits. A 4-day minimum charge per calendar month applies.</p>
  </div>` : "";
  return `<section class="faq-section-block reveal">
    <div class="faq-category-header">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div><h2>${esc(section.title)}</h2><p>${esc(section.intro)}</p></div>
      <small>${section.faqs.length} questions</small>
    </div>
    ${pricingPanel}
    <div class="faq-grid faq-page-grid">
      ${section.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
    </div>
  </section>`;
}

function faqPageBody() {
  return `<section class="faq-page-intro">
    <p class="section-kicker">Frequently Asked Questions</p>
    <h2>Everything you need to know.</h2>
    <p>Can't find what you're looking for? Call us on <a href="tel:07731798899">07731 798 899</a> or email <a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a>. We're always happy to help.</p>
  </section>
  <section class="faq-page-sections">
    ${fullFaqSections.map(faqSectionMarkup).join("")}
    ${linkPanel()}
  </section>
  ${ctaBand("Still have questions?", "We're always happy to chat.", "Call us, WhatsApp us, or send us a message. Whichever works best for you.", "/contact/#enquiry-form", "Get in Touch")}`;
}

function faqAndContact() {
  const faqs = flattenFaqSections();
  writePage("faq", layout({ route: "faq", title: "Dog Daycare FAQs | Duncan's Dog Co.", description: "Detailed FAQs about dog daycare in Cobham, collection, transport, puppy daycare, sleepovers, health, pricing, booking and woodland care.", keywords: "dog daycare FAQ Cobham, dog daycare with collection FAQ, puppy daycare FAQ Surrey, dog sleepover FAQ", h1: "Dog Daycare FAQs", intro: "Straight answers before you enquire.", body: faqPageBody(), structured: [faqJson(faqs), breadcrumbJson([{ name: "Home", url: "/" }, { name: "FAQ", url: "/faq/" }])] }));
  const contactBody = `<section class="contact-page-section" id="enquiry-form">
    <div class="contact-inner">
      <div class="form-wrap reveal">
        <h2>Send us an enquiry</h2>
        <form name="enquiry" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="enquiry">
          <p class="sr-only"><label>Don't fill this out: <input name="bot-field"></label></p>
          <div class="form-row">
            <div class="form-group"><label for="name">Your name *</label><input type="text" id="name" name="name" autocomplete="name" required placeholder="Jane Smith"></div>
            <div class="form-group"><label for="email">Email address *</label><input type="email" id="email" name="email" autocomplete="email" required placeholder="jane@example.com"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="phone">Phone number *</label><input type="tel" id="phone" name="phone" autocomplete="tel" required placeholder="07700 900000"></div>
            <div class="form-group"><label for="dog-name">Your dog's name *</label><input type="text" id="dog-name" name="dog_name" required placeholder="Buddy"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="breed">Dog's breed *</label><input type="text" id="breed" name="breed" required placeholder="e.g. Labrador, Spaniel"></div>
            <div class="form-group"><label for="age">Dog's age *</label><select id="age" name="dog_age" required><option value="">Select age</option><option>Under 6 months</option><option>6-12 months</option><option>1-2 years</option><option>2-5 years</option><option>5+ years</option></select></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="neutered">Neutered / spayed? *</label><select id="neutered" name="neutered" required><option value="">Select</option><option>Yes</option><option>No</option><option>Not yet (puppy)</option></select></div>
            <div class="form-group"><label for="sex">Dog's sex *</label><select id="sex" name="sex" required><option value="">Select</option><option>Male</option><option>Female</option></select></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="address">Your address *</label><textarea id="address" name="address" required placeholder="House number, street, town and postcode"></textarea></div>
            <div class="form-group"><label for="service">Service interested in</label><select id="service" name="service"><option value="">Select service</option><option>Doggy Daycare</option><option>Puppy School</option><option>Sleepovers</option><option>Rescue Dog Daycare</option><option>Startup Support</option><option>Careers</option><option>Just enquiring</option></select></div>
          </div>
          <div class="form-notes">
            <div class="form-note-card"><strong>Sleepovers:</strong> Subject to a trial daycare visit and a few settled days in the run-up, so we know your dog is truly happy before their stay. Spaces are limited, so please enquire early and include your dates below.</div>
            <div class="form-note-card"><strong>School holidays:</strong> We fill up fast, so please enquire well in advance to avoid disappointment.</div>
          </div>
          <div class="form-group">
            <label for="message">Anything else we should know?</label>
            <textarea id="message" name="message" placeholder="Tell us a bit about your dog - temperament, any quirks, how many days a week you're thinking..."></textarea>
          </div>
          <button type="submit" class="form-submit">Send Enquiry</button>
        </form>
      </div>
      <aside class="contact-details reveal" aria-label="Direct contact details">
        <div>
          <h2>Get in touch directly</h2>
          <p>Prefer to call or email? We're happy to chat. We're usually available Monday-Sunday, 7:30am-6:30pm.</p>
        </div>
        <div class="contact-item"><div class="contact-item-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div><div><span class="contact-item-label">Phone</span><div class="contact-item-value"><a href="tel:07731798899">07731 798 899</a></div><div class="contact-item-sub">Mon-Sun, 7:30am-6:30pm</div></div></div>
        <div class="contact-item"><div class="contact-item-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg></div><div><span class="contact-item-label">Email</span><div class="contact-item-value"><a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a></div><div class="contact-item-sub">We reply within 24 hours</div></div></div>
        <div class="contact-item"><div class="contact-item-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div><div><span class="contact-item-label">Location</span><div class="contact-item-value">Cobham, Surrey</div><div class="contact-item-sub">Exact address given on booking</div></div></div>
        <div class="contact-item"><div class="contact-item-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><div><span class="contact-item-label">Hours</span><div class="contact-item-value">7 days a week</div><div class="contact-item-sub">Collection from 7:45am · Drop-off by 6pm</div></div></div>
      </aside>
    </div>
  </section>`;
  writePage("contact", layout({ route: "contact", title: "Contact Duncan's Dog Co. | Dog Daycare Cobham", description: "Contact Duncan's Dog Co. about dog daycare, puppy daycare, collection, drop-off and dog sleepovers in Cobham, Surrey.", keywords: "contact dog daycare Cobham, dog daycare enquiry Surrey", h1: "Enquire About Dog Daycare in Cobham", intro: "Tell us about your dog, your area and the care you need.", heroData: { eyebrow: "Duncan's Dog Co · Cobham, Surrey", displayTitle: "Let's get<br><span>your dog started.</span>", text: "Fill in the form below and we'll be in touch within 24 hours to arrange a meet and greet.", video: "https://video.wixstatic.com/video/4d2311_dc5ef7217b904315baa814b81aa6906a/1080p/mp4/file.mp4", ctaHref: "#enquiry-form", ctaText: "Enquire Now", stats: [["15+", "Years<br>Running"], ["40+", "Acres of<br>Woodland"], ["1:6", "Staff<br>Ratio"], ["5★", "Licensed<br>Rating"]] }, body: contactBody, structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Contact", url: "/contact/" }])] }));
  writePage("thank-you", layout({ route: "thank-you", noindex: true, title: "Thank You | Duncan's Dog Co.", description: "Thank you for enquiring with Duncan's Dog Co.", keywords: "Duncan's Dog Co enquiry thank you", h1: "Enquiry received.", intro: "We've got your message — no need to send it again.", body: `<section class="section contact-section"><div><p class="section-kicker">What happens next</p><h2>We'll be in touch within 24 hours.</h2><p>We've received your enquiry and will come back to you about your dog, availability and the right next step. You don't need to contact us again — we have everything we need.</p><p>If you need to reach us urgently, call or email us directly below.</p></div><div class="contact-card"><a class="contact-link" href="tel:07731798899">07731 798 899</a><a class="contact-link" href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><a class="button primary" href="/">Back to homepage</a></div></section>`, structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Thank You", url: "/thank-you/" }])] }));
  writePage("startup-support", layout({ route: "startup-support", title: "Dog Daycare Startup Support | Duncan's Dog Co.", description: "Startup support for dog daycare founders from Duncan's Dog Co., a family-run woodland daycare in Cobham established in 2011.", keywords: "dog daycare startup support, start a dog daycare, dog business support UK", h1: "Dog Daycare Startup Support", intro: "Practical support for people building thoughtful, licensed dog care businesses.", heroData: { eyebrow: "Dog Daycare Startup Support", displayTitle: "15 years of knowledge.<br><span>Yours from day one.</span>", text: "We share the templates, systems and experience we built from scratch, so you can start faster and avoid the mistakes we made.", video: "https://video.wixstatic.com/video/4d2311_60a7a5c2d3264b3fb778671f4e3e86ec/720p/mp4/file.mp4", ctaHref: "mailto:becks@duncansdogco.com?subject=Enquiry%20about%20help%20with%20my%20licensing", ctaText: "Get in Touch", stats: [["15+", "Years<br>Running"], ["5★", "Licensed<br>Daycare"], ["Est.", "2011<br>Cobham"]] }, body: startupSupportBody(), structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Startup Support", url: "/startup-support/" }])] }));
  writePage("careers", layout({ route: "careers", title: "Dog Daycare Jobs in Cobham | Duncan's Dog Co.", description: "Join the team at Duncan's Dog Co., a family-run woodland dog daycare in Cobham, Surrey. Dog handler and driver roles, outdoor work and a team that loves what it does.", keywords: "dog daycare jobs Cobham, dog daycare careers Surrey, dog handler jobs Surrey", h1: "Careers at Duncan's Dog Co.", intro: "Join a family-run woodland daycare in Cobham, Surrey.", heroData: { eyebrow: "Careers · Cobham, Surrey", displayTitle: "Come and join<br><span>our pack.</span>", text: "We're a family-run woodland daycare that's been running since 2011. If you love dogs, early mornings, and doing work that actually matters, we'd love to hear from you.", video: videoHero, ctaHref: "#apply", ctaText: "Apply Now", stats: [["15+", "Years<br>Running"], ["40+", "Acres of<br>Woodland"], ["5★", "Elmbridge<br>Rated"]] }, body: `<section class="section careers-reasons-section"><div class="section-heading-row reveal"><div><p class="section-kicker">Why join us</p><h2>Six good reasons to join the team.</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>It is outdoor, practical, dog-focused work with a small team and a setting that feels nothing like a corporate workplace.</p></div>${richFeatureGrid([["Spend your days with dogs", "Every day you are surrounded by cared-for dogs in a private woodland setting."], ["No two days are the same", "Collections, daycare, sleepovers and different dogs make the rhythm varied."], ["Learn as you go", "We teach safe handling, welfare routines and dog behaviour basics."], ["Be part of a tight team", "Every person counts, everyone knows the dogs and the work is personal."], ["Work in our woodland", "Fresh air, open space and over 40 acres of private Cobham woodland."], ["Five-star rated", "Work somewhere local families have trusted for over a decade."]])}</section><section class="section role-section" id="apply"><div class="section-heading-row reveal"><div><p class="section-kicker">Current opening</p><h2>Full Time Driver & Daycare Assistant.</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>We are looking for a reliable, dog-loving person to collect and drop off dogs across our catchment area and support the daycare team throughout the day.</p></div><div class="rich-feature-grid icon-feature-grid career-role-grid"><article class="rich-feature-card reveal"><span class="mini-icon" aria-hidden="true">${motifIcon("collection")}</span><h3>What you'll be doing</h3><p>Collecting dogs from client homes, dropping them home safely, supervising dogs in the woodland, feeding and monitoring, keeping records and helping maintain site and vehicle standards.</p></article><article class="rich-feature-card reveal"><span class="mini-icon" aria-hidden="true">${motifIcon("team")}</span><h3>What we're looking for</h3><p>A genuine love for dogs, a full clean UK driving licence, calm animal handling, reliability, good people skills, physical fitness and comfort with early starts.</p></article><article class="rich-feature-card career-apply-card reveal"><span class="mini-icon" aria-hidden="true">${motifIcon("mail")}</span><h3>Apply now</h3><p>Email us with a bit about yourself, your dog experience and availability.</p><a class="button primary" href="mailto:info@duncansdogco.com?subject=Careers%20application">Apply by email</a></article></div></section>`, structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Careers", url: "/careers/" }])] }));
  writePage("privacy-policy", layout({ route: "privacy-policy", title: "Privacy Policy | Duncan's Dog Co.", description: "Privacy policy for Duncan's Dog Co., covering how we collect, use and protect the personal information you share with us.", keywords: "privacy policy Duncan's Dog Co", h1: "Privacy Policy", intro: "How Duncan's Dog Co. collects, uses and protects your personal information.", body: `<section class="section article">
<p><strong>Last updated: May 2025</strong></p>
<p>Duncan's Dog Co. is a family-run dog daycare, boarding and collection service based in Cobham, Surrey, operating as a sole trader. We are the data controller for the personal information we collect from you. This policy explains what we collect, why, and what your rights are.</p>
<p>If you have any questions, email us at <a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a> or call <a href="tel:07731798899">07731 798 899</a>.</p>

<h2>1. What information we collect</h2>
<p>We collect personal information when you use our enquiry form, contact us by email or phone, or use our services. This includes:</p>
<ul>
<li>Your name, email address and phone number</li>
<li>Your home address and postcode (for collection route planning)</li>
<li>Information about your dog: name, breed, age, temperament and health details</li>
<li>Any other information you choose to share in messages or conversations with us</li>
</ul>
<p>We do not collect payment card details through this website. Any payments are handled directly and separately.</p>

<h2>2. How we use your information</h2>
<p>We use the information you provide to:</p>
<ul>
<li>Respond to your enquiry and assess whether our service is a good fit for your dog</li>
<li>Arrange and manage trial days, daycare bookings, puppy sessions and sleepovers</li>
<li>Plan and coordinate collection and drop-off routes</li>
<li>Contact you about your bookings, your dog's welfare and service updates</li>
<li>Meet our legal obligations, including licensing requirements under the Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018</li>
</ul>

<h2>3. Legal basis for processing</h2>
<p>We process your personal data on the following grounds:</p>
<ul>
<li><strong>Contract performance:</strong> to provide the daycare and boarding services you have requested</li>
<li><strong>Legitimate interests:</strong> to respond to enquiries and manage our business operations</li>
<li><strong>Legal obligation:</strong> to comply with licensing and animal welfare regulations</li>
</ul>

<h2>4. Who we share your information with</h2>
<p>We do not sell your personal information. We may share limited information with:</p>
<ul>
<li><strong>Netlify:</strong> our website host, which processes enquiry form submissions on our behalf. Netlify is GDPR-compliant and processes data in accordance with their Data Processing Agreement.</li>
<li><strong>Our team members:</strong> staff involved in your dog's care will have access to the information needed to provide that care safely</li>
<li><strong>Emergency veterinary services:</strong> in the event of a medical emergency involving your dog, we may share your contact details and your dog's basic information with a vet</li>
</ul>
<p>We will not share your information with any other third parties without your explicit consent, except where required by law.</p>

<h2>5. How long we keep your information</h2>
<p>We keep your information for as long as you are an active client and for a reasonable period afterwards, typically three years, in case of any queries or disputes. Information from enquiries that did not lead to a booking is held for up to 12 months. We will delete your information on request (see your rights below).</p>

<h2>6. Your rights</h2>
<p>Under UK GDPR, you have the right to:</p>
<ul>
<li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
<li><strong>Rectification:</strong> ask us to correct inaccurate or incomplete information</li>
<li><strong>Erasure:</strong> ask us to delete your data where there is no lawful reason to continue holding it</li>
<li><strong>Restriction:</strong> ask us to limit how we use your data while a concern is being resolved</li>
<li><strong>Objection:</strong> object to our use of your data where we rely on legitimate interests</li>
<li><strong>Portability:</strong> request your data in a structured, commonly used format</li>
</ul>
<p>To exercise any of these rights, email <a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a>. We will respond within 30 days.</p>
<p>If you are not satisfied with how we handle your data, you have the right to complain to the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a> or by calling 0303 123 1113.</p>

<h2>7. Cookies and website data</h2>
<p>Our website does not use tracking or advertising cookies. We do not use Google Analytics or any third-party analytics tools that collect personally identifiable information through cookies. No cookie consent banner is required as a result.</p>
<p>If we add any cookies or analytics tools in future, this policy will be updated and a cookie notice will be added to the site.</p>

<h2>8. Security</h2>
<p>We take reasonable steps to protect your personal information from unauthorised access, loss or misuse. Our website is served over HTTPS and enquiry form data is transmitted securely through Netlify's infrastructure.</p>

<h2>9. Changes to this policy</h2>
<p>We may update this privacy policy from time to time. Any material changes will be noted at the top of this page with an updated date. Continued use of our services after changes are posted constitutes acceptance of the updated policy.</p>

<h2>10. Contact</h2>
<p>Duncan's Dog Co.<br>Cobham, Surrey<br>Email: <a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><br>Phone: <a href="tel:07731798899">07731 798 899</a></p>
</section>`, structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Privacy Policy", url: "/privacy-policy/" }])] }));
  writePage("terms-conditions", layout({ route: "terms-conditions", title: "Terms and Conditions | Duncan's Dog Co.", description: "Terms and conditions for Duncan's Dog Co. dog daycare, boarding and collection services in Cobham, Surrey.", keywords: "terms and conditions Duncan's Dog Co, dog daycare terms Cobham", h1: "Terms and Conditions", intro: "Terms covering daycare, boarding, collection and puppy services at Duncan's Dog Co.", body: `<section class="section article">
<p><strong>Last updated: May 2025</strong></p>
<p>These terms and conditions apply to all services provided by Duncan's Dog Co., operating from Cobham, Surrey. By booking or using our services, you agree to these terms. Please read them carefully and contact us at <a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a> if anything is unclear.</p>

<h2>1. Trial day requirement</h2>
<p>All new dogs must complete a trial day before joining regular daycare or boarding. The trial allows us to assess your dog's temperament, compatibility with the group and suitability for our environment. We reserve the right to decline a dog at any stage, including after a trial, if we do not believe the placement is appropriate for the dog or the existing group. This decision is final and is always made in the interest of welfare.</p>

<h2>2. Health and vaccination requirements</h2>
<p>For the safety of all dogs in our care, the following requirements apply:</p>
<ul>
<li>All dogs must be up to date with core vaccinations (distemper, parvovirus, hepatitis and leptospirosis). Vaccination records must be provided before the first session.</li>
<li>Dogs must be treated regularly for fleas and ticks with a veterinary-approved product. Evidence of treatment may be requested.</li>
<li>Bitches in season are not accepted. Please notify us immediately if your dog comes into season while booked.</li>
<li>Dogs showing signs of illness, including vomiting, diarrhoea, suspected kennel cough or any contagious condition, must not attend. A minimum 14-day exclusion applies following kennel cough diagnosis.</li>
<li>We reserve the right to exclude any dog we consider unwell or posing a risk to other dogs.</li>
</ul>

<h2>3. Booking and payment</h2>
<p>Bookings are confirmed by us in writing (email or message). Regular client spaces are reserved on an ongoing or rolling basis. Ad hoc bookings are subject to availability.</p>
<p>Payment terms are agreed individually with each client and outlined at the start of the arrangement. Invoices are due for payment within the agreed period. We reserve the right to suspend bookings for accounts with outstanding balances.</p>

<h2>4. Cancellation policy</h2>
<p>We ask for as much notice as possible when cancelling a booked day. Our current cancellation terms are:</p>
<ul>
<li><strong>More than 48 hours notice:</strong> no charge</li>
<li><strong>Less than 48 hours notice:</strong> the full session fee may be charged at our discretion</li>
<li><strong>Same-day cancellation (including no-shows):</strong> the full session fee will be charged</li>
</ul>
<p>We will not charge for cancellations due to your dog's illness, provided you notify us before the collection window. We may cancel bookings with reasonable notice due to staff absence, adverse conditions or other operational reasons, in which case no charge will be made.</p>

<h2>5. Collection and drop-off service</h2>
<p>Collection and drop-off is offered across our catchment areas in Surrey and South West London. Routes are planned by us and we cannot guarantee specific collection or drop-off times, though we aim to keep these consistent. You are responsible for ensuring your dog is ready and accessible at the agreed collection point at the expected time.</p>
<p>If your dog cannot be collected after repeated attempts, we may count the session as a no-show and charge accordingly. Collection routes and areas are reviewed periodically and may change with reasonable notice.</p>

<h2>6. Emergency veterinary care</h2>
<p>In the event of a medical emergency, we will seek veterinary treatment for your dog without delay. By using our services, you authorise us to consent to emergency veterinary treatment on your behalf if we cannot reach you in time. All veterinary costs in such circumstances are your responsibility. We strongly recommend that you maintain appropriate pet insurance.</p>
<p>We will always attempt to contact you before any non-emergency treatment and will follow your instructions where practicable.</p>

<h2>7. Liability</h2>
<p>We take every reasonable precaution to keep dogs in our care safe. However, dogs can be unpredictable, and accidents do happen. Duncan's Dog Co. will not be liable for:</p>
<ul>
<li>Minor injuries resulting from normal dog-to-dog interaction</li>
<li>Loss or damage caused by your dog to property or other animals</li>
<li>Veterinary costs not directly resulting from our negligence</li>
</ul>
<p>Nothing in these terms limits our liability for death or personal injury caused by our negligence, or for any other liability that cannot be excluded by law.</p>
<p>You are responsible for any damage or injury caused by your dog to our staff, vehicles, property or other dogs in our care. We recommend you hold appropriate third-party liability insurance for your dog (this is often included in pet insurance policies).</p>

<h2>8. Dog welfare and behaviour</h2>
<p>We operate under an Elmbridge Borough Council animal activity licence and are committed to the five welfare needs of all dogs in our care. Our staff are trained in dog behaviour and handling. We use positive, force-free methods at all times.</p>
<p>If your dog shows persistent aggression, persistent anxiety or behaviour that poses a risk to the group, we may suspend or end the arrangement with reasonable notice. Our priority will always be the welfare of your dog and the dogs around them.</p>

<h2>9. Your responsibilities</h2>
<p>As the dog's owner, you confirm that:</p>
<ul>
<li>Your dog is in good health, up to date with vaccinations, and free from known contagious conditions</li>
<li>You have disclosed any known health conditions, behavioural history or relevant background</li>
<li>You will keep your contact details and emergency contact information up to date</li>
<li>You hold valid pet insurance or accept full financial responsibility for your dog's veterinary care</li>
</ul>

<h2>10. Changes to these terms</h2>
<p>We may update these terms from time to time. We will give reasonable notice of any material changes. Continued use of our services after changes take effect constitutes acceptance of the updated terms.</p>

<h2>11. Governing law</h2>
<p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the English courts.</p>

<h2>12. Contact</h2>
<p>Duncan's Dog Co.<br>Cobham, Surrey<br>Email: <a href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><br>Phone: <a href="tel:07731798899">07731 798 899</a></p>
</section>`, structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Terms and Conditions", url: "/terms-conditions/" }])] }));
}

function aboutUs() {
  const body = `${liveIntro({
    kicker: "About Duncan's Dog Co.",
    title: "Built from a love of dogs and the outdoors.",
    paragraphs: [
      "Duncan's Dog Co. was founded in 2011 by Duncan and Jess. The DDC journey began simply, walking the dogs of South West London and spending their days on Wimbledon Common fulfilling their outdoorsy dream.",
      "After some time, it became apparent that there were very few facilities in the UK offering genuine quality care within a secure, enriching environment. That gap inspired them to set out on a mission to develop a daycare environment like no other.",
      "Over the years, their children Harley and Ayda have been part of the journey too, helping to care for the dogs at every opportunity and creating a truly special bond between their family and the dogs who are part of DDC.",
      "What they have achieved could not have been done without their dedicated team of staff. Read below to meet the integral members of the DDC family."
    ],
    badge: "Family-run since 2011",
    image: gallerySrc(gallery.familyRunTeam),
    alt: "Duncan's Dog Co. family-run team with certificates"
  })}
  ${teamMembersSection()}
  <section class="section live-content">
    <div class="section-heading-row reveal"><div><p class="section-kicker">Our standards</p><h2>What we stand for.</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>Premium care should still feel personal, grounded and honest.</p></div>
    ${richFeatureGrid([
      ["All breeds welcome", "No breed discrimination. We look at the individual dog, their temperament and whether daycare is right for them."],
      ["Not kennels", "Sleepovers are designed around familiar care and known dogs, not rows of runs or a kennel block."],
      ["Open 365 days", "The team supports families across weekdays, weekends, bank holidays and busy seasons."],
      ["Collection across Surrey and SW London", "Routes are planned carefully from Cobham across selected local catchment areas."],
      ["Puppy pathway", "Puppies get gentle introductions, age-appropriate socialisation and steady support as they develop."],
      ["Clear communication", "We keep owners in the loop and encourage honest questions about behaviour, routines and fit."]
    ])}
  </section>
  <section class="contact-section">
    <div><p class="section-kicker">Come and meet us</p><h2>Book a trial day.</h2><p>Tell us about your dog and we will talk through the best next step for daycare, puppy care or sleepovers.</p></div>
    <div class="contact-card"><a class="contact-link" href="tel:07731798899">07731 798 899</a><a class="contact-link" href="mailto:info@duncansdogco.com">info@duncansdogco.com</a><a class="button primary" href="/contact/#enquiry-form">Enquire Now</a></div>
  </section>`;
  writePage("about-us", layout({
    route: "about-us",
    title: "About Duncan's Dog Co. | Family-Run Dog Daycare in Cobham",
    description: "Meet Duncan's Dog Co., a family-run woodland dog daycare in Cobham trusted since 2011, with a known team, licensed care and collection across Surrey and SW London.",
    keywords: "about Duncan's Dog Co, dog daycare team Cobham, family run dog daycare Surrey",
    h1: "About Duncan's Dog Co.",
    intro: "Meet the family-run team behind Duncan's Dog Co., trusted for woodland dog daycare in Cobham since 2011.",
    heroData: {
      eyebrow: "About Us · Cobham, Surrey",
      displayTitle: "Family-run care.<br><span>Known dogs. Known team.</span>",
      text: "Woodland dog daycare in Cobham, with safe collection across Surrey and South West London since 2011.",
      video: videoHero,
      ctaHref: "/contact/#enquiry-form",
      ctaText: "Book a trial day",
      stats: [["Est.", "2011"], ["5★", "Licensed<br>Daycare"], ["40+", "Acres of<br>Woodland"], ["365", "Days<br>A Year"]]
    },
    body,
    structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "About Us", url: "/about-us/" }])]
  }));
}

function blogArticleMarkup(slug, desc) {
  const sections = blogArticleContent[slug] || [];
  const articleSections = sections.map(([heading, paragraphs]) => `<section class="blog-article-section"><h2>${esc(heading)}</h2>${paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</section>`).join("");
  return `<p class="article-lede">${esc(desc)}</p>${articleSections}${blogRelatedLinks(slug)}`;
}

function blogRelatedLinks(slug) {
  const links = {
    "woodland-dog-daycare-vs-indoor-dog-daycare": [["Dog daycare", "/daycare/"], ["Pricing", "/pricing/"], ["FAQ", "/faq/"], ["Enquire", "/contact/#enquiry-form"]],
    "dog-daycare-with-collection-wimbledon": [["Wimbledon collection", "/areas/wimbledon/"], ["Dog daycare", "/daycare/"], ["Pricing", "/pricing/"], ["Book a trial day", "/contact/#enquiry-form"]],
    "dog-daycare-collection-clapham-putney-wandsworth": [["Clapham", "/areas/clapham/"], ["Putney", "/areas/putney/"], ["Wandsworth", "/areas/wandsworth/"], ["Contact", "/contact/#enquiry-form"]],
    "dog-boarding-vs-kennels": [["Sleepovers", "/sleepovers/"], ["Dog daycare", "/daycare/"], ["Pricing", "/pricing/"], ["FAQ", "/faq/"]],
    "what-to-look-for-in-licensed-dog-daycare": [["Dog daycare", "/daycare/"], ["About us", "/about-us/"], ["FAQ", "/faq/"], ["Enquire", "/contact/#enquiry-form"]],
    "puppy-daycare-vs-puppy-classes": [["Puppy School", "/puppies/"], ["Dog daycare", "/daycare/"], ["Pricing", "/pricing/"], ["Contact", "/contact/#enquiry-form"]],
    "how-trial-days-work": [["Contact", "/contact/#enquiry-form"], ["FAQ", "/faq/"], ["Pricing", "/pricing/"], ["Dog daycare", "/daycare/"]],
    "why-collection-is-part-of-care": [["Collection areas", "/areas/"], ["Dog daycare", "/daycare/"], ["Pricing", "/pricing/"], ["Contact", "/contact/#enquiry-form"]],
    "rescue-dog-daycare-gentle-introductions": [["Rescue dogs", "/rescue/"], ["Dog daycare", "/daycare/"], ["FAQ", "/faq/"], ["Enquire", "/contact/#enquiry-form"]],
    "woodland-daycare-when-it-rains": [["Dog daycare", "/daycare/"], ["FAQ", "/faq/"], ["Pricing", "/pricing/"], ["Book a trial day", "/contact/#enquiry-form"]]
  }[slug] || [["Dog daycare", "/daycare/"], ["Pricing", "/pricing/"], ["FAQ", "/faq/"], ["Contact", "/contact/#enquiry-form"]];
  return `<div class="internal-links blog-related-links">${links.map(([label, href]) => `<a href="${href}">${esc(label)}</a>`).join("")}</div>`;
}

function blog() {
  writePage("blog", layout({ route: "blog", title: "Dog Daycare Advice & Guides | Duncan's Dog Co.", description: "Guides and advice from Duncan's Dog Co. on woodland dog daycare, puppy socialisation, rescue dogs, boarding, collection and choosing licensed care in Cobham and Surrey.", keywords: "dog daycare blog, puppy socialisation Surrey, dog boarding vs kennels", h1: "Duncan's Dog Co. Blog", intro: "Stories and useful reads for owners comparing daycare, puppy care, collection and sleepovers.", body: `<section class="section blog-index-section"><div class="section-heading-row reveal"><div><p class="section-kicker">Blog</p><h2>Latest reads from the woodland.</h2><div class="squiggle-line" aria-hidden="true"></div></div><p>Short, useful posts on choosing daycare, puppy socialisation, collection, sleepovers and woodland care.</p></div><div class="blog-card-grid">${blogPosts.map(([slug, title, desc, imageKey]) => `<a class="blog-card reveal" href="/blog/${slug}/"><div class="blog-card-image"><img src="${gallerySrc(gallery[imageKey] || gallery.woodlandGroup)}" alt="${esc(title)} at Duncan's Dog Co." loading="lazy"></div><div class="blog-card-copy"><span>${esc(title.split(" ")[0])}</span><h2>${esc(title)}</h2><p>${esc(desc)}</p><strong>Read post <span aria-hidden="true">→</span></strong></div></a>`).join("")}</div></section>`, structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog/" }])] }));
  for (const [slug, title, desc, imageKey] of blogPosts) {
    const image = gallerySrc(gallery[imageKey] || gallery.woodlandGroup);
    writePage(`blog/${slug}`, layout({ route: `blog/${slug}`, title: `${title} | Duncan's Dog Co.`, description: desc, keywords: `${title}, dog daycare Cobham, dog daycare Surrey`, h1: title, intro: desc, body: `<section class="blog-article-hero"><img src="${image}" alt="${esc(title)} at Duncan's Dog Co." loading="lazy"></section><section class="section article blog-article">${blogArticleMarkup(slug, desc)}</section>`, structured: [breadcrumbJson([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog/" }, { name: title, url: `/blog/${slug}/` }])] }));
  }
}

function redirectsAndMeta() {
  const redirects = [
    // Old long service URLs → new short URLs (for SEO continuity)
    ["/dog-daycare-cobham", "/daycare/"],
    ["/dog-daycare-cobham/", "/daycare/"],
    ["/puppy-daycare-cobham", "/puppies/"],
    ["/puppy-daycare-cobham/", "/puppies/"],
    ["/dog-boarding-cobham", "/sleepovers/"],
    ["/dog-boarding-cobham/", "/sleepovers/"],
    ["/rescue-dog-daycare", "/rescue/"],
    ["/rescue-dog-daycare/", "/rescue/"],
    // Old .html and short slugs from original site
    ["/daycare.html", "/daycare/"],
    ["/puppies.html", "/puppies/"],
    ["/sleepover", "/sleepovers/"],
    ["/sleepover.html", "/sleepovers/"],
    ["/faqs", "/faq/"],
    ["/faqs.html", "/faq/"],
    ["/pricing.html", "/pricing/"],
    ["/contact.html", "/contact/"],
    ["/startup-support.html", "/startup-support/"],
    ["/privacy-policy.html", "/privacy-policy/"],
    ["/terms-conditions.html", "/terms-conditions/"],
    ["/about", "/about-us/"],
    ["/about.html", "/about-us/"],
    ["/team", "/about-us/"],
    ["/team.html", "/about-us/"],
    ["/careers.html", "/careers/"],
    ...areas.map(([slug]) => [`/${slug}.html`, `/areas/${slug}/`]),
    ...areas.map(([slug]) => [`/${slug}/`, `/areas/${slug}/`]),
    ...areas.map(([slug]) => [`/${slug}`, `/areas/${slug}/`])
  ];
  const faviconRedirects = [
    "/favicon.ico /assets/favicon-32x32.png 200",
    "/apple-touch-icon.png /assets/apple-touch-icon.png 200",
    "/apple-touch-icon-precomposed.png /assets/apple-touch-icon.png 200"
  ];
  // www → non-www redirect (kicks in once www DNS is pointed at Netlify)
  const wwwRedirect = "https://www.duncansdogco.com/* https://duncansdogco.com/:splat 301!";
  fs.writeFileSync(path.join(ROOT, "_redirects"), wwwRedirect + "\n" + redirects.map(([from, to]) => `${from} ${to} 301`).join("\n") + "\n" + faviconRedirects.join("\n") + "\n");
  fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  // Copy favicon to root so Google's crawler finds it at /favicon.ico directly
  fs.copyFileSync(path.join(ROOT, "assets/favicon-32x32.png"), path.join(ROOT, "favicon.ico"));
  const urls = ["/", ...servicePages.map((p) => `/${p.slug}/`), "/splash/", "/pricing/", "/about-us/", "/areas/", ...areas.map(([slug]) => `/areas/${slug}/`), "/faq/", "/contact/", "/startup-support/", "/careers/", "/blog/", ...blogPosts.map(([slug]) => `/blog/${slug}/`)];
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${SITE}${url}</loc></url>`).join("\n")}\n</urlset>\n`);
  fs.writeFileSync(path.join(ROOT, "site-data.json"), JSON.stringify({ site: SITE, keywords: ["dog daycare Cobham", "doggy daycare Cobham", "dog daycare Surrey", "woodland dog daycare", "dog daycare with collection", "dog daycare SW London", "puppy daycare Surrey", "puppy school Cobham", "dog boarding Cobham", "dog sleepovers Surrey"], areas: areas.map(([slug, name, route]) => ({ slug, name, route })), services: servicePages.map(({ slug, title, keywords }) => ({ slug, title, keywords })) }, null, 2));
}

clean();
home();
services();
splash();
pricing();
areaIndex();
areaPages();
faqAndContact();
aboutUs();
blog();
redirectsAndMeta();
