
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
  } 

//making operator work
function Operation(event, oper) {
    event.preventDefault()
    if (oper === '+') {
        operator = '+'
        console.log(operator);
    } else if (oper === '-') {
        operator = '-'
        console.log(operator);
    } else if (oper === '*') {
        operator = '*'
        console.log(operator);
    } else if (oper === '/') {
        operator = '/'
        console.log(operator);
    }
    return operator;
}


    function renderCalulation(calculations) {
        console.log('render');
        let recentResult = document.getElementById('recentResult')
        let resultHistory = document.getElementById('resultHistory')
       
        recentResult.innerHTML = '';
        resultHistory.innerHTML = '';
      //gets last object property to appear on DOM
        console.log('calculation: ', calculations);
        recentResult.innerHTML =
            `<h2><b>${calculations[calculations.length - 1].result} </b></h2>`
   //loops through calculations object and shows in on the DOM
        for (calc of calculations) 
            resultHistory.innerHTML +=
                `<ol>${calc.numOne} ${calc.operator} ${calc.numTwo} = ${calc.result}</ol> `
       
        
    } 
    



getHistory()