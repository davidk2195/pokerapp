const http = require('http');
const fs = require('fs')
const url = require('url');
const querystring = require('querystring');
const figlet = require('figlet')

//deck array
let newDeck=[]
let suits = ['h','c','d','s']
let number = [2,3,4,5,6,7,8,9,10,11,12,13,14]

for (let j=0; j<suits.length;j++){
   
    for (let i =0; i<number.length;i++){
        newDeck.push({value:number[i],suit:suits[j],image:`img/${number[i]+ '' + suits[j] }.png`,cover:"img/cover.png"})
    }
}
 

//deck class 
class deckObj{
    constructor(deck){
        this.originalDeck=deck 
        this.shuffleDeck=[]
        this.computerHand=[]
        this.playerHand=[]
        this.communityhand=[]
    }

    shuffle() {
            let shuffled = this.originalDeck
            .map(object => ({ object, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ object }) => object)
            return this.shuffleDeck=this.originalDeck
            }

    deal() {
        let arr=[]
        console.log(this.shuffleDeck.length)
        if (this.shuffleDeck.length>0){
            for (let i=0; i<2;i++){
                arr.push(this.shuffleDeck.shift())
                
            }}else {
                console.log('empty array please shuffle')
            }
            return arr
        }
    newDeck() {
        return this.shuffleDeck = this.originalDeck
    }

    

    deckCount() {
        return this.shuffleDeck.length
    }
}
    
//////////////////////////////////////////////////////////
//creating server



const server = http.createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (['GET', 'POST'].indexOf(req.method) > -1) {
    res.writeHead(200, headers);
    const  readWrite = (page,contentType)=>{
      fs.readFile(page, function(err, data) {
        // res.writeHead(200, {'Content-Type': contentType});
        res.write(data);
        res.end();
      });
    }
    const page = url.parse(req.url).pathname;
    const params = querystring.parse(url.parse(req.url).query);

    if (page == '/api' ){
      // res.writeHead(200, {'Content-Type': 'application/json'});
      const objToJson = new deckObj(newDeck)
      res.end(JSON.stringify(objToJson));

    }else{
      figlet('404!!', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
    })};
    return;
  }



  });

    
  
  const  PORT = process.env.PORT||8000;
  server.listen(PORT, ()=> console.log(`server running on port ${PORT}`))
  