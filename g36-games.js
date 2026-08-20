window.G36_MONTH_GAMES = {
  October: [
    ["Reverse Soccer", "", "Hands only to pass and shoot. Keepers use feet. Cannot carry the ball. Foam indoor."],
    ["Guard the Gates", "", "Cone gates. One team attacks by dribbling through; defenders intercept without contact."],
    ["The Perfect Pass", "", "Score only after a set number of passes. Ball-carrier is frozen."]
  ],
  November: [
    ["Battleships", "", "Four zones. Throw foam at other teams’ pin-in-hoop. Stay in your zone. Pins reset. Count knockdowns."],
    ["End Ball", "", "Pass to a catcher in the far end zone. Carrier cannot run. 5-second hold."],
    ["Flying Saucers", "", "Send foam discs or rings at hoop targets. Fetchers wait behind a line."],
    ["Frisbee Flingers", "", "Pairs or teams complete a catch in a scoring hoop. Drop = restart that disc."],
    ["Slide Sling Save", "", "Slide beanbags at feet. Hit players walk to a jail hoop and return on a teammate catch."]
  ],
  December: [
    ["Dash for Safety", "", "From a centre square, run to the colour called. Tagged players stretch and re-enter next call."],
    ["Speed Run Relay", "", "Short shuttle: out to a cone, skill, back. Many short teams."]
  ],
  January: [
    ["Heist the Treasure", "", "Steal one beanbag at a time from a guarded middle. Tagged walk it back. No hoop-guarding."],
    ["Crab Football", "", "Crab-walk and carry or kick a foam ball to a line. Short rounds."]
  ],
  May: [
    ["Capture the Egg", "", "Carry a beanbag ‘egg’ across. Tagged players hand it to the tagger and switch roles."]
  ],
  June: [
    ["Diamond Strike", "", "Four hitters on bases. One hit, all run one base. Field to the middle cone to stop the next bowl."],
    ["Hit and Run", "", "Hit or kick, run a short path. Field to a hoop, not at the runner."],
    ["Hurley Burley", "", "Any legal send (kick, bounce, throw). A tip means you must pass at once. Kick-in goal = 3, hit = 2, throw = 1."],
    ["Cornerball", "", "Score by a catch in any of four corner hoops. Carrier is frozen."],
    ["Kick It (mats)", "", "Kick, run mat to mat. Fielders tag with the ball in two hands — no throw-at-runner."]
  ]
};

