let tarifeckwerte = { //Grund-freibetrag, Betrag Ende 1. lineare progr. Zone, Betrag Ende 2. lineare progr. Zone, Betrag Ende Proportionalzone
    "2009": [7834, 13139, 52551, 250400],
    "2010": [8004, 13469, 52881, 250730],
    "2011": [8004, 13469, 52881, 250730],
    "2012": [8004, 13469, 52881, 250730],
    "2013": [8130, 13469, 52881, 250730],
    "2014": [8354, 13469, 52881, 250730],
    //Ab 2015 sollte die Berechnung korrekt sein, davor gibt es Abweichungen, da manche Werte vorher auf 0 statt auf 2 Nachkommastellen gerundet wurden
    "2015": [8472, 13469, 52881, 250730],
    "2016": [8652, 13669, 53665, 254446],
    "2017": [8820, 13769, 54057, 256303],
    "2018": [9000, 13996, 54949, 260532],
    "2019": [9168, 14254, 55960, 265326],
    "2020": [9408, 14532, 57051, 270500],
    "2021": [9744, 14753, 57918, 274612],
    "2022": [10347,	14926, 58596, 277825]
}

//Hebesätze wurden seit 2009 nicht geändert
let hebesatzLinProgZone1 = 1400
let hebesatzLinProgZone2 = 2397
let spitzensteuersatz = 0.42
let reichensteuersatz = 0.45

function zone2(te, zve) {
  let linprog1factor = (5000 * (hebesatzLinProgZone2 - hebesatzLinProgZone1) / (te[1] - te[0])).toFixed(2)
  let y = (zve - te[0]) / 10000
  return (linprog1factor * y + hebesatzLinProgZone1) * y
}

function zone3(te, zve) {
  let linprog2factor = (5000 * (10000 * spitzensteuersatz - hebesatzLinProgZone2) / (te[2] - te[1])).toFixed(2)
  let y = (zve - te[1]) / 10000
  return zone2(te, te[1]) + (linprog2factor * y + hebesatzLinProgZone2) * y
  
}

function zone4(te, zve) {
  return zone3(te, te[2]) + spitzensteuersatz * (zve - te[2])
}

function zone5(te, zve) {
  return zone4(te, te[3]) + reichensteuersatz * (zve - te[3])
}

function einkommensteuer(year, zve) {
  if (!(year in tarifeckwerte))
    return -1;
  let te = tarifeckwerte[year]
  if (zve <= te[0])
    return 0 // Zone 1: 0€
  if (zve <= te[1])
    return Math.floor(zone2(te, zve))
  if (zve <= te[2])
    return Math.floor(zone3(te, zve))
  if (zve <= te[3])
    return Math.floor(zone4(te, zve))
  return Math.floor(zone5(te, zve))
}

function einkommensteuer_splitting(year, zve) {
  return 2 * einkommensteuer(year, zve / 2)
}

function grenzsteuersatz(year, zve) {
  return (einkommensteuer(year, zve + 100) - einkommensteuer(year, zve)) / 100
}

function grenzsteuersatz_splitting(year, zve) {
  return (einkommensteuer_splitting(year, zve + 100) - einkommensteuer_splitting(year, zve)) / 100
}

function test() {
  let year = 2020
  let zve = -80000
  console.log('Einzelveranlagung: ', einkommensteuer(year, zve))
  console.log('Grenzsteuersatz Einzel: ', grenzsteuersatz(year, zve))
  console.log('Splitting: ', einkommensteuer_splitting(year, zve))
  console.log('Grenzsteuersatz Splitting: ', grenzsteuersatz_splitting(year, zve))
}
