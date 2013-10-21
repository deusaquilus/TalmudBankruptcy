package org.thepredicate;

import java.text.DecimalFormat;

public class Claimant {

	private double firstPassPayout;

	private double secondPassPayout;

	private double claim;

	public Claimant(double claim) {
		this.setClaim(claim);
	}

	public double halfClaim() {
		return getClaim() / 2d;
	}

	public double getLoss() {
		return getClaim() - getPayout();
	}

	@Override
	public String toString() {
		DecimalFormat df = new DecimalFormat("#.##");
		return "(Owe: " + df.format(getClaim()) + ", Has: " + df.format(getPayout()) + ")";
	}

	public double getPayout() {
		return firstPassPayout + secondPassPayout;
	}

	public double getFirstPassPayout() {
		return firstPassPayout;
	}

	public double getSecondPassPayout() {
		return secondPassPayout;
	}

	public void setFirstPassPayout(double payout) {
		this.firstPassPayout = payout;
	}

	public void setSecondPassPayout(double payout) {
		this.secondPassPayout = payout;
	}

	public double getClaim() {
		return claim;
	}

	public void setClaim(double claim) {
		this.claim = claim;
	}
}