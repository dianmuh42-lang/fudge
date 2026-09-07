/* ============================================================
   FUDGE JARCHEH — CONTENT MODELS
   Single source of truth for every repeatable content type.
   Plain JS (not fetched JSON) so the site runs from file://
   with no server and no build step. Every model below maps
   1:1 to a CMS collection when one is connected later.
   ============================================================ */

window.FJ = window.FJ || {};

/* ---------- Site ------------------------------------------- */
window.FJ.site = {
  name: 'Fudge Jarcheh',
  role: 'Entrepren-Artist',
  parent: 'Frequency Digital Group',
  motto: 'People Are The Frequency.',
  origin: 'https://fudgejarcheh.com',
  /* Set these once and every mailto / contact route follows. */
  contactEmail: 'hello@fudgejarcheh.com',
  nav: [
    { label: 'Home',     href: 'index.html',          root: 'index.html' },
    { label: 'About',    href: 'pages/about.html',    root: 'about.html' },
    { label: 'Ventures', href: 'pages/ventures.html', root: 'ventures.html' },
    { label: 'Music',    href: 'pages/music.html',    root: 'music.html' },
    { label: 'Journal',  href: 'pages/journal.html',  root: 'journal.html' },
    { label: 'Press',    href: 'pages/press.html',    root: 'press.html' },
    { label: 'Contact',  href: 'pages/contact.html',  root: 'contact.html' }
  ],
  /* url: null renders an intentional "soon" state — never a dead link. */
  social: [
    { label: 'LinkedIn',  url: null },
    { label: 'Instagram', url: null },
    { label: 'YouTube',   url: null },
    { label: 'Spotify',   url: null }
  ]
};

/* ---------- The Worlds (section 08) ------------------------- */
window.FJ.worlds = [
  {
    n: '01', title: 'Entrepreneur',
    body: 'Business, companies and ventures. Building organisations that can outlive the idea that started them.',
    cta: 'Explore', href: 'pages/ventures.html',
    image: 'assets/images/world-entrepreneur.svg',
    alt: 'Low-lit architectural interior in deep blue with a single warm light source, representing the entrepreneur world.'
  },
  {
    n: '02', title: 'Technologist',
    body: 'AI, automation, products and experiments. Systems designed around people rather than around the technology.',
    cta: 'Explore', href: 'pages/ventures.html',
    image: 'assets/images/world-technologist.svg',
    alt: 'Abstract data lattice rendered in cool blue light, representing the technologist world.'
  },
  {
    n: '03', title: 'Artist',
    body: 'Music, Fudge & The Frequency, and creative work. Where the philosophy behind everything else began.',
    cta: 'Listen', href: 'pages/music.html',
    image: 'assets/images/world-artist.svg',
    alt: 'Warm amber stage light cutting through darkness, representing the artist world.'
  },
  {
    n: '04', title: 'Thinker / Creator',
    body: 'Ideas, observations and writing. Thinking in public about creativity, business and what connects them.',
    cta: 'Read', href: 'pages/journal.html',
    image: 'assets/images/world-thinker.svg',
    alt: 'Soft grey editorial gradient with a single horizon line, representing the thinker world.'
  }
];

/* ---------- Ventures --------------------------------------- */
window.FJ.ventures = [
  {
    id: 'review-revolution',
    name: 'Review Revolution',
    parentLabel: 'A Frequency Digital Group Company',
    line: 'Reputation. Intelligence. Growth.',
    summary: 'An AI-powered Reputation Growth Platform designed to help businesses actively build, understand and grow their reputation.',
    body: 'Most businesses treat reputation as something that happens to them. Review Revolution treats it as something they can build. The platform brings review activity, sentiment and growth signals into one intelligence layer, so a business can see what its customers actually think and act on it.',
    status: 'Active',
    category: 'Technology / SaaS / AI',
    founder: 'Fudge Jarcheh',
    url: null,
    image: 'assets/images/venture-review-revolution.svg',
    alt: 'Dark product still of a reputation intelligence interface with floating translucent data layers.'
  }
];

