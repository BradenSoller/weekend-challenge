const express = require('express');
const app = express();
let PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static('server/public'));

// Global variable that will contain all of the
// calculation objects:
let calculations = [];
  console.log(calculations)
  
// function orderOfOperations(cal) {
//     if (cal.operator === "+") {
//      result.push (cal.result = cal.numOne + cal.numTwo)
//     } else if (cal.operator === "-") {
//       cal.result = cal.numOne - cal.numTwo
//     } else if (cal.operator === '/') {
//       cal.result = cal.numOne / cal.numTwo
//     } else if (cal.operator === '*') {
//        cal.result = cal.numOne * cal.numTwo
//     }
// }
function orderOfOperations(numOne, numTwo, operation) {
  console.log('ran orderOfOperations()');
  console.log('numOne: ', numOne);
  console.log('numTwo: ', numTwo);
  console.log('operation: ', operation);

  if (operation === "/")
    return parseInt(numOne) / parseInt(numTwo)
  else if (operation === '+')
    return parseInt(numOne) + parseInt(numTwo)
  else if (operation === "-")
    return parseInt(numOne) - parseInt(numTwo)
  else if (operation === "*")
    return parseInt(numOne) * parseInt(numTwo)
}

// Here's a wonderful place to make some routes:

// GET /calculations
app.get('/calculations', (req, res) => {
  console.log('GET request received!',calculations);
  console.log('req.body: ', req.body);
  res.send(calculations);
});
// POST /calculations
app.post('/calculations', (req, res) => {
  console.log('POST request received!');
  console.log('req.body in POST, req.body:', req.body);
  let newCalculations = req.body;
  orderOfOperations(newCalculations)
  // let calculated = orderOfOperations(req.body.numOne, req.body.numTwo, req.body.operator);
  // console.log('calculated: ', calculated);
  // calculations.push(calculated)
  // res.sendStatus(201)
  // res.send(calculations)
  res.sendStatus(201)
})

// PLEASE DO NOT MODIFY ANY CODE BELOW THESE BEARS:
// 🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸

// Makes it so you don't have to kill the server
// on 5000 in order to run the tests:
if (process.env.NODE_ENV === 'test') {
  PORT = 5000;
}

// This starts the server...but also stores it in a variable.
// This is weird. We have to do it for testing reasons. There
// is absolutely no need for you to reason about this.
const server = app.listen(PORT, () => {
  console.log('server running on: ', PORT);
});

// server.setTimeout(500)

// This is more weird "for testing reasons" code. There is
// absolutely no need for you to reason about this.
app.closeServer = () => {
  server.close();
}

app.setCalculations = (calculationsToSet) => {
  calculations = calculationsToSet;
}

module.exports = app;
