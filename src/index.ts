import { simulateBasePrice } from "./analyzers/semiHourDistribution";
import {
  getPeakDistribution,
  simulateOffPeakPrice
} from "./analyzers/peakDistribution";
import { parseDataFiles } from "./parser";
import {
  getDayOfWeekDistribution,
  simulateWeekendPrice
} from "./analyzers/dayOfWeekDistribution";

const dataFolder = `${__dirname}/data/`;

async function analyzeConsumption() {
  const rawConsumption = await parseDataFiles(dataFolder);
  /* Base plan */
  console.log(simulateBasePrice(rawConsumption));
  /* Peak plan */
  const peakDistribution = getPeakDistribution(rawConsumption);
  console.log(simulateOffPeakPrice(peakDistribution));
  /* Weekend plan */
  const dayOfWeekDistribution = getDayOfWeekDistribution(rawConsumption);
  console.log(simulateWeekendPrice(dayOfWeekDistribution));
}

analyzeConsumption();
