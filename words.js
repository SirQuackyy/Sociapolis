$.getJSON("https://burritoapi.github.io/burrito-api/wordslist.json").done(function( data ) {
    var choice = Math.floor(Math.random() * data['words'].length)
    
    document.getElementById('randomWord').innerHTML = '<b>Draw: </b>' + data['words'][choice].word;
});

function newWord(){
    $.getJSON("https://burritoapi.github.io/burrito-api/wordslist.json").done(function( data ) {
    var choice = Math.floor(Math.random() * data['words'].length)
    
    document.getElementById('randomWord').innerHTML = '<b>Draw: </b>' + data['words'][choice].word;
});
}