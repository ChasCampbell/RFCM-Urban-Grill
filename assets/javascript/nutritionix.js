/*global $ firebase childData*/
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
    var itemCalories;
    var itemName = "";
    var brandName = "";
    var servingSizeQty = "";
    var servingSizeUnits = "";
    // Variables for ingredient database input.
    var savedIngredient = "";
    var savedQty = "";
    var savedUnits = "";
    var savedCalories;
    // Variables for create a plate.
    var menuItem = "";
    var mainCourse = "";
    var mainBaseQty = "";
    var mainBaseUnits = "";
    var mainBaseCal;
    var sideOne = "";
    var sideOneBaseQty = "";
    var sideOneBaseUnits = "";
    var sideOneBaseCal;
    var sideTwo = "";
    var sideTwoBaseQty = "";
    var sideTwoBaseUnits = "";
    var sideTwoBaseCal;
    var menuObject = {};
    //Variables for calory calculations.
    var mainQty = "";
    var sideOneQty = "";
    var sideTwoQty = "";
    var totalBaseCalories = 0;
    var totalCalories = 0;
    // Variables for lookup.
    var lookupIngredient = "";
    var lookupMenu = "";
    var lookupQty = "";
    var lookupUnits = "";
    var lookupCalories;
    var snapshot = {};
    var mainServCal;
    var s1ServCal;
    var s2ServCal;
    var dbmenuItem = "";
    var dbmainCourse = "";
    var dbmainQty = "";
    var dbmainUnits = "";
    var dbmainCal;
    var dbsideOne = "";
    var dbsideOneQty = "";
    var dbsideOneUnits = "";
    var dbsideOneCal;
    var dbsideTwo = "";
    var dbsideTwoQty = "";
    var dbsideTwoUnits = "";
    var dbsideTwoCal;
    var dbtotalCalories;
    var childData = {};

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
                    itemCalories = results.hits[i].fields.nf_calories;
                    servingSizeQty = results.hits[i].fields.nf_serving_size_qty;
                    servingSizeUnits = results.hits[i].fields.nf_serving_size_unit;
                    // Put the results into the html.
                    $("#info-table > tbody").append("<tr><td>" + itemName + "</td><td>" + brandName + "</td><td>" +
                        itemCalories + "</td><td>" + servingSizeQty + ' ' + servingSizeUnits + "</td></tr>");
                } // End of for.
            }); // End of .done.

    }); // End of .on(click) requestButton.
    // ___________________________________CLEAR INGREDIENT INPUT FORM
    //Provide a listener to clear the results information form.
    $("#clearButton").on("click", function(event) {
        event.preventDefault();
        // Clear the form.
        $("#info-table > tbody").empty();
    }); // End of .on(click) ClearButton.
    // ____________________________________________SAVE AN INGREDIENT
    //Provide a listener to enter an ingrediant to the database.
    $("#saveButton").on("click", function(event) {
        event.preventDefault();
        savedIngredient = $("#ingredientIn").val().trim();
        savedQty = $("#qtyIn").val().trim();
        savedUnits = $("#unitsIn").val().trim();
        savedCalories = $("#caloriesIn").val().trim();
        // Clear the form.
        $("#ingredientIn").val("");
        $("#qtyIn").val("");
        $("#unitsIn").val("");
        $("#caloriesIn").val("");
        // Variable to hold the values for upload to Firebase.
        var savedObject = {
            "name": savedIngredient,
            "quantity": savedQty,
            "units": savedUnits,
            "calories": savedCalories
        }; //End of savedObject.
        console.log(savedObject);
        // Upload the saved ingredient to the database
        database.ref().push(savedObject);
    }); // End of .on(click) for saveButton.
    // ____________________________________________LOOKUP BUTTONS___________
    //Provide a listener to look up an ingredient.
    $("#lookupButtonOne").on("click", function(event) {
        event.preventDefault();
        // Save value in variable.
        lookupIngredient = $("#ingredientLookup").val().trim();
        //Get the related information.
        database.ref().orderByChild('name').equalTo(lookupIngredient).on("value", function(snapshot) {
            var savedShot = snapshot.val();
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                // Save the data in variables.
                lookupQty = childData.quantity;
                lookupUnits = childData.units;
                lookupCalories = childData.calories;
                // Load html with the variables.
                $("#insertlIQ").html(lookupQty);
                $("#insertlIU").html(lookupUnits);
                $("#insertlIC").html(lookupCalories);
            }); // End of snapshot forEach.
        }); // End of database.ref
    }); // End of .on(click) for lookupButton1 for an ingredient.

    //Provide a listener to look up a menu item.
    $("#lookupButton2").on("click", function(event) {
        event.preventDefault();
        // Save value in variable.
        lookupMenu = $("#menuLookup").val().trim();
        //Get the related information.
        database.ref().orderByChild('dinner').equalTo(lookupMenu).on("value", function(snapshot) {
            var savedShot = snapshot.val();
            snapshot.forEach(function(childSnapshot) {
                console.log(childSnapshot.val());
                childData = childSnapshot.val();
                // Save the data in variables.
                dbmenuItem = childData.dinner;
                dbmainCourse = childData.main;
                dbsideOne = childData.side1;
                dbsideTwo = childData.side2;
                dbmainQty = childData.mquantity;
                dbsideOneQty = childData.s1quantity;
                dbsideTwoQty = childData.s2quantity;
                dbmainUnits = childData.munits;
                dbsideOneUnits = childData.s1units;
                dbsideTwoUnits = childData.s2units;
                dbmainCal = childData.mcalories;
                dbsideOneCal = childData.s1cal;
                console.log(dbsideTwoCal);
                dbsideTwoCal = childData.s2cal;
                dbtotalCalories = childData.totalC;
                // Load into html
                $(".menu").append("<p id='look1'>Main Course: " + dbmainCourse + " " + dbmainQty + " " + dbmainUnits + " " + dbmainCal + " calories</p>");
                $(".menu").append("<p id='look2'>Side Course: " + dbsideOne + " " + dbsideOneQty + " " + dbsideOneUnits + " " + dbsideOneCal + " calories</p>");
                $(".menu").append("<p id='look3'>Side Course: " + dbsideTwo + " " + dbsideTwoQty + " " + dbsideTwoUnits + " " + dbsideTwoCal + " calories</p>");
            }); // End of snapshot forEach.
        }); // End of database.ref
    }); // End of .on(click) for lookupButton2.
    // ____________________________________________CLEAR LOOKUP________________
    //Provide a listener to clear the lookup form.
    $("#clearButton3").on("click", function(event) {
        event.preventDefault();
        // Clear the form.
        $("#ingredientLookup").val("");
        $(".menu").empty();
        // Get the database information.
    }); // End of .on(click) for clear. 
    //____________________________________________________Create a Plate_______________
    //Provide a listener to enter a menu item to the database.
    $("#previewButton").on("click", function(event) {
        event.preventDefault();
        menuItem = $("#itemIn").val().trim();
        mainCourse = $("#mainIn").val().trim();
        //Get the related information.
        database.ref().orderByChild('name').equalTo(mainCourse).on("value", function(snapshot) {
            var savedShot = snapshot.val();
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                mainBaseQty = parseFloat(childData.quantity);
                mainBaseUnits = childData.units;
                mainBaseCal = parseInt(childData.calories);
                // Load html with the variables.
                $("#setmbq").html(mainBaseQty);
                $("#setmbu").html(mainBaseUnits);
                $("#setmbc").html(mainBaseCal);
            }); // End of snapshot forEach.
        }); // End of database.ref   
        sideOne = $("#sideOneIn").val().trim();
        //Get the related information.
        database.ref().orderByChild('name').equalTo(sideOne).on("value", function(snapshot) {
            var savedShot = snapshot.val();
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                sideOneBaseQty = parseFloat(childData.quantity);
                sideOneBaseUnits = childData.units;
                sideOneBaseCal = parseInt(childData.calories);
                // Load html with the variables.
                $("#sets1bq").html(sideOneBaseQty);
                $("#sets1bu").html(sideOneBaseUnits);
                $("#sets1bc").html(sideOneBaseCal);
            }); // End of snapshot forEach.
        }); // End of database.ref
        sideTwo = $("#sideTwoIn").val().trim();
        //Get the related information.
        database.ref().orderByChild('name').equalTo(sideTwo).on("value", function(snapshot) {
            var savedShot = snapshot.val();
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                sideTwoBaseQty = parseFloat(childData.quantity);
                sideTwoBaseUnits = childData.units;
                sideTwoBaseCal = parseFloat(childData.calories);
                // Load html with the variables.
                $("#sets2bq").html(sideTwoBaseQty);
                $("#sets2bu").html(sideTwoBaseUnits);
                $("#sets2bc").html(sideTwoBaseCal);
                totalBaseCalories = mainBaseCal + sideOneBaseCal + sideTwoBaseCal;
                $("#setBaseCal").html(totalBaseCalories);
            }); // End of snapshot forEach.
        }); // End of database.ref
    }); // End of on(click) for previewButton.
    // Provide a button to allow examination of the calory results before saving.
    $("#checkitButton").on("click", function(event) {
        event.preventDefault();
        mainQty = $("#mainQtyIn").val().trim();
        sideOneQty = $("#qtyOneIn").val().trim();
        sideTwoQty = $("#qtyTwoIn").val().trim();
        mainServCal = Math.round(mainBaseCal * (mainQty / mainBaseQty));
        s1ServCal = Math.round(sideOneBaseCal * (sideOneQty / sideOneBaseQty));
        s2ServCal = Math.round(sideTwoBaseCal * (sideTwoQty / sideTwoBaseQty));
        totalCalories = mainServCal + s1ServCal + s2ServCal;
        console.log(totalCalories);
        $(".totalc").html("Total Calories: " + totalCalories);
    }); // End of checkitButton.
    // Save the database values to a variable for upload.
    $("#saveButton2").on("click", function(event) {
        event.preventDefault();
        var menuObject = {
            "dinner": menuItem,
            "main": mainCourse,
            "mquantity": mainQty,
            "munits": mainBaseUnits,
            "mcalories": mainServCal,
            "side1": sideOne,
            "s1quantity": sideOneQty,
            "s1units": sideOneBaseUnits,
            "s1cal": s1ServCal,
            "side2": sideTwo,
            "s2quantity": sideTwoQty,
            "s2units": sideTwoBaseUnits,
            "s2Cal": s2ServCal,
            "totalC": totalCalories
        }; // End of var menu Object.
        console.log(menuObject);
        // Upload menuObject to Firebase.
        database.ref().push(menuObject);
    }); // End of .on(click) for save button.
    // Provide a button to clear the form.
    $("#clearButton2").on("click", function(event) {
        event.preventDefault();
        // Clear the form.
        $("#itemIn").val("");
        $("#mainIn").val("");
        $("#mainQtyIn").val("");
        $("#mainUnitsIn").val("");
        $("#setmbq").html("");
        $("#setmbu").html("");
        $("#setmbc").html("");
        $("#sideOneIn").val("");
        $("#qtyOneIn").val("");
        $("#unitsOneIn").val("");
        $("#sets1bq").html("");
        $("#sets1bu").html("");
        $("#sets1bc").html("");
        $("#sideTwoIn").val("");
        $("#qtyTwoIn").val("");
        $("#unitsTwoIn").val("");
        $("#sets2bq").html("");
        $("#sets2bu").html("");
        $("#sets2bc").html("");

        $("#setBaseCal").html("");
        $(".totalc").html("Total Calories:");
    }); // End of .on(click) clear.
}); // End of document ready.

// TO GET THE DATA KEY
//    snapshot.forEach(function(data) {
//        console.log(data.key);
//        var pushKey = data.key;
//        console.log(savedShot.name);
