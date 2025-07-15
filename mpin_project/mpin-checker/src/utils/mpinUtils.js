const commonPins = [
  '1234', '0000', '1111', '1122', '1212', '7777', '1004',
  '2000', '9999', '4321', '2222', '5555', '2580', '0852'
];

export function analyzeMPIN(mpin, userData) {
  const reasons = [];

  if (commonPins.includes(mpin.slice(0, 4))) {
    reasons.push("COMMONLY_USED");
  }

  const { dob, anniversary, spouseDob } = userData;
  const dateChecks = [
    { key: "DEMOGRAPHIC_DOB_SELF", date: dob },
    { key: "DEMOGRAPHIC_DOB_SPOUSE", date: spouseDob },
    { key: "DEMOGRAPHIC_ANNIVERSARY", date: anniversary }
  ];

  for (let { key, date } of dateChecks) {
    if (!date) continue;
    const [yyyy, mm, dd] = date.split('-');

    const combos = [
      dd + mm, mm + dd, dd + yyyy.slice(2),
      yyyy.slice(2) + dd, mm + yyyy.slice(2)
    ];

    for (let combo of combos) {
      if (mpin.includes(combo)) {
        reasons.push(key);
        break;
      }
    }
  }

  return {
    strength: reasons.length === 0 ? "STRONG" : "WEAK",
    reasons
  };
}
