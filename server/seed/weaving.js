// Weaving seed data.
// NOTE: organisation links/contacts are believed correct but MUST be verified before launch.
export default {
  craft: {
    slug: 'weaving',
    name: 'Weaving',
    hindiName: 'Bunai',
    icon: '🧺',
    image: '',
    accent: 'mustard',
    tagline: 'Weave threads into timeless fabric',
    overview:
      'India has the largest handloom community in the world, from Banarasi silk to Pochampally ikat. Learn loom setup, pattern planning and finishing, and connect with weaver cooperatives and design buyers who pay fair prices.',
    whatYouLearn: [
      'Loom parts and setting the warp',
      'Plain, twill and pattern weaves',
      'Natural dyes and colour planning',
      'Ikat and jacquard basics',
      'Selling through co-ops and exhibitions',
    ],
    famousStyles: ['Banarasi', 'Pochampally Ikat', 'Kanjeevaram', 'Chanderi'],
    description:
      'Master the handloom, warp and weft, patterns and natural dyes. Create sarees, stoles, fabrics, rugs and baskets.',
  },

  roadmaps: {
    Beginner: [
      {
        title: 'Know Your Loom',
        description:
          'Learn the parts of a handloom - warp beam, heddles, reed, shuttle, treadles - and what each does. Try a small frame loom first.',
        skills: ['Loom parts', 'Weaving terms', 'Frame loom practice'],
        tools: ['Frame loom', 'Shuttle', 'Cotton yarn'],
        duration: '1 week',
      },
      {
        title: 'Yarn & Fibre Basics',
        description:
          'Understand cotton, silk, wool and blends, yarn counts and how to check yarn strength. Learn which yarn suits which product.',
        skills: ['Fibre types', 'Yarn count', 'Quality check'],
        tools: ['Yarn samples', 'Magnifying glass'],
        duration: '1 week',
      },
      {
        title: 'Warping & Setting Up',
        description:
          'Measure the warp, wind it, and thread it through heddles and reed (drafting and denting). Correct setup avoids most weaving problems.',
        skills: ['Measuring warp', 'Drafting', 'Denting', 'Tensioning'],
        tools: ['Warping board', 'Reed hook', 'Heddles'],
        duration: '2 weeks',
      },
      {
        title: 'Plain Weave',
        description:
          'Weave plain (tabby) cloth with straight edges and even beating. Make a simple stole or towel.',
        skills: ['Shuttle throwing', 'Even beating', 'Neat selvedges'],
        tools: ['Handloom', 'Shuttle', 'Bobbins'],
        duration: '3 weeks',
      },
      {
        title: 'Finishing Your Cloth',
        description: 'Cut off, tie fringes or hem, wash and press your fabric. Check for and fix weaving faults.',
        skills: ['Fringing', 'Hemming', 'Washing & pressing', 'Fault checking'],
        tools: ['Scissors', 'Needle', 'Iron'],
        duration: '1 week',
      },
    ],
    Intermediate: [
      {
        title: 'Twill & Pattern Weaves',
        description: 'Weave twill, herringbone and diamond patterns using different treadling orders.',
        skills: ['Twill', 'Herringbone', 'Reading weave drafts'],
        tools: ['4-shaft loom', 'Graph paper'],
        duration: '3 weeks',
      },
      {
        title: 'Natural Dyeing',
        description:
          'Dye yarn with indigo, madder, turmeric, pomegranate and other natural dyes. Learn mordants for fast, even colour.',
        skills: ['Mordanting', 'Natural dye baths', 'Colour fastness testing'],
        tools: ['Dye pots', 'Natural dyes', 'Alum', 'Gloves'],
        duration: '3 weeks',
      },
      {
        title: 'Colour & Stripe Planning',
        description: 'Plan colour combinations, stripes and checks on paper before weaving, to reduce waste.',
        skills: ['Colour theory', 'Stripe & check design', 'Yarn calculation'],
        tools: ['Graph paper', 'Colour pencils', 'Yarn wraps'],
        duration: '2 weeks',
      },
      {
        title: 'Extra-Weft Motifs',
        description: 'Add buti and border motifs with extra weft, the technique behind many traditional sarees.',
        skills: ['Extra-weft', 'Motif placement', 'Border design'],
        tools: ['Handloom', 'Extra shuttles', 'Pick-up stick'],
        duration: '4 weeks',
      },
      {
        title: 'Costing a Saree or Stole',
        description:
          'Calculate yarn, dye, loom time and labour per piece and set a fair price. Keep records for scheme applications.',
        skills: ['Costing', 'Record keeping', 'Pricing'],
        tools: ['Cost sheet', 'Calculator'],
        duration: '1 week',
      },
    ],
    Advanced: [
      {
        title: 'Ikat (Tie-Resist) Basics',
        description:
          'Tie and dye yarn before weaving to create ikat patterns, as in Pochampally, Patola and Odisha ikat traditions.',
        skills: ['Yarn tying', 'Resist dyeing', 'Pattern alignment'],
        tools: ['Tying frame', 'Rubber/thread for tying', 'Dye pots'],
        duration: '6 weeks',
      },
      {
        title: 'Jacquard & Dobby',
        description:
          'Understand dobby and jacquard attachments to weave complex patterns, and how punched or digital designs drive them.',
        skills: ['Dobby setup', 'Jacquard basics', 'Card/graph design'],
        tools: ['Dobby/jacquard loom', 'Design software (optional)'],
        duration: '5 weeks',
      },
      {
        title: 'Design for Modern Buyers',
        description:
          'Create lighter fabrics, contemporary colours and new products - stoles, home linen, dress material - while keeping traditional identity.',
        skills: ['Trend research', 'Product diversification', 'Sampling'],
        tools: ['Mood boards', 'Sample swatches'],
        duration: '4 weeks',
      },
      {
        title: 'Certification & Schemes',
        description:
          'Learn about the Handloom Mark, India Handloom Brand and Geographical Indication (GI) tags, and how certification builds buyer trust.',
        skills: ['Certification process', 'Scheme applications', 'Documentation'],
        tools: ['Weaver ID / documents', 'Bank account'],
        duration: '2 weeks',
      },
      {
        title: 'Sell Through Co-ops & Exhibitions',
        description:
          'Work with weaver cooperatives, handloom expos, designers and online stores. Build long-term buyer relationships.',
        skills: ['Exhibition selling', 'Designer collaboration', 'Online listings'],
        tools: ['Catalogue', 'Visiting cards', 'Marketplaces'],
        duration: 'Ongoing',
      },
    ],
  },

  opportunities: [
    {
      name: 'Weavers’ Service Centres - Office of the DC (Handlooms)',
      type: 'Workshop',
      location: 'New Delhi, Delhi (centres across India)',
      description:
        'Ministry of Textiles office whose Weavers’ Service Centres offer design, dyeing and skill upgradation support to handloom weavers.',
      contact: 'Nearest Weavers’ Service Centre - details on website',
      link: 'https://handlooms.nic.in',
    },
    {
      name: 'NIFT Craft Cluster Initiative',
      type: 'Workshop',
      location: 'New Delhi, Delhi (campuses across India)',
      description:
        'National Institute of Fashion Technology students and faculty work with craft clusters on design and skill workshops.',
      contact: 'Contact your nearest NIFT campus',
      link: 'https://www.nift.ac.in',
    },
    {
      name: 'Khamir',
      type: 'NGO',
      location: 'Kukma, Bhuj, Gujarat',
      description:
        'Supports Kutch weavers, including work with indigenous Kala cotton, through design, skill building and market linkages.',
      contact: 'Contact details on website',
      link: 'https://www.khamir.org',
    },
    {
      name: 'Handloom Export Promotion Council (HEPC)',
      type: 'NGO',
      location: 'Chennai, Tamil Nadu',
      description: 'Promotes handloom exports through international fairs and buyer-seller meets.',
      contact: 'Contact details on website',
      link: 'https://www.hepcindia.com',
    },
    {
      name: 'Dastkar',
      type: 'NGO',
      location: 'New Delhi, Delhi',
      description: 'Organises craft bazaars where weavers can sell directly to customers across India.',
      contact: 'Contact details on website',
      link: 'https://www.dastkar.org',
    },
  ],

  trends: {
    demandLevel: 'High',
    priceRange: { min: 400, max: 40000, currency: 'INR' },
    trendingSkills: ['Natural dyeing', 'Lightweight weaves', 'Ikat', 'Pastel & earthy palettes'],
    trendingProducts: [
      { name: 'Handloom sarees', emoji: '🥻', priceRange: { min: 2500, max: 40000 }, demandScore: 80 },
      { name: 'Cotton stoles', emoji: '🧣', priceRange: { min: 500, max: 2000 }, demandScore: 72 },
      { name: 'Woven baskets', emoji: '🧺', priceRange: { min: 400, max: 2500 }, demandScore: 64 },
      { name: 'Dress material', emoji: '👗', priceRange: { min: 800, max: 4000 }, demandScore: 60 },
      { name: 'Dhurries & rugs', emoji: '🟫', priceRange: { min: 1000, max: 12000 }, demandScore: 52 },
    ],
    insights: [
      'Wedding season (roughly November to February) increases demand for silk handloom sarees.',
      'Young buyers like stoles and scarves in pastel and natural colours.',
      'Handloom Mark or GI-tagged products build trust and can get better prices.',
      'Show the weaver and the loom in product photos - buyers value the story behind handmade fabric.',
    ],
  },
};
