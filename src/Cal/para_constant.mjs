import big from "decimal.js";
import frc from "fraction.js";
import nzh from "nzh/hk.js";
import Para from "./para_calendars.mjs";
import { starEclp2Equa } from "./newm_shixian.mjs";

big.config({
  precision: 64,
  toExpNeg: -60,
  toExpPos: 60,
  rounding: 4,
});

export { big, frc, nzh };
// nzh = new nzh({
//     ch: '〇一二三四五六七八九',      // 数字字符
//     ch_u: '个十百千萬億兆京',       // 数位单位字符，万以下十进制，万以上万进制，个位不能省略
// });

export const deci = x => +('.' + (x.toString().split('.')[1])) || 0 // 截取小數
// console.log(4999999999999.14%1) // = .1396484375
// console.log(4999999999999.14-Math.floor(4999999999999.14)) // = .1396484375
export const fix = (x, n) => (x * 100 < 10 ? '0' : '') + (x * 100).toFixed(n || 2)
export const debounce = (fn, delay) => {
  let timer = 100; // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return (...args) => {
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer); // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
export const NameList = {
  // 按照時間順序排列
  Yin: "殷",
  XiaDong: "冬至元夏",
  XiaYu: "雨水元夏",
  Lu: "魯(建子)",
  Lu1: "魯(建丑)",
  LuA: "魯(進餘539建丑)",
  LuA1: "魯(進餘539)",
  LuB: "魯(進餘469)",
  LuC: "魯(進餘403)",
  LuD: "魯(進餘348)",
  LuE: "魯(進餘280)",
  LuF: "魯(進餘213)",
  LuG: "魯(進餘147)",
  Zhuanxu1: "楚顓頊(大正建亥)",
  Zhuanxu2: "楚顓頊(小正建寅)",
  ZhuanxuA: "秦顓頊(建寅)",
  ZhuanxuB: "秦顓頊(十月首)",
  ZhuanxuC: "秦顓頊(進餘3/4)",
  ZhuanxuD: "秦顓頊(退餘210)",
  ZhuanxuE: "秦顓頊(變閏章)",
  ZhuanxuF: "秦顓頊(退餘25)",
  Zhou: "周",
  Huangdi: "黃帝",
  TaiyiJiayin: "甲寅太乙",
  Shiji: "曆術甲子篇(擬)",
  Taichu: "太初(三統)",
  Qianzaodu: "乾鑿度",
  Yuanmingbao: "元命苞",
  Easthan: "後漢四分",
  Qianxiang: "乾象",
  // Huangchu: '黃初(擬)',
  Jingchu: "景初",
  Liuzhi: "正曆(擬)", // 劉智正曆
  Wangshuozhi: "通曆(擬)", // 王朔之通曆
  Sanji: "三紀",
  Xuanshi: "玄始(擬)", // 趙𢾺，梁趙曆
  Yuanjia: "元嘉",
  Daming: "大明",
  Liangwu: "明克讓(擬大同代)", // 梁武帝大同曆
  Tsrengguang: "正光",
  Xinghe: "興和",
  Tianbao: "天保",
  Jiayin: "甲寅(擬)", // 董峻、鄭元偉
  Tianhe: "天和(擬)", // 甄
  Daxiang: "大象(擬)", // 馬顯
  Kaihuang: "開皇(擬)", // 張賔
  Daye: "大業",
  Zhangmengbin: "張孟賓(擬)",
  Liuxiaosun: "劉孝孫(擬)",
  Huangji: "皇極",
  WuyinA: "戊寅",
  WuyinB: "戊寅(平朔)",
  Shenlong: "神龍(擬)",
  Yisi: "乙巳(擬)",
  LindeA: "麟德",
  LindeB: "麟德(進朔)",
  // Jiuzhi: '九執(擬)', // 顯慶年間印度曆法
  Dayan: "大衍",
  TaiyiKaiyuan: "開元太乙",
  // Zhide: '至德(擬)',
  Wuji: "五紀",
  Tsrengyuan: "正元",
  Xuanming: "宣明",
  Chongxuan: "崇玄",
  Futian: "符天(擬)",
  Qintian: "欽天",
  Yingtian: "應天",
  Qianyuan: "乾元",
  Zhidao1: "至道甲(擬)", // 王睿
  Zhidao2: "至道乙(擬)",
  Yitian: "儀天",
  Qianxing: "乾興(擬)",
  Chongtian: "崇天",
  TaiyiJingyou: "景祐太乙",
  Mingtian: "明天",
  Fengyuan: "奉元(擬)",
  Guantian: "觀天",
  Zhantian: "占天(擬)",
  Jiyuan: "紀元",
  Tongyuan: "統元",
  Qiandao: "乾道",
  Chunxi: "淳熙",
  Huiyuan: "會元",
  Tongtian: "統天",
  Kaixi: "開禧",
  Chunyou: "淳祐(擬)",
  Huitian: "會天(擬)",
  Chengtian: "成天",
  // Bentian: '本天(擬)',
  // Daming1: '賈俊大明(擬)',
  Daming2: "楊級大明(擬)",
  Daming3: "重修大明",
  Yiwei: "乙未(擬)",
  Gengwu: "庚午",
  Shoushi: "授時(曆經)",
  Shoushi2: "授時(通軌)",
  Datong: "大統(通軌)",
  Datong2: "大統(曆志)",
  Xufa: "徐發天元曆",
  // Wannian: '聖壽萬年',
  // Huangzhong: '黃鐘',
  // Huihui: '回回',
  Xinfa: "新法曆書",
  Yongnian: "康熙永年表",
  Jiazi: "曆象考成",
  Guimao: "曆象考成後編",
};
export const NameDayList = {
  // 可計算日書的曆法
  Easthan: "後漢四分",
  Qianxiang: "乾象",
  Jingchu: "景初",
  Sanji: "三紀",
  Yuanjia: "元嘉",
  Daming: "大明",
  Tsrengguang: "正光",
  Xinghe: "興和",
  Tianbao: "天保",
  Daye: "大業",
  Huangji: "皇極",
  WuyinA: "戊寅(定)",
  WuyinB: "戊寅(平)",
  LindeA: "麟德(不進朔)",
  LindeB: "麟德(進朔)",
  Dayan: "大衍",
  Wuji: "五紀",
  Tsrengyuan: "正元",
  Xuanming: "宣明",
  Chongxuan: "崇玄",
  Qintian: "欽天",
  Yingtian: "應天",
  Qianyuan: "乾元",
  Yitian: "儀天",
  Chongtian: "崇天",
  Mingtian: "明天",
  Guantian: "觀天",
  Jiyuan: "紀元",
  Tongyuan: "統元",
  Qiandao: "乾道",
  Chunxi: "淳熙",
  Huiyuan: "會元",
  Tongtian: "統天",
  Kaixi: "開禧",
  Huitian: "會天(擬)",
  Chengtian: "成天",
  Daming3: "重修大明",
  Gengwu: "庚午",
  Shoushi: "授時(曆經)",
  Shoushi2: "授時(通軌)",
  Datong: "大統(通軌)",
  Datong2: "大統(曆志)",
  Xinfa: "新法曆書",
  Yongnian: "康熙永年表",
  Jiazi: "曆象考成",
  Guimao: "曆象考成後編",
};