window.FJ.building = [
  { name: 'Frequency Digital Group', note: 'Parent company / venture ecosystem.', status: 'Operating' },
  { name: 'Review Revolution',       note: 'Reputation Growth Platform.',         status: 'Active' },
  { name: 'Fudge & The Frequency',   note: 'Music and creative project.',          status: 'Ongoing' },
  { name: 'Experiments',             note: 'AI, technology and future projects.',  status: 'In progress' }
];

/* ---------- The Evolution (section 07) ---------------------- */
window.FJ.evolution = [
  {
    stage: 'Stage 01', title: 'Fudge & The Frequency', kicker: 'Music',
    body: 'Where the idea began. Songs written to reach a person, not an audience. The first proof that resonance is the thing worth chasing.'
  },
  {
    stage: 'Stage 02', title: 'The Frequency', kicker: 'Philosophy',
    body: 'People create meaning through connection and resonance. What worked in a song turned out to be true everywhere else.'
  },
  {
    stage: 'Stage 03', title: 'Frequency Digital Group', kicker: 'Enterprise',
    body: 'The philosophy evolves into a global ecosystem for building companies and ideas. Structure in service of the same intent.'
  },
  {
    stage: 'Stage 04', title: 'The Future', kicker: 'Technology',
    body: 'AI. Companies. Music. Media. Ideas. Different outputs, one operating principle. All running on the same frequency.'
  }
];

/* ---------- Manifesto (section 12) -------------------------- */
window.FJ.manifesto = [
  'A song without a listener is just sound.',
  'Technology without people is just code.',
  'A company without customers is just an idea.',
  'People give things meaning.',
  'People are the frequency.'
];

/* ---------- Journal ----------------------------------------
   Editorial seed content written from the brand's own
   positioning. `date` is metadata — set it per publication.
   ------------------------------------------------------------ */
