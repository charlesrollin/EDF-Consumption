import * as fs from "fs-extra";

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

export type RawConsumption = { [key: string]: number };

function getListOfDataFiles(folderPath: string): string[] {
  return fs.readdirSync(folderPath).map(fileName => `${folderPath}${fileName}`);
}

async function processDataFile(
  filePath: string,
  outputObject: RawConsumption
) {
  const data = (await fs.readJson(filePath)) as DataFile;
  const dailyLoads = data.dailyLoadCurves;
  dailyLoads.forEach(dailyLoad => {
    dailyLoad.consumptions.forEach(consumption => {
      outputObject[consumption.timestamp] = consumption.energy;
    });
  });
}

export async function parseDataFiles(
  dataFolderPath: string
): Promise<RawConsumption> {
  const rawConsumption = {};
  await Promise.all(
    getListOfDataFiles(dataFolderPath).map(filePath =>
      processDataFile(filePath, rawConsumption)
    )
  );
  return rawConsumption;
}
