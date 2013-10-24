/**
 * Created by aioffe on 10/22/13.
 */

var app = angular.module('myApp', ['ngGrid', "highcharts-ng"]);

function clearArrayAndPopulateWith(array, populateWith) {
    array.length = 0;
    populateWith.forEach(function(value){
        array.push(value);
    });
}

app.directive("hbox", function(){
    return {
        restrict: "E",
        scope: true,
        transclude: true,
        link: function(scope, element, attrs) {

            // TODO Write a validation function here to make sure it's not random string
            var valign = attrs.valign;
            var align = attrs.align;

            var jq = angular.element;
            //var table = jq(element[0]).children();
            var table = jq(element.children()[1]);
            var div = jq(element.children()[0]);

            var row = jq("<tr></tr>");
            var children = div.children();
            var childrenArr = [];
            for (var i=0;i<children.length;i++) {
                childrenArr.push(children[i]);
            }

            // add the inside elements to the div
            childrenArr.forEach(function(child){
                var column = jq("<td></td>");
                column.append(child);
                row.append(column);

                if (valign != undefined) {
                    row.css("vertical-align: " + valign);
                }
            });

            // TODO see if this works for text, doesn't seem to work or controls yet
            if (align != undefined) {
                table.attr("align", align);
            }

            // append the row to the table
            table.append(row);

            // remove the dummy inner div from the table
            div.remove();
        },
        template: '<div ng-transclude></div><table></table>'
    }
});


app.directive("slider", function(){

    return {
        restrict:"E",
        scope: {
            value:"=",
            min:"=",
            max:"=",
            step:"="
        },

        // you'l get a 'TypeError: undefined is not a function' if this isn't true & you use ng-transclude
        // or a bunch of other possible errors
        transclude: true,

        link: function(scope, element, attrs) {

            // using attrs for direction because for some reason '=' scope does not seem to work of strings
            // (i.e they become 'undefined') so instead we'll just do it like this...
            var direction = attrs.direction;
            if (direction != "vertical" && direction != "horizontal") {
                throw new Error("orientation of the slider must be either vertical or horizontal");
            }

            var firstDiv = $(element).find("div")[0];
            var firstDivElement = $(firstDiv);


            firstDivElement.slider({
                value: scope.value,
                min: scope.min,
                max: scope.max,
                step: scope.step,
                orientation:direction,
                slide: function( event, ui ) {
                    // when the user adjusts the slider, update the value
                    scope.$apply("value=" + ui.value);

                    //$('.qtip:visible').qtip('reposition');

                }
            });

            // apparantly this seems to work by setting in css doesn't although the jquery slider
            // control claims that that's possible
            if (direction === "vertical") {
                firstDivElement.height("100%");
                firstDivElement.width("6px");
            } else {
                firstDivElement.width("100%");
                //firstDivElement.height("5px");
            }

            var handle = firstDivElement.find("a");
            var qtipInstance = handle.qtip();

//            var qtipInstance = handle.qtip({
//
//                position: {
//                    container: handle,
//                    my: "left center",
//                    at: "right center"
//                },
//                content: {
//                    text: scope.value
//                },
//                show: true,
//                hide: false,
//                style: {
//                    classes: 'qtip-light',
//                    width: 50
//                }
//            });


            //
            scope.$watch("value", function(newValue){
                // when the value changes outside the slider, update the slider
                firstDivElement.slider("value", newValue);

                // TODO This is a lot of work to call a these every time something is moved
                // see if we can move these things out into some other method and keep
                // a boolean to make sure that it's changed the first time this field is used
                qtipInstance.qtip('option', 'content.text', newValue);
                qtipInstance.qtip('option', 'style.width', 60);
                qtipInstance.qtip('option', 'style.classes', "qtip-light");
            });

            scope.$watch("max", function(newValue){
                firstDivElement.slider("option", "max", newValue);
                qtipInstance.qtip('option', 'content.text', newValue);
                qtipInstance.qtip('option', 'style.width', 60);
                qtipInstance.qtip('option', 'style.classes', "qtip-light");
            });


            //$(firstDiv).attr("title", "foo bar baz");
        },
        template: '<div ng-transclude></div>'
    }
});



