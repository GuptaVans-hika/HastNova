// Pottery & Ceramics seed data.
// NOTE: organisation links/contacts are believed correct but MUST be verified before launch.
export default {
  craft: {
    slug: 'pottery',
    name: 'Pottery & Ceramics',
    hindiName: 'Mitti ka Kaam',
    icon: '🏺',
    image: '',
    accent: 'terracotta',
    tagline: 'Shape clay into beautiful, useful art',
    overview:
      'Pottery is one of India’s oldest crafts, from Khurja blue pottery to Manipur’s Longpi black stoneware. Today, handmade tableware, planters and home decor are in high demand in cities and online. This course takes you from centring your first lump of clay to running your own small studio brand.',
    whatYouLearn: [
      'Clay preparation and wedging',
      'Wheel throwing and hand-building',
      'Glazing, colours and safe food-grade finishes',
      'Kiln firing and fixing common defects',
      'Pricing, photos and selling online',
    ],
    famousStyles: ['Khurja Pottery', 'Blue Pottery of Jaipur', 'Longpi Pottery', 'Terracotta of Bankura'],
    description:
      'Learn wheel throwing, hand-building, glazing and firing. Make diyas, kulhads, planters and dinnerware that customers love.',
  },

  roadmaps: {
    Beginner: [
      {
        title: 'Know Your Clay',
        description:
          'Understand earthenware, stoneware and local terracotta clay. Learn to store clay so it stays moist and to wedge it to remove air bubbles that crack pots in the kiln.',
        skills: ['Clay types', 'Wedging', 'Keeping clay moist'],
        tools: ['Clay', 'Wedging table', 'Wire cutter', 'Plastic sheets'],
        duration: '1 week',
      },
      {
        title: 'Hand-Building Basics',
        description:
          'Make simple pieces with pinch, coil and slab methods - diyas, small bowls and planters. These sell well and need no wheel.',
        skills: ['Pinch pots', 'Coil building', 'Slab work', 'Joining with slip'],
        tools: ['Rolling pin', 'Needle tool', 'Wooden ribs', 'Sponge'],
        duration: '2 weeks',
      },
      {
        title: 'Centring on the Wheel',
        description:
          'Sit correctly, brace your arms and centre the clay on the wheel. Practise coning up and down until the clay runs true without wobbling.',
        skills: ['Body posture', 'Coning', 'Centring'],
        tools: ['Potter’s wheel (electric or hand)', 'Water bowl', 'Sponge'],
        duration: '2 weeks',
      },
      {
        title: 'Throw Your First Cup or Kulhad',
        description:
          'Open the clay, pull up even walls and shape a simple cup. Cut finished pieces in half to check wall thickness and improve.',
        skills: ['Opening', 'Pulling walls', 'Even thickness'],
        tools: ['Potter’s wheel', 'Needle tool', 'Wooden rib', 'Cut-off wire'],
        duration: '3 weeks',
      },
      {
        title: 'Drying & Bisque Firing',
        description:
          'Dry pieces slowly under plastic to avoid cracks. Learn to load a kiln and do your first bisque firing safely, in your own or a shared community kiln.',
        skills: ['Slow drying', 'Kiln loading', 'Bisque firing', 'Kiln safety'],
        tools: ['Drying rack', 'Kiln (shared/community)', 'Heat-proof gloves'],
        duration: '1 week',
      },
    ],
    Intermediate: [
      {
        title: 'Trimming & Foot Rings',
        description:
          'Trim leather-hard pots on the wheel to remove extra weight and add neat foot rings - this makes pieces look professional.',
        skills: ['Leather-hard timing', 'Trimming', 'Foot rings'],
        tools: ['Trimming tools', 'Potter’s wheel', 'Chuck'],
        duration: '2 weeks',
      },
      {
        title: 'Bigger Forms & Matching Sets',
        description:
          'Throw taller vases, wide bowls and plates. Use calipers and weighed clay balls to make matching sets of 4-6, which shops and cafés prefer.',
        skills: ['Tall forms', 'Wide plates', 'Weighing clay', 'Repeatability'],
        tools: ['Potter’s wheel', 'Calipers', 'Bats', 'Weighing scale'],
        duration: '4 weeks',
      },
      {
        title: 'Handles, Spouts & Lids',
        description: 'Pull and attach handles to mugs, make spouts for teapots and fit lids for jars and handis.',
        skills: ['Pulling handles', 'Scoring & slipping', 'Lid fitting'],
        tools: ['Slip', 'Scoring tool', 'Calipers'],
        duration: '3 weeks',
      },
      {
        title: 'Glazing Safely',
        description:
          'Mix and apply glazes by dipping, pouring and brushing. Use only lead-free, food-safe glazes for anything people eat or drink from, and wear a mask when handling dry glaze powder.',
        skills: ['Glaze mixing', 'Dipping & brushing', 'Food safety'],
        tools: ['Glazes', 'Brushes', 'Sieve', 'Dust mask & gloves'],
        duration: '3 weeks',
      },
      {
        title: 'Surface Decoration',
        description:
          'Add carving, sgraffito, stamping and slip painting. Take inspiration from Indian motifs like paisley, lotus and block-print borders.',
        skills: ['Sgraffito', 'Stamping', 'Slip trailing', 'Motif design'],
        tools: ['Carving tools', 'Clay stamps', 'Slip trailer'],
        duration: '2 weeks',
      },
      {
        title: 'Costing Your Work',
        description:
          'Work out the real cost of each piece - clay, glaze, firing fuel or electricity, breakage and your time - and set a price with fair profit.',
        skills: ['Cost calculation', 'Breakage allowance', 'Fair pricing'],
        tools: ['Notebook or cost sheet', 'Calculator'],
        duration: '1 week',
      },
    ],
    Advanced: [
      {
        title: 'Kiln Mastery',
        description:
          'Run glaze firings with planned schedules, read pyrometric cones, and fix defects like crawling, pinholes and crazing.',
        skills: ['Firing schedules', 'Cone reading', 'Defect fixing'],
        tools: ['Electric or gas kiln', 'Pyrometer', 'Pyrometric cones'],
        duration: '4 weeks',
      },
      {
        title: 'Traditional Styles, Your Way',
        description:
          'Study a regional tradition - Khurja, Jaipur blue pottery, Longpi black pottery or Bankura terracotta - and create pieces with your own signature twist.',
        skills: ['Style research', 'Traditional techniques', 'Signature design'],
        tools: ['Reference books', 'Special clays', 'Mentor or master potter'],
        duration: '6 weeks',
      },
      {
        title: 'Design a Product Line',
        description:
          'Create a collection of 8-10 matching products around one theme with consistent size, colour and quality, ready for shops and exhibitions.',
        skills: ['Collection design', 'Quality control', 'Batch production'],
        tools: ['Plaster moulds', 'Templates', 'Sketchbook'],
        duration: '4 weeks',
      },
      {
        title: 'Photos, Packing & Shipping',
        description:
          'Take clean product photos with a phone and daylight. Learn double-box packing so ceramics survive courier shipping.',
        skills: ['Product photography', 'Safe packing', 'Courier booking'],
        tools: ['Smartphone', 'Bubble wrap', 'Corrugated boxes'],
        duration: '2 weeks',
      },
      {
        title: 'Grow Your Studio Business',
        description:
          'Sell on online marketplaces, Instagram and craft bazaars. Take bulk orders from cafés, hotels and corporate gifting, and teach weekend workshops for extra income.',
        skills: ['Online selling', 'B2B orders', 'Teaching workshops', 'Registering your business'],
        tools: ['Instagram', 'Marketplaces', 'Udyam registration'],
        duration: 'Ongoing',
      },
    ],
  },

  opportunities: [
    {
      name: 'KVIC - Kumhar Sashaktikaran Programme',
      type: 'Workshop',
      location: 'Mumbai, Maharashtra (state offices across India)',
      description:
        'Khadi and Village Industries Commission programme for potters, offering training and support such as electric potter’s wheels and related equipment.',
      contact: 'Contact the KVIC state/divisional office listed on the website',
      link: 'https://www.kvic.gov.in',
    },
    {
      name: 'Office of the Development Commissioner (Handicrafts)',
      type: 'Workshop',
      location: 'New Delhi, Delhi (regional offices across India)',
      description:
        'Ministry of Textiles office that runs skill training, design workshops and craft cluster programmes for artisans, and issues the artisan identity card (Pehchan).',
      contact: 'Nearest Handicrafts Service Centre - details on website',
      link: 'https://handicrafts.nic.in',
    },
    {
      name: 'Sanskriti Kendra (Sanskriti Foundation)',
      type: 'Workshop',
      location: 'Anandagram, New Delhi, Delhi',
      description:
        'Cultural centre with a Museum of Indian Terracotta and a ceramics studio that has hosted pottery workshops and artist residencies.',
      contact: 'Contact details on website',
      link: 'https://www.sanskritifoundation.org',
    },
    {
      name: 'Khamir',
      type: 'NGO',
      location: 'Kukma, Bhuj, Gujarat',
      description:
        'Kutch-based organisation supporting traditional crafts including pottery, with craft promotion, skill development and market access for artisans.',
      contact: 'Contact details on website',
      link: 'https://www.khamir.org',
    },
    {
      name: 'Crafts Council of India',
      type: 'NGO',
      location: 'Chennai, Tamil Nadu',
      description:
        'National non-profit that promotes Indian crafts and craftspeople through exhibitions, craft bazaars, awards and advocacy.',
      contact: 'Contact details on website',
      link: 'https://www.craftscouncilofindia.org',
    },
  ],

  trends: {
    demandLevel: 'High',
    priceRange: { min: 150, max: 5000, currency: 'INR' },
    trendingSkills: [
      'Food-safe, lead-free glazing',
      'Matte earthy finishes',
      'Hand-painted Indian motifs',
      'Matching tableware sets',
      'Product photography',
    ],
    trendingProducts: [
      { name: 'Coffee mugs', emoji: '☕', priceRange: { min: 350, max: 900 }, demandScore: 82 },
      { name: 'Terracotta planters', emoji: '🪴', priceRange: { min: 250, max: 1500 }, demandScore: 74 },
      { name: 'Designer diyas', emoji: '🪔', priceRange: { min: 150, max: 800 }, demandScore: 90 },
      { name: 'Serving platters', emoji: '🍽️', priceRange: { min: 1200, max: 5000 }, demandScore: 61 },
      { name: 'Kulhads (set of 6)', emoji: '🍵', priceRange: { min: 300, max: 900 }, demandScore: 68 },
    ],
    insights: [
      'Cafés and boutique restaurants buy handmade tableware in bulk - matching sets lead to repeat orders.',
      'Diwali (October-November) brings a big jump in demand for diyas and decor. Start making stock by August.',
      'Earthy matte colours sell better than very glossy, bright glazes in metro cities.',
      'Short videos of the wheel process on Instagram bring many enquiries - show your hands at work.',
    ],
  },
};