export const ScList = [
  "癸亥",
  "甲子",
  "乙丑",
  "丙寅",
  "丁卯",
  "戊辰",
  "己巳",
  "庚午",
  "辛未",
  "壬申",
  "癸酉",
  "甲戌",
  "乙亥",
  "丙子",
  "丁丑",
  "戊寅",
  "己卯",
  "庚辰",
  "辛巳",
  "壬午",
  "癸未",
  "甲申",
  "乙酉",
  "丙戌",
  "丁亥",
  "戊子",
  "己丑",
  "庚寅",
  "辛卯",
  "壬辰",
  "癸巳",
  "甲午",
  "乙未",
  "丙申",
  "丁酉",
  "戊戌",
  "己亥",
  "庚子",
  "辛丑",
  "壬寅",
  "癸卯",
  "甲辰",
  "乙巳",
  "丙午",
  "丁未",
  "戊申",
  "己酉",
  "庚戌",
  "辛亥",
  "壬子",
  "癸丑",
  "甲寅",
  "乙卯",
  "丙辰",
  "丁巳",
  "戊午",
  "己未",
  "庚申",
  "辛酉",
  "壬戌",
  "癸亥",
  "甲子",
];
export const StemList = " 甲乙丙丁戊己庚辛壬癸";
export const BranchList = " 子丑寅卯辰巳午未申酉戌亥子";
export const StemList1 = [
  "",
  "焉逢",
  "旃蒙",
  "遊兆",
  "彊圉",
  "徒維",
  "祝犁",
  "上章",
  "重光",
  "玄黓",
  "昭陽",
];
export const BranchList1 = [
  "",
  "困敦",
  "赤奮若",
  "攝提格",
  "單閼",
  "執徐",
  "大荒落",
  "敦牂",
  "叶洽",
  "涒灘",
  "作鄂",
  "淹茂",
  "大淵獻",
];
export const NayinList = [
  "大海水",
  "海中金",
  "爐中火",
  "大林木",
  "路旁土",
  "刀釰金",
  "山頭火",
  "澗下水",
  "城頭土",
  "白蠟金",
  "楊柳木",
  "井泉水",
  "屋上土",
  "霹靂火",
  "松柏木",
  "長流水",
  "沙石金",
  "山下火",
  "平地木",
  "壁上土",
  "金箔金",
  "點燈火",
  "天河水",
  "大驛土",
  "釵釧金",
  "桑柘木",
  "大溪水",
  "沙中土",
  "天上火",
  "石榴木",
  "大海水",
  "爐中火",
]; // 納音：甲子乙丑對應海中金
export const HalfList = "初正初時时";
export const QuarList = "初一二三四五六七八";
export const TwelveList = [
  "",
  "彊",
  "少弱",
  "少",
  "少彊",
  "半弱",
  "半",
  "半彊",
  "太弱",
  "太",
  "太彊",
  "弱",
  "",
];
export const FourList = ["", "半弱", "半", "半彊", ""];
export const TwelveListHuangji = [
  "",
  "彊",
  "小少",
  "小",
  "小太",
  "半少",
  "半",
  "半太",
  "大少",
  "大",
  "大太",
  "弱",
  "",
];
export const TwelveListWuyin = [
  "初",
  "初彊",
  "少弱",
  "少",
  "少彊",
  "半弱",
  "半",
  "半彊 ",
  "太弱 ",
  "太",
  "太彊",
  "末",
  "初",
];
export const TwentyfourList =
  "子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥壬";
