/* Top big-group games sprinkled across the year.
   Sport units use the real ball. Foam balls are for dodgeball only. */
window.BG30_MONTH = {
  September: [
    ["Steal the Bacon", "", "Two numbered lines. Called numbers run for a ball or beanbag ‘bacon.’ Soft tag only."],
    ["Pulse Race", "", "Two sitting lines. Squeeze travels down. Last player grabs a ball."],
    ["Ten-Second Tag", "", "Tagged players count to 10 while stretching, then re-enter."]
  ],
  October: [
    ["Low-ball", "", "Foam only, below the waist. A hit is a 10-second stretch, then back in."],
    ["Guard the Cone", "", "Three defenders hold hands around a cone. Attackers pass a soccer or playground ball to knock it."],
    ["Steal the Bacon", "", "Use a football as the bacon."]
  ],
  November: [
    ["Protect the King", "", "One player is the king in a hoop. If you throw at the king, switch to foam dodgeballs."],
    ["Guard the Cone", "", "Basketball or playground ball to knock the cone."]
  ],
  December: [
    ["Pulse Race", "", "Cooperative closer with sticks parked."],
    ["Ten-Second Tag", "", "Sticks away first."]
  ],
  January: [
    ["Low-ball", "", "Foam dodgeball send day. See also the Dodgeball page."],
    ["Protect the King", "", "Hockey shape: pass a puck or hockey ball to knock a pin beside the king — do not throw at the person."]
  ],
  February: [
    ["Ten-Second Tag", "", "Cardio closer after rope or hoop."]
  ],
  March: [
    ["Pulse Race", "", "Hands on the chute edge, or sitting lines if the chute is away."]
  ],
  April: [
    ["Ten-Second Tag", "", "Walk-tag. Quiet feet. Shape-hold instead of a stretch if you want a gymnastic closer."]
  ],
  May: [
    ["Steal the Bacon", "", "Outdoor if you can. Football or beanbag."],
    ["Pulse Race", "", "Track-side cooperative starter."]
  ],
  June: [
    ["Steal the Bacon", "", "Festival closer. T-ball or beanbag as the bacon."]
  ]
};

window.BG30_DETAILS = [
  {
    name: "Steal the Bacon",
    months: ["September", "October", "May", "June"],
    purpose: "React to a number. Grab a ball or beanbag, not a person.",
    equipment: "One ball or beanbag.",
    setup: "Two teams sit or stand on opposite lines, numbered so each number has a match.",
    play: [
      "Call a number. Those two players run to the object in the middle.",
      "The one who picks it up tries to carry it home. The other may soft-tag.",
      "A fair tag before the line means the bacon goes back. A safe carry is a point.",
      "Call two numbers at once in later rounds."
    ],
    g12: "Walk. Beanbag bacon. Teacher stands at the object.",
    g34: "Jog. One ball.",
    g56: "Football hike to start. Two bacons.",
    safety: "No diving on the object. Soft tag on the back or shoulder."
  },
  {
    name: "Pulse Race",
    months: ["September", "December", "March", "May"],
    purpose: "Pass a squeeze, then a fair race for a ball.",
    equipment: "A coin or coloured card, one ball.",
    setup: "Two sitting lines, hands on neighbours’ shoulders or holding hands.",
    play: [
      "Players look away from the start. The teacher squeezes the first shoulder on one or both lines.",
      "The squeeze travels to the last player, who stands, runs, and grabs the ball.",
      "Reset. Switch who sits at the end."
    ],
    g12: "Eyes open. Teacher talks through the squeeze.",
    g34: "Eyes closed at the start.",
    g56: "Two pulses. First fair grab wins the round.",
    safety: "Sit with space. No yanking arms."
  },
  {
    name: "Guard the Cone",
    months: ["October", "November"],
    purpose: "Pass to a target while a small ring of defenders holds space.",
    equipment: "One cone, one soccer or playground ball.",
    setup: "Three defenders hold hands in a small circle around a cone. Attackers around the outside.",
    play: [
      "Attackers pass and try to knock the cone with the ball.",
      "Defenders block with their bodies and feet — no pushing, no kicking people.",
      "When the cone falls, rotate three new defenders."
    ],
    g12: "Roll only. Teacher is a fourth defender.",
    g34: "Pass before a shot.",
    g56: "Must use the weaker foot or hand for one round.",
    safety: "No charging the circle."
  },
  {
    name: "Low-ball",
    months: ["October", "January"],
    purpose: "Send a foam dodgeball below the waist. A hit is a stretch, not an out.",
    equipment: "4–6 foam balls, centre line.",
    setup: "Two halves. Foam only — this is a dodgeball game.",
    play: [
      "Throw or roll below the waist.",
      "A hit means a 10-second stretch on the sideline, then back in.",
      "A catch is a save. The thrower stretches instead.",
      "A high ball is dead."
    ],
    g12: "Roll only.",
    g34: "Underhand or bounce-throw.",
    g56: "Must pass once before a throw at a person.",
    safety: "Foam only. No head or chest."
  },
  {
    name: "Protect the King",
    months: ["November", "January"],
    purpose: "Guard a teammate or a pin. Decide whether this is a pass game or a dodgeball.",
    equipment: "One football, basketball, or hockey ball; pinnies. Foam dodgeballs only if you throw at a person.",
    setup: "King stands in a hoop. Teammates form a loose shield.",
    play: [
      "Sport version: attackers pass and try to knock a pin beside the king. Do not throw at the king.",
      "Dodgeball version: switch to foam balls. A below-waist hit on the king ends the round.",
      "Defenders block with hands — no pushing the king.",
      "Rotate the king every minute."
    ],
    g12: "Pin only. Roll.",
    g34: "Pin or sport-ball pass.",
    g56: "Must pass before a shot at the pin.",
    safety: "If the ball is thrown at a person, use foam dodgeballs and stay below the waist."
  },
  {
    name: "Ten-Second Tag",
    months: ["September", "December", "February", "April"],
    purpose: "Fast tag with no one sitting the period out.",
    equipment: "Optional pinnies for 2–4 taggers.",
    setup: "Gym boundaries. Teach the freeze signal.",
    play: [
      "Soft two-finger tag on the back or shoulder.",
      "Tagged players freeze, count to 10 out loud while stretching, then re-enter.",
      "Rotate taggers every 45–60 seconds."
    ],
    g12: "Walk-jog. Teacher is a second tagger if needed.",
    g34: "Jog. Students lead the stretch.",
    g56: "Skip or side-slide rounds.",
    safety: "No head tags. Cap at 5 minutes as a warm-up."
  }
];
