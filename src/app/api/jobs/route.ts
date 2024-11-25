
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { IJob } from '@/components/models';
import puppeteer, { Browser } from 'puppeteer';


export async function GET(req: NextRequest) {
  

    const jobs: IJob[] = [];

    const keyword = req.nextUrl.searchParams.get('keyword') || 'finance';
    const location = req.nextUrl.searchParams.get('location') || 'london';

    const browser = await puppeteer.launch({ headless: true });

    const totaljob_ads = await getAdsFromTotaljob(keyword, location, browser);    
    const cwjob_ads = await getAdsFromCWJobs(keyword, location, browser);
    const reed_ads = await getAdsFromReed(keyword, location, browser);

    // reuqest blocked by indeed ;((((
    // const indeed_ads = await getAdsFromIndeed(keyword, location, browser);

    await browser.close();

    jobs.push(...totaljob_ads, ...cwjob_ads, ...reed_ads);

    return NextResponse.json(jobs);

  
}

async function getAdsFromTotaljob(keyword: string, location: string, browser: Browser): Promise<IJob[]> {

        const jobs: IJob[] = [];
        const website = 'Total Jobs';
        const baseUrl = 'https://www.totaljobs.com';

        
        const page = await browser.newPage();
        await page.goto(`${baseUrl}/jobs/${keyword}/in-${location}`, { waitUntil: 'networkidle2' });

        const content = await page.content();
        const $ = cheerio.load(content);
        

        $('article[data-genesis-element="CARD"]').each((index, element) => {
            const title = $(element).find('h2[data-genesis-element="BASE"] a').text().trim() || '';

            if (!title) return;

            const location = $(element).find('span[data-at="job-item-location"]').text().trim() || '';
            const company = $(element).find('span[data-at="job-item-company-name"]').text().trim() || '';
            const type = $(element).find('div[data-genesis-element="BASE"]').text().includes('contract') ? 'Contract' : 
                         $(element).find('div[data-genesis-element="BASE"]').text().includes('permanent') ? 'Permanent' : '';
            const workStyle = $(element).find('div[data-genesis-element="BASE"]').text().includes('remote') ? 'Remote' : 
                            $(element).find('div[data-genesis-element="BASE"]').text().includes('hybrid') ? 'Hybrid' : 
                            $(element).find('div[data-genesis-element="BASE"]').text().includes('office') ? 'Office' : '';
            const description = $(element).find('div[data-at="jobcard-content"]').text().trim() || '';
            const url = baseUrl + $(element).find('h2[data-genesis-element="BASE"] a').attr('href') || '';
            const salary = $(element).find('span[data-at="job-item-salary-info"]').text().trim() || '';
            jobs.push({ title, location, company, type, workStyle, description, url, salary, website });
        });

    
        return jobs;
 
}

