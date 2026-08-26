const months = [
  {
    "name": "September",
    "guide": "Soccer (Weeks 1–2) · football intro (Week 3) · Terry Fox (Week 4)",
    "pew": "Movement Skill Development, Safety, Active Living, Healthy Relationships",
    "equipment": "Soccer balls, cones/gates, footballs or foam footballs, pinnies",
    "fitness": "Pulse check after a dribble game. Private skip once late in the month.",
    "notes": "Soccer balls, no slide tackles. Week 3 is a football intro (hike, catch, throw). Week 4 is Terry Fox — shift the day if your school run falls elsewhere.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Gym freeze + soccer space",
        "focus": "Signals, boundaries, no kicking people",
        "wu": "Jog the line. Freeze on the whistle.",
        "skill": "Walk the gym: walls, gates, where balls live. No kicking until the skill.",
        "game": "Red Light with a soccer ball at your feet — freeze means trap.",
        "cd": "Name one gym rule and one soccer rule.",
        "g12": "Walk-dribble",
        "g34": "Jog-dribble",
        "g56": "Students take turns as the light"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Toe-taps and sole trap",
        "focus": "Ball stays close",
        "wu": "Toe-taps on a still ball.",
        "skill": "Sole trap a roll. Inside-foot tap in place.",
        "game": "Hospital Tag while dribbling — two tags = stretch, then back in.",
        "cd": "Quiet ball, quiet feet.",
        "g12": "Hands may help the trap",
        "g34": "Feet only",
        "g56": "Change direction after each trap"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Dribble through gates",
        "focus": "Small touches, head up",
        "wu": "Dribble-freeze.",
        "skill": "Zig-zag cones. Soft touches. Eyes on a wall mark.",
        "game": "Soccer weave relay or Through the Gates.",
        "cd": "Which foot did more work?",
        "g12": "Wide gates",
        "g34": "Standard",
        "g56": "Weaker foot home"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Fair-play soccer closer",
        "focus": "Soft tag, everyone in",
        "wu": "Partner high-five jog.",
        "skill": "Class soccer promises: soccer balls, below the knee, no slide.",
        "game": "Sharks and Minnows while dribbling.",
        "cd": "Handshake line.",
        "g12": "Walk",
        "g34": "Jog",
        "g56": "Add a rescue high-five"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Inside-foot pass",
        "focus": "Accuracy over power",
        "wu": "Partner bump-pass.",
        "skill": "Gate passing. Plant foot beside the ball.",
        "game": "Keep-away 3v1 in a small square.",
        "cd": "Accuracy shout-out.",
        "g12": "3v0",
        "g34": "3v1",
        "g56": "4v2"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Move after you pass",
        "focus": "Send, then find space",
        "wu": "Jog and self-tap.",
        "skill": "Pass, then take three steps to a new cone.",
        "game": "Rob the Nest — feet only, one ball at a time.",
        "cd": "Did you stand still after the pass?",
        "g12": "Hands OK to collect",
        "g34": "Feet only",
        "g56": "May steal from other nests"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Receive a moving ball",
        "focus": "Cushion, then send",
        "wu": "Teacher rolls, class traps.",
        "skill": "Trap a partner pass, then return through a gate.",
        "game": "King of the Court trap — stay in if you trap.",
        "cd": "Give with the ball.",
        "g12": "Hands OK",
        "g34": "Feet preferred",
        "g56": "One-touch trap-pass"
      },
      {
        "w": 2,
        "c": 4,
        "title": "2v1 to a gate",
        "focus": "Simple tactic",
        "wu": "Dribble tag.",
        "skill": "Two attackers, one shadow defender. Pass before the gate.",
        "game": "End-zone soccer — three passes to score.",
        "cd": "Hands to yourself.",
        "g12": "No defender",
        "g34": "Passive defender",
        "g56": "Active intercept"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Hold and hike",
        "focus": "Grip, hike between the feet",
        "wu": "Jog with a football hugged in.",
        "skill": "Centre hikes to a quarterback. Soft toss back.",
        "game": "Steal the Bacon with a football.",
        "cd": "Two hands on the ball.",
        "g12": "Beanbag hike",
        "g34": "Football",
        "g56": "Hike on a clap"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Catch a soft toss",
        "focus": "Ready hands, eyes on the ball",
        "wu": "Self-toss and catch.",
        "skill": "Partner underhand, then a short spiral if it stays soft.",
        "game": "Throw-clap-catch relay.",
        "cd": "Thumbs together above the chest.",
        "g12": "Underhand only",
        "g34": "Add a step-back",
        "g56": "Opposite hand"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Overarm throw",
        "focus": "Opposite-foot step",
        "wu": "Javelin steps without a ball.",
        "skill": "Throw to a hoop, then to a partner. Point the non-throwing hand.",
        "game": "Hoop underhand relay, then overarm to the same hoop.",
        "cd": "Step to the target.",
        "g12": "Short throw",
        "g34": "Step back each catch",
        "g56": "Lead the receiver"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Move to the catch",
        "focus": "Hands ready while jogging",
        "wu": "Jog and self-catch.",
        "skill": "Partner runs a straight line; throw to where they will be.",
        "game": "Ultimate-style beanbag: three completes to score.",
        "cd": "Where did you throw?",
        "g12": "Walk the route",
        "g34": "Jog",
        "g56": "Add a shadow"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Soccer review stations",
        "focus": "Quality reps",
        "wu": "Free trap.",
        "skill": "Stations: gates, wall pass, target shot, 2v1.",
        "game": "Through the Gates or Wall Soccer.",
        "cd": "Hardest station?",
        "g12": "Adult at shooting",
        "g34": "Independent",
        "g56": "Peer cue"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Football catch review",
        "focus": "Opposite-foot step",
        "wu": "Javelin steps without a ball.",
        "skill": "Throw to a hoop, then to a partner. Point the non-throwing hand.",
        "game": "End Zone Ball with a foam football or beanbag.",
        "cd": "Step to the target.",
        "g12": "Short throw",
        "g34": "Step back each catch",
        "g56": "Lead the receiver"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Terry Fox prep",
        "focus": "Pace, kindness, why we run",
        "wu": "Easy jog-walk. Practise the freeze signal.",
        "skill": "One sentence about Terry Fox. Practise a steady jog-walk, not a sprint. Pair a slower runner with a cheer partner.",
        "game": "Land and Sea or Here, There, Everywhere as paced travel — no racing the last minute.",
        "cd": "Water. Name one way we look after a classmate on a long run.",
        "g12": "Walk-jog. Teacher may walk with a group.",
        "g34": "Jog-walk loops. Pair up.",
        "g56": "Steady pace; student leaders for a loop."
      },
      {
        "w": 4,
        "c": 4,
        "title": "Terry Fox run or September festival",
        "focus": "School Terry Fox day — or soccer/football games if the run is another date",
        "wu": "Easy walk-jog of the route or gym.",
        "skill": "If it is Terry Fox day: join the school run/walk. If not: soccer gates + a football catch station.",
        "game": "Hospital Tag or Everybody’s It if you have gym time after the run.",
        "cd": "Thank a classmate. Private pulse check — not a rank.",
        "g12": "Calmer game",
        "g34": "Two games",
        "g56": "Students host"
      }
    ]
  },
  {
    "name": "October",
    "guide": "Football (Weeks 1–2) · parachute and circus (Weeks 3–4)",
    "pew": "Movement Skill Development, Movement Tactics, Safety, Healthy Relationships",
    "equipment": "Footballs, flag belts or pinnies, parachute, scarves, beanbags, plates or rings",
    "fitness": "Throw-and-catch pulse check. Private wall-pass later in the month.",
    "notes": "Football uses the real ball (foam is fine for 1–2). Weeks 3–4 are parachute and circus so October is not all collision games.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Flag or two-hand touch",
        "focus": "Safe tag",
        "wu": "Tail Tag with pinnies.",
        "skill": "Teach flag pull or two-hand touch. Tags stay soft.",
        "game": "Tail Thief — collect, then give tails back.",
        "cd": "No grabbing shirts.",
        "g12": "Walk",
        "g34": "Jog",
        "g56": "Two-hand touch only"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Routes: go, out, curl",
        "focus": "Change of direction",
        "wu": "Cone cuts.",
        "skill": "Three routes. Quarterback points, then throws.",
        "game": "Numbers football — called numbers run a route.",
        "cd": "Plant and cut.",
        "g12": "One route",
        "g34": "Three routes",
        "g56": "Audible at the line"
      },
      {
        "w": 1,
        "c": 3,
        "title": "End-zone catch",
        "focus": "Score by catching in a hoop zone",
        "wu": "Partner toss into a hoop.",
        "skill": "3v1: two receivers, one QB, one shadow.",
        "game": "End-zone catch — no running with the ball.",
        "cd": "Hands to yourself.",
        "g12": "No defender",
        "g34": "Passive",
        "g56": "Active intercept"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Football games day",
        "focus": "Apply the week",
        "wu": "Hike and toss.",
        "skill": "Vote: Steal the Bacon, End-zone, or Around-the-gym.",
        "game": "Chosen game.",
        "cd": "One kind tag.",
        "g12": "Walk",
        "g34": "Jog",
        "g56": "Student QBs"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Pitch and hand-off",
        "focus": "Soft give, then run",
        "wu": "Partner hand-off walk.",
        "skill": "QB hands to a runner who goes to a hoop.",
        "game": "Gauntlet run — football at the hip, not a tackle.",
        "cd": "Give, don’t throw at the runner.",
        "g12": "Walk hand-off",
        "g34": "Jog",
        "g56": "Add a flag pull"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Defend the passing lane",
        "focus": "Intercept without contact",
        "wu": "Mirror cuts.",
        "skill": "Defender stays between receiver and ball.",
        "game": "Protect the King with a football (dodgeballs if you throw at a person — see Dodgeball).",
        "cd": "Head up.",
        "g12": "Shadow only",
        "g34": "Contest the catch",
        "g56": "Tip and catch"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Small-sided flag",
        "focus": "Hike, pass, score",
        "wu": "Warm routes.",
        "skill": "4v4 to two end-zones. Two-hand touch. Five seconds to throw.",
        "game": "Reset after a score. Everyone plays.",
        "cd": "No tackle talk.",
        "g12": "3v3, no rush",
        "g34": "4v4",
        "g56": "5v5, one rush after a count"
      },
      {
        "w": 2,
        "c": 4,
        "title": "Jail-catch football",
        "focus": "Bring a teammate back",
        "wu": "Partner catch.",
        "skill": "If you play jail-catch, use dodgeballs — not footballs — and stay below the waist.",
        "game": "Jail-catch from the Dodgeball page (dodgeballs only).",
        "cd": "Walk the sideline home.",
        "g12": "Teacher toss to jail",
        "g34": "Teammate toss",
        "g56": "Two feet in jail"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Parachute ripples and dome",
        "focus": "Together on a count",
        "wu": "Hands on the chute, walk in a circle.",
        "skill": "Small ripples, big waves, mushroom/dome. Cue: lift together.",
        "game": "Dome — step in, sit on the edge, whisper inside.",
        "cd": "Shoulders down.",
        "g12": "Small ripples only at first",
        "g34": "Dome sit",
        "g56": "Students count the lift"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Parachute popcorn",
        "focus": "Force and timing",
        "wu": "Ripple review.",
        "skill": "Beanbags on the chute; pop them without losing the chute.",
        "game": "Popcorn: keep 6 bags up. Then colour-pop (only red). ",
        "cd": "Core is working — say so.",
        "g12": "Few bags",
        "g34": "Colour rules",
        "g56": "Pop to a target hoop"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Parachute change-places",
        "focus": "Listen for your colour or name",
        "wu": "Walk the circle holding the chute.",
        "skill": "Lift, call two colours, those students change places under the chute.",
        "game": "Sharks and Dolphins with the chute shrinking .",
        "cd": "Heads up when you run under.",
        "g12": "Walk only under",
        "g34": "Jog under",
        "g56": "Three-mouse version"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Parachute number games",
        "focus": "Problem-solving as a group",
        "wu": "Numbered spots on the chute if you have them.",
        "skill": "Make a number with bodies on the chute; or ‘all odd colours lift.’",
        "game": "Merry-go-round walk, then freeze numbers.",
        "cd": "Did we wait for everyone?",
        "g12": "Teacher calls",
        "g34": "Student callers",
        "g56": "Silent number shapes"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Circus — toss and catch",
        "focus": "Juggle prep, eyes on the object",
        "wu": "Self-toss scarf.",
        "skill": "Scarf, then beanbag, then two scarves. Cue: throw to a window above the head.",
        "game": "Class juggle: how many objects in the air at once?",
        "cd": "Drops are part of circus.",
        "g12": "Scarves",
        "g34": "Beanbag plus scarf",
        "g56": "Two beanbags"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Circus — balance",
        "focus": "Stillness on a small base",
        "wu": "Flamingo holds.",
        "skill": "Beanbag on the head, walk a line. Then one-foot on a poly spot.",
        "game": "Museum circus: walk the tight-line (tape), freeze if the bag falls.",
        "cd": "Eyes on a still spot.",
        "g12": "Wide line",
        "g34": "Tape line",
        "g56": "Narrow tape and a stork pause"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Circus — roll and plate",
        "focus": "Object control",
        "wu": "Roll a hoop or ball on a line.",
        "skill": "If you have spin plates or sticks, teach a safe spin. Else: hoop spin on the arm.",
        "game": "Waiter relay: beanbag on a hoop or plate, walk it home.",
        "cd": "Slow is circus-smart.",
        "g12": "Hoop as tray",
        "g34": "Beanbag on a plate",
        "g56": "Turn a corner without a drop"
      },
      {
        "w": 4,
        "c": 4,
        "title": "Circus — partner acts",
        "focus": "Trust and timing",
        "wu": "Mirror toss.",
        "skill": "Partner toss 3 in a row. Then a shared balance pose.",
        "game": "Mini acts: 20 seconds, the other half is the audience.",
        "cd": "Applause is the cool-down.",
        "g12": "Teacher in each pair",
        "g34": "20-second act",
        "g56": "30-second act with a bow"
      }
    ]
  },
  {
    "name": "November",
    "guide": "Floor hockey — stick safety, dribble, pass, small-sided games",
    "pew": "Movement Skill Development, Safety, Movement Tactics, Character Development",
    "equipment": "Floor-hockey sticks, soft balls or pucks, tape goals, pinnies, cones",
    "fitness": "Stick-handle shuttle. Private skip once late in the month.",
    "notes": "Sticks below the knee. No slapshots. No ice. Everyone has a stick or rotates fairly.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Stick on the floor",
        "focus": "Two-hand grip, blade down",
        "wu": "Walk with the stick — blade never above the knee.",
        "skill": "Push a hockey ball or puck. Stop it with the blade.",
        "game": "Hockey hurdle dribble.",
        "cd": "Blade on the floor.",
        "g12": "Feet-only if sticks are new",
        "g34": "Push only",
        "g56": "Two-touch through gates"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Dribble in a space",
        "focus": "Tiny touches",
        "wu": "Weave cones.",
        "skill": "Forehand and a gentle backhand tap.",
        "game": "Sharks while stick-handling.",
        "cd": "Head up.",
        "g12": "Wide gates",
        "g34": "Standard",
        "g56": "Weaker side"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Push-pass",
        "focus": "Accuracy, not a slap",
        "wu": "Partner pass on knees first.",
        "skill": "Pass through a gate. Receiver traps with the blade.",
        "game": "Gate hockey.",
        "cd": "No slapshot.",
        "g12": "Short gate",
        "g34": "Longer",
        "g56": "One-touch"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Hockey fair play",
        "focus": "Sticks down on the whistle",
        "wu": "Freeze with the stick still.",
        "skill": "Class hockey promises.",
        "game": "Hot Dog Tag, sticks away.",
        "cd": "Sticks parked before tag.",
        "g12": "Walk tag",
        "g34": "Jog",
        "g56": "Student whistle"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Receive and move",
        "focus": "Trap, then dribble",
        "wu": "Teacher pass, class trap.",
        "skill": "Trap, three touches, pass back.",
        "game": "Rob the Nest with sticks.",
        "cd": "Quiet trap.",
        "g12": "Hands may pin the ball",
        "g34": "Blade only",
        "g56": "One-touch"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Shoot to a tape goal",
        "focus": "Low shot",
        "wu": "Push at a wall.",
        "skill": "One shot from a cone. Fetch from the side.",
        "game": "Hockey pin knockdown.",
        "cd": "Low is good.",
        "g12": "Kick if no sticks",
        "g34": "Push shot",
        "g56": "Receive then shoot"
      },
      {
        "w": 2,
        "c": 3,
        "title": "2v1 to a goal",
        "focus": "Pass before a shot",
        "wu": "Partner pass.",
        "skill": "Two attackers, one shadow.",
        "game": "Numbers Hockey.",
        "cd": "Hands off the body.",
        "g12": "No defender",
        "g34": "Passive",
        "g56": "Active"
      },
      {
        "w": 2,
        "c": 4,
        "title": "Hockey games day",
        "focus": "Apply the week",
        "wu": "Free dribble.",
        "skill": "Vote: nest, gates, or pin knockdown.",
        "game": "Chosen game.",
        "cd": "One safe stick.",
        "g12": "Feet-only option",
        "g34": "Sticks",
        "g56": "Student refs"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Defend the lane",
        "focus": "Stick on the floor, body side-on",
        "wu": "Mirror slides.",
        "skill": "Shadow without a hook.",
        "game": "Protect the King with a puck.",
        "cd": "No high stick.",
        "g12": "Shadow",
        "g34": "Contest the ball",
        "g56": "Active"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Small-sided hockey",
        "focus": "Everyone touches the ball",
        "wu": "Dribble freeze.",
        "skill": "3v3 to tape goals. Must pass.",
        "game": "Rotate two games.",
        "cd": "Call for the ball.",
        "g12": "4v0",
        "g34": "3v3",
        "g56": "4v4"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Circle Hoop Pass closer",
        "focus": "Cooperation if energy is high",
        "wu": "Stick-park stretch.",
        "skill": "If you need a non-stick day: Circle Hoop Pass or Birthday Lineup.",
        "game": "Or a third hockey game.",
        "cd": "Kind voices.",
        "g12": "Hoop pass",
        "g34": "Either",
        "g56": "Student lead"
      },
      {
        "w": 3,
        "c": 4,
        "title": "November fitness + hockey",
        "focus": "Stillness and a recap",
        "wu": "Shape holds.",
        "skill": "20-second stick-handle in a hoop.",
        "game": "Favourite December hockey game.",
        "cd": "What felt safer this month?",
        "g12": "Play version",
        "g34": "Record privately",
        "g56": "Goal for January"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Weaker-side handle",
        "focus": "Both sides of the blade",
        "wu": "Left-side taps.",
        "skill": "Gates on the backhand.",
        "game": "Weave relay, weaker side.",
        "cd": "Tiny touches.",
        "g12": "Either side",
        "g34": "Backhand preferred",
        "g56": "Backhand only"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Power play 4v2",
        "focus": "Use extra space",
        "wu": "Passing circle.",
        "skill": "Four attackers, two shadows. Extra pass.",
        "game": "Reset after a goal.",
        "cd": "Find the open stick.",
        "g12": "4v1",
        "g34": "4v2",
        "g56": "5v3"
      },
      {
        "w": 4,
        "c": 3,
        "title": "November stations",
        "focus": "Dribble, pass, shoot, defend",
        "wu": "Free handle.",
        "skill": "Four floor stations.",
        "game": "Teacher floats.",
        "cd": "Hardest?",
        "g12": "Adult at shoot",
        "g34": "Independent",
        "g56": "Peer cue"
      },
      {
        "w": 4,
        "c": 4,
        "title": "Hockey showcase",
        "focus": "Celebrate",
        "wu": "Easy push-pass.",
        "skill": "If school is out, use Week 3’s closer. If not: hockey buffet.",
        "game": "Student-hosted station.",
        "cd": "Thank a partner.",
        "g12": "One game",
        "g34": "Two",
        "g56": "Hosts"
      }
    ]
  },
  {
    "name": "December",
    "guide": "Tag, cooperative, invasion and festival games · three weeks if the calendar is short",
    "pew": "Active Living, Personal and Social Development, Character, Safety, Healthy Relationships",
    "equipment": "Pinnies, noodles, hoops, foam balls, benches, flags — as each game card lists",
    "fitness": "Private skip or shuttle on the last class. No ranking.",
    "notes": "December is games, not a new sport. House rules: no elimination, soft tags. Use the Games library. Extra days: repeat a favourite.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Hospital Tag",
        "focus": "Everyone is it; hospital is a stretch then back in",
        "wu": "Jog, freeze on the whistle.",
        "skill": "Teach two-finger tag and the hospital hoop.",
        "game": "Hospital Tag.",
        "cd": "Name someone you helped back in.",
        "g12": "Walk-tag",
        "g34": "Jog",
        "g56": "Free-hand-only tag"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Everybody’s It",
        "focus": "Everyone tags; nobody sits",
        "wu": "Shadow tag walk.",
        "skill": "Soft tag. RPS if you tag at the same time.",
        "game": "Everybody’s It.",
        "cd": "Honest tag talk.",
        "g12": "Walk",
        "g34": "Jog",
        "g56": "Student officials"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Wolf’s Den",
        "focus": "Cross the den; tagged help tag then re-enter",
        "wu": "Build-ups.",
        "skill": "Mark the den. Wolves stay in the strip. Large-group: den down the length of the gym.",
        "game": "Wolf’s Den.",
        "cd": "Last rabbits start as new wolves — reset, do not sit the period.",
        "g12": "Play version",
        "g34": "Width den",
        "g56": "Length den for a big class"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Massive 10 Second Tag",
        "focus": "Short everyone-is-it bursts",
        "wu": "Easy jog.",
        "skill": "Bursts of about 10 seconds. Sitters stretch and join the next reset.",
        "game": "Massive 10 Second Tag.",
        "cd": "Breath check.",
        "g12": "Walk bursts",
        "g34": "10 s",
        "g56": "Student whistle helper"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Hot Dog Tag",
        "focus": "Call for buns; cooperative unfreeze",
        "wu": "Walk tag.",
        "skill": "Teach freeze pose and two buns.",
        "game": "Hot Dog Tag.",
        "cd": "Thank a bun.",
        "g12": "Teacher helps form buns",
        "g34": "Jog",
        "g56": "Change taggers often"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Hoop Pass",
        "focus": "Hoop travels without breaking hands",
        "wu": "Shake out wrists.",
        "skill": "Hold hands. Hoop starts on one arm.",
        "game": "Hoop Pass / Circle Hoop Pass. Time a class circle.",
        "cd": "How did we talk without letting go?",
        "g12": "Small groups",
        "g34": "Class circle",
        "g56": "Student timers"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Relays and Pass It On",
        "focus": "Team tasks, not elimination",
        "wu": "Skip in place.",
        "skill": "Show Ice Cream Cone Relays or Pass It On (feet only).",
        "game": "Ice Cream Cone Relays or Pass It On.",
        "cd": "Name a teammate who waited kindly.",
        "g12": "Short relays",
        "g34": "Full relay",
        "g56": "Students host a heat"
      },
      {
        "w": 2,
        "c": 4,
        "title": "Invent-a-game",
        "focus": "Class writes one rule set",
        "wu": "Favourite tag.",
        "skill": "Groups of 4: name, equipment, one safety rule, how you re-enter.",
        "game": "Play two student games, 4 minutes each.",
        "cd": "Vote one game to keep in January.",
        "g12": "Teacher scribes",
        "g34": "Write rules",
        "g56": "Officiate"
      },
      {
        "w": 3,
        "c": 1,
        "title": "End Zone Ball",
        "focus": "Send to a catcher over a line",
        "wu": "Partner toss.",
        "skill": "Catcher in the end zone. No tackling.",
        "game": "End Zone Ball.",
        "cd": "Call the catcher’s name.",
        "g12": "Beanbag",
        "g34": "Foam football or playground ball",
        "g56": "Must pass once"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Capture the Flag",
        "focus": "Indoor four-corner or outdoor field",
        "wu": "Easy jog of halves.",
        "skill": "Cone the flags. Jail is a short wait, then a way home. No puppy-guarding.",
        "game": "Four Corner Flags or Capture The Flag Outdoors.",
        "cd": "Honest tags.",
        "g12": "Indoor four-corner",
        "g34": "Gym halves",
        "g56": "Outdoor if weather allows"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Bench Ball",
        "focus": "Catch on the bench to add a teammate",
        "wu": "Partner catch.",
        "skill": "1–2 start on the bench. Catch adds a player. Foam only.",
        "game": "Bench Ball.",
        "cd": "Thank a catcher.",
        "g12": "Short bench, teacher toss",
        "g34": "Full game",
        "g56": "Student refs"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Castleball",
        "focus": "Build a hoop castle; knock the other roof",
        "wu": "Easy throw to a hoop.",
        "skill": "Build the 6-hoop castle. Stay on your half.",
        "game": "Castleball.",
        "cd": "Rebuild together after a knock-down.",
        "g12": "Teacher builds",
        "g34": "Players build",
        "g56": "Roles (cannon, guard, builder)"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Student-choice tag",
        "focus": "Vote two tag games from the library",
        "wu": "Teacher’s pick.",
        "skill": "Quick recap of house rules.",
        "game": "Class vote: Hospital Tag, Banana Tag, Angry Neighbour, or Blob Tag.",
        "cd": "Which game should we play again in January?",
        "g12": "Walk versions",
        "g34": "Full",
        "g56": "Student callers"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Festival stations",
        "focus": "Four favourite stations, 4 minutes each",
        "wu": "Music walk-jog.",
        "skill": "Students may host a station they liked this month.",
        "game": "Rotate four stations from December games.",
        "cd": "Name a good host.",
        "g12": "Two stations",
        "g34": "All four",
        "g56": "Host one"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Cooperative closer",
        "focus": "Leave the gym kindly",
        "wu": "Partner stretch.",
        "skill": "Cross the River or Cooperative Wall Ball.",
        "game": "Chosen cooperative game.",
        "cd": "No one left out.",
        "g12": "Short",
        "g34": "Full",
        "g56": "Silent challenge"
      },
      {
        "w": 4,
        "c": 4,
        "title": "December fitness + games",
        "focus": "Private skip or shuttle, then a favourite game",
        "wu": "Easy lap.",
        "skill": "Private fitness check — not a rank.",
        "game": "Vote a gentle closer from the games library.",
        "cd": "Sheet dated. Have a kind holiday.",
        "g12": "Teacher may scribe",
        "g34": "Record privately",
        "g56": "Compare only to own September note"
      }
    ]
  },
  {
    "name": "January",
    "guide": "Basketball (Weeks 1–2) · scoop send/receive (Weeks 3–4)",
    "pew": "Movement Skill Development, Movement Tactics, Safety, Healthy Relationships",
    "equipment": "Basketballs, hoops or buckets, plastic scoops, wiffle or foam balls, pinnies",
    "fitness": "Wall-pass or skip check. Private record — not a rank.",
    "notes": "Basketball uses the real ball. Scoops are a second send/receive tool (cradle, toss, catch) — not a full lacrosse unit.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Finger-pad dribble",
        "focus": "Ball below the waist, head up",
        "wu": "Stationary dribble, switch hands.",
        "skill": "Walk-dribble. Eyes on a wall mark.",
        "game": "Dribble the gates.",
        "cd": "Pads, not a slap.",
        "g12": "Two-hand bounce-catch OK",
        "g34": "Walk-dribble",
        "g56": "Jog; switch at the turn"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Protect the dribble",
        "focus": "Body between ball and shadow",
        "wu": "Dribble-freeze.",
        "skill": "1v1 shadow — defender may not touch.",
        "game": "Rob the Nest — dribble one ball at a time.",
        "cd": "Head up.",
        "g12": "No shadow",
        "g34": "Passive",
        "g56": "Active shadow"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Chest pass",
        "focus": "Thumbs down, step to the target",
        "wu": "Seated chest-pass.",
        "skill": "Partner pass, then wall chest-pass.",
        "game": "Wall chest-pass relay.",
        "cd": "Step and push.",
        "g12": "Catch-bounce OK",
        "g34": "Clean catch",
        "g56": "Move after you pass"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Bounce pass",
        "focus": "Hit the floor halfway",
        "wu": "Seated bounce.",
        "skill": "Pass so it arrives at the belly.",
        "game": "Gate bounce-pass.",
        "cd": "Step to the target.",
        "g12": "Roll if needed",
        "g34": "Bounce only",
        "g56": "Pass and cut"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Shoot to a hoop or bucket",
        "focus": "Bend, push, follow through",
        "wu": "Form without a ball.",
        "skill": "Shoot into a hoop or bucket on the floor, then a wall target.",
        "game": "Weave in and out then shoot (relay).",
        "cd": "Soft landing after the shot.",
        "g12": "Two-hand push",
        "g34": "One-hand set",
        "g56": "Jump-stop then shoot"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Dribble then shoot",
        "focus": "Stop under control",
        "wu": "Dribble to a cone.",
        "skill": "Jump-stop, then shoot. No travel.",
        "game": "Pin dodgeball if you need a send game; else target relay.",
        "cd": "Feet set before the shot.",
        "g12": "Walk-dribble shoot",
        "g34": "Jog",
        "g56": "Weaker hand dribble"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Give and go",
        "focus": "Pass, then move",
        "wu": "Partner pass and walk.",
        "skill": "Pass, cut to a hoop, receive.",
        "game": "3v1 keep-away, then a shot.",
        "cd": "Don’t stand after the pass.",
        "g12": "No defender",
        "g34": "Passive",
        "g56": "Active"
      },
      {
        "w": 2,
        "c": 4,
        "title": "Basketball games day",
        "focus": "Apply the week",
        "wu": "Free dribble.",
        "skill": "Vote: Rob the Nest, gates, or wall-pass.",
        "game": "Chosen game.",
        "cd": "One assist you noticed.",
        "g12": "Walk",
        "g34": "Jog",
        "g56": "Student coaches"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Scoop hold and cradle",
        "focus": "Scoop faces up; ball sits",
        "wu": "Jog, freeze.",
        "skill": "Pocket up. Cradle a wiffle or foam ball while walking. Two hands in 1–2.",
        "game": "Red Light with a scoop — freeze means the ball stays in.",
        "cd": "Quiet scoops on the floor.",
        "g12": "Two-hand cradle, walk",
        "g34": "Walk-jog cradle",
        "g56": "Jog cradle, switch hands"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Scoop toss to self",
        "focus": "Short pop-up, watch it in",
        "wu": "Cradle walk.",
        "skill": "Pop the ball a hand-span and catch it in the scoop. Then a small underhand toss to self.",
        "game": "Throw & Go with scoops — toss, move, scoop it again.",
        "cd": "Count three clean self-catches.",
        "g12": "Teacher toss to the scoop",
        "g34": "Self toss",
        "g56": "Weaker-hand scoop"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Partner scoop catch",
        "focus": "Underhand to a partner’s scoop",
        "wu": "Partner bounce-pass with hands first.",
        "skill": "Step toward the catch. Call their name. Balls stay below the shoulders.",
        "game": "Overarm throw-and-catch using scoops, or a scoop end-zone (catcher in a hoop).",
        "cd": "Thank a partner.",
        "g12": "Short toss",
        "g34": "Step back",
        "g56": "Move to the catch"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Scoop games day",
        "focus": "Send and receive with scoops",
        "wu": "Self toss.",
        "skill": "Review cradle and partner toss.",
        "game": "End Zone Ball with scoops, or Collect the Treasure using scoop carries.",
        "cd": "Name one basketball idea that transferred (ready hands → ready scoop).",
        "g12": "Carry and place",
        "g34": "Catch in the scoop",
        "g56": "Must pass once"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Scoop give-and-go",
        "focus": "Pass, then move to space",
        "wu": "Partner scoop catch.",
        "skill": "Pass and cut to a hoop. Partner sends it back.",
        "game": "Give-and-go to a hoop with scoops. Optional basketball dribble station on the side.",
        "cd": "What space did you run into?",
        "g12": "Walk pass",
        "g34": "Jog cut",
        "g56": "Fake then cut"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Choice: hoop or scoop",
        "focus": "Basketball shoot or scoop catch — same send/receive idea",
        "wu": "Toe-taps or scoop cradle.",
        "skill": "Half the class at hoops (dribble-shoot). Half at scoops (partner catch). Switch at 6 minutes.",
        "game": "Small 3v3 basketball or scoop end-zone.",
        "cd": "Which send felt more controlled today?",
        "g12": "Choice of play versions",
        "g34": "Both stations",
        "g56": "Captain a station"
      },
      {
        "w": 4,
        "c": 3,
        "title": "January stations",
        "focus": "Four send/receive stations",
        "wu": "Easy jog.",
        "skill": "Stations: dribble, chest pass, scoop catch, scoop carry to a hoop.",
        "game": "Rotate 3 minutes. Freeze on the whistle to switch.",
        "cd": "Which station will you practise next week?",
        "g12": "Teacher at scoop",
        "g34": "All four",
        "g56": "Student hosts"
      },
      {
        "w": 4,
        "c": 4,
        "title": "January fitness + games",
        "focus": "Private skip or wall-pass, then a closer",
        "wu": "Easy lap.",
        "skill": "Private fitness check.",
        "game": "Basketball games day or scoop End Zone Ball.",
        "cd": "Sheet dated.",
        "g12": "Teacher may scribe",
        "g34": "Record privately",
        "g56": "Optional private goal"
      }
    ]
  },
  {
    "name": "February",
    "guide": "Rope skills · hoop skills · Jump Rope for Heart the week your school runs it",
    "pew": "Active Living, Movement Skill Development, Safety",
    "equipment": "Short ropes, long rope, hoops, music",
    "fitness": "Skip check is the month’s fitness. Private count — not a class rank.",
    "notes": "Slide Jump Rope for Heart into the week your school actually runs it (often Week 4). Marching counts.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Rope safety and rainbow",
        "focus": "Space, turning, no whipping",
        "wu": "Ropes stay on the floor until told. Jog around them.",
        "skill": "Make a rainbow: swing the rope side to side, then over. Cue: turn from the wrists.",
        "game": "Rainbow freeze — rope still on whistle.",
        "cd": "Ropes down before anyone talks.",
        "g12": "Two-hand rainbow",
        "g34": "Over-the-head turn",
        "g56": "Alternate-hand turns"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Two-foot jump",
        "focus": "Jump when the rope hits the floor",
        "wu": "Jump in place with no rope, then with a floor rope.",
        "skill": "Self-turned two-foot jumps. Count 1–5.",
        "game": "Jump the river (two long ropes) then individual tries.",
        "cd": "Soft landing.",
        "g12": "Teacher-turned long rope optional",
        "g34": "5 in a row goal",
        "g56": "10 in a row or jog-step"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Long rope",
        "focus": "Enter, jump, exit",
        "wu": "Run through a still long rope.",
        "skill": "Teacher-turned rope: in, 1–3 jumps, out.",
        "game": "School: groups wait in a line, cheer the jumper.",
        "cd": "How do we cheer without rushing?",
        "g12": "Run through only",
        "g34": "1–3 jumps",
        "g56": "Students turn for each other"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Rope games",
        "focus": "Keep moving if jumping is hard",
        "wu": "Choice: skip or rainbow.",
        "skill": "Helicopters (low), high-low, partner turn for a jumper.",
        "game": "Helicopter: two students sit and swing a rope in a circle on the floor; others jump it.",
        "cd": "Tired wrists stretch.",
        "g12": "Very low helicopter",
        "g34": "Standard",
        "g56": "Add a second rope if space"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Hoop — spin and space",
        "focus": "Control, not just hula",
        "wu": "Hoop on the floor, jump in and out.",
        "skill": "Waist spin, arm spin, roll a hoop to a partner.",
        "game": "Chicken Checkers — hoops are rest spots.",
        "cd": "Which spin lasted?",
        "g12": "Arm and floor hoop",
        "g34": "Waist tries",
        "g56": "Change direction spin"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Hoop locomotion",
        "focus": "Travel with a hoop",
        "wu": "Step through a hoop like a magic door.",
        "skill": "Skip while rolling, or hoop around one arm while jogging.",
        "game": "Sheepdog: roll hoops home without knocking others.",
        "cd": "Eyes up.",
        "g12": "Carry or roll slowly",
        "g34": "Roll and chase",
        "g56": "Weak-hand roll"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Hoop targets and tosses",
        "focus": "Aim",
        "wu": "Toss-catch a hoop to self.",
        "skill": "Hoop toss to a partner, then onto a cone.",
        "game": "Ring toss team scores.",
        "cd": "Soft toss.",
        "g12": "Short distance",
        "g34": "Step back",
        "g56": "Opposite hand"
      },
      {
        "w": 2,
        "c": 4,
        "title": "Hoop creative",
        "focus": "Shapes and pathways",
        "wu": "Hoop as a steering wheel.",
        "skill": "Build a body shape inside, on, or through a hoop.",
        "game": "Museum: half pose in hoops, half gallery walk.",
        "cd": "Control beat speed.",
        "g12": "One hoop one shape",
        "g34": "Two linked hoops",
        "g56": "Group sculpture"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Rope and hoop stations",
        "focus": "Choice practice",
        "wu": "Free skip or hoop.",
        "skill": "Four stations × ~5 min: two-foot jump, long rope, hoop roll, hoop toss.",
        "game": "Teacher floats.",
        "cd": "Hardest station?",
        "g12": "Adult at long rope",
        "g34": "Independent",
        "g56": "Peer turners"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Combine rope + hoop",
        "focus": "Sequence",
        "wu": "Hoop jump then 3 rope jumps.",
        "skill": "Build a 20-second combo.",
        "game": "Show a neighbour, then try theirs.",
        "cd": "Borrow one idea.",
        "g12": "Teacher combo",
        "g34": "20 seconds",
        "g56": "32 seconds with a change of direction"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Partner rope",
        "focus": "Turn for someone else",
        "wu": "Partner high-fives.",
        "skill": "One turns, one jumps. Trade.",
        "game": "How many jumps as a pair?",
        "cd": "Kind turning is a skill.",
        "g12": "Long rope with adult",
        "g34": "Short rope pairs",
        "g56": "Both turn a long rope"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Cardio hoops",
        "focus": "Aerobic play with a hoop",
        "wu": "Hoop-jog around cones.",
        "skill": "Hoop relay: roll or carry, tag the next runner.",
        "game": "Hoop-train tag or Chicken Checkers.",
        "cd": "Pulse check.",
        "g12": "Walk-carry the hoop",
        "g34": "Continuous 2 minutes",
        "g56": "Student-led intervals"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Rope challenge day",
        "focus": "Personal records",
        "wu": "Easy rainbows.",
        "skill": "Private: how many two-foot jumps without a miss?",
        "game": "Long-rope school plus helicopter.",
        "cd": "Your number stays yours.",
        "g12": "Count attempts, not only jumps",
        "g34": "Best of 3",
        "g56": "Add a criss-cross try"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Hoop challenge day",
        "focus": "Personal records",
        "wu": "Spin trials.",
        "skill": "Longest waist spin, farthest fair roll.",
        "game": "Hoop horseshoe + island tag.",
        "cd": "Name a hoop skill that improved.",
        "g12": "Roll for distance",
        "g34": "Spin and roll",
        "g56": "Opposite-hand spin"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Jump Rope for Heart or rope/hoop games",
        "focus": "If JR4H is this week, run it; if not, big-group rope games",
        "wu": "Music skip.",
        "skill": "JR4H skip stations, or rope and hoop games from the library.",
        "game": "JR4H games, or Four Corners Stay-In / Fitness Musical Hoops.",
        "cd": "Celebrate effort, not the highest count. Track Day is later — May prep, June meet.",
        "g12": "One game",
        "g34": "Two",
        "g56": "Students rotate hosts"
      },
      {
        "w": 4,
        "c": 4,
        "title": "February fitness update",
        "focus": "Skip check + favourite game",
        "wu": "30-second skip (the monthly test).",
        "skill": "Stretch wrists, calves, shoulders.",
        "game": "Vote rope game or hoop game.",
        "cd": "Compare kindly to January — only with yourself.",
        "g12": "March in place if rope is frustrating",
        "g34": "Record skip",
        "g56": "Set a March goal"
      }
    ]
  },
  {
    "name": "March",
    "guide": "Volleyball all four weeks · Newcomb to bump/set · send/receive games",
    "pew": "Movement Skill Development, Active Living, Safety, Healthy Relationships",
    "equipment": "Volleyballs, trainers or beach balls, a tape net or rope, cones",
    "fitness": "Timed keep-up or skip. Private record.",
    "notes": "Catch is allowed in 1–2. Bump/set progress in 3–6. Send/receive games (Newcomb, keep-it-up) keep everyone in.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Ready position and catch",
        "focus": "Feet set, hands ready",
        "wu": "Self-toss and catch.",
        "skill": "Catch a beach ball or trainer. Move the feet.",
        "game": "Newcomb — catch and throw over a rope.",
        "cd": "Call ‘mine.’",
        "g12": "Catch-throw",
        "g34": "Catch then self-bump",
        "g56": "Pass over"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Underhand send",
        "focus": "Bowler step, contact the ball",
        "wu": "Bowler steps.",
        "skill": "Underhand serve or throw over a low rope.",
        "game": "Hoop underhand to a target, then over the rope.",
        "cd": "Step to the net.",
        "g12": "Throw over",
        "g34": "Underhand serve",
        "g56": "Serve from farther"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Bump (forearm pass)",
        "focus": "Flat platform, no swing",
        "wu": "Show the platform.",
        "skill": "Toss to self, bump up. Then partner toss.",
        "game": "Keep-it-up with a beach ball.",
        "cd": "Belly-button to the ball.",
        "g12": "Catch if it drops",
        "g34": "Bump preferred",
        "g56": "Series of 3 bumps"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Volleyball games day",
        "focus": "Apply the week",
        "wu": "Partner catch.",
        "skill": "Newcomb or keep-it-up.",
        "game": "Four Corners Stay-In as a closer.",
        "cd": "Kind call.",
        "g12": "Catch-throw",
        "g34": "Newcomb",
        "g56": "Add a bump"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Set (finger pass)",
        "focus": "Shape the ball up",
        "wu": "Wrist and finger shape.",
        "skill": "Toss to self, set up. Partner set.",
        "game": "Circle set-catch.",
        "cd": "Soft fingers.",
        "g12": "Catch",
        "g34": "Set-catch",
        "g56": "Set-set"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Rotate and cover",
        "focus": "Everyone plays every spot",
        "wu": "Walk the rotation.",
        "skill": "3-person rotation. Catch or bump.",
        "game": "Small Newcomb, rotate every point.",
        "cd": "No one hides in the back.",
        "g12": "Teacher rotates",
        "g34": "Players rotate",
        "g56": "Call the rotation"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Small-sided volleyball",
        "focus": "Send over, then ready",
        "wu": "Partner bump.",
        "skill": "3v3 over a rope. Catch allowed on first contact for 1–4.",
        "game": "Two games, bumpers on the side.",
        "cd": "Ready after you send.",
        "g12": "Catch-throw",
        "g34": "One bump then catch",
        "g56": "Two contacts"
      },
      {
        "w": 2,
        "c": 4,
        "title": "Volleyball festival",
        "focus": "Close the net block",
        "wu": "Easy keep-up.",
        "skill": "Buffet of Newcomb and keep-it-up.",
        "game": "Balloon keep-up station if you need a gentle closer.",
        "cd": "Thank a caller.",
        "g12": "Catch",
        "g34": "Mix",
        "g56": "Student refs"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Dig / low ball",
        "focus": "Platform under a dropping ball",
        "wu": "Show the platform. Wrist together.",
        "skill": "Partner toss to the knees. Bump up, then catch if needed.",
        "game": "Keep-it-up. Restart together on a drop.",
        "cd": "Belly-button to the ball.",
        "g12": "Catch if it drops",
        "g34": "Bump preferred",
        "g56": "Series of 3 bumps"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Serve receive",
        "focus": "Ready feet under a serve",
        "wu": "Bowler-step shadow serves.",
        "skill": "Underhand serve over a low rope. Receiver catches or bumps.",
        "game": "Newcomb — catch-throw still allowed in 1–4.",
        "cd": "Call ‘mine.’",
        "g12": "Throw over; catch",
        "g34": "Underhand serve; catch then bump",
        "g56": "Serve from farther; bump preferred"
      },
      {
        "w": 3,
        "c": 3,
        "title": "3 v 3 over a rope",
        "focus": "Send over, then ready",
        "wu": "Partner bump or catch.",
        "skill": "3v3. Catch allowed on first contact for 1–4. Rotate every few points.",
        "game": "Two games, bumpers on the side keep a beach ball up.",
        "cd": "Ready after you send.",
        "g12": "Catch-throw",
        "g34": "One bump then catch",
        "g56": "Two contacts"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Send and receive games",
        "focus": "Keep-it-up, Newcomb, or Four Corners Stay-In",
        "wu": "Rainbow rope or easy keep-up.",
        "skill": "JR4H lives in February. Today: Newcomb, keep-it-up, or a send/receive closer.",
        "game": "Newcomb, Cooperative Wall Ball, or Four Corners Stay-In.",
        "cd": "Thank a caller.",
        "g12": "Choice movement",
        "g34": "Song-length skip or Newcomb",
        "g56": "Student timers or refs"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Set (finger pass) review",
        "focus": "Shape the ball up",
        "wu": "Wrist and finger shape.",
        "skill": "Toss to self, set up. Partner set.",
        "game": "Circle set-catch.",
        "cd": "Soft fingers.",
        "g12": "Catch",
        "g34": "Set-catch",
        "g56": "Set-set"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Rotate and cover",
        "focus": "Everyone plays every spot",
        "wu": "Walk the rotation.",
        "skill": "3-person rotation. Catch or bump.",
        "game": "Small Newcomb, rotate every point.",
        "cd": "No one hides in the back.",
        "g12": "Teacher rotates",
        "g34": "Players rotate",
        "g56": "Call the rotation"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Volleyball festival",
        "focus": "Close the net block",
        "wu": "Easy keep-up.",
        "skill": "Buffet of Newcomb, keep-it-up, hoop underhand. Track Day is a separate page.",
        "game": "Student-choice net game.",
        "cd": "Thank a caller.",
        "g12": "Catch",
        "g34": "Mix",
        "g56": "Student refs"
      },
      {
        "w": 4,
        "c": 4,
        "title": "March fitness + net closer",
        "focus": "Personal skip or timed keep-up",
        "wu": "Easy jog.",
        "skill": "Private timed skip or 30-second keep-up. Not a class rank.",
        "game": "Vote a gentle closer.",
        "cd": "Track Day (first week of June) is on the Track Day page.",
        "g12": "Play version",
        "g34": "Record privately",
        "g56": "Pace talk"
      }
    ]
  },
  {
    "name": "April",
    "guide": "Floor-only gymnastics · shapes, rolls, balances, jump-stick",
    "pew": "Movement Skill Development, Safety, Character Development",
    "equipment": "Mats, tape beam, hoops — no benches, boxes, or beams",
    "fitness": "Jump-stick and a hold. Private record.",
    "notes": "Floor only. Skills check list and Grade 6 booklet live on the Gymnastics page.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Shapes: tuck, pike, straddle, stretch",
        "focus": "Strong shapes, tight muscles",
        "wu": "Shake, then freeze in a shape.",
        "skill": "Four shapes on the mat. Hold 3 seconds. Name the shape.",
        "game": "Shape museum.",
        "cd": "Which shape felt strongest?",
        "g12": "Tuck and stretch",
        "g34": "All four",
        "g56": "Add a twist shape"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Travel like a gymnast",
        "focus": "Weight transfer, quiet feet",
        "wu": "Animal travels on mats only.",
        "skill": "Bear, crab, seal, bunny hop. Still start and still end.",
        "game": "Traffic animals — change animal on the drum.",
        "cd": "Quiet travel.",
        "g12": "Two animals",
        "g34": "Four",
        "g56": "Students invent a fifth"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Balance",
        "focus": "Small base, still eyes",
        "wu": "Flamingo.",
        "skill": "One-foot, scale attempts, beanbag on the head. Relevé if ready.",
        "game": "Who can be a statue through a whole song intro?",
        "cd": "Eyes on one spot.",
        "g12": "Wide base OK",
        "g34": "One-foot 5 seconds",
        "g56": "5–8 seconds plus a change"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Jump and land",
        "focus": "Bend–jump–stick",
        "wu": "Jump the river.",
        "skill": "Straight jump, star jump, tuck jump onto mat. Stick the landing.",
        "game": "Lily-pad hoop jumps with a stuck landing.",
        "cd": "Why bend?",
        "g12": "Straight jump only",
        "g34": "Star and tuck",
        "g56": "Half-turn jump"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Log roll",
        "focus": "Long, tight body, no head lead",
        "wu": "Rock like a log on the back.",
        "skill": "Log roll on the floor. Stop in a stretch shape. Space between rollers.",
        "game": "Log-roll and freeze — quality over speed.",
        "cd": "Dizzy = sit.",
        "g12": "Teacher beside",
        "g34": "Independent",
        "g56": "Two rolls to a shape"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Rock and roll (not a neck roll)",
        "focus": "Rock to shoulder-blades, not the head",
        "wu": "Tuck rocks.",
        "skill": "Rock back and up to sit. No diving onto the head.",
        "game": "Rock-and-shape: rock, then freeze a shape.",
        "cd": "Head never leads a collapse.",
        "g12": "Rocks only",
        "g34": "Rock to stand with help",
        "g56": "Rock to stand"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Link two skills",
        "focus": "Sequence",
        "wu": "Shape, travel, shape.",
        "skill": "Build: shape + roll or jump + shape.",
        "game": "Pairs teach their link to another pair.",
        "cd": "Share one link you liked.",
        "g12": "Shape + travel",
        "g34": "Three parts",
        "g56": "Four parts with a level change"
      },
      {
        "w": 2,
        "c": 4,
        "title": "April stations — travel, jump, roll, balance",
        "focus": "Quality reps",
        "wu": "Line walk on the floor.",
        "skill": "Four floor stations × ~5 min: animal travel, jump-stick, log roll, flamingo.",
        "game": "Teacher floats.",
        "cd": "Wrists and hips.",
        "g12": "Adult at roll",
        "g34": "Independent",
        "g56": "Peer safety coach"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Tape beam",
        "focus": "Walk a floor line and step off",
        "wu": "Line walks on the floor.",
        "skill": "Walk a taped ‘beam’ or Floor rope walk. Stop, step off to a stick. One student per line.",
        "game": "Waiting students: flamingo or shape holds.",
        "cd": "Eyes on a wall spot.",
        "g12": "Wide tape",
        "g34": "Narrow tape",
        "g56": "Pause in a stork on the line"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Hoop and floor pathways",
        "focus": "Change of direction with control",
        "wu": "Hoop step-in.",
        "skill": "Path: hoop, log roll on the floor, hoop, stick.",
        "game": "Follow the path in waves of 4.",
        "cd": "Did you rush?",
        "g12": "No roll in the path",
        "g34": "Full path",
        "g56": "Add a jump"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Partner balances (simple)",
        "focus": "Base of support, consent",
        "wu": "Stand back-to-back.",
        "skill": "Only counters that both can leave instantly: palm to palm, seated lean.",
        "game": "Statue pairs. No lifts.",
        "cd": "You may say no to a shape.",
        "g12": "Palm to palm only",
        "g34": "Seated lean",
        "g56": "Create a still pair shape"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Group sequence",
        "focus": "Unison and canon",
        "wu": "Class stretch shape.",
        "skill": "Whole class: travel, jump, shape on a count.",
        "game": "Perform in canon (waves).",
        "cd": "One thing your group solved.",
        "g12": "Unison only",
        "g34": "Two-wave canon",
        "g56": "Three-wave canon"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Build a routine",
        "focus": "Begin, middle, still end",
        "wu": "Favourite shape.",
        "skill": "Individual or pair routine, 20–30 seconds.",
        "game": "Rehearse, then gallery.",
        "cd": "Still ending.",
        "g12": "Two skills",
        "g34": "Four skills",
        "g56": "Six skills plus a level change"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Performance and judging kindly",
        "focus": "Character: notice control",
        "wu": "Audience practice.",
        "skill": "Watch for stillness, not tricks.",
        "game": "Perform routines. Class names one controlled moment.",
        "cd": "Compliment a still ending.",
        "g12": "Show one skill",
        "g34": "Full routine",
        "g56": "Student judges use a 3-cue rubric"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Gymnastics buffet",
        "focus": "Choice",
        "wu": "Free shapes.",
        "skill": "Open stations from the month.",
        "game": "Students pick two stations, then a class sequence.",
        "cd": "What felt controlled?",
        "g12": "Two stations",
        "g34": "Open gym",
        "g56": "Host"
      },
      {
        "w": 4,
        "c": 4,
        "title": "April fitness update",
        "focus": "Strength, flexibility, stillness",
        "wu": "Shape holds 20s.",
        "skill": "Wall sit or chair, sit-and-reach, flamingo time.",
        "game": "Vote a gentle closer: museum or animal relay.",
        "cd": "Control beat speed this month — say why.",
        "g12": "Play versions",
        "g34": "Record",
        "g56": "Goal for May running"
      }
    ]
  },
  {
    "name": "May",
    "guide": "Track and Field Day practice for Grades 4–6 · play versions for 1–2",
    "pew": "Movement Skill Development, Active Living, Safety, Character Development",
    "equipment": "Hurdles, high-jump mat, hoops, beanbags (not balloons), pins, sacks, javelin trainers; Grade 6 discus and shot outside",
    "fitness": "Private timed run or skip late in the month. No class ranking.",
    "notes": "May is school practice so June Track Day is familiar. Use the Track Day page for descriptions, rules, faults, and scoring. Beanbags replace water balloons. High-jump mat and hurdles are available.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "100 m dash practice",
        "focus": "Heats, lanes, a fair start",
        "wu": "Build-ups in lanes.",
        "skill": "Walk the 100 m. Crouch or standing start. One at a time or side-by-side heats. See the Track Day page for scoring bands.",
        "game": "Everyone runs. Cheer every heat. No class ranking — country points are for June.",
        "cd": "Walk the last 40 m.",
        "g12": "Walk–sprint 40 m",
        "g34": "Lane heats, standing start",
        "g56": "100 m heats; student starters"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Shuttle run + bounce-pass",
        "focus": "10 m beanbag shuttle; face-down start",
        "wu": "Easy jog.",
        "skill": "Event card: face-down, do not grab a bag on the first rise. Then bounce-pass relay if you have time. Rules on the Track Day page.",
        "game": "Combined-group shuttle corridors. Two countries can share a corridor in June.",
        "cd": "Shake out calves.",
        "g12": "Walk shuttle, no face-down",
        "g34": "Face-down shuttle, short corridor",
        "g56": "Full 10 m shuttle"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Hurdles",
        "focus": "Four-hurdle flight; over, not through",
        "wu": "A-skips and step-overs.",
        "skill": "5 m approach, 4 m between four hurdles, 5 m finish. Two runs. Track Day page has the time bands.",
        "game": "One at a time. Partner times privately — not a class rank.",
        "cd": "Stretch calves and hips.",
        "g12": "Step over cones only",
        "g34": "Lowest hurdles",
        "g56": "Full 26 m flight"
      },
      {
        "w": 1,
        "c": 4,
        "title": "Skipping + hoop twirl",
        "focus": "Event counts; another colour still counts",
        "wu": "Rainbow rope.",
        "skill": "Skipping three tries. Hoop twirl 40 s if you have time. Combined-group in June.",
        "game": "Skip then hoop. Celebrate effort.",
        "cd": "Ropes away kindly.",
        "g12": "March or rainbow-rope",
        "g34": "Self-turn; 40 s hoop",
        "g56": "Personal high; student timers"
      },
      {
        "w": 2,
        "c": 1,
        "title": "Standing long jump",
        "focus": "Board rule and stick landing",
        "wu": "Jump the river.",
        "skill": "Standing long jump bands. Step-over = no jump. Pit or mats clear. Track Day page for marks.",
        "game": "One jumper; waiting line sits off the board.",
        "cd": "Bend–jump–stick.",
        "g12": "Two-foot into a hoop",
        "g34": "Standing jump",
        "g56": "Full standing with a board"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Running long jump",
        "focus": "Approach, take-off, stick",
        "wu": "Build-ups.",
        "skill": "Running long jump. One jumper. Pit clear.",
        "game": "Short run-up then stick. Partner measures privately.",
        "cd": "Walk back.",
        "g12": "Skip if the pit is not ready; hoop jump",
        "g34": "Short run-up",
        "g56": "Full approach if pit is ready"
      },
      {
        "w": 2,
        "c": 3,
        "title": "High jump (mat)",
        "focus": "Bar at 50 cm; land on the mat",
        "wu": "Scissors over a line.",
        "skill": "High-jump mat is available. One jumper. Land on back or side — never head or neck. Track Day page for heights.",
        "game": "Waiting line sits off the run-up.",
        "cd": "Thank the person at the uprights.",
        "g12": "Two-foot onto a low mat; no bar",
        "g34": "Scissors over a low bar",
        "g56": "Approach, take-off, land on the mat"
      },
      {
        "w": 2,
        "c": 4,
        "title": "Jump review + fitness",
        "focus": "Private jump-stick or skip",
        "wu": "Easy jog.",
        "skill": "Choice: standing jump review or private skip. Not a class rank.",
        "game": "Vote a gentle closer.",
        "cd": "June Track Day is the first week — rules live on the Track Day page.",
        "g12": "Play version",
        "g34": "Record privately",
        "g56": "Could official a jump in June"
      },
      {
        "w": 3,
        "c": 1,
        "title": "Ring fling + ball throw",
        "focus": "Side-arm hoop (4–5); overhand ball",
        "wu": "Shadow side-arm then overhand.",
        "skill": "Grade 4–5: ring fling and ball throw. Three throws. Fetch on the call. Track Day page for distance bands.",
        "game": "Three throws. Carry implements vertically.",
        "cd": "Thank a fetch partner.",
        "g12": "Hoop roll or beanbag",
        "g34": "Ring fling + overhand trainer",
        "g56": "Full ring and ball throw"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Javelin (trainer)",
        "focus": "Overhand, opposite foot",
        "wu": "Javelin shadow.",
        "skill": "Trainer javelin or foam. Sector clear. Three throws. Track Day page for faults.",
        "game": "One thrower. Fetch on the call.",
        "cd": "Carry vertically.",
        "g12": "Beanbag overhand",
        "g34": "Trainer javelin, short run-up",
        "g56": "Full trainer javelin"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Shot put / discus (Grade 6, outside)",
        "focus": "Push the shot; side-arm discus — outside only",
        "wu": "Shadow push then side-arm.",
        "skill": "Grade 6 only, outside. Shot is a push, not a baseball throw. Discus stays outside. 1–5: ball throw or ring fling instead.",
        "game": "Three attempts. Sector clear.",
        "cd": "Implements away vertically.",
        "g12": "Stay on ball throw or beanbag",
        "g34": "Watch Grade 6 from a safe line, or ball throw",
        "g56": "Grade 6 discus and shot outside"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Throw stations",
        "focus": "Rotate ring, javelin, ball / shot",
        "wu": "Easy arm circles.",
        "skill": "Three throw stations, 5 min each. Grade 6 shot/discus only if you are already outside.",
        "game": "Fetch on the call. Track Day page for scoring.",
        "cd": "Shake out throwing shoulders.",
        "g12": "Beanbag stations",
        "g34": "Ring + trainer",
        "g56": "Add Grade 6 outside if weather allows"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Beanbag toss, pins, soccer kick",
        "focus": "Combined-group stations — beanbags, not balloons",
        "wu": "Soft underhand beanbag toss.",
        "skill": "Beanbag toss (balloon substitute), pin bowling, soccer kick. Two countries can share a station in June.",
        "game": "Three stations, 6 min each.",
        "cd": "Name someone who reset pins.",
        "g12": "Short toss; two-hand roll",
        "g34": "Step-back toss; knee-bend bowl",
        "g56": "Honest pin count; driven low kick"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Canoe, tug, sack race",
        "focus": "Combined-group; sacks are the only event you may come off",
        "wu": "Easy jog.",
        "skill": "Dry-land canoeing, tug-of-war, sack races. Stop on the whistle even mid-pull. Track Day page for rules.",
        "game": "Short pulls and short sack heats. Shoes back on after sacks.",
        "cd": "Thank a teammate who waited.",
        "g12": "Sit canoe / no tug; hop in a hoop",
        "g34": "Short canoe and tug",
        "g56": "Full combined-group events"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Track Day walk-through",
        "focus": "Order of stations, countries, judges",
        "wu": "Easy jog of the field or gym.",
        "skill": "Walk the Track Day page order. Assign practice countries. Beanbags not balloons. Grade 6 discus/shot outside.",
        "game": "Vote two events to revisit.",
        "cd": "One personal goal for June Track Day (first week).",
        "g12": "Play walk-through of two events",
        "g34": "Know combined-group vs solo",
        "g56": "Could official one station in June"
      },
      {
        "w": 4,
        "c": 4,
        "title": "May fitness + Track Day close",
        "focus": "Private run or skip plus event order",
        "wu": "Easy jog.",
        "skill": "Private timed run or skip. Not a class rank.",
        "game": "Gentle closer. Pack the mat and hurdles.",
        "cd": "Track Day is the first week of June — use the event page for rules and scoring.",
        "g12": "Play version",
        "g34": "Record privately",
        "g56": "Pace talk"
      }
    ]
  },
  {
    "name": "June",
    "guide": "Week 1: Track and Field Day · Weeks 2–4: T-ball / baseball",
    "pew": "Movement Skill Development, Active Living, Character, Safety",
    "equipment": "Week 1: kit on the Track Day page. Weeks 2–4: tees, bats, balls, hoop bases.",
    "fitness": "Final private check after the meet: skip, short run, or jump-stick.",
    "notes": "Track and Field Day is the first week of June (event page for rules and scoring). Weeks 2–4 are T-ball/baseball — everyone bats, throw to a hoop at first, not at the runner.",
    "lessons": [
      {
        "w": 1,
        "c": 1,
        "title": "Track Day is this week",
        "focus": "Use the Track Day page — do not teach events from this card",
        "wu": "Easy jog if you have gym time. Otherwise: attendance and country lists.",
        "skill": "Open track-day.html for descriptions, rules, faults, and scoring. This card is only a calendar reminder.",
        "game": "Assign countries and station judges from that page.",
        "cd": "Print or pack the event sheet. Beanbags, not balloons.",
        "g12": "Play versions only if they join a station",
        "g34": "Grade 4 reads ring-fling, ball-throw, jump cards",
        "g56": "Grade 6 discus and shot outside"
      },
      {
        "w": 1,
        "c": 2,
        "title": "Track and Field Day",
        "focus": "Run the event page",
        "wu": "Country jog. Judges to stations with the Track Day page.",
        "skill": "This is the meet. Follow each event card: rules, faults, and the score table.",
        "game": "Rotate countries. Combined-group events hold two countries. Add points as the cards show.",
        "cd": "Shoes back on after sacks. Thank a judge from another country.",
        "g12": "Join only with an adult helper",
        "g34": "Grade 4 on booklet events as written",
        "g56": "Full events. Grade 6 discus/shot outside"
      },
      {
        "w": 1,
        "c": 3,
        "title": "Finish the day or rain plan",
        "focus": "Leftover stations from the event page",
        "wu": "If dry: leftover field events. If rain: gym versions (no discus/shot indoors).",
        "skill": "Use the Track Day page. Do not teach a new lesson — finish scoring.",
        "game": "Combined-group leftovers: bounce-pass, hoop twirl, beanbag toss, canoe, tug.",
        "cd": "Park equipment. Tally country points.",
        "g12": "Indoor play if they are with you",
        "g34": "Finish two leftover events",
        "g56": "Help reset and total the scoresheet"
      },
      {
        "w": 1,
        "c": 4,
        "title": "After Track Day",
        "focus": "Thank-you and a gentle closer",
        "wu": "Easy walk-jog. Shake out throwing shoulders.",
        "skill": "Stretch. Optional private skip — not compared to Track Day scores.",
        "game": "Vote a gentle closer from the games library.",
        "cd": "Thank a classmate who judged. Weeks 2–3 are festival and T-ball.",
        "g12": "Play closer",
        "g34": "Name one event and one judge",
        "g56": "Help pack the mat and hurdles"
      },
      {
        "w": 2,
        "c": 1,
        "title": "T-ball / baseball intro",
        "focus": "Hit off a tee; run through first",
        "wu": "Jog the diamond.",
        "skill": "Meet is done. T-ball: hit off a tee. Bat in the hoop. Run through first.",
        "game": "Everyone bats. Throw to a hoop at first, not at the runner.",
        "cd": "What game should we play again in Week 3?",
        "g12": "Play version",
        "g34": "Fair start",
        "g56": "Student caller"
      },
      {
        "w": 2,
        "c": 2,
        "title": "Strike and catch",
        "focus": "Tee or toss; ready hands",
        "wu": "Partner toss.",
        "skill": "Partner toss. Call ‘mine.’ Hit off a tee or a short toss.",
        "game": "Continuous Kick Ball or Quick Baseball — everyone bats.",
        "cd": "Name someone who hosted well.",
        "g12": "Choice of play stations",
        "g34": "All four",
        "g56": "Host one station"
      },
      {
        "w": 2,
        "c": 3,
        "title": "Everyone bats",
        "focus": "Fair batting order; throw to a hoop at first",
        "wu": "Jog the diamond.",
        "skill": "Whole class bats in order. Tee or toss. Run through first.",
        "game": "Everyone bats. Throw to a hoop at first, not at the runner.",
        "cd": "Bat away from the waiting line.",
        "g12": "Beanbag off a tee",
        "g34": "Tee or coach-pitch",
        "g56": "Call ‘mine.’"
      },
      {
        "w": 2,
        "c": 4,
        "title": "June fitness + year note",
        "focus": "Final private check",
        "wu": "Easy lap after Track Day week.",
        "skill": "Private skip, short run, or jump–stick. Compare only to yourself.",
        "game": "Year growth sentence.",
        "cd": "Optional summer movement goal.",
        "g12": "Teacher may scribe",
        "g34": "Record privately",
        "g56": "Compare to own September note only"
      },
      {
        "w": 3,
        "c": 1,
        "title": "T-ball toss and catch",
        "focus": "Optional striking closer",
        "wu": "Self-catch.",
        "skill": "Partner toss. Call ‘mine.’",
        "game": "Overarm throw-and-catch.",
        "cd": "Ready hands.",
        "g12": "Beanbags",
        "g34": "T-ball",
        "g56": "Move to the catch"
      },
      {
        "w": 3,
        "c": 2,
        "title": "Base running",
        "focus": "Run through the hoop",
        "wu": "Jog the diamond.",
        "skill": "Four hoops. Run through, do not stop on the hoop.",
        "game": "Kickball-dodge if you want a hybrid.",
        "cd": "Eyes up.",
        "g12": "One base",
        "g34": "Three",
        "g56": "Four, tag up talk"
      },
      {
        "w": 3,
        "c": 3,
        "title": "Year-end festival",
        "focus": "Student choice",
        "wu": "Class vote.",
        "skill": "Stations from the year: soccer gate, hockey pass, volleyball keep-up, a relay.",
        "game": "Festival.",
        "cd": "Thank two people.",
        "g12": "Two stations",
        "g34": "Open",
        "g56": "Hosts"
      },
      {
        "w": 3,
        "c": 4,
        "title": "Final fitness + thank-you",
        "focus": "Personal close",
        "wu": "Easy walk-jog.",
        "skill": "Private skip or run. Return sheets to students or files.",
        "game": "Favourite game of the year.",
        "cd": "One thing your body can do now.",
        "g12": "Play version",
        "g34": "Record",
        "g56": "Write a goal for next year"
      },
      {
        "w": 4,
        "c": 1,
        "title": "Rain or extra meet",
        "focus": "If you have a fourth week",
        "wu": "Build-ups.",
        "skill": "Repeat a heat or a festival station.",
        "game": "Student-hosted game.",
        "cd": "Kind start.",
        "g12": "Choice",
        "g34": "Choice",
        "g56": "Hosts"
      },
      {
        "w": 4,
        "c": 2,
        "title": "Cooperative closer",
        "focus": "Leave the gym kindly",
        "wu": "Partner stretch.",
        "skill": "Cross the River or Circle Hoop Pass.",
        "game": "Chosen cooperative game.",
        "cd": "No one left out.",
        "g12": "Short",
        "g34": "Full",
        "g56": "Silent challenge"
      },
      {
        "w": 4,
        "c": 3,
        "title": "Skill thank-you",
        "focus": "Show one skill from the year",
        "wu": "Free play in space.",
        "skill": "Each student shows one skill. Class names the cue.",
        "game": "Gallery.",
        "cd": "Clap for control, not tricks.",
        "g12": "One skill",
        "g34": "Two",
        "g56": "Teach a younger cue"
      },
      {
        "w": 4,
        "c": 4,
        "title": "Last class",
        "focus": "Celebrate",
        "wu": "Easy lap.",
        "skill": "Teacher choice from the year.",
        "game": "Game the class loves.",
        "cd": "Have a good summer — keep playing.",
        "g12": "Calmer",
        "g34": "Mix",
        "g56": "Students pick"
      }
    ]
  }
];

