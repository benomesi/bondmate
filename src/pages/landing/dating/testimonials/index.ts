// Testimonial definitions and types
export interface Testimonial {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  content: string;
  rating: number;
  image: string;
  result: string;
  highlight: string;
}

export interface SuccessMetric {
  icon: string;
  value: string;
  label: string;
  description: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'james-k',
    name: 'James K.',
    age: 28,
    location: 'New York',
    occupation: 'Software Engineer',
    content: 'The profile advice was spot-on! My matches increased dramatically, and the conversation tips helped me connect more authentically.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    result: '3x more matches',
    highlight: 'Profile optimization led to immediate results'
  },
  {
    id: 'alex-c',
    name: 'Alex Chen',
    age: 29,
    location: 'San Francisco',
    occupation: 'Product Designer',
    content: 'The conversation strategies completely changed my dating life. I\'m now much more confident in my approach and getting quality matches.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    result: '4x more responses',
    highlight: 'Confidence boost led to better connections'
  },
  {
    id: 'david-l',
    name: 'David L.',
    age: 35,
    location: 'Los Angeles',
    occupation: 'Marketing Director',
    content: 'The conversation guidance was a game-changer. I went from awkward chats to engaging discussions that led to actual dates.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    result: '80% response rate',
    highlight: 'Turned matches into real dates consistently'
  }
];

export const SUCCESS_METRICS: SuccessMetric[] = [
  {
    icon: 'Heart',
    value: '94%',
    label: 'Success Rate',
    description: 'of our users see improvement'
  },
  {
    icon: 'MessageSquare',
    value: '3x',
    label: 'More Matches',
    description: 'increase in quality matches'
  },
  {
    icon: 'Target',
    value: '85%',
    label: 'Response Rate',
    description: 'higher message response rate'
  },
  {
    icon: 'Users',
    value: '10k+',
    label: 'Men Helped',
    description: 'and counting'
  }
];