window.G36_DETAILS = [
{
  name: "Reverse Soccer", source: "", months: ["October"],
  purpose: "Invasion with hands. Opposite of a kick game.",
  equipment: "Foam ball, pinnies, two cone goals.",
  setup: "Two teams. One keeper each. Goals can face out if you want a harder angle.",
  play: [
    "Field players may only tap or pass with hands — no carrying.",
    "Keepers save with feet only.",
    "Score in the other team’s goal. Rotate keepers every 2 minutes."
  ],
  g12: "Skip or play walking hand-ball.",
  g34: "Must pass once before a shot.",
  g56: "Everyone on the team touches before a shot.",
  safety: "Foam only. No diving at ankles.",
  slot: "16–25"
},
{
  name: "Battleships", source: "", months: ["November"],
  purpose: "Four-team throw and defend a pin.",
  equipment: "4 hoops, 4 pins, foam balls, cones for zones.",
  setup: "Four squares. A pin in a hoop at the back of each. Teams stay in their zone.",
  play: [
    "Throw foam at other pins. 5-second hold.",
    "Stand a pin back up as soon as it falls. Count knockdowns at the whistle.",
    "Nobody stands in their own hoop."
  ],
  g12: "Beanbags. Two teams only.",
  g34: "Below-shoulder throws.",
  g56: "Catch a thrown ball to freeze that thrower for a 10-count.",
  safety: "Throws at pins, not heads. Foam only.",
  slot: "16–25"
},
{
  name: "End Ball", source: "", months: ["November"],
  purpose: "Pass to a catcher in an end zone. Same family as Captain Ball.",
  equipment: "Foam ball, pinnies, cones for two end zones.",
  setup: "Each team names one catcher who stays in the far end.",
  play: [
    "Carrier cannot run and must pass in 5 seconds.",
    "A clean catch in the end zone scores. Rotate the catcher.",
    "Defend by intercepting, not by grabbing the holder."
  ],
  g12: "Walking. Teacher may be catcher.",
  g34: "Three-pass rule before a score.",
  g56: "3-second hold.",
  safety: "No contact. Soft foam.",
  slot: "16–25"
},
{
  name: "Poison Ball", source: "", months: ["November"],
  purpose: "Dodge in a circle. Switch roles — nobody is out for the game.",
  equipment: "Foam balls, a cone circle.",
  setup: "6–8 dodgers inside. Others throw from outside the circle.",
  play: [
    "Throws stay below the waist.",
    "A hit = switch places with that thrower.",
    "A catch = the thrower comes in and the catcher throws."
  ],
  g12: "Do not play with throws at people. Use Battleships.",
  g34: "Below-waist foam. Continuous switch.",
  g56: "Timed 2-minute waves. Count how long a group stays in.",
  safety: "No last-one-standing as the only version. Foam only.",
  slot: "16–25"
},
{
  name: "Diamond Strike", source: "", months: ["June"],
  purpose: "Four hitters run together. Continuous bowling from the middle.",
  equipment: "4 bases or buckets, foam ball, bats or hands.",
  setup: "A square. One hitter at each base. Fielders around. A middle cone.",
  play: [
    "A fielder bowls underhand from the middle to any hitter.",
    "On a hit, all four hitters run one base clockwise.",
    "A catch in the air, or a ball placed on a base before a runner arrives, rotates that hitter to the waiting line.",
    "Everyone hits before teams swap."
  ],
  g12: "Kick version. Two bases.",
  g34: "Hands or foam bat.",
  g56: "Live underhand bowl.",
  safety: "Bowl from the middle only. No throw at runners.",
  slot: "16–25"
},
{
  name: "Kick It (mats)", source: "", months: ["June"],
  purpose: "Kick and run mat to mat. Field with the ball in two hands.",
  equipment: "Two mats, foam ball.",
  setup: "Mats 10–15 m apart. Kickers in a line. One roller.",
  play: [
    "Roll, kick, run to the far mat.",
    "Fielders tag with the ball held in two hands — they do not throw at the runner.",
    "A fair run scores. Next kicker. Swap after everyone kicks."
  ],
  g12: "Walk-run. Teacher rolls.",
  g34: "Jog. Tag with ball in hands.",
  g56: "Runners may try a return run on the next kick.",
  safety: "No throw-at-runner. Foam only.",
  slot: "16–25"
},
{
  name: "Hurley Burley", source: "", months: ["June"],
  purpose: "One ball, many legal sends. A tip forces an instant pass.",
  equipment: "Foam ball, two goals, pinnies.",
  setup: "Two teams. Teacher tosses in.",
  play: [
    "You may kick, bounce, throw, or run a few steps.",
    "If tipped (soft two-finger), you must pass immediately.",
    "Throw-in = 1, strike-in = 2, kick-in = 3."
  ],
  g12: "Hands and kick only. Walking.",
  g34: "Call “tip” out loud.",
  g56: "Three-pass rule before a shot.",
  safety: "Tip only. No bumps.",
  slot: "16–25"
},
{
  name: "Dash for Safety", source: "", months: ["December","May"],
  purpose: "React to a colour and sprint to a corner.",
  equipment: "4 coloured cones or walls.",
  setup: "Class in a centre square. Two taggers outside.",
  play: [
    "Call a colour (or two). Students run there.",
    "Tagged players stretch once and re-enter on the next call.",
    "Reset taggers each minute."
  ],
  g12: "Walk. One colour.",
  g34: "Jog. Two colours in a row.",
  g56: "Dribble a foam ball to the colour.",
  safety: "No elimination. Soft tag.",
  slot: "0–5 or 16–25"
},
{
  name: "Slide Sling Save", source: "", months: ["November"],
  purpose: "Slide a beanbag to tag feet. A catch frees a teammate.",
  equipment: "Beanbags, foam balls, two jail hoops.",
  setup: "Two halves. Slide from behind a line.",
  play: [
    "Slide beanbags at the other team’s feet.",
    "A hit player walks to the far jail hoop.",
    "A teammate throws a foam ball for them to catch — a catch brings them back."
  ],
  g12: "Walk. Teacher helps the free-throw.",
  g34: "Standard.",
  g56: "Must catch above the knee.",
  safety: "Slides on the floor only. Hits at feet, not shins with force.",
  slot: "16–25"
},
{
  name: "Flying Saucers", source: "", months: ["November"],
  purpose: "Long underhand or disc throw at hoops.",
  equipment: "Foam discs or rings, hoops, cones.",
  setup: "Targets at two or three distances.",
  play: [
    "Send a disc at a hoop. Fetch behind the line.",
    "Team count of fair lands."
  ],
  g12: "Beanbags if discs are hard.",
  g34: "Two distances.",
  g56: "Opposite-hand round.",
  safety: "No whipping discs at people.",
  slot: "16–25"
},
{
  name: "Speed Run Relay", source: "", months: ["December","May"],
  purpose: "Short shuttle with a skill at the turn.",
  equipment: "Cones, optional batons.",
  setup: "Many teams of 4.",
  play: [
    "Sprint to a cone, 3 jumps or a touch, sprint back, tag.",
    "Sit when the team is done."
  ],
  g12: "Walk-run.",
  g34: "Jog.",
  g56: "Baton hand-off.",
  safety: "Pass on the outside. Short lines.",
  slot: "16–25"
},
{
  name: "Survivor Dodgeball", source: "", months: ["November"],
  purpose: "Below-waist foam. Hit = switch, not sit out.",
  equipment: "Many foam balls.",
  setup: "Two sides or a circle. Same house rules as Poison Ball.",
  play: [
    "Hit below the waist and that player switches teams or does a 10-count stretch and stays.",
    "A catch returns the thrower to a stretch."
  ],
  g12: "Do not play. Use Clean Your Room with rolls.",
  g34: "Switch version only.",
  g56: "Timed sides. No last-one-standing.",
  safety: "Foam. Below the waist. No head shots.",
  slot: "16–25"
},
{
  name: "Guard the Gates", source: "", months: ["October"],
  purpose: "Dribble through gates. Defenders intercept the ball, not the body.",
  equipment: "Cone gates, foam balls, pinnies.",
  setup: "4–6 gates. Two teams.",
  play: [
    "Attackers dribble or pass through a gate for a point.",
    "Defenders steal the ball with their feet only.",
    "Swap after 3 minutes."
  ],
  g12: "No defenders. Gates only.",
  g34: "Passive defenders.",
  g56: "Active intercept.",
  safety: "No slide tackles. Foam.",
  slot: "16–25"
},
{
  name: "Frisbee Flingers", source: "", months: ["November"],
  purpose: "Disc throw and catch into a hoop.",
  equipment: "Foam discs, hoops.",
  setup: "Pairs or 4v4.",
  play: [
    "Complete a catch. A catch in a hoop scores.",
    "Drop = the other team starts."
  ],
  g12: "Beanbag instead of a disc.",
  g34: "Walking.",
  g56: "Jog. One defender.",
  safety: "Soft discs. No diving.",
  slot: "16–25"
},
{
  name: "Crab Football", source: "", months: ["January"],
  purpose: "Core strength and a short cooperative carry.",
  equipment: "Foam ball, two end lines.",
  setup: "Two teams. Short court.",
  play: [
    "Travel in a crab walk. Push or carry the foam ball to the line.",
    "30–45 second rounds, then stretch.",
    "Swap if wrists are tired."
  ],
  g12: "Crab a short distance, then walk the rest.",
  g34: "Standard short rounds.",
  g56: "Must pass once while still in crab.",
  safety: "Wrists. Sit when it hurts. Soft ball.",
  slot: "16–25"
},
{
  name: "Heist the Treasure", source: "", months: ["January"],
  purpose: "Steal from a middle pile. Same family as Collect the Treasure.",
  equipment: "Beanbags, 4 hoops, optional 2 taggers.",
  setup: "Treasure in the middle. Team hoops in corners.",
  play: [
    "One treasure at a time.",
    "Tagged players walk it back.",
    "No sitting on your hoop."
  ],
  g12: "Walk. Teacher tags.",
  g34: "Jog.",
  g56: "Two taggers. Pair heist allowed.",
  safety: "Soft tag. One object in hands.",
  slot: "16–25"
},
{
  name: "The Perfect Pass", source: "", months: ["October","November"],
  purpose: "Force passing before a score.",
  equipment: "Foam ball, pinnies, two end lines or hoops.",
  setup: "Two teams.",
  play: [
    "Carrier is frozen.",
    "Score only after 3 (or 5) completes.",
    "Intercepts reset the count."
  ],
  g12: "Walking. Two completes.",
  g34: "Three completes.",
  g56: "Five completes or a 3-second hold.",
  safety: "No grabbing the holder.",
  slot: "16–25"
},
{
  name: "Hit and Run", source: "", months: ["June"],
  purpose: "Strike, run a short path, field to a hoop.",
  equipment: "Tee or kick, foam, one or two hoops.",
  setup: "Hitting line. Fielders spread.",
  play: [
    "Hit or kick. Run to a hoop and back.",
    "Fielders throw to the hoop, not at the runner.",
    "Everyone hits."
  ],
  g12: "Tee. One hoop.",
  g34: "There and back.",
  g56: "Soft toss.",
  safety: "Bat in a hoop after contact.",
  slot: "16–25"
},
{
  name: "Capture the Egg", source: "", months: ["May"],
  purpose: "Carry a beanbag through traffic.",
  equipment: "Beanbags, pinnies.",
  setup: "Two ends. A few taggers in the middle.",
  play: [
    "Carry an egg across.",
    "If tagged, hand the egg to the tagger and switch jobs.",
    "Count fair crossings."
  ],
  g12: "Walk. Wide channel.",
  g34: "Jog.",
  g56: "Two eggs at once.",
  safety: "Soft tag. No diving on the egg.",
  slot: "16–25"
},
{
  name: "Cornerball", source: "", months: ["June"],
  purpose: "Score in any of four corners.",
  equipment: "4 hoops, foam ball, pinnies.",
  setup: "Hoops in four corners. Two teams.",
  play: [
    "Carrier is frozen and must pass.",
    "A catch with a foot in a hoop scores.",
    "Defend by intercepting."
  ],
  g12: "Walking. Two hoops.",
  g34: "Four hoops.",
  g56: "3-second hold. One extra defender in the hoop ring.",
  safety: "No shoving into a hoop.",
  slot: "16–25"
}
];

