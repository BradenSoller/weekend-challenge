const briefPause = require('./briefPause.js')


// Mock the axios function:
let axios = jest.fn(async (axiosArgument) => {
  const requestTimestamp = Date.now()

  const requestMethod = axiosArgument.method.toUpperCase()
  
  // Take conditional action based on request method:
  if (requestMethod === 'POST') {
    const { numOne, numTwo, operator } = axiosArgument.data
    const calculation = {
      numOne: Number(numOne),
      numTwo: Number(numTwo),
      operator
    }
    
    switch (operator) {
      case '+':
        calculation.result = calculation.numOne + calculation.numTwo;
        break;
      case '-':
        calculation.result = calculation.numOne - calculation.numTwo;
        break;
      case '*':
        calculation.result = calculation.numOne * calculation.numTwo;
        break;
      case '/':
        calculation.result = calculation.numOne / calculation.numTwo;
        break;
      default:
        break
    }
    
    axios.testData.push(calculation)

    await briefPause(150)

    return Promise.resolve({
      axiosWasCalledWith: axiosArgument,
      status: 201,
      requestMethod,
      requestTimestamp,
      responseTimestamp: Date.now()
    })
  } else if (requestMethod === 'GET') {
    await briefPause(10)

    return Promise.resolve({
      axiosWasCalledWith: axiosArgument,
      status: 200,
      data: axios.testData,
      requestMethod,
      requestTimestamp,
      responseTimestamp: Date.now()
    })
  }
})

axios.testData = []

module.exports = axios
