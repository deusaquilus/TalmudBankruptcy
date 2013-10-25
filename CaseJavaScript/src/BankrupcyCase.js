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
        replace:true,
        link: function(scope, element, attrs) {

            // TODO Write a validation function here to make sure it's not random string
            var valign = attrs.valign;
            var align = attrs.align;

            var jq = angular.element;
            var tableElementsJal = element.children().children().children();


//            var rowJal = jq("<tr></tr>");
//
//            if (valign != undefined) {
//                rowJal.css("vertical-align: " + valign);
//
//            }
            // TODO see if this works for text, doesn't seem to work or controls yet
//            if (align != undefined) {
//                table.attr("align", align);
//            }
            tableElementsJal.wrap("<td></td>");



            // append the row to the table
            //table.append(row);

            // remove the dummy inner div from the table
            //div.remove();
        },
        template: '<table><tr ng-transclude></tr></table>'
    }
});


app.directive("vbox", function(){
    return {
        restrict: "E",
        scope: true,
        transclude: true,
        replace:true,
        link: function(scope, element, attrs) {

            // TODO Write a validation function here to make sure it's not random string
            var valign = attrs.valign;
            var align = attrs.align;

            var jq = angular.element;
            var tableElementsJal = element.children();

            tableElementsJal.wrap("<tr><td></td></tr>");
        },
        template: '<table ng-transclude></table>'
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