import { RawConsumption } from "../parser";
import { aggregate } from "./aggregator";

function getHours(isoDateString: string) {
  return isoDateString.split("T")[1];
}

export function getSemiHourDistribution(rawConsumption: RawConsumption) {
  return aggregate(rawConsumption, getHours);
}

export function simulateBasePrice(semiHourConsumption: {
  [key: string]: number;
}) {
  const monthlySubscriptionFee = 9.98;
  const baseHourPrice = 0.1524;
  let total = 0;
  Object.values(semiHourConsumption).forEach(value => (total += value));
  return {
    type: "BASE",
    price: total * baseHourPrice,
    monthlySubscriptionFee
  };
}
