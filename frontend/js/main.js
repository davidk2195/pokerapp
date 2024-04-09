document.querySelector('#Start').addEventListener('click', setUp)
const bets = document.querySelectorAll('.bet')
document.querySelector('#call').addEventListener('click',call)
document.querySelector('#fold').addEventListener('click', fold)
document.querySelector('#check').addEventListener('click', check)
document.querySelector('#reset').addEventListener('click', reset)
bets.forEach(element => {element.addEventListener('click', bet)
  
});
 
function reset(){ //reset bank roll
  localStorage.setItem('pBankRoll',5000)
  localStorage.setItem('cBankRoll',5000)
}

 let cbet = 0,
  pbet = 0,
  deck,
  turn,
 phase=['prebet','flop','turn','river','compare'];
  if (!localStorage.getItem('pBankRoll')){
    localStorage.setItem('pBankRoll',5000)
    localStorage.setItem('cBankRoll',5000)
  }
  
  
  async function setUp(){
    document.querySelector('#Start').classList.add("hidden")//turning start off

    let pBankRoll= localStorage.getItem('pBankRoll'), //setting up bank rolls
        cBankRoll= localStorage.getItem('cBankRoll');
        document.querySelector("#Computermoney").innerHTML=cBankRoll
        document.querySelector("#Playermoney").innerHTML=pBankRoll
        document.querySelector("#main").innerHTML=0

    try { //getting deck object from server
      const res = await fetch("https://pokerbackend.onrender.com/api");
      const data = await res.json();
      deck= data;  
      console.log(deck);
    } catch (error) {
      console.log(`error ${err}`);
    }
    //adding methods to deck object

   
    deck.shuffle= () => {
      let shuffled = deck.originalDeck
      .map(object => ({ object, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ object }) => object)
      return deck.shuffleDeck=shuffled
      }

    deck.deal= () => {

      if (deck.shuffleDeck.length>0){
          for (let i=0; i<4;i++){
              if((i%2==0)||i==0) {
              deck.playerHand.push(deck.shuffleDeck.shift())
              }else{
              deck.computerHand.push(deck.shuffleDeck.shift())
          }};
          for (let i=0; i<8;i++){
              if (i==0 || i==4 || i==7){
                  deck.shuffleDeck.shift()
              }else{
                  deck.communityhand.push(deck.shuffleDeck.shift())}
      }}};
    deck.newDeck= ()=> {
      return deck.shuffleDeck = deck.originalDeck
    }
    deck.deckCount= ()=> {
      return deck.shuffleDeck.length
    }
//setting up field 

  deck.newDeck()
  deck.shuffle()
  deck.deal()
  document.querySelector('#pcard1').src=deck.playerHand[0]['image']//dealing player cards
  document.querySelector('#pcard2').src=deck.playerHand[1]['image']
  document.querySelector('#ccard1').src=deck.computerHand[0]['cover']
  document.querySelector('#ccard2').src=deck.computerHand[1]['cover']
  
  document.querySelector('#check').classList.toggle("hidden") //turning on betting phase
  document.querySelector('#bet').classList.toggle("hidden")
  document.querySelector('#fold').classList.toggle("hidden")
   document.querySelector('#moneycontainer').classList.toggle("hidden") 
  //initiate phase
  turn='prebet'
  }

  function bet(){
    let pbet = Number(document.querySelector('#money').value),
    mainPot = Number(document.querySelector('#main').innerHTML),
    playerMoney=Number(document.querySelector("#Playermoney").innerHTML);
    if (cbet){ //reraise computer bet
      if (pbet==null){
        alert('must raise something')
      }
      pbet= pbet + cbet,
      playerMoney= playerMoney - pbet,
      mainPot = mainPot +pbet,
      pbet=0,
      cbet=0;
      computer()
    }
    else{
      if (pbet==0){
      alert('must bet something')
    }else{
      if (turn === 'compare'){
      }else {
      turn = phase[phase.indexOf(turn) + 1] //dictate turn phase
      }
      playerMoney=playerMoney-pbet //betting for first time
      document.querySelector('#Playermoney ').innerHTML= playerMoney
      document.querySelector('#main').innerHTML= mainPot + pbet
      computer()
    }}

  }
          
  function computer(){
    let move = Math.random(),
    pbet = Number(document.querySelector('#money').value),
    mainPot = Number(document.querySelector('#main').innerHTML) || 0,
    playerMoney = Number(document.querySelector('#Playermoney ').innerHTML),
    computerMoney = Number(document.querySelector('#Computermoney').innerHTML),
    computerhand =deck.computerHand,
    playerhand= deck.playerHand,
    center=deck.communityhand;
    
    if (playerMoney==0){ //player goes all in condition
      turn = phase[phase.length-1]
      let flip = Math.random();
      if (flip <= .50){
        cbet = pbet;  //money going into pot
        mainPot=mainPot +cbet
        document.querySelector('#main').innerHTML= mainPot
        computerMoney=computerMoney-cbet
        document.querySelector('#Computermoney').innerHTML = computerMoney
        document.querySelector('h4').innerHTML= `Computer calls ${cbet}`
        cbet=0
        pbet=0

      document.querySelector('#m1').src=deck.communityhand[0]['image'] //community cards opening
      document.querySelector('#m2').src=deck.communityhand[1]['image']
      document.querySelector('#m3').src=deck.communityhand[2]['image']
      document.querySelector('#m4').src=deck.communityhand[3]['image']
      document.querySelector('#m5').src=deck.communityhand[4]['image']
      
      
      let result= checkBothHands(playerhand,computerhand,center) //game condition to check hands
      if (result == 'tie'){
        playerMoney = playerMoney + mainPot/2
        computerMoney = computerMoney + mainPot/2
        mainPot= mainPot - mainPot
        save(playerMoney,computerMoney)
        alert('tie please start a new game')
        location.reload()
      }else if (result == 'player wins'){
        playerMoney = playerMoney + mainPot
        mainPot= mainPot - mainPot
        document.querySelector('#Start').classList.toggle("hidden")
        save(playerMoney,computerMoney)
        alert('Player wins please start a new game')
        location.reload()
      }else{
        computerMoney = computerMoney + mainPot
        mainPot= mainPot - mainPot
        alert('Player wins please start a new game')
        save(playerMoney,computerMoney)
        document.querySelector('#Start').classList.toggle("hidden")
        location.reload()
      }
      }else{ //otherwise fold all-in
        playerMoney = playerMoney + mainPot
      localStorage.setItem('pBankRoll',playerMoney)
      localStorage.setItem('cBankRoll',computerMoney)
      cbet=0;
      pbet=0;
      console.log(localStorage.getItem('pBankRoll'))
      document.querySelector('#Playermoney ').innerHTML='0'
      document.querySelector('#Computermoney').innerHTML='0'
      document.querySelector('h4').innerHTML= "Computer fold"
      document.querySelector('#Start').classList.toggle("hidden")
      alert("player wins please start a new game")
      location.reload()
      }
    }else { //condition if player doesnt go all in 
        if (move <= .25){ //folding
      playerMoney = playerMoney + mainPot
      localStorage.setItem('pBankRoll',playerMoney)
      localStorage.setItem('cBankRoll',computerMoney)

      cbet=0;
      pbet=0;
      document.querySelector('#Playermoney ').innerHTML='0'
      document.querySelector('#Computermoney').innerHTML='0'
      document.querySelector('h4').innerHTML= "Computer fold"
      document.querySelector('#Start').classList.toggle("hidden")
      alert("player wins please start a new game")
      location.reload()
    }else if (move > .25 & move <= .75){ //calling bet
      cbet = pbet;
      mainPot=mainPot +cbet
      document.querySelector('#main').innerHTML= mainPot
      computerMoney=computerMoney-cbet
      document.querySelector('#Computermoney').innerHTML = computerMoney
      document.querySelector('h4').innerHTML= `Computer calls ${cbet}`
      cbet=0
      pbet=0
      if (turn == phase[phase.length-1]){ //determining phases of turn
        
        document.querySelector('#ccard1').src=deck.computerHand[0]['image'] //opening up computer cards
        document.querySelector('#ccard2').src=deck.computerHand[1]['image']
     
        let result= checkBothHands(playerhand,computerhand,center) //game condition to check hands
        if (result == 'tie'){
          playerMoney = playerMoney + mainPot/2
          computerMoney = computerMoney + mainPot/2
          mainPot= mainPot - mainPot
          save(playerMoney,computerMoney)
          alert('tie please start a new game')
          location.reload()
        }else if (result == 'player wins'){
          playerMoney = playerMoney + mainPot
          mainPot= mainPot - mainPot
          document.querySelector('#Start').classList.toggle("hidden")
          save(playerMoney,computerMoney)
          alert('Player wins please start a new game')
          location.reload()
        }else{
          computerMoney = computerMoney + mainPot
          mainPot= mainPot - mainPot
          alert('Computer wins please start a new game')
          save(playerMoney,computerMoney)
          document.querySelector('#Start').classList.toggle("hidden")
          location.reload()
        }
      }else if (turn == phase[1]){
        document.querySelector('#m1').src=deck.communityhand[0]['image']
        document.querySelector('#m2').src=deck.communityhand[1]['image']
        document.querySelector('#m3').src=deck.communityhand[2]['image']

      }else if (turn == phase[2]){
        document.querySelector('#m4').src=deck.communityhand[3]['image']
      }else{
        document.querySelector('#m5').src=deck.communityhand[4]['image']
      }
    }else{
      let bet= Math.random()
      if (bet<.05){
        cbet= computerMoney
        computerMoney = computerMoney- computerMoney
        document.querySelector('#Computermoney').innerHTML = computerMoney
        document.querySelector('#check').classList.add("hidden") //turning on betting phase
        document.querySelector('#bet').classList.add("hidden")
        document.querySelector('#raise').classList.add("hidden") 
        document.querySelector('#moneycontainer').classList.add("hidden") 
        document.querySelector('.call').classList.toggle("hidden")  
        cbet = cbet;
        document.querySelector('h4').innerHTML= `Computer all-in ${cbet}`
      }else{
        cbet = computerMoney*.25;
        document.querySelector('#main').innerHTML= mainPot + cbet + pbet
        computerMoney=computerMoney-cbet-pbet
        document.querySelector('#Computermoney').innerHTML = computerMoney
        document.querySelector('#check').classList.add("hidden") //turning on betting phase
        document.querySelector('#bet').classList.add("hidden")
        document.querySelector('#raise').classList.toggle("hidden")  
        document.querySelector('.call').classList.toggle("hidden") 
        document.querySelector('h4').innerHTML= `Computer raise ${cbet}`
 
      }
    };
  }
  }

  function fold(){
    let mainPot = Number(document.querySelector('#main').innerHTML),
    playerMoney = Number(document.querySelector('#Playermoney ').innerHTML),
     computerMoney = Number(document.querySelector('#Computermoney').innerHTML);
     computerMoney = computerMoney + mainPot

      let pBankRoll= Number(localStorage.getItem('pBankRoll')),
      cBankRoll= Number(localStorage.getItem('cBankRoll'))
      pBankRoll= pBankRoll + playerMoney,
      cBankRoll= cBankRoll + computerMoney;
      cbet=0;
      pbet=0;
      document.querySelector('#Playermoney ').innerHTML=''
      document.querySelector('#Computermoney').innerHTML=''
      document.querySelector('#Start').classList.toggle("hidden")
      alert("Computer wins please start a new game")
      location.reload()
  }

  function call(){
    computerMoney=Number(computerMoney)
    computerMoney = computerMoney + mainPot;
    pbet = cbet;
    document.querySelector('#main').innerHTML= mainPot + pbet
    playerMoney=playerMoney-pbet
    document.querySelector('.myMoney').innerHTML = playerMoney
    cbet=0
    pbet=0
    document.querySelector('h4').innerHTML= ""
    document.querySelector('#Start').classList.add("hidden")
    if (turn == phase[phase.length-1]){ //determining phases of turn
      let computerhand =deck.computerHand,
      playerhand= deck.playerHand,
      center=deck.communityhand;
      document.querySelector('#ccard1').src=deck.computerHand[0]['image']
      document.querySelector('#ccard2').src=deck.computerHand[1]['image']
      let result= checkBothHands(playerhand,computerhand,center)
      if (result == 'tie'){

        playerMoney = playerMoney + mainPot/2,
        computerMoney = computerMoney + mainPot/2,
        mainPot= mainPot - mainPot;
        alert('tie please start new game')
        save(playerMoney,computerMoney)
        location.reload()
      }else if (result == 'player wins'){
        playerMoney = Number(document.querySelector('#Playermoney ').innerHTML),
        computerMoney = Number(document.querySelector('#Computermoney').innerHTML),
        playerMoney = playerMoney + mainPot,
        mainPot= mainPot - mainPot;
        document.querySelector('#Start').classList.toggle("hidden")
        alert('Player wins please start new game')
        save(playerMoney,computerMoney)
        location.reload()
      }else{
        playerMoney = Number(document.querySelector('#Playermoney ').innerHTML),
        computerMoney = Number(document.querySelector('#Computermoney').innerHTML),
        computerMoney = computerMoney + mainPot,
        mainPot= mainPot - mainPot;
        alert('Computer wins please start new game')
        document.querySelector('#Start').classList.toggle("hidden")
        save(playerMoney,computerMoney)
        location.reload()
      }
    }else if (turn == phase[1]){
      document.querySelector('#m1').src=deck.communityhand[0]['image']
      document.querySelector('#m2').src=deck.communityhand[1]['image']
      document.querySelector('#m3').src=deck.communityhand[2]['image']

    }else if (turn == phase[1]){
      document.querySelector('#m4').src=deck.communityhand[3]['image']
    }else{
      document.querySelector('#m5').src=deck.communityhand[4]['image']
    }
  }
  function check(){
    mainPot = Number(document.querySelector('#main').innerHTML),
    playerMoney = Number(document.querySelector('#Playermoney ').innerHTML),
    computerMoney = Number(document.querySelector('#Computermoney').innerHTML);
    if (turn === 'compare'){
    }else {
    turn = phase[phase.indexOf(turn) + 1]
    }

    if (turn == phase[phase.length-1]){ //determining phases of turn
      let computerhand =deck.computerHand,
      playerhand= deck.playerHand,
      center=deck.communityhand;
      document.querySelector('#ccard1').src=deck.computerHand[0]['image']
      document.querySelector('#ccard2').src=deck.computerHand[1]['image']
      let result= checkBothHands(playerhand,computerhand,center)
      if (result == 'tie'){
        playerMoney = playerMoney + mainPot/2,
        computerMoney = computerMoney + mainPot/2,
        mainPot= mainPot - mainPot;
        alert('tie please  start new game')
        save(playerMoney,computerMoney)
        location.reload()
      }else if (result == 'player wins'){
        playerMoney = playerMoney + mainPot,
        mainPot= mainPot - mainPot;
        document.querySelector('#Start').classList.toggle("hidden")
        alert('Player wins please  start new game')
        save(playerMoney,computerMoney)
        location.reload()
      }else{
        computerMoney = computerMoney + mainPot,
        mainPot= mainPot - mainPot;
        alert('Computer wins please  start new game')
        save(playerMoney,computerMoney)
        document.querySelector('#Start').classList.toggle("hidden")
        location.reload()
      }
    }else if (turn == phase[1]){
      document.querySelector('#m1').src=deck.communityhand[0]['image']
      document.querySelector('#m2').src=deck.communityhand[1]['image']
      document.querySelector('#m3').src=deck.communityhand[2]['image']

    }else if (turn == phase[2]){
      document.querySelector('#m4').src=deck.communityhand[3]['image']
    }else{
      document.querySelector('#m5').src=deck.communityhand[4]['image']
    }
  }

  function save(playerMoney,computerMoney){
  
    localStorage.setItem('pBankRoll',playerMoney)
    localStorage.setItem('cBankRoll',computerMoney)

  }
  /////////////////////////////////////// check values of cards 
  rankObject={ //initialize points for rank value
    'royal flush': 10,
    'straight flush': 9,
    '4 of a kind':8,
    'full house':7,
    'flush':6,
    'straight':5,
    'three of a kind':4,
    'two pair':3,
    'one pair':2,
    'Highcard':1
  };
  
  
  //helper functions 
  function sorted(arr){ //sort array of objects
  let sort = arr
  .map(object => ({ object, sort: object['value'] }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ object }) => object)
  return sort
  }
  
  const count = (arr,key)=>{ //count values of keys
          let obj={};
          for (let i=0 ; i<arr.length ; i++){
        if (!obj[arr[i][key]]) {
          obj[arr[i][key]] = 0;
        }
        obj[arr[i][key]]++;
        
      }
      return obj
  };
  
  const handval =(array)=> array.reduce((accum,next)=> accum + next, 0) //check hand value
  
  const helper= (arr)=>{ //helps to check hand value for straight and flushes 
      if (arr !==false){
          if (arr.length>5){
          let diff=arr.length -5
          while (diff!=0){
              arr.shift()
              diff--
          }
          let val=handval(arr)
          return {result:'',value:val}
          }else if (arr.length==5){
            let val=handval(arr)
              return {result:'',value:val}
          }}else{
              return false
          }
  }
  
  //hands checks
   
  function containsFlush(arr){ //check if hand contains a flush
          let obj= count(arr,'suit'),
          flush=[];
          const key = `${Object.keys(obj).find(key => obj[key] >=5)}`;
          if (!key){
              return false 
          }else{
          let flushes = arr.filter((object) => object['suit'] ==key);
          for (let i=0 ; i <flushes.length;i++){
              flush.push(flushes[i]['value'])
          }};
          return flush
      }
       
      function containsStraight(arr){ //check hand if it contains a straight
          let straight=[]
          for (i=1 ; i<arr.length ; i++){
             if (arr[i].value== arr[i-1].value + 1){
              straight.push(arr[i-1].value)
             }};
        
             if (arr[arr.length-1].value == straight[straight.length-1] +1){
              straight.push(arr[arr.length-1].value)
             }
             if (straight.length>=5){
                 return straight
             }else{
                 return false 
             }
         }
      
  function isStraightFlush(str, fsh){ //check if its a straight
      let firstResult,
      straight= str;
      const content = (smallarray, largearr) => smallarray.every(val =>largearr.includes(val));//check if array small is in array large
      
     
      const  checkStrFsh= (str,fsh)=>{ //helper function to return results
          let equal= content(str,fsh)
          if (equal){
            let outcome= helper(straight)
            if (outcome.value==60){
              outcome.result='royal flush'
            }else{
              outcome.result='straight flush'
            }
            return outcome
        }else{
            return false
        }
      }
  
  
        if (str!==false && fsh !==false){ //conditions to check straight flushes
          if(str.length=== fsh.length){
             return firstResult=checkStrFsh(str,fsh)
             
             }else if (str.length< fsh.length){
               return firstResult=checkStrFsh(str,fsh)
             }else {
              return firstResult=checkStrFsh(fsh,str)
             }
          
      }else{
          return false
      }
      };
  
  function isFlush(fsh){
  let outcome = helper(fsh)
  if (outcome){
      outcome.result='flush'
      return outcome
  }else{
      return false
  }
  }
  function isStraight(str){
      let outcome = helper(str)
      if (outcome){
          outcome.result='straight'
          return outcome
      }else{
          return outcome
      }
      }
   
      function repeatedValues(arr){//check for 4 of kinds, full house,3 of a kind, 2 pair, 1pair , highcard
        let obj= count(arr,'value');
        const kicker= (val)=> player.filter(element => element !=val);
         const key =(val)=> {
          return Object.keys(obj).find(key => obj[key] == val);
     }
            let player=[],
            four = Number(key(4)),
            three= Number(key(3)),
            two = Number(key(2)),
            secondtwo = Object.keys(obj).find(key => obj[key] == 2 && key !=two);
            
            for (let i=0 ; i <arr.length;i++){
              player.push(arr[i]['value'])
          };
  
        if (four){
          if(player.includes(four)){
            let cards=kicker(four)
            val = cards[cards.length-1] + four*4
            return result = {result:'4 of a kind',value:val}
          }
        }else if ((isNaN(three) ==false  &&  isNaN(two) == false)){
          console.log(isNaN(three) && isNaN(two))
          let val =three*3 + two*2
          return {result:'full house',value:val}
        }else if (three){
              let remainingCards = kicker(three),
            val = three*3+ remainingCards[remainingCards.length-1]+ remainingCards[remainingCards.length-2];
            return {result:'three of a kind',value:val}
        }else if (secondtwo){
              remainingCards = player.filter(element => element !=two && element !=secondtwo),
            val = two*2 + secondtwo *2+ remainingCards[0];
            return {result:'two pair',value:val}
        }else if (two){
          let cards = kicker(two) 
              cards.sort()
            val = cards[cards.length -1] + two*2 +cards[cards.length -2]+ cards[cards.length -3]
            return {result:'one pair',value:val}
        }else{
          let overallCards= player;
          overallCards.shift()
          overallCards.shift()
          const val = handval(overallCards)
          return {result:'Highcard',value:val}
        }
      }
   
    function overallHand(arr,center){
      let hand=[]
         hand = sorted(arr.concat(center)), //initializing variables 
         str=containsStraight(hand),
         fsh=containsFlush(hand),
         straightFlush= isStraightFlush(str, fsh),
         flush = isFlush(fsh),
         straight = isStraight(str),
         repeated = repeatedValues(hand)
         if (straightFlush !==false){
          return straightFlush
         }else if (repeated.result=='4 of a kind' && repeated != false ){
          return repeated
         }else if (repeated.result=='full house' && repeated != false ){
          return repeated
         }else if (flush !==false){
          return flush
         }else if (straight !==false){
          return straight
         }else{
          return repeated
         }
  
    }
    function checkBothHands(playerhand,computerhand,center){
      let player = overallHand(playerhand,center),
          computer = overallHand(computerhand,center),
          playerRank= rankObject[player['result']],
          computeRank= rankObject[computer['result']],
          outcome;
          if (playerRank == computeRank){
            if (computer['value'] == player['value'] ){
              return outcome = 'tie'
            }else if (player['value'] < computer['value']){
              return outcome = 'computer wins'
            }else{
              return outcome = 'player wins'
            }
          }else if (playerRank < computeRank){
            return outcome = 'computer wins'
          }else{
            return outcome = 'player wins'
          }
  
  
    }
   
   