export type Post = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
  excerpt: string;
  author: string;
  authorRole: string;
  body: Section[];
};

type Section = {
  type: "h2" | "p" | "ul" | "blockquote";
  content: string | string[];
};

export const posts: Post[] = [
  {
    slug: "zero-knowledge-proofs-explained",
    title: "How Zero-Knowledge Proofs Can Keep Your Vote Secret",
    date: "February 19, 2025",
    readTime: "7 min read",
    tag: "Education",
    tagColor: "#F5C518",
    excerpt:
      "Elections have a paradox at their core: you need to prove every vote was counted correctly, without ever revealing how anyone voted. ZK proofs are the approach we're designing around. Here's how they work.",
    author: "Adole Daniel Inalegwu",
    authorRole: "Founder & CEO",
    body: [
      {
        type: "p",
        content:
          "Elections sit at an uncomfortable intersection of two requirements that seem to contradict each other. On one hand, you need total transparency: every eligible voter should be able to verify that the final count is correct. On the other hand, you need absolute secrecy: no one should be able to find out how any individual voted. How do you have both at the same time?",
      },
      {
        type: "p",
        content:
          "Paper elections solve this imperfectly: ballots are secret, but the counting is a social process that depends on people being honest in a room. Digital elections make counting fast and auditable — but they've historically required trusting a central server with everyone's vote data, which is a much worse problem.",
      },
      {
        type: "h2",
        content: "What is a zero-knowledge proof?",
      },
      {
        type: "p",
        content:
          "A zero-knowledge proof (ZKP) is a cryptographic method where one party (the prover) can convince another party (the verifier) that a statement is true, without revealing any information beyond the truth of the statement itself.",
      },
      {
        type: "p",
        content:
          "A useful analogy: imagine you have a map with a hidden path through a maze, and you want to prove to a friend that you know the path — without showing them the path itself. A ZK proof lets you do exactly that. You can walk through the maze and prove you found the exit, without ever letting your friend see your route.",
      },
      {
        type: "h2",
        content: "How Baalot plans to use ZK proofs",
      },
      {
        type: "blockquote",
        content:
          "A note on status: the full ZK-proof design described below is on our roadmap, not shipped. What IS live today: ballots are stored unreadable, and every accepted ballot's salted commitment is sealed into a tamper-evident hash-chain — voters hold a receipt they can verify against the public chain, without the chain ever revealing a choice. The zero-knowledge layer below is where we're headed next.",
      },
      {
        type: "p",
        content:
          "In the design we're building toward, three things would happen in sequence when you cast a vote. First, your device generates a cryptographic commitment — a mathematical fingerprint of your vote that can be verified without revealing the vote itself. Second, this commitment is anchored to a public blockchain, creating a permanent, tamper-proof record that you participated and that your vote was valid. Third, your actual vote choice is held in an encrypted tally structure that can only be opened when the election closes — and even then, only the aggregate result is decrypted, not individual choices.",
      },
      {
        type: "blockquote",
        content:
          "You can prove your vote was counted without proving how you voted. That's the core guarantee we're designing for.",
      },
      {
        type: "h2",
        content: "What this would mean for election integrity",
      },
      {
        type: "ul",
        content: [
          "Administrators cannot see how you voted, even if they want to",
          "You could verify your own vote commitment on a public blockchain explorer",
          "The final tally can be independently verified without accessing any individual vote",
          "A corrupt administrator could not change the result without invalidating the on-chain proofs simultaneously",
        ],
      },
      {
        type: "h2",
        content: "The trade-offs",
      },
      {
        type: "p",
        content:
          "ZK proofs are computationally expensive, which is the main engineering challenge of bringing this to phones. Part of the work ahead is keeping proof generation fast enough on low-end Android devices that the voting flow stays smooth, and tuning the proof design for the binary-choice and ranked-choice ballots Baalot supports.",
      },
      {
        type: "p",
        content:
          "The other trade-off is complexity: ZK proofs require voters to trust mathematical guarantees they may not fully understand. Our answer to this is the public record. You wouldn't need to understand the cryptography to verify your participation — you'd just need a block explorer and your voter receipt. The math handles the secret; the blockchain handles the proof.",
      },
      {
        type: "p",
        content:
          "Elections have been manipulated by people with physical access to ballot boxes, by administrators with database access, and by network attacks on centralised servers. ZK proofs don't eliminate corruption — but they're designed to make the specific corruptions that have historically worked impossible to execute without being detected. That's the point of building toward them.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
