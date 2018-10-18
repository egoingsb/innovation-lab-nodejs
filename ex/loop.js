// loop
var i = 0;
while(i < 3){
    console.log('hi');
    i++;
}

// array
var topics  = ['html', 'css', 'javascript'];
console.log(topics[1]);
topics[1] = 'Cascading StyleSheet';
console.log(topics[1]);
topics.push('nodejs');
console.log(topics[3]);
console.log(topics.length);

// loop + array 
var fs = require('fs');
var topics = fs.readdirSync('data');
var i = 0;
while(i < topics.length){
    console.log(`<li><a href="/?id=${topics[i]}">${topics[i]}</a></li>`);
    i = i + 1;
}
