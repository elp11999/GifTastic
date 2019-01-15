//
// JavaScript for GifTastic
//
$(document).ready(function() {
    console.log("GifTastic started...");

    // List of topics for Giphy to query
    var topics = [
        "dogs",
        "cats"
    ];

    // Div to hold the topic buttons
    var topicsDiv = $(".topics-buttons");

    // Div to hold the topic images
    var imagesDiv = $(".images");

    // Giphy API key
    giphyApiKey = "dc6zaTOxFJmzC";    

    // Function to create Giphy query URL
    function createGiphyQueryURL(topic) {
        return "https://api.giphy.com/v1/gifs/search?q=" + topic.replace(' ', '+') + "&limit=10" +"&api_key=" + giphyApiKey;
    }

    // Function to add topic buttons to page
    function addNewTopic(topic) {
        var topicButton = $("<button>");
        topicButton.text(topic);
        topicButton.addClass("topic-button"); 
        $(topicsDiv).append(topicButton);
    };

    // Function to create initial list of topic buttons
    function createTopicButtons() {
        $(topicsDiv).empty();
        topics.forEach(function(topic) {
            //console.log(topic);
            addNewTopic(topic);
        });
        $(".topic-button").click(topicButtonClicked);          
    };

    // Function to add topic image to page
    function addNewTopicImage(data) {
        var topicImage = $("<img>");
        topicImage.attr("src", data.images.fixed_height_still.url);
        topicImage.attr("data-still", data.images.fixed_height_still.url);
        topicImage.attr("data-animate", data.images.fixed_height.url);
        topicImage.attr("data-state", "still");
        topicImage.attr("height", "150");
        topicImage.attr("width", "150");
        topicImage.addClass("topic-image"); 
        $(imagesDiv).append(topicImage);
    };

    // Call back function when a topic button is clicked
    function topicButtonClicked(event) {
        $(".directions-area").hide();
        var topic = $(this).text();
        //console.log("Topic text=" + topic);
        
        $.ajax({
            url: createGiphyQueryURL(topic),
            method: "GET"
          }).then(function(response) {
            //console.log(response);
            for (var i = 0; i < response.data.length; i++) {                
                //console.log(response.data[i].images.fixed_height_still.url);
                addNewTopicImage(response.data[i]);
            }
            $(".topic-image").click(topicImageClicked);
            $(".image-area").show();            
            $(".images").css("border", "1px solid #4aaaa5");
            $(".clear-images-button").show();            
            $(".clear-images-button").click(clearImagesButtonClicked);
        });
    };
    
    // Call back function when a topic image is clicked
    function topicImageClicked(event) {
        var dataState;
        dataState = $(this).attr("data-state");
        //console.log("data-state=" + dataState);
        if (dataState === "still") {            
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else if (dataState === "animate") {            
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    };

    // Call back function when the new topic button is clicked
    $(".new-topic-button").click(function(event) {
        event.preventDefault();
        $(".directions-area").hide();
        var topic = $(".new-topic-input").val();
        if (topic.length === 0)
            return;
        if (topics.includes(topic))
            return;
        //console.log("Topic text=" + topic);
        topics.push(topic);
        createTopicButtons();
        $(".new-topic-input").val("");
        $(".image-area").show();
    });
    
    
    // Call back function when a clear images button is clicked
    function clearImagesButtonClicked(event) {
        $(imagesDiv).html("");        
        $(".clear-images-button").hide();
        $(".images").css("border", "none");
    };

    // Create list of topic buttons
    createTopicButtons();
});