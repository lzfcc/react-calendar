import { date2Jd, jd2Date } from '../time/jd2date.mjs'

/**
 * deltaT=TT-UT1 ,  -1999 to +3000 // https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html
 * All values of ΔT based on Morrison and Stephenson [2004] assume a value for the Moon's secular acceleration of -26 arcsec/cy^2. However, the ELP-2000/82 lunar ephemeris employed in the Canon uses a slightly different value of -25.858 arcsec/cy^2. Thus, a small correction "c" must be added to the values derived from the polynomial expressions for ΔT before they can be used in the Canon:
    c = -0.000012932 * (y - 1955)^2
 * @param {*} year 
 * @param {*} month 
 * @returns delta(day)
 */
const TT2UT1_Old = (year, month) => {
    month = month || 1
    const y = year + (month - .5) / 12 // This gives "y" for the middle of the month
    let u = 0, t = 0, D = 0
    if (year < -1999) return undefined
    else if (year < -500) {
        u = (y - 1820) / 100
        D = -20 + 32 * u ** 2
    } else if (year < 500) {
        u = y / 100
        D = 10583.6 - 1014.41 * u + 33.78311 * u ** 2 - 5.952053 * u ** 3 - 0.1798452 * u ** 4 + 0.022174192 * u ** 5 + 0.0090316521 * u ** 6
    } else if (year < 1600) {
        u = (y - 1000) / 100
        D = 1574.2 - 556.01 * u + 71.23472 * u ** 2 + 0.319781 * u ** 3 - 0.8503463 * u ** 4 - 0.005050998 * u ** 5 + 0.0083572073 * u ** 6
    } else if (year < 1700) {
        t = y - 1600
        D = 120 - 0.9808 * t - 0.01532 * t ** 2 + t ** 3 / 7129
    } else if (year < 1800) {
        t = y - 1700
        D = 8.83 + 0.1603 * t - 0.0059285 * t ** 2 + 0.00013336 * t ** 3 - t ** 4 / 1174000
    } else if (year < 1860) {
        t = y - 1800
        D = 13.72 - 0.332447 * t + 0.0068612 * t ** 2 + 0.0041116 * t ** 3 - 0.00037436 * t ** 4
            + 0.0000121272 * t ** 5 - 0.0000001699 * t ** 6 + 0.000000000875 * t ** 7
    } else if (year < 1900) {
        t = y - 1860
        D = 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3
            - 0.0004473624 * t ** 4 + t ** 5 / 233174
    } else if (year < 1920) {
        t = y - 1900
        D = -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4
    } else if (year < 1941) {
        t = y - 1920
        D = 21.20 + 0.84493 * t - 0.076100 * t ** 2 + 0.0020936 * t ** 3
    } else if (year < 1961) {
        t = y - 1950
        D = 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547
    } else if (year < 1986) {
        t = y - 1975
        D = 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718
    } else if (year < 2005) {
        t = y - 2000
        D = 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5
    } else if (year < 2050) {
        t = y - 2000
        D = 62.92 + 0.32217 * t + 0.005589 * t ** 2
    } else if (year < 2150) {
        D = -20 + 32 * ((y - 1820) / 100) ** 2 - 0.5628 * (2150 - y)
    } else if (year < 3000) {
        u = (y - 1820) / 100
        D = -20 + 32 * u ** 2
    } else return undefined
    return D / 86400
}

