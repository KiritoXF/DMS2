// @ts-nocheck
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
      weekData: JSON.parse(unescape(item[13]).replace(/^["|'](.*)["|']$/g, "$1"))
    });
  });
  return handledData;
}

// 导入周报
export async function importDailyInfo(param: any): Promise<any> {
  const db = openDailyTable();
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

// 导出周报
export async function exportDailyInfo(param: any): Promise<any> {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(param.weekDailyList, param.header);
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  XLSX.writeFile(wb, param.fileName);
}

// 获取所有周报信息
export async function getWeekDailyList(): Promise<any> {
  const db = openDailyTable();
  return await db.originInfo.toArray();
}

// 获取某一周的周报信息
export async function getWeekDailyInfo(param: any): Promise<any> {
  const db = openDailyTable();
  return await db.originInfo.get({ weekNum: param.weekNum });
}

// 获取最新的周号
export async function getLatestWeekNum(): Promise<any> {
  const db = openDailyTable();
  return await db.originInfo.toCollection().last();
}

// 更新某一周的周报
export async function updateWeekDaily(param: any): Promise<any> {
  const db = openDailyTable();
  const info = await getWeekDailyInfo(param);
  return await db.originInfo.update(info.id, param);
}

// 新增某一周的周报
export async function addWeekDaily(param: any): Promise<any> {
  const db = openDailyTable();
  const info = await getWeekDailyInfo(param);
  if (!info?.id) {
    await db.originInfo.add(param);
    return { status: 200 };
  }
  // 已经有这一周的周报时报错 TODO: 以周号作为唯一判断是不是不太好？
  return { status: 400 };
}

// 删除某一周的周报
export async function deleteWeekDaily(param: any): Promise<any> {
  const db = openDailyTable();
  const info = await getWeekDailyInfo(param);
  return await db.originInfo.delete(info.id);
}