export type Book = {
  id: string;
  title: string;
  description: string;
  price: string;
  thumbnailUrl: string;
  dataAiHint: string;
  previewContent: string;
  fullContent: string;
  isFeatured?: boolean;
  isSubscription?: boolean;
  readCount?: number;
  tags?: string[];
};

export const books: Book[] = [
  {
    id: 'breaking-free',
    title: 'Breaking Free',
    description: 'Discover the path to spiritual, emotional, and financial freedom with these powerful teachings.',
    price: 'KES 500',
    thumbnailUrl: 'https://placehold.co/600x800',
    dataAiHint: 'abstract book cover',
    previewContent: `Chapter 1: The Chains Within

We often look for external forces to blame for our stagnation, for the invisible walls that seem to block our progress. We point to the economy, our upbringing, our relationships. But what if the most formidable prison is not outside of us, but within? This book begins with a journey inward, to identify the self-imposed limitations, the chains of doubt, fear, and negative belief systems that hold us captive. To break free, we must first see the bars of our own making.`,
    fullContent: `Chapter 1: The Chains Within

We often look for external forces to blame for our stagnation, for the invisible walls that seem to block our progress. We point to the economy, our upbringing, our relationships. But what if the most formidable prison is not outside of us, but within? This book begins with a journey inward, to identify the self-imposed limitations, the chains of doubt, fear, and negative belief systems that hold us captive. To break free, we must first see the bars of our own making.

Chapter 2: The Key of Forgiveness

Once we recognize our inner prison, the key to unlocking the door is forgiveness. Not just forgiveness of others, but the more challenging act of forgiving ourselves. This chapter explores the spiritual weight of holding onto grudges and past mistakes, and provides practical, faith-based steps to release that burden. Forgiveness is not about condoning the past; it's about refusing to let it define your future.

Chapter 3: Walking in Abundance

Freedom is not merely the absence of chains; it is the presence of purpose and abundance. This final chapter guides you on how to step into a life of spiritual richness. It's about aligning your actions with divine will, cultivating a mindset of gratitude, and understanding that true wealth is not measured in currency, but in peace, joy, and impact. You were created for more than just survival; you were created to thrive.`,
    isFeatured: true,
    isSubscription: false,
    readCount: 125,
    tags: ['freedom', 'faith', 'finance'],
  },
  {
    id: 'divine-pendant-wisdom',
    title: 'Divine Pendant Wisdom',
    description: 'Unlock the secrets of the divine pendant and harness its wisdom for a life of purpose and clarity.',
    price: 'KES 450',
    thumbnailUrl: 'https://placehold.co/600x800',
    dataAiHint: 'mystical book cover',
    previewContent: `Introduction: The Artifact of a Higher Calling

Legend speaks of a pendant, not of gold or silver, but forged in the fires of celestial insight. It is not an ornament, but an instrument; a key to a wisdom that transcends human understanding. This is not a work of fiction. The Divine Pendant is a metaphor for the innate connection to God that resides within each of us. This book is your guide to discovering it, cleansing it, and wearing it with divine authority.`,
    fullContent: `Introduction: The Artifact of a Higher Calling

Legend speaks of a pendant, not of gold or silver, but forged in the fires of celestial insight. It is not an ornament, but an instrument; a key to a wisdom that transcends human understanding. This is not a work of fiction. The Divine Pendant is a metaphor for the innate connection to God that resides within each of us. This book is your guide to discovering it, cleansing it, and wearing it with divine authority.

Part I: The Call to Wisdom

The first section of this sacred text illuminates the path to recognizing the divine call upon your life. Many hear a faint whisper but dismiss it as imagination. Through prayer, meditation, and scripture, you will learn to amplify that signal, to distinguish the voice of God from the noise of the world. It is a journey of stillness and spiritual attunement.

Part II: The Four Gems of Power

The pendant is adorned with four gems, each representing a pillar of spiritual strength: Faith, Hope, Love, and Discernment. This part dedicates a chapter to each gem, exploring its biblical significance and its practical application in your daily walk. You will learn how to polish each one, allowing their divine light to guide their decisions, heal your relationships, and protect you from spiritual harm.`,
    isFeatured: false,
    isSubscription: true,
    readCount: 78,
    tags: ['wisdom', 'spirituality', 'guidance'],
  },
  {
    id: 'the-prophetic-voice',
    title: 'The Prophetic Voice',
    description: 'Learn to hear, interpret, and speak the prophetic words of the Lord with confidence and humility.',
    price: 'KES 550',
    thumbnailUrl: 'https://placehold.co/600x800',
    dataAiHint: 'inspirational book cover',
    previewContent: `Chapter 1: Is God Still Speaking?

In a world saturated with information, opinions, and endless chatter, the question arises: Is God still speaking? The answer is a resounding YES. The challenge is not in His transmission, but in our reception. This chapter dismantles the modern skepticism and religious tradition that has muted the prophetic frequency. It rebuilds the foundation of faith required to believe that the Creator of the universe desires to communicate directly with you, personally and profoundly.`,
    fullContent: `Chapter 1: Is God Still Speaking?

In a world saturated with information, opinions, and endless chatter, the question arises: Is God still speaking? The answer is a resounding YES. The challenge is not in His transmission, but in our reception. This chapter dismantles the modern skepticism and religious tradition that has muted the prophetic frequency. It rebuilds the foundation of faith required to believe that the Creator of the universe desires to communicate directly with you, personally and profoundly.

Chapter 2: Tuning Your Spiritual Ear

Hearing God's voice is a skill that can be developed. It requires intentional practice and a sanctified heart. This chapter offers a spiritual toolkit for tuning your spiritual ear. We will explore various channels God uses—the Word, dreams, visions, the counsel of the wise, and the still, small voice within. You will learn to create margins in your life, to silence the clamor of the flesh and the world, and to position yourself to receive divine instruction with clarity.

Chapter 3: The Responsibility of a Prophetic Word

Receiving a word from the Lord is a sacred trust. What you do with it matters. This chapter provides critical wisdom on interpreting, processing, and delivering a prophetic message. It covers the importance of timing, accountability, and, above all, love. The goal of the prophetic is not to elevate the messenger, but to edify, exhort, and comfort the body of Christ. Learn to be a faithful steward of the mysteries of God.`,
    isFeatured: false,
    isSubscription: false,
    readCount: 212,
    tags: ['prophecy', 'hearing God', 'ministry'],
  },
];

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id);
};