export const TermList = [
  "小雪中", "冬至中", "大寒中", "雨水中", "春分中", "穀雨中", "小滿中", "夏至中", "大暑中", "處暑中", "秋分中", "霜降中", "小雪中"
]; // 用於朔閏表顯示中氣名
export const Term1List = [
  "立冬節", "大雪節", "小寒節", "立春節", "驚蟄節", "清明節", "立夏節", "芒種節", "小暑節", "立秋節", "白露節", "寒露節"
];
export const HalfTermList = [
  "冬至", "小寒", "大寒", "立春", "雨水", "驚蟄", "春分", "清明", "穀雨", "立夏", "小滿", "芒種", "夏至", "小暑", "大暑", "立秋", "處暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪"
];
export const HouListA = [
  // 皇極
  "虎交",
  "芸始生",
  "荔挺生", // 0冬至
  "蚯結",
  "麋角解",
  "水泉動", // 十二月1小寒4。小寒之後丑2開始建除
  "鴈北",
  "鵲始巢",
  "雉始雊", // 2大寒。
  "雞乳",
  "東風",
  "蟄蟲振", // 一月3立春。
  "魚上",
  "獺祭",
  "鴻鴈來", // 4雨水。麟德、戊寅雨水驚蟄顛倒，大業、皇極與現在一樣
  "始雨",
  "桃華",
  "倉庚鳴", // 二月5驚蟄第16候，卯4開始建除
  "鷹化",
  "玄鳥",
  "雷發聲", // 6春分
  "電見",
  "蟄咸動",
  "蟄啓戶", // 三月7清明22
  "桐華",
  "田鼠爲鴽",
  "虹始見", // 8穀雨
  "萍生",
  "戴勝降桑",
  "螻蟈鳴", // 四月9立夏28
  "蚯出",
  "王瓜生",
  "苦菜秀", // 10小滿
  "蘼草",
  "小暑至",
  "螳螂生", // 五月11芒種34
  "鵙鳴",
  "反舌無聲",
  "鹿角解", // 12夏至爲第37候，庚7，虛長在第三個庚爲初伏，第四個庚中伏，立秋後第一個庚末伏
  "蜩鳴",
  "半夏生",
  "菫榮", // 六月13小暑40
  "溫風",
  "蟋蟀居壁",
  "鷹學習", // 14大暑
  "腐草",
  "地潤溽暑",
  "涼風至", // 七月15立秋46
  "露降",
  "寒蟬鳴",
  "鷹祭鳥", // 16處暑
  "天地",
  "暴風至",
  "鴻鴈來", // 八月17白露52
  "玄鳥歸",
  "羣鳥養羞",
  "雷收聲", // 18秋分
  "蟄附",
  "殺氣盛",
  "陽氣衰", // 九月19寒露58
  "始涸",
  "鴻鴈來賓",
  "雀入爲蛤", // 20霜降
  "菊花",
  "豺祭獸",
  "始冰", // 十月21立冬64
  "地凍",
  "雉入爲蜃",
  "虹藏", // 22小雪
  "冰壯",
  "地坼",
  "鶡鴠鳴", // 十一月23大雪70
];
export const HouListB = [
  "蚯蚓",
  "麋角解",
  "水泉動", // 0冬至
  "鴈北",
  "鵲始巢",
  "雉始雊", // 十二月1小寒4。小寒之後丑2開始建除
  "雞乳",
  "鷙鳥疾",
  "冰腹堅", // 2大寒。
  "東風",
  "蟄蟲振",
  "魚上冰", // 一月3立春。
  "獺祭",
  "鴻鴈來",
  "草萌動", // 4雨水。麟德、戊寅雨水驚蟄顛倒，大業、皇極與現在一樣
  "桃華",
  "倉庚鳴",
  "鷹化鳩", // 二月5驚蟄第16候，卯4開始建除
  "玄鳥",
  "雷發聲",
  "電始見", // 6春分
  "桐華",
  "田鼠爲鴽",
  "虹始見", // 三月7清明22
  "萍生",
  "鳩拂羽",
  "戴勝降桑", // 8穀雨
  "螻蟈",
  "蚯蚓出",
  "王瓜生", // 四月9立夏28
  "苦菜",
  "蘼草死",
  "小暑至", // 10小滿
  "螳螂",
  "鵙始鳴",
  "反舌無聲", // 五月11芒種34
  "鹿角",
  "蜩始鳴",
  "半夏生", // 12夏至爲第37候，庚7，虛長在第三個庚爲初伏，第四個庚中伏，立秋後第一個庚末伏
  "溫風",
  "蟋蟀居壁",
  "鷹學習", // 六月13小暑40
  "腐草",
  "地潤溽暑",
  "大雨行", // 14大暑
  "涼風",
  "白露降",
  "寒蟬鳴", // 七月15立秋46
  "鷹祭",
  "天地肅",
  "禾乃登", // 16處暑
  "鴻鴈",
  "玄鳥歸",
  "羣鳥養羞", // 八月17白露52
  "雷收",
  "蟄蟲坯戶",
  "始涸", // 18秋分
  "來賓",
  "雀入爲蛤",
  "菊有黃花", // 九月19寒露58
  "豺祭",
  "草黄落",
  "蟄虫俯", // 20霜降
  "始冰",
  "地始凍",
  "雉入爲蜃", // 十月21立冬64
  "虹藏",
  "天氣地氣",
  "閉塞成冬", // 22小雪
  "鶡鴠",
  "虎始交",
  "荔挺生", // 十一月23大雪70
]; // 大衍的。爲了不將候與五行混淆，把「土潤溽暑」改「地」，「水澤腹堅」改冰，「草木萌動「草木黄落」」刪木，「水泉動」「水始涸」「雀入水爲蛤」「雉入水爲蜃」「水始冰」刪水。儘量減少字數
export const Hexagram64ListA = [
  "伯坎",
  "公中孚",
  "辟復",
  "侯屯",
  "大夫謙",
  "卿睽",
  "公升",
  "辟臨",
  "侯小過",
  "大夫蒙",
  "卿益",
  "公漸",
  "辟泰",
  "侯需",
  "大夫隨",
  "卿晉",
  "伯震",
  "公解",
  "辟大壯",
  "侯豫",
  "大夫訟",
  "卿蠱",
  "公革",
  "辟夬",
  "侯旅",
  "大夫師",
  "卿比",
  "公小畜",
  "辟乾",
  "侯大有",
  "大夫家人",
  "卿井",
  "伯離",
  "公咸",
  "辟姤",
  "侯鼎",
  "大夫豐",
  "卿渙",
  "公履",
  "辟遯",
  "侯恆",
  "大夫節",
  "卿同人",
  "公損",
  "辟否",
  "侯巽",
  "大夫萃",
  "卿大畜",
  "伯兌",
  "公賁",
  "辟觀",
  "侯歸妹",
  "大夫无妄",
  "卿明夷",
  "公困",
  "辟剝",
  "侯艮",
  "大夫旣濟",
  "卿噬嗑",
  "公大過",
  "辟坤",
  "侯未濟",
  "大夫蹇",
  "卿頤",
]; // 從冬至開始。// 冬坎29、春震51、夏離30、秋兌58主分至後的73/80日，晉35、井48、大畜26、頤27主5+14/80，其餘6+7/80。乾象:1075/1178,5+206/1178, 6+103/1178，景初：10091/11058, 5+1934/11058, 6+967/11058。正光：(5530+9.2/24)/6060,5+(1059+5.6/24)/6060, 6+(529+14.8/24)/6060
export const HexagramSymbolListA = [
  "䷜",
  "䷼",
  "䷗",
  "䷂",
  "䷎",
  "䷥",
  "䷭",
  "䷒",
  "䷽",
  "䷃",
  "䷩",
  "䷴",
  "䷊",
  "䷄",
  "䷐",
  "䷢",
  "䷲",
  "䷧",
  "䷡",
  "䷏",
  "䷅",
  "䷑",
  "䷰",
  "䷪",
  "䷷",
  "䷆",
  "䷇",
  "䷈",
  "䷀",
  "䷍",
  "䷤",
  "䷯",
  "䷝",
  "䷞",
  "䷫",
  "䷱",
  "䷶",
  "䷺",
  "䷺",
  "䷠",
  "䷟",
  "䷻",
  "䷌",
  "䷨",
  "䷋",
  "䷸",
  "䷬",
  "䷙",
  "䷹",
  "䷕",
  "䷓",
  "䷵",
  "䷘",
  "䷣",
  "䷮",
  "䷖",
  "䷳",
  "䷾",
  "䷔",
  "䷛",
  "䷁",
  "䷿",
  "䷦",
  "䷚",
];
export const Hexagram64ListB = [
  "公中孚",
  "辟復",
  "侯屯內",
  "侯屯內外",
  "大夫謙",
  "卿睽", // 坎
  "公升",
  "辟臨",
  "侯小過內",
  "侯小過外",
  "大夫蒙",
  "卿益",
  "公漸",
  "辟泰",
  "侯需內",
  "侯需外",
  "大夫隨",
  "卿晉",
  "公解",
  "辟大壯",
  "侯豫內",
  "侯豫外",
  "大夫訟",
  "卿蠱", // 震
  "公革",
  "辟夬",
  "侯旅內",
  "侯旅外",
  "大夫師",
  "卿比",
  "公小畜",
  "辟乾",
  "侯大有內",
  "侯大有外",
  "大夫家人",
  "卿井",
  "公咸",
  "辟姤",
  "侯鼎內",
  "侯鼎外",
  "大夫豐",
  "卿渙", // 離
  "公履",
  "辟遯",
  "侯恆內",
  "侯恆外",
  "大夫節",
  "卿同人",
  "公損",
  "辟否",
  "侯巽內",
  "侯巽外",
  "大夫萃",
  "卿大畜",
  "公賁",
  "辟觀",
  "侯歸妹內",
  "侯歸妹外",
  "大夫无妄",
  "卿明夷", // 兌
  "公困",
  "辟剝",
  "侯艮內",
  "侯艮外",
  "大夫旣濟",
  "卿噬嗑",
  "公大過",
  "辟坤",
  "侯未濟內",
  "侯未濟外",
  "大夫蹇",
  "卿頤",
];
export const HexagramSymbolListB = [
  "䷼",
  "䷗",
  "䷂",
  "䷂",
  "䷎",
  "䷥",
  "䷭",
  "䷒",
  "䷽",
  "䷽",
  "䷃",
  "䷩",
  "䷴",
  "䷊",
  "䷄",
  "䷄",
  "䷐",
  "䷢",
  "䷧",
  "䷡",
  "䷏",
  "䷏",
  "䷅",
  "䷑",
  "䷰",
  "䷪",
  "䷷",
  "䷷",
  "䷆",
  "䷇",
  "䷈",
  "䷀",
  "䷍",
  "䷍",
  "䷤",
  "䷯",
  "䷞",
  "䷫",
  "䷱",
  "䷱",
  "䷶",
  "䷺",
  "䷺",
  "䷠",
  "䷟",
  "䷟",
  "䷻",
  "䷌",
  "䷨",
  "䷋",
  "䷸",
  "䷸",
  "䷬",
  "䷙",
  "䷕",
  "䷓",
  "䷵",
  "䷵",
  "䷘",
  "䷣",
  "䷮",
  "䷖",
  "䷳",
  "䷳",
  "䷾",
  "䷔",
  "䷛",
  "䷁",
  "䷿",
  "䷿",
  "䷦",
  "䷚",
];
export const FiveList1 = " 木火土金水";
export const FiveList2 = "火土金土水土木土火"; // 土王用事
export const ThreeList = "天地人"; // 四分曆三紀名
export const YuanList = "上中下";
export const MonSindhuNameList = " 翼角氐心箕女室婁昴觜鬼星"; // 李輝《漢譯佛經中的宿曜術研究》頁43
export const MonHexagramNameList = " 泰壯夬乾姤遯否觀剝坤復臨";
export const MonScaleNameList = [
  "大呂",
  "太簇",
  "夾鐘",
  "姑洗",
  "中呂",
  "蕤賓",
  "林鐘",
  "夷則",
  "南呂",
  "無射",
  "應鐘",
  "黃鐘",
  "大呂",
];
export const WeekList = "日月火水木金土日"; // 回回不用甲子，用七曜。
export const WeekList1 = "日一二三四五六日";
export const NumList = [
  "〇",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "廿",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "卅",
];
export const MonNumList1 = [
  "十二",
  "正",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];
