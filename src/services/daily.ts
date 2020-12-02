import request from '@/utils/request';
import Dexie from 'dexie';
import XLSX from "xlsx";

// 连接DB，打开日报表
const openDailyTable = () => {
  const db = new Dexie('daily');
  db.version(1).stores({
    originInfo: `++id,timeInterval,weekNum,coding,testing,documentWriting,
      selfStudying,translate,useless,weekWorkload,weekday,averageWorkload,workSaturation,weekData` });
  db.open();
  return db;
}

// 处理导入的文件
const handleImportData = (data) => {
  const handledData = [];
  data.map((item, i) => {
    handledData.push({
      timeInterval: item[0],
      weekNum: Number(item[1] || 0),
      coding: Number(item[2] || 0),
      testing: Number(item[3] || 0),
      documentWriting: Number(item[4] || 0),
      selfStudying: Number(item[5] || 0),
      translate: Number(item[6] || 0),
      useless: Number(item[7] || 0),
      weekWorkload: Number(item[8] || 0),
      weekday: Number(item[9] || 0),
      averageWorkload: Number(item[10] || 0),
      workSaturation: Number(
        ((Number(item[2]) + Number(item[3]) + Number(item[4]) + Number(item[6])) / Number(item[8])).toFixed(1)
      ) || 0,
      // unescape and remove the double quotes at start and last.
      weekData: unescape(item[13]).replace(/^["|'](.*)["|']$/g, "$1")
    });
  });
  return handledData;
  // const importData = handledData.map(item => {
  //   return [
  //     item.timeInterval,
  //     item.weeks,
  //     item.coding,
  //     item.testing,
  //     item.documentWriting,
  //     item.selfStudying,
  //     item.translate,
  //     item.useless,
  //     item.weekWorkload,
  //     item.weekday,
  //     item.averageWorkload,
  //     item.workSaturation,
  //     item.weekData
  //   ];
  /*return `
  ('${item.timeInterval}',${item.weeks},${item.coding},${item.testing}
  ,${item.documentWriting},${item.selfStudying},${item.translate},${item.useless}
  ,${item.weekWorkload},${item.weekday},${item.averageWorkload},${item.workSaturation}
  ,'${item.weekData}');
  `*/
  // this.infos = handledData;
  // this.importInfos(importData);
  // this.drawCharts();
}

// 获取所有周报信息
export async function getWeekDailyList(): Promise<any> {
  const db = openDailyTable();
  return await db.originInfo.toArray();
}

export async function importDailyInfo(param: any): Promise<any> {
  const db = openDailyTable();
  debugger;
  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target?.result, {
      type: "binary"
    });
    const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // read excel's work sheet by line.
    let lines = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 })
      .map((line, i) => {
        return line.map((cell, index) => {
          return index > 0 && index < 12 ? Number(cell || 0) : cell;
        });
      });
    const handledData = handleImportData(lines.filter(item => item.length != 0).slice(1));
    db.originInfo.bulkAdd(handledData).then((lastKey: number) => {
      console.log("Last raindrop's id was: " + lastKey);
    });
  };
  reader.readAsBinaryString(param.file);
}