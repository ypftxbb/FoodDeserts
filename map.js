mapboxgl.accessToken = 'pk.eyJ1Ijoidml2aXN1bmxpbiIsImEiOiJjam40d3ptMDAwcGdlM2tvOXFmNHY4cTh5In0.5cy3X1GRoZOltmm3GS_UUg';
var map = new mapboxgl.Map({
container: 'map',
minZoom: 12,
maxZoom: 22,
center: [-78.480365,38.051142], 
style: 'mapbox://styles/vivisunlin/cjn4xax170ht92sp3phknz7ci',
attributionControl: 'City of Charlottesville Open Data Portal (http://opendata.charlottesville.org/)'
});

	
$('#about').on('click', function() {
	$('#screen').fadeToggle();  
	$('.modal').fadeToggle();  
});


$('.modal .close-button').on('click', function() {
	$('#screen').fadeToggle();  
	$('.modal').fadeToggle();  
	
});


var layers = [
    'Poverty Status(percentage of family under poverty level)  ', 
    'Food Stamps(household receiving foodstamps)', 
	'Median Income(household median income per year)',  
	'$$$ Market and Grocery',
	'$$ Market and Grocery',
	'$ Market and Grocery',
    ];
	
	var colors = [
	    '#F86099',
	    '#F8DD2E',
	    '#63CACB',
		'#4527fc', 
		'#745efb', 
		'#9180f9', 
		
	];

for (i=0; i<layers.length; i++) {
    var layer =layers[i]; 
    var color =colors[i];  
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; 
    var item = $(itemHTML).appendTo("#legend"); 
    var legendKey = $(item).find(".legend-key"); 
    legendKey.css("background", color); 
}

var layers =[  
        ['Poverty Status', 'Poverty Status'],     
        ['Food Stamps', 'Food Stamps'],
        ['Median Income', 'Median Income'],     
    ]; 

   map.on('load', function () {
        
        for (i=0; i<layers.length; i++) {

            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>");
        }

        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); 
                }
        });
    });

