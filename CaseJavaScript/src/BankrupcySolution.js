/**
* Created by aioffe on 10/16/13.
*/
/// <reference path="./Claimant.ts" />
var Engine;
(function (Engine) {
    var BankrupcySolution = (function () {
        function BankrupcySolution() {
        }
        BankrupcySolution.prototype.runScenario = function (claimants, totalEstate) {
            var remaining = this.upwardFiller(claimants, totalEstate);
            remaining = this.downwardFiller(claimants, remaining);
            return remaining;
        };

        BankrupcySolution.prototype.downwardFiller = function (claimants, totalEstate) {
            // produce a list of the _claimants, highest to lowest
            var downardClaimants = claimants.slice(0);
            var accountLeft = totalEstate;

            // remove the highest value claimant and add to the 'compenseers' list, we start
            // by putting the highest claimant into that list
            var compenseers = [];
            this.addFirstFromLast(compenseers, downardClaimants);

            while (downardClaimants.length > 0 && accountLeft > 0) {
                // get their difference with the next-lowest claimant (if next-lowest claimant doesn't exist it's zero)
                var upwardDifference = this.findUpwardDifference(downardClaimants, compenseers);

                // compensate this difference to all the compenseers (if no money left at this point then exit)
                accountLeft = this.redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft, false);

                // put the next lowest into the compenseers (beginning of the array) and continue
                this.addFirstFromLast(compenseers, downardClaimants);
            }

            // at this point we need to distribute to the lowest claimant (downwardClaimants is zero)
            // and his updardDifference is compared to zero but the findUpwardDifference method can do that
            var upwardDifference = this.findUpwardDifference(downardClaimants, compenseers);
            accountLeft = this.redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft, false);

            return accountLeft;
        };

        BankrupcySolution.prototype.addFirstFromLast = function (toAddTo, toRemoveFrom) {
            toAddTo.push(toRemoveFrom.pop());
        };

        BankrupcySolution.prototype.findUpwardDifference = function (downwardClaimants, compenseers) {
            var lowestCompenseer = compenseers[0];

            if (downwardClaimants.length == 0) {
                return lowestCompenseer.loss;
            }

            var highestUnpaidClaimant = downwardClaimants[downwardClaimants.length - 1];

            return lowestCompenseer.loss - highestUnpaidClaimant.loss;
        };

        BankrupcySolution.prototype.upwardFiller = function (claimants, totalEstate) {
            var upwardClaimants = claimants.slice(0);
            var remainingEstate = totalEstate;
            while (remainingEstate > 0 && upwardClaimants.length > 0) {
                remainingEstate = this.upwardIncrementSplitter(upwardClaimants, remainingEstate);
                upwardClaimants.splice(0, 1);
            }
            return remainingEstate;
        };

        // assumes _claimants are sorted, lowest-claim claimant to higher claim claimant
        // returns amount of _estate left
        BankrupcySolution.prototype.upwardIncrementSplitter = function (claimants, totalEstate) {
            if (claimants.length == 0) {
                return totalEstate;
            }

            // special case if there is one claimant then the standard procedure
            // below should still work
            var lowestClaimant = claimants[0];

            // get the lowest-claim claimant's half payout
            var lowestHalfClaim = lowestClaimant.halfClaim;

            // find the difference between what they have NOW (i.e. already), and their half payment
            var lowestDifferenceInterval = lowestHalfClaim - lowestClaimant.payout;

            // redeem the _claimants from the _estate up to that amount
            //noinspection UnnecessaryLocalVariableJS
            var remainingEstate = this.redeemClaimantsEquallyUpToAmount(claimants, lowestDifferenceInterval, totalEstate, true);

            return remainingEstate;
        };

        BankrupcySolution.prototype.redeemClaimantsEquallyUpToAmount = function (claimants, redeemAmount, totalAccount, isFirstPass) {
            // find the total sum that would be owed to the _claimants
            var totalRedeemAmount = redeemAmount * claimants.length;

            if (totalAccount >= totalRedeemAmount) {
                this.redeemClaimantsEqually(claimants, redeemAmount, isFirstPass);
                return (totalAccount - totalRedeemAmount);
            }

            // otherwise split the money equally... and return 0
            var insufficientRedeemAmount = totalAccount / claimants.length;
            this.redeemClaimantsEqually(claimants, insufficientRedeemAmount, isFirstPass);

            return 0;
        };

        BankrupcySolution.prototype.redeemClaimantsEqually = function (claimants, redeemAmount, isFirstPass) {
            claimants.forEach(function (claimant) {
                if (isFirstPass) {
                    claimant.firstPassPayout = claimant.firstPassPayout + redeemAmount;
                } else {
                    claimant.secondPassPayout = claimant.secondPassPayout + redeemAmount;
                }
            });
        };
        return BankrupcySolution;
    })();
    Engine.BankrupcySolution = BankrupcySolution;
})(Engine || (Engine = {}));
//# sourceMappingURL=BankrupcySolution.js.map
