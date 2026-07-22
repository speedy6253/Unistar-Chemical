export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  order: number;
}

export interface EventSequence {
  id: string;
  sequenceNumber: number;
  title: string;
  date: string;
  location?: string;
  description: string;
  category?: string;
  media: MediaItem[];
}

export const mediaData: EventSequence[] = [
  {
    id: "seq-01",
    sequenceNumber: 1,
    title: "Best Business of the Year Award 2025–26 ceremony",
    date: "2026",
    location: "Kolkata, West Bengal, India",
    category: "FASII at ICCR, Kolkata",
    description: "Proud moment for Unistar Chemicals! Honored to receive the Achievement Award at International MSME Day 2026, organized by FASII at ICCR, Kolkata. Heartfelt thanks to our customers, partners, and dedicated team for their trust and support. This recognition inspires us to achieve even greater milestones. 🏆",
    media: [
      {
        id: "m-01-1",
        type: "image",
        url: "https://i.ibb.co/kswsCkpH/I-MSME-Day.jpg",
        title: "Hon'ble MSME Minister Shri Ashoke Dinda",
        order: 1
      },
      {
        id: "m-01-2",
        type: "image",
        url: "https://i.ibb.co/dJ5fnHFX/I-MSME-Day1.jpg",
        title: "At MSME Event",
        order: 2
      },
      {
        id: "m-01-3",
        type: "image",
        url: "https://i.ibb.co/Tx0fpKQk/I-MSME-Day3.jpg",
        title: "Hon'ble MSME Misnister",
        order: 3
      },
      {
        id: "m-01-4",
        type: "image",
        url: "https://i.ibb.co/hJRz20Hn/I-MSME-Day5.jpg",
        title: "MSME Event Day",
        order: 4
      },
      {
        id: "m-01-5",
        type: "image",
        url: "https://i.ibb.co/5g8N1x7M/I-MSME-Day6.jpg",
        title: "Keynote Highlights & Press Address",
        order: 5
      },
      {
        id: "m-01-6",
        type: "image",
        url: "https://i.ibb.co/Mx6SzxWT/I-MSME-Day8.jpg",
        title: "MSME Event",
        order: 6
      }
    ]
  },
  {
    id: "seq-02",
    sequenceNumber: 2,
    title: "Courtesy Meeting with Hon'ble Minister Dr. Santosh Kumar Suman",
    date: "July, 2026",
    location: "Kolkata, West Bengal, India",
    category: "Corporate Meetings",
    description: "A productive meeting with Hon'ble Minister Dr. Santosh Kumar Suman, Government of Bihar, to discuss industrial growth and investment opportunities in Bihar. We sincerely thank FASII Bihar Chapter for facilitating this meaningful interaction and look forward to contributing to the state's industrial development through Unistar Chemicals.",
    media: [
      {
        id: "m-02-1",
        type: "image",
        url: "https://i.ibb.co/RpjFy7vd/tweet-from-bihar.jpg",
        title: "Tweet from Bihar FASII",
        order: 1
      },
      {
        id: "m-02-2",
        type: "image",
        url: "https://i.ibb.co/jkwVf16j/With-Bihar-misister.jpg",
        title: "Meeting",
        order: 2
      },
      {
        id: "m-02-3",
        type: "image",
        url: "https://i.ibb.co/pqpDX7z/With-Bihar-misister1.jpg",
        title: "Meeting",
        order: 3
      },
    ]
  },
  {
    id: "seq-03",
    sequenceNumber: 3,
    title: "Strengthening Industry–Government Relations",
    date: "April, 2026",
    location: "West Bengal, India",
    category: "Government Meetings & Alliances",
    description: "A valuable interaction with senior government leaders during the FASII program, discussing industrial growth, MSME development, and future investment opportunities. Such engagements strengthen collaboration between industry and government, paving the way for innovation, sustainable growth, and new opportunities for businesses across the region.",
    media: [
      {
        id: "m-03-1",
        type: "image",
        url: "https://i.ibb.co/Hstsxtv/Bihar-ministers.jpg",
        title: "With Ministers",
        order: 1
      },
      {
        id: "m-02-2",
        type: "video",
        url: "https://youtube.com/shorts/TRCZ3Pmq6G4?feature=share",
        thumbnail: "https://i.ibb.co/Hstsxtv/Bihar-ministers.jpg",
        title: "European Expansion Strategic Announcement",
        order: 2
      }
    ]
  }
];