var swatches = $("#swatches");
    var colors = [  
        '#f19759',
        '#f8dd2e',
        '#f86099',
    ]; 

    var layer = 'bus-stop-points';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); 
        });

        $(swatches).append(swatch);
    });

    // POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stops = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['Median Income', 'Food Stamps', 'Poverty Status']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stops.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(e.lngLat);

      var popupTitle;
      var popupBody; 

      if (stops[0].layer.id == 'Median Income') {
      popupTitle = stops[0].properties.GEOdisplay;
      	popupBody = stops[0].properties.MedianHous;
      }else if (stops[0].layer.id == 'Food Stamps') {
      popupTitle = stops[0].properties.GEOdisplay;
      	popupBody = stops[0].properties.Foodstamps;

      }else if (stops[0].layer.id == 'Poverty Status') {
      	popupTitle = stops[0].properties.GEOdisplay;
      	popupBody = stops[0].properties.Percentbel;

      }

      // Set the contents of the popup window
      popup.setHTML('<h3>' + popupTitle + '</h3><p>' + popupBody + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var markets = map.queryRenderedFeatures(e.point, {    
            layers: ['markets']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (markets.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#info-markets').html('<h3><strong>' + markets[0].properties.NAME + '</strong></h3><p>' + markets[0].properties.PRICE+ ' </p><img class="markets-image" src="img/' + markets[0].properties.NAME + '.jpg">');

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#info-markets').html('<p>Not hovering over a <strong>Market</strong> right now.</p>');
            
        }

    });

    var chapters = {
        'C’ville Oriental': {
            name: "C'ville Oriental",
            description: "1195 Seminole Trail, Charlottesville, VA 22901<BR>Asian Grocery Store<BR>Rate 4.2",
            imagepath: "img/C ville Oriental.jpg",
            bearing: 0,
            center: [-78.48446,38.069155],
            zoom: 16.17,
            pitch: 60
        },
        'Costco Wholesale': {
            name: "Costco Wholesale",
            description: "3171 District Ave, Charlottesville, VA 22901<BR>Warehouse Store<BR>Rate 4.6",
            imagepath: "img/Costco Wholesale 1.jpg",
            bearing: 0,
            center: [ -78.489248, 38.068538],
            zoom: 17.20,
            pitch: 60
        },
        'Trader Joe’s': {
            name: "Trader Joe's",
            description: "2025 Bond St, Charlottesville, VA 22901<BR>Grocery Store<BR>Rate 4.7",
            imagepath: "img/Trader Joe s.jpg",
            bearing: 20,
            center: [ -78.491328, 38.062881],
            zoom: 15,
            pitch: 50
        },
        '7-Eleven': {
            name: "7-Eleven",
            imagepath: "img/7 Eleven.jpg",
            description: "1907 Emmet St N, Charlottesville, VA 22901, VA 22901<BR>Convenience Store<BR>Rate 5.0",
            bearing: 0,
            center: [ -78.492292, 38.062123],
            zoom: 16.13,
            pitch: 25
        },
        'Halal Mini Mart': {
            name: "Halal Mini Mart",
            imagepath: "img/Halal Mini Mart.jpg",
            description: "2114 Angus Rd, Charlottesville, VA 22901<BR>Grocery Store<BR>Rate none",
            bearing: 0,
            center: [ -78.495245, 38.059829],
            zoom: 16.13,
            pitch: 25
        },
        'Kroger': {
            name: "Kroger",
            imagepath: "img/Kroger 1.jpg",
            description: "21159 Emmet St N, Charlottesville, VA 22903<BR>Grocery Store<BR>Rate 4.2",
            bearing: 0,
            center: [ -78.491503, 38.059750],
            zoom: 16.13,
            pitch: 25
        },
        'Whole Foods Market': {
            name: "Whole Foods Market",
            imagepath: "img/Whole Foods Market 1.jpg",
            description: "1797 Hydraulic Rd, Charlottesville, VA 22901<BR>Grocery Store<BR>Rate 4.3",
            bearing: 0,
            center: [ -78.489519, 38.059946],
            zoom: 16.13,
            pitch: 25
        },
        'Asian Market': {
            name: "Asian Market",
            imagepath: "img/Asian Market 1.jpg",
            description: "1417 Emmet St N B, Charlottesville, VA 22903<BR>Asian Grocery Store<BR>Rate 4.3",
            bearing: 0,
            center: [ -78.496909, 38.056282],
            zoom: 16.13,
            pitch: 25
        },
        'Harris Teeter': {
            name: "Harris Teeter",
            imagepath: "img/Harris Teeter 1.jpg",
            description: "Don Danich, 975 Emmet St N, Charlottesville, VA 22903<BR>Grocery Store<BR>Rate 4.2",
            bearing: 0,
            center: [ -78.504224, 38.049974],
            zoom: 16.13,
            pitch: 25
        },
        'Foods of All Nations': {
            name: "Foods of All Nations",
            imagepath: "img/Foods of All Nations 1.jpg",
            description: "2125 Ivy Rd # C, Charlottesville, VA 22903<BR>Grocery Store<BR>Rate 4.6",
            bearing: 0,
            center: [ -78.511855, 38.043485],
            zoom: 16.13,
            pitch: 25
        },
        'Integral Yoga Natural Foods': {
            name: "Integral Yoga Natural Foods",
            imagepath: "img/Integral Yoga Natural Foods 1.jpg",
            description: "923 Preston Ave # H, Charlottesville, VA 22903<BR>Health Food Store<BR>Rate 4.5",
            bearing: 0,
            center: [ -78.489669, 38.038864],
            zoom: 16.13,
            pitch: 25
        },
         'Reid Super-Save Market': {
            name: "Reid Super-Save Market",
            imagepath: "img/Reid Super-Save Market 1.jpg",
            description: "4538, 600 Preston Ave, Charlottesville, VA 22903<BR>Grocery Store<BR>Rate 4.5",
            bearing: 0,
            center: [ -78.486032, 38.034997],
            zoom: 16.13,
            pitch: 25
        },
        'Grand Market': {
            name: "Grand Market",
            imagepath: "img/Grand Market 1.jpg",
            description: "323 W Main St, Charlottesville, VA 22903<BR>International Grocery<BR>Rate 4.6",
            bearing: 0,
            center: [ -78.486161, 38.030601],
            zoom: 16.13,
            pitch: 25
        },
        'Spice Diva': {
            name: "Spice Diva",
            imagepath: "img/Spice Diva 1.jpg",
            description: "410 W Main St, Charlottesville, VA 22903<BR>Herbs & Spices Grocery<BR>Rate 4.0",
            bearing: 0,
            center: [ -78.487149, 38.030639],
            zoom: 16.13,
            pitch: 25
        },
        'Seafood @ West Main': {
            name: "Seafood @ West Main",
            imagepath: "img/Seafood @ West Main 1.jpg",
            description: "416 W Main St, Charlottesville, VA 22903<BR>Seafood Markets Grocery<BR>Rate 4.6",
            bearing: 0,
            center: [ -78.487493, 38.030362],
            zoom: 16.13,
            pitch: 60
        },
         'KIMS MARKET': {
            name: "KIM'S MARKET",
            imagepath: "img/KIM.jpg",
            description: "501 Cherry Ave, Charlottesville, VA 22903<BR>Grocery Store<BR>Rate 4.4",
            bearing: 0,
            center: [ -78.487493, 38.027073],
            zoom: 16.13,
            pitch: 60
        },
        'Market Street Market': {
            name: "Market Street Market",
            imagepath: "img/Market Street Market 1.jpg",
            description: "400 E Market St, Charlottesville, VA 22902<BR>Grocery Store<BR>Rate 4.6",
            bearing: 0,
            center: [ -78.478682, 38.030721],
            zoom: 16.13,
            pitch: 60
        },
         'Blue Ridge Country Store': {
            name: "Blue Ridge Country Store",
            imagepath: "img/Blue Ridge Country Store 1.jpg",
            description: "518 E Main St, Charlottesville, VA 22902<BR>Grocery Store<BR>Rate 4.2",
            bearing: 0,
            center: [ -78.478054, 38.029622],
            zoom: 16.13,
            pitch: 60
        },
        'Blue Ridge Country Store': {
            name: "Blue Ridge Country Store",
            imagepath: "img/Blue Ridge Country Store 1.jpg",
            description: "518 E Main St, Charlottesville, VA 22902<BR>Grocery Store<BR>Rate 4.2",
            bearing: 0,
            center: [ -78.478054, 38.029622],
            zoom: 16.13,
            pitch: 60
        },
        'Gibson s Grocery': {
            name: "Gibson's Grocery",
            imagepath: "img/Gibson.jpg",
            description: "703 Hinton Ave, Charlottesville, VA 22902<BR>Grocery Store<BR>Rate 5.0",
            bearing: 0,
            center: [ -78.477718, 38.025870],
            zoom: 16.13,
            pitch: 60
        },
        'Wegmans': {
            name: "Wegmans",
            imagepath: "img/Wegmans 1.jpg",
            description: "100 Wegmans Way, Charlottesville, VA 22902<BR>Grocery Store<BR>Rate 4.7",
            bearing: 0,
            center: [ -78.500661, 38.009171],
            zoom: 16.13,
            pitch: 60
        },
        'Food Lion': {
            name: "Food Lion",
            imagepath: "img/Food Lion 1.jpg",
            description: "585 Branchlands Blvd, Charlottesville, VA 22901<BR>1131 5th St SW, Charlottesville, VA 22902<BR>32 Mill Creek Dr, Charlottesville, VA 22902<BR>570 Riverbend Dr, Charlottesville, VA 22911<BR>Grocery Store<BR>Rate 4.0",
            bearing: 0,
            center: [ -78.500661, 38.009171],
            zoom: 16.13,
            pitch: 60
        },

    };

    console.log(chapters['C’ville Oriental']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h2>" + chapters[key]['name'] + "</h2><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    


