import { RawConsumption } from "../parser";
import { aggregate } from "./aggregator";

function getHours(isoDateString: string) {
  return isoDateString.split("T")[1];
}

export function getPeakDistribution(rawConsumption: RawConsumption) {
  const offPeakStart = "23:00.00Z";
  const offPeakStop = "07:00.00Z";
  const result = { peak: 0, offPeak: 0 };
  const aggregatedConsumption = aggregate(rawConsumption, getHours);
  Object.keys(aggregatedConsumption).forEach(key => {
    if (key >= offPeakStart || key < offPeakStop) {
      result.offPeak += aggregatedConsumption[key];
    } else {
      result.peak += aggregatedConsumption[key];
    }
  });
  return result;
}

export function simulateOffPeakPrice(peakDistribution: {
  peak: number;
  offPeak: number;
}) {
  const { peak, offPeak } = peakDistribution;
  const monthlySubscriptionFee = 10.97;
  const peakHourPrice = 0.171;
  const offPeakHourPrice = 0.132;
  return {
    type: "PEAK",
    price: peak * peakHourPrice + offPeak * offPeakHourPrice,
    peakPrice: peak * peakHourPrice,
    offPeakPrice: offPeak * offPeakHourPrice,
    monthlySubscriptionFee
  };
}
