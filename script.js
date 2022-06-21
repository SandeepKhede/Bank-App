'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;
 
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
 
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}💲</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov) => acc + mov,0);
  labelBalance.textContent = `${acc.balance} 💲`
}


//displaying summary at the bottom
const calcDisplaySummary = function (acc){
  const income = acc.movements.filter(mov => mov > 0).reduce((acc,mov) => acc + mov,0)
  labelSumIn.textContent = `${income}💲`
  const out = acc.movements.filter(mov => mov<0).reduce((acc,mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}💲`
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate)/100 )
  //here we giving interset only atleast 1%
  .filter((int,i,arr) =>{
    
    return int >=1;
  })
  .reduce((acc,int)=> acc + int,0);
  labelSumInterest.textContent = `${interest}💲`
} 



//creating username
const createUsernames = function (accs){
  accs.forEach(function(acc){
    //adding username to array
    acc.username = acc.owner.toLocaleLowerCase().split(" ").map(name => name[0]
      ).join("");
  })

  
}
createUsernames(accounts);

const updateUI = function(acc){
  
    //DISPLAY MOVEMENTS
    displayMovements(acc.movements);

    //DISPLAY balance
    calcDisplayBalance(acc);

    //Display summary
    calcDisplaySummary(acc);
}

//EVENT HANDLE

let currentAcccount;
btnLogin.addEventListener('click' , function(e){
  e.preventDefault();
  currentAcccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if(currentAcccount?.pin === Number(inputLoginPin.value)){
    //display UI AND MESSAGES
    labelWelcome.textContent = `Welcome Back , ${currentAcccount.owner.split(' ')[0]}`;
    containerApp.style.opacity= 100;

    //Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //display & update UI
    updateUI(currentAcccount);
  }
})

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  )
  inputTransferAmount.value = inputTransferTo.value = '';
  if(
    amount > 0 &&
    receiverAcc &&
    currentAcccount.balance >= amount &&
    receiverAcc?.username != currentAcccount.username
  ) {
    currentAcccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI
    updateUI(currentAcccount);
  }
})

btnLoan.addEventListener('click' , function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if( amount > 0 && currentAcccount.movements.some(mov => mov >= amount * 0.1)){
    // Add movement
    currentAcccount.movements.push(amount);
    // Update UI
    updateUI(currentAcccount);

  }
  inputLoanAmount.value='';
})

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if(
    inputCloseUsername.value === currentAcccount.username &&
    Number(inputClosePin.value) === currentAcccount.pin
  ){
    const index = accounts.findIndex(
      acc => acc.username === currentAcccount.username
    );
    console.log(index);

    // delete acccount
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;
btnSort.addEventListener('click' ,function(e){
  e.preventDefault();
  
  displayMovements(currentAcccount.movements, !sorted);
  sorted = !sorted;
})


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
const movementstoUSD = movements.map(function(mov){
  return mov * eurToUsd;
});


const movementstoUSD1 = movements.map(mov => mov * eurToUsd);


/////////////////////////////////////////////////

const movementDescription = movements.map(
  (mov,i) => 
  `Movement ${i+1} : You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
  
);



const deposits = movements.filter(function(mov){
  return mov > 0;
});


const withdrawals = movements.filter(mov => mov < 0);



const balance = movements.reduce(function(acc,curr,i,arr){
  return acc+curr;
},0)




const totalDepositsUSD = movements.filter(mov => mov >0).map((mov => mov * eurToUsd)).reduce((acc,mov) => acc + mov,0);
