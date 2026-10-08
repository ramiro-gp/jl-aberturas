import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'node:fs/promises';
const url = process.env.QA_URL || 'http://127.0.0.1:4321/';
const output = `qa/artifacts/${process.env.QA_MODE === 'production' ? 'official' : 'demo'}`;
await fs.mkdir(output, { recursive: true });
const summary = {};
const median = values => [...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const browser = await launch({chromeFlags:['--headless=new','--disable-gpu','--no-first-run']});
try {
  for(const formFactor of ['mobile','desktop']){
    const runs=[];
    for(let index=1;index<=3;index++){
      const { lhr, report } = await lighthouse(url, {port:browser.port,output:['html','json'],logLevel:'error'}, formFactor==='desktop'?{extends:'lighthouse:default',settings:{formFactor:'desktop',screenEmulation:{mobile:false,width:1366,height:768,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}}:undefined);
      await fs.writeFile(`${output}/lighthouse-${formFactor}-${index}.html`,report[0]);
      await fs.writeFile(`${output}/lighthouse-${formFactor}-${index}.json`,report[1]);
      const scores=Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)]));
      const metrics={lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue};
      const failures=Object.values(lhr.audits).filter(audit=>audit.score!==null&&audit.score<1&&['binary','numeric'].includes(audit.scoreDisplayMode)).map(audit=>({id:audit.id,title:audit.title,displayValue:audit.displayValue}));
      runs.push({scores,metrics,failures});
      console.log(formFactor,index,JSON.stringify({scores,metrics,failures}));
    }
    summary[formFactor]={medianScores:Object.fromEntries(Object.keys(runs[0].scores).map(key=>[key,median(runs.map(run=>run.scores[key]))])),medianMetrics:Object.fromEntries(Object.keys(runs[0].metrics).map(key=>[key,median(runs.map(run=>run.metrics[key]))])),runs};
  }
} finally {browser.kill();}
await fs.writeFile(`${output}/lighthouse-summary.json`,JSON.stringify({url, measuredAt: new Date().toISOString(), ...summary},null,2));
console.log('MEDIANS',JSON.stringify(summary,null,2));