export const MonNumListChuA = [
  "獻馬(戌)",
  "冬夕(亥)",
  "屈夕(子)",
  "援夕(丑)",
  "荊尸(寅)",
  "夏(卯)",
  "紡(辰)",
  "七月(巳)",
  "八月(午)",
  "九月(未)",
  "十月(申)",
  "爨(酉)",
  "獻馬(戌)",
]; // 大正
export const MonNumListChuB = [
  "塗(丑)",
  "取(寅)",
  "如(卯)",
  "秉(辰)",
  "餘(巳)",
  "好(午)",
  "虘(未)",
  "倉(申)",
  "臧(酉)",
  "玄(戌)",
  "陽(亥)",
  "姑(子)",
  "塗(丑)",
]; // 小正
export const ColorList = " 白黑碧綠黃白赤白紫"; // 九宮
export const ClassColorList = [
  "",
  "color-white",
  "color-black",
  "color-cyan",
  "color-green",
  "color-yellow",
  "color-white",
  "color-red",
  "color-white",
  "color-purple",
];
export const Hexagram8List = " 乾兌離震巽坎艮坤"; // 震 正東;兌 正西;離 正南;坎 正北;坤 西南;艮 東北;巽 東南;乾 西北
export const FourauspiciousList = ["甲丙庚壬", "艮巽坤乾", "癸乙丁辛"]; // 四大吉時，和十二次一一對應
// 日遊神癸巳30—己酉46在內。癸巳30——丁酉34在內太微宮，戊戌35——壬寅39在內紫微宮。癸卯40在內太廟宮，甲辰41——己酉46在內御女宮
// 會天曆：癸巳30-丁酉34房內北，戊戌35—己亥36房內中，庚子37—壬寅39房內南，癸卯40房內西，甲辰41—丁未44房內東，戊申45房內中，己酉46房內出。零散的在房內中：戊辰己巳5、6，戊寅己卯15、16，戊子己丑25、26，戊午己未55、56，
export const MoonGodList = [
  "",
  "天道在南，天德在丁，月德在丙，月合在辛，月厭在戌，月煞在丑，月破在申，月刑在巳，月空在壬", // 正月
  "天道在西南，天德在坤，月德在甲，月合在巳，月厭在酉，月煞在戌，月破在酉，月刑在子，月空在庚", // 二月
  "天道在北，天德在壬，月德在壬，月合在丁，月厭在申，月煞在未，月破在戌，月刑在辰，月空在丙",
  "天道在西，天德在辛，月德在庚，月合在乙，月厭在未，月煞在辰，月破在亥，月刑在申，月空在申",
  "天道在西北，天德在乾，月德在丙，月合在辛，月厭在午，月煞在丑，月破在子，月刑在午，月空在壬",
  "天道在東，天德在申，月德在甲，月合在巳，月厭在巳，月煞在戌，月破在丑，月刑在丑，月空在庚",
  "天道在北，天德在癸，月德在壬，月合在丁，月厭在辰，月煞在未，月破在寅，月刑在寅，月空在丙",
  "天道在東北，天德在艮，月德在庚，月合在乙，月厭在寅，月煞在辰，月破在卯，月刑在酉，月空在申",
  "天道在南，天德在丙，月德在丙，月合在辛，月厭在卯，月煞在丑，月破在辰，月刑在未，月空在壬",
  "天道在東，天德在乙，月德在甲，月合在巳，月厭在寅，月煞在戌，月破在巳，月刑在亥，月空在庚",
  "天道在東南，天德在巽，月德在壬，月合在丁，月厭在子，月煞在未，月破在午，月刑在卯，月空在丙",
  "天道在西，天德在庚，月德在庚，月合在乙，月厭在亥，月煞在辰，月破在未，月刑在戌，月空在申",
]; // 月神。這些迷信的內容參考何偉鳳《黑水城出土元代曆日研究》，寧夏大學碩士論文
export const ManGodList = [
  "",
  "大趾",
  "外踝",
  "股內",
  "腰",
  "口舌",
  "手",
  "內踝",
  "腕",
  "尻",
  "腰背",
  "鼻柱",
  "髮際",
  "齒",
  "胃管",
  "遍身",
  "胸",
  "氣衝",
  "股內",
  "足",
  "內踝",
  "小指",
  "外踝胸",
  "肝足",
  "手陽明",
  "足陽明",
  "胸",
  "膝",
  "陰",
  "膝脛",
  "足趺",
]; // 根據陰曆日來排列。 [黃帝明堂灸經卷上](https://ctext.org/wiki.pl?if=gb&chapter=548650)
// 十二部人神不宜灸.建日在足，禁晡時；除日在眼，禁日入；滿日在腹，禁黃昏；平日在背，禁人定，定日在心，禁夜半；執日在手，禁雞鳴；破日在口，禁平旦；危日在鼻，禁日出；成日在唇，禁食時；收日在頭，禁禺中；開日在耳，禁午時；閉日在目，禁日。
export const JianchuList = "建除滿平定執破危成收開閉"; // 建除十二客（値、辰）
export const HuangheiList = [
  "青龍",
  "明堂",
  "天刑",
  "朱雀",
  "金匱",
  "天德",
  "白虎",
  "玉堂",
  "天牢",
  "玄武",
  "司命",
  "句陳",
]; // https://www.zhihu.com/question/20167015/answer/15508998

