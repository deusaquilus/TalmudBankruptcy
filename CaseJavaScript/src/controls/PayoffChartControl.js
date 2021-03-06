/**
 * Created by aioffe on 10/26/13.
 */

// a service consisting of static functions to control the chart rendering. Note that in angular
// all functions are automatically interpreted as controllers so we have to define user-custom
// functionality inside of a factory
app.factory('ChartControlService', function(){
    return {
        generateOnePassPaymentSeries: function () {
            return [{showInLegend: false, name:"Payment", data: []}];
        },

        watchOnePassPaymentSeries: function (myScope, ClaimantsData) {
            myScope.$watch('data.payoutSeries()', function(){
                var payoutSeriesArray = myScope.chart.series[0].data;
                clearArrayAndPopulateWith(payoutSeriesArray, ClaimantsData.payoutSeries());
            }, true);
            myScope.$watch('data.estate', function(){
                var payoutSeriesArray = myScope.chart.series[0].data;
                clearArrayAndPopulateWith(payoutSeriesArray, ClaimantsData.payoutSeries());
            }, true);
        },

        generateTwoPassPaymentSeries: function () {
            return [
                {showInLegend: true, name:"Second Pass Payment", data: [], index:1},
                {showInLegend: true, name:"First Pass Payment", data: [], index:0}
            ];
        },

        watchTwoPassPaymentSeries: function (myScope, ClaimantsData) {
            var firstPayoutSeriesArray;
            var secondPayoutSeriesArray;
            myScope.$watch('data.firstPassSeries()', function(){
                firstPayoutSeriesArray = myScope.chart.series[1].data;
                clearArrayAndPopulateWith(firstPayoutSeriesArray, ClaimantsData.firstPassSeries());
            }, true);
            myScope.$watch('data.estate', function(){
                var payoutSeriesArray = myScope.chart.series[1].data;
                clearArrayAndPopulateWith(payoutSeriesArray, ClaimantsData.firstPassSeries());
            }, true);

            myScope.$watch('data.secondPassSeries()', function(){
                secondPayoutSeriesArray = myScope.chart.series[0].data;
                clearArrayAndPopulateWith(secondPayoutSeriesArray, ClaimantsData.secondPassSeries());
            }, true);
            myScope.$watch('data.estate', function(){
                var payoutSeriesArray = myScope.chart.series[0].data;
                clearArrayAndPopulateWith(payoutSeriesArray, ClaimantsData.secondPassSeries());
            }, true);
        }
    };
});


app.factory('ChartColorService', function(MiscUtil){
    var defaultColors = ['#2f7ed8', '#0d233a'];

    return {
        getColorScheme: function(reversed) {
            if (reversed) {
                // return a reversed copy if the user asked to reverse the scheme
                return defaultColors.slice(0).reverse();
            }
            return defaultColors.slice(0);
        },
        formatToolTip: function(useHeader) {
            var point = this;
            var printedValue = MiscUtil.round2DollarValue(point.y);
            var series = point.series;

            return ['<span style="color:' + series.color + '">', (point.name || series.name), '</span>: ',
                (!useHeader ? ('<b>x = ' + (point.name || point.x) + ',</b> ') : ''),
                '<b>', (!useHeader ? 'y = ' : ''), printedValue, '</b>'].join('');
        }
    }
});


app.controller('PayoffChartControl', function(
    $scope,
    ClaimantsData,
    InputParameters,
    ChartControlService,
    ChartColorService) {

    var initialSeries;
    if (InputParameters.isTwoPass) {
        initialSeries = ChartControlService.generateTwoPassPaymentSeries();

        var themeColors = Highcharts.getOptions

    } else {
        initialSeries = ChartControlService.generateOnePassPaymentSeries();
    }


    $scope.data = ClaimantsData;

    $scope.chart = {
        options: {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            tooltip: {
                formatter: ChartColorService.formatToolTip

            },
            colors: ChartColorService.getColorScheme(InputParameters.isTwoPass)
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
        series: initialSeries,
        title: {
            text: 'Ketubot Bankrupcy Scenario'
        },
        loading: false
    };

    if (InputParameters.isTwoPass) {
        ChartControlService.watchTwoPassPaymentSeries($scope, ClaimantsData);
    } else {
        ChartControlService.watchOnePassPaymentSeries($scope, ClaimantsData);
    }

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
});