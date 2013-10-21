/**
 * Created by aioffe on 10/16/13.
 */

$(document).ready(function(){

    ContainerWrapper.init();

    SliderWrapper.init(100, 60);




});

var SliderWrapper = {
    getValue: function() {
        return $("#slider-vertical").slider("value");
    },
    init: function(initialMax, initialValue){
        $("#slider-estate-value").slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: initialMax,
            value: initialValue,
            slide: function( event, ui ) {
                $( "#amount" ).val( ui.value );
            }
        });

        $("#slider-num-creditors").slider({
            orientation: "horizontal",
            range: "min",
            min: 1,
            max: 10,
            value: 3,
            slide: function( event, ui ) {
                $( "#amount" ).val( ui.value );
            }
        });

        $("#slider-estate-value").on("slide", function(){
            refreshEstate();
        });

        $("#slider-num-creditors").on("slide", function(){
            refreshEstate();
        });

    }
};

function refreshEstate() {
    // get the _estate value from the _estate-slider
    var estateValue = $( "#slider-estate-value" ).slider( "value" )

    // get the claims amount from the claims slider
    var creditorsAmount = $( "#slider-num-creditors" ).slider( "value" )

    var claimsList = generateClaimsList(creditorsAmount);

    var bankrupcyCase = new Engine.BankrupcyCaseWrapper(claimsList, estateValue);

    // generate the new data

    // update as needed?
}

function generateClaimsList(numClaims) {
    var output = [];
    for (var i=1;i<=numClaims;i++) {
        output.push(100 * i)
    }
    return output;
}


function changeSeries() {

    //chart.series[0].setData(data,true);

    var weirdAl = {
        name: 'Weird Al',
        data: [1, 1, 1, 1, 1]
    };

    //$('#container').highcharts().series[1].setData([1, 1, 1, 1, 1]);
    //var currentValue = $('#container').highcharts().series[1].data[1].get();
    $('#container').highcharts().series[1].data[0].update(5);

    alert(currentValue);

}

var series = [{
    name: 'First Pass',
    data: [5, 5, 4, 7, 2]
}, {
    name: 'Second Pass',
    data: [2, 2, 3, 2, 1]
}];


var ContainerWrapper = {

    init: function() {
        $(function () {
            $('#container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Stacked bar chart'
                },
                xAxis: {
                    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total fruit consumption'
                    }
                },
                legend: {
                    backgroundColor: '#FFFFFF',
                    reversed: true
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                series: series
            });
        });
    }
};

