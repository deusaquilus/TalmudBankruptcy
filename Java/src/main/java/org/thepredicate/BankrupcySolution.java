package org.thepredicate;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

public class BankrupcySolution {

	public static final double SIGMA = 0.01d;

	public static boolean approximatelyEquals(double number, double target) {
		double lowerBound = target - SIGMA;
		double upperBound = target + SIGMA;
		return (number >= lowerBound && number <= upperBound);
	}

	public static class Claimant {

		public Claimant(double claim) {
			this.claim = claim;
		}

		public double payout;
		public double claim;

		public double halfClaim() {
			return claim / 2d;
		}

		public double getLoss() {
			return claim - payout;
		}

		public boolean hasHalf() {
			return approximatelyEquals(payout, halfClaim());
		}

		@Override
		public String toString() {
			DecimalFormat df = new DecimalFormat("#.##");
			return "(Owe: " + df.format(claim) + ", Has: " + df.format(payout) + ")";
		}
	}

	public static double downwardFiller(List<Claimant> claimants, double totalEstate) {
		// produce a list of the claimants, highest to lowest
		List<Claimant> downardClaimants = new ArrayList<Claimant>(claimants);
		double accountLeft = totalEstate;

		// remove the highest value claimant and add to the 'compenseers' list, we start
		// by putting the highest claimant into that list
		List<Claimant> compenseers = new ArrayList<Claimant>();
		addFirstFromLast(compenseers, downardClaimants);

		// while the estate has money and there are more claimants to be compensated
		while (downardClaimants.size() > 0 && accountLeft > 0) {

			// get their difference with the next-lowest claimant (if next-lowest claimant doesn't exist it's zero)
			double upwardDifference = findUpwardDifference(downardClaimants, compenseers);

			// compensate this difference to all the compenseers (if no money left at this point then exit)
			accountLeft = redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft);

			// put the next lowest into the compenseers (beginning of the array) and continue
			addFirstFromLast(compenseers, downardClaimants);
		}

		// at this point we need to distribute to the lowest claimant (downwardClaimants is zero)
		// and his updardDifference is compared to zero but the findUpwardDifference method can do that
		double upwardDifference = findUpwardDifference(downardClaimants, compenseers);
		accountLeft = redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft);

		return accountLeft;
	}

	public static void addFirstFromLast(List<Claimant> toAddTo, List<Claimant> toRemoveFrom) {
		toAddTo.add(0, toRemoveFrom.remove(toRemoveFrom.size() - 1));
	}

	public static double findUpwardDifference(List<Claimant> downwardClaimants, List<Claimant> compenseers) {
		Claimant lowestCompenseer = compenseers.get(0);

		if (downwardClaimants.size() == 0) {
			return lowestCompenseer.getLoss();
		}

		Claimant highestUnpaidClaimant = downwardClaimants.get(downwardClaimants.size() - 1);

		return lowestCompenseer.getLoss() - highestUnpaidClaimant.getLoss();
	}


	public static double upwardFiller(List<Claimant> claimants, double totalEstate) {
		ArrayList<Claimant> upwardClaimants = new ArrayList<Claimant>(claimants);
		double remainingEstate = totalEstate;
		while (remainingEstate > 0 && upwardClaimants.size() > 0) {
			remainingEstate = incrementSplitter(upwardClaimants, remainingEstate);
			upwardClaimants.remove(0);
		}
		return remainingEstate;
	}


	// assumes claimants are sorted, lowest-claim claimant to higher claim claimant
	// returns amount of estate left
	public static double incrementSplitter(List<Claimant> claimants, double totalEstate) {
		// special case if there are no claimants
		if (claimants.size() == 0) {
			return totalEstate;
		}

		// special case if there is one claimant then the standard procedure
		// below should still work

		Claimant lowestClaimant = claimants.get(0);

		// get the lowest-claim claimant's half payout
		double lowestHalfClaim = lowestClaimant.halfClaim();

		// find the difference between what they have NOW (i.e. already), and their half payment
		double lowestDifferenceInterval = lowestHalfClaim - lowestClaimant.payout;

		// redeem the claimants from the estate up to that amount
		double remainingEstate = redeemClaimantsEquallyUpToAmount(claimants, lowestDifferenceInterval, totalEstate);

		return remainingEstate;
	}

	public static double redeemClaimantsEquallyUpToAmount(List<Claimant> claimants, double redeemAmount, double totalAccount) {
		// find the total sum that would be owed to the claimants
		double totalRedeemAmount = redeemAmount * claimants.size();

		// if the estate has enough to pay them equally, do that... and then return amount of money left
		if (totalAccount >= totalRedeemAmount) {
			redeemClaimantsEqually(claimants, redeemAmount);
			return (totalAccount - totalRedeemAmount);
		}

		// otherwise split the money equally... and return 0
		double insufficientRedeemAmount = totalAccount / claimants.size();
		redeemClaimantsEqually(claimants, insufficientRedeemAmount);

		return 0;
	}

	public static void redeemClaimantsEqually(List<Claimant> claimants, double redeemAmount) {
		for (Claimant claimant : claimants) {
			claimant.payout += redeemAmount;
		}
	}



}
