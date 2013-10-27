/**
 * Created by aioffe on 10/16/13.
 */
module Engine {
    export class Claimant {
        // NOTE, java properties ALWYAS need to be initialized to zero or the interpreter
        // will think that they are initially null and not treat them like numbers
        // making their addition/subtraction products etc... NaNs

        private _firstPassPayout:number = 0;

        private _secondPassPayout:number = 0;

        private _claim:number = 0;

        private _name:string = "";

        constructor(name:string, claim:number) {
            this.claim = claim;
            this._name = name;
        }

        public get name():string {
            return this._name;
        }

        public set name(newName:string) {
            this._name = newName;
        }

        public get halfClaim():number {
            return this.claim / Number(2);
        }

        public get loss():number {
            return this.claim - this.payout;
        }

        public get claim():number {
            return this._claim;
        }

        public set claim(claim:number) {
            this._claim = Number(claim);
        }

        public get payout() {
            return this._firstPassPayout + this._secondPassPayout;
        }

        public toString():String {
            return "(Owe: " + this.claim + ", Has: " + this.payout + ")";
        }


        public get firstPassPayout():number {
            return this._firstPassPayout;
        }

        public set firstPassPayout(firstPassPayout:number) {
            this._firstPassPayout = Number(firstPassPayout);
        }

        public get secondPassPayout():number {
            return this._secondPassPayout;
        }

        public set secondPassPayout(secondPassPayout:number) {
            this._secondPassPayout = Number(secondPassPayout);
        }

    }


}