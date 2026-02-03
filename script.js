
// Correct answers for each field
var step1Integer;
var step1Fraction;
var step2;
var step3Sign;
var step3Exponent;
var step3Fraction;
var step4;



function newQuestion() {

    // Clear input boxes
    clearInputBox("step1Integer", '');
    clearInputBox("step1Fraction", '');
    clearInputBox("step2", '');
    clearInputBox("step3Sign", ''); 
    clearInputBox("step3Exponent", '');
    clearInputBox("step3Fraction", '');
    clearInputBox("step4", '');


    // 32 random bits
    //const bits = Array.from({length: 32}, () => Math.floor(Math.random() * 2));
    //const bits = [1,  1,0,0,0, 0,0,1,1,  0,0,0,1, 1,0,1,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0];
    
    const signBit = [Math.floor(Math.random() * 2)];
    const exponentValue = 127 + Math.floor(Math.random() * 5) - 2; // bias + [-2,2]
    const exponentBits = exponentValue.toString(2).padStart(8, '0').split('').map(Number);
    const fractionBits = generateArray(23, 3);
    const bits = signBit.concat(exponentBits).concat(fractionBits);
    
    // Get the correct answer for each step

    // Step 4
    step4 = bits;  
    
    // Step 3
    step3Sign = bits[0];
    step3Exponent = bits.slice(1, 9);
    step3Fraction = bits.slice(9);

    // Step 2
    // Subtract 127 bias from exponent
    const unbiasedExponent = (parseInt(step3Exponent.join(''), 2)-127); 

    // Add leading 1 back to start
    var fullFraction = [1].concat(step3Fraction);
    // Insert "." to fraction at index exponent
    //const step2 = fullFraction;

    step2 = fullFraction.toSpliced(unbiasedExponent+1, 0, ".");


    // Step 1
    // Split on the "."
    if (unbiasedExponent >= 0) {
        step1Integer = fullFraction.slice(0, unbiasedExponent+1);
        step1Fraction = fullFraction.slice(unbiasedExponent+1);
    } else {
        // For negative exponent, integer part = 0, fraction has leading zeros
        step1Integer = [0];
        step1Fraction = new Array(-unbiasedExponent-1).fill(0).concat(fullFraction);
    }


    // Convert arrays to strings
    step1Integer = step1Integer.join('');
    step1Fraction = step1Fraction.join('');
    step2 = step2.join('');
    step3Sign = String(step3Sign);
    step3Exponent = step3Exponent.join('');
    step3Fraction = step3Fraction.join('');
    step4 = step4.join('');


    // Get decimal answer
    let fractionDecimal = step1Fraction.split('').reduce((sum, digit, i) => sum + digit * 2 ** -(i + 1), 0);  // cursed af but it works
    fractionDecimal = Number(fractionDecimal); 

    let integerDecimal = parseInt(step1Integer, 2);
    if (integerDecimal == "") integerDecimal = "0"; 

    let answerDecimal = String(integerDecimal) + String(fractionDecimal).slice(1);

    // Negative
    if (step3Sign == 1) answerDecimal *= -1;

    // Display
    document.getElementById("decimal").textContent = answerDecimal;

    console.log("Bits:")
    console.log(bits);
    console.log("Step 4");
    console.log(step4);
    console.log("Step 3");
    console.log(step3Sign);
    console.log(step3Exponent);
    console.log(step3Fraction);
    console.log("Step 2");
    console.log(step2);
    console.log("Step 1");
    console.log(step1Integer, step1Fraction);
    console.log("Answer");
    console.log(answerDecimal);

}

function checkAnswers() {
    // These are the entire object, the .value attribute contains the answer
    checkAnswer("step1Integer", step1Integer);
    checkAnswer("step1Fraction", step1Fraction);

    checkAnswer("step2", step2);

    checkAnswer("step3Sign", step3Sign);
    checkAnswer("step3Exponent", step3Exponent);
    checkAnswer("step3Fraction", step3Fraction);

    checkAnswer("step4", step4);

}

function showAnswers() {
    checkAnswers();

    setInputBox("step1Integer", step1Integer);
    setInputBox("step1Fraction", step1Fraction);

    setInputBox("step2", step2);

    setInputBox("step3Sign", step3Sign); 
    setInputBox("step3Exponent", step3Exponent);
    setInputBox("step3Fraction", step3Fraction);

    setInputBox("step4", step4);

}

function setInputBox(element, value) {
    document.getElementById(element).value = value;
}

function clearInputBox(element, value) {
    let object = document.getElementById(element);
    object.value = value;
    object.classList.replace("correct", "neutral") || object.classList.replace("incorrect", "neutral")
}

function checkAnswer(userInputID, correctInput) {
    // These are the entire object, the .value attribute contains the answer
    let userInput = document.getElementById(userInputID);

    let isCorrect = compareInputWithAnswer(userInput.value, correctInput);

    // Replace .neutral or .incorrect with .correct, whatever exists
    if (isCorrect) userInput.classList.replace("neutral", "correct") || userInput.classList.replace("incorrect", "correct");
    // Replace with .incorrect
    else userInput.classList.replace("neutral", "incorrect") || userInput.classList.replace("correct", "incorrect");

}

function compareInputWithAnswer(input, answer) {
    if (input == '') return false;

    // Remove spaces
    input = input.replace(/\s+/g, '');  

    // Remove trailing 0's
    if (input.length != 1) input = input.replace(/0+$/g, '');  // != 1 because "0" for sign bit gets trimmed
    if (answer.length != 1)answer = answer.replace(/0+$/g, '');

    result = (input == answer);
    return result;
}

function generateArray(n, k) {
  const arr = [];
  
  // First k elements: random 0 or 1
  for (let i = 0; i < k; i++) {
    arr.push(Math.floor(Math.random() * 2));
  }
  
  // Remaining elements: 0
  for (let i = k; i < n; i++) {
    arr.push(0);
  }
  
  return arr;
}

// Start first question
newQuestion();