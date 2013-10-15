package org.thepredicate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import junit.framework.Assert;


import org.junit.Test;
import org.thepredicate.BankrupcySolution;
import org.thepredicate.BankrupcySolution.Claimant;

public class UpwardFillerTest {

	public static List<Double> getPayouts(List<Claimant> claimants) {
		List<Double> output = new ArrayList<Double>(claimants.size());
		for (Claimant claimant : claimants) {
			output.add(claimant.payout);
		}
		return output;
	}

	public static List<Double> roundDoubles(List<Double> list) {
		List<Double> output = new ArrayList<Double>(list.size());
		for (Double num : list) {
			output.add(round2(num));
		}
		return output;
	}

	public static double round2(double num) {
		double result = num * 100;
		result = Math.round(result);
		result = result / 100;
		return result;
	}

	public List<Claimant> createStanardClaimants() {
		return Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
	}

	public static void runStandardTest(double estateSize, double expectedPayout1, double expectedPayout2, double expectedPayout3, double expectedRemaining) {
		List<Claimant> claimants = Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
		double remaining = BankrupcySolution.upwardFiller(claimants, estateSize);

		Assert.assertEquals(
				Arrays.asList(expectedPayout1, expectedPayout2, expectedPayout3),
				roundDoubles(getPayouts(claimants)));

		Assert.assertEquals(expectedRemaining, round2(remaining));
	}


	@Test
	public void testInsufficientPayouts() {
		runStandardTest(50, 16.67d, 16.67d, 16.67d, 0d);
		runStandardTest(100, 33.33d, 33.33d, 33.33d, 0d);
		runStandardTest(200, 50d, 75d, 75d, 0d);
		runStandardTest(350, 50d, 100d, 150d, 50d);
		runStandardTest(400, 50d, 100d, 150d, 100d);
	}

	@Test
	public void testSufficientPayouts() {

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
