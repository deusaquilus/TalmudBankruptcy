/**
* Created by aioffe on 10/16/13.
*/
var Engine;
(function (Engine) {
    var Claimant = (function () {
        function Claimant(name, claim) {
            // NOTE, java properties ALWYAS need to be initialized to zero or the interpreter
            // will think that they are initially null and not treat them like numbers
            // making their addition/subtraction products etc... NaNs
            this._firstPassPayout = 0;
            this._secondPassPayout = 0;
            this._claim = 0;
            this._name = "";
            this.claim = claim;
            this._name = name;
        }
        Object.defineProperty(Claimant.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (newName) {
                this._name = newName;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Claimant.prototype, "halfClaim", {
            get: function () {
                return this.claim / Number(2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Claimant.prototype, "loss", {
            get: function () {
                return this.claim - this.payout;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Claimant.prototype, "claim", {
            get: function () {
                return this._claim;
            },
            set: function (claim) {
                this._claim = Number(claim);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Claimant.prototype, "payout", {
            get: function () {
                return this._firstPassPayout + this._secondPassPayout;
            },
            enumerable: true,
            configurable: true
        });

        Claimant.prototype.toString = function () {
            return "(Owe: " + this.claim + ", Has: " + this.payout + ")";
        };

        Object.defineProperty(Claimant.prototype, "firstPassPayout", {
            get: function () {
                return this._firstPassPayout;
            },
            set: function (firstPassPayout) {
                this._firstPassPayout = Number(firstPassPayout);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Claimant.prototype, "secondPassPayout", {
            get: function () {
                return this._secondPassPayout;
            },
            set: function (firstPassPayout) {
                this._secondPassPayout = Number(firstPassPayout);
            },
            enumerable: true,
            configurable: true
        });

        return Claimant;
    })();
    Engine.Claimant = Claimant;
})(Engine || (Engine = {}));
//# sourceMappingURL=Claimant.js.map
