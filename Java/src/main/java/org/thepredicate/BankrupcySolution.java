package org.thepredicate;

import java.util.ArrayList;
import java.util.List;

/**
 * An implementation of Robert Aumann and Michael Maschler's  algoritm for estate distribution
 * as outlined in 'Game Theoretic Analysis of a Bankrupcy Problem from the Talmud'. The paper
 * is available here:
 * http://www.sscnet.ucla.edu/polisci/faculty/chwe/austen/aumann1985.pdf
 *
 * A good explanation of the scenario here:
 * http://www.sscnet.ucla.edu/polisci/faculty/chwe/austen/aumann1985.pdf
 *
 * @author aioffe
 *
 */
public class BankrupcySolution {

	/**
	 * Run the full Aumann/Maschler algorithm. See {@link #upwardFiller(List, double)}
	 * and {@link #downwardFiller(List, double)} for more details.
	 *
	 * @param claimants The estate creditors
	 * @param totalEstate The total value of the estate
	 * @return amount of estate left after all the distributions are done
	 */
	public static double runScenario(List<Claimant> claimants, double totalEstate) {
		double remaining = BankrupcySolution.upwardFiller(claimants, totalEstate);
		remaining = BankrupcySolution.downwardFiller(claimants, remaining);
		return remaining;
	}

	/**
	 * Run the second part of the Aumann/Maschler algorithm which is roughly described as:
	 *
	 * <ol>
	 * <li>Start giving the highest-claim money from the estate until the loss, the difference between the claim and the
	 * award, equals the loss for the next highest creditor.</li>
	 * <li>Then divide the estate equally among the highest creditors until the loss of the highest creditors equals the loss of the next highest.
	 * <li>Continue until all money has been awarded.
	 * <ol>
	 *
	 * @param claimants The estate creditors
	 * @param totalEstate The total value of the estate
	 * @return amount of estate left
	 */
	static double downwardFiller(List<Claimant> claimants, double totalEstate) {
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
			accountLeft = redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft, false);

			// put the next lowest into the compenseers (beginning of the array) and continue
			addFirstFromLast(compenseers, downardClaimants);
		}

		// at this point we need to distribute to the lowest claimant (downwardClaimants is zero)
		// and his updardDifference is compared to zero but the findUpwardDifference method can do that
		double upwardDifference = findUpwardDifference(downardClaimants, compenseers);
		accountLeft = redeemClaimantsEquallyUpToAmount(compenseers, upwardDifference, accountLeft, false);

		return accountLeft;
	}

	static void addFirstFromLast(List<Claimant> toAddTo, List<Claimant> toRemoveFrom) {
		toAddTo.add(0, toRemoveFrom.remove(toRemoveFrom.size() - 1));
	}

	static double findUpwardDifference(List<Claimant> downwardClaimants, List<Claimant> compenseers) {
		Claimant lowestCompenseer = compenseers.get(0);

		if (downwardClaimants.size() == 0) {
			return lowestCompenseer.getLoss();
		}

		Claimant highestUnpaidClaimant = downwardClaimants.get(downwardClaimants.size() - 1);

		return lowestCompenseer.getLoss() - highestUnpaidClaimant.getLoss();
	}

	/**
	 * Run the first part of the Aumann/Maschler algorithm which is roughly described as:
	 *
	 * <ol>
	 * <li>Order the creditors from lowest to highest claims <b>(does not do this, assumes the creditors are already sorted)</b>
	 * <li>Divide the estate equally among all parties until the lowest creditor receives one half of the claim.
	 * <li>Divide the estate equally among all parties except the lowest creditor until the next lowest creditor receives one half of the claim.
	 * <li>Proceed until each creditor has reached one-half of the original claim.
	 * </ol>
	 *
	 * As I mentioned above, this assumes claimants are sorted, lowest-claim claimant to higher claim claimant
	 * @param claimants The estate creditors
	 * @param totalEstate The total value of the estate
	 * @return amount of estate left
	 */
	static double upwardFiller(List<Claimant> claimants, double totalEstate) {
		ArrayList<Claimant> upwardClaimants = new ArrayList<Claimant>(claimants);
		double remainingEstate = totalEstate;
		while (remainingEstate > 0 && upwardClaimants.size() > 0) {
			remainingEstate = upwardIncrementSplitter(upwardClaimants, remainingEstate);
			upwardClaimants.remove(0);
		}
		return remainingEstate;
	}


	static double upwardIncrementSplitter(List<Claimant> claimants, double totalEstate) {
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
		double lowestDifferenceInterval = lowestHalfClaim - lowestClaimant.getPayout();

		// redeem the claimants from the estate up to that amount
		double remainingEstate = redeemClaimantsEquallyUpToAmount(claimants, lowestDifferenceInterval, totalEstate, true);

		return remainingEstate;
	}

	public static double redeemClaimantsEquallyUpToAmount(List<Claimant> claimants, double redeemAmount, double totalAccount, boolean isFirstPass) {
		// find the total sum that would be owed to the claimants
		double totalRedeemAmount = redeemAmount * claimants.size();

		// if the estate has enough to pay them equally, do that... and then return amount of money left
		if (totalAccount >= totalRedeemAmount) {
			redeemClaimantsEqually(claimants, redeemAmount, isFirstPass);
			return (totalAccount - totalRedeemAmount);
		}

		// otherwise split the money equally... and return 0
		double insufficientRedeemAmount = totalAccount / claimants.size();
		redeemClaimantsEqually(claimants, insufficientRedeemAmount, isFirstPass);

		return 0;
	}

	private static void redeemClaimantsEqually(List<Claimant> claimants, double redeemAmount, boolean isFirstPass) {
		for (Claimant claimant : claimants) {

			if (isFirstPass) {
				claimant.setFirstPassPayout(claimant.getFirstPassPayout() + redeemAmount);
			} else {
				claimant.setSecondPassPayout(claimant.getSecondPassPayout() + redeemAmount);
			}
		}
	}



}
