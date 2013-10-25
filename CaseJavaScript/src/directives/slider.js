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
        replace: true,

        link: function(scope, element, attrs) {

//            // using attrs for direction because for some reason '=' scope does not seem to work of strings
//            // (i.e they become 'undefined') so instead we'll just do it like this...
//            var direction = attrs.direction;
//            if (direction != "vertical" && direction != "horizontal") {
//                throw new Error("orientation of the slider must be either vertical or horizontal");
//            }
//
            var firstDivElement = element;



            // apparantly this seems to work by setting in css doesn't although the jquery slider
            // control claims that that's possible
            if (attrs.direction === "vertical") {
                // Don't put sizing constraints here because they could be broken with stuff
                // like vw coordiantes and not appear at all. Use css somewhere to style this
                //firstDivElement.height("100%");
                //firstDivElement.width("5px");

                firstDivElement.slider({
                    value: scope.value,
                    min: scope.min,
                    max: scope.max,
                    step: scope.step,
                    orientation:"vertical",
                    slide: function( event, ui ) {
                        // when the user adjusts the slider, update the value
                        scope.$apply("value=" + ui.value);

                        //$('.qtip:visible').qtip('reposition');

                    }
                });


            } else {

                // Don't put sizing constraints here because they could be broken with stuff
                // like vw coordiantes and not appear at all. Use css somewhere to style this
                //firstDivElement.width("100%");
                //firstDivElement.height("5px");

                firstDivElement.slider({
                    value: scope.value,
                    min: scope.min,
                    max: scope.max,
                    step: scope.step,
                    slide: function( event, ui ) {
                        // when the user adjusts the slider, update the value
                        scope.$apply("value=" + ui.value);

                        //$('.qtip:visible').qtip('reposition');

                    }
                });
            }

            var handle = firstDivElement.find("a");
            var qtipInstance = handle.qtip();

            //
            scope.$watch("value", function(newValue){
                // when the value changes outside the slider, update the slider
                firstDivElement.slider("value", newValue);

                // TODO This is a lot of work to call a these every time something is moved
                // see if we can move these things out into some other method and keep
                // a boolean to make sure that it's changed the first time this field is used
//                qtipInstance.qtip('option', 'content.text', newValue);
//                qtipInstance.qtip('option', 'style.width', 60);
//                qtipInstance.qtip('option', 'style.classes', "qtip-light");
            });

            scope.$watch("max", function(newValue){
                firstDivElement.slider("option", "max", newValue);
//                qtipInstance.qtip('option', 'content.text', newValue);
//                qtipInstance.qtip('option', 'style.width', 60);
//                qtipInstance.qtip('option', 'style.classes', "qtip-light");
            });

        },
        template: '<div ng-transclude></div>'
    }
});

