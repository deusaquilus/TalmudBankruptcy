/**
* Created by aioffe on 10/16/13.
*/
/// <reference path="./Claimant.ts" />
/// <reference path="./BankrupcySolution.ts" />
var Engine;
(function (Engine) {
    var BankrupcyCaseWrapper = (function () {
        function BankrupcyCaseWrapper() {
        }
        BankrupcyCaseWrapper.getMaximalEstateClaimant = function (claimants) {
            var maximalClaim = 0;

            claimants.forEach(function (claimant) {
                if (claimant.claim > maximalClaim) {
                    maximalClaim = claimant.claim;
                }
            });

            return maximalClaim;
        };

        BankrupcyCaseWrapper.resetPayoffsToZero = function (claimants) {
            claimants.forEach(function (claimant) {
                claimant.firstPassPayout = 0;
                claimant.secondPassPayout = 0;
            });
        };

        BankrupcyCaseWrapper.getCategories = function (claimants) {
            var categories = [];
            claimants.forEach(function (claimant) {
                categories.push(claimant.name);
            });
            return categories;
        };

        BankrupcyCaseWrapper.runEngine = function (claimants, estate) {
            // Need to create a new claimants array here that is sorted
            // (i.e. the copy since the bankrupcy algorithm relies on them being sorted)
            var scenarioClaimants = claimants.slice(0);
            scenarioClaimants.sort(function (a, b) {
                return a.claim - b.claim;
            });

            // now run the scenario on the dataset
            var solutionEngine = new Engine.BankrupcySolution();
            solutionEngine.runScenario(scenarioClaimants, estate);
        };

        BankrupcyCaseWrapper.getPayouts = function (claimants) {
            var output = [];
            claimants.forEach(function (claimant) {
                output.push(claimant.payout);
            });
            return output;
        };

        BankrupcyCaseWrapper.getFirstPassPayouts = function (claimants) {
            var output = [];
            claimants.forEach(function (claimant) {
                output.push(claimant.firstPassPayout);
            });
            return output;
        };

        BankrupcyCaseWrapper.getSecondPassPayouts = function (claimants) {
            var output = [];
            claimants.forEach(function (claimant) {
                output.push(claimant.secondPassPayout);
            });
            return output;
        };

        BankrupcyCaseWrapper.createClaimants = function (minClaim, increment, numClaims) {
            var claims = [];
            for (var i = 0; i < numClaims; i++) {
                claims.push(i * increment + minClaim);
            }
            return Engine.BankrupcyCaseWrapper.createClaimantsFromClaims(claims);
        };

        BankrupcyCaseWrapper.createClaimantsFromClaims = function (claims) {
            var claimants = [];
            var i = 1;
            claims.forEach(function (claimAmount) {
                claimants.push(new Engine.Claimant("Claimant " + i, claimAmount));
                i++;
            });
            return claimants;
        };
        return BankrupcyCaseWrapper;
    })();
    Engine.BankrupcyCaseWrapper = BankrupcyCaseWrapper;
})(Engine || (Engine = {}));
//# sourceMappingURL=BankrupcyCaseWrapper.js.map