window.FJ.journal = [
  {
    slug: 'people-are-the-frequency',
    category: 'Creativity',
    title: 'People Are The Frequency',
    date: '2026-02-18',
    readTime: '4 min',
    excerpt: 'A song only becomes music when it reaches someone. Everything I build starts from that.',
    image: 'assets/images/journal-frequency.svg',
    alt: 'Near-black field with a single warm horizontal light band.',
    body: [
      'A song is a technical object before it is anything else. Frequencies, intervals, decisions about where silence goes. On its own it is sound moving through air.',
      'It becomes music when it reaches someone. That is the moment the work changes hands. The listener brings a person, a place, a night, a version of themselves, and the song becomes about that instead of about the notes.',
      'I spent years thinking my job was the first part. Get the sound right. Get the arrangement right. The craft matters, and I still care about it. But the craft was never the point. The point was the transfer.',
      'That idea did not stay in music. Once you have seen it clearly, you notice it everywhere.',
      'A product is a set of technical decisions until someone uses it to do something they cared about. A company is a legal structure until customers give it a reason to exist. A piece of technology is code until it changes what a person can do with their day.',
      'None of those things carry meaning on their own. People supply it. That is not a soft observation about being nice to customers. It is a structural fact about how value works, and it should change how you build.',
      'It changes what you measure. If meaning arrives with the person, then reach without resonance is not a result. Attention is easy to buy and tells you almost nothing.',
      'It changes what you make. You stop optimising the object and start designing the moment it lands. Those are different problems, and the second one is harder.',
      'And it changes what you are willing to ship. Anything that treats people as a metric is not going to resonate, because resonance is a two-way property. Something has to be there for the other side to meet.',
      'The philosophy is not complicated. Almost everyone has a piece of music connected to a moment in their life. That song did not put the moment there. The person did.',
      'People are the frequency. Everything else is equipment.'
    ]
  },
  {
    slug: 'creativity-and-business-are-not-different-worlds',
    category: 'Entrepreneurship',
    title: 'Creativity And Business Are Not Different Worlds',
    date: '2026-01-27',
    readTime: '5 min',
    excerpt: 'The separation is a habit, not a truth. Both disciplines ask the same question in different clothing.',
    image: 'assets/images/journal-worlds.svg',
    alt: 'Two overlapping planes of light meeting on a dark field.',
    body: [
      'People ask which one I am. The assumption behind the question is that creativity and entrepreneurship are separate territories, and that spending time in one costs you credibility in the other.',
      'I have never found that to be true in practice. The separation is a habit we inherited, not something the work supports.',
      'Both disciplines start from the same place: something does not exist, and you think it should. Both require you to hold a clear picture of a thing nobody else can see yet, and to keep that picture intact while reality argues with it.',
      'Both are mostly editing. A first draft and a first version of a product have the same problem — too much of everything, no point of view. The skill is knowing what to remove.',
      'Both are judged by whether they land. A record that nobody plays and a product that nobody uses have failed in exactly the same way, and for exactly the same reason.',
      'The differences are real but smaller than people think. Business has more constraints you cannot negotiate with — capital, timing, regulation, other people\'s incentives. Art has fewer external constraints and therefore demands more internal ones. That is a difference of terrain, not of thinking.',
      'What actually transfers is taste. Taste is the ability to tell the difference between something that is finished and something that has merely stopped. It is the most underrated business skill I know, and it is trained almost exclusively by creative work.',
      'The second thing that transfers is tolerance for the middle. Every creative project has a long stretch where the idea is no longer exciting and not yet good. Most people quit there. Building a company is that stretch, extended over years, with payroll.',
      'So I stopped choosing. Entrepren-Artist is not a clever way of saying I do two jobs. It is a description of one method applied to different material.',
      'The method is simple to state and hard to hold. Start from what should exist. Build it with taste. Judge it by whether it reaches anyone.',
      'Everything I work on — companies, technology, music — runs on that. The output changes. The question does not.'
    ]
  },
  {
    slug: 'intelligence-without-intention',
    category: 'AI',
    title: 'Intelligence Without Intention',
    date: '2025-12-09',
    readTime: '4 min',
    excerpt: 'Capability is arriving faster than judgement about what to point it at. That gap is the real design problem.',
    image: 'assets/images/journal-intelligence.svg',
    alt: 'Cool blue lattice of light dissolving into darkness.',
    body: [
      'The interesting constraint in AI is no longer capability. Capability is arriving on a schedule that makes most product roadmaps look conservative.',
      'The constraint is intention. Knowing what the thing is for, who it serves, and what it should refuse to do.',
      'That gap is where most AI products fail, and the failure is easy to recognise. The technology works. The demo is convincing. Nobody changes their behaviour. The tool was built because it could be built, not because someone needed it.',
      'I think about this a lot in the context of reputation, because it is a field where the temptation to automate the wrong thing is enormous. You can generate reviews. You can synthesise sentiment. You can manufacture the appearance of trust at scale, cheaply, today.',
      'And it is worthless, because trust is not a metric you can produce. It is a conclusion other people reach. The moment you fabricate the signal, you have destroyed the thing the signal was pointing at.',
      'So the design question is not what can this model do. It is what should be automated here, and what must stay human because the value lives in it being human.',
      'My working rule is that AI should remove the work that stands between a person and their intent, and never the intent itself. Summarise the noise. Surface the pattern. Do the tedious reconciliation nobody wanted to do. Leave the judgement, the taste and the relationship where they belong.',
      'That rule is restrictive, and it rules out a lot of things that would be easy to build. It also seems to be the difference between a tool people keep and a tool people try.',
      'There is a version of the next decade where intelligence becomes abundant and meaning becomes scarce, because we automated the parts that carried it. That is an avoidable outcome, but it is not automatic.',
      'It is avoided one product decision at a time, by people willing to leave capability on the table.'
    ]
  }
];

/* ---------- Press ------------------------------------------
   Deliberately empty. No coverage is invented — when real
   items exist, add them here and the page fills itself.
   Shape: { outlet, title, type, date, url, logo }
   ------------------------------------------------------------ */
window.FJ.press = [];

window.FJ.pressSections = [
  { id: 'featured',  title: 'Featured In',      note: 'Publication features and profiles.' },
  { id: 'coverage',  title: 'Latest Coverage',  note: 'Recent articles and mentions.' },
  { id: 'interviews',title: 'Interviews',       note: 'Long-form conversations.' },
  { id: 'podcasts',  title: 'Podcasts',         note: 'Audio appearances and guest episodes.' },
  { id: 'company',   title: 'Company News',     note: 'Frequency Digital Group and venture announcements.' },
  { id: 'music',     title: 'Music & Creative', note: 'Coverage of Fudge & The Frequency.' }
];

