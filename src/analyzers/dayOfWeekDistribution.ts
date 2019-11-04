import { RawConsumption } from "../parser";
import { aggregate } from "./aggregator";

enum DaysOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday"
}

type DayOfWeekConsumption = { [key in DaysOfWeek]?: number };

function getDayOfWeek(isoDateString: string): DaysOfWeek {
  const daysOfWeek: DaysOfWeek[] = [
    DaysOfWeek.Sunday,
    DaysOfWeek.Monday,
    DaysOfWeek.Tuesday,
    DaysOfWeek.Wednesday,
    DaysOfWeek.Thursday,
    DaysOfWeek.Friday,
    DaysOfWeek.Saturday
  ];
  return daysOfWeek[new Date(isoDateString).getDay()];
}

export function getDayOfWeekDistribution(
  rawConsumption: RawConsumption
): DayOfWeekConsumption {
  return aggregate(rawConsumption, getDayOfWeek);
}

export function simulateWeekendPrice(
  dayOfWeekConsumption: DayOfWeekConsumption
) {
  const monthlySubscriptionFee = 8.7;
  const weekendHourPrice = 0.141;
  const businessDayHourPrice = 0.1707;
  const businessDayPrice =
    ((dayOfWeekConsumption[DaysOfWeek.Monday] || 0) +
      (dayOfWeekConsumption[DaysOfWeek.Tuesday] || 0) +
      (dayOfWeekConsumption[DaysOfWeek.Wednesday] || 0) +
      (dayOfWeekConsumption[DaysOfWeek.Thursday] || 0) +
      (dayOfWeekConsumption[DaysOfWeek.Friday] || 0)) *
    businessDayHourPrice;
  const weekendDayPrice =
    ((dayOfWeekConsumption[DaysOfWeek.Saturday] || 0) +
      (dayOfWeekConsumption[DaysOfWeek.Sunday] || 0)) *
    weekendHourPrice;
  return {
    type: "WEEKEND",
    price: businessDayPrice + weekendDayPrice,
    businessDayPrice,
    weekendDayPrice,
    monthlySubscriptionFee
  };
}
