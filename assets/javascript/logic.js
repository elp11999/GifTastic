//
// JavaScript for GifTastic
//
$(document).ready(function() {
    console.log("GifTastic started...");
    
    // List of topics
    if (localStorage.getItem("favoriteTopics")) {
        var topics = JSON.parse(localStorage.getItem("favoriteTopics"));
        var favoriteTopics = JSON.parse(localStorage.getItem("favoriteTopics"));
    }
    else {
        var topics = ["dogs", "cats"];
        var favoriteTopics = [];
    }

    // Div to hold the topic buttons
    var topicsDiv = $(".topics-buttons");

    // Div to hold the topic images
    var imagesDiv = $(".topic-images");

    // Giphy API key
    giphyApiKey = "dc6zaTOxFJmzC";    

    // Function to create Giphy query URL
    function createGiphyQueryURL(topic) {
        return "https://api.giphy.com/v1/gifs/search?q=" + topic.replace(' ', '+') + "&limit=10" +"&api_key=" + giphyApiKey;
    }

    // Function to add topic buttons to page
    function addNewTopic(topic) {

        var buttonContainer = $("<div>");
        $(buttonContainer).addClass("button-container");
        var topicButton = $("<button>");
        topicButton.text(topic);
        topicButton.addClass("topic-button"); 
        $(buttonContainer).append(topicButton);

        if (favoriteTopics.includes(topic)) {  
            var favoriteImg = $("<img>");
            $(favoriteImg).addClass("favorite-topic-img");
            $(favoriteImg).attr("src", "assets/images/favorite.png");
            $(favoriteImg).attr("alt", "favorite.png");
            $(buttonContainer).append(favoriteImg);
        }
        
        $(topicsDiv).append(buttonContainer);
    };

    // Function to create list of topic buttons
    function createTopicButtons() {
        $(topicsDiv).empty();
        if (topics.length > 0) {
            topics.forEach(function(topic) {
                //console.log(topic);
                addNewTopic(topic);
            });
            $(".topics-buttons").css("border", "1px solid #4aaaa5");
        }
        $('.topic-button').mousedown(topicButtonClicked);        
    };

    // Function to add topic image to page
    function addNewTopicImage(data) {

        var topicImage = $("<img>");
        topicImage.attr("src", data.images.fixed_height_still.url);
        topicImage.attr("data-still", data.images.fixed_height_still.url);
        topicImage.attr("data-animate", data.images.fixed_height.url);
        topicImage.attr("data-state", "still");
        topicImage.attr("height", "150");
        topicImage.attr("width", "165");
        topicImage.addClass("topic-image cfix");

        var topicImageDiv = $("<div>");
        topicImageDiv.addClass("topic-image-container cfix");
        topicImageDiv.append(topicImage);
        var topicData = $("<p><strong>" + "Rating: " + data.rating + "</strong></p>");
        topicImageDiv.append(topicData);

        $(imagesDiv).append(topicImageDiv);
        
    };

    // Function to retrieve images from server
    function getImages(topic) {
        
        $.ajax({
            url: createGiphyQueryURL(topic),
            method: "GET"
          }).then(function(response) {
            console.log(response);

            if (response.data.length > 0) {
                for (var i = 0; i < response.data.length; i++) {                
                    //console.log(response.data[i].images.fixed_height_still.url);
                    addNewTopicImage(response.data[i]);
                }
                $(".topic-image").click(topicImageClicked);   
                $(".clear-images-button").show();            
                $(".clear-images-button").click(clearImagesButtonClicked);

                if (!topics.includes(topic))
                    topics.push(topic);
                createTopicButtons();       
                $(".topic-images").css("border", "1px solid #4aaaa5");
            } else {
                $(".error-message").text("No query results for that topic.");  
            } 
            $(".image-area").show();               
            $(".topic-images").show(); 
        });
    };

    // Call back function when a topic button is clicked
    function topicButtonClicked(event) {
        $(".error-message").text("");
        $(".directions-area").hide();
        var topic = $(this).text();
        //console.log("Topic text=" + topic);
        getImages(topic);
    };
    
    // Call back function when a topic image is clicked
    function topicImageClicked(event) {
        var dataState;
        $(".error-message").text("");
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
        $(".error-message").text("");
        var topic = $(".new-topic-input").val();
        if (topic.length === 0) {            
            $(".error-message").text("Please enter a topic.");
            return;
        }
        $(".new-topic-input").val("");
        if (topics.includes(topic)) {          
            $(".error-message").text("Topic " + "\"" + topic + "\"" + " already exists.");
            return;
        }
        $(".directions-area").hide();        
        $(".favorite-button").show();
        //console.log("Topic text=" + topic);
        getImages(topic);
    });    
    
    // Call back function when a clear images button is clicked
    function clearImagesButtonClicked(event) {
        $(".error-message").text("");
        $(imagesDiv).html("");        
        $(".clear-images-button").hide();
        $(".topic-images").css("border", "none");
        $(".topic-images").hide();
    };

    // Function to check for candidates to be a favorite topic
    function checkForAvailableFavoriteTopics() {
        var count = 0;

        topics.forEach(function(topic) {
            console.dir(topic);
            if (!favoriteTopics.includes(topic)) {
                count++;
            }
        });

        return (count == 0) ? false : true;
    }

    // Call back function when a favorite choice is clicked
    function favoriteChoiceClicked(event) {
        var topic = $(this).text();
        console.log("favoriteChoiceClicked: clicked for " + topic);
        
        if (!favoriteTopics.includes(topic)) {    
            favoriteTopics.push(topic);        
            localStorage.setItem("favoriteTopics", JSON.stringify(favoriteTopics));
            if (!checkForAvailableFavoriteTopics())
                $(".favorite-button").hide();                
            createTopicButtons();
        }
    }

    // Call back function when the favorite button is clicked                  
    $(".favorite-button").click(function(event) {
        $(".error-message").text("");
        $("#myDropdown").html("");
        topics.forEach(function(topic) {
            if (!favoriteTopics.includes(topic)) {   
                var anchor = $("<a>");
                $(anchor).addClass("favorite-choice");
                $(anchor).attr("href", "#" + topic);
                $(anchor).text(topic);
                $(anchor).addClass("favorite-choice");
                $("#myDropdown").append(anchor);
                console.dir(topic);
            }
        });
        $(".favorite-choice").click(favoriteChoiceClicked);   
        document.getElementById("myDropdown").classList.toggle("show");
    });
    
    // Call back function to hide the drop down list 
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }

    // Create list of topic buttons
    createTopicButtons();
    
    // Check for candidates to be a favorite topic
    if (!checkForAvailableFavoriteTopics())
        $(".favorite-button").hide();
});