// 廖育棟 [DeltaT](https://github.com/ytliu0/DeltaT) 的 Python 代碼
export const deltaT = Jd => {
    const Year = jd2Date(Jd).year
    const y = (Jd - date2Jd(Year)) / 365.2425 + Year
    const c1 = 1.007739546148514 // chosen to make DeltaT continuous at y = -720
    const c2 = -150.3150351029286 // chosen to make DeltaT continuous at y = 2022
    const integrated_lod = (y, C) => {
        const t = 0.01 * (y - 1825)
        return C + 31.4115 * t ** 2 + 284.8435805251424 * Math.cos(0.4487989505128276 * (t + 0.75))
    }
    const spline = y => {
        const YList = [-720, -100, 400, 1000, 1150, 1300, 1500, 1600, 1650, 1720, 1800, 1810, 1820, 1830, 1840, 1850, 1855, 1860, 1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910, 1915, 1920, 1925, 1930, 1935, 1940, 1945, 1950, 1953, 1956, 1959, 1962, 1965, 1968, 1971, 1974, 1977, 1980, 1983, 1986, 1989, 1992, 1995, 1998, 2001, 2004, 2007, 2010, 2013, 2016, 2019, 2022]
        const a0 = [20371.848, 11557.668, 6535.116, 1650.393, 1056.647, 681.149, 292.343, 109.127, 43.952, 12.068, 18.367, 15.678, 16.516, 10.804, 7.634, 9.338, 10.357, 9.04, 8.255, 2.371, -1.126, -3.21, -4.388, -3.884, -5.017, -1.977, 4.923, 11.142, 17.479, 21.617, 23.789, 24.418, 24.164, 24.426, 27.05, 28.932, 30.002, 30.76, 32.652, 33.621, 35.093, 37.956, 40.951, 44.244, 47.291, 50.361, 52.936, 54.984, 56.373, 58.453, 60.678, 62.898, 64.083, 64.553, 65.197, 66.061, 66.919, 68.128, 69.248]
        const a1 = [-9999.586, -5822.27, -5671.519, -753.21, -459.628, -421.345, -192.841, -78.697, -68.089, 2.507, -3.481, 0.021, -2.157, -6.018, -0.416, 1.642, -0.486, -0.591, -3.456, -5.593, -2.314, -1.893, 0.101, -0.531, 0.134, 5.715, 6.828, 6.33, 5.518, 3.02, 1.333, 0.052, -0.419, 1.645, 2.499, 1.127, 0.737, 1.409, 1.577, 0.868, 2.275, 3.035, 3.157, 3.199, 3.069, 2.878, 2.354, 1.577, 1.648, 2.235, 2.324, 1.804, 0.674, 0.466, 0.804, 0.839, 1.005, 1.341, 0.620]
        const a2 = [776.247, 1303.151, -298.291, 184.811, 108.771, 61.953, -6.572, 10.505, 38.333, 41.731, -1.126, 4.629, -6.806, 2.944, 2.658, 0.261, -2.389, 2.284, -5.148, 3.011, 0.269, 0.152, 1.842, -2.474, 3.138, 2.443, -1.329, 0.831, -1.643, -0.856, -0.831, -0.449, -0.022, 2.086, -1.232, 0.22, -0.61, 1.282, -1.115, 0.406, 1.002, -0.242, 0.364, -0.323, 0.193, -0.384, -0.14, -0.637, 0.708, -0.121, 0.21, -0.729, -0.402, 0.194, 0.144, -0.109, 0.275, 0.061, -0.782]
        const a3 = [409.16, -503.433, 1085.087, -25.346, -24.641, -29.414, 16.197, 3.018, -2.127, -37.939, 1.918, -3.812, 3.25, -0.096, -0.539, -0.883, 1.558, -2.477, 2.72, -0.914, -0.039, 0.563, -1.438, 1.871, -0.232, -1.257, 0.72, -0.825, 0.262, 0.008, 0.127, 0.142, 0.702, -1.106, 0.614, -0.277, 0.631, -0.799, 0.507, 0.199, -0.414, 0.202, -0.229, 0.172, -0.192, 0.081, -0.165, 0.448, -0.276, 0.11, -0.313, 0.109, 0.199, -0.017, -0.084, 0.128, -0.071, -0.281, 0.193]
        // 以下由GPT將這句話翻譯成JS  i = np.searchsorted(YList, y, 'right') - 1
        let i = YList.indexOf(YList.reduce((prev, curr) => curr < y ? curr : prev, YList[0]))
        const t = (y - YList[i]) / (YList[i + 1] - YList[i])
        return a0[i] + t * (a1[i] + t * (a2[i] + t * a3[i]))
    }
    let D = 0
    if (y < -720) D = integrated_lod(y, c1);
    else if (y > 2022) D = integrated_lod(y, c2);
    else D = spline(y);
    return D / 86400
}
// console.log(TT2UT1_Old(-499, 1))
// console.log(deltaT(1942)) // 2024: 69s，1924:23.489256，-1160:28240s，1942: 25.346976
// const gmst_IAU1984 = T => {
//     return 6 + 41 / 60 + 50.54841 / 3600 + 8640184.812866 / 3600 * T + 0.093104 / 3600 * T ** 2 - 6.2e-6 / 3600 * T ** 3
// }
// // console.log(gmst(1))

export function deltaTError(y) {
    // Table for estimating the errors in Delta T for years in [-2000, 2500] based on http://astro.ukho.gov.uk/nao/lvm/
    const ytab = [-2000, -1600, -900, -720, -700, -600, -500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500, 700, 800, 900, 1000, 1620, 1660, 1670, 1680, 1730, 1770, 1800, 1802, 1805, 1809, 1831, 1870, 2022.5, 2024.5, 2025, 2030, 2040, 2050, 2100, 2200, 2300, 2400, 2500]
    const eps_tab = [1080, 720, 360, 180, 170, 160, 150, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 25, 20, 15, 20, 15, 10, 5, 2, 1, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.1, 0.2, 1, 2, 4, 6, 10, 20, 30, 50, 100]
    const k1 = 0.74e-4;
    const k2 = 2.2e-4;
    const nytab = ytab.length;
    function searchSorted(arr, value) {
        let low = 0;
        let high = arr.length;

        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            if (arr[mid] < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
    // Handle both scalar and array input
    if (!Array.isArray(y)) y = [y];
    return y.map((val) => {
        if (val < ytab[0]) {
            return Math.trunc(k1 * Math.pow(val - 1875, 2)) // Fix: changed from 1825 to 1875
        } else if (val >= ytab[nytab - 1]) {
            return Math.trunc(k2 * Math.pow(val - 1875, 2)) // Fix: changed from 1825 to 1875
        } else {
            const index = searchSorted(ytab, val) - 1;
            return eps_tab[index >= 0 ? index : 0]; // Fix: to avoid undefined if index is -1
        }
    });
}
// console.log(deltaTError(-2020))
