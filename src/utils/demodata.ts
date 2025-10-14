export const products: IProduct[] = [
  {
    id: "1",
    name: "Glucosamine Chondroitin MSM",
    category: "Supplements",
    description:
      "Supports joint health and mobility with Glucosamine, Chondroitin, and MSM.",
    image: "/demo/image1.jpg",
    oldPrice: 29.0,
    newPrice: 20.01,
    discount: 31,
    rating: 4.5,
    inStock: true,
  },
  {
    id: "2",
    name: "Omega 3 Fish Oil Softgels",
    category: "Vitamins",
    description:
      "High-potency Omega 3 supplement for heart, brain, and eye health.",
    image: "/demo/image1.jpg",
    oldPrice: 25.99,
    newPrice: 18.5,
    discount: 29,
    rating: 4.7,
    inStock: true,
  },
  {
    id: "3",
    name: "Vitamin D3 5000 IU",
    category: "Vitamins",
    description:
      "Supports immune system and bone health with potent Vitamin D3.",
    image: "/demo/image1.jpg",
    oldPrice: 19.99,
    newPrice: 13.99,
    discount: 30,
    rating: 4.6,
    inStock: true,
  },
  {
    id: "4",
    name: "Magnesium Glycinate Capsules",
    category: "Minerals",
    description:
      "Highly absorbable magnesium for muscle recovery and sleep support.",
    image: "/demo/image1.jpg",
    oldPrice: 27.99,
    newPrice: 19.59,
    discount: 30,
    rating: 4.8,
    inStock: true,
  },
  {
    id: "5",
    name: "Collagen Peptides Powder",
    category: "Beauty & Wellness",
    description:
      "Hydrolyzed collagen for skin, hair, nails, and joint support.",
    image: "/demo/image1.jpg",
    oldPrice: 39.99,
    newPrice: 27.99,
    discount: 30,
    rating: 4.9,
    inStock: true,
  },
];

export const categories = [
  {
    name: "Dispensary Drugs",
    value: "category-1",
  },
  {
    name: "Cardiovascular drugs",
    value: "category-2",
  },
  {
    name: "AntiInfectives",
    value: "category-3",
  },
  {
    name: "NSAIDs",
    value: "category-4",
  },
  {
    name: "Antiretrovirals",
    value: "category-5",
  },
  {
    name: "Endocrine and Metabollic Drugs",
    value: "category-5",
  },
  {
    name: "CNS Drugs",
    value: "category-5",
  },
  {
    name: "Respiratory Drugs",
    value: "category-5",
  },
  {
    name: "GastroIntestinal Drugs",
    value: "category-5",
  },
  {
    name: "Hematologic Drugs",
    value: "category-5",
  },
  {
    name: "Opthalmic ,ENT and Dermatological",
    value: "category-5",
  },
];

export const composites = [
  {
    name: "Ceramics",
    value: "ceramics",
  },
  {
    name: "Cotton",
    value: "cotton",
  },
  {
    name: "Matt Paper",
    value: "matt-paper",
  },
  {
    name: "Polyester",
    value: "polyester",
  },
  {
    name: "Recycled Paper",
    value: "recycled-paper",
  },
];

export const posts: IBlogPost[] = [
  {
    id: 1,
    title: "Nullam ullamcorper nisl quis ornare molestie",
    author: "Demo Demo",
    category: "Sub Category 1",
    date: "Wednesday February 1 2023",
    comments: 0,
    hits: 1811,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    excerpt:
      "Suspendisse posuere, diam in bibendum lobortis, turpis ipsum aliquam risus, sit amet dictum ligula lorem non nisl. Urna pretium elit mauris cursus Curabitur ut elit. Vestibulum sed ut erat volutpat...",
  },
  {
    id: 2,
    title: "Etiam eget erat est Phasellus elit justo",
    author: "John Smith",
    category: "Sub Category 2",
    date: "Tuesday January 31 2023",
    comments: 5,
    hits: 2340,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    excerpt:
      "Mattis non lorem aliquam aliquam leo. Sed fermentum consectetur magna, eget semper ante. Aliquam scelerisque justo velit. Fusce cursus blandit dolor, in sodales urna vulputate lobortis...",
  },
  {
    id: 3,
    title: "Vivamus mattis volutpat erat et congue",
    author: "Sarah Johnson",
    category: "Sub Category 3",
    date: "Monday January 30 2023",
    comments: 12,
    hits: 3102,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    excerpt:
      "Curabitur faucibus aliquam pulvinar. Nulla ut tellus turpis. Nullam lacus sem, volutpat id odio sed, cursus tristique eros. Duis at pellentesque magna. Donec magna nisl...",
  },
  {
    id: 4,
    title: "Curabitur dignissim bibend in aliquip enim",
    author: "Mike Chen",
    category: "Sub Category 1",
    date: "Sunday January 29 2023",
    comments: 8,
    hits: 1567,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    excerpt:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur faucibus aliquam pulvinar. Vivamus mattis volutpat erat...",
  },
  {
    id: 5,
    title: "Nulla id pharetra dui at rhoncus urn",
    author: "Emma Wilson",
    category: "Sub Category 2",
    date: "Saturday January 28 2023",
    comments: 3,
    hits: 892,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    excerpt:
      "Maecenas non porttitor purus. Nullam ullamcorper nisl quis ornare molestie. Etiam eget erat est. Phasellus elit justo, mattis non lorem non, aliquam aliquam leo...",
  },
];
