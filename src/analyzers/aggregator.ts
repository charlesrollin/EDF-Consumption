import { RawConsumption } from "../parser";

export function aggregate<T extends string>(
  rawConsumption: RawConsumption,
  aggregatorKeyFn: (key: string) => T
) {
  const aggregatedConsumption: { [key in T]?: number } = {};
  Object.keys(rawConsumption).forEach(key => {
    const aggregationKey = aggregatorKeyFn(key);
    if (aggregatedConsumption[aggregationKey] !== undefined) {
      aggregatedConsumption[aggregationKey] += rawConsumption[key];
    } else {
      aggregatedConsumption[aggregationKey] = rawConsumption[key];
    }
  });
  return aggregatedConsumption;
}
