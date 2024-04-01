import {
  AutoSolar,
  AutoSidereal,
} from "../parameter/auto_consts.mjs";

export const Equa2EclpFormula = (LonRaw, Name) => {
  // 公式化的，週天度就用自己的
  const Solar = AutoSidereal(Name);
  const Solar25 = Solar / 4;
  const Solar50 = Solar / 2;
  const Solar125 = Solar / 8;
  const Solar75 = Solar * 0.75;
  let Equa2Eclp = 0;
  let Eclp2Equa = 0;
  const LonQuar = LonRaw % Solar25;
  const Lon = Solar125 - Math.abs(LonQuar - Solar125);
  let h = 0;
  let Eclp2EquaDif = 0;
  let Equa2EclpDif = 0;
  // 這些函數並不是以91度或者45度對稱，而是將近60度左右
  if (Name === "Chongxuan") {
    Equa2EclpDif =
      ((1315 - 14.4 * Lon) * Lon - (Lon * (4566 - Lon)) / 1696) / 10000;
    // const tmp1 =(frc('8685 4566/1696').div(frc(14.4).sub('1/1696'))).div(2).toFraction(true) // '301 81608 / 122107'
    // const tmp2=frc(10000).div(frc(14.4).sub('1/1696')).toFraction(true) // "694 57742/122107"
    h =
      Math.sqrt((694 + 57742 / 122107) * Lon + (301 + 81608 / 122107) ** 2) -
      (301 + 81608 / 122107);
  } else if (["Dayan", "Chongtian"].includes(Name)) {
    if (Lon <= 45) {
      Equa2EclpDif = (Lon * (125 - Lon)) / 1200; // 在45度正好=3，所以45以上處理爲依平
      h = Math.sqrt(288906.25 + 1200 * Lon) - 537.5;
    } else {
      Equa2EclpDif = 3;
      h = 3;
    }
  } else if (Name === "Mingtian") {
    Equa2EclpDif = (Lon * (111.37 - Lon)) / 1000;
    h = Math.sqrt(197415.819225 + 1000 * Lon) - 444.315;
  } else if (["Guantian", "Fengyuan", "Zhantian"].includes(Name)) {
    Equa2EclpDif = (Lon * (400 - 3 * Lon)) / 4000;
    h = Math.sqrt(360000 + (4000 / 3) * Lon) - 600;
  } else if (Name === "Jiyuan") {
    // 紀元一直到南宋、大明、庚午
    Equa2EclpDif = (Lon * (101 - Lon)) / 1000;
    // if (LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75)) {
    h = Math.sqrt(202050.25 + 1000 * Lon) - 449.5;
    // }
    //  else {
    //     h = -Math.sqrt(303050.25 - 1000 * LonHalf) + 550.5 // 這兩個公式是一樣的，只是對稱而已
    // }
  }
  // 《古代曆法》頁123    沒明白。曲安京《中国古代的二次求根公式与反函数》，西北大学学报(自然科学版). 1997(01)。曆法中二次反函數僅有的例子是大衍行星行度、紀元。赤道度爲Solar/8，黃道度就是43.1287。兩篇公式不一樣，最後畫圖才想明白。我把其他幾個曆法補出來了
  Eclp2EquaDif = Math.abs(Lon - h);
  const sign1 =
    LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75) ? -1 : 1;
  const sign2 =
    LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75) ? 1 : -1;
  Equa2EclpDif *= sign1;
  Eclp2EquaDif *= sign2;
  Equa2Eclp = LonRaw + Equa2EclpDif;
  Eclp2Equa = LonRaw + Eclp2EquaDif;
  return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif };
};
// console.log(Equa2EclpFormula(91, 'Chongxuan'))
/**
 *
 * @param {*} LonRaw 儀天：距冬至時長，其他：實行度
 * @param {*} Name
 * @returns 赤緯
 */