/* ---------- Music -------------------------------------------
   Releases stay empty until real ones are supplied — no
   invented titles, dates, collaborators or streaming links.
   Shape: { title, type, year, url, embed, artwork }
   ------------------------------------------------------------ */
window.FJ.music = {
  project: 'Fudge & The Frequency',
  line: 'People Are The Frequency.',
  story: [
    'Fudge & The Frequency started as music and became the way everything else is understood.',
    'The idea was never that a song is a product. It is a transfer. Something written alone reaches someone alone, and in that moment it stops belonging to the person who wrote it.',
    'That transfer is what the name refers to. The Frequency is not a sound. It is the thing that happens between people when something resonates.',
    'Everything built since — companies, technology, ideas — is an attempt to reproduce that effect with different equipment.'
  ],
  releases: [],
  live: []
};

/* ---------- About ------------------------------------------- */
window.FJ.about = {
  sections: [
    {
      id: 'story', label: 'The Story', title: 'It started with music.',
      body: [
        'Fudge Jarcheh began in music, as Fudge & The Frequency. The work was small and direct: write something, put it in front of people, find out whether it reached them.',
        'That feedback loop turned out to be the whole education. It taught taste, editing, and the difference between something that is finished and something that has merely stopped.',
        'The material changed. The method did not.'
      ]
    },
    {
      id: 'philosophy', label: 'The Philosophy', title: 'People are the frequency.',
      body: [
        'A song without a listener is just sound. A company without customers is just an idea. Technology without people is just code.',
        'Meaning is not built into the object. It arrives with the person who receives it. Everything under Frequency Digital Group is designed around that fact rather than around the technology being used.'
      ]
    },
    {
      id: 'journey', label: 'The Journey', title: 'From a project to an ecosystem.',
      body: [
        'The Frequency moved from a music project to a philosophy, and from a philosophy to an enterprise.',
        'Frequency Digital Group is the structure that makes the philosophy operational — a global parent entity for companies, ventures, technology and creative projects that share one intent.'
      ]
    },
    {
      id: 'entrepreneur', label: 'Entrepreneur', title: 'Building things that should exist.',
      body: [
        'The entrepreneurial work is company building: creating, developing and growing ideas that resonate with people.',
        'Review Revolution is the first venture operating publicly under the group — an AI-powered Reputation Growth Platform for businesses that want to build reputation deliberately rather than hope for it.'
      ]
    },
    {
      id: 'technology', label: 'Technology', title: 'Intelligence pointed at something.',
      body: [
        'AI and automation are treated as instruments, not as the product. The design rule is consistent: remove the work that stands between a person and their intent, and leave the judgement where it belongs.',
        'Experiments run continuously. Most stay internal. The ones that hold up become ventures.'
      ]
    },
    {
      id: 'artist', label: 'Artist', title: 'The work that explains the rest.',
      body: [
        'Fudge & The Frequency remains active as a creative project rather than a closed chapter.',
        'It is where the operating principle was found, and it stays useful for the same reason it always was: it is the fastest way to test whether something resonates.'
      ]
    },
    {
      id: 'today', label: 'Today', title: 'Companies. Technology. Music. Ideas.',
      body: [
        'Current focus sits across Frequency Digital Group, Review Revolution, Fudge & The Frequency, and ongoing work in AI and technology.',
        'The through line is unchanged. Build things that reach people.'
      ]
    }
  ],
  officialBio: 'Fudge Jarcheh is an Entrepren-Artist working across entrepreneurship, technology, AI, music and creative projects. He is the founder of Frequency Digital Group, the global parent entity behind his portfolio of companies, ventures and creative work, and of Review Revolution, an AI-powered Reputation Growth Platform. His music project, Fudge & The Frequency, is where the philosophy behind the wider ecosystem began: people are the frequency, and meaning arrives with the person who receives the work.'
};

/* ---------- Contact ----------------------------------------- */
window.FJ.contactReasons = [
  'Business', 'Press', 'Media', 'Music', 'Collaborations', 'General'
];
