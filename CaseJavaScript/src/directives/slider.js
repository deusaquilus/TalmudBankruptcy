app.directive("slider", function(){

    var sliderUtils = {
        verifyValidOrientation: function(orientation) {
            // using attrs for direction because for some reason '=' scope does not seem to work of strings
            // (i.e they become 'undefined') so instead we'll just do it like this...
            if (orientation != "vertical" && orientation != "horizontal") {
                throw new Error("orientation of the slider must be either vertical or horizontal");
            }
        },
        printToolTipLabel: function(toolTipPrinter, labelValue) {
            if (toolTipPrinter != undefined) {
                return toolTipPrinter(labelValue);
            }
            return labelValue;
        },
        trueIfUndefined: function(value) {
            return (value == undefined) ? true : value;
        }
    };




    return {
        restrict:"E",
        scope: {
            value:"=",
            min:"=",
            max:"=",
            step:"=",
            tooltiptitle:"@", // for some reason all attributes are casted to lower case in angular
            tooltipprinter: "=",
            tooltipenabled: "=",
            tooltipsize: "="
        },

        // you'l get a 'TypeError: undefined is not a function' if this isn't true & you use ng-transclude
        // or a bunch of other possible errors
        transclude: true,
        replace: true,

        link: function(scope, element, attrs) {

            sliderUtils.verifyValidOrientation(attrs.direction);

            var firstDivElement = element;

            var myPosition;
            var atPosition;

            // apparantly this seems to work by setting in css doesn't although the jquery slider
            // control claims that that's possible
            if (attrs.direction === "vertical") {
                myPosition = "left center";
                atPosition = "right center";
            } else {
                myPosition = "top center";
                atPosition = "bottom center";
            }

            firstDivElement.slider({
                value: scope.value,
                min: scope.min,
                max: scope.max,
                step: scope.step,
                orientation: attrs.direction,
                slide: function( event, ui ) {
                    // when the user adjusts the slider, update the value
                    scope.$apply("value=" + ui.value);
                }
            });

            // setup a tooltip printer to use
            var toolTipPrinter = scope.tooltipprinter;

            //var show = (scope.tooltipenabled != undefined) ? scope.tooltipenabled() : true;

            // get the handle to the slider drag control to paint the qtip on
            var handle = firstDivElement.find("a");
            var qtipInstance = handle.qtip({
                    content: {
                        title: {
                            text: attrs.tooltiptitle
                        },
                        text: sliderUtils.printToolTipLabel(toolTipPrinter, scope.value)
                    },
                    position: {
                        container: handle,
                        my: myPosition,
                        at: atPosition
                    },
                    show: false,
                    hide: true,
                    style: {
                        width: scope.tooltipsize,
                        classes: 'qtip-light qtip-rounded',
                        textAlign: 'center'
                    }
                });


            scope.$watch("value", function(newValue){
                // when the value changes outside the slider, update the slider
                firstDivElement.slider("value", newValue);

                // TODO This is a lot of work to call a these every time something is moved
                // see if we can move these things out into some other method and keep
                // a boolean to make sure that it's changed the first time this field is used
                qtipInstance.qtip('option', 'content.text', sliderUtils.printToolTipLabel(toolTipPrinter, scope.value));
                //qtipInstance.qtip('option', 'style.width', 60);
                //qtipInstance.qtip('option', 'style.classes', "qtip-light");
            });

            scope.$watch("max", function(newValue){
                firstDivElement.slider("option", "max", newValue);
                qtipInstance.qtip('option', 'content.text', sliderUtils.printToolTipLabel(toolTipPrinter, scope.value));
                //qtipInstance.qtip('option', 'style.width', 60);
                //qtipInstance.qtip('option', 'style.classes', "qtip-light");
            });

            scope.$watch("step", function(newValue){
                firstDivElement.slider("option", "step", newValue);
            });

            scope.$watch("tooltipenabled", function(newValue){
                if (sliderUtils.trueIfUndefined(scope.tooltipenabled)) {
                    qtipInstance.qtip('show');
                } else {
                    qtipInstance.qtip('hide');
                }
            });

        },
        template: '<div ng-transclude></div>'
    }
});