app.filter('round2', function(){
    return function(value) {
        var output = Math.round(value * 100) / 100;
        return output;
    }
});


app.factory('ClaimantsData', function(){
    return {
        estate: 300,
        numClaimants:3,
        maxNumClaimants:20,
        fullClaimantsList: Engine.BankrupcyCaseWrapper.createClaimants(100, 100, 20),
        // we need a special array to keep track of the data since if claimants()
        // returns a differnet object every time (i.e. an array that represents a slice
        // of the 'fullClaimantsList' then each successive call will make angular call
        // another '$digest' function and there will be an infinite loop
        selectedClaimants:[],
        claimants: function() {
            // recalculate all the payoffs
            Engine.BankrupcyCaseWrapper.resetPayoffsToZero(this.fullClaimantsList);
            var filteredClaimants = this.fullClaimantsList.slice(0, this.numClaimants);
            Engine.BankrupcyCaseWrapper.runEngine(filteredClaimants, this.estate);

            // clear the array and fill the 'selected payments array back'
            clearArrayAndPopulateWith(this.selectedClaimants, filteredClaimants);

            return this.selectedClaimants;
        },

        payoutSeriesInternal:[],
        payoutSeries: function(){
            clearArrayAndPopulateWith(this.payoutSeriesInternal, Engine.BankrupcyCaseWrapper.getPayouts(this.claimants()));
            return this.payoutSeriesInternal;
        },

        categoriesInternal:[],
        categories:function() {
            clearArrayAndPopulateWith(this.categoriesInternal, Engine.BankrupcyCaseWrapper.getCategories(this.claimants()));
            return this.categoriesInternal;
        },
        maxEstateSize: function() {
            return Engine.BankrupcyCaseWrapper.getMaximalEstateSize(this.claimants());
        }
    };
});

app.controller('GridController', function($scope, ClaimantsData) {
    $scope.data = ClaimantsData;
    $scope.gridOptions = {
        data: 'data.claimants()',
        enableCellSelection: true,
        enableCellEdit: true,
        enableRowSelection: false,
        columnDefs:[
            {field: 'name',displayName: 'Name', enableCellEdit: true},
            {field:'claim', displayName:'Claim', enableCellEdit: true, editableCellTemplate: 'CellTemplate.html'},
            {field: 'payout',displayName: 'Payout', cellTemplate: 'PayoffCellTemplate.html'}

        ]
    };
});

function ClaimantsEditorControl($scope, ClaimantsData) {
    $scope.data = ClaimantsData;
}

function SliderControl($scope, ClaimantsData) {
    $scope.data = ClaimantsData;
}

function PayoffChartControl($scope, ClaimantsData) {

    $scope.data = ClaimantsData;

    $scope.chart = {
        options: {
            chart: {
                type: 'column'
            }
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            max: Engine.BankrupcyCaseWrapper.getMaximalEstateClaimant(ClaimantsData.claimants()),
            title: {
                text: 'Payment Per Creditor'
            }
        },
        series: [
            {showInLegend: false, name:"Payment", data: []}
        ],
        title: {
            text: 'Ketubot Bankrupcy Scenario'
        },
        loading: false
    };

    // watch the payout series (i.e. how much claimants are getting) and update the graph accordingly
    $scope.$watch('data.payoutSeries()', function(){
        var payoutSeriesArray = $scope.chart.series[0].data;
        clearArrayAndPopulateWith(payoutSeriesArray, ClaimantsData.payoutSeries());
    }, true);

    // watch the data categories i.e. claimant names and update accordingly
    $scope.$watch('data.categories()', function(){
        var categoriesArray = $scope.chart.xAxis.categories;
        clearArrayAndPopulateWith(categoriesArray, ClaimantsData.categories());
    }, true);

    // watch the claimants and see if the claims have changed
    $scope.$watch('data.claimants()', function(){
        // and update the maximal estate size on the axis accordingly
        $scope.chart.yAxis.max = Engine.BankrupcyCaseWrapper.getMaximalEstateClaimant(ClaimantsData.claimants());
    }, true);


    $scope.$watch('data.estate', function(){
        var payoutSeriesArray = $scope.chart.series[0].data;
        clearArrayAndPopulateWith(payoutSeriesArray, ClaimantsData.payoutSeries());
    }, true);
}