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
        let cards = kicker(one) 
            cards.sort()
          val = cards[cards.length -1] + one +cards[cards.length -2]+ cards[cards.length -3]
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
 
 