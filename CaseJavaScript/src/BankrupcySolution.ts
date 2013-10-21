/**
 * Created by aioffe on 10/16/13.
 */
/// <reference path="./Claimant.ts" />
module Engine {

    export class BankrupcySolution {

        public runScenario(claimants:Array<Engine.Claimant>, totalEstate:number):number {
            var remaining:number = this.upwardFiller(claimants, totalEstate);
            remaining = this.downwardFiller(claimants, remaining);
            return remaining;
        }

        public downwardFiller(claimants:Array<Engine.Claimant>, totalEstate:number):number {
            // produce a list of the _claimants, highest to lowest
            var downardClaimants:Array<Engine.Claimant> = claimants.slice(0);
            var accountLeft:number = totalEstate;

            // remove the highest value claimant and add to the 'compenseers' list, we start
            // by putting the highest claimant into that list
            var compenseers:Array<Engine.Claimant> = [];
            this.addFirstFromLast(compenseers, downardClaimants);

            // while the _estate has money and there are more _claimants to be compensated
            while (downardClaimants.length > 0 && accountLeft > 0) {

                // get their difference with the next-lowest claimant (if next-lowest claimant doesn't exist it's zero)
                var upwardDifference:number = this.findUpwardDifference(downardClaimants, compenseers);

                // compensate this difference to all the compenseers (if no money left at this point then exit)
                accountLeft = this.redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft, false);

                // put the next lowest into the compenseers (beginning of the array) and continue
                this.addFirstFromLast(compenseers, downardClaimants);
            }

            // at this point we need to distribute to the lowest claimant (downwardClaimants is zero)
            // and his updardDifference is compared to zero but the findUpwardDifference method can do that
            var upwardDifference:number = this.findUpwardDifference(downardClaimants, compenseers);
            accountLeft = this.redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft, false);

            return accountLeft;
        }


        public addFirstFromLast(toAddTo:Array<Engine.Claimant>, toRemoveFrom:Array<Engine.Claimant>):void {
            toAddTo.push(toRemoveFrom.pop());
        }

        public findUpwardDifference(downwardClaimants:Array<Engine.Claimant>, compenseers:Array<Engine.Claimant>):number {
            var lowestCompenseer:Engine.Claimant = compenseers[0];

            if (downwardClaimants.length == 0) {
                return lowestCompenseer.loss;
            }

            var highestUnpaidClaimant:Engine.Claimant = downwardClaimants[downwardClaimants.length - 1];

            return lowestCompenseer.loss - highestUnpaidClaimant.loss;
        }

        public upwardFiller(claimants:Array<Engine.Claimant>, totalEstate:number):number {
            var upwardClaimants:Array<Engine.Claimant> = claimants.slice(0);
            var remainingEstate = totalEstate;
            while (remainingEstate > 0 && upwardClaimants.length > 0) {
                remainingEstate = this.upwardIncrementSplitter(upwardClaimants, remainingEstate);
                upwardClaimants.splice(0, 1);
            }
            return remainingEstate;
        }

        // assumes _claimants are sorted, lowest-claim claimant to higher claim claimant
        // returns amount of _estate left
        private upwardIncrementSplitter(claimants:Array<Engine.Claimant>, totalEstate:number):number {
            // special case if there are no _claimants
            if (claimants.length == 0) {
                return totalEstate;
            }

            // special case if there is one claimant then the standard procedure
            // below should still work

            var lowestClaimant:Engine.Claimant = claimants[0];

            // get the lowest-claim claimant's half payout
            var lowestHalfClaim:number = lowestClaimant.halfClaim;

            // find the difference between what they have NOW (i.e. already), and their half payment
            var lowestDifferenceInterval:number = lowestHalfClaim - lowestClaimant.payout;

            // redeem the _claimants from the _estate up to that amount
            //noinspection UnnecessaryLocalVariableJS
            var remainingEstate:number = this.redeemClaimantsEquallyUpToAmount(claimants, lowestDifferenceInterval, totalEstate, true);

            return remainingEstate;
        }

        private redeemClaimantsEquallyUpToAmount(
            claimants:Array<Engine.Claimant>,
            redeemAmount:number,
            totalAccount:number,
            isFirstPass:boolean):number {

            // find the total sum that would be owed to the _claimants
            var totalRedeemAmount:number = redeemAmount * claimants.length;

            // if the _estate has enough to pay them equally, do that... and then return amount of money left
            if (totalAccount >= totalRedeemAmount) {
                this.redeemClaimantsEqually(claimants, redeemAmount, true);
                return (totalAccount - totalRedeemAmount);
            }

            // otherwise split the money equally... and return 0
            var insufficientRedeemAmount:number = totalAccount / claimants.length;
            this.redeemClaimantsEqually(claimants, insufficientRedeemAmount, isFirstPass);

            return 0;
        }

        private redeemClaimantsEqually(claimants:Array<Engine.Claimant>, redeemAmount:number, isFirstPass:boolean):void {
            claimants.forEach(function(claimant:Engine.Claimant){
                if (isFirstPass) {
                    claimant.firstPassPayout = claimant.firstPassPayout + redeemAmount;
                } else {
                    claimant.secondPassPayout = claimant.secondPassPayout + redeemAmount;
                }
            });
        }
    }
}