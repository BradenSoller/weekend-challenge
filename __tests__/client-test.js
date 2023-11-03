// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// 🔥 DO NOT MODIFY THIS FILE!!!! OR ELSE! 🔥
// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

// Testing Library Stuff:
const { fireEvent, getByText, getByRole, getByPlaceholderText, getByTestId } = require('@testing-library/dom')
require('@testing-library/jest-dom')
const { JSDOM } = require('jsdom')

// File-Reading Stuff:
const fs = require('fs')
const path = require('path')
const html = fs.readFileSync(path.resolve(__dirname, '../server/public/index.html'), 'utf8')
const jsFile = fs.readFileSync(path.resolve(__dirname, '../server/public/scripts/client.js'), 'utf8')

// Nifty Testing Tools, Authored by the Instructors You Know and Love:
const testCalculations = require('./__utils__/testCalculations.js')
const axios = require('./__utils__/axiosMock.js')
const briefPause = require('./__utils__/briefPause.js')
const resolveMockedFunctionPromises = require('./__utils__/resolveMockedFunctionPromises.js')
const e = require('express')

// Holds the jsdom instance that the tests run against:
let container

describe(`Client-Side Tests:`, () => {

  const customOutputOptions = {
    showPrefix: false,
    showMatcherMessage: false
  }

  beforeAll(() => {
    // Keep test output clean by disabling student console.log
    // statements during test output:
    console.log = () => { }
  })

  beforeEach(async () => {
    // Make the DOM:
    dom = new JSDOM(html, { runScripts: 'dangerously' })

    // Reset our axios mock:
    axios.mockClear()

    // Reset the dummy data:
    axios.testData = [...testCalculations]

    // Attach our axios mock to the DOM and execute script.js:
    dom.window.axios = axios
    dom.window.eval(jsFile)

    // Make sure we pause a moment for the axios GET request:
    await briefPause(100)

    // Stashing the DOM's body in a container. This is
    // what we test against:
    container = dom.window.document.body
  })

  it(`Makes one initial GET request upon page load`, async () => {
    expect(axios).toHaveBeenCalledTimes(1) // 👈 just one axios call

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios)
    const requestMethods = mockedAxiosInteractions.map((response) => response.requestMethod)

    expect(requestMethods).toEqual(['GET']) // 👈 method was GET
  })

  it(`A GET request results in the most recent result being rendered inside the recentResult <section>`, () => {
    const recentResultSection = getByTestId(container, 'recentResult')

    // Check if the most recent calculation result is rendered:
    expect(getByText(recentResultSection, /10096/)).toBeInTheDocument()
  })

  it(`A GET request results in the calculation history being rendered inside the resultHistory <section>`, () => {
    const resultHistorySection = getByTestId(container, 'resultHistory')

    // Check if the two test calculations are rendered:
    expect(getByText(resultHistorySection, '10101 + 5 = 10106')).toBeInTheDocument()
    expect(getByText(resultHistorySection, '10101 - 5 = 10096')).toBeInTheDocument()
  })

  it(`A POST request is made when the '=' button is clicked`, async () => {
    // First, we populate the inputs and click an operator.
    // We want this test to work if students write error-handling
    // logic that prevents a bad POST request from happening.

    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    fireEvent.change(numOne, { target: { value: 10 } })
    addButton.click()
    fireEvent.change(numTwo, { target: { value: 10 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios)

    // Confirm that the second HTTP request's method was POST:
    const requestMethods = mockedAxiosInteractions.map((response) => response.requestMethod)
    expect(requestMethods[1]).toBe('POST')
  })

  it(`Addition: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    addButton.click()
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios)
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data

    expect([123, '123']).toContain(sentData.numOne)
    expect([456, '456']).toContain(sentData.numTwo)
    expect(sentData.operator).toBe('+')
  })

  it(`Subtraction: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const minusButton = getByRole(container, 'button', { name: '-' })

    // Populate the inputs and click the '-' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    minusButton.click()
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios)
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data

    expect([123, '123']).toContain(sentData.numOne)
    expect([456, '456']).toContain(sentData.numTwo)
    expect(sentData.operator).toBe('-')
  })

  it(`Multiplication: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const multiplicationButton = getByRole(container, 'button', { name: '*' })

    // Populate the inputs and click the '-' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    multiplicationButton.click()
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios)
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data

    expect([123, '123']).toContain(sentData.numOne)
    expect([456, '456']).toContain(sentData.numTwo)
    expect(sentData.operator).toBe('*')
  })

  it(`Division: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const divisionButton = getByRole(container, 'button', { name: '/' })

    // Populate the inputs and click the '-' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    divisionButton.click()
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios)
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data

    expect([123, '123']).toContain(sentData.numOne)
    expect([456, '456']).toContain(sentData.numTwo)
    expect(sentData.operator).toBe('/')
  })

  it(`Clear: Inputs should be empty after the 'C' button is clicked`, () => {
    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const clearButton = getByRole(container, 'button', { name: 'C' })

    // Populate the inputs and click the '-' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the 'C' button:
    clearButton.click()


    expect(numOne.value).toBe('')
    expect(numTwo.value).toBe('')
  })

  it(`After a successful POST request, the client makes a GET request to fetch the most recent results`, async () => {
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    addButton.click()
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200);

    const raceHint = `
    🔥   🔥   🔥   🔥

Your code is making a GET request
immediately after making the POST request!
It needs to wait for the POST request to finish.
To make this test pass, you'll need
to refactor your code so that the
GET request is 100% guaranteed to 
only be fired off AFTER the POST
request receives its response.
    `

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios)

    // Three HTTP requests should have been made:
    expect(axios).toHaveBeenCalledTimes(3)

    // 1. The initial GET on page load.
    // 2. The POST when the "Add Joke" button is clicked.
    // 3. Another GET after the POST request..
    const requestMethods = mockedAxiosInteractions.map((response) => response.requestMethod)
    expect(requestMethods).toEqual(['GET', 'POST', 'GET'])

    // We need these variables to verify that the POST response arrived before
    // the subsequent GET request was made:
    const postResponseTimestamp = mockedAxiosInteractions[1].responseTimestamp
    const subsequentGetRequestTimestamp = mockedAxiosInteractions[2].requestTimestamp

    expect(postResponseTimestamp, raceHint, customOutputOptions).toBeLessThanOrEqual(subsequentGetRequestTimestamp)

  })

  it(`After a successful POST request, the most recent result is rendered in the recentResult <section>`, async () => {
    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    addButton.click()
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)



    // Check if the correct calculation result is displayed:
    const recentResultSection = getByTestId(container, 'recentResult')
    expect(getByText(recentResultSection, /579/)).toBeInTheDocument()
  })

  it(`After a successful POST request, the calculation history is rendered in the resultsHistory <section>`, async () => {
    // Select the inputs and an operator button:
    const numOne = getByPlaceholderText(container, /First Number/)
    const numTwo = getByPlaceholderText(container, /Second Number/)
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    fireEvent.change(numOne, { target: { value: 123 } })
    addButton.click()
    fireEvent.change(numTwo, { target: { value: 456 } })

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    // Verify that the three calculations are rendered in section.resultHistory:
    const resultHistorySection = getByTestId(container, 'resultHistory')
    expect(getByText(resultHistorySection, '10101 + 5 = 10106')).toBeInTheDocument()
    expect(getByText(resultHistorySection, '10101 - 5 = 10096')).toBeInTheDocument()
    expect(getByText(resultHistorySection, '123 + 456 = 579')).toBeInTheDocument()
  })
})
