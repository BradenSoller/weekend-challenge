const express = require('express');
const app = express();
let PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static('server/public'));

//array to store math
let calculations = [];
 
//doing the math
function orderOfOperations(numOne, numTwo, operator) {
  console.log('ran orderOfOperations()');//
  console.log('numOne: ', numOne);
  console.log('numTwo: ', numTwo);
  console.log('operation: ', operator);

  if (operator === "/")
    return Number(numOne) / Number(numTwo)
  else if (operator === '+')
    return Number(numOne) + Number(numTwo)
  else if (operator === "-")
    return Number(numOne) - Number(numTwo)
  else if (operator === "*")
    return Number(numOne) * Number(numTwo)
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
  console.log('Post request recieved');
  let newCalculation = req.body
  console.log(newCalculation);
  //puts data in array
  calculations.push(newCalculation)

//gets the last object property
let newAnwser = calculations[calculations.length-1];

//MATH!!!!!!
newAnwser.result = orderOfOperations(newAnwser.numOne, newAnwser.numTwo, newAnwser.operator);

console.log('expected result', newAnwser.result);
console.log('calulation Arr', calculations);

  res.sendStatus(201)
});

// PLEASE DO NOT MODIFY ANY CODE BELOW THESE BEARS:
// 🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸

// Makes it so you don't have to kill the server
// on 5000 in order to run the tests:
if (process.env.NODE_ENV === 'test') {
  PORT = 5001;
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
