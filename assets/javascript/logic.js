//
// JavaScript for GifTastic
//
$(document).ready(function() {
    console.log("GifTastic started...");

    // List of topics for Giphy to query
    var topics = [
        "dog",
        "cat"
    ];

    // Div to hold the topic buttons
    var topicsDiv = $(".topics");



    // Function to create initial list of topic buttons
    function initializeTopicButtons() {
        topics.forEach(function(topic) {
            console.log(topic);
            var topicButton = $("<button>");
            topicButton.text(topic);
            topicButton.addClass("topic-button"); 
            $(topicsDiv).append(topicButton);
        });          
    }

    // Create list of topic buttons
    initializeTopicButtons();

    // Call back function when a topic button is clicked
    $(".topic-button").click(function(event) {
        var topicText = $(this).text();
        console.log("Topic text=" + topicText);
    });
});