// 從角開始：
const EquaDegTaichu = [
  0, 12, 9, 15, 5, 5, 18, 11, 26, 8, 12, 10, 17, 16, 9, 16, 12, 14, 11, 16, 2, 9, 33, 4, 15, 7, 18, 18, 17,
]; // 太初至麟德
const EquaDegDayan = [
  0, 12, 9, 15, 5, 5, 18, 11, 26, 8, 12, 10, 17, 16, 9, 16, 12, 14, 11, 17, 1, 10, 33, 3, 15, 7, 18, 18, 17,
]; // 大衍以後。太=.75
const EquaDegMingtian = [
  0, 12, 9, 16, 5, 6, 19, 10, 25, 7, 11, 10, 16, 17, 9, 16, 12, 15, 11, 18, 1, 10, 34, 2, 14, 7, 18, 18, 17,
]; // 明天的新値。「自漢太初後至唐開元治曆之初，凡八百年間，悉無更易。今雖測驗與舊不同，亦歲月未久。新曆兩備其數，如淳風從舊之意。」所以還是沿用以前的
const EquaDegJiyuan = [
  0, 12, 9.25, 16, 5.75, 6.25, 19.25, 10.5, 25, 7.25, 11.25, 9, 15.5, 17, 8.75, 16.5, 12, 15, 11.25, 17.25, .5, 10.5, 33.25, 2.5, 13.75, 6.75, 17.25, 18.75, 17,
]; // 少=1/4，太3/4。紀元的新値「如考唐，用唐所測；考古，用古所測：卽各得當時宿度。」根據年份用當時的觀測值。注意虛分要減去週天餘。金大明沿用紀元
const EquaDegShoushi = [
  0, 12.1, 9.2, 16.3, 5.6, 6.5, 19.1, 10.4, 25.2, 7.2, 11.35, 8.7, 15.4, 17.1, 8.6, 16.6, 11.8, 15.6, 11.3, 17.4, .05, 11.1, 33.3, 2.2, 13.3, 6.3, 17.25, 18.75, 17.3,
]; // 弦策少是0.25，太就是0.75。觜初五，說明初=0。大統同授時
// 甲子曆曆元赤道度
const EquaDegJiazi = [
  0, 11.833333333333, 9.4, 16.55, 5.533333333333, 6.216666666667, 19.65, 10.2, // 角
  24.216666666667, 6.916666666667, 11.05, 8.7, 14.85, 17.016666666667, 10.866666666667, // 斗
  14.133333333333, 11.983333333333, 15.05, 11.233333333333, 16.466666666667, 0.483333333333, 11.483333333333, // 奎
  32.4, 1.85, 12.8, 6, 17.1, 18.816666666667, 17.2, // 井
]
const EquaAccumJiazi = [0,
  11.833333333333, 21.233333333333, 37.783333333333, 43.316666666666, 49.533333333333, 69.183333333333, 79.383333333333,
  103.6, 110.516666666667, 121.566666666667, 130.266666666667, 145.116666666667, 162.133333333333, 173,
  187.133333333333, 199.116666666667, 214.166666666667, 225.4, 241.866666666667, 242.35, 253.833333333333,
  286.233333333333, 288.083333333333, 300.883333333333, 306.883333333333, 323.983333333333, 342.8, 360]
