package org.thepredicate;

import static org.thepredicate.Utils.getPayouts;
import static org.thepredicate.Utils.roundDoubles;

import java.util.Arrays;
import java.util.List;


public class Main {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		for (int i=0; i<20; i++) {
			double estate = 50 * i;

			List<Claimant> claimants = Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
			double remaining = BankrupcySolution.upwardFiller(claimants, estate);
			remaining = BankrupcySolution.downwardFiller(claimants, remaining);

			System.out.println(estate + " == " + roundDoubles(getPayouts(claimants)) + " == " + remaining);
		}

//		double estate = 350;
//
//		List<Claimant> claimants = Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
//		double remaining = BankrupcySolution.upwardFiller(claimants, estate);
//		remaining = BankrupcySolution.downwardFiller(claimants, remaining);
//
//		System.out.println(estate + " == " + roundDoubles(getPayouts(claimants)) + " == " + remaining);
	}



}
