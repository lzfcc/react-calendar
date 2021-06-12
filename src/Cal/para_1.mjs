export default {
    Yin: {
        Denom: 940, // 日法
        Lunar: 27759 / 940, // 朔策
        Solar: 365.25, // 歲實
        OriginAd: -2760366, // 上元積年的公曆
        // JdOrigin: 1704250.5,
        JdWinsols: 1704250.5 + 46 * 365.25,
        OriginYearSc: 51, // 上元年干支
        ZhengNum: 0, // 年首子月。這兩個一定要記得一起調
        OriginMonNum: 0, // 正月建子
        YuanRange: 4560, // 元
        JiRange: 1520, // 紀
        BuRange: 76, // 蔀
        isTermLeap: 0, // 是否用無中氣置閏法
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Zhou: {
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2760423,
        // JdOrigin: 1683430.5,
        JdWinsols: 1721051.25,
        OriginYearSc: 54,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Huangdi: {
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        // JdOrigin: 1783510.5,
        JdWinsols: 1721052.75,
        OriginAd: -2760149,
        OriginYearSc: 28,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Lu: { // 無加小餘
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 1,
        OriginMonNum: 1,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuA: { // 隱元-721,宣元-607
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0, // 隱元建丑
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 539 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuB: { // 宣二-606，成四-586
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 469 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuC: { // 成五-585，襄六-566
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 403 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuD: { // 襄七-565，襄廿五-547
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 348 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuE: { // 襄廿六-546，昭十二-529
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 280 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuF: { // 昭十三-528，定元-508
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 213 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    LuG: { // -507，-466
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2763680,
        // JdOrigin: 1604170.5,
        JdWinsols: 1604170.5 + (29 + 499 / 940) / 19 + 320 * 365.25,
        OriginYearSc: 37,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 147 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    XiaDong: { // 冬至曆元夏曆
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2759875,
        // JdOrigin: 1883590.5,
        JdWinsols: 1721054.25,
        OriginYearSc: 2,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0, // 0:固定冬至，1:無中氣
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    XiaYu: { // 雨水曆元夏曆
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsWinsolsDif: -60.875, // 冬至距雨水日數
        WinsolsOriginMon: -(2 + 7 / 114), // 冬至距雨水閏餘
        OriginAd: -2759875,
        // JdOrigin: 1883650.5,
        JdWinsols: 1721053.375,
        OriginYearSc: 2,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuA: {
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsWinsolsDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52, // 曆元距甲子日數
        OriginDayCorr: 5,
        ZhengNum: 2, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuB: { // 朱桂昌《顓頊日曆表》：暫定秦昭王元年前306行十月爲歲首
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsWinsolsDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        OriginDayCorr: 5,
        ZhengNum: -1, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuC: { // 秦始皇元年前246朔餘增加3/4日。《顓頊日曆表》第545頁
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsWinsolsDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        OriginDayCorr: 5,
        ZhengNum: -1, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 3 / 4,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuD: { // 高帝元年前206朔餘減少210分
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsWinsolsDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        OriginDayCorr: 5,
        ZhengNum: -1, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        WinsolsCorr: 3 / 4 - 210 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuE: { // 前162年改變閏章（但我看他提供的資料，應該是前186-182之間變化），減朔餘25分。《顓頊日曆表》第544頁：出土資料的閏年：前251、208、205、202、199、197、191、186、180、164、153、151、134、129、110
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsWinsolsDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        OriginDayCorr: 5,
        ZhengNum: -1, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 1,
        WinsolsCorr: 3 / 4 - 210 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    ZhuanxuF: {
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        WinsolsWinsolsDif: -45.65625, // 立春爲曆元
        WinsolsOriginMon: -(1 + 83 / 152),
        OriginAd: -2760305,
        // JdOrigin: 1726575.5,
        JdWinsols: 1721051 + 3 / 32,
        OriginYearSc: 52,
        OriginDayCorr: 5,
        ZhengNum: -1, // 十月爲年首
        OriginMonNum: 2, // 建寅
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 1,
        WinsolsCorr: 3 / 4 - 235 / 940,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    TaiyiJiayin: {
        Denom: 940, // 日法
        Lunar: 27759 / 940, // 朔策
        Solar: 365.25, // 歲實
        OriginAd: -103 - 284183,
        OriginYearSc: 51, // 上元甲寅
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560, // 元
        JiRange: 1520, // 紀
        BuRange: 76, // 蔀
        isTermLeap: 1, // 是否用無中氣置閏法        
    },
    Shiji: {
        Denom: 940, // 日法
        Lunar: 27759 / 940, // 朔策
        Solar: 365.25, // 歲實
        OriginAd: -1566, // 上元積年的公曆
        // JdOrigin: 1704249.75,
        JdWinsols: 1704249.75 + 46 * 365.25,
        EcliRange: 135 / 23,
        EcliNumer: 513,
        Node: 27.212729649262943,
        OriginYearSc: 0, // 上元年干支
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560, // 元
        JiRange: 1520, // 紀
        BuRange: 76, // 蔀
        isTermLeap: 1, // 是否用無中氣置閏法
        WinsolsCorr: -0.75, // 去掉零頭。太初曆藉半日法其實就已經是去掉零頭了的
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Taichu: {
        Denom: 81,
        Lunar: 2392 / 81,
        Solar: 365 + 385 / 1539,
        OriginAd: -143230,
        OriginCloseAd: -103,
        // JdOrigin: 1683430.5,
        JdWinsols: 1683430.5 + 103 * 365.25,
        OriginYearSc: 13,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4617, // 元法
        TongRange: 1539, // 統法
        isTermLeap: 1,
        // MansionRaw: [8, 26], // 牽牛初度。
        MansionRaw: [9, 0], // 這兩個結果都等於牛0
        MansionFractPosition: 8,
        EcliRange: 135 / 23,
        EcliNumer: 513,
        Node: 27 + 187 / 879,
    },
    Qianzaodu: {
        Denom: 81,
        Lunar: 2392 / 81,
        Solar: 365 + 385 / 1539,
        OriginAd: -2760366,
        // JdOrigin: 1704250.5,
        JdWinsols: 1721052,
        OriginYearSc: 51,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Yuanmingbao: {
        Denom: 81,
        Lunar: 2392 / 81,
        Solar: 365 + 385 / 1539,
        OriginAd: -103 - 2760377,
        OriginYearSc: 57,
        ZhengNum: 0,
        OriginMonNum: 0,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 0,
        EcliRange: 135 / 23,
        EcliNumer: 513,
    },
    Easthan: {
        Denom: 940,
        Lunar: 27759 / 940,
        Solar: 365.25,
        OriginAd: -2760480,
        OriginCloseAd: -160,
        // JdOrigin: 1662610.5,
        JdWinsols: 1662610.5 + 160 * 365.25,
        OriginYearSc: 17,
        ZhengNum: 2,
        OriginMonNum: 2,
        YuanRange: 4560,
        JiRange: 1520,
        BuRange: 76,
        isTermLeap: 1,
        EcliRange: 135 / 23,
        EcliNumer: 513,
        Node: 27 + 5859 / 27542,
        MansionRaw: [8, 21.25], // 斗21度235分
        MansionFractPosition: 8,
        // DayLight: [45, 45 + 8 / 32, 46 + 8 / 32, 48 + 6 / 32, 50 + 8 / 32, 53 + 3 / 32, 55 + 8 / 32, 58 + 3 / 32, 60 + 5 / 32, 62 + 4 / 32, 63 + 9 / 32, 64 + 9 / 32, 65, 64 + 7 / 32, 63 + 8 / 32, 62 + 3 / 32, 60 + 2 / 32, 57 + 8 / 32, 55 + 2 / 32, 52 + 6 / 32, 50 + 3 / 32, 48 + 2 / 32, 46 + 7 / 32, 45 + 5 / 32], // 四分、乾象、景初。正光興和沒有漏刻
        NightList: [27.5, 27.375, 26.875, 25.90625, 24.875, 23.453125, 22.375, 20.953125, 19.921875, 18.9375, 18.359375, 17.859375, 17.5, 17.890625, 18.375, 18.953125, 19.96875, 21.375, 22.46875, 23.90625, 24.953125, 25.96875, 26.890625, 27.421875, 27.5], // 夜半漏
        DialList: [13, 12.3, 11, 9.6, 7.95, 6.5, 5.25, 4.15, 3.2, 2.52, 1.98, 1.68, 1.5, 1.7, 2, 2.55, 3.33, 4.35, 5.5, 6.85, 8.4, 10, 11.4, 12.56, 13], // 節氣晷長
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 太陽去極度。111弱我暫時處理成110+11/12。106少強改成少弱
    },

    /////////////////魏晉/////////////////////
    // if (!Node) {
    //     Node = Lunar * EcliRange / (0.5 + EcliRange) // 獨創發明！以皇極驗之，完全符合
    // }
    Qianxiang: {
        Solar: 365 + 145 / 589, // 歲實 
        SolarNumer: 215130,
        SolarDenom: 589,
        LunarNumer: 43026, // 通法。會通=LunarNumer/(12/2)
        Denom: 1457, // 日法
        Lunar: 29 + 773 / 1457, // 朔策。月19年行天254週，小週：254
        // SurConst: 29, //  餘率 Math.floor(Lunar) 
        // TianDiConst: 25 + 30, // 天地凡數
        EcliRange: 11045 / 1882, // 月食週期
        EcliNumer: 11045, // 會月
        EcliDenom: 1882, // 會率。一半是朔望合數：初交到再交
        Node: 27.212150734997284,
        // exCycleFractConst: 1825 + 7 / 47, // 過週分 ((huiConst + TianDiConst) * SurConst ** 2) / huiConst 
        Anoma: 27 + 3303 / 5969, // 近點月=歷日數=(過週分+週天)/月週。週天=Solar*JiRange。月週（每紀恆星月數）=小週*JiRange/19。恆星月=週天/月週
        AnomaNumer: 164466, // 歷週。歷日數：164466 / 5969
        // AnomaFract: 3303, // 週日分。少大法=cycleDayFract/3
        AnomaDenom: 5969, // 週日法。週虛=5969-cycleDayFract。通週=5969*31
        // SynodicAnomaDif: 11801 + 25 / 31, // 朔行分=(小週/2)*LunarNumer/通數 - pasScycle。朔行分卽朔望月交點月之差的5969倍。程序中我沒用5969倍
        // 乾象還沒有交點月。JiDay/每紀月行週數=27 + 2532 / 7874 。紀行週=254*589/19=7874。歷日=(27 + 2532 / 7874)/2。紀日215130/2=歷週107565.每紀月行週數就是每日月行分數
        MoonAcrVList: [276, 275, 273, 270, 266, 262, 258, 254, 250, 246, 243, 239, 236, 234, 233, 234, 236, 239, 243, 246, 250, 254, 258, 262, 266, 270, 273, 275 + (4093 + 202 / 1101) / 5969, 276],
        MoonDifAccumList: [0, 22, 43, 62, 78, 90, 98, 102, 102, 98, 90, 79, 64, 46, 26, 5, -15, -33, -48, -59, -67, -71, -71, -67, -59, -47, -31, -12, 9.68574023615],
        MoonLatiDifList: [17, 16, 15, 12, 8, 4, 1, -2, -6, -10, -13, -15, -16, -(16 + 306 / 473)], // 乾象陰陽曆。/12爲度
        MoonLatiAccumList: [0, 1.4166666666666667, 2.75, 4, 5, 5.666666666666667, 6, 6.083333333333333, 5.916666666666667, 5.416666666666667, 4.583333333333333, 3.5, 2.25, 0.916666666666667, -0.4705778717406],
        // y = parseFloat((-0.0011792 * x ** 4 + 0.070674 * x ** 3 - 1.1513 * x ** 2 + 2.7606 * x + 273.65).toPrecision(12))
        OriginAd: 206 - 7377, // 上元積年的公元 內紀。-103
        CloseOriginAd: 206,
        // JdOrigin: 1796291.56961 - 7377 * (365 + 145 / 589), // -103年癸亥朔，並非甲子夜半朔旦冬至。定朔1683430.240082638
        OriginYearSc: 26, // 上元年干支
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 1178, // 元：乾法，內紀外紀
        JiRange: 589, // 紀法，每紀31章，31:通數
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 22], // 斗22度
        MansionFractPosition: 8, // 斗分所加在斗
    },
    Huangchu: { // 開元占經。「太史丞韓詡以爲乾象減斗分太過，後當先天，造黃初曆」看開元占經的斗分，確實比乾象大。
        Solar: 365 + 1205 / 4883, // 歲實。。年月跟王朔之一樣
        SolarNumer: 1783500, // 週天
        SolarDenom: 4883,
        Lunar: 29 + 6409 / 12079, // 朔策。經6409.
        LunarNumer: 356700, // 月法
        Denom: 12079, // 
        Anoma: 27 + 6698 / 12079, // 闕，按景初比例補之
        AnomaNumer: 332831,
        OriginAd: 220 - 31578, // 開元占經有問題，以景初爲準移之+ 722。《疇人傳》「上元壬午至黃初元年庚子，積三萬一千五百七十八算外」
        // JdOrigin: 1801769.6790 - 31578 * (365 + 1204 / 4883), // 220-12-23癸未
        CloseOriginAd: 220,
        OriginYearSc: 19, // 上元壬午。
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 9766, // 元法。闕，假設是2倍
        JiRange: 4883, // 紀法
        ZhangRange: 19,
        ZhangLeap: 7,
        AnomaCorr: 220000, // 闕，據紀差77194、以景初爲準補之
        // FirstCorr: -8.2,
        MansionRaw: [8, 22], // 闕，以乾象補之
        MansionFractPosition: 8,
    },
    Jingchu: {
        Solar: 365 + 455 / 1843, // 歲實。斗分：455。
        SolarNumer: 673150, // 紀日673150
        SolarDenom: 1843,
        LunarNumer: 134630, // 通數。 // const TongRange = JiRange / ZhangRange // 通數
        Denom: 4559, // 日法=97*47。47:通法
        Lunar: 29 + 2419 / 4559, // 朔策。月19年行天254週，小週：254
        Anoma: 27 + 2528 / 4559, // 近點月、交點月=歷日數=(過週分+週天)/月週。// AnomaFract: 2528 週日日餘。週虛=Denom-AnomaFract
        AnomaNumer: 125621, // 通週。歷日數：164466 / 5969
        AnomaCorr: 103947, // 甲子紀的遲疾差率，實測得出
        EcliRange: 5 + 116960 / 134630, // 分母是朔實
        EcliNumer: 790110, // 會通
        EcliCorr: 412919 / 790110, // 甲子交會差率
        Node: 27.2122009856701,
        YinyangCorr: -1,
        MoonAcrVList: [280, 277, 274, 271, 267, 261, 254, 248, 244, 241, 239, 236, 233, 231, 233, 235, 237, 240, 243, 246, 250, 254, 259, 265, 271, 277, 278, 279 + 626 / 86621, 280],
        MoonDifAccumList: [0, 26, 49, 69, 86, 99, 106, 106, 100, 90, 77, 62, 44, 23, 0, -21, -40, -57, -71, -82, -90, -94, -94, -89, -78, -61, -38, -14, 11.0072268849],
        OriginAd: 237 - 4045, // 上元積年的公元
        CloseOriginAd: 237,
        // JdOrigin: 1807614.129951 - 4045 * (365 + 455 / 1843),
        OriginYearSc: 29, // 上元壬辰
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 11058, // 元法
        JiRange: 1843, // 紀法。紀月：22795。日數：673150。每年月行254/19週，每紀24638（月週）
        ZhangRange: 19,
        ZhangLeap: 7,
        // MansionRaw: [8, 22], // 斗22度
        MansionRaw: [8, 21.25], // 《中國古代曆法》27頁
        MansionFractPosition: 8,
    },
    Liuzhi: { // 晉志下、開元占經。武帝侍中平原劉智，以斗曆改憲，推四分法，三百年而減一日，以百五十爲度法，三十七爲斗分。推甲子爲上元，至泰始十年，歲在甲午，九萬七千四百一十一歲，上元天正甲子朔夜半冬至，日月五星始于星紀，得元首之端。飾以浮說，名爲正曆。
        Solar: 365 + 37 / 150, // 歲實
        SolarNumer: 54787,
        SolarDenom: 150,
        Lunar: 29 + 18703 / 35250, // 朔策。闕，據「紀日1040953，紀月35250，餘18703」補之。交會通6109174不知何指
        LunarNumer: 1040953, // 
        Denom: 35250, //         
        Anoma: 27 + 19547 / 35250, // 闕，據景初補之
        AnomaNumer: 971297,
        AnomaCorr: 620000, // 闕。據紀差906481補之
        OriginAd: 274 - (97411 + 1823), // 晉泰始十年。不太對，據景初調整。但這是正史的數據，再看看。
        CloseOriginAd: 274,
        // JdOrigin: 1821128.2200 - (97411 + 1823) * (365 + 37 / 150),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 17100, // 元法闕，我算得171000
        JiRange: 2850, // 紀法。
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 21], // 占經：冬至斗21度.晉志：[25, 0]
        MansionFractPosition: 8, // 闕
    },
    Wangshuozhi: { // 晉志
        Solar: 365 + 1205 / 4883,
        SolarNumer: 1783500,
        SolarDenom: 4883,
        Lunar: 29 + 6409 / 12079, // 闕，劉洪濤補，第237頁。紀月60395
        LunarNumer: 356700, // 通數，闕
        Denom: 12079, //         
        Anoma: 27 + 36197 / 65278, // 闕，據景初補之。分母月週，劉洪濤補
        AnomaNumer: 1798703,
        AnomaCorr: 811000, // 闕，據紀差1629372補之
        OriginAd: 352 - (97000 - 864), // 永和八年。原來的數字不對， 改後嚴絲合縫。
        CloseOriginAd: 352,
        //+1205,+2533,-464這三個方案都不好
        // JdOrigin: 1849614.4156 - (97000 - 864) * (365 + 1205 / 4883),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 4883, // 元法闕，我算得等於紀法
        JiRange: 4883, // 紀法。
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 19], // 闕，酌情調整
        MansionFractPosition: 8,
    },
    Sanji: { //晉書律曆下，開元占經卷105。始悟以月食衝檢日宿度所在。劉洪濤238頁
        // 周天/紀法 / (通數/日法) = 895220/2451 / (179044/6062) = 12 898/2451
        Solar: 365 + 605 / 2451, // 605:斗分
        SolarNumer: 895220, // 週天、紀日
        SolarDenom: 2451,
        Lunar: 29 + 3217 / 6063, // 朔策。月19年行天254週，小週：254
        LunarNumer: 179044, // 通數
        Denom: 6063, // 日法。原文日法誤6062        
        Anoma: 27 + 3362 / 6063, // 近點月。月週=254*2451/19=32766。週日日餘3362
        AnomaNumer: 167063, // 通週
        AnomaCorr: 86178, // 本來是49178
        EcliRange: 11045 / 1882, // 會月/會率。會率/2=朔望合數。893:會歲會月-朔望合數=11045-941=入交限
        EcliCorr: 12700 / 11045, // 原來是 9157 / 11045
        Node: 27.212199762772333,
        OriginAd: 384 - 83840, // 晉孝武太元九年甲申
        CloseOriginAd: 384,
        // JdOrigin: 1861305.400041 - 83840 * (365 + 605 / 2451),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 7353, // 元法。元月90945
        JiRange: 2451, // 紀月30315，紀日895220
        ZhangRange: 19,
        ZhangLeap: 7,
        MansionRaw: [8, 17], // 占經：斗17度，《中國數理天文學》頁193
        MansionFractPosition: 8, // 闕
    },
    Xuanshi: { // 開元占經卷105、疇人傳卷第六
        // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js 《梁趙厯》上元甲寅，至今六萬一千七百四十算上。 元法四十三萬二千，紀法七萬二千，蔀法七千二百，章歲六百，章月七千四百二十一（亦曰時法），章閏二百二十二，周天二百六十二萬九千七百五十九，亦曰通數餘數三萬七千七百五十九，斗分一千七百五十九，日法八萬九千五十二，亦曰蔀日月周九萬六千二百五十二，小周八千二十二，會數一百七十三，度餘二萬七千七百一十九，會虛六萬一千三百三十三，交會差一百四十七，度餘三千三百一十一，遲疾差六百餘四千五百三十，周日二十七日，餘四萬九千三百八十，周虛三萬九千六百七十二。
        // 上元甲寅，至今(開元2年)61740算上。元法432000，紀法72000，蔀法7200，章歲600，章月7421，(亦曰時法)章閏222，周天2629759，(亦曰通數)餘數37759，斗分1759，日法89052，(亦曰蔀)日月周96252，小周8022，會數173，度餘27719，會虛61333，交會差147，度餘3311，遲疾差600餘4530，周日27日，餘49380，周虛39672。
        // 疇人傳卷第六: 趙𢾺，河西人也。善曆算。沮渠蒙遜元始時，修元始術。上元甲寅至元始元年壬子，積六萬一千四百三十八算上，元法四十三萬二千，紀法七萬二千，蔀法七千二百。章歲六百，章月七千四百二十一，亦曰時法。章閏二百二十一，周天二百六十二萬九千七百五十九，亦曰通數。餘數三萬七千七百五十九，斗分一千七百五十九，日法八萬九千五十二，亦曰蔀月。月周九萬六千二百五十二，小周八千二十一，會數一百七十三，度餘二萬七千七百一十九，會虛六萬一千三百三十三，交會差一百四十七，度餘三千三百一十一，遲疾差六百，餘四萬一千五百三十。周日二十七，日餘四萬九千三百八十。周虛三萬九千六百七十二。《宋書 大且渠蒙遜傳》、《魏書 律曆志》、《開元占經》
        // 上元甲寅至元始元年壬子，積61438算上，元法432000，紀法72000，蔀法7200。章歲600，章月7421，亦曰時法。章閏221，周天2629759，亦曰通數。餘數37759，斗分1759，日法89052，亦曰蔀月。月周96252，小周8021，會數173，度餘27719，會虛61333，交會差147，度餘3311，遲疾差600，餘41530。周日27，日餘49380。周虛39672。
        Solar: 365 + 1759 / 7200,
        SolarNumer: 2629759, // 週天、通數
        SolarDenom: 7200,
        Lunar: 29 + 47251 / 89052, // 朔策。
        LunarNumer: 2629759, // 
        Denom: 89052, // 日法、蔀日        
        Anoma: 27 + 49380 / 89052, // 近點月。月週96252
        AnomaNumer: 2453784,
        AnomaCorr: 600000, // 「遲疾差600」紀差795624
        EcliRange: 15433715 / 2629759, // 闕。交會週期=會通/週天。會數173+(89052-61333,度餘27719)/89052日一交=會通/日法。分子爲會餘。所以會通=15433715
        EcliCorr: -2300000 / 15433715, // 不知道怎麼補，瞎填一個 -2300000 / 15433715
        Node: 27.212245523296843,
        OriginAd: 412 - 61438, // 玄始元年壬子
        CloseOriginAd: 412,
        // JdOrigin: 1871530.1447 - 61438 * (365 + 1759 / 7200),
        OriginYearSc: 51, // 上元甲寅
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        YuanRange: 432000, // 元法
        JiRange: 72000, // 紀日26297590，
        BuRange: 7200, // 蔀法
        ZhangRange: 600, // 章月、時法7421
        ZhangLeap: 221,
        MansionRaw: [8, 16], // 闕，酌情處理
        MansionFractPosition: 8,
    },
    Tsrengguang: {
        Solar: 365 + 1477 / 6060, // 歲實.斗分：1477，
        SolarNumer: 2213377, // 週天分
        SolarDenom: 6060,
        Lunar: 29 + 39769 / 74952, // 朔策。
        LunarNumer: 2213377, // 月法
        Denom: 74952, // 日法=蔀月        
        Anoma: 27 + 41562 / 74952, // 近點月。277:週日。41562：週日餘
        AnomaNumer: 2065266, // 通週
        AnomaCorr: 24 * 74952 + 63568, // 而交會差就是空
        EcliRange: 5 + 1923019 / 2213377,
        Node: 27.212219336007635,
        // MoonAcrVList: [(14 + 361 / 505), (14 + 300 / 505), (14 + 236 / 505), (14 + 171 / 505), (14 + 99 / 505), (13 + 471 / 505), (13 + 266 / 505), (13 + 61 / 505), (12 + 439 / 505), (12 + 338 / 505), (12 + 237 / 505), (12 + 136 / 505), (12 + 35 / 505), (11 + 464 / 505), (12 + 36 / 505), (12 + 109 / 505), (12 + 189 / 505), (12 + 290 / 505), (12 + 392 / 505), (12 + 496 / 505), (13 + 118 / 505), (13 + 243 / 505), (13 + 388 / 505), (14 + 29 / 505), (14 + 174 / 505), (14 + 287 / 505), (14 + 312 / 505), (14 + (339 + 9684 / 41562) / 505), (14 + 361 / 505)], // 《古代曆法計算法》第328頁有誤，4日是171而非176
        MoonAcrVList: [7431, 7370, 7306, 7241, 7169, 7036, 6831, 6626, 6499, 6398, 6297, 6196, 6095, 6019, 6096, 6169, 6249, 6350, 6452, 6556, 6683, 6808, 6953, 7099, 7244, 7357, 7382, 7409.233001299263],
        MoonDifAccumList: [0, 680, 1299, 1854, 2344, 2762, 3047, 3127, 3002, 2750, 2397, 1943, 1388, 732, 0, -655, -1237, -1739, -2140, -2439, -2634, -2702, -2645, -2443, -2095, -1602, -996, -365, 293],
        OriginAd: 522 - 167750, // 壬寅
        CloseOriginAd: 522,
        // JdOrigin: 1911706.1023 - 167750 * (365 + 1477 / 6060),
        OriginYearSc: 49, // 上元壬子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 363600, // 元法，6紀
        JiRange: 60600, // 1紀10蔀
        TongRange: 121200, // 統法，1統2紀
        BuRange: 6060, // 蔀法、度法。蔀日=月通
        ZhangRange: 505, // 章法，1蔀12章 
        ZhangLeap: 186, // 閏餘。每年月數：12+186/505
        MansionRaw: [8, 15], // 斗15度
        MansionFractPosition: 8, // 經斗除分
    },
    Xinghe: {
        Solar: 365 + 4117 / 16860, // 歲實.斗分：4177，
        SolarNumer: 6158017, // 週天
        SolarDenom: 16860,
        Lunar: 29 + 110647 / 208530, // 朔策。經月餘：110647.度分=日法-經月餘=97883
        LunarNumer: 6158017, // 通數、週天
        Denom: 208530, // 日法=蔀月        
        Anoma: 27 + 115631 / 208530, // 近點月。27:週日，115631:週餘。週虛=日法-週餘=92899
        AnomaNumer: 5745941, // 通週
        EcliRange: 36142807 / 6158017,
        Node: 27.21237997247385,
        // MoonAcrVList: [(14 + 402 / 562), (14 + 334 / 562), (14 + 261 / 562), (14 + 190 / 562), (14 + 111 / 562), (13 + 522 / 562), (13 + 296 / 562), (13 + 68 / 562), (12 + 486 / 562), (12 + 379 / 562), (12 + 267 / 562), (12 + 151 / 562), (12 + 40 / 562), (11 + 515 / 562), (12 + 38 / 562), (12 + 123 / 562), (12 + 211 / 562), (12 + 324 / 562), (12 + 435 / 562), (12 + 555 / 562), (13 + 128 / 562), (13 + 270 / 562), (13 + 432 / 562), (14 + 33 / 562), (14 + 194 / 562), (14 + 319 / 562), (14 + 346 / 562), (14 + 379 / 562), (14 + 402 / 562)],
        MoonAcrVList: [8270, 8202, 8129, 8058, 7979, 7828, 7602, 7374, 7230, 7123, 7011, 6895, 6784, 6697, 6782, 6867, 6955, 7068, 7179, 7299, 7434, 7576, 7738, 7901, 8062, 8187, 8214, 8247],
        MoonDifAccumList: [0, 757, 1446, 2062, 2607, 3073, 3388, 3477, 3338, 3055, 2665, 2163, 1545, 816, 0, -731, -1377, -1935, -2380, -2714, -2928, -3007, -2944, -2719, -2331, -1782, -1108, -407, 327],
        OriginAd: 540 - 293996, // 庚申
        CloseOriginAd: 540,
        // JdOrigin: 1918280.6265 - 293996 * (365 + 4117 / 16860),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1011600, // 元法，6紀
        JiRange: 168600, // 1紀10蔀
        TongRange: 337200, // 統法，1統2紀
        BuRange: 16860, // 蔀法、度法。蔀日=月通
        ZhangRange: 562, // 章法，1蔀30章.章中：6744
        ZhangLeap: 207, // 閏餘。每年月數：12+186/505
        MansionRaw: [8, 15], // 斗15度
        MansionFractPosition: 8,
    },
    Tianbao: { // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js // 嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        Solar: 365 + 5787 / 23660, // 
        SolarNumer: 8641687, // 週天、蔀日，通數，沒分
        SolarDenom: 23660,
        Lunar: 29 + 155272 / 292635, // 朔策
        LunarNumer: 8641687, // 月法
        Denom: 292635, // 日法=蔀月
        // 餘數124087(亦名没分)
        Anoma: 27 + 162261 / 292635, // 近點月。歷餘162261
        AnomaNumer: 8063406, // 通週。週虛130374。小週9037.月週316295.虛分137363
        EcliRange: 50716913 / 8641687, // 「甲子紀差分空」
        Node: 27.212243804560554,
        // MoonAcrVList: [14 + 483 / 676, 14 + 401 / 676, 14 + 314 / 676, 14 + 228 / 676, 14 + 133 / 676, 13 + 630 / 676, 13 + 356 / 676, 13 + 82 / 676, 12 + 587 / 676, 12 + 454 / 676, 12 + 320 / 676, 12 + 182 / 676, 12 + 47 / 676, 11 + 621 / 676, 12 + 46 / 676, 12 + 146 / 676, 12 + 253 / 676, 12 + 389 / 676, 12 + 524 / 676, 12 + 665 / 676, 13 + 155 / 676, 13 + 324 / 676, 13 + 519 / 676, 14 + 39 / 676, 14 + 233 / 676, 14 + 384 / 676, 14 + 417 / 676, 14 + (465 + 117513 / 162261) / 676, 14 + 483 / 676], // 原闕，嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        MoonAcrVList: [9947, 9865, 9778, 9692, 9597, 9418, 9144, 8870, 8699, 8566, 8432, 8294, 8159, 8057, 8158, 8258, 8365, 8501, 8636, 8777, 8943, 9112, 9307, 9503, 9697, 9848, 9881, 9929.724222086637],
        MoonDifAccumList: [0, 910, 1738, 2479, 3134, 3694, 4075, 4182, 4015, 3677, 3206, 2601, 1858, 980, 0, -879, -1658, -2330, -2866, -3267, -3527, -3621, -3546, -3276, -2810, -2150, -1339, -495, 398],
        OriginAd: 550 - 110526, // 天保元年庚午
        CloseOriginAd: 550,
        // JdOrigin: 1921934.0571 - 110526 * (365 + 5787 / 23660),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1419600, // 元法，6紀
        JiRange: 236600, // 原文的數字是20036600
        BuRange: 23660, // 蔀法、度法
        ZhangRange: 676, // 章歲
        ZhangLeap: 249,
        MansionRaw: [8, 15], // 「命起牛前十二度」斗15
        MansionFractPosition: 8, // 闕，應該就是斗分
    },
    Jiayin: { // 嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        Solar: 365 + 5461 / 22338,
        SolarNumer: 8158831, // 週天、蔀日，通數，沒分
        SolarDenom: 22338,
        Lunar: 29 + 146595 / 276284, //《古代曆法計算法》第615頁 (146595 + 2 / 657) / 276284，不知道他是怎麼算出小數的，不要小數正好
        Denom: 22338, // 日法
        Anoma: 27 + 153225 / 276284, // 近點月。闕
        // AnomaCorr: 85000, // 闕，據紀差214931酌情增補。照理說應該是空，以後再說。這是嚴敦傑積年的情況
        OriginAd: 576 - 1010382, // 武平四年癸巳 // 嚴敦傑573 - 123399
        CloseOriginAd: 576,
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1340280, // 元法。闕，我假設是紀法的6倍
        JiRange: 223380, // 闕，我假設是蔀法的10倍
        BuRange: 22338, // 蔀法、度法。蔀日8158831
        ZhangRange: 657, // 章歲。章月8126.蔀月276284
        ZhangLeap: 242,
        MansionRaw: [8, 15], // 闕，酌情處理
        MansionFractPosition: 8,
    },
    Tianhe: { // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js 及武帝時，甄鸞造《天和曆》。上元甲寅至天和元年丙戌，積八十七萬五千七百九十二算外，章歲三百九十一，蔀法二萬三千四百六十，日法二十九萬一百六十，朔餘十五萬三千九百九十一，斗分五千七百三十一，會餘九萬三千五百一十六，曆餘一十六萬八百三十，冬至斗十五度，參用推步。終於宣政元年。
        // 及武帝時，甄鸞造《天和曆》。上元甲寅(50)至天和元年(566)丙戌(22)，積875792算外，章歲391，蔀法23460，日法290160，朔餘十五萬三千九百九十一，斗分5731，會餘93516，曆餘160830，冬至斗十五度，3用推步。終於宣政元年。
        Solar: 365 + 5731 / 23460,
        SolarNumer: 8568631, // 週天
        SolarDenom: 23460,
        Lunar: 29 + 153991 / 290160, // 朔策
        LunarNumer: 8568631, //
        Denom: 290160, // 日法。
        Anoma: 27 + 160830 / 290160, // 歷餘160830
        AnomaNumer: 7995150,
        EcliRange: 50291196 / 8568631, // 173+ 93516/290160=會通/8568631。實驗得天保、天和甲子紀差交會遲疾並空
        Node: 27.21247526807761,
        OriginAd: 566 - 875792, // 天和元年丙戌
        CloseOriginAd: 566,
        // JdOrigin: 1927776.1075 - 875792 * (365 + 5731 / 23460),
        OriginYearSc: 51, // 上元甲寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 1407600, // 元法闕，我算得
        JiRange: 234600, // 闕
        BuRange: 23460, // 蔀法
        ZhangRange: 391, // 章歲
        ZhangLeap: 144, // 
        MansionRaw: [8, 15], // 斗15度
        MansionFractPosition: 8
    },
    Daxiang: { // https://github.com/kanasimi/CeJS/blob/master/data/date/calendar.js 大象元年，太史上士馬顯等，又上《丙寅元曆》...上元丙寅至大象元年己亥，積四萬一千五百五十四算上。日法五萬三千五百六十三，亦名蔀會法。章歲四百四十八，斗分三千一百六十七，蔀法一萬二千九百九十二。章中爲章會法。日法五萬三千五百六十三，曆餘二萬九千六百九十三，會日百七十三，會餘一萬六千六百一十九，冬至日在斗十二度。小周餘、盈縮積，其曆術別推入蔀會，分用陽率四百九十九，陰率九。每十二月下各有日月蝕轉分，推步加減之，乃爲定蝕大小餘，而求加時之正。
        // 上元丙寅至大象元年己亥，積41554算上。日法53563，亦名蔀會法。章歲448，斗分3167，蔀法12992。章中爲章會法。日法53563，曆餘29693，會日百七十三，會餘16619，冬至日在斗12度。小周餘、盈縮積，其曆術別推入蔀會，分用陽率499，陰率9。每12月下各有日月蝕轉分，推步加減之，乃爲定蝕大小餘，而求加時之正。
        Solar: 365 + 3167 / 12992,
        SolarNumer: 4745247, // 週天
        SolarDenom: 12992,
        Lunar: 29 + 28422 / 53563, // 朔策沒問題。陽率499，陰率9
        LunarNumer: 1581748, // 闕了這項參數，我復原的
        Denom: 53563, // 日法、蔀會法。「別推入蔀會」：用另一種方法推出日法   
        Anoma: 27 + 29693 / 53563, // 近點月
        AnomaNumer: 1475894, // 通週
        EcliRange: 9283018 / (4745247 / 3), // 173+16619/53563
        Node: 27.21225648359655,
        OriginAd: 579 - 41553, // 大象元年己亥。隋志41555，授時議42555。幾個方案：-274。-57:先天半日；- 41553後天0.4日
        CloseOriginAd: 579,
        // 會日173，會餘16619，冬至日在斗12度。
        // JdOrigin: 1932524.2832 - 41553 * (365 + 3167 / 12992),
        OriginYearSc: 3, // 上元丙寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 259840, // 闕，我算得。1 元 = 20 蔀，1 蔀 = 29 章
        JiRange: 129920, // 闕，我假設是蔀法的10倍。
        BuRange: 12992, // 蔀法29章。蔀日4734247
        ZhangRange: 448, // 章法
        ZhangLeap: 165,
        MansionRaw: [8, 12], // 斗12度
        MansionFractPosition: 8, // 闕，擬
    },
    Kaihuang: { // 《隋志中》除了月離表都有了。《劉洪濤》618頁。以開皇曆交點月、月食週期比之，與我的換算公式完全相合！
        Solar: 365 + 25063 / 102960,
        SolarNumer: 37605463, // 週天分、蔀日、沒分。斗分=25063
        SolarDenom: 102960,
        Lunar: 29 + 96529 / 181920, // 朔策。
        LunarNumer: 5372209, // 通月
        Denom: 181920, // 日法、週法。（朔）虛分=30*Denom-LunarNumer。朔時法=Denom/12
        Node: 27 + (38607 + 1841 / 2815) / 181920, // 交點月
        NodeNumer: 512104800, // 交法
        NodeSmallFract: 2815, // 交分法
        Anoma: 27 + 100859 / 181920, // 近點月
        AnomaFract: 100859, // 週日餘、小大法
        AnomaNumer: 5012699, // 週通。週虛81061CycleDif = Denom - AnomaNumer 
        EcliRange: 1297 / 221,
        YinyangCorr: -1,
        OriginAd: 584 - 4129000, // 開皇四年行用至開皇十六年
        CloseOriginAd: 584,
        // JdOrigin: 1934350.8011 - 4129000 * (365 + 25063 / 102960),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        YuanRange: 6177600, // 元法
        JiRange: 1029600, // 紀法
        BuRange: 102960, // 蔀法、度法
        ZhangRange: 429, // 章歲
        ZhangLeap: 158, // 章閏
        MansionRaw: [8, 12], // 闕，以大象補之
        MansionFractPosition: 8, // 闕，擬
    },
    Yuanjia: {
        Solar: 365 + 75 / 304, // 歲實。304:度法。111035:週天。75:度分。
        SolarNumer: 111035,
        SolarDenom: 304,
        Lunar: 29 + 399 / 752, // 朔策。
        LunarNumer: 22207, // 通數
        Denom: 752, // 日法=16*47。47:通法
        Anoma: 27 + 417 / 752, // 近點月、交點月
        AnomaNumer: 20721, // 通週。417:週日日餘。 Denom-週日日餘=335:週虛
        AnomaCorr: 625, // 原來是17663。2343比較合
        EcliRange: 939 / 160, // 會月/會數。朔望合數=EcliDenom/2。
        EcliCorr: 877 / 939, //661 / 939
        Node: 27.21218784582298,
        MoonAcrVList: [279, 277, 274, 270, 265, 260, 254, 249, 245, 242, 239, 236, 234, 232, 230, 232, 234, 237, 242, 248, 254, 259, 263, 267, 271, 274, 277, 278 + 103 / 417, 279],
        MoonDifAccumList: [0, 25, 48, 68, 84, 95, 101, 101, 96, 87, 75, 60, 42, 22, 0, -24, -46, -66, -83, -95, -101, -101, -96, -87, -74, -57, -37, -14, 10.2470023981],
        MoonLatiDifList: [17, 16, 15, 12, 8, 4, 1, -2, -6, -10, -13, -15, -16, -(16 + 3472 / 5371)], // 元嘉陰陽曆
        MoonLatiAccumList: [0, 1.416666666666666667, 2.75, 4, 5, 5.666666666666667, 6, 6.083333333333333, 5.916666666666667, 5.416666666666667, 4.583333333333333, 3.5, 2.25, 0.916666666666667, -0.4705362129957],
        OriginAd: 443 - 5703, // 上元積年的公元
        CloseOriginAd: 443,
        // JdOrigin: 1882851.6157 - 5703 * (365 + 75 / 304) + 1.5, // 有點不對，修正一下
        OriginYearSc: 17, // 上元庚辰
        OriginMonNum: 2, // 雨水爲歲首
        ZhengNum: 2, // 建寅
        YuanRange: 3648, // 元法
        JiRange: 608, // 紀法。紀月：7520.紀日：222070
        ZhangRange: 19,
        ZhangLeap: 7,
        // MansionRaw: [13, 2], // 劉洪濤頁251：冬至在斗17，雨水日在室2度。由於日行盈縮，雨水本來是4度265+20/24分
        MansionRaw: [13, 1 + 5 / 6], // 《中國古代曆法》27頁
        MansionFractPosition: 13, // 經室去度分
        // DayLight: [45, 45.6, 46.7, 48.4, 50.5, 52.9, 55.5, 58, 60.3, 62.3, 63.9, 64.8, 65, 64.8, 63.9, 62.3, 60.3, 58, 55.5, 52.9, 50.5, 48.4, 46.7, 45.6], // 晝漏
        NightList: [27.5, 27.2, 26.65, 25.8, 24.75, 23.55, 22.25, 21, 19.85, 18.85, 18.05, 17.6, 17.5, 17.6, 18.05, 18.85, 19.85, 21, 22.25, 23.55, 24.75, 25.8, 26.65, 27.2, 27.5],
        DialList: [13, 12.48, 11.34, 9.91, 8.22, 6.72, 5.39, 4.25, 3.25, 2.5, 1.97, 1.69, 1.5, 1.69, 1.97, 2.5, 3.25, 4.25, 5.39, 6.72, 8.22, 9.91, 11.34, 12.48, 13], // 晷長
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    Daming: {
        YuanRange: 592365, // 元法，15紀
        JiRange: 39491, // 紀法。每紀101章。紀日：14423804，紀月488436
        ZhangRange: 391, // 章歲
        ZhangLeap: 144, // 章閏。每年12+144/391月
        Solar: 365 + 9589 / 39491, // 歲實。歲餘：9589.歲分：14423804
        SolarNumer: 14423804,
        SolarDenom: 39491,
        Sidereal: 365 + 10449 / 39491, // 365.264592
        SiderealNumer: 14424664, // 週天。冬至點45.92年西移1度（39391分）。現代値：回歸年比恆星年短20分鐘
        Lunar: 29 + 2090 / 3939, // 朔策
        LunarNumer: 116321, // 月法
        Denom: 3939, // 日法        
        Anoma: 27 + 14631 / 26377, // 近點月
        AnomaNumer: 726810, // 通週
        // MoonAcrVList: [(14 + 13 / 23), (14 + 11 / 23), (14 + 8 / 23), (14 + 4 / 23), (13 + 22 / 23), (13 + 17 / 23), (13 + 11 / 23), (13 + 5 / 23), (12 + 22 / 23), (12 + 16 / 23), (12 + 11 / 23), (12 + 8 / 23), (12 + 6 / 23), (12 + 4 / 23), (12 + 5 / 23), (12 + 7 / 23), (12 + 10 / 23), (12 + 14 / 23), (12 + 19 / 23), (13 + 1 / 23), (13 + 7 / 23), (13 + 13 / 23), (13 + 19 / 23), (14 + 1 / 23), (14 + 6 / 23), (14 + 10 / 23), (14 + 12 / 23), (14 + (14 + 1010 / 1717) / 23), (14 + 13 / 23)], // 《古代曆法計算法》第303頁
        MoonAcrVList: [5695, 5661, 5610, 5542, 5457, 5372, 5270, 5168, 5066, 4964, 4879, 4828, 4794, 4760, 4777, 4811, 4862, 4930, 5015, 5100, 5202, 5304, 5406, 5491, 5576, 5644, 5678, 5722],
        MoonDifAccumList: [0, 467.71165998000015, 901.42331996, 1284.13497994, 1598.84663992, 1828.5582999, 1973.26995988, 2015.98161986, 1956.69327984, 1795.40493982, 1532.1165998, 1183.82825978, 784.53991976, 351.25157974, -116.03676028, -566.3251003, -982.61344032, -1347.90178034, -1645.19012036, -1857.47846038, -1984.7668004, -2010.05514042, -1933.34348044, -1754.63182046, -1490.92016048, -1142.2085005, -725.49684052, -274.78518054, 219.92647944],
        Node: 27 + 5598 / 26377, // 分母通法類似以往的月週 // NodeNumer: 358888.5, // 交點月一半的分子：交數。15987.5日餘。朔望合數=Lunar/2，差爲前限。
        MoonLatiDifList: [16, 15, 14, 12, 9, 5, 1, -2, -6, -10, -13, -15, -16, -(16 + 3188 / 6395)], // 陰陽曆表遠離黃道益，接近黃道損
        MoonLatiAccumList: [0, 1.3333333333333333, 2.583333333333333, 3.75, 4.75, 5.5, 5.916666666666667, 6, 5.833333333333333, 5.333333333333333, 4.5, 3.416666666666667, 2.166666666666667, 0.833333333333333, -0.5415428720354],
        OriginAd: 463 - 51939, // 宋大明七年癸卯
        CloseOriginAd: 463,
        // JdOrigin: 1890157.0589 - 51939 * (365 + 9589 / 39491),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 0], // 虛初度 // 大概想明白了，這是上元的！！！從上元到463年，大概退了35度，從虛初退，正好是斗12左右
        MansionFractPosition: 10, // 虛前，入虛去度分 
        // DayLight: [45, 45.6, 46.7, 48.4, 50.5, 52.9, 55.5, 58.1, 60.4, 62.4, 63.9, 64.8, 65, 64.8, 63.9, 62.4, 60.4, 58.1, 55.5, 52.9, 50.5, 48.4, 46.7, 45.6], // 大明在元嘉基礎上微調
        // const tmpA = NightList.slice()
        //  const tmpB = tmpA.reverse().slice(1, -1)
        //   NightList = NightList.concat(tmpB)
        NightList: [27.5, 27.2, 26.65, 25.8, 24.75, 23.55, 22.25, 20.95, 19.8, 18.8, 18.05, 17.6, 17.5, 17.6, 18.05, 18.8, 19.8, 20.95, 22.25, 23.55, 24.75, 25.8, 26.65, 27.2, 27.5],
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43],
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    Liangwu: { // 開元占經「梁武大同」，虞𠠎。用來補明克讓。只有以下信息：《隋志中》「初，西魏入關，尚行李業興《正光術》。至武成元年，始詔克讓與麟趾學士庾季才及諸日者定新術，采祖暅舊議，通簡南北之術。自斯已後，頗親其謬。故周齊並時，而曆差一日。」跟元嘉大概三年有兩年差一天。陳久金《符天曆研究》：祖暅的符天經與後來的符天曆毫無關係。「采祖暅舊議」說明與大明很接近
        // 我根據大衍曆議的歲差，補出恆星年
        YuanRange: 2376960, // 元法闕，我算得。這麼來看，1元=60紀，是北系。
        JiRange: 39616, // 紀64章。章月7656，紀月489984/日法=319
        ZhangRange: 619, // 章歲同劉孝孫
        ZhangLeap: 228, // 章閏闕，以劉孝孫補之
        Solar: 365 + 9681 / 39616, // 闕。設斗分y,朔餘x，由朔策=紀日/紀月,設x=815，可得此數
        SolarNumer: 14469521,
        SolarDenom: 39616,
        Sidereal: 365 + 9894 / 39616,
        Lunar: 29 + 815 / 1536, // 闕，這是唯一可選。3月11日看到《李氏遺書》p229，推算結果跟李銳一樣，真厲害！
        LunarNumer: 45359,
        Denom: 1536, // 日法        
        Anoma: 27 + 852 / 1536, // 闕，以大明補之
        AnomaNumer: 42324,
        AnomaCorr: 72500,
        OriginAd: 535 - 1025691, // 假設梁武帝大同元年。積年沒錯
        CloseOriginAd: 535,
        // JdOrigin: 1916454.5956 - 1025691 * (365 + 9681 / 39616),
        OriginYearSc: 1,
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 0], // 假設是虛初 
        MansionFractPosition: 8,
    },
    Zhangmengbin: { // 嚴敦傑《補北齊書曆志》，《自然科學史研究》1984年第3期
        JiRange: 48901, // 紀法。紀日1786810
        ZhangRange: 619, // 章歲。章月7656
        ZhangLeap: 228, // 章閏。闕，以章月補之。置閏週期與劉孝孫同
        YuanRange: 293406, // 闕，我算得
        Solar: 365 + 11945 / 48901, // 《中國古代曆法》第616頁。這些數據竟然都是他推出來的。原來歲實分母就是紀法
        SolarNumer: 17860810, //
        Lunar: 29 + 503 / 948, // 朔策
        LunarNumer: 27995, // 月法
        Denom: 948, // 日法 
        Anoma: 27 + 3866 / 6971, // 闕
        AnomaNumer: 945673,
        AnomaDenom: 34320,
        AcrTermList: [0, 14.68005, 29.437022, 44.270918, 59.104814, 73.861787, 88.541836, 104.298809, 119.978859, 135.581986, 151.185112, 166.865162, 182.622135, 198.379107, 214.059157, 229.662284, 245.26541, 260.94546, 276.702433, 291.382482, 306.139455, 320.973351, 335.807247, 350.564219, 365.244269], // 皇極日躔
        OriginAd: 576 - 25952, // 武平四年癸巳// 嚴敦傑573 - 876569
        CloseOriginAd: 576,
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        MansionRaw: [8, 11], // 「日月五星并從斗十一起」
        MansionFractPosition: 8
    },
    Liuxiaosun: { // 開元占經保存的數據。《中國古代曆法》第427頁
        YuanRange: 160940, // 元法
        JiRange: 8047, // 紀法
        ZhangRange: 619, // 章歲
        ZhangLeap: 228, // 章閏
        Solar: 365 + 1966 / 8047, // 歲餘1966
        SolarNumer: 2939121, //
        Sidereal: 365 + 6407 / 24141, // 虛分6407.差分509.
        SiderealNumer: 8817872,
        Lunar: 29 + 17603 / 33176, // 朔策=紀日/紀月 // 《古代曆法計算法》第615頁
        LunarNumer: 979707, // 月法
        Denom: 33176,
        Node: 27 + 51021 / 227084, // 自己算的交點月
        EcliRange: 2013 / 341, // 會月 2013，會率341
        Anoma: 27 + 19033 / 34320, // 近點月。歷朔差分67817.通法3442 
        AnomaNumer: 945673, // 闕，根據皇極比例：19033，大明：19037，元嘉、正光：19031，以上三個數字可選
        AnomaDenom: 34320, // 週法：開元占經已知。說明分子不能是偶數、3的倍數
        AcrTermList: [0, 14.680052, 29.437026, 44.270924, 59.104822, 73.861796, 88.541848, 104.298823, 119.978874, 135.582003, 151.185131, 166.865183, 182.622157, 198.379132, 214.059184, 229.662312, 245.265441, 260.945492, 276.702467, 291.382518, 306.139493, 320.973391, 335.807288, 350.564263, 365.244315],
        OriginAd: 573 - 435089,
        CloseOriginAd: 573,
        // JdOrigin: 1930334.1174 - 435089 * (365 + 1966 / 8047),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0,
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 7], // 先是9，後來改成7
        MansionFractPosition: 11,
    },
    Daye: { // 隋志的大業曆就是修改之後的，冬至起虛七。占經寫成了張曹玄
        // YuanRange: 852800, // 無，我算得
        ZhangRange: 410, // 章歲
        ZhangLeap: 151, // 章閏。每年12+144/391月
        Solar: 365 + 10363 / 42640,
        SolarNumer: 15573963, // 歲分。度法、度分：42640
        SolarDenom: 42640,
        Sidereal: 365 + 10866 / 42640, // 恆星年。斗分：10866。歲差84.77年1度
        SiderealNumer: 15574466, // 週天
        Lunar: 29 + 607 / 1144, // 朔策。
        LunarNumer: 33783, // 月法
        Denom: 1144, // 日法        
        Anoma: 27 + 1413 / 2548, // 近點月
        AnomaNumer: 70209, // 週通
        AnomaDenom: 2548, // 週法
        Node: 10646729 / 391248, // 會通10646729，朔差907057
        NodeDenom: 391248,
        MoonAcrVList: [6010, 5950, 5880, 5800, 5710, 5620, 5530, 5430, 5330, 5240, 5160, 5090, 5020, 4960, 4980, 5040, 5110, 5190, 5270, 5360, 5450, 5550, 5640, 5730, 5810, 5890, 5950, 6000, 6010], // 《古代曆法計算法》第404頁，劉洪濤最後一個600改成333，但沒必要，因爲28日入曆肯定不會在1413 / 2548以上。最後一個601不當有，我爲了求轉差。我都乘了10，因爲原算法涉及10倍轉換
        MoonDifAccumList: [0, 528.98514, 997.97028, 1396.95542, 1715.94056, 1944.9257, 2083.91084, 2132.89598, 2081.88112, 1930.86626, 1689.8514, 1368.83654, 977.82167988, 516.80681987, -4.20804, -505.2229, -946.23776, -1317.25262, -1608.26748, -1819.28234, -1940.2972, -1971.31206, -1902.32692, -1743.34178, -1494.35664, -1165.3715, -756.38636, -287.40122, 231.58392],
        SunTcorrDifList: [70, 35, 35, 20, 30, 35, -55, -45, -40, -30, -55, -65, -55, -40, -25, -5, -30, -40, 60, 55, 50, 45, 40, 10], // 入氣盈縮。我改變了後半部分正負。以日法爲單位，月離表是以章爲單位
        SunTcorrList: [0, 70, 105, 140, 160, 190, 225, 170, 125, 85, 55, 0, -65, -120, -160, -185, -190, -220, -260, -200, -145, -95, -50, -10, 0],
        // OriginAd: 604 - 1427645,
        OriginAd: 604 - 1427640, // 跟皇極一樣，原來的積年不對，要退後5年。嚴絲合縫！大業四年戊辰。603年12月19日冬至
        CloseOriginAd: 604,
        // JdOrigin: 1941656.5722 - 1427640 * (365 + 10363 / 42640),
        OriginYearSc: 1, // 上元甲子
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 7], // 虛7度
        MansionFractPosition: 8, // 經斗去其分
        NightList: [29.980147, 29.715441, 29.132353, 28.323530, 27.279412, 26.044118, 24.720588, 23.455882, 22.323530, 21.323529, 20.56397, 20.108088, 20.019853, 20.108088, 20.563971, 21.323529, 22.323529, 23.455882, 24.720588, 26.044118, 27.279412, 28.323529, 29.132353, 29.715442, 29.980147], // 《中國古代曆法》43
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43], // 大明
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    WuyinA: { // 戊寅定朔 // 崔善爲修改的戊寅曆未改動傅仁均原始數據，《中國古代曆法》第460頁
        // YuanRange: 37856, // 無，我算得
        // JiRange: 9464, // 無，我算得
        ZhangRange: 676, // 章歲
        ZhangLeap: 249, // 章閏
        Solar: 365 + 2315 / 9464, // 餘數49635
        SolarNumer: 3456675, // 歲分
        SolarDenom: 9464,
        Sidereal: 365 + 2485.5 / 9464, // 週天。分子爲斗分
        SiderealNumer: 3456845.5, // 週分 
        Lunar: 29 + 6901 / 13006, // 朔策
        // 沒分76815，沒法1103，沒日距=沒分/沒法=歲分/餘數
        LunarNumer: 384075, // 月法
        Denom: 13006, // 日法。時法=日法/2。度法、氣法9464。
        TermDenom: 1183, // 氣時法=氣法/8=1183        
        Anoma: 27 + 16064 / 28968, // 分子爲歷餘 
        AnomaNumer: 798200, // 歷週
        AnomaDenom: 28968, // 歷法
        Node: 27 + 99373.8 / 468216, // 朔差=36月法-交會法。交會法/2=交分法=望差+交限。交點月+朔差=朔望月
        NodeDenom: 468216, // 36 * 13006,
        MoonAcrVList: [9909, 9810, 9695, 9563, 9414, 9266, 9118, 8953, 8788, 8640, 8508, 8392, 8277, 8178, 8211, 8310, 8425, 8557, 8689, 8837, 8986, 9151, 9299, 9447, 9578, 9710, 9809, 9891, 9909],
        MoonDifAccumList: [0, 872, 1645, 2303, 2829, 3206, 3435, 3516, 3432, 3183, 2786, 2257, 1612, 852, -7, -833, -1560, -2172, -2652, -3000, -3200, -3251, -3137, -2875, -2465, -1924, -1251, -479, 375],
        SunTcorrDifList: [896, 398, 400, 228, 341, 450, -500, -455, -355, -555, -848, -739, -626, -456, -288, -40, -342, -455, 682, 625, 570, 513, 456, 100],
        SunTcorrList: [0, 896, 1294, 1694, 1922, 2263, 2713, 2213, 1758, 1403, 848, 0, -739, -1365, -1821, -2109, -2149, -2491, -2946, -2264, -1639, -1069, -556, -100, 0],
        OriginAd: 626 - 164348, // 618武德元年加交差7755164
        CloseOriginAd: 626,
        // JdOrigin: 1949691.8546 - 164348 * (365 + 2315 / 9464),
        OriginYearSc: 15, // 上元戊寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 6], // 命以虛六
        MansionFractPosition: 8, // 經斗去分
        // NightList: [27 + 12 / 24, 27 + 5 / 24, 26 + 15 / 24, 25 + 19 / 24, 24 + 18 / 24, 23 + 13 / 24, 22 + 6 / 24, 20 + 3 / 24, 19 + 19 / 24, 18 + 19 / 24, 18 + 1 / 24, 17 + 14 / 24, 17 + 12 / 24], // 夜漏半
        NightList: [27.5, 27.208333333333333, 26.625, 25.791666666666667, 24.75, 23.541666666666667, 22.25, 20.125, 19.791666666666667, 18.791666666666667, 18.041666666666667, 17.583333333333333, 17.5, 17.583333333333333, 18.041666666666667, 18.791666666666667, 19.791666666666667, 20.125, 22.25, 23.541666666666667, 24.75, 25.791666666666667, 26.625, 27.208333333333333, 27.5],
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43], // 大明
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    WuyinB: { // 戊寅平朔 // 崔善爲修改的戊寅曆未改動傅仁均原始數據，《中國古代曆法》第460頁
        // YuanRange: 37856, // 無，我算得
        // JiRange: 9464, // 無，我算得
        ZhangRange: 676, // 章歲
        ZhangLeap: 249, // 章閏
        Solar: 365 + 2315 / 9464, // 餘數49635
        SolarNumer: 3456675, // 歲分
        SolarDenom: 9464,
        Sidereal: 365 + 2485.5 / 9464, // 週天。分子爲斗分
        SiderealNumer: 3456845.5, // 週分 
        Lunar: 29 + 6901 / 13006, // 朔策
        // 沒分76815，沒法1103，沒日距=沒分/沒法=歲分/餘數
        LunarNumer: 384075, // 月法
        Denom: 13006, // 日法。時法=日法/2。度法、氣法9464。
        TermDenom: 1183, // 氣時法=氣法/8=1183        
        Anoma: 27 + 16064 / 28968, // 分子爲歷餘 
        AnomaNumer: 798200, // 歷週
        AnomaDenom: 28968, // 歷法
        Node: 27 + 99373.8 / 468216, // 朔差=36月法-交會法。交會法/2=交分法=望差+交限。交點月+朔差=朔望月
        NodeDenom: 468216, // 36 * 13006,
        MoonAcrVList: [9909, 9810, 9695, 9563, 9414, 9266, 9118, 8953, 8788, 8640, 8508, 8392, 8277, 8178, 8211, 8310, 8425, 8557, 8689, 8837, 8986, 9151, 9299, 9447, 9578, 9710, 9809, 9891, 9909],
        MoonDifAccumList: [0, 872, 1645, 2303, 2829, 3206, 3435, 3516, 3432, 3183, 2786, 2257, 1612, 852, -7, -833, -1560, -2172, -2652, -3000, -3200, -3251, -3137, -2875, -2465, -1924, -1251, -479, 375],
        SunTcorrDifList: [896, 398, 400, 228, 341, 450, -500, -455, -355, -555, -848, -739, -626, -456, -288, -40, -342, -455, 682, 625, 570, 513, 456, 100],
        SunTcorrList: [0, 896, 1294, 1694, 1922, 2263, 2713, 2213, 1758, 1403, 848, 0, -739, -1365, -1821, -2109, -2149, -2491, -2946, -2264, -1639, -1069, -556, -100, 0],
        OriginAd: 626 - 164348, // 618武德元年加交差7755164
        CloseOriginAd: 626,
        // JdOrigin: 1949691.8546 - 164348 * (365 + 2315 / 9464),
        OriginYearSc: 15, // 上元戊寅
        OriginMonNum: 0, // 
        ZhengNum: 2, // 建寅
        MansionRaw: [11, 6], // 命以虛六
        MansionFractPosition: 8, // 經斗去分
        // NightList: [27 + 12 / 24, 27 + 5 / 24, 26 + 15 / 24, 25 + 19 / 24, 24 + 18 / 24, 23 + 13 / 24, 22 + 6 / 24, 20 + 3 / 24, 19 + 19 / 24, 18 + 19 / 24, 18 + 1 / 24, 17 + 14 / 24, 17 + 12 / 24], // 夜漏半
        NightList: [27.5, 27.208333333333333, 26.625, 25.791666666666667, 24.75, 23.541666666666667, 22.25, 20.125, 19.791666666666667, 18.791666666666667, 18.041666666666667, 17.583333333333333, 17.5, 17.583333333333333, 18.041666666666667, 18.791666666666667, 19.791666666666667, 20.125, 22.25, 23.541666666666667, 24.75, 25.791666666666667, 26.625, 27.208333333333333, 27.5],
        DialList: [13, 12.43, 11.2, 9.8, 8.17, 6.67, 5.37, 4.25, 3.26, 2.53, 1.99, 1.69, 1.5, 1.69, 1.99, 2.53, 3.26, 4.25, 5.37, 6.67, 8.17, 9.8, 11.2, 12.43, 13, 12.43], // 大明
        SunLatiList: [115, 113 + 1 / 12, 110 + 8 / 12, 106 + 2 / 12, 101 + 1 / 12, 95 + 1 / 12, 89 + 1 / 12, 83 + 2 / 12, 77 + 10 / 12, 73 + 2 / 12, 69 + 8 / 12, 67 + 2 / 12, 67 + 1 / 12, 67 + 10 / 12, 70, 73 + 7 / 12, 78 + 7 / 12, 84 + 4 / 12, 90 + 7 / 12, 96 + 10 / 12, 102 + 4 / 12, 107 + 4 / 12, 110 + 11 / 12, 113 + 10 / 12, 115, 113 + 1 / 12], // 四分
    },
    TaiyiKaiyuan: { // 曲安京《曆法》頁380
        ZhangRange: 657, // 同董峻甲寅元曆
        ZhangLeap: 242,
        Solar: 365 + 7877 / 32193,
        Lunar: 29 + 26 / 49,
        Denom: 49,
        OriginAd: 724 - 1937280,        
        OriginMonNum: 0,
        ZhengNum: 2,
    },
}