async function getAdsFromCWJobs(keyword: string, location: string, browser: Browser): Promise<IJob[]> {

  const jobs: IJob[] = [];
  const website = 'CW Jobs';
  const baseUrl = 'https://www.cwjobs.co.uk';

  
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/jobs/${keyword}/in-${location}`, { waitUntil: 'networkidle2' });

  const content = await page.content();
  const $ = cheerio.load(content);
  

  $('article[data-genesis-element="CARD"]').each((index, element) => {
      const title = $(element).find('h2[data-genesis-element="BASE"] a').text().trim() || '';

      if (!title) return;

      const location = $(element).find('span[data-at="job-item-location"]').text().trim() || '';
      const company = $(element).find('span[data-at="job-item-company-name"]').text().trim() || '';
      const type = $(element).find('div[data-genesis-element="BASE"]').text().includes('contract') ? 'Contract' : 
                   $(element).find('div[data-genesis-element="BASE"]').text().includes('permanent') ? 'Permanent' : '';
      const workStyle = $(element).find('div[data-genesis-element="BASE"]').text().includes('remote') ? 'Remote' : 
                      $(element).find('div[data-genesis-element="BASE"]').text().includes('hybrid') ? 'Hybrid' : 
                      $(element).find('div[data-genesis-element="BASE"]').text().includes('office') ? 'Office' : '';
      const description = $(element).find('div[data-at="jobcard-content"]').text().trim() || '';
      const url = baseUrl + $(element).find('h2[data-genesis-element="BASE"] a').attr('href') || '';
      const salary = $(element).find('span[data-at="job-item-salary-info"]').text().trim() || '';
      jobs.push({ title, location, company, type, workStyle, description, url, salary, website });
  });


  return jobs;

}

// async function getAdsFromIndeed(keyword: string, location: string, browser: Browser): Promise<IJob[]> {
//   const jobs: IJob[] = [];
//   const website = 'Indeed';
//   const baseUrl = 'https://uk.indeed.com';
//   const searchUrl = `${baseUrl}/jobs?q=${keyword}&l=${location}&from=searchOnHP`;

//   const page = await browser.newPage();
//   await page.goto(searchUrl, { waitUntil: 'networkidle2' });

//   const content = await page.content();
//   const $ = cheerio.load(content);


//   $('#mosaic-provider-jobcards ul > li').each((index, element) => {
//     const title = $(element).find('h2.jobTitle a').text().trim() || '';
//     const location = $(element).find('div[data-testid="text-location"]').text().trim() || '';
//     const company = $(element).find('span[data-testid="company-name"]').text().trim() || '';
//     const type = $(element).find('div.metadata').text().includes('Permanent') ? 'Permanent' : 
//                  $(element).find('div.metadata').text().includes('Contract') ? 'Contract' : '';
//     const workStyle = $(element).find('div[data-testid="text-location"]').text().includes('Hybrid') ? 'Hybrid' : 
//                       $(element).find('div[data-testid="text-location"]').text().includes('Remote') ? 'Remote' : 'Office';
//     const description = $(element).find('ul li').text().trim() || '';
//     const url = $(element).find('h2.jobTitle a').attr('href') || '';
//     const salary = $(element).find('div[data-testid="attribute_snippet_testid"]').text().trim() || '';

//     jobs.push({ title, location, company, type, workStyle, description, url, salary, website });
//   });

//   return jobs;
// }

async function getAdsFromReed(keyword: string, location: string, browser: Browser): Promise<IJob[]> {
  const jobs: IJob[] = [];
  const website = 'Reed';
  const baseUrl = 'https://www.reed.co.uk';
  const searchUrl = `${baseUrl}/jobs/${keyword}-jobs-in-${location}`;

  const page = await browser.newPage();
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  const content = await page.content();
  const $ = cheerio.load(content);

  $('article[data-qa="job-card"]').each((index, element) => {
    const title = $(element).find('h2.job-card_jobResultHeading__title__IQ8iT a').text().trim() || '';
    const location = $(element).find('li[data-qa="job-card-location"]').text().trim() || '';
    const company = $(element).find('div.job-card_jobResultHeading__postedBy__sK_25 a').text().trim() || '';
    const type = $(element).find('li.job-card_jobMetadata__item___QNud').text().includes('Contract') ? 'Contract' : 
                 $(element).find('li.job-card_jobMetadata__item___QNud').text().includes('Permanent') ? 'Permanent' : '';
    const workStyle = $(element).find('li[data-qa="job-card-location"]').text().includes('Hybrid') ? 'Hybrid' : 
                      $(element).find('li[data-qa="job-card-location"]').text().includes('Remote') ? 'Remote' : 'Office';
    const description = $(element).find('p.job-card_jobResultDescription__details___xS_G').text().trim() || '';
    const url = baseUrl + $(element).find('h2.job-card_jobResultHeading__title__IQ8iT a').attr('href') || '';
    const salary = $(element).find('li.job-card_jobMetadata__item___QNud').first().text().trim() || '';

    jobs.push({ title, location, company, type, workStyle, description, url, salary, website });
  });

  return jobs;
}