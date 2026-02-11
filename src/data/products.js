export const products = [
  // BOOTS Category
  {
    id: 1,
    name: "Liberty Warrior -Jungle Shoes",
    category: "BOOTS",
    price: 1750,
    image: "https://i.ibb.co/PsFHHfL4/1769704977254.png",
    rating: 4.7,
    totalReviews: 124,
    description: "Premium military-grade combat boots designed for extreme terrains. Features reinforced toe caps, ankle support, and slip-resistant soles. Water-resistant leather with breathable mesh panels.",
    sizes: [6, 7, 8, 9, 10],
    images: [
      "https://i.ibb.co/PsFHHfL4/1769704977254.png",
      "https://i.ibb.co/xSBRf4H0/1769709351691.png",
      "https://i.ibb.co/0RD3hSZW/1769709577080.png"
    ],
    reviews: [
      { name: "Rajesh Kumar", rating: 5, comment: "Excellent quality boots! Very comfortable even after 8 hours of use.", date: "2026-01-15" },
      { name: "Amit Singh", rating: 4.5, comment: "Great durability and ankle support. Worth every penny.", date: "2026-01-10" },
      { name: "Vikram Sharma", rating: 5, comment: "Best tactical boots I've owned. Highly recommend!", date: "2026-01-05" }
    ]
  },
  {
    id: 2,
    name: "Military Jungle Boots - Olive Green",
    category: "BOOTS",
    price: 700,
    image: "https://i.ibb.co/xqbt8sD1/IMG-20260124-WA0007.jpg",
    rating: 4.5,
    totalReviews: 121,
    description: "Specialized jungle warfare boots with superior water drainage and quick-dry technology. Reinforced with Cordura fabric for maximum durability in wet conditions.",
    sizes: [6, 7, 8, 9, 10],
    images: [
      "https://i.ibb.co/xqbt8sD1/IMG-20260124-WA0007.jpg",
      "https://i.ibb.co/bMYshfg2/1769691995325.png",
      "https://i.ibb.co/ZRc1HCst/1769692102543.png"
    ],
    reviews: [
      { name: "Suresh Patel", rating: 5, comment: "Perfect for monsoon treks. Water drains out quickly!", date: "2026-01-20" },
      { name: "Arjun Reddy", rating: 4, comment: "Good quality but runs slightly large. Order half size down.", date: "2026-01-12" }
    ]
  },
  {
    id: 3,
    name: "Short DMS Boots - Black",
    category: "BOOTS",
    price: 650,
    image: "https://i.ibb.co/gMcQB2Nh/IMG-20260124-WA0012.jpg",
    rating: 4.6,
    totalReviews: 145,
    description: "Elite-level tactical boots with advanced shock absorption and steel toe protection. Designed for special operations with silent grip soles and reinforced stitching.",
    sizes: [6, 7, 8, 9, 10],
    images: [
      "https://i.ibb.co/0Rsdv2xc/1769705175359.png",
      "https://i.ibb.co/MkSq39RN/1769708899584.png",
      "https://i.ibb.co/Z1V8mq8T/1769692932181.png"
    ],
    reviews: [
      { name: "Captain Verma", rating: 5, comment: "Professional grade equipment. Exceeded expectations!", date: "2026-01-18" },
      { name: "Rahul Gupta", rating: 5, comment: "Best investment for tactical operations. Superb quality.", date: "2026-01-08" },
      { name: "Deepak Joshi", rating: 4.5, comment: "Very sturdy and comfortable. Great for long missions.", date: "2026-01-03" }
    ]
  },
  /*---{
    id: 4,
    name: "Desert Patrol Boots - Tan",
    category: "BOOTS",
    price: 4799,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0",
    rating: 4.5,
    totalReviews: 120,
    description: "Lightweight desert boots with enhanced breathability and heat resistance. Features moisture-wicking lining and sand-resistant quick-lace system.",
    sizes: [6, 7, 8, 9, 10],
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0",
      "https://images.unsplash.com/photo-1599238683135-39cc826c3f3d",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5"
    ],
    reviews: [
      { name: "Manoj Tiwari", rating: 4.5, comment: "Excellent for hot weather operations. Very breathable.", date: "2026-01-14" },
      { name: "Sandeep Kumar", rating: 5, comment: "Light yet durable. Perfect for desert conditions.", date: "2026-01-09" }
    ]
  },

  //JACKET CATEGORY 
  {
    id: 6,
    name: "Combat Windbreaker - Camo Pattern",
    category: "JACKETS",
    price: 6499,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    rating: 4.5,
    totalReviews: 120,
    description: "Lightweight windproof jacket with camouflage pattern. Features concealed zip pockets, adjustable hem, and packable design for easy storage.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
      "https://images.unsplash.com/photo-1664431162403-07a7b65c9e7f",
      "https://images.unsplash.com/photo-1578102718171-ec1f91680562"
    ],
    reviews: [
      { name: "Vijay Kumar", rating: 5, comment: "Love the camo design! Very practical and stylish.", date: "2026-01-17" },
      { name: "Ravi Verma", rating: 4, comment: "Good windbreaker but could be slightly warmer.", date: "2026-01-13" }
    ]
  },
  {
    id: 7,
    name: "Winter Tactical Parka - Black",
    category: "JACKETS",
    price: 9999,
    image: "https://images.unsplash.com/photo-1578102718171-ec1f91680562",
    rating: 4.6,
    totalReviews: 125,
    description: "Heavy-duty winter parka with insulated lining and fur-trimmed hood. Extreme cold weather protection with multiple internal and external pockets.",
    images: [
      "https://images.unsplash.com/photo-1578102718171-ec1f91680562",
      "https://images.unsplash.com/photo-1664431162403-07a7b65c9e7f",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea"
    ],
    reviews: [
      { name: "Colonel Mehra", rating: 5, comment: "Exceptional winter gear. Survived -15°C with ease!", date: "2026-01-16" },
      { name: "Ashok Yadav", rating: 5, comment: "Best winter jacket I've owned. Worth the investment.", date: "2026-01-07" },
      { name: "Nitin Raj", rating: 4.5, comment: "Very warm and well-made. Highly recommend.", date: "2026-01-02" }
    ]
  },
  {
    id: 8,
    name: "Tactical Softshell Jacket - Grey",
    category: "JACKETS",
    price: 7499,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
    rating: 4.5,
    totalReviews: 122,
    description: "Flexible softshell jacket with breathable membrane and water-repellent coating. Perfect for active operations with stretch panels for mobility.",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
      "https://images.unsplash.com/photo-1664431162403-07a7b65c9e7f",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea"
    ],
    reviews: [
      { name: "Sanjay Mehta", rating: 4.5, comment: "Great flexibility and comfort. Perfect for training.", date: "2026-01-21" },
      { name: "Gaurav Singh", rating: 5, comment: "Excellent mobility without compromising protection.", date: "2026-01-15" }
    ]
  },---*/

  //TACTICAL GEARS
  {
    id: 9,
    name: "Tactical Army Gloves",
    category: "TACTICAL GEARS",
    price: 499,
    image: "https://i.ibb.co/KxLGB987/IMG-20260124-WA0000.jpg",
    rating: 4.6,
    totalReviews: 115,
    description: "Tactical army gloves are engineered for high-intensity environments, featuring impact-resistant knuckle guards and reinforced palms for superior protection and grip. They utilize breathable, moisture-wicking materials and touchscreen-compatible fingertips to ensure maximum dexterity and functionality in the field. ",
    images: [
      "https://i.ibb.co/67THpzkj/1769693605235.png",
      "https://i.ibb.co/wZr8dfYM/1769711469644.png",
      "https://i.ibb.co/Q3wHyKsV/1769711637567.png"
    ],
    reviews: [
      { name: "Major Kapoor", rating: 5, comment: "Excellent modularity. Fits all my gear perfectly!", date: "2026-01-22" },
      { name: "Rohit Chauhan", rating: 4.5, comment: "Very well constructed. Great value for money.", date: "2026-01-16" },
      { name: "Akash Jain", rating: 5, comment: "Professional quality vest. Highly recommended!", date: "2026-01-10" }
    ]
  },
  {
    id: 10,
    name: "Cold Army Survival Gloves",
    category: "TACTICAL GEARS",
    price: 1200,
    image: "https://i.ibb.co/0phQmfX3/IMG-20260124-WA0004.jpg",
    rating: 4.5,
    totalReviews: 121,
    description: "These Cold Army Survival Gloves are designed for extreme thermal protection, featuring heavy-duty insulation and a long, adjustable gauntlet cuff to seal out snow and freezing air. They combine a rugged, water-resistant exterior with reinforced textured palms for a secure grip in harsh, icy conditions.",
    images: [
      "https://i.ibb.co/GQvy87ht/IMG-20260124-WA0003.jpg",
      "https://i.ibb.co/PZvr6z6z/1769694387952.png",
      "https://i.ibb.co/8nGRQJPk/1769694432519.png"
    ],
    reviews: [
      { name: "Sunil Kumar", rating: 5, comment: "Spacious and durable. Carried 15kg easily!", date: "2026-01-18" },
      { name: "Dinesh Patel", rating: 4, comment: "Good backpack but straps could be more padded.", date: "2026-01-12" }
    ]
  },
  /*--{
    id: 11,
    name: "Tactical Belt - Heavy Duty",
    category: "TACTICAL GEARS",
    price: 1999,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583db",
    rating: 4.6,
    totalReviews: 125,
    description: "Reinforced tactical belt with quick-release buckle and MOLLE attachment loops. Load-bearing capacity up to 20kg with anti-slip inner lining.",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583db",
      "https://images.unsplash.com/photo-1630957521679-a2b8b97d516c",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
    ],
    reviews: [
      { name: "Harish Reddy", rating: 5, comment: "Super strong belt! Holds all my gear securely.", date: "2026-01-20" },
      { name: "Pradeep Singh", rating: 5, comment: "Best tactical belt on the market. No comparison.", date: "2026-01-14" },
      { name: "Manish Gupta", rating: 4.5, comment: "Excellent quality and very reliable.", date: "2026-01-08" }
    ]
  },
  {
    id: 12,
    name: "Tactical Gloves - Reinforced",
    category: "TACTICAL GEARS",
    price: 1499,
    image: "https://images.unsplash.com/photo-1526662092594-1126d68c2d23",
    rating: 4.5,
    totalReviews: 120,
    description: "Cut-resistant tactical gloves with reinforced knuckles and touchscreen-compatible fingertips. Breathable material with secure wrist strap.",
    images: [
      "https://images.unsplash.com/photo-1526662092594-1126d68c2d23",
      "https://images.unsplash.com/photo-1630957521679-a2b8b97d516c",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
    ],
    reviews: [
      { name: "Ajay Sharma", rating: 4.5, comment: "Great grip and protection. Very comfortable.", date: "2026-01-19" },
      { name: "Naveen Kumar", rating: 5, comment: "Perfect fit and excellent quality materials.", date: "2026-01-11" }
    ]
  },--*/

  // ARMY PATAK Category
  {
    id: 13,
    name: "Army Patak -Olive Green",
    category: "PATAK",
    price: 250,
    image: "https://i.ibb.co/qMPs8XMj/1769700881062.png",
    rating: 4.6,
    totalReviews: 123,
    description: "An army patka (shemagh) is a versatile tactical headwrap designed to protect the head, face, and neck from sun, wind, and debris. Made from breathable cotton, it features traditional woven patterns and can be worn as a head scarf, face mask, or neck gaiter in diverse outdoor environments.",
    images: [
      "https://i.ibb.co/qMPs8XMj/1769700881062.png",
      "https://i.ibb.co/j92PkKH9/1769700940680.png",
      "https://i.ibb.co/mFXLtwpz/1769700991979.png"
    ],
    reviews: [
      { name: "Vikas Rao", rating: 5, comment: "Authentic quality tags. Engraving is perfect!", date: "2026-01-23" },
      { name: "Sachin Verma", rating: 4.5, comment: "Good quality and fast delivery. Satisfied!", date: "2026-01-17" },
      { name: "Ramesh Singh", rating: 5, comment: "Exactly as described. Great product!", date: "2026-01-13" }
    ]
  },
  /*--{
    id: 14,
    name: "Name Patch - Embroidered",
    category: "TAGS",
    price: 299,
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071",
    rating: 4.5,
    totalReviews: 120,
    description: "Custom embroidered name patches with Velcro backing. Available in multiple colors. Professional military-grade embroidery.",
    images: [
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"
    ],
    reviews: [
      { name: "Ankit Joshi", rating: 5, comment: "Perfect stitching! Looks very professional.", date: "2026-01-21" },
      { name: "Pankaj Kumar", rating: 4, comment: "Good quality but delivery took longer than expected.", date: "2026-01-15" }
    ]
  },
  {
    id: 15,
    name: "Unit Badge - Metal Pin",
    category: "TAGS",
    price: 499,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
    rating: 4.6,
    totalReviews: 124,
    description: "Premium metal unit badges with secure pin backing. High-quality enamel coating and detailed design. Available for various units.",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071"
    ],
    reviews: [
      { name: "Lt. Sharma", rating: 5, comment: "Excellent craftsmanship! Very proud to wear it.", date: "2026-01-24" },
      { name: "Rajat Malhotra", rating: 5, comment: "Top quality badge. Worth every rupee.", date: "2026-01-18" },
      { name: "Amit Bose", rating: 4.5, comment: "Beautiful design and solid construction.", date: "2026-01-12" }
    ]
  },
  {
    id: 16,
    name: "Rank Insignia Set",
    category: "TAGS",
    price: 599,
    image: "https://images.unsplash.com/photo-1594833558651-1810e9a60b27",
    rating: 4.5,
    totalReviews: 121,
    description: "Complete set of rank insignia patches with Velcro backing. Authentic military specifications with durable embroidery.",
    images: [
      "https://images.unsplash.com/photo-1594833558651-1810e9a60b27",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071"
    ],
    reviews: [
      { name: "Capt. Reddy", rating: 4.5, comment: "Accurate ranks and good quality stitching.", date: "2026-01-16" },
      { name: "Suresh Nair", rating: 5, comment: "Perfect for my collection. Highly authentic.", date: "2026-01-09" }
    ]
  },---*/

  //HELMET Category
  {
    id: 17,
    name: "Tactical Helmet- Olive Green",
    category: "HELMET",
    price: 1650,
    image: "https://i.ibb.co/gMNW1dvc/1769703086906.png",
    rating: 4.8,
    totalReviews: 155,
    description: "A tactical army helmet is a high-performance ballistic headpiece designed to provide impact protection while supporting mission-essential gear like night vision and communication headsets. It features an adjustable suspension system and interior padding for comfort, alongside integrated side rails and a front shroud for modular attachments. ",
    images: [
      "https://i.ibb.co/gMNW1dvc/1769703086906.png",
      "https://i.ibb.co/mxtq7rP/1769703149171.png",
      "https://i.ibb.co/Qjzfkzjg/1769703231382.png"
    ],
    reviews: [
      { name: "Deepak Saxena", rating: 5, comment: "Most comfortable tactical pants ever! Great fit.", date: "2026-01-25" },
      { name: "Yogesh Patel", rating: 4.5, comment: "Excellent quality and lots of pockets.", date: "2026-01-19" },
      { name: "Mukesh Kumar", rating: 5, comment: "Durable and practical. Highly recommend!", date: "2026-01-14" }
    ]
  },
  /*----{
    id: 18,
    name: "Combat Cargo Pants - Black",
    category: "CARGO PANTS",
    price: 3799,
    image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f",
    rating: 4.5,
    totalReviews: 122,
    description: "Premium black cargo pants with knee pad inserts and reinforced stitching. Water-resistant coating and breathable fabric.",
    images: [
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a"
    ],
    reviews: [
      { name: "Arjun Malhotra", rating: 5, comment: "Perfect for operations. Love the knee pads!", date: "2026-01-22" },
      { name: "Vinod Singh", rating: 4, comment: "Good pants but slightly expensive.", date: "2026-01-17" }
    ]
  },
  {
    id: 19,
    name: "Urban Cargo Pants - Khaki",
    category: "CARGO PANTS",
    price: 2999,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
    rating: 4.6,
    totalReviews: 124,
    description: "Versatile khaki cargo pants suitable for both tactical and casual wear. Comfortable stretch fabric with modern slim fit design.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f"
    ],
    reviews: [
      { name: "Rahul Kapoor", rating: 5, comment: "Stylish and functional! Wear them everywhere.", date: "2026-01-26" },
      { name: "Sandeep Rao", rating: 5, comment: "Best cargo pants for everyday use. Love them!", date: "2026-01-20" },
      { name: "Nikhil Sharma", rating: 4.5, comment: "Great fit and comfortable fabric.", date: "2026-01-15" }
    ]
  },
  {
    id: 20,
    name: "Camouflage Cargo Pants - Woodland",
    category: "CARGO PANTS",
    price: 3299,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    rating: 4.5,
    totalReviews: 121,
    description: "Authentic woodland camouflage cargo pants with reinforced seat and knees. Multiple cargo pockets with button closure.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f"
    ],
    reviews: [
      { name: "Karan Verma", rating: 4.5, comment: "Great camo pattern and very durable.", date: "2026-01-23" },
      { name: "Vishal Gupta", rating: 5, comment: "Perfect for outdoor activities. Excellent quality.", date: "2026-01-18" }
    ]
  }----*/
];

export const categories = ["BOOTS", "TACTICAL GEARS","PATAK","HELMET" ];

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const getFeaturedProducts = () => {
  return [
    products.find(p => p.id === 1),
    
    products.find(p => p.id === 9),
    products.find(p => p.id === 13),
    products.find(p => p.id === 17)
  ];
};