$.getJSON("https://burritoapi.github.io/burrito-api/wyr.json").done(function( data ) {
    var choice = Math.floor(Math.random() * data['choices'].length)
    
    console.log("Blue: " + data['choices'][choice].blue + "\nBlue_Stats: " + data['choices'][choice].blue_stat + "\nRed: " + data['choices'][choice].red + "\nRed_Stats: " + data['choices'][choice].red_stat); 

    document.getElementById('title_text').innerHTML = data['choices'][choice].blue;
    document.getElementById('title_text2').innerHTML = data['choices'][choice].red;
    document.getElementById('background').src = data['choices'][choice]['blue_img'];    
    document.getElementById('background2').src = data['choices'][choice]['red_img'];
    document.getElementById('background-back').src = data['choices'][choice]['blue_img'];
    document.getElementById('background2-back').src = data['choices'][choice]['red_img'];
    document.getElementById('percentage').innerHTML = data['choices'][choice]['blue_stat'];
    document.getElementById('percentage2').innerHTML = data['choices'][choice]['red_stat'];
});

function getData(){
    $.getJSON("https://burritoapi.github.io/burrito-api/wyr.json").done(function( data ) {
    var choice = Math.floor(Math.random() * data['choices'].length)
    
    console.log("Blue: " + data['choices'][choice].blue + "\nBlue_Stats: " + data['choices'][choice].blue_stat + "\nRed: " + data['choices'][choice].red + "\nRed_Stats: " + data['choices'][choice].red_stat); 

    document.getElementById('title_text').innerHTML = data['choices'][choice].blue;
    document.getElementById('title_text2').innerHTML = data['choices'][choice].red;
    document.getElementById('background').src = data['choices'][choice]['blue_img'];    
    document.getElementById('background2').src = data['choices'][choice]['red_img'];
    document.getElementById('background-back').src = data['choices'][choice]['blue_img'];
    document.getElementById('background2-back').src = data['choices'][choice]['red_img'];
    document.getElementById('percentage').innerHTML = data['choices'][choice]['blue_stat'];
    document.getElementById('percentage2').innerHTML = data['choices'][choice]['red_stat'];
    });
}i