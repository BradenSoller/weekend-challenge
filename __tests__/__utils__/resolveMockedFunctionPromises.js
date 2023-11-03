// INPUT: A mocked async function's name.
// OUTPUT: An array of resolved Promise objects.
//         Each contains the data that the mocked
//         function was build to return. 
async function resolveMockedFunctionPromises(mockedFn) {
  return await Promise.all(
    mockedFn.mock.results.map(async (result) => {
      return Promise.resolve(result.value)
    })
  )
}

module.exports = resolveMockedFunctionPromises

// More context on this function:

// Functions that've been mocked with Jest keep track of the
// outcome of each call.

//You can access an array of these result objects via
// <mockedFunctionReference>.mock.results!

// Each object in the array looks like one of these
// objects, depending on the call's outcome:
        // { type: 'return', value: <the return value>}
        // { type: 'throw', value: <the thrown error>}
        // { type: 'incomplete', value: undefined}
// Docs here 👉 https://jestjs.io/docs/mock-function-api#mockfnmockresults

// Anywho, our mocked axios function's array of results objects
// looks something like this:
        // [
        //   { type: 'return', value: Promise { [Object] } },
        //   { type: 'return', value: Promise { [Object] } },
        //   { type: 'return', value: Promise { [Object] } }
        // ]
// Therefore, before we can use the actual mocked response data
// for testing purposes, we need to loop through and resolve each
// Promise. This function does that! Nifty!