const EclpDegEasthan = [
  0, 13, 10, 16, 5, 5, 18, 10, 24, 7, 11, 10, 16, 18, 10, 17, 12, 15, 12, 16, 3, 8, 30, 4, 14, 7, 17, 19, 18,
];
const EclpDegHuangji = [
  0, 13, 10, 16, 5, 5, 17, 10.5, 24, 7, 11.5, 10, 17, 17, 10, 17, 13, 15, 11, 15.5, 2, 9, 30, 4, 14.5, 7, 17, 19, 18,
]; // 《中國古代曆法》頁25的胃本來是15，寫成14了
const EclpDegLinde = [
  0, 13, 10, 16, 5, 5, 18, 10, 24, 7, 11, 10, 16, 18, 10, 17, 13, 15, 11, 16, 2, 9, 30, 4, 14, 7, 17, 19, 18,
];
const EclpDegDayan = [
  0, 13, 9.5, 15.75, 5, 4.75, 17, 10.25, 23.5, 7.5, 11.25, 10, 17.75, 17.25, 9.75, 17.5, 12.5, 14.75, 11, 16.25, 1, 9.25, 30, 2.75, 14.25, 6.75, 18.75, 19.25, 18.75,
];
const EclpDegYingtian = [
  0, 13, 9.5, 15.25, 5, 5, 17.25, 10.25, 23.5, 7.5, 11.75, 10, 17.25, 16.75, 10.25, 17.5, 12.75, 14.25, 11, 16.5, 1, 9.25, 30, 2.75, 14.5, 7, 18.25, 19.25, 18.75,
];
const EclpDegMingtian = [
  0, 13, 9.5, 15.5, 5, 4.75, 17, 10, 23.5, 7.5, 11.5, 10, 17.75, 17.25, 9.75, 17.75, 12.75, 14.5, 10.75, 16, 1, 9.25, 30, 2.75, 14.25, 7, 18.75, 19.5, 18.75,
]; // 明天、觀天
const EclpDegJiyuan = [
  0, 12.75, 9.75, 16.25, 5.75, 6, 18.25, 9.5, 23, 7, 11, 9, 16, 18, 9.5, 18, 12.75, 15.5, 11, 16.5, .5, 9.75, 30.5, 2.5, 13.25, 6.75, 17.75, 20, 18.5,
];
const EclpDegNewDaming = [
  0, 12.75, 9.75, 16.25, 5.75, 6, 18.25, 9.5, 23, 7, 11, 9, 16, 18.25, 9.5, 17.75, 12.75, 15.5, 11, 16.5, .5, 9.75, 30.5, 2.5, 13.25, 6.75, 17.75, 20, 18.5,
]; // 重修大明、庚午
const EclpDegShoushi = [0,
  12.87, 9.56, 16.4, 5.48, 6.27, 17.95, 9.59,
  23.47, 6.9, 11.12, 8.75, 15.95, 18.32, 9.34,
  17.87, 12.36, 15.81, 11.08, 16.5, .05, 10.28,
  31.03, 2.11, 13, 6.31, 17.79, 20.09, 18.75,
]; // 授時黃道
// 西曆
const EclpDegXinfa = [0, 10.583333333333, 10.666666666667, 17.9, 4.766666666667, 7.716666666667, 15.433333333333, 9.83333333333, 23.35, 9.1, 10.233333333333, 9.983333333333, 20.116666666667, 15.683333333333, 13.266666666667, 11.483333333333, 13, 13.016666666667, 9.266666666667, 13.183333333333, 1.35, 11.55, 30.416666666667, 5.5, 16.1, 8.4, 18.05, 17, 13.05] // 崇禎元年1628戊辰
// const EclpAccumXinfa = [0, 23.349999999999998, 32.45, 42.68333333333334, 52.66666666666667, 72.78333333333333, 88.46666666666667, 101.73333333333333, 113.21666666666667, 126.21666666666668, 139.23333333333332, 148.5, 161.6833333333333, 163.03333333333333, 174.58333333333331, 205, 210.5, 226.6, 235, 253.05, 270.05, 283.09999999999997, 293.68333333333334, 304.34999999999997, 322.25, 327.01666666666665, 334.73333333333335, 350.16666666666663]
const EclpDegJiazi = [0,
  10.616666666666667, 10.633333333333333, 17.833333333333333, 4.8333333333333333, 7.55, 15.933333333333333, 9, // 角七宿76.4
  23.7833333333333, 7.76666666666667, 11.633333333333333, 9.9833333333333333, 20.116666666666667, 15.683333333333333, 13.1, // 斗七宿102.06666666667
  11.65, 13, 12.25, 9.25, 13.966666666666667, 1.35, 11.55, // 奎七宿73.01666666667
  30.416666666666666, 4.6, 17, 8.3833333333333333, 18.066666666666666, 17, 13.05, //井七宿108.5166666667。合360度
] // 甲子元曆黃道度，根據黃道宿鈐歸算。考成·恆星曆理·總論：黃道經緯度根據儀象志歸算而得，而儀象志與新法曆書有微異。
// const EclpAccumJiazi = [0, 10.61666666667, 21.25, 39.08333333333, 43.91666666667, 51.46666666667, 67.4, 76.4, 100.1833333333, 107.95, 119.5833333333, 129.5666666667, 149.6833333333, 165.3666666667, 178.4666666667, 190.1166666667, 203.1166666667, 215.3666666667, 224.6166666667, 238.5833333333, 239.9333333333, 251.4833333333, 281.9, 286.5, 303.5, 311.8833333333, 329.95, 346.95, 360]
// 崇禎曆書暫未找到黃道緯度，暫用甲子元曆緯度
export const EclpLatJiazi = [0,
  -1.98333333333333, 2.96666666666667, .43333333333333, -5.38333333333333, -3.91666666666667, -15, -6.93333333333333,// 角
  -3.83333333333333, 4.68333333333333, 8.16666666666667, 8.7,
  10.7, 19.43333333333333, 12.58333333333333, // 斗
  15.96666666666667, 8.48333333333333, 11.26666666666667, 4.16666666666667, -2.61666666666667, -23.63333333333333, -13.43333333333333, // 奎
  -.88333333333333, -.8, -12.45, -22.4, -26.2, -22.68333333333333, -14.41666666666667 // 井
]
export const MansionNameList =
  "軫角亢氐房心尾箕斗牛女虛危室壁奎婁胃昴畢觜參井鬼柳星張翼軫"; // 值日，星期日對應房、虛、昴、星
// export const MansionNameListQing =
// "軫角亢氐房心尾箕斗牛女虛危室壁奎婁胃昴畢參觜井鬼柳星張翼軫"; // 參觜互換
export const MansionAnimalNameList =
  "蚓蛟龍貉兔狐虎豹獬牛蝠鼠燕豬㺄狼狗雉雞烏猴猿犴羊獐馬鹿蛇蚓";
