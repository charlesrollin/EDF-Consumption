import * as fs from "fs-extra";
import jsonl from "jsonl";

interface Consumption {
  timestamp: string;
  energy: number;
}

interface DailyLoadCurves {
  consumptions: Consumption[];
}

interface DataFile {
  dailyLoadCurves: DailyLoadCurves[];
}

const dataFolder = `${__dirname}/data/`;

function getListOfDataFiles(): string[] {
  return fs.readdirSync(dataFolder).map(fileName => `${dataFolder}${fileName}`);
}

function getHours(isoDateString: string) {
  return isoDateString.split("T")[1];
}

async function processDataFile(
  filePath: string,
  outputObject: { [key: string]: number }
) {
  const data = (await fs.readJson(filePath)) as DataFile;
  const dailyLoads = data.dailyLoadCurves;
  dailyLoads.forEach(dailyLoad => {
    dailyLoad.consumptions.forEach(consumption => {
      const key = getHours(consumption.timestamp);
      if (outputObject[key] !== undefined) {
        outputObject[key] += consumption.energy;
      } else {
        outputObject[key] = consumption.energy;
      }
    });
  });
}

async function analyzeConsumption() {
  let semiHourlyAggregatedConsumptions = {};
  await Promise.all(
    getListOfDataFiles().map(filePath =>
      processDataFile(filePath, semiHourlyAggregatedConsumptions)
    )
  );
  console.log(semiHourlyAggregatedConsumptions);
  console.log(getPeakAndOffPeakDistribution(semiHourlyAggregatedConsumptions));
}

async function getPeakAndOffPeakDistribution(aggregatedConsumption: {
  [key: string]: number;
}) {
  const offPeakStart = "23:00.00Z";
  const offPeakStop = "07:00.00Z";
  const result = { peak: 0, offPeak: 0 };
  Object.keys(aggregatedConsumption).forEach(key => {
    if (key >= offPeakStart || key < offPeakStop) {
      result.offPeak += aggregatedConsumption[key];
    } else {
      result.peak += aggregatedConsumption[key];
    }
  });
  return result;
}

analyzeConsumption();
