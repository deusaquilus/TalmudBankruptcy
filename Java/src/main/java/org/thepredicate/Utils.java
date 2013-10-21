package org.thepredicate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class Utils {

	public static List<Double> getPayouts(List<Claimant> claimants) {
		List<Double> output = new ArrayList<Double>(claimants.size());
		for (Claimant claimant : claimants) {
			output.add(claimant.getPayout());
		}
		return output;
	}

	public static List<Double> getSecondPassPayouts(List<Claimant> claimants) {
		List<Double> output = new ArrayList<Double>(claimants.size());
		for (Claimant claimant : claimants) {
			output.add(claimant.getSecondPassPayout());
		}
		return output;
	}

	public static List<Double> getFirstPassPayouts(List<Claimant> claimants) {
		List<Double> output = new ArrayList<Double>(claimants.size());
		for (Claimant claimant : claimants) {
			output.add(claimant.getFirstPassPayout());
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

	public static List<Claimant> createStanardClaimants() {
		return Arrays.asList(new Claimant(100), new Claimant(200), new Claimant(300));
	}

}
