import { add, chain, divide, matrix, multiply } from "mathjs";
import { cDay } from "../parameter/functions.mjs";

// 以下分別為R1 R2 R3 ，分別爲x, y, z軸旋轉矩陣。輸入弧度
export const rr1 = (a) =>
  matrix([
    [1, 0, 0],
    [0, Math.cos(a), Math.sin(a)],
    [0, -Math.sin(a), Math.cos(a)]
  ]);
export const rr2 = (b) =>
  matrix([
    [Math.cos(b), 0, -Math.sin(b)],
    [0, 1, 0],
    [Math.sin(b), 0, Math.cos(b)]
  ]);
export const rr3 = (g) =>
  matrix([
    [Math.cos(g), Math.sin(g), 0],
    [-Math.sin(g), Math.cos(g), 0],
    [0, 0, 1]
  ]);

// 參考架偏差矩陣 frame bias matrix
export const Fbmx = matrix([
  [0.99999999999999425, -7.078279744e-8, 8.05614894e-8],
  [7.078279478e-8, 0.99999999999999695, 3.306041454e-8],
  [-8.056149173e-8, -3.306040884e-8, 0.999999999999996208]
]);

export const xyz2lonlat = (X) => {
  // X = X.flat(Infinity)
  const Lon = Math.atan2(X[1], X[0]);
  // const Lat = Math.asin(X[2])
  //   const Lat = Math.atan2(X[2], sqr(X[0] ** 2 + X[1] ** 2));
  const Lat = Math.asin(X[2] / Math.hypot(...X)); // ⚠️兩者等效
  return { Lon, Lat };
};
// console.log(xyz2lonlat([3, 4, 0.1]));
/**
 * 位置矢量
 * @param {*} Lon ⚠️角度deg
 * @param {*} Lat ⚠️角度deg
 * @returns
 */
export const lonlat2xyz = (Lon, Lat, D) => [
  (D || 1) * Math.cos(Lat) * Math.cos(Lon),
  (D || 1) * Math.cos(Lat) * Math.sin(Lon),
  (D || 1) * Math.sin(Lat)
];
// 求徑向速度
export const radialV = (X, V) => {
  const R = Math.hypot(...X);
  const Vr = (V[0] * X[0] + V[1] * X[1] + V[2] * X[2]) / R;
  return Vr;
};
// 光行時修正retarded time推遲時。t - |X(tr)-XE(t)| / c 然後迭代算出。近似公式t - |X(t)-XE(t)|
export const lightTimeCorr = (t0, X) => t0 - Math.hypot(...X) / cDay;

// 光行差 見廖育棟文檔
// n′ = γ−1n + β + (n·β)β / (1 + γ−1)
//      / (1 + β·n)
export const lightAber = (X, V) => {
  const Xmod = Math.hypot(...X);
  const v = Math.hypot(...V);
  const n = divide(X, Xmod); // 單位向量
  const Vverse = multiply(V, -1);
  const Beta = divide(Vverse, cDay);
  const g1 = Math.sqrt(1 - (v / cDay) ** 2);
  const tmp1 = add(multiply(g1, n), Beta);
  const tmp2 = chain(n)
    .multiply(Beta)
    .multiply(Beta)
    .divide(1 + g1)
    .done();
  const tmp3 = add(1, multiply(Beta, n));
  const n1 = divide(add(tmp1, tmp2), tmp3);
  // 近似公式：相差很小
  // const tmp4 = add(n, Beta)
  // const tmp5 = Math.hypot(...add(n, Beta))
  // const n1a = divide(tmp4, tmp5)
  return multiply(n1, Xmod);
};