const MONTH_GAMES = {
  "September": [
    [
      "Hospital Tag",
      "",
      "Everyone is it. Cover the tag with a hand. Third tag = stretch hospital, then re-enter. 5 min max as a warm-up."
    ],
    [
      "Hot Dog Tag",
      "",
      "Tagged player is the wiener and calls for a bun. Two classmates stand either side, all three shout, then 5-second free."
    ],
    [
      "Line Tag / Pac-Man",
      "",
      "Stay on gym lines. No jumping lines. Use as the run-skill game."
    ],
    [
      "Sharks and Dolphins",
      "",
      "Hoop islands. On “Shark attack!” taggers enter. Take one hoop away each round. No sitting out — extra sharks."
    ],
    [
      "Captain’s Deck / Shipwreck",
      "",
      "Command game: bow, stern, port, starboard, hit the deck, attention. Skip elimination — last group does 5 jumping jacks and stays in."
    ],
    [
      "Switch",
      "",
      "Four corners, one in the middle. On “Switch,” steal a corner. No pushing; first foot on the spot keeps it."
    ],
    [
      "Rikki Tikki",
      "",
      "Pairs race to the middle and match called body parts. Last pair does jumping jacks next round — still playing."
    ],
    [
      "Frozen Tag",
      "",
      "Arms out when frozen. One high-five frees. Keep 2–3 taggers."
    ],
    [
      "Buffalo",
      "",
      "Pairs on inside/outside track, opposite ways. Music on = jog. Music off = meet and sit back-to-back. Last pair leads the next stretch."
    ],
    [
      "Laps and Lines / Signals",
      "",
      "Change locomotor or level on the whistle. Daily September instant activity."
    ]
  ],
  "October": [
    [
      "Medic dodgeball",
      "",
      "Stay-in dodgeball — medic tap. See Dodgeball page."
    ],
    [
      "Robin’s Nest",
      "",
      "Four hoop nests, balls in the middle. Feet only. Steal from the middle or another nest. First to 3."
    ],
    [
      "Wall Soccer",
      "",
      "2–3 field players per team; everyone else is a wall-goalie. Rotate every 2–3 minutes."
    ],
    [
      "Team Tag",
      "",
      "Tag team may only tag with a held ball. No throw, no walking with the ball. Tagged players join the tag team."
    ],
    [
      "Chuck the Chicken",
      "",
      "Throw the chicken, run laps around your huddle while the other team lines up and passes over-under."
    ],
    [
      "Skittles",
      "",
      "Knock the other team’s cone-skittles. Hits below the waist sit 10 steamboats, then back in. One fetcher in the safe zone."
    ],
    [
      "End Zone Ball",
      "",
      "Roll (not throw) a football or soccer ball to your end-zone catchers. Other team intercepts."
    ],
    [
      "Card Sharks",
      "",
      "Relay: beanbag into a hoop to claim a card. Accuracy over speed."
    ],
    [
      "Booger Ball",
      "",
      "G5–6 invasion: tag the ball-carrier, they must pass, cannot shoot on the tag. Net = 1, hoop = 2."
    ]
  ],
  "November": [
    [
      "FLY BACK",
      "",
      "Cross, grab a disc or ball from the safe zone, throw it home. Caught = collected. Dropped = goes back."
    ],
    [
      "Bucket Ball",
      "",
      "Pass-only; ball-carrier frozen. Score by a catch in a hoop or bucket zone. Rotate the catcher."
    ],
    [
      "Continuous Kick Ball",
      "",
      "Kick off a saucer cone. Partner on the other team replaces the ball to stop the play. Multiple runners."
    ],
    [
      "Chuck the Chicken",
      "",
      "Same as October — now a throwing-accuracy closer."
    ],
    [
      "Beat Ball / Beat the Ball",
      "",
      "Throw or kick, run the bases while fielders throw around the horn."
    ],
    [
      "Thunderball",
      "",
      "Hit or kick through cone rows for 1–2–3 points. Defence stops it before the next row."
    ],
    [
      "Clothespin Tag",
      "",
      "Steal one pin at a time from backs. Kneel to clip a stolen pin on the front (safe). Front pins stay."
    ]
  ],
  "December": [
    [
      "European Rhythmic Running",
      "",
      "Locomotor changes on a drum, tambourine, or chanted 8-count."
    ],
    [
      "Human Bop-It",
      "",
      "Kick it, twist it, spin it, pull it, bop it — on the beat."
    ],
    [
      "Video Game",
      "",
      "Play, rewind, fast-forward, pause, eject, slow-motion."
    ],
    [
      "Captain’s Deck",
      "",
      "Same commands as September, now with dance levels and shapes."
    ],
    [
      "Slap Rover",
      "",
      "Call a name over, slap-hand choose, chase back to the line. Use as a rhythm/style walk."
    ],
    [
      "Mass Challenges",
      "",
      "Whole class: 3 slides left, jump high, freeze in a shape. End with a clap."
    ],
    [
      "Magic Numbers",
      "",
      "10-10-10 or 7-7-7 of three named movements."
    ]
  ],
  "January": [
    [
      "Switch-sides",
      "",
      "Hit means join the other team. See Dodgeball page."
    ],
    [
      "Hot Dog Tag",
      "",
      "Cooperative unfreeze. Default January tag."
    ],
    [
      "Blob Tag",
      "",
      "Start with one pair linked. Tagged players join. Break blobs at 4 if the chain gets dangerous."
    ],
    [
      "Tripod Tag",
      "",
      "Groups of 4: three join hands, one tags. Short rounds, switch the tagger."
    ],
    [
      "Bug Tag / Dead Ant",
      "",
      "Tagged player is a bug on their back. Four classmates carry by wrists/ankles to a hoop hospital. No lifting off the ground for G1–2 — walk-escort instead."
    ],
    [
      "Chicken Checkers",
      "",
      "2–4 tag pairs. Rest stand in hoops. Step in, say the name, swap. Keep people moving."
    ],
    [
      "Four Corner Flags",
      "",
      "Four teams steal beanbag flags. Safe in your quadrant. No puppy-guarding the hoop."
    ],
    [
      "Stones",
      "",
      "Two-team capture the beanbags. Tagged sit; a teammate links and walks you home."
    ],
    [
      "Elves, Giants, Wizards",
      "",
      "Team RPS: elf beats wizard, wizard beats giant, giant beats elf. Winners chase; tagged join. No elimination."
    ],
    [
      "Rescue Relay",
      "",
      "Run across, take a teammate by the hand, bring them home."
    ],
    [
      "Hungry Snake",
      "",
      "Whole team stays linked. Head picks up objects, passes them back to the bag."
    ],
    [
      "Keep Away",
      "",
      "4v1 or 3v1. Three completes, then switch the middle player."
    ],
    [
      "End Zone Ball",
      "",
      "No running with the ball. Three completes or a catch in the end zone."
    ],
    [
      "Rob the Nest (dribble)",
      "",
      "Dribble or carry one soccer or hockey ball at a time back to a hoop nest."
    ]
  ],
  "February": [
    [
      "Chicken Checkers",
      "",
      "Hoop rest-spots during rope/hoop cardio."
    ],
    [
      "Sharks and Dolphins",
      "",
      "Hoop islands after hoop-skill practice."
    ],
    [
      "Switch",
      "",
      "Fast feet, hoop or poly-spot corners."
    ],
    [
      "Helicopter / Snake rope",
      "",
      "Low long-rope circle. Jump or step over. G1–2: walk the snake."
    ],
    [
      "Buzz Off / hoop free zones",
      "",
      "Hoops are rest. New player says “Buzz off” to take the hoop."
    ],
    [
      "Rubber Band",
      "",
      "Face out from a circle, travel on signal, sprint back on the second signal."
    ]
  ],
  "March": [
    [
      "Sharks and Dolphins (chute)",
      "",
      "Parachute shrinks each round instead of removing hoops."
    ],
    [
      "Bug Tag / Dead Ant",
      "",
      "Carry-to-hospital — circus-strong teamwork. G1–2 walk-escort."
    ],
    [
      "Object Toss mixer",
      "",
      "Say a name, toss a scarf. Add objects until several are in the air."
    ],
    [
      "Pip, Squeak and Wilbur",
      "",
      "Trios. Called name runs the circle, through a teammate arch, to a centre beanbag."
    ],
    [
      "Mr. Clean",
      "",
      "Get rid of your two clothespins by clipping them on someone else’s back. Check in the clean hoop."
    ],
    [
      "Parachute popcorn / dome / cat-and-mouse",
      "",
      "Core chute set from the month’s lessons."
    ]
  ],
  "April": [
    [
      "Signals / shapes",
      "",
      "Whistle changes level or shape. Gymnastics language: tuck, pike, stretch."
    ],
    [
      "Body-part beanbags",
      "",
      "Move around spots. Called body part must touch the spot."
    ],
    [
      "Magic Numbers",
      "",
      "3 movements × 7, done as travel-jump-shape."
    ],
    [
      "Daytime / Nighttime",
      "",
      "Night = freeze in a gymnastic statue."
    ],
    [
      "Switch",
      "",
      "Corners are mats. Quiet feet only."
    ]
  ],
  "May": [
    [
      "Buffalo",
      "",
      "Track intervals with a partner meet-up."
    ],
    [
      "Around the Bases Relay",
      "",
      "Teams at each base, run the diamond."
    ],
    [
      "Cone Relay",
      "",
      "Teacher calls 2-4-3-1; run the cones in that order."
    ],
    [
      "Memory Relay",
      "",
      "Peek at a card pattern behind a cone wall, rebuild it at home."
    ],
    [
      "Card Sharks",
      "",
      "Throw a beanbag to a hoop to collect a card — throw review."
    ],
    [
      "Aces",
      "",
      "Outdoor if you can. Active war with a card master hoop. G5–6."
    ],
    [
      "Four Corner Flags",
      "",
      "Orienteering-style steal with a map-optional outdoor version."
    ],
    [
      "Attention Relay",
      "",
      "Numbered files. Call a number; those runners loop their team."
    ]
  ],
  "June": [
    [
      "Continuous Kick Ball",
      "",
      "T-ball cousin. Kick off a cone; partner replaces the ball to freeze runners."
    ],
    [
      "Beat Ball",
      "",
      "Runner vs the ball around the horn."
    ],
    [
      "RPS Rounders",
      "",
      "Meet in the middle, rock-paper-scissors, winner keeps the ball toward the end zone."
    ],
    [
      "Thunderball",
      "",
      "Hit/kick through point-rows of cones."
    ],
    [
      "Team Bowling",
      "",
      "Bowl at your own line of pins. Fetch and go again."
    ],
    [
      "Barkball",
      "",
      "Hit, run to the end line, fielders tag with the ball in hand."
    ],
    [
      "Chuck the Chicken",
      "",
      "Festival closer."
    ],
    [
      "Squirrel’s Tail",
      "",
      "Tails + nuts in the middle. Steal a nut or a tail. Buy a tail back with two nuts. Outdoor G3–6."
    ]
  ]
};

const GLANCE = [
  [
    "September",
    "Soccer · football intro · Terry Fox",
    "16 lessons"
  ],
  [
    "October",
    "Football · circus",
    "16 lessons"
  ],
  [
    "November",
    "Floor hockey",
    "16 lessons"
  ],
  [
    "December",
    "Big-group games",
    "16 lessons"
  ],
  [
    "January",
    "Basketball · scoop",
    "16 lessons"
  ],
  [
    "February",
    "Rope jumping · JR4H",
    "16 lessons"
  ],
  [
    "March",
    "Volleyball · send & receive",
    "16 lessons"
  ],
  [
    "April",
    "Gymnastics",
    "16 lessons"
  ],
  [
    "May",
    "Track and Field prep",
    "16 lessons"
  ],
  [
    "June",
    "Track Day (Week 1) · baseball",
    "16 lessons"
  ]
];
if (typeof window !== "undefined") {
  window.PE = { months, MONTH_GAMES, GLANCE };
}
if (typeof module !== "undefined") module.exports = { months, MONTH_GAMES, GLANCE };