// 西曆：所有時代都用自己的度數，古曆：各個時代用各個時代的黃道赤道，清代赤道继续用授时
export const AutoDegAccumList = (Name, Y) => {
  const { Type, Solar, SolarRaw, MansionRaw, MansionFracPosi, MansionConst, Sobliq } =
    Para[Name];
  let { Sidereal } = Para[Name];
  let EclpListRaw = [], EquaListRaw = [] // 不同時期用不同的宿度
  Sidereal = Sidereal || Solar || SolarRaw;
  const raw2Accum = ListRaw => {
    let DegList = [], DegAccumList = [];
    if (MansionRaw) {
      DegList = ListRaw.slice();
      DegList[MansionFracPosi] += deci(Sidereal)
      DegAccumList = DegList.slice();
      for (let i = 1; i <= 28; i++) { // 從1開始索引
        DegAccumList[i] += DegAccumList[i - 1]
        DegAccumList[i] = parseFloat(DegAccumList[i].toPrecision(13))
      }
    }
    return DegAccumList
  }
  const raw2AccumB = ListRaw => {
    let DegAccumList = [];
    if (MansionRaw) {
      DegAccumList = ListRaw.slice();
      for (let i = 1; i <= 28; i++) { // 西曆不用加斗分
        DegAccumList[i] += DegAccumList[i - 1]
      }
      for (let i = 1; i <= 28; i++) {
        DegAccumList[i] *= Sidereal / 360
        DegAccumList[i] = parseFloat(DegAccumList[i].toPrecision(13))
      }
    }
    return DegAccumList
  }
  let EquaAccumList = [], EclpAccumList = []
  if (Type === 13) {
    let Precession = 0
    if (Name === 'Jiazi' || Name === 'Guimao') {
      EclpAccumList = raw2AccumB(EclpDegJiazi)
      Precession = 51 / 3600 * (Y - 1684)
    } else {
      EclpAccumList = raw2AccumB(EclpDegXinfa)
      Precession = 51 / 3600 * (Y - 1628)
    }
    for (let i = 0; i <= 28; i++) {
      const MansionLon = (EclpAccumList[i] * 360 / Sidereal - MansionConst + Precession + 270) % 360 // 某星黃經
      EquaAccumList[i] = ((starEclp2Equa(Sobliq, MansionLon, EclpLatJiazi[i + 1]).EquaLon + MansionConst + 90 + 360) % 360) // 這個積度是宮度
    }
    const adj = EquaAccumList[0] - 360
    for (let i = 0; i <= 28; i++) {
      EquaAccumList[i] = (EquaAccumList[i] - adj) * Sidereal / 360
      EquaAccumList[i] = parseFloat(EquaAccumList[i].toPrecision(12))
    }
  } else {
    if (Y >= 1628) {
      if (Y >= 1684) {
        EclpListRaw = EclpDegJiazi
      } else EclpListRaw = EclpDegXinfa
      EclpAccumList = raw2AccumB(EclpListRaw)
    } else {
      if (Y >= 1281) EclpListRaw = EclpDegShoushi
      else if (Type === 10 && Y >= 1180 && Y <= 1280) EclpListRaw = EclpDegNewDaming // 'Daming3'
      else if (Y >= 1106) EclpListRaw = EclpDegJiyuan
      else if (Y >= 1065) EclpListRaw = EclpDegMingtian
      else if (Y >= 964) EclpListRaw = EclpDegYingtian
      else if (Y >= 729) EclpListRaw = EclpDegDayan
      else if (Y >= 665) EclpListRaw = EclpDegLinde
      else if (Name === "Huangji") EclpListRaw = EclpDegHuangji
      else EclpListRaw = EclpDegEasthan
      EclpAccumList = raw2Accum(EclpListRaw)
    }
    if (Y >= 1281) EquaListRaw = EquaDegShoushi
    else if (Y >= 1106) EquaListRaw = EquaDegJiyuan
    else if (Y >= 1065 && Name === "Mingtian") EquaListRaw = EquaDegMingtian
    else if (Y >= 729) EquaListRaw = EquaDegDayan
    else EquaListRaw = EquaDegTaichu
    EquaAccumList = raw2Accum(EquaListRaw)
  }
  EclpAccumList[28] = Sidereal
  EquaAccumList[0] = 0
  EquaAccumList[28] = Sidereal
  return { EclpAccumList, EquaAccumList }
};
// console.log(AutoDegAccumList('Guimao', 1684).EquaAccumList)
export const GongList = [
  "娵訾",
  "降婁",
  "大梁",
  "實沈",
  "鶉首",
  "鶉火",
  "鶉尾",
  "壽星",
  "大火",
  "析木",
  "星紀",
  "玄枵",
]; // 十二次
export const WestGongNameList = [
  "白羊",
  "金牛",
  "陰陽",
  "巨蟹",
  "獅子",
  "雙女",
  "天秤",
  "天蝎",
  "人馬",
  "磨羯",
  "寶瓶",
  "雙魚",
]; // 回回曆法
export const WestGongDayList = [31, 31, 31, 32, 31, 31, 30, 30, 29, 29, 30, 30]; // 已上十二宮，所謂不動之月，凡三百六十五日，乃歲周之日也。若遇宮分有閏之年，於雙魚宮加一日，凡三百六十六日

