
let result = 0;
let operator = '';

function getHistory() {
    axios({
        url: '/calculations',
        method: 'GET'
      }).then((response) => {
        let calculations = response.data 
        renderCalulation(calculations)
        console.log('this data is being rendered', calculations);
                           // axios({
                          //     method: 'GET',
                          //     url: '/calculations'
                          // }).then((response) => {
                          //     console.log('Confirmed server recieved form submission.')
                          //     let calculations = response.data
                          //     renderCalulation(calculations)

    });
}

//when submit is pressed    
function handleSubmit(event) {
    event.preventDefault()
    //gets inputs
    let numOne = document.getElementById('numOne').valueAsNumber
    let numTwo = document.getElementById('numTwo').valueAsNumber
    // let operator = event
    Operation(event)

    //clears inputs 
    document.getElementById('numOne').value = "";
    document.getElementById('numTwo').value = "";
//pushes inputs into the object
    let newCalculation = {
        numOne: numOne,
        operator: operator,
        numTwo: numTwo,
        result: result
    } 

    axios({
        method: 'POST',
        url: '/calculations',
        data: newCalculation
      }).then((response) => {
        console.log('did this work?');
          getHistory()
      })
  } // hey server, take this info pls
    /////axios({
     //////   method: 'POST',
     //////   url: '/calculations',
      ///////  data: newCalculation
   //////// }).then((response) => {
       //////// console.log('Confirmed server recieved form submission.')
        // call info retrieval 
        //////getHistory()
       ///// console.log('response: ',);
        // renderCalulation(response.data)
        // }).catch((err) => {
        //     console.error('error caught in axios call, err: ', err);
        // });
   //////// });
///////}

//making operator work
function Operation(event, op) {
    event.preventDefault()
    if (op === '+') {
        operator = '+'
        console.log(operator);
    } else if (op === '-') {
        operator = '-'
        console.log(operator);
    } else if (op === '*') {
        operator = '*'
        console.log(operator);
    } else if (op === '/') {
        operator = '/'
        console.log(operator);
    }
    return operator;
}
////////function getOperator(event, operator) {
   ////// console.log('hit getOperator()');
   //////// console.log('event: ', event);
   ///////// console.log('operator: ', operator);
   ///////// event.preventDefault()
    //////clickedOperator = operator;
///////}
//get back calculations from server
// function getCalculations() {
//     console.log('getCalculations() ran');
//     axios({
//         method: 'GET',
//         url: '/calculations'
//     }).then(function (response) {
//         console.log('GET response recieved from server! Response:', response);
//         let calculations = response.data;
//         console.log('Parsing data from response package. Items');
//         renderCalulation(calculations)
//     })
// }

    function renderCalulation(calculations) {
        console.log('render');
        let recentResult = document.getElementById('recentResult')
        let resultHistory = document.getElementById('resultHistory')
       
        recentResult.innerHTML = '';
        resultHistory.innerHTML = '';
        // const domElement = document.getElementById('resultHistory');
        console.log('calculation: ', calculations);
        recentResult.innerHTML =
            `<b>${calculations[calculations.length - 1].result} </b>`
        // resultHistory += 

        for (calc of calculations) {
            resultHistory.innerHTML +=
                `<ol>${calc.numOne} ${calc.operator} ${calc.numTwo} = ${calc.result} `
       
        }
    } 
    



getHistory()