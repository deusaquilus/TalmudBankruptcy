package org.thepredicate;

import static org.thepredicate.Utils.getPayouts;
import static org.thepredicate.Utils.round2;
import static org.thepredicate.Utils.roundDoubles;

import java.util.Arrays;
import java.util.List;

import junit.framework.Assert;

import org.junit.Test;

public class FillersTest {



	public static void runUpwardFillerTest(
			double estateSize,
			double expectedPayout1,
			double expectedPayout2,
			double expectedPayout3,
			double expectedRemaining) {

		List<Claimant> claimants = Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
		double remaining = BankrupcySolution.upwardFiller(claimants, estateSize);

		Assert.assertEquals(
				Arrays.asList(expectedPayout1, expectedPayout2, expectedPayout3),
				roundDoubles(getPayouts(claimants)));

		Assert.assertEquals(expectedRemaining, round2(remaining));
	}

	@Test
	public void fullScenarioBothSeriesTest() {
		List<Claimant> claimants = Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
		double remaining = BankrupcySolution.runScenario(claimants, 600);

		for (Claimant claimant : claimants) {
			System.out.println(claimant.getClaim() + ": " + claimant.getFirstPassPayout() + ", " + claimant.getSecondPassPayout());
		}
	}


	public static void runFullScenarioTest(
			double estateSize,
			double expectedPayout1,
			double expectedPayout2,
			double expectedPayout3,
			double expectedRemaining) {

		List<Claimant> claimants = Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
		double remaining = BankrupcySolution.runScenario(claimants, estateSize);

		Assert.assertEquals(
				Arrays.asList(expectedPayout1, expectedPayout2, expectedPayout3),
				roundDoubles(getPayouts(claimants)));

		Assert.assertEquals(expectedRemaining, round2(remaining));
	}


	@Test
	public void testUpwardFiller() {
		runUpwardFillerTest(50, 16.67d, 16.67d, 16.67d, 0d);
		runUpwardFillerTest(100, 33.33d, 33.33d, 33.33d, 0d);
		runUpwardFillerTest(200, 50d, 75d, 75d, 0d);
		runUpwardFillerTest(350, 50d, 100d, 150d, 50d);
		runUpwardFillerTest(400, 50d, 100d, 150d, 100d);
	}


	@Test
	public void testFullScenario() {
		runFullScenarioTest(50, 16.67d, 16.67d, 16.67d, 0d);
		runFullScenarioTest(100, 33.33d, 33.33d, 33.33d, 0d);
		runFullScenarioTest(200, 50d, 75d, 75d, 0d);
		runFullScenarioTest(350, 50d, 100d, 200d, 0d);
		runFullScenarioTest(400, 50d, 125d, 225d, 0d);
	}




}