window.PAIR_STATIONS = {
  title: "Pair stations (Grades 3–6)",
  intro: "Use these in the 5–16 minute skill block. Partners, 60–90 seconds, then rotate. Foam only. Teacher-formed pairs.",
  groups: [
    {
      name: "Striking",
      items: [
        ["Tee off into buckets", "Hit foam off a tee into a bucket or hoop."],
        ["Pitch, swing and catch", "Partner tosses underhand; hitter swings; tosser is also the catcher behind a line."],
        ["2-touch to hit past a line", "Two taps, then a hit past a cone line."],
        ["Pass through hurdles", "Roll or hit along the floor through a hurdle or gate."],
        ["Keep the ball away", "One strikes into space; partner retrieves and sends back."],
        ["Shoot on goal", "Hit or push at a cone goal. Partner is the retriever, then swap."],
        ["Bounce and hit tunnel", "Bounce, then hit through a partner’s leg tunnel."],
        ["Rally over a rope", "Low rope. Count hits. Drops restart the count."],
        ["Wall-ball rally", "Alternate hits to a wall. Soft foam."],
        ["Spike at targets", "Partner toss; spike or push down into a hoop."]
      ]
    },
    {
      name: "Moving",
      items: [
        ["1-foot hops through hoops", "Hop hoop to hoop. Switch feet halfway."],
        ["2-foot jumps over low hurdles", "Stick the landing."],
        ["Zig-zag weave", "Slalom cones. Eyes up."],
        ["Sprint through a ladder", "Floor ladder or spots. Quick feet, not long jumps."],
        ["Get the most objects", "30 seconds: collect beanbags one at a time."],
        ["Dodge rolling balls", "Partner rolls foam; jumper or sidestep. Below-waist rolls."],
        ["Run and jump for distance", "Ribbon mark. Private, not a rank."],
        ["Jump and roll", "Jump to a mat, log-roll once. Head does not lead."],
        ["Switch sides without falling", "Balance on a line or bench. Step off to a mat."],
        ["Slide a beanbag past", "Partner defends a gate; slider stays on the floor."]
      ]
    },
    {
      name: "Bouncing",
      items: [
        ["Dribble into a bucket", "Bounce-dribble, then drop or shoot into a hoop."],
        ["Keep your ball in the square", "Dribble inside a cone square. Partner tries to tap it out — no body contact."],
        ["Bounce-pass left and right", "Alternate sides. Step to the target."],
        ["Bounce-pass through hoops", "Hoop on the floor as a window."],
        ["Crossover and pass", "One crossover dribble, then a bounce pass."],
        ["Bounce through your legs", "Figure-8 or through-the-legs, then a pass."],
        ["Pass up the line and shoot", "Two bounce passes, then a hoop shot."],
        ["Dribble and body-wrap", "Wrap the ball around the waist, then dribble on."],
        ["Spin, then shoot", "One pivot, then a set shot."],
        ["Weave, then shoot", "Slalom, then a shot. Partner rebounds."]
      ]
    },
    {
      name: "Throwing and catching",
      items: [
        ["Guard the hoops", "One defends a hoop; the other tries an underhand toss in."],
        ["Knockdown the targets", "Pins. Underhand. Fetch is safe."],
        ["Closest disc to the target", "Foam disc. Closest fair throw, then swap."],
        ["1-hand wall catches", "Underhand to a wall, catch off the bounce."],
        ["Beanbags in the hoop", "Step back after each fair throw."],
        ["Bench catches", "Catcher sits or stands on a bench. Toss is underhand."],
        ["Throw through a hoop", "Partner holds a hoop as a window."],
        ["Roll to hit the pin", "Bowling-style. Soft foam."],
        ["Protect the targets", "One tosses; one blocks with hands, not a kick at the partner."],
        ["Throw and switch", "Throw, then partners change places before the next throw."]
      ]
    },
    {
      name: "Kicking",
      items: [
        ["Pass through the gap", "Cone gate. Inside-foot pass."],
        ["Land the ball in the hoop", "Chip or roll into a hoop on the floor."],
        ["Trick in the hoop and pass back", "Trap in a hoop, then pass."],
        ["Many passes through gates", "How many fair gates in 60 seconds?"],
        ["1v1 protect your goal", "Tiny cone goal. Soft foam. No slide."],
        ["1-foot dribble and weave", "Same foot through cones."],
        ["Chip into buckets", "Soft lift into a bucket or hoop."],
        ["Volley and catch", "Toss, thigh or foot, partner catch."],
        ["Shoot on goal", "Pass once, then shoot."],
        ["Punt or drop-kick into buckets", "G5–6 only. Foam. Clear space behind."]
      ]
    }
  ]
};
