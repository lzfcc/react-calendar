## 現代曆表說明

### 朔閏表

此處提供現代天文學朔閏表，採用的模型是：DE441（-2499–1599）440（1600–2499）曆表、Vondrak 等歲差模型、IAU2000A 章動模型、Stephenson, Morrison 等 ΔT 公式。

#### 步驟

1. 使用各種曆表算出某天體相對於目標天體的ICRS（國際天球參考係）座標 $I_{ICRS}=[x, y, z]$，單位爲 km。
2. 使用frame bias matrix（參考架偏差矩陣）將ICRS座標係轉換爲赤道座標係 $I_{2000}=BI_{ICRS}$
3. 計算歲差矩陣 $P$
4. 計算章動矩陣 $N$
5. 赤道座標爲 $I_{eq}=NPI_{2000}$
6. 使用旋轉矩陣轉換爲黃道座標 $I_{ec}=R_1(ε)I_{eq}$
7. 迭代計算合朔、節氣時刻的 TDB
8. 計算 $ΔT$，得出 $UT1=TT-ΔT≈TDB-ΔT$

需要注意，ELP2000、VSOP87 的座標是黃道，而非 DE 曆表的赤道。所以第 5 步變成了：

5. 赤道座標爲 $I_{eq}=NPR_1(-ε)I_{2000}$

**不能**這樣：

5. 黃道座標爲 $I_{ec}=NPI_{2000}$
6. 赤道座標爲 $I_{eq}=R_1(-ε)I_{ec}$

#### 一些備忘

- DE 曆表與廖育棟網站上的系統誤差是 ΔT  算法造成的（他似乎用的《月相》較老的，我用了他 *Star Charts* 所說的較新的），時間一長，相差能有三分鐘。$ΔT=TT-UT1$ 受到地球自轉速度變動影響，這在計算古代日食時是主要誤差，影響遠大於曆表的誤差。
- 本站用 DE440/1 編算的朔閏表是目前最精確的朔閏表，忽略光行時光行差的近似誤差、TDB 到 TT 的近似誤差，可以精確到 0.01 秒。使用 ELP2000、VSOP87 半分析曆表計算合朔，公元前 1000 年的誤差在一分半鐘以內，公元 2000 年誤差在一秒以內。
- 半分析曆表計算 100 年朔閏大約用時 23 秒。DE440/1 曆表的朔望節氣時刻已在本地算出，網頁端的工作是編排朔閏。python 計算 11000 個節氣時刻用 450秒。

#### 農曆編排

GB/T 33661-2017《农历的编算和颁行》第四節《農曆的編排規則》有五條：

1. 以北京时间为标准时间。
2. 朔日为农历月的第一个农历日。
3. 包含节气冬至在内的农历月为农历十一月。
4. 若从某个农历十一月开始到下一个农历十一月（不含）之间有13 个农历月，则需要置闰。置闰规则为：取其中最先出现的一个不包含中气的农历月为农历闰月。
5. 农历十一月之后第2个（不计闰月）农历月为农历年的起始月。

### 曆表

由完整的VSOP87、ELP2000曆表算出。提供的是視位置。

### Acknowledgement

|          | 模型                                                         | 代碼來源                                                     |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 總體方法 | 廖育棟                                                       | 《[月相和二十四節氣的計算](https://ytliu0.github.io/ChineseCalendar/computation_simp.html)》、*[Calculations in Star Charts](https://ytliu0.github.io/starCharts/)* |
| 行星曆表 | VSOP87A                                                      | [orbit.js](https://vsr83.github.io/orbits.js/)               |
| 月球曆表 | ELP2000                                                      | [orbit.js](https://vsr83.github.io/orbits.js/)               |
| 數值曆表 | DE441/0                                                      | [jplephem](https://pypi.org/project/jplephem/)               |
| 歲差     | Vondrak 等（2011）                                           | [Vondrak](https://github.com/dreamalligator/vondrak)，由 GPT 轉換爲 JS。代碼中保留了我自己寫的 IAU2006 |
| 章動     | [IAU2000A](http://asa.usno.navy.mil/SecM/Glossary.html#nutation) | [python-novas](https://github.com/brandon-rhodes/python-novas)/Cdist/nutation.c，由 GPT 轉換爲 JS。代碼中保留了我自己寫的 IAU2000 |
| TT轉UT1  | Stephenson等人（2016）及Morrison等人（2021）的擬合公式       | 廖育棟 [DeltaT](https://github.com/ytliu0/DeltaT)，由 GPT 轉換爲 JS。代碼中保留了 Morrison、Stephenson（2004）的公式 |

另外可參考的庫：

- [ephem.js](https://github.com/THRASTRO/ephem.js/) 各種各樣的 VSOP、ELP。
- 計算DE曆表的[jplephem](https://pypi.org/project/jplephem/)庫，以及功能豐富的skyfield庫。
- [Astronomy and numerical software source codes](http://www.moshier.net/#Cephes)