export const latFormula = (XRaw, Name) => {
  // 《中國古代曆法》頁128、古曆新探p172。漏刻頁135。
  const Solar = AutoSidereal(Name);
  const Solar25 = Solar / 4;
  const Solar50 = Solar / 2;
  XRaw %= Solar;
  const LonHalf = XRaw % Solar50;
  let Lat = 0;
  let g = 0;
  if (Name === "Yitian") {
    if (XRaw >= 88.8811 && XRaw < Solar50 + 93.7411) {
      // 冬至後次象// 946785.5 / 10100=93.7411
      Solar50;
      const Lon = Math.abs(Solar50 - XRaw);
      g =
        (1261875 / 20126347) * Lon ** 2 -
        (6250000 / (20126347 * 522009)) * Lon ** 4;
      Lat = 23.9296 - (50 / 1052) * g;
    } else {
      // 冬至後初象
      const Lon = Math.min(XRaw, Solar - XRaw); // 到0的距離
      g =
        (167750 / 2229099) * Lon ** 2 - (125000 / (2229099 * 39107)) * Lon ** 4;
      Lat = -23.9081 + (50 / 1062) * g;
    }
  } else if (Name === "Jiyuan") {
    const Lon = Solar25 - Math.abs(LonHalf - Solar25);
    if (XRaw >= Solar25 && XRaw < 3 * Solar25) {
      // 夏至前後
      Lat =
        23.9 -
        (491.3109 ** 2 * Lon ** 2 - 982.6218 * Lon ** 3 + Lon ** 4) /
          160000 /
          348.856;
    } else {
      // 冬至前後
      Lat =
        -23.9 +
        (608.3109 ** 2 * Lon ** 2 - 1216.6218 * Lon ** 3 + Lon ** 4) /
          267289 /
          348.856;
    }
  } else {
    const Lon = Solar25 - Math.abs(LonHalf - Solar25);
    if (
      [
        "Chongxuan",
        "Qintian",
        "Chongtian",
        "Mingtian",
        "Guantian",
        "Fengyuan",
        "Zhantian",
      ].includes(Name)
    ) {
      let a = 1221360 / 346290367;
      let b = 784000 / (346290367 * 29109);
      let e1 = 24.0041;
      let e2 = 23.9959; //  'Guantian', 'Fengyuan', 'Zhantian'
      if (["Chongxuan", "Qintian"].includes(Name))
        (a = 184 / 50025),
          (b = 16 / (50025 * 3335)),
          (e1 = 23.9141),
          (e2 = 23.8859);
      if (Name === "Chongtian")
        (a = 460720 / 130620943), (b = 80000 / (130620943 * 7873));
      else if (Name === "Mingtian")
        (a = 84800 / 24039561), (b = 20000 / (24039561 * 10689));
      g = a * Lon ** 2 - b * Lon ** 4;
      if (XRaw >= Solar25 && XRaw < 3 * Solar25) Lat = e1 - g;
      else Lat = -e2 + g;
    }
  }
  return +Lat.toFixed(6);
};
// console.log(latFormula(200, 'Yitian').Lat)
// console.log(1e-6)
export const riseFormula = (LatNoon, SdNoon, Name) => {
  const Solar = AutoSidereal(Name);
  const Solar50 = Solar / 2;
  let Night = 0;
  if (Name === "Yitian") {
    if (SdNoon < 88.8811) Night = 22.53 - LatNoon / 4.76;
    else if (SdNoon < Solar50) Night = 22.49 - LatNoon / 4.8;
    else if (SdNoon < Solar50 + 93.7411) Night = 22.51 - LatNoon / 4.8;
    else Night = 22.47 - LatNoon / 4.76;
  } else Night = 22.5 - LatNoon / 4.8;
  return Night + 2.5;
};
export const dialFormula = (DegRaw, Name, SolsDeci) => {
  // 陈美东《崇玄仪天崇天三历晷长计算法及三次差内插法的应用》有儀天曆術文補
  const Solar = AutoSolar(Name);
  const Solar25 = Solar / 4;
  const Solar50 = Solar / 2;
  DegRaw %= Solar;
  let xian = 0;
  let Dial = 0;
  const DialMor = 0;
  if (["Chongxuan", "Qintian", "Yitian"].includes(Name)) xian = 59;
  else if (Name === "Chongtian") xian = 62;
  else if (["Mingtian", "Guantian", "Fengyuan", "Zhantian"].includes(Name))
    xian = 45.62;
  else if (Name === "Jiyuan") xian = 62.2;
  const Deg1 = Math.min(DegRaw, Solar - DegRaw); // 與0的距離
  const Deg2 = Math.abs(Solar50 - DegRaw); // 與180的距離
  if (["Chongxuan", "Qintian", "Yitian", "Chongtian"].includes(Name)) {
    let a1 = 2197.14;
    let b1 = 15.05;
    let a2 = 4881.67;
    let b2 = 4.01; // 崇天
    if (Name === "Chongxuan" || Name === "Qintian")
      (a1 = 2195), (b1 = 15), (a2 = 4880), (b2 = 4);
    else if (Name === "Yitian") (a1 = 2130), (b1 = 14), (a2 = 4812), (b2 = 3.5);
    if (DegRaw < xian || DegRaw >= Solar - xian) {
      Dial = 12.715 - 1e-6 * (a1 - b1 * Deg1) * Deg1 ** 2;
    } else Dial = 1.478 + 1e-7 * (a2 - b2 * Deg2) * Deg2 ** 2;
    // if (['Chongxuan', 'Qintian'].includes(Name)) { // 大衍、崇玄求次日晷長。爲避免麻煩，統一用崇天的方法。儀天：算二至具體時刻到當日夜半，再加減半日晷長。《古曆新探》p138:當日時刻到二至(.N)的時長，崇玄.5-.N，儀天0，崇天.5。
    //     const DegRawMor = DegRaw + 1
    //     let DegMor = parseFloat(((DegRaw + 1) % Solar50).toPrecision(14))
    //     if ((DegRawMor > xian && DegRawMor < Solar50) || (DegRawMor >= Solar - xian)) DegMor = parseFloat((Solar50 - DegMor).toPrecision(14))
    //     if (DegRawMor < xian || (DegRawMor >= Solar - xian)) {
    //         DialMor = 12.715 - 1e-6 * (a1 - b1 * DegMor) * DegMor ** 2
    //     } else DialMor = 1.478 + 1e-7 * (a2 - b2 * DegMor) * DegMor ** 2
    //     Dial += (.5 - SolsDeci) * (DialMor - Dial)
    // }
  } else if (["Mingtian", "Guantian", "Fengyuan", "Zhantian"].includes(Name)) {
    if (DegRaw <= xian || DegRaw >= Solar - xian) {
      Dial =
        12.85 -
        1e-6 *
          (1937.5 * Deg1 ** 2 -
            Deg1 ** 3 -
            (200 / 827) * Deg1 ** 4 +
            (1 / 827) * Deg1 ** 5);
    } else if (DegRaw > Solar25 && DegRaw < 3 * Solar25) {
      Dial =
        1.57 +
        1e-6 *
          (545.25 * Deg2 ** 2 -
            (3827 / 2481) * Deg2 ** 3 +
            (5 / 827) * Deg2 ** 4);
    } else {
      Dial =
        1.57 +
        1e-6 *
          (510.09274 * Deg2 ** 2 -
            1.213548 * Deg2 ** 3 +
            0.01034059 * Deg2 ** 4 -
            0.0000403063 * Deg2 ** 5);
    }
  } else if (Name === "Jiyuan") {
    if (DegRaw <= xian || DegRaw >= Solar - xian) {
      Dial =
        12.83 -
        (200 * Deg1 ** 2) / (100617 + 100 * Deg1 + (400 / 29) * Deg1 ** 2);
    } else if (DegRaw > Solar25 && DegRaw < 3 * Solar25) {
      Dial = 1.56 + (4 * Deg2 ** 2) / (7923 + 9 * Deg2);
    } else {
      Dial =
        1.56 +
        (7700 * Deg2 ** 2) / (13584271.78 + 44718 * Deg2 - 100 * Deg2 ** 2);
    }
  }
  return Dial;
};
// console.log(dialFormula(307, 'Chongxuan', .3))
