import * as fs from 'fs';
import * as path from 'path';

// Helper to extract an array literal from a file using block matching
function extractArray(fileContent: string, varName: string): any[] {
  const marker = `const ${varName} = [`;
  const startIdx = fileContent.indexOf(marker);
  if (startIdx === -1) {
    // Try let or different spacing
    const altMarker = `const ${varName}:`;
    const altStart = fileContent.indexOf(altMarker);
    if (altStart === -1) {
      throw new Error(`Could not find start of variable ${varName}`);
    }
    // Find the opening bracket after the type definition
    const bracketIdx = fileContent.indexOf('[', altStart);
    return parseFromBracket(fileContent, bracketIdx);
  }
  
  const bracketIdx = startIdx + marker.length - 1;
  return parseFromBracket(fileContent, bracketIdx);
}

function parseFromBracket(fileContent: string, bracketIdx: number): any[] {
  let depth = 1;
  let i = bracketIdx + 1;
  
  // Track state (in strings, in comments) to ignore brackets inside them
  let inString: string | null = null;
  let inComment = false;
  
  while (i < fileContent.length && depth > 0) {
    const char = fileContent[i];
    const nextChar = fileContent[i + 1];
    
    if (inComment) {
      if (char === '*' && nextChar === '/') {
        inComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    
    if (char === '/' && nextChar === '*') {
      inComment = true;
      i += 2;
      continue;
    }
    
    if (char === '/' && nextChar === '/') {
      // Line comment, skip to next line
      const nextLineIdx = fileContent.indexOf('\n', i);
      i = nextLineIdx === -1 ? fileContent.length : nextLineIdx + 1;
      continue;
    }

    if (inString) {
      if (char === inString && fileContent[i - 1] !== '\\') {
        inString = null;
      }
    } else {
      if (char === "'" || char === '"' || char === '`') {
        inString = char;
      } else if (char === '[') {
        depth++;
      } else if (char === ']') {
        depth--;
      }
    }
    i++;
  }
  
  const arrayLiteral = fileContent.substring(bracketIdx, i);
  // Evaluate the array literal. We wrap it in parentheses to make it a valid statement
  try {
    // We run eval in a clean scope, but we need to define some standard wrappers/icons/types
    // if there are any imports or type assertions (like "as const" or "as CalendarEvent")
    const cleanedLiteral = arrayLiteral
      .replace(/\s+as\s+\w+(\[\])?/g, '') // remove "as const", "as CalendarEvent", etc.
      .replace(/Exclude<[^>]+>/g, 'any')
      .replace(/Record<[^>]+>/g, 'any');
      
    const fn = new Function(`return ${cleanedLiteral};`);
    return fn();
  } catch (err: any) {
    console.error(`Failed to evaluate array literal for: ${arrayLiteral.substring(0, 100)}...`, err);
    throw err;
  }
}

function run() {
  const root = path.join(__dirname, '..');
  
  const aboutPath = path.join(root, 'app/about/page.tsx');
  const connectPath = path.join(root, 'app/connect/ConnectClient.tsx');
  const historyPath = path.join(root, 'app/history/HistoryClient.tsx');
  const mapPath = path.join(root, 'app/history/WorldMapSection.tsx');
  const visitPath = path.join(root, 'app/visit/VisitClient.tsx');
  const givePath = path.join(root, 'app/give/GiveClient.tsx');
  const resourcesPath = path.join(root, 'app/resources/ResourcesClient.tsx');
  const videosPath = path.join(root, 'app/media/videos/VideosClient.tsx');

  const sanityDocs: any[] = [];

  // 1. FAQs (Connect and Visit)
  if (fs.existsSync(connectPath)) {
    const connectContent = fs.readFileSync(connectPath, 'utf8');
    const connectFaqs = extractArray(connectContent, 'faqs');
    connectFaqs.forEach((faq, index) => {
      sanityDocs.push({
        _id: `faq-connect-${index}`,
        _type: 'faq',
        question: faq.q,
        answer: faq.a,
        category: 'connect',
      });
    });

    const ministries = extractArray(connectContent, 'ministries');
    ministries.forEach((m) => {
      sanityDocs.push({
        _id: `ministry-${m.id}`,
        _type: 'ministry',
        name: m.name,
        slug: { _type: 'slug', current: m.id },
        tagline: m.tagline,
        icon: m.icon,
        gradient: m.gradient || '',
        description: m.description,
      });
    });
  }

  if (fs.existsSync(visitPath)) {
    const visitContent = fs.readFileSync(visitPath, 'utf8');
    const visitFaqs = extractArray(visitContent, 'FAQS');
    visitFaqs.forEach((faq, index) => {
      sanityDocs.push({
        _id: `faq-visit-${index}`,
        _type: 'faq',
        question: faq.q,
        answer: faq.a,
        category: 'visit',
      });
    });
  }

  // 2. Milestones
  if (fs.existsSync(historyPath)) {
    const historyContent = fs.readFileSync(historyPath, 'utf8');
    const milestones = extractArray(historyContent, 'MILESTONES');
    milestones.forEach((m, index) => {
      const milestoneId = `milestone-${m.year}-${index}`;
      sanityDocs.push({
        _id: milestoneId,
        _type: 'milestone',
        year: m.year,
        era: m.era,
        tag: m.tag || '',
        headline: m.headline,
        body: m.body,
        detail: m.detail || '',
      });
    });
  }

  // 3. Alumni Pins
  if (fs.existsSync(mapPath)) {
    const mapContent = fs.readFileSync(mapPath, 'utf8');
    const countryNodes = extractArray(mapContent, 'COUNTRY_NODES');
    countryNodes.forEach((node, index) => {
      const pinId = `alumnipin-${node.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      sanityDocs.push({
        _id: pinId,
        _type: 'alumniPin',
        name: `${node.name} Alumni`,
        locationName: node.name,
        lat: node.lat,
        lng: node.lng,
        year: 2026, // Fallback year
        details: `SDAECV Alumni serving in ${node.name}`,
      });
    });
  }

  // 4. Resource Links
  if (fs.existsSync(resourcesPath)) {
    const resourcesContent = fs.readFileSync(resourcesPath, 'utf8');
    const resources = extractArray(resourcesContent, 'RESOURCES');
    resources.forEach((r, index) => {
      const resourceId = `resource-${r.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      sanityDocs.push({
        _id: resourceId,
        _type: 'resourceLink',
        title: r.title,
        description: r.description,
        href: r.href,
        category: r.category,
        icon: r.icon,
        ageGroup: r.ageGroup || '',
        tag: r.tag || '',
      });
    });
  }

  // 5. Sermon Videos
  if (fs.existsSync(videosPath)) {
    const videosContent = fs.readFileSync(videosPath, 'utf8');
    const videos = extractArray(videosContent, 'VIDEOS_DATA');
    videos.forEach((v) => {
      sanityDocs.push({
        _id: `sermonvideo-${v.id}`,
        _type: 'sermonVideo',
        youtubeId: v.youtubeId,
        title: v.title,
        description: v.description,
        category: v.category,
        duration: v.duration,
        date: v.date,
      });
    });
  }

  // 6. Giving Settings (UPI & Bank details)
  if (fs.existsSync(givePath)) {
    const giveContent = fs.readFileSync(givePath, 'utf8');
    const stewardshipQAs = extractArray(giveContent, 'stewardshipQAs');
    
    // Create givingSettings document
    sanityDocs.push({
      _id: 'givingSettings',
      _type: 'givingSettings',
      memoryVerseQuote: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
      memoryVerseRef: '2 Corinthians 9:7',
      upiId: 'seventhdayadv316@sbi',
      bankDetails: {
        accountName: 'SDA Church',
        accountNumber: '10507878497',
        bankName: 'State Bank of India',
        branch: 'Bagayam (Vellore), Christian Medical College Campus',
        ifscCode: 'SBIN0002203',
        cifNo: '80398219137',
      },
      stewardshipQAs: stewardshipQAs.map((qa) => ({
        question: qa.question,
        answer: qa.answer,
        biblicalRef: qa.biblicalRef,
        icon: qa.icon,
      })),
    });
  }

  // 7. HomePage Settings (Hero, Welcome section & service hours)
  if (fs.existsSync(visitPath)) {
    const visitContent = fs.readFileSync(visitPath, 'utf8');
    const schedule = extractArray(visitContent, 'SCHEDULE');
    
    sanityDocs.push({
      _id: 'homePageSettings',
      _type: 'homePageSettings',
      heroHeadline: 'Events & Gatherings.',
      heroSubheadline: 'Join us in fellowship and community. Find your place at SDAECV.',
      heroCtaText: 'View Calendar',
      heroCtaUrl: '#events-calendar',
      welcomeTitle: 'Known by Love.',
      welcomeSubtitle: 'Worship with us every Sabbath morning.',
      welcomeDescription: 'Welcome to the Seventh-day Adventist English Church in Vellore. We are a community of believers dedicated to worship, service, and fellowship. Join us as we grow together in faith and love.',
      serviceTimes: schedule.map((s) => ({
        label: s.label,
        time: s.time,
        detail: s.detail,
      })),
    });
  }

  const outputPath = path.join(root, 'data/all-website-documents.json');
  fs.writeFileSync(outputPath, JSON.stringify(sanityDocs, null, 2), 'utf8');
  console.log(`Successfully extracted ${sanityDocs.length} documents and saved to ${outputPath}`);
}

run();
