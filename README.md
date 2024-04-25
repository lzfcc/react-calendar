---
author: ["柯棋瀚"]
title: "曆藏（中國古曆編製器）說明"
date: 2021-02-24
lastmod: 2021-04-21
---

簡介
-----

1. 本工具的使用對象是古代天文曆法研究者。對於一般文史研究者，更推薦使用下面的友情鏈接。
2. 目前的古代朔閏査詢網站都是根據工具書、文獻材料手動調整的<n>參考中研院 [兩千年中西曆轉換說明書](https://sinocal.sinica.edu.tw/lusodoc.html)，廖育棟 [本網站的農曆編算](https://ytliu0.github.io/ChineseCalendar/computation_chinese.html)</n>。本工具可提供古代實行未實行的 60 餘部曆法的計算，完全遵照各曆算法進行全自動計算，無手動干預。主要有三大功能區：
   1. **朔閏表** 每年的積年、冬至大小餘、閏餘；冬至時刻的入轉日、入交泛日、入週天度。各月定朔<n>線性內插、二次三次內插</n>、平朔，定朔日月所在黃赤宿度，定望，平氣、定氣、定氣太陽所在黃赤宿度。日月食食甚時刻、食分。
   2. **曆書** 包含天文曆、具注曆兩部份。
      1. 天文曆：每日夜半日月經緯度及宿度、晷長、日出日入、昏旦中星。
      2. 具注曆：每年「術數年」積年、男女九宮，年干支五行、納音、魁罡之月，23 種歲神，年九宮色。每月月建、月神、吉時、月九宮色。每日干支、儒略日、公曆日期、納音五行、建除、黃道吉日黑道凶日、七星值日、二十八宿二十八禽值日，二十四節氣時刻、七十二候時刻、沒滅日時刻、土王用事時刻、卦用事時刻，人神、日遊神、血支血忌，10 種日神。
   3. **數學工具** 包含同餘、招差、天文、時間四個板塊。
      1. 同餘：大衍求一術、解一次同餘式、大衍總數術，擬秦九韶調日法、淸人調日法三種、連分數，最大公因數、章蔀紀元法，古曆入元、秦九韶演紀法，從零開始造唐宋曆。
      2. 方程：隙積術芻童垛、三角垛落一形垛、四角垛方垛，招差術、拉格朗日內插，二分迭代法解高次方程。
      3. 天文：日月中心差，黃赤轉換，會圓術、弧矢割圓術，晷漏，黃赤九道宿鈐，月亮緯度。
      4. 時間：將萬分小數轉換爲辰刻，儒略日、日期轉換，恆星時，公元年、年干支轉換。
3. 如您發現任何問題，可通過評論框或郵件向我反饋。若您在研究過程中發現程序結果與文獻不符，望不吝提供線索。這個工具是根據研究需要而開發的，如果您有任何功能需求，敬請與我聯繫，我會在力所能及的範圍內儘量實現。
4. 本工具與以往的朔閏表工具書是相互補充的關係，古人算曆有可能不會完全依照術文，會根據實際情況適當調整，這種情況下計算程序就無能爲力。
5. 本工具完全開源，如您需要査詢、核査各曆的詳細參數與算法，請前往源碼倉庫。如您不嫌麻煩，可以下載源碼，在本地運行程序。開發者說明及更新日誌見 github 倉庫 readme。**隱私聲明** 本站使用了 Google Analytics 進行流量分析；評論系統採用 Hyvor Talk；服務器託管在 Netlify 平臺。運算均在本地瀏覽器進行。

## 开发者说明

### 技术特征

- 计算程序采用 JS 编写
- 前端框架采用 React
- 朔闰表、历书采用 Web Worker，实现 UI 线程与计算线程分离
- 采用 WebPack 打包
- ~~朔闰表采用懒加载，大幅压缩渲染时间~~
- 采用 [Decimal.js](https://mikemcl.github.io/decimal.js/)<span classname="decimal64">.64</span> 进行小数点后 64 位大数字运算，采用 [fraction.js](https://www.npmjs.com/package/fraction.js)<span classname="decimal64">n/d</span> 进行分数运算，采用 [nzh](https://blog.whyoop.com/nzh/docs) 进行阿拉伯数字、汉字转换。~~采用 [react-markdown](https://www.npmjs.com/package/react-markdown) 进行文档渲染。~~

### 安裝

1. 安裝 `node.js`
2. `npm install`
3. 我移動了前端的目錄，所以要在 `node_modules/react-scripts/config/path.js` 中先把 `src/index/` 改成 `src/Frontend/index`
4. `npm run build`

### 文件功能

核心计算程序在 `/src/Cal` 目录下，有 8 个板块，各文件功能说明：

- `parameter` 参数
  - `auto_consts` 根據曆法選擇天文參數
  - `calendars` 各历法参数
  - `constants` 全局常量参数
  - `functions` 一些基本的小型函數
  - `hexa` 筮法用到的
- `newmoon` 朔闰表模块
  - `newm` 大部分古曆的朔闰计算
  - `newm_quar` 四分历朔闰计算
  - `newm_shixian` 時憲曆朔闰计算
  - `newm_de` DE 曆表曆朔闰计算
  - `index` 朔闰计算汇总调整输出
  - `index_de` DE 曆表朔闰计算汇总调整输出
- `ephemeris` 历书模块
  - `eph` 古曆历书计算
  - `eph_shixian` 時憲曆历书计算
  - `eph_modern` 現代曆表历书计算
  - `luck` 历书中岁神、日神的计算
  - `index` 曆書匯總模塊
- `astronomy` 天文模块
  - `acrv` 日月速度改正
  - `astr_const` 天文常數的計算
  - `dayadjust` 進朔退望
  - `eclipse` 日月交食
  - `equa_eclp` 黃赤經度轉換
  - `lat_rise_dial` 太陽赤緯、日出、晷長
  - `astronomy_gong2Mans` 黄赤道积度转换为入宿度
  - `mans` 入宿度
  - `moon_pos` 月亮經緯
  - `nineorbits` 月行九道
  - `pos_convert_modern` 現代天文學位置轉換
  - `pos_convert` 清代位置轉換
  - `pos_functions` 位置轉換要用到的基本函數
  - `bind` 集中展示所有曆法的情況
- `congruence` 同馀模块
  - `continued-frac` 分数连分数
  - `continued-frac1` 小数连分数
  - `denom` 调日法
  - `exhaustion` 从零开始造宋历
  - `gcdlcm` 最大公因数
  - `origin` 演纪
  - `qiuyi` 大衍求一术
- `equation` 方程模块
  - `geometry` 几何
  - `high` 解高次方程
  - `math` 数字格式转换
  - `sn` 垛积
  - `sqrt` 开方
- `time_` 时间模块
  - `decimal2clock` 日分转换为辰刻
  - `era` 年干支转换
  - `jd2date` 儒略日、日期转换
  - `delta-t` DeltaT
  - `sidereal_time` 恆星時
- `modern` 現代天文學
  - `elp2000-82b_list` ELP 曆表的週期項
  - `elp2000` ELP 曆表
  - `vsop87a_list` VSOP 曆表的週期項
  - `vsop` VSOP 曆表
  - `vsop_elp` 用 VSOP、ELP 計算日月五星視位置
  - `vsop_elp_bind` 一起計算日月五星
  - `mans` 入宿度
  - `newm_de44_list syzygy_de44_list term_de44_list term1_de44_list` DE440/1 曆表的朔、望、節、氣時刻
  - `nutation_list` 章動週期項
  - `nutation` IAU2000 章動
  - `precession` Vondrak 歲差

- `hexagram` 筮法模塊
- `guqin` 琴律模塊
- `output_`其他
  - `output` 输出准备
  - `output_print` 本地打印入口。`const printData = outputFile(2, 1255, 1255, 0` 第一个数字为模式，`1` 为朔闰表，`2` 为历书；第二三个数字为起始年、终止年；第四个数字为自动长历模式开关，目前暂不支持
  - `output_worker` Web Worker，朔闰表、历书两个模块的前端调用入口

### 命名規範

#### 天文參數 Astronomy constants

- Solar 回歸年 solar year
- Sidereal 恆星年 sidereal year
- Lunar 朔望月 Synodic month
- Anoma 近點月 anoma month
- Node 交點月 nodical month
- SunLimit 日食食限。SunLimitYang 陽曆食限，SunLimitYin 陰曆食限，SunLimitNone 不偏食限
- MoonLimit 月食食限。MoonLimit1 月全食限，MoonLimit2 必偏食限，MoonLimitNone 不偏食限
- LeapLimit 閏限 The limit for arranging a leap
- Equa 赤道 equator
- Eclp 黃道 ecliptic
- Cec 極黃
- Ecli 交食 eclipse
- Lon 經度 longitude
- Lat 緯度 latitude

#### 變量 Variables

- Origin 上元以來的
- Sols 冬至 winter solstice
- Sd 距離冬至的時間
- Smd 距離冬至次日夜半的時間
- Newm 朔 new moon
- Syzygy 望 syzygy
- First 天正月，卽冬至所在月 The month in which the winter solstice falls
- Zheng 正月，建正
- LeapSur 閏餘 leap surplus
- GreatSur 大餘，干支的整數部分
- SmallSur 小餘，干支的小數部分
- LeapNumTerm 無中氣置閏法的閏月
- Duskstar 昬中星
- Accum 積日。SolsAccum 上元至年前冬至積日 AnoAccum 入轉日 NodeAccum 入交日

#### 常量 Constants

- Sc 干支 sexagenary cycle
- Stem 天干
- Branch 地支
- Name 曆法名 calendar name
- Hexagram 八卦
- Mans 宿
- MoonGod 月神
- ManGod 人神

#### 時間長度

- Leng 長度 length
- Range 長度
- Term 十二中氣 HalfTerm 二十四節氣
- Hou 七十二候
- Zhang 章
- Bu 蔀
- Ji 紀
- Tong 統
- Yuan 元

#### 其他

- Raw 未經某種處理的變量 Variables before processing in some way
- V 速度 velocity
- Corr 修正 correction。Tcorr 在躔離計算中爲日月速度改正，在交食計算中爲食甚時刻改正。Mcorr 食分修正
- DifAccum 日盈縮積、月遲疾積
- Avg 平均的 average
- Acr  精確的 accurate
- Deg 度數 degree
- Dif 兩個數之差 The difference between constants A and B.
- Sd 某日距離年前冬至的日數
- ZoneDif <v>庚午元曆</v>里差<n>地理經度時差</n>
- xxx50 某常量的 50%，xxx125 某常量的 12.5%
- xxxHalf 某變量的一半 Half of a variable
- Numer 分子 numerator
- Denom 分母 denominator。單獨出現的 Denom 爲日法 LunarDenom 的簡寫
- Num 序號 number

所有曆法的分類，也就是 `/parameter/calendars` 中的 `Type`：

1. 殷, 周, 黃帝, 魯, 冬至元夏, 雨水元夏, 楚顓頊, 秦顓頊, 甲寅太乙, 曆術甲子篇(擬), 太初(三統), 乾鑿度, 元命苞, 後漢四分
2. 乾象, 景初, 正曆(擬), 通曆(擬), 三紀
3. 玄始(擬), 正光, 興和, 天保, 甲寅(擬), 天和(擬), 大象(擬), 開皇(擬), 開元太乙.
4. 元嘉, 大明, 明克讓(擬大同代), 張孟賓(擬), 劉孝孫(擬), 大業, 戊寅, 戊寅(平朔).
5. .
6. 皇極, 乙巳(擬), 麟德, 麟德(進朔), 神龍(擬).
7. 大衍, 五紀, 正元, 宣明, 欽天
8. 崇玄, 符天(擬), 應天, 乾元, 至道甲(擬), 至道乙(擬), 儀天, 乾興(擬), 崇天, 景祐太乙, 明天, 奉元(擬), 觀天, 占天(擬)
9. 紀元, 統元, 乾道, 淳熙, 會元, 統天, 開禧, 淳祐(擬), 會天(擬), 成天
10. 楊級大明(擬), 重修大明, 庚午, 乙未(擬)
11. 授時, 大統, 徐發天元曆
12. .
13. 新法曆書(待定), 康熙永年表(待定), 曆象考成, 曆象考成後編.
14. VSOP
15. DE440/1

## 更新日誌

#### 2021-01-03

立項。

#### 2-23

內測上線。**2-24** 加入 readme；加入評論；加入 GA；加入更新日誌。
**2-26** 加入合朔日月赤度、節氣日赤度。
**2-28** 採用滾動數組，減少計算次數，重構數據結構，本地端速度提高 40%；前端相應調整，採用 Web Worker 多線程。避免 UI 與計算的衝突。今天突然發現望都不對，想了半天才發現，之前都是入曆日 +1/2 朔望月近點月之差，實際上應該是朔入曆 + 朔望月/2。
**3-02** 採用懶加載策略，只加載當前屏幕的信息。現在可以秒加載了，看來絕大部分時間都消耗在渲染上。魏晉時期的日月食基本完成。
**3-15** 增加日書、轉換 tab。增加魏晉日書，轉換工具。

#### 其他部分已解決問題

兩個倉庫合併。npm run build。ContinuedFrac' is not exported from '../src/Shangshu-calendar/convert_congruence-modulo'. 打包失敗。朔閏表疊在一起 ————四分短  長  增加唯一 id，以前都是一個所以固定高度 03-28。公元年一年只顯示一次。這個文件的函數 exports 了，如果我要在本文件中調用這個函數該怎麼辦？exports 在文件末尾就可以。連分數 latex 跟調日法、大衍串在一起了。bug 自己消失了。連分數增加 i。調日法輸入，彈出來兩數不互質。曆法選項框初始値「請選擇曆法 s」，不要讓下面的動。每個 tab 有不同的使用說明。不同的 tab 有不同的封面图，也就是不同的 tab 有不同的 classname。分數 latex 怎麼放到灰色框天文部分的 bind，相當於重複計算了 4 遍？2458849.5 儒略日 1 月 0 日。乾象月緯隔幾天就我有一個消失。景初月赤緯不對，一正一負。紀元月赤經距離冬至超過一半就不行。丟失精度，算不出來：章法：把魏晉的全部過了一遍，興和、天保、甲寅、大象曆數字太大，超過達到 20 位？？不知道是不是因爲這個。但是天和就算得出。奇怪……看了下，和李銳調日法是否算得出沒有關係。分數的最小公倍數，lcmNumer。曆書：大衍、庚午的月亮跑不了——MoonLatAccumList: [0, 0, 187, 358, 505, 620, 695, 722, 695, 620, 505, 358, 187] 最後漏了一個 0。天文的月亮，乾象、大明每次點都會縮小，中了魔咒一樣 ——變量名的問題。日書加上曆法名。日書月名沒有閏月。前兩日九宮亂入。宣明沒有黃道度

#### 4-21 公測上線

版本：核心 `0.90` 前端 `1.00`

#### 4-25 `0.91 1.01`

4 月 24 日本站編入 Google 索引 **核心** 增加時刻轉辰刻。日赤緯、日出公式曆法加上了日躔，至少紀元能跟論文合。授時明天還不對。訂正躔離：重新整理月離表的邊界；修改明天躔離；唐系日躔改用不等間距內插。宋志「紹興四年<n>1193</n>十二月<n>紀元</n>小餘七千六百八十，太史不進，故十一月小盡」。一個迷思：若索引從 1 開始，小餘 8285 左右，與大統相合，若索引從 0 開始，則是 7681，雖與引文相合，但與大統差了太多。我目前還是從 1 開始索引。修改定朔望小餘問題；修改定氣問題。 **前端** 調整文件結構：拆分時間板塊；拆分朔閏表板塊；加入曆書年份限制。

#### 4-29 `0.92 1.01.1`

 **核心** 天文模塊增加交食、交食週期與交點月換算。增加魏晋南北系、大業、戊寅、麟德、大衍交食。元嘉非常奇怪，原來的交會差，單算入交日的話跟其他曆都不一樣，但是最後結果是一樣的，迷惑。現在已有的食甚改正，有些方向都是相反的，奇怪。調整魏晉系閏餘單位，本來想把古六曆閏餘改成 19，發現顓頊不好改，放棄。增加 fraction.js。 **前端** 文件改名。升級依賴。辰刻轉換由文字換成表格。修改表格 css

4-29 晚 `0.92.1 1.01.2`

 **核心** 修復四分曆跑不來的小問題：未把調用交食排除。調用交食模塊之前先用去交日篩選，大大節省算力。30 以內的阿拉伯數字轉漢字換成列表，能快一點；朔閏表月序改成漢字 **前端** 實現了``內 html 標籤：曆書九宮色添加背景色；朔閏表表頭增加樣式，交食進朔符號添加顏色

#### 5-02 `0.93`

 **核心** 重要更新：重構躔離。此前一直用的 (日盈縮積 - 月遲疾積) / (分母) 來計算日月改正，發現並不是這麼回事，大部分曆法都能適用，但是崇玄、應天、儀天、崇天、統元、大衍、乾元這七部曆法的月行改正分母並不固定，算出來大衍的差距能達到 8 刻之巨，所以只好重新錄入所有曆法的朓朒積，再直接用招差術或拉格朗日內插計算。數據已根據陳美東的日躔月離表兩篇論文訂正<n>乾元陳美東 843 改成 850，奇怪，「四十三」和「五十」怎麼會錯呢</n>。修改宣明、應天、儀天月離，此三曆較特殊，月離表分爲兩截，此前我都合爲一個。給所有曆法補上定氣積日表。大幅精簡天文模塊 bind 的代碼。入轉日、入氣日、入交日索引全部統一從 0 開始。修改望也進朔的小 bug。

#### 5-03 `0.94 1.01.3`

 **核心** 增加所有曆法的沒滅。修復大衍交食，與頁 538 算例相合，完美可靠。修復曆書月名的小問題。曆書的候土卦從 0 索引，修正土卦相差一日的小問題。修復四分曆書沒有 13 個月的小問題。精簡一些寫法。 **前端** 小優化：節氣增加底色等

#### 5-05 `0.95 1.01.4`

 **核心** 訂正天文曆：加入唐宋曆月行九道；調整結構，加上躔離、定交改正。修正乾象、大衍等月緯。日經、昏中爲夜半，日緯爲正午。變量改名。修復：唐系日躔 340 日以上 NaN，訂正躔離亂七八糟的符號，現代擬合的小 bug，優化魏晉南北系月離運算速度。整理月亮位置轉換<n>皇極大衍黃白差沒問題：黃道 44，黃白差-1.47<n>頁 60</n>，其他應該也沒什麼問題</n>。疏理黃赤轉換，補上宋曆黃轉赤反函數。增強會圓術，增強弧矢割圓，推廣到三角函數。 **前端** 調整曆書樣式

#### 5-09 `0.96 1.02`

**核心** 1、補出弧矢割圓赤轉黃，冥思苦想，畫了好幾種輔助線，最後得來全不費工夫；弧矢割圓加上了任意黃赤交角；訂正弧矢割圓緯度、日出；補上三角割圓赤轉黃；訂正三角割圓，修正球面三角的赤緯轉換，現在三角割圓總算與球面三角全等了。會圓術刪掉週天度和半徑的選項。2、加上授時月亮位置，太難了，結果依然不對。2、大調整，積度轉宿度模塊：mans 取消統一計算，分散在各日中，要不然實在不好切。各曆朔閏表赤道日度、昏中星，天文曆日月度應該都差不多了。宋元昏中星尚不能確定，一般情況應該沒什麼問題；後漢四分昏中星跟表比起來，二至都是對的，其他時候少 1 度。每日月亮位置，<v>中</v>頁 514：大衍算法有問題，欽天以後都改用另外的算法，我統一用宋代算法。3、簡化寫法。增加一個分析日行改正誤差的小片段<n>沒放到前端</n>。 **前端** 重新用上 react-markdown，把所有的<p className='note>全都移到 md 文件中，爲了方便翻譯。寫了一個下午文案，加上參考文獻，增加命名規範。

#### 5-10 `0.97`

**核心** 1、重寫土王、推卦，乾象景初用京氏，其餘用孟氏。增加「月在張心署之」。2、根據大衍曆議修改歲差：復原梁武大同歲差宿度；修復梁武大同跑不起來的問題；劉孝孫上元改爲虛 8。各曆朔閏表的赤度、昬中應該沒什麼問題了。3、大衍黃赤轉換改爲和崇天一樣；公式晷長取消日躔。4、補充、重寫時辰轉換，徹底清楚了。5、增加所有曆法的進朔退望，圓夢了。6、一個系統性 bug：閏月進退的 NewmOrderRaw 竟然一直用的平朔。7、清理朔閏表用不到的傳參，精簡變量；取消四分以後的大小餘。

#### 5-12 `0.98 1.03`

**核心** 1、增加四大三小提示。試了下大衍，四大情況非常常見，需要手動調整。2、天文曆修改月亮經度算法，應該不會差太多了。躔離計算增加月實行度。修改月行九道的判斷條件。修復半月離曆法的疏忽。3、增加積度宿度互換。4、修改天文常數精度。修復一個時辰轉換小疏忽。**前端** 1、網頁調整目錄結構：幾何搬到天文標籤。2、加個 contributors wall

#### 5-14 `0.99`

**核心** 1、重寫九道術、授時黃白轉換。授時依然有問題，太難了，只能先放著。2、重寫公式曆法的月亮緯度。3、修改九道對應小問題。修復四分跑不起來。修復一些曆書跑不起來。

5-17 `0.99.1 1.03.1`

**核心** 增加戊寅定朔平朔的區別，在路由文件用 isAcr 實現。**前端** 標籤懸浮變成手。@跟着小徐混

5-18 `0.99.2 1.04`

**核心** 改進四大三小提示：連上了第二年的情況。修復進朔干支序的邏輯。修復麟德不進朔的閏月調整；修改五紀正元的閏月調整標準，因爲進朔比較嚴格；閏月調整標準提到 2.75，否則統元 1145-1146 的閏月提前失效。修復符天、應天跑不起來。 **文字** 增加朔閏表可靠性驗證

#### 5-19 `0.991 1.04.1`

**核心** 這個版本主要是殘曆復原。修改甲寅、張孟賔參數，劉孝孫張孟賔躔離改用大業。修改梁武大同歲差；應天、至道、乾興、奉元、楊級、乙未、淳祐、會天歲差改用曲安京復原結果。楊級、淳祐、會天根據曲安京引用的參數重新構擬。增加至道、乾興、乙未、太乙曆法、元命苞。補上奉元、占天天文曆，曆書補上 OriginDaySc。 **文字** 殘曆復原單獨抽出來。修改朔閏表可靠性驗證

5-20 `0.991.1 1.05`

**前端** 終於實現了自動長曆功能！勾選了自動選擇之後，也可以另外手動選擇曆法，作爲參照。**核心** 進朔定朔、進朔日出分改成線性內插。修復四分、神龍跑不起來；修復統元跑不起來：沒月離表。

明天觀測精度很成問題，和紀元、統元比，入轉差了 3 日，入交差了 1.6 日。明天上元以陰曆入交。

5-20 晚 `0.991.2 1.05.1`

**核心** 1、修復定朔定氣等等缺省的情況，主要針對太乙曆。2、根據一段材料重新構擬占天。3、增補交食參數。觀天入交很奇怪，暫時重新擬一個 node。增加大統交差，似乎是陰曆入交。4、合併 NodeConst、NodeOrigin、NodeConst，AnomaConst、AnomaOrigin、AnomaConst。5、酌情改幾部南宋曆的上元宿度，改統天的宿度。6、修復兩半月離曆法在邊界的線性改正問題，比如宣明 865 二月、885 五月線性、二次差了很多，應天 968 四月癸丑 7733、981 三月。7、修復積度宿度轉換的小問題。 **前端** cal 目錄的 package.json 合併到根目錄

5-22 `0.991.3 1.05.2`

**核心** 增加 nodeQuar、AutoSidereal、AutoSolar，統一一些常量。變量改名。暫且將五紀正元進朔標準降低 10 刻。修復宣明月度 NaN 的問題：黃赤轉換、九道術暫時用大衍的。修復本地曆書打印的小問題。 **前端** 標籤換個順序。 **文字** 增加一些和敦煌具注曆的核對。

#### 5-24 `0.992`

**核心** 【重構月離】近點月轉折點的特殊情況<n>卽四七日</n>不能通過內插得到，只能手動輸入，錄入唐宋損益率。增加唐宋曆月離損益率自動選擇模塊 AutoMoonTcorrDif。取消宣明應天儀天的兩組月離表，合爲一表，但加以區分對待。恍然大悟，儀天不是分成兩半，而是分成四部分，獨此一曆。戊寅以前都沒有針對四七日的特殊算法，暫且不管，皇極以後纔有。皇極稍有些特殊，我暫時統一按照後來的處理方式，但區別應該不大。修復其他相關 bug。現在四七日的線性改正都完美了，比如 900 年<v>五紀</v>五、七月就跟原來不一樣。優化一些代碼。但月實行度還不太確定各曆的相應算法。

#### 5-27 `0.993`

**核心** 又用了兩天時間來【重新梳理躔離】麟德應天乾元三曆的日躔不是標準二次內插，進行單獨處理。月離區分唐宋。現在問題應該不大了。詳見 **文字** 增補躔離說明「線性還是二次？」

#### 5-27 晚 `0.994`

**核心** 根據曲安京<v>曆法</v>頁 251 重寫大衍月緯算法，此前用的三次招差術。但是其中符號還不太敢確定。

#### 6-07 `0.995`

正式版前的最後一個版本！！

1、增加唐宋、授時交食。太複雜了，斷斷續續兩個月了。

2、精簡反減的寫法。按照術文是這樣：

```javascript
aRev = a
if (aRev > 0.25) {
  aRev = 0.5 - aRev
}
```

其實等價於 `aRev = 0.5 - abs(a - 0.5)`。

精簡數組前面加一個 0 的寫法：

```javascript
a = a.slice(-1).concat(a.slice(0, -1))
a[0] = 0
```

換成

```
a = [0, ...a]
```

精簡簡單的條件判斷

3、生成欽天、至道、乾興、奉元、占天、淳祐、會天躔離。

4、修復月實行積度的疏忽。修復崇玄月遲疾積。修復黃赤轉換小問題。

5、把生成參數的單獨抽出來一個文件。

6、天文模塊增加交點退行速度、交率交數計算。

7、增加 AutoQuar 自動選擇象限長度。

8、一些變量改名。

**文字** 增加唐宋授時步交會、欽天步月、歲實消長等。文字說明已有四萬八千字。

#### 6-12 `1.00 1.05.3`

**正式版發布！**

1. 重寫大業、戊寅、麟德交食，拆成三個模塊。修復應天、崇天、紀元、授時交食，基本可用了
2. 修復張孟賓、劉孝孫、戊寅小問題
3. 時間模塊增加：小數 ⇒ 弱半彊，時刻 ⇒ 夜籌更點，加時 ⇒ 小分
4. 重寫統天、授時歲實消長
5. 天文模塊增加歲實朔實消長
6. 增加早期授時，分爲有無消長四種
7. 加上庚午里差
8. 精簡寫法：聲明變量放在一行；把所有 *= /= 過了一遍，應該沒問題
9. 修復四分沒有黃道度的小問題。修復占天入交。明天增加一個交食晝夜限制

**前端** 表格線全部取消，清爽多了。markdown 增加表格渲染

**文字** 增補歲實消長說明。總計五萬二千字。

6-12 下午 `1.00.1 1.05.4` **核心** 給所有四分曆加上月食計算。修復天文模塊日食的問題。調整一下欽天時差。修復四分沒顯示朔小分的小問題。修復宣明二次月離。**前端** 調整九宮色 css

6-13 `1.00.2` **核心** 增強加時轉約餘。把所有 `.includes()` 過了一遍，沒問題。

6-14 `1.00.3` **核心** 修復大統交應。修復授時歲差消長。**文字** 增加大統交食驗證

#### 6-16 `1.01 1.05.5`

**核心** 增加晷影求冬至時刻。**前端** 調一下標籤選擇的樣式

#### 6-19 `1.02`

 **核心** 明晰授時系的區別：授時、大統通軌<n>實行</n>、大統曆志。將大統晨昏分換成應天晷刻。徹底解決授時系交食：交定度、月食食分、食延、TheSd 定義。修改授時系限行度，躔離改正完全沒問題了。修復閏月調整問題：本來是 `LeapNumTerm >= 2`，換成 1。修改步軌漏夜半的定義。 **文字** 凡五萬九千字。

#### 6-21 `前端 1.06`

調整代碼結構：把 AutoCal 的實行年份、Bind 的 `Type, isAcr, isNewmPlus` 全部移到曆法參數中，兩個曆法參數文件合并，刪掉 `bind.mjs`。

6-23 `1.02.1` 修復授時建子 NaN 的小問題，定氣閏月也有的小問題。

6-24 `1.02.2` 天文模塊的回歸年計算換成 VSOP87 曆表。前端 `1.06.1` 曆書表格微調

6-24 `1.03` 增加李淳風乙巳元曆，只有平朔。

6-27 `1.03.1` 調整招差術輸出的取值精度

#### 6-27 `1.04`

增加琴律計算模塊。

7-04 `1.04.1` 增加所有調的品弦法，準法律側弄調還很奇怪。

7-31 `1.04.2` 調整魯曆

#### 10-22 `1.05`

增加減字譜轉唱名。

10-25 `1.05.2` 優化代碼 [Code Review on Math Lib #8](https://github.com/lzfcc/Chinese-Ancient-Calendar/issues/8)。主要是 `_math.mjs` 文件

10-25 `1.05.3` 優化代碼 [Code Review #9](https://github.com/lzfcc/Chinese-Ancient-Calendar/issues/9)。簡化解高次方程寫法

10-26 `前端 1.07` 調整函數接口：字符串 `'1,2,3'` 全部換成數組  `[1, 2, 3]` 。全部改下來頗麻煩

10-27 `1.06` 減字譜轉音高增加徵弦。增強 fret2leng，增加 leng2fret

10-28 `1.06.1` 優化代碼  [Code Review #10](https://github.com/lzfcc/Chinese-Ancient-Calendar/issues/10)

10-31 `1.06.2` 優化代碼 `guqin.mjs`

11-01 `1.06.3` 增加 [] qi shang xia

11-04 `1.06.4` 重寫品弦法

11-08 `1.07` 增加京房六十律。個人數學庫增加大分數乘法計算。

11-10 `1.07.1` 增加幾種品弦法。品弦法增加唱名。修復徽位轉音高突然跑不起來的小 bug。

11-13 `1.07.2` 再次重寫品弦法，改成數組。增加宮弦選項。增加側羽側楚。

11-16 調整文字說明，成文的遷移到赫赫金鑰。

11-17 `1.08` 增加徽位音。修復位置轉音高。11-19 品弦法增加音名。`1.08.1` 11-23 正弄調增加混合律制 11-24 `1.08.2` 增加其他混合律制。徽位轉音高，輸出音名改成固定的。

11-27 `1.09` 增加䠂大小正，據武家璧《简论楚颛顼历》。

11-28 `1.10` 增加律內音。

12-01 `1.11` 增加十九等程律、四分折中律、三分折中律 12-02 何承天新律 `1.11.1` 12-07 徽位音增加泛音

12-27 `1.12` 增加筮占模塊，暫時有一種大衍筮法。修復拉格朗日小 bug

#### 2022

3-01 `1.12.1` 調整一下授時曆的類別。這兩天又有一個流量高峰（69 人/日），感謝幫忙打廣告的陌生人

3-05 `1.13` 增加徐發《天元曆理全書》的曆法。只有基本參數，日月改正還是用的授時。

#### 2023

4-21 `1.14` 增加清華簡《筮法》構擬。周易筮法算法調整為通行算法。前端 `1.07` 更新依賴：node 18.16.0, webpack 5.80.0

#### 2024

1-03 – 1-26 `2.00` 增加《曆象考成後編》朔閏表、交食。（版本號最開始定爲`1.20`）

1-30 `2.01` 精簡古曆入宿度，把西曆入宿度整合進來。大幅精簡古曆判斷閏年的方法，精簡古曆的節氣，在newm_index與時憲曆合併。四分曆想精簡，失敗。

2-01 `2.02` 增加時憲曆曆書，曆書`day`分為古曆和時憲曆兩個文件。朔閏表增加節氣（以前只有中氣）。

2-11 `2.03` 增加曚影計算。增加西曆赤道度。增加曆書西曆月亮赤道經緯的展示，增加西曆的月出入時刻（大概沒問題，有些時候有點怪怪的）；修復癸卯元曆月亮赤道計算小問題。增加節氣的迭代精確時刻；微調古曆的曆書展示；定朔望氣日分用五位小數，單位改成刻。修復一處四分曆不能計算的小小問題。

2-20 `2.04` 增加《曆象考成》朔閏表、交食、曆書。已知問題：1、與1733年時憲曆合朔時刻相較，算月離太陰平行如果不加時差，前六個月密合，後六個月都差一刻鐘左右，如果按術加時差，都不合，且偏差更大，目前我暫時不加時差。2、交食朔望有時候和泛時差的有點多。

2-28 `2.05` 增加新法曆書、永年表的朔閏曆書，交食暫時沿用考成。修復`1.24`的兩個問題（1是因為三均的符號有問題，2是因為算的時候忽略了初均的符號），月離依然不加時差，合朔可以與曆書密合了。交食用朔望原術是用首朔算，我改成積日（又改回來了），有些許差別，可忽略。

3-01 `2.05.1` 清代曆書增加正交月孛展示。合并第谷太陽均數和太陰初均。發現並修復癸卯曆日躔均數>180的問題（有個符號錯了）。增加《後編》所有四種均數方法、現代迭代法。

3-15 `2.06`

- 改寫天文模塊的「赤經 ⇌ 黃經」：其中誤差改由該曆的黃赤大距推算球面三角。
- 改寫「弧矢割圓術」：授時曆實測黃赤大距爲23.9，但是弧矢割圓用的是23.807。
- 改寫「積日 ⇒ 日月盈縮修正」：所有古曆根據極值增加偏心率。
- 增加幾何模型均數：四種模型展示。
- 下線「任意時刻太陽高度、方位角、晷長」，畢竟太陽位置不那麼好計算。
- 改寫「積日 ⇒ 赤緯、日出、晷長」，以及公式晷長計算法。改儀天赤緯。設置各曆觀測緯度。
- 拆分`autoLon2Lat`爲三個。大業的是二次內插嗎？
- 增加古曆每年黃道宿鈐計算，跟大衍、授時黃道表對了一下，一模一樣，可見黃道表是由赤道度算出來的，黃道宿鈐就用程序算了。
- 改寫黃赤宿度，大衍、紀元、授時都是首先用歲差算得冬至赤道日躔，若求每日夜半，則求冬至黃道，再加每日行度及太陽改正，所得爲黃道度，紀元又增加了由黃道宿轉赤道宿。
- 改寫朔閏表的宿度算法。朔閏表都有赤道黃道。
- 增加天文模塊的黃赤宿鈐。改寫「積度 ⇌ 宿度」。增加黃赤宿鈐的曆法選擇框。
- 增加極黃經計算。
- 合併西曆 `eclpGong2Mans` 和 `equaGong2Mans`，改寫赤道宿度算法。寫了觜參互換的算法。
- 紀元、庚午曆書有問題：儒略日不對，而且黃道度也不對，原來是`ScConst`沒處理好。把`ZhengInt`分成 `ZhengScOrder`、`ZhengSdMidn`、`ZhengSdInt`，又重寫儒略日算法。
- 增加多項式擬合，放在招差模塊。
- 改名：古曆`SolsDif –> Sd`，西曆 `Sd –> Smd`，古曆`Night –> Midn`。

3-24 `2.10` 增加VSOP和ELP2000曆表的朔閏！！

3-26 `2.11` 增加DE440/1曆表朔閏！

3-30 `2.12` 增加現代天文學二十八宿計算。

3-27 前端 `1.08` webpack打包文件分成古曆和DE曆表兩個。實現切換tab不清空之前的表單。不過古曆的worker打包文件從250k變成500k，奇怪。

3-30 前端 重新整理文件層級。react更改程序入口：`node_modules/react-scripts/config/paths.js`。把212個`~~`改成了`Math.trunc`

`react-window-dynamic-list` 不再維護了，不支持 react 18，想換 `react-window` 和 `react-window-infinite-loader`。想更新庫，但失敗，終端 `Failed to parse source map from`，找了半天看到 [這篇](https://github.com/remarkjs/remark-gfm/issues/59)， 原來是因為升級了`"remark-gfm": "^4.0.0"`。

終於知道干支為什麼不能從0開始了。上元積年%完之後得到的數如果是1，那就是甲子。古代沒有0就是從1開始。我剛才全部改成從0開始，最後發現還不得不處處添加一個-1，很麻煩

3-31 `2.12.1` 增加恆星時真太陽時計算，但有效期不到一千年。

4-01 前端 `1.09` 用了一個晚上解決npm不能打包的問題，

1. 解決循環引用，用 `madge --circular --extensions js,jsx,mjs ./src` 檢測。
2. 解決引用的函數未定義，eslint 檢測不出來，只能一個個文件手動看。
3. 最後eslint報錯阻止建構，把隱藏的`.eslintrc.json`文件改個名字就行了。

刪除 `MoonLonWest_BACKUP` `MoonLonWest`（《數》頁348白赤差）`MoonLatWest`、`EcliWest`（藤豔輝《宋代朔閏與交食研究》頁90,106）

4-04 `2.13` 增加 VSOP 天文年曆。統一現代、清代、古曆三種曆書的格式。

小增補：

- 增加極黃經轉赤道
- 增加地平座標展示

小修復：

- 修復幾個沒有宿度的曆法報錯
- 修復fix()相關問題（古曆平朔位數，大衍进朔问题、修复节气展示、修復newmindex现代历表公历没切）
- 修復時憲曆曆書多了一日
- 修改历书儒略日算法
- 刪掉vsop朔閏表
- 修复更改恒星时算法
- 現代曆表置閏改用UT1時間
- 儒略日轉換統一爲0時區

4-06 前端 `1.10` 減輕負擔

- 升級到 `react 18.2.0`
- 刪除以前的菜單組件，GPT重新用react寫了個，分成多選和單選。
- 刪掉markdown渲染組件，直接用腳本生成html，再站貼到index.html。嘗試了webpack引入html，失敗。
- 刪掉 `react-window-dynamic-list`，已經停止維護了，不支持react18。發現其實並不太影響性能，200條也能比較輕鬆地應付。
- 將 `npm run build` 與 `webpack` 合一
- GPT優化曆書jsx
- tab欄sticky置頂
- 本地：Node 從18.16.0升級到21.7.2，npm從9.5.1升級到10.5.0

4-14 前端 `1.11` @lzfcc

- 用 vite 取代 CRA，構建速度大大加快。並且取代了 webpack 打包 worker，完全不用依賴 webpack 了
- 增加 `jsconfig.json`，支持絕對路徑
- Each directory has a index file that is used to export all functions and variables that are available in that directory, in order to make it easier to import the functions and variables in other files.
- combine interpolate and interpolate_big

4-17 前端 `1.12` GPT幫忙把朔閏表、曆書的樣式渲染移到前端。其他：刪了能刪掉的dangerouslySetInnerHTML，把各處的簡要說明分散到答案框中。把筮占板塊合併到時間板塊，優化封面樣式邏輯。

4-22 `2.14` 重寫九道術、白道交周，難度很大。增加現代九道宿鈐計算及展示。

小修復：

- 曆書把古曆的月亮黃赤經緯都補出來了。
- 修復四分到開皇朔閏表沒有宿度，刪掉四分曆朔閏表中星
- 修復會圓術展示
- 修復元嘉曆書開頭日度是負數
- 修復授時曆元前值日
- 修復現代曆書每日儒略日算法
- 修復現代曆書沒有十二月
- 修正古曆曆書Ano/NodeAccumMidn算法
- 修正乾象入轉
- 修正麟德入宿度
- 修復皇極黃赤轉換
- 修復交率交數不能計算浮點數
- 修復紀元會元11年第一二天晷長相等
- 調整乾元月實速
- 修復欽天月黃緯符號
- 更換現代地軌偏心率算法
- 下線 bindDeg2Mans
- 改名：AutoMoonAcrS –> anojour, MoonAcrS –> Anojour, AnomaAccum –> AnoAccum, Ceclp –> Cec
