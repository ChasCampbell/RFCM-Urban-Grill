/*global $*/

var data = {
    "appId": "49311731",
    "appKey": "40c83f7f1671284d5757c0fac7739a9f",
    "query": "Kashi",
    "fields": [
        "item_name",
        "brand_name",
        "nf_clories",
        "nf_serving_size_qty",
        "nf_serving_size_unit"
    ],
    "filters": {
        "item_type": 2
    }
};

$.ajax({
        type: "POST",
        url: "https://api.nutritionix.com/v1_1/search",
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    })
    .done(function(results) {
        console.log(results);

    });

/*
            headers: {
                "Content-Type": "application/json",
                "x-app-id": "49311731",
                "x-app-key": "40c83f7f1671284d5757c0fac7739a9f"
            },
            */
