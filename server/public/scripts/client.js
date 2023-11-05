//get calculations 
console.log('client.js is sourced!');
let result = 0;
let clickedOperator;

function getHistory() {
    axios({
        method: 'GET',
        url: '/calculations'
    }).then((response) => {
        console.log('Confirmed server recieved form submission.')
        let calculations = response.data
        renderCalulation(calculations)

    });
}

//when submit is pressed    
function handleSubmit(event) {
    event.preventDefault()
    //gets inputs
    let numOne = document.getElementById('numOne').value
    let numTwo = document.getElementById('numTwo').value
    // let operator = event

    //clears inputs 
    document.getElementById('numOne').value = "";
    document.getElementById('numTwo').value = "";

    let calculation = { numOne: numOne, numTwo: numTwo, operator: clickedOperator }

  

    // hey server, take this info pls
    axios({
        method: 'POST',
        url: '/calculations',
        data: calculation
    })
        .then((response) => {
            console.log('Confirmed server recieved form submission.')
            // call info retrieval 
            getCalculations()
            console.log('response: ', response);
           renderCalulation(response.data)
        }).catch((err) => {
            console.error('error caught in axios call, err: ', err);
        });
}

//making operator work
function getOperator(event, operator) {
    console.log('hit getOperator()');
    console.log('event: ', event);
    console.log('operator: ', operator);
    event.preventDefault()
    clickedOperator = operator;
}
//get back calculations from server
function getCalculations() {
    console.log('getCalculations() ran');
    axios({
        method: 'GET',
        url: '/calculations'
    }).then(function (response) {
        console.log('GET response recieved from server! Response:', response);
        let calculations = response.data;
        console.log('Parsing data from response package. Items');
        renderCalulation(calculations)
    })
}

function renderCalulation(calculation) {
    console.log('render');
    let recentResult = document.getElementById('recentResult')
    let resultHistory = document.getElementById('resultHistory')
    recentResult.innerHTML = "";
    resultHistory.innerHTML = "";
    // const domElement = document.getElementById('resultHistory');
    console.log('calculation: ', calculation);
    recentResult.innerHTML =
    `<p>${calculation[calculation.length - 1]} </p>`
    // resultHistory += 

    for (calc of calculation) {
        let ptag = `<p> ${calc.numOne} ${calc.clickedOperator} ${calc.numTwo}= ${calc.result}</p>`
        document.getElementById('resultHistory').innerHTML += ptag
    }
       
    }
    
