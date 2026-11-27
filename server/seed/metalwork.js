// Metalwork seed data.
// NOTE: organisation links/contacts are believed correct but MUST be verified before launch.
export default {
  craft: {
    slug: 'metalwork',
    name: 'Metalwork',
    hindiName: 'Dhatu Kala',
    icon: '⚒️',
    image: '',
    accent: 'mustard',
    tagline: 'Cast, beat and engrave metal treasures',
    description:
      'Dhokra casting, brass and copper work, Bidri inlay. Make utensils, lamps, idols and jewellery.',
    overview:
      'Metal crafts like Dhokra, Bidriware and Moradabad brass are prized for their beauty and strength. Learn safe working, casting, sheet work and polishing, and how to price heavy items and ship them safely.',
    whatYouLearn: [
      'Metal types and workshop safety',
      'Sheet beating and shaping',
      'Lost-wax (Dhokra) casting',
      'Engraving and inlay work',
      'Polishing, packing and export basics',
    ],
    famousStyles: ['Dhokra', 'Bidriware', 'Moradabad Brass', 'Thanjavur Art Plates'],
  },

  roadmaps: {
    Beginner: [
      {
        title: 'Workshop Safety First',
        description:
          'Learn to work safely with hot metal, sharp edges and fumes. Always wear eye protection and gloves, and work in an airy place.',
        skills: ['Safety gear use', 'Fire safety', 'Ventilation'],
        tools: ['Safety goggles', 'Leather gloves', 'Apron', 'Fire bucket'],
        duration: '1 week',
      },
      {
        title: 'Know Your Metals',
        description: 'Understand brass, copper, bronze, aluminium and white metal - how they look, bend, melt and tarnish.',
        skills: ['Metal types', 'Gauge/thickness', 'Buying scrap and sheet'],
        tools: ['Metal samples', 'Wire gauge', 'Magnet'],
        duration: '1 week',
      },
      {
        title: 'Cutting, Filing & Bending',
        description: 'Cut metal sheet with snips and saw, file the edges smooth, and bend it neatly around formers.',
        skills: ['Cutting sheet', 'Filing', 'Bending'],
        tools: ['Tin snips', 'Jeweller’s saw', 'Files', 'Bench vice'],
        duration: '2 weeks',
      },
      {
        title: 'Hammering & Simple Shapes',
        description: 'Use hammers and stakes to dome and shape metal into small bowls and plates. Learn annealing to soften metal.',
        skills: ['Doming', 'Planishing', 'Annealing basics'],
        tools: ['Ball-peen hammer', 'Mallet', 'Stakes', 'Small torch'],
        duration: '3 weeks',
      },
      {
        title: 'Cleaning & Polishing',
        description: 'Remove tarnish and polish pieces to a shine using safe, simple methods.',
        skills: ['Pickling/cleaning', 'Polishing', 'Protective coating'],
        tools: ['Polishing cloth', 'Polishing compound', 'Lacquer'],
        duration: '1 week',
      },
    ],
    Intermediate: [
      {
        title: 'Lost-Wax (Dhokra) Basics',
        description:
          'Model a figure in wax, cover it in clay, melt out the wax and pour metal - the method behind Dhokra art. Learn under a master first.',
        skills: ['Wax modelling', 'Clay investment', 'Pouring under supervision'],
        tools: ['Bee wax', 'Clay', 'Crucible', 'Furnace (with mentor)'],
        duration: '5 weeks',
      },
      {
        title: 'Engraving & Chasing',
        description: 'Engrave lines and patterns, and use chasing tools to raise designs from the front of the metal.',
        skills: ['Engraving', 'Chasing', 'Pattern transfer'],
        tools: ['Gravers', 'Chasing tools', 'Pitch bowl'],
        duration: '4 weeks',
      },
      {
        title: 'Soldering & Joining',
        description: 'Join parts with rivets and solder to make lamps, boxes and utensils.',
        skills: ['Soft soldering', 'Riveting', 'Clean joints'],
        tools: ['Soldering torch', 'Solder & flux', 'Rivets'],
        duration: '3 weeks',
      },
      {
        title: 'Traditional Finishes',
        description: 'Learn antique, matte and oxidised finishes buyers love, and how to seal them so they last.',
        skills: ['Antique finish', 'Oxidising', 'Sealing'],
        tools: ['Finishing chemicals (with gloves & mask)', 'Brushes', 'Lacquer'],
        duration: '2 weeks',
      },
      {
        title: 'Weight-Based Costing',
        description: 'Price metal work by weight of metal, labour hours, finish and packing - heavy items cost more to ship.',
        skills: ['Costing by weight', 'Labour costing', 'Shipping cost'],
        tools: ['Weighing scale', 'Cost sheet'],
        duration: '1 week',
      },
    ],
    Advanced: [
      {
        title: 'Inlay & Fine Detail',
        description: 'Learn inlay techniques such as Bidri-style silver inlay and fine detailing for premium pieces.',
        skills: ['Inlay', 'Fine detailing', 'Precision work'],
        tools: ['Fine gravers', 'Silver wire', 'Magnifier'],
        duration: '6 weeks',
      },
      {
        title: 'Design Your Collection',
        description: 'Create a range of 8-10 products - lamps, décor, utensils or jewellery - with one consistent style.',
        skills: ['Product design', 'Prototyping', 'Consistency'],
        tools: ['Sketchbook', 'Templates', 'Moulds'],
        duration: '4 weeks',
      },
      {
        title: 'Quality & Export Standards',
        description: 'Check finish, weight and size for every piece. Learn what export buyers expect, including safe coatings.',
        skills: ['Quality checks', 'Buyer specifications', 'Documentation'],
        tools: ['Checklist', 'Weighing scale', 'Calipers'],
        duration: '3 weeks',
      },
      {
        title: 'Safe Packing & Shipping',
        description: 'Pack heavy and fragile metal pieces so they arrive without dents or scratches.',
        skills: ['Protective packing', 'Courier choice', 'Insurance basics'],
        tools: ['Foam', 'Corrugated boxes', 'Cloth bags'],
        duration: '1 week',
      },
      {
        title: 'Grow Your Workshop',
        description: 'Sell to exporters, interior designers and online buyers. Train helpers and take bulk orders.',
        skills: ['B2B selling', 'Team management', 'Online selling'],
        tools: ['Catalogue', 'Instagram', 'Udyam registration'],
        duration: 'Ongoing',
      },
    ],
  },

  opportunities: [
    {
      name: 'Office of the Development Commissioner (Handicrafts)',
      type: 'Workshop',
      location: 'New Delhi, Delhi (regional offices across India)',
      description:
        'Runs skill training, design workshops and cluster programmes for metal craft artisans, and issues the Pehchan artisan ID card.',
      contact: 'Nearest Handicrafts Service Centre - details on website',
      link: 'https://handicrafts.nic.in',
    },
    {
      name: 'Indian Institute of Crafts and Design (IICD)',
      type: 'Workshop',
      location: 'Jaipur, Rajasthan',
      description: 'Craft design institute with a hard-materials specialisation (including metal) that runs courses and craft workshops.',
      contact: 'Contact details on website',
      link: 'https://www.iicd.ac.in',
    },
    {
      name: 'TRIFED (Tribes India)',
      type: 'NGO',
      location: 'New Delhi, Delhi',
      description:
        'Government body that markets tribal products, including Dhokra metal craft, through Tribes India outlets and online.',
      contact: 'Contact details on website',
      link: 'https://trifed.tribal.gov.in',
    },
    {
      name: 'Export Promotion Council for Handicrafts (EPCH)',
      type: 'NGO',
      location: 'New Delhi, Delhi',
      description: 'Promotes handicraft exports, including Moradabad metalware, through trade fairs and buyer connections.',
      contact: 'Contact details on website',
      link: 'https://www.epch.in',
    },
    {
      name: 'Khamir',
      type: 'NGO',
      location: 'Kukma, Bhuj, Gujarat',
      description: 'Supports Kutch crafts, including traditional copper-coated bell making, with skills and market access.',
      contact: 'Contact details on website',
      link: 'https://www.khamir.org',
    },
  ],

  trends: {
    demandLevel: 'Medium',
    priceRange: { min: 300, max: 25000, currency: 'INR' },
    trendingSkills: ['Dhokra casting', 'Copper utensil making', 'Antique finishing', 'Brass lamp making'],
    trendingProducts: [
      { name: 'Copper bottles', emoji: '🍶', priceRange: { min: 700, max: 2000 }, demandScore: 79 },
      { name: 'Dhokra figurines', emoji: '🗿', priceRange: { min: 800, max: 8000 }, demandScore: 60 },
      { name: 'Brass lamps & diyas', emoji: '🪔', priceRange: { min: 500, max: 12000 }, demandScore: 70 },
      { name: 'Metal jewellery', emoji: '📿', priceRange: { min: 300, max: 3000 }, demandScore: 57 },
    ],
    insights: [
      'Health-conscious buyers look for copper bottles and utensils - mention care instructions clearly.',
      'Dhokra and tribal metal art is popular with interior designers and export buyers.',
      'Heavy items cost more to ship - include packing and courier cost in your price.',
    ],
  },
};
