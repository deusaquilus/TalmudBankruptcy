/**
 * Created by aioffe on 10/16/13.
 */
/// <reference path="./Claimant.ts" />
/// <reference path="./BankruptcySolution.ts" />
module Engine {
    export class BankrupcyCaseWrapper {

        public static getMaximalEstateSize(claimants:Array<Engine.Claimant>):number {
            var maxEstateSize:number = 0;

            claimants.forEach(function(claimant:Engine.Claimant){
                maxEstateSize += claimant.claim;
            });

            return maxEstateSize;
        }


        public static getMaximalEstateClaimant(claimants:Array<Engine.Claimant>):number {
            var maximalClaim:number = 0;

            claimants.forEach(function(claimant:Engine.Claimant){
                if (claimant.claim > maximalClaim) {
                    maximalClaim = claimant.claim;
                }
            });

            return maximalClaim;
        }

        public static resetPayoffsToZero(claimants:Array<Engine.Claimant>):void {
            claimants.forEach(function(claimant:Engine.Claimant){
                claimant.firstPassPayout = 0;
                claimant.secondPassPayout = 0;
            });
        }

        public static getCategories(claimants:Array<Engine.Claimant>):Array<String> {
            var categories:Array<String> = [];
            claimants.forEach(function(claimant:Engine.Claimant){
                categories.push(claimant.name);
            });
            return categories;
        }


        public static runEngine(claimants:Array<Engine.Claimant>, estate:number):void {

            // Need to create a new claimants array here that is sorted
            // (i.e. the copy since the bankrupcy algorithm relies on them being sorted)
            var scenarioClaimants = claimants.slice(0);
            scenarioClaimants.sort(function(a:Engine.Claimant, b:Engine.Claimant){
                return a.claim - b.claim;
            });

            // now run the scenario on the dataset
            var solutionEngine:Engine.BankrupcySolution = new Engine.BankrupcySolution();
            solutionEngine.runScenario(scenarioClaimants, estate);
        }

        public static getPayouts(claimants:Array<Engine.Claimant>):Array<number> {
            var output:Array<number> = [];
            claimants.forEach(function(claimant:Engine.Claimant){
                output.push(claimant.payout);
            });
            return output;
        }

        public static getFirstPassPayouts(claimants:Array<Engine.Claimant>):Array<number> {
            var output:Array<number> = [];
            claimants.forEach(function(claimant:Engine.Claimant){
                output.push(claimant.firstPassPayout);
            });
            return output;
        }

        public static getSecondPassPayouts(claimants:Array<Engine.Claimant>):Array<number> {
            var output:Array<number> = [];
            claimants.forEach(function(claimant:Engine.Claimant){
                output.push(claimant.secondPassPayout);
            });
            return output;
        }

        public static createClaimants(minClaim:number, increment:number, numClaims:number) {
            var claims = [];
            for(var i=0;i<numClaims;i++) {
                claims.push(i * increment + minClaim);
            }
            return Engine.BankrupcyCaseWrapper.createClaimantsFromClaims(claims);
        }

        public static createClaimantsFromClaims(claims:Array<number>):Array<Engine.Claimant> {
            var claimants:Array<Engine.Claimant> = [];
            var i:number = 1;
            claims.forEach(function(claimAmount:number){
                claimants.push(new Engine.Claimant("Creditor " + i, claimAmount));
                i++;
            });
            return claimants;
        }



    }
}