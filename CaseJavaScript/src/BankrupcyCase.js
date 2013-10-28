/**
 * Created by aioffe on 10/22/13.
 */

var app = angular.module('myApp', ['ngGrid', "highcharts-ng", 'ui.bootstrap'],function($locationProvider) {
    $locationProvider.html5Mode(true);
});

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


app.factory('MiscUtil', function(){
    return {
        round2DollarValue: function(value) {
            var output = Math.round(value * 100) / 100;
            return "$" + output;
        }
    }
});


app.filter('round2DollarValueFilter', function(MiscUtil){
    return function(value) {
        return MiscUtil.round2DollarValue(value);
    }
});


function GlobalApplicationControl($scope, MiscUtil) {
    $scope.collapseData = {
        isCollapsed: false,
        notCollapsed: function() {
            return this.isCollapsed;
        }
    };
    $scope.util = {
        dollarValuePrintingFunction: function(value) {
            return MiscUtil.round2DollarValue(value);
        },
        validateControl:function(theEvent) {
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode( key );
            var regex = /[0-9]|\./;
            if( !regex.test(key) ) {
                theEvent.returnValue = false;
                if(theEvent.preventDefault) theEvent.preventDefault();
            }
        },
        snapByFive: true,
        getSnapAmount: function() {
            return (this.snapByFive ? 5 : 1);
        }
    };
}

app.factory('InputParameters', function($location) {
    return {
        isTwoPass: ($location.search()['twopass'] != undefined),
        showdetails: ($location.search()['showdetails'] != undefined)
    }
});


app.factory('ClaimantsData', function(){
    return {
        estate: 300,
        numClaimants:3,
        maxNumClaimants:10,
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
            clearArrayAndPopulateWith(
                this.payoutSeriesInternal,
                Engine.BankrupcyCaseWrapper.getPayouts(this.claimants()));
            return this.payoutSeriesInternal;
        },

        firstPassSeriesInternal:[],
        firstPassSeries: function() {
            clearArrayAndPopulateWith(
                this.firstPassSeriesInternal,
                Engine.BankrupcyCaseWrapper.getFirstPassPayouts(this.claimants()));
            return this.firstPassSeriesInternal;
        },
        secondPassSeriesInternal:[],
        secondPassSeries: function() {
            clearArrayAndPopulateWith(
                this.secondPassSeriesInternal,
                Engine.BankrupcyCaseWrapper.getSecondPassPayouts(this.claimants()));
            return this.secondPassSeriesInternal;
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

app.controller('GridController', function($scope, ClaimantsData, InputParameters) {
    $scope.data = ClaimantsData;

    var columnDefs = [
        {field: 'name',displayName: 'Name', enableCellEdit: true},
        {field:'claim', displayName:'Claim', enableCellEdit: true, editableCellTemplate: 'CellTemplate.html'},
        {field: 'payout',displayName: 'Payout', cellTemplate: 'PayoffCellTemplate.html'}
    ];

    // if this is a 2-pass visualization, add the additional fields
    if (InputParameters.isTwoPass) {
        columnDefs.push({field: 'firstPassPayout',displayName: '1st Pass', cellTemplate: 'PayoffCellTemplate.html'});
        columnDefs.push({field: 'secondPassPayout',displayName: '2nd Pass', cellTemplate: 'PayoffCellTemplate.html'});
    }

    $scope.gridOptions = {
        data: 'data.claimants()',
        enableCellSelection: true,
        enableCellEdit: true,
        enableRowSelection: false,
        columnDefs: columnDefs
    };
});

function ClaimantsEditorControl($scope, ClaimantsData) {
    $scope.data = ClaimantsData;
}

function SliderControl($scope, ClaimantsData) {
    $scope.data = ClaimantsData;
}
