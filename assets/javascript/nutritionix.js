/*global $ firebase */
$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBBqtyH_2KaNHc5Iuq6g55-NeAwiPXTRh4",
        authDomain: "rfcm-389fe.firebaseapp.com",
        databaseURL: "https://rfcm-389fe.firebaseio.com",
        projectId: "rfcm-389fe",
        storageBucket: "",
        messagingSenderId: "406269590701"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    // Variables for ingredient request.
    var ingredient = "";
    var results = {};
    var calories = 0;
    var itemName = "";
    var brandName = "";
    var servingSizeQty = 1;
    var servingSizeUnits = "";
    // Variables for ingredient database input.
    var savedIngredient = "";
    var savedQty;
    var savedUnits = "";
    var savedCalories;
    var savedValues = [];
    // Variables for create a plate.
    var menuItem = "";
    var mainCourse = "";
    var mainQty;
    var mainUnits = "";
    var sideOne = "";
    var sideOneQty;
    var sideOneUnits = "";
    var sideTwo = "";
    var sideTwoQty;
    var sideTwoUnits = "";
    //Variables for calory calculations.
    var dbmainQty;
    var dbsideOneQty;
    var dbsideTwoQty;
    var dbmainUnits = "";
    var dbsideOneUnits = "";
    var dbsideTwoUnits = "";
    var dbmainCalories;
    var dbsideOneCalories;
    var dbsideTwoCalories;
    var mainCaloriesOut;
    var sideOneCaloriesOut;
    var sideTwoCaloriesOut;
    var totalCalories;
    // Variables for lookup.
    var lookupIngredient = "";
    var lookupMenu = "";
    var lookupIngredientQty;
    var lookupIngredientUnits = "";
    var lookupIngredientCalories;
    var lookupMenuCalories;
    var snapshot = {};

    // _________________________________________________REQUEST INPUT_
    // Provide a listener to take in a request for information
    // on an ingredient of a meal.
    $("#requestButton").on("click", function(event) {
        event.preventDefault();
        // Get the requested ingredient from the input form.
        ingredient = $("#requestIn").val().trim();
        // Clear the form.
        $("#requestIn").val("");

        // Build the API request.
        var data = {
            "appId": "49311731",
            "appKey": "40c83f7f1671284d5757c0fac7739a9f",
            "query": ingredient,
            "fields": [
                "item_name",
                "brand_name",
                "nf_calories",
                "nf_serving_size_qty",
                "nf_serving_size_unit"
            ],
            "filters": {
                "item_type": 2
            }
        };
        // End of var data.

        // Submit the request.
        $.ajax({
                type: "POST",
                url: "https://api.nutritionix.com/v1_1/search",
                data: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            }) // End of $.ajax.
            // Store the ingredients in variables.
            .done(function(results) {
                for (var i = 0; i < results.hits.length; i++) {
                    itemName = results.hits[i].fields.item_name;
                    brandName = results.hits[i].fields.brand_name;
                    calories = results.hits[i].fields.nf_calories;
                    servingSizeQty = results.hits[i].fields.nf_serving_size_qty;
                    servingSizeUnits = results.hits[i].fields.nf_serving_size_unit;
                    // Put the results into the html.
                    $("#info-table > tbody").append("<tr><td>" + itemName + "</td><td>" + brandName + "</td><td>" +
                        calories + "</td><td>" + servingSizeQty + ' ' + servingSizeUnits + "</td></tr>");
                } // End of for.

            }); // End of .done.

    }); // End of .on(click) requestButton.
    // ___________________________________CLEAR INGREDIENT INPUT FORM
    //Provide a listener to clear the results information form.
    $("#clearButton").on("click", function(event) {
        event.preventDefault();
        // Clear the form.
        $("#info-table > tbody").empty();
    }); // End of .on(click).
    // ____________________________________________SAVE AN INGREDIENT
    //Provide a listener to enter an ingrediant to the database.
    $("#saveButton").on("click", function(event) {
        event.preventDefault();
        savedIngredient = $("#ingredientIn").val().trim();
        savedQty = $("#qtyIn").val().trim();
        savedUnits = $("#unitsIn").val().trim();
        savedCalories = $("#caloriesIn").val().trim();
        savedValues = [savedIngredient, savedQty, savedUnits, savedCalories];
        // Clear the form.
        $("#ingredientIn").val("");
        $("#qtyIn").val("");
        $("#unitsIn").val("");
        $("#caloriesIn").val("");

        var savedObject = {
            "name": savedIngredient,
            "quantity": savedQty,
            "units": savedUnits,
            "calories": savedCalories
        }; //End of savedObjewct.
        console.log(savedObject);
        console.log(savedQty);
        console.log(savedUnits);
        console.log(savedCalories);
        // Upload the saved ingredient to the database
        database.ref().push(savedObject);
    }); // End of .on(click) for dataButton.
    // ________________________________________________LOOKUP BUTTON
    //Provide a listener for a lookup'
    $("#LookupButton").on("click", function(event) {
        event.preventDefault();
        // Save values in variables.
        lookupIngredient = $("#ingredientLookupLine").val().trim();
        lookupMenu = $("#menuLookupLine").val().trim();
        //Get the related information.
        database.ref().orderByChild('name').equalTo(lookupIngredient).on("value", function(snapshot) {
            console.log(snapshot.val());
            // if (lookupIngredient != null) {
            //     lookupIngredientQty = snapshot.ingredientSaved; //ingredientName.quantity;
            //     //    lookupIngredientUnits = snapshot.ingredientSaved.ingredientName.units;
            //     //    lookupIngredientCalories = snapshot.ingredientSaved.ingredientName.calories;
            //     console.log(snapshot.chiid_added);
            // }
            // else if (lookupMenu != null) {
            //     lookupMenuCalories = snapshot.Saved.menuName.calories;
            // }
        }); // End of database.ref
    }); // End of .on(click) for lookupButton.
    // ________________________________________________CLEAR LOOKUP_______
    //Provide a listener to clear the lookup form.
    $("#clearButton3").on("click", function(event) {
        event.preventDefault();
        // Clear the form.
        $("#ingredientLookup").val("");
        $("#menuLookup").val("");
        // Get the database information.
    }); // End of .on(click) for clear. 
    //________________________________________________ENTER MENU ITEM
    //Provide a listener to enter a menu item to the database.
    $("#createButton").on("click", function(event) {
        event.preventDefault();
        menuItem = $("#itemIn").val().trim();
        mainCourse = $("#mainIn").val().trim();
        mainQty = $("#mainQtyIn").val().trim();
        mainUnits = $("#mainUnitsIn").val().trim();

        sideOne = $("#sideOneIn").val().trim();
        sideOneQty = $("#qtyOneIn").val().trim();
        sideOneUnits = $("#unitsOneIn").val().trim();

        sideTwo = $("#sideTwoIn").val().trim();
        sideTwoQty = $("#qtyTwoIn").val().trim();
        sideTwoUnits = $("#unitsTwoIn").val().trim();

        // Get the database information for these items.
        database.ref().on("value", function(snapshot) {
            console.log(snapshot.val());
            // Save the database values to variables.
            // dbmainQty = snapshot.savedIngredient.ingredientName;
            // dbsideOneQty = snapshot.savedIngredient.quantity;
            // dbsideTwoQty = snapshot.savedIngredient.units;
            // dbmainUnits = snapshot.savedIngredient.calories;
            // dbsideOneUnits = snapshot.savedIngredient.;
            // dbsideTwoUnits = snapshot.savedIngredient.;
            // dbmainCalories = snapshot.savedIngredient.;
            // dbsideOneCalories = snapshot.savedIngredient.;
            // dbsideTwoCalories = snapshot.savedIngredient.;
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        // Check for matching units.
        //Calculate the calories for the itwms.
        // if (mainUnits != dbmainUnits) {
        //     //alert("Main Units must be " + mainUnits);
        // }
        // else {
        mainCaloriesOut = dbmainCalories * mainQty / dbmainQty;
        // }
        // if (sideOneUnits != dbsideOneUnits) {
        //     //alert("Side One Units must be " + sideOneUnits);
        // }
        // else {
        sideOneCaloriesOut = dbsideOneCalories * sideOneQty / dbsideOneQty;
        // }
        // if (sideTwoUnits != dbsideTwoUnits) {
        //     //alert("Side Two Units must be " + sideTwoUnits);
        // }
        // else {
        sideTwoCaloriesOut = dbsideTwoCalories * sideTwoQty / dbsideTwoQty;
        totalCalories = mainCaloriesOut + sideOneCaloriesOut + sideTwoCaloriesOut;
        $("#insert").html(totalCalories);
        //    }
        // End of three if-else.
    });
    // End of on(click) create.

    // Provide a button to clear the form.
    $("#clearButton2").on("click", function(event) {
        event.preventDefault();
        // Clear the form.
        $("#itemIn").val("");
        $("#mainIn").val("");
        $("#mainQtyIn").val("");
        $("#mainUnitsIn").val("");

        $("#sideOneIn").val("");
        $("#qtyOneIn").val("");
        $("#unitsOneIn").val("");

        $("#sideTwoIn").val("");
        $("#qtyTwoIn").val("");
        $("#unitsTwoIn").val("");

        $("#totalCalories").val("");
        $("#insert").val("total");
    }); // End of .on(click) clear.

    // Provide a button to save the data.
    $("#clearButton3").on("click", function(event) {
        event.preventDefault();
        // Save the data in a variable for sending to the database.
        var savedMenuItem = {
            "courseName": menuItem,
            "courseMain": mainCourse,
            "courseMainQty": mainQty,
            "courseMainUnits": mainUnits,
            "courseSideOne": sideOne,
            "courseSideOneQty": sideOneQty,
            "courseSideOneUnits": sideOneUnits,
            "courseSideTwo": sideTwo,
            "courseSideTwoQty": sideTwoQty,
            "courseSideTwoUnits": sideTwoUnits,
            "courseTotalCalories": totalCalories
        };
        // End of var menuItemSaved.

        // Upload menu item to the database
        database.ref().push(savedMenuItem);
    }); // End of .on(click).

}); // End of document ready.