// @lzfcc：
// const ScList = ['癸亥']
// const StemList = '甲乙丙丁戊己庚辛壬癸'
// const BranchList = '子丑寅卯辰巳午未申酉戌亥'
// for (let i = 0; i < 60; i++) {
//     ScList.push(StemList[i % StemList.length] + BranchList[i % BranchList.length])
// }
// const Hexagram64ListA = ['未濟', '乾', '坤', '屯', '蒙', '需', '訟', '師', '比', '小畜', '履', '泰', '否', '同人', '大有', '謙', '豫', '隨', '蠱', '臨', '觀', '噬嗑', '賁', '剝', '復', '無妄', '大畜', '頤', '大過', '坎', '離', '咸', '恆', '遯', '大壯', '晉', '明夷', '家人', '睽', '蹇', '解', '損', '益', '夬', '姤', '萃', '升', '困', '井', '革', '鼎', '震', '艮', '漸', '歸妹', '豐', '旅', '巽', '兌', '渙', '節', '中孚', '小過', '旣濟', '未濟']
// const MansionList = [ // 赤道度
//     [0, ''],
//     [12, '角'], // 1 東蒼龍 總75
//     [9, '亢'], // 2
//     [15, '氐'], // 3
//     [5, '房'], // 4
//     [5, '心'], // 5
//     [18, '尾'], // 6
//     [11, '箕'], // 7
//     [26, '斗'], // 8 北玄武 總98
//     [8, '牛'], // 9
//     [12, '女'], // 10
//     [10, '虛'], // 11
//     [17, '危'], // 12
//     [16, '室'], // 13
//     [9, '壁'], // 14
//     [16, '奎'], // 15 西白虎 總80
//     [12, '婁'], // 16
//     [14, '胃'], // 17
//     [11, '昴'], // 18
//     [16, '畢'], // 19
//     [2, '觜'], // 20
//     [9, '參'], // 21
//     [33, '井'], // 22 南朱雀 總112
//     [4, '鬼'], // 23
//     [15, '柳'], // 24
//     [7, '星'], // 25
//     [18, '張'], // 26
//     [18, '翼'], // 27
//     [17, '軫'], // 28
// ]
// 黃赤度經過以下檢驗都沒問題了
// let EquaDegList = []
// let EquaAccumList = []
// EquaDegList = EquaDegShoushi.slice()
// EquaAccumList = EquaDegList.slice()
// for (let i = 1; i <= 29; i++) {
//     EquaAccumList[i] += EquaAccumList[i - 1]
// }
// EquaAccumList = EquaAccumList.slice(-1).concat(EquaAccumList.slice(0, -1))
// EquaAccumList[0] = 0
// const EclpDegXinfaAccum = [ // 月離曆指弟十四。「此表崇禎元年定測。以後每年加五十二秒，七十年一度。」即1628戊辰年前冬至在箕4.2833333333
//   0 * 30 + 5 + 33 / 60, // 斗，星紀
//   0 * 30 + 28 + 54 / 60,
//   1 * 30 + 8, // 女，玄枵
//   1 * 30 + 18 + 14 / 60,
//   1 * 30 + 28 + 13 / 60,
//   2 * 30 + 18 + 20 / 60, // 室，娵訾
//   3 * 30 + 4 + 1 / 60, // 壁，降婁
//   3 * 30 + 17 + 17 / 60, // 奎
//   3 * 30 + 28 + 46 / 60,
//   4 * 30 + 11 + 46 / 60, // 胃，大梁
//   4 * 30 + 24 + 47 / 60,
//   5 * 30 + 4 + 3 / 60, // 畢，實沈
//   5 * 30 + 17 + 14 / 60, // 參
//   5 * 30 + 18 + 35 / 60, // 觜  
//   6 * 30 + 0 + 8 / 60, // 井，鶉首
//   7 * 30 + 0 + 33 / 60, // 鬼，鶉火
//   7 * 30 + 6 + 3 / 60,
//   7 * 30 + 22 + 9 / 60,
//   8 * 30 + 0 + 33 / 60, // 張，鶉尾
//   8 * 30 + 18 + 36 / 60,
//   9 * 30 + 5 + 36 / 60, // 軫，壽星
//   9 * 30 + 18 + 39 / 60, // 角
//   9 * 30 + 29 + 14 / 60,
//   10 * 30 + 9 + 54 / 60, // 氐，大火
//   10 * 30 + 27 + 48 / 60,
//   11 * 30 + 2 + 34 / 60, // 心，析木
//   11 * 30 + 10 + 17 / 60,
//   11 * 30 + 25 + 43 / 60 // 箕
// ]
// 甲子元曆黃道宿鈐。五禮通考卷195，p9167。江永：此二十八宿度數，與崇禎戊辰所測者間有損益。
// const EclpDegJiaziAccum = [ // 即1684年前冬至在箕3.1666666667
//   0 * 30 + 5 + 50 / 60, // 斗
//   0 * 30 + 29 + 37 / 60, // _________五礼通考：27分
//   1 * 30 + 7 + 23 / 60,
//   1 * 30 + 19 + 1 / 60,
//   1 * 30 + 29 + 0 / 60,
//   2 * 30 + 19 + 7 / 60,
//   3 * 30 + 4 + 48 / 60,
//   3 * 30 + 17 + 54 / 60, // 奎
//   3 * 30 + 29 + 33 / 60,
//   4 * 30 + 12 + 33 / 60,
//   4 * 30 + 24 + 48 / 60,
//   5 * 30 + 4 + 3 / 60,
//   5 * 30 + 18 + 1 / 60, // 參
//   5 * 30 + 19 + 22 / 60, // 觜。參觜顛倒
//   6 * 30 + 0 + 55 / 60, // 井
//   7 * 30 + 1 + 20 / 60,
//   7 * 30 + 5 + 56 / 60, //————————————五礼通考：52分
//   7 * 30 + 22 + 56 / 60,
//   8 * 30 + 1 + 19 / 60, // 張
//   8 * 30 + 19 + 23 / 60,
//   9 * 30 + 6 + 23 / 60,
//   9 * 30 + 19 + 26 / 60, // 角
//   10 * 30 + 0 + 3 / 60,
//   10 * 30 + 10 + 41 / 60,
//   10 * 30 + 28 + 31 / 60,
//   11 * 30 + 3 + 21 / 60,
//   11 * 30 + 10 + 54 / 60,
//   11 * 30 + 26 + 50 / 60 // 箕
// ]
// 甲子元曆甲子年赤道鈐：
// const EquaDegJiaziAccum1684 = [0 * 30 + 6 + 33 / 60, // 斗
// 1 * 30 + 0 + 46 / 60,
// 1 * 30 + 7 + 41 / 60,
// 1 * 30 + 18 + 44 / 60,
// 1 * 30 + 27 + 26 / 60,
// 2 * 30 + 12 + 17 / 60,
// 2 * 30 + 29 + 18 / 60,
// 3 * 30 + 10 + 10 / 60, // 奎
// 3 * 30 + 24 + 18 / 60,
// 4 * 30 + 6 + 17 / 60,
// 4 * 30 + 21 + 20 / 60,
// 5 * 30 + 2 + 34 / 60,
// 5 * 30 + 19 + 2 / 60,
// 5 * 30 + 19 + 31 / 60,
// 6 * 30 + 1, // 井
// 7 * 30 + 3 + 24 / 60,
// 7 * 30 + 5 + 15 / 60,
// 7 * 30 + 18 + 3 / 60,
// 7 * 30 + 24 + 3 / 60,
// 8 * 30 + 11 + 9 / 60,
// 8 * 30 + 29 + 58 / 60,
// 9 * 30 + 17 + 10 / 60, // 角
// 9 * 30 + 29,
// 10 * 30 + 8 + 24 / 60,
// 10 * 30 + 24 + 57 / 60,
// 11 * 30 + 0 + 29 / 60,
// 11 * 30 + 6 + 42 / 60,
// 11 * 30 + 26 + 21 / 60]
const xxx = [0, 0, 6.430580291831551, 18.729718817791813, 36.4396093534044, 40.40036440392685, 49.189947132986404, 67.22712198217525, 78.06578842682346, 104.68655562806882, 110.67660969230762, 121.24556610005814, 130.69677661681735, 148.87404940929153, 159.77579045945325, 175.39782604388913, 185.6230138901753, 202.18101335215272, 214.77874538053217, 226.95617668158152, 243.36549998456195, 245.95053491379812, 257.17146022265723, 290.71488260409603, 295.53757725036644, 308.70191576494653, 312.8618447041458, 327.4594142699145, 344.7971673626406, 365.2421875]
const fa = () => {
  const a = []
  for (let i = 0; i < xxx.length; i++) {
    a[i] = xxx[i + 1] - xxx[i]
  }
  return a
}
// console.log(fa())