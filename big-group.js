/* Big-group games written for this playbook (30-minute gym, no elimination). */
window.BG30_MONTH = {
  September: [
    ["Ten-Second Tag", "", "Half gym. New taggers every 10 seconds. Tagged: 5 jumping jacks, then back in."],
    ["Everybody’s It", "", "Everyone tags. Double-tag = rock-paper-scissors; loser does 3 squats and stays in."],
    ["Elements Sprint", "", "Three walls: Fire, Earth, Water. Call the element or an animal. Sprint to that wall."],
    ["Simon Says Stay-In", "", "Wrong move = 5 jumps, then keep playing. No sitting out."]
  ],
  October: [
    ["Low-ball", "", "Foam only, below the waist. A hit is a 10-second stretch, then back in."],
    ["Steal the Bacon", "", "Two numbered lines. Called numbers run for a foam ‘bacon.’ Soft tag only."]
  ],
  November: [
    ["Protect the King", "", "Circle of defenders, one king. Attackers pass and throw below the waist. Rotate the king."],
    ["Steal the Bacon", "", "Use a beanbag. Fielders throw to a hoop, not at the runner."]
  ],
  December: [
    ["Birthday Lineup", "", "Silent line from January to December. Hands only — no talking."],
    ["Circle Hoop Pass", "", "Class holds hands. Pass a hoop around without letting go."]
  ],
  January: [
    ["Cross the River", "", "Teams share three spots or hoops. Nobody steps on the floor. Pass the last hoop forward."],
    ["Pulse Race", "", "Two sitting lines. Squeeze travels down. Last player grabs a foam ball."],
    ["Human Knot", "", "Groups of 6–8, Grade 3+. Untangle without letting go. A student may say no."]
  ],
  February: [
    ["Caterpillar Walk", "", "Line holds waists or a shared hoop. Stay together around cones."],
    ["Circle Hoop Pass", "", "Same hoop-around-the-circle with a rope or hoop."]
  ],
  March: [
    ["Guard the Cone", "", "Three defenders hold hands around a cone. Attackers pass a foam ball to knock it."],
    ["Bucket Carry", "", "Team lifts a hoop with strings or holds a hoop rim. Walk a bucket of beanbags."]
  ],
  April: [
    ["Cross the River", "", "Use hoops or poly spots — no benches."],
    ["Voice Path", "", "Pairs. Walker watches the floor; partner calls left/right. Optional eyes-closed only with consent."]
  ],
  May: [
    ["Ten-Second Tag", "", "Cardio closer after run work."],
    ["Wolf’s Den", "", "Narrow middle zone. Two wolves. Tagged: 5 jacks, then help tag for one crossing only."],
    ["Wake-Up Bear", "", "Bear faces away (no blindfold). Class chants. Teacher’s secret count; bear tags to the wall."]
  ],
  June: [
    ["Four Corners Stay-In", "", "Called corner does a skill, then stays in. No elimination."],
    ["Duck Duck Dash", "", "Standing circle. Goose chase once around. Both stay in the game."]
  ]
};

window.BG30_DETAILS = [
  { name: "Ten-Second Tag", months: ["September","May"],
    purpose: "Short bursts of run and recover. New taggers so nobody is ‘it’ forever.",
    equipment: "Centre line of cones, whistle.",
    setup: "Split the gym. Taggers on one side, runners on the other.",
    play: [
      "On the first whistle, a small group of taggers enters the runner half.",
      "Every 10 seconds, whistle again. Those taggers freeze. A new group goes in.",
      "A tagged runner does 5 jumping jacks on the spot, then keeps running.",
      "Rotate so every student is a tagger once."
    ],
    g12: "Walk-tag. 15-second rounds.", g34: "Jog. 10 seconds.", g56: "Two-hand tag only.",
    safety: "Soft tag. Taggers wait behind the line until the whistle." },
  { name: "Wake-Up Bear", months: ["May","September"],
    purpose: "Listen, freeze, then a short chase to the wall.",
    equipment: "A circle of cones. No blindfold.",
    setup: "Bear sits in the middle facing away. Runners on the circle.",
    play: [
      "Teacher whispers a number 1–12 to the bear, or holds fingers the bear can see.",
      "The circle chants “Wake up, bear!” The bear stands on the secret count.",
      "Bear tags toward the walls. Tagged players do 5 jacks and become a second bear for the next round.",
      "Change the bear every 45 seconds."
    ],
    g12: "Walk chase. Teacher is the count.", g34: "Jog.", g56: "Two bears.",
    safety: "No blindfold. Chase to the wall, not into a pile." },
  { name: "Wolf’s Den", months: ["May","January"],
    purpose: "Cross a middle zone. Tagged players re-enter — they are not out for the period.",
    equipment: "Two end lines and a 3-m middle strip.",
    setup: "Two wolves in the den. Everyone else on one end.",
    play: [
      "On “Cross!” runners try to reach the far line without a tag.",
      "Tagged: 5 jumping jacks at the side, then help tag for one crossing only.",
      "Reset wolves every three crossings so the den does not fill forever."
    ],
    g12: "Walk. One wolf.", g34: "Jog. Two wolves.", g56: "Wolves may only tag in the den.",
    safety: "No diving in the den. Soft tag." },
  { name: "Tunnel Freeze", months: ["January","September"],
    purpose: "Freeze and a fair unfreeze.",
    equipment: "None.",
    setup: "3–5 taggers in pinnies.",
    play: [
      "Tagged player freezes with a wide stance.",
      "Grades 1–2: a friend high-fives to unfreeze.",
      "Grades 5–6 only, if both students agree: a friend may walk through the stance. Anyone may say no and use a high-five instead.",
      "Change taggers every 90 seconds."
    ],
    g12: "High-five only.", g34: "High-five.", g56: "Optional tunnel; consent first.",
    safety: "No crawling under a moving person. Head up." },
  { name: "Everybody’s It", months: ["September"],
    purpose: "Everyone is both tagger and runner.",
    equipment: "None.",
    setup: "Gym boundaries.",
    play: [
      "Soft tag anyone.",
      "If two people tag at the same time, they play rock-paper-scissors. The slower pose does 3 squats, then both keep playing.",
      "60–90 second rounds, then a water freeze."
    ],
    g12: "Walk. No RPS — just 3 jumps.", g34: "Jog.", g56: "Two-hand tag.",
    safety: "Hands, not a shove." },
  { name: "Steal the Bacon", months: ["October","November"],
    purpose: "React to a number. Grab a foam object, not a person.",
    equipment: "One foam ball or beanbag.",
    setup: "Two lines, matching numbers facing each other. Object in the middle.",
    play: [
      "Call a number. Both students run for the bacon.",
      "The one who picks it up tries to get home. The other may tag the carrier — not grab the shirt.",
      "If the tag happens before home, the bacon goes back. Both return to their line."
    ],
    g12: "Walk. Teacher carries if it gets messy.", g34: "Jog.", g56: "Call two numbers.",
    safety: "No diving on the object. Foam only." },
  { name: "Protect the King", months: ["November","January"],
    purpose: "Pass to an opening. Defend without body-checking.",
    equipment: "One foam ball, pinnies.",
    setup: "One king in a hoop. Four defenders. The rest pass around the outside.",
    play: [
      "Attackers must pass at least twice, then throw below the waist at the king.",
      "A hit on the king is a point. Rotate the king and two defenders.",
      "Defenders block with hands or a foam shield — no pushing the king."
    ],
    g12: "Roll the ball.", g34: "Below-waist throw.", g56: "Must-pass three times.",
    safety: "Foam. Hits stay low." },
  { name: "Low-ball", months: ["October"],
    purpose: "Send a foam ball below the waist. A hit is a stretch, not an out.",
    equipment: "4–6 foam balls, centre line.",
    setup: "Two halves. Balls start on the line.",
    play: [
      "On the whistle, send balls at opponents’ feet or shins only.",
      "A catch is a save. A below-waist hit: 10-second stretch on your sideline, then back in.",
      "Balls that go high are dead. Pick them up and start again."
    ],
    g12: "Roll only.", g34: "Below the waist.", g56: "Must bounce once.",
    safety: "Foam only. No head or chest." },
  { name: "Birthday Lineup", months: ["December"],
    purpose: "Communicate without talking.",
    equipment: "None.",
    setup: "One long wall or line.",
    play: [
      "Silent. Show the month with fingers, then the day.",
      "January is the left end of the gym, December the right.",
      "When the line is still, check from one end. Celebrate the mix-ups, then try once more."
    ],
    g12: "Teacher may whisper a month to a stuck pair.", g34: "No talking.", g56: "Add a silent ‘same week’ huddle.",
    safety: "Walk. No dragging a classmate." },
  { name: "Circle Hoop Pass", months: ["December","February"],
    purpose: "Move a hoop around a held-hands circle.",
    equipment: "1–2 hoops.",
    setup: "Class circle, hands joined. Slip a hoop onto one arm first.",
    play: [
      "Step, duck, or wiggle the hoop along without letting go.",
      "If the chain breaks, freeze, rejoin, and keep going.",
      "Add a second hoop the other way when the first hoop is halfway."
    ],
    g12: "Large hoop. Teacher helps.", g34: "One hoop.", g56: "Two hoops opposite ways.",
    safety: "No yanking arms. A student may leave the circle." },
  { name: "Cross the River", months: ["January","April"],
    purpose: "Share three hoops or spots to cross the gym.",
    equipment: "3 hoops or poly spots per team of 6–8.",
    setup: "Start line and far ‘bank.’",
    play: [
      "Nobody may step on the floor. Only on a hoop or spot.",
      "The last person picks up the back hoop and passes it forward.",
      "If a foot touches the floor, the team takes two steps back and resets that hoop."
    ],
    g12: "Four hoops. Teacher may hold one.", g34: "Three hoops.", g56: "Three hoops and a silent crossing.",
    safety: "No stacking people on one hoop. Floor only — no benches." },
  { name: "Human Knot", months: ["January"],
    purpose: "Problem-solve in a small group. Consent first.",
    equipment: "None.",
    setup: "Circles of 6–8. Grade 3+.",
    play: [
      "Each student holds two different hands across the circle.",
      "Step, turn, and duck until the circle is open. Do not let go unless someone says stop.",
      "A student may leave at any time and become a coach."
    ],
    g12: "Skip. Use hoop-pass instead.", g34: "Groups of 6.", g56: "Groups of 8. Time a second try.",
    safety: "No lifts. Stop if a wrist or neck is twisted." },
  { name: "Pulse Race", months: ["January"],
    purpose: "Quiet teamwork. A squeeze is the signal.",
    equipment: "A coin or coloured card, one foam ball.",
    setup: "Two sitting lines, holding hands, facing away from the teacher.",
    play: [
      "Teacher shows heads/tails or a colour only the first players can see.",
      "On ‘yes,’ the first player squeezes. The pulse travels. The last player grabs the ball.",
      "False start: stand, sit, and try again. Nobody is out."
    ],
    g12: "Teacher stands where the line can see a thumbs-up.", g34: "Coin flip.", g56: "Two pulses, two balls.",
    safety: "Gentle squeeze. Sitting on the floor." },
  { name: "Caterpillar Walk", months: ["February","December"],
    purpose: "Move as one line.",
    equipment: "Cones. Optional shared hoop.",
    setup: "Teams of 5–7 in a file.",
    play: [
      "Hold the waist of the person in front, or each hold a hoop between you.",
      "Walk a cone path. If the line breaks, freeze and rejoin.",
      "Trade the leader each lap."
    ],
    g12: "Hands on shoulders. Walk.", g34: "Waist hold.", g56: "Add a hoop the line must step through.",
    safety: "No pulling. Stop if someone stumbles." },
  { name: "Guard the Cone", months: ["March","October"],
    purpose: "Defend a target. Pass before a throw.",
    equipment: "One cone, one foam ball.",
    setup: "Three defenders hold hands around the cone. Attackers around them.",
    play: [
      "Attackers pass, then throw to knock the cone.",
      "Defenders block with their bodies without letting go. No kicking the cone.",
      "Rotate defenders every minute."
    ],
    g12: "Roll to the cone.", g34: "Below-waist throw.", g56: "Must-pass twice.",
    safety: "Foam. No charging the circle." },
  { name: "Bucket Carry", months: ["March"],
    purpose: "Lift together. No one person owns the bucket.",
    equipment: "Hoop, 4–6 beanbags, or a light bucket. Optional strings on a hoop.",
    setup: "Start hoop and a far hoop.",
    play: [
      "Team holds the hoop rim (or strings) and walks the bags to the far hoop.",
      "If a bag drops, freeze, reload, and keep going.",
      "Every hand stays on the hoop."
    ],
    g12: "Two bags. Walk.", g34: "Four bags.", g56: "Silent carry.",
    safety: "Light load. No running." },
  { name: "Voice Path", months: ["April"],
    purpose: "Give and follow a short direction.",
    equipment: "Scattered cones. No benches.",
    setup: "Pairs. Walker on one end, caller on the side.",
    play: [
      "Caller uses only words: “two steps left, stop, one step right.”",
      "Walker looks at the floor. Eyes-closed is optional and only if that student says yes.",
      "Swap roles at the far line. A bump on a cone is a pause, not a fail."
    ],
    g12: "Eyes open. Short path.", g34: "Eyes on the floor.", g56: "Optional eyes-closed with consent.",
    safety: "No running. Caller stays on the perimeter." },
  { name: "Four Corners Stay-In", months: ["June","September"],
    purpose: "Choose a space. A called corner stays in the game.",
    equipment: "Four numbered corners.",
    setup: "One caller faces the wall and counts from 10.",
    play: [
      "Students walk to a corner before the count ends.",
      "Caller names a number. That corner does 8 jumping jacks or a named stretch, then everyone plays again.",
      "New caller each round."
    ],
    g12: "Walk. Teacher is the caller.", g34: "Students call.", g56: "Add a locomotor to travel.",
    safety: "No diving at a corner. First two feet on the spot keep it." },
  { name: "Duck Duck Dash", months: ["June"],
    purpose: "A short chase. Both players stay in.",
    equipment: "None.",
    setup: "Standing circle — sitting makes this too slow for a 30-minute class.",
    play: [
      "Walker taps shoulders: “duck… duck… dash!”",
      "The named player chases once around. The walker tries to take the open spot.",
      "Whoever is left walking starts the next tap. Nobody sits out."
    ],
    g12: "Walk the chase.", g34: "Jog.", g56: "Two walkers.",
    safety: "Tap the shoulder, not the head. Circle stays still." },
  { name: "Elements Sprint", months: ["September","December"],
    purpose: "Hear a cue and run to the right wall.",
    equipment: "Three wall signs: Fire, Earth, Water.",
    setup: "Students in the middle.",
    play: [
      "Call “Fire,” “Earth,” or “Water,” or an animal that belongs there (fish → water).",
      "Last group to the wall does 5 jumping jacks and stays in.",
      "Students may take a turn as the caller."
    ],
    g12: "Walk. Two walls only.", g34: "Three walls.", g56: "Add “air” as the centre freeze.",
    safety: "Hands up before the wall. No pushing." },
  { name: "Simon Says Stay-In", months: ["September","December"],
    purpose: "Listen for the phrase. A miss is a skill, not an out.",
    equipment: "None.",
    setup: "Scattered in personal space.",
    play: [
      "Do the action only when you hear “Simon says.”",
      "A miss: 5 jumps or a stretch, then keep playing.",
      "Let a student lead the last minute."
    ],
    g12: "Slow cues. Locomotor and shapes.", g34: "Faster.", g56: "Add left/right and levels.",
    safety: "Space to jump. No elimination." }
];
