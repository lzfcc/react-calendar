import {
    outputFile
} from './output.mjs'
import fs from 'fs'

// const date = new Date()
const printData = outputFile(1, 645, 646, 0, [ // mode, YearStart, YearEnd, auto,
    // 'Yin',
    // 'Zhou',
    // 'Huangdi',
    // 'Lu',
    // 'LuA',
    // 'LuB',
    // 'LuC',
    // 'LuD',
    // 'LuE',
    // 'LuF',
    // 'LuG',
    // 'XiaDong',
    // 'XiaYu',
    // 'ZhuanxuA',
    // 'ZhuanxuB',
    // 'ZhuanxuC',
    // 'ZhuanxuD',
    // 'ZhuanxuE',
    // 'ZhuanxuF',
    // 'Shiji',
    // 'Taichu',
    // 'Qianzaodu',
    // 'Easthan', // 上四分系
    // 'Qianxiang',
    // 'Huangchu',
    // 'Jingchu',
    // 'Liuzhi',
    // 'Wangshuozhi',
    // 'Sanji', // 上魏晉系
    // 'Xuanshi',
    // 'Tsrengguang',
    // 'Xinghe',
    // 'Tianbao',
    // 'Jiayin',
    // 'Tianhe',
    // 'Daxiang',
    // 'Kaihuang', // 上北朝系
    // 'Yuanjia', 
    // 'Daming',
    // 'Liangwu',
    // 'Daye',
    // 'WuyinA',
    // 'WuyinB', // 上南朝系
    // 'Jiuzhi',
    // 'Shenlong',
    'Futian', // 上印度系
    // 'Zhangmengbin',
    // 'Liuxiaosun',
    // 'Huangji',
    // 'Linde', // 上隋、初唐系
    // 'Dayan', // 大衍入轉日感覺少了0.5
    // 'Wuji',
    // 'Tsrengyuan',
    // 'Xuanming',
    // 'Chongxuan',
    // 'Qintian', // 上唐五代系
    // 'Yingtian',  
    // 'Qianyuan', 
    // 'Yitian', 
    // 'Chongtian',
    // 'Mingtian',
    // 'Fengyuan',
    // 'Guantian',
    // 'Zhantian', 
    // 'Jiyuan', 
    // 'Tongyuan',
    // 'Qiandao', 
    // 'Chunxi', 
    // 'Huiyuan',
    // 'Tongtian',
    // 'Kaixi',
    // 'Chunyou',
    // 'Huitian',
    // 'Chengtian',
    // 'Bentian',
    // 'Daming1' // 賈俊大明
    // 'Daming2', 
    // 'Daming3', // 上宋金系
    // 'Yiwei',
    // 'Gengwu', 
    // 'Shoushi',
    // 'Datong', 
    // 'West', // 上授時系
    // 'Huihui', 
]) // 注意，-1000年爲公元前1001年，因爲沒有公元0年

const FilePath = 'output.md'
if (fs.existsSync(FilePath)) {
    fs.unlinkSync(FilePath)
}
printData.forEach(contents => {
    contents.forEach(content => {
        fs.appendFileSync(FilePath, content)
    })
    fs.appendFileSync(FilePath, `\n`)
})

// console.log('耗時 ', (new Date() - date) / 1000, 's')