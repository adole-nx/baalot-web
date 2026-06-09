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
    slug: "why-we-built-on-ethereum",
    title: "Why We Built Baalot on Ethereum",
    date: "March 14, 2025",
    readTime: "6 min read",
    tag: "Engineering",
    tagColor: "#3B6EF8",
    excerpt:
      "Every election platform makes a foundational bet. Ours was on Ethereum. Here is the reasoning — including the trade-offs we almost didn't survive.",
    author: "Adole Daniel Inalegwu",
    authorRole: "Founder & CEO",
    body: [
      {
        type: "p",
        content:
          "Before Baalot existed as code, it existed as a question: how do you build an election system that no single person — not an IT administrator, not a returning officer, not even the founders of the platform itself — can corrupt?",
      },
      {
        type: "p",
        content:
          "Traditional software doesn't answer that question. A database can be edited. A server can be taken offline. Audit logs can be wiped. Every centralised system has an administrator, and every administrator is a single point of failure.",
      },
      {
        type: "h2",
        content: "The case for a public blockchain",
      },
      {
        type: "p",
        content:
          "We needed a data store with three properties: immutability (once a vote is written, it cannot be changed), public verifiability (any observer can audit the result independently), and decentralisation (no single party controls the data). Public blockchains are the only technology that satisfies all three simultaneously.",
      },
      {
        type: "p",
        content:
          "We evaluated four networks seriously — Ethereum, Polygon, Solana, and a private Hyperledger deployment. The decision came down to one question: five years from now, which of these will still be running, will still have active security researchers, and will still be economically incentivised to stay honest? The answer was Ethereum.",
      },
      {
        type: "h2",
        content: "Why not Polygon or Solana?",
      },
      {
        type: "p",
        content:
          "Polygon is faster and cheaper, and we use its infrastructure for transaction relaying. But anchoring vote commitments to Ethereum mainnet gives us an 800-billion-dollar security budget that no African startup could otherwise afford. Solana's history of outages — six notable network halts since 2021 — made it unsuitable for election-grade uptime requirements.",
      },
      {
        type: "p",
        content:
          "A private Hyperledger deployment would have given us full control. But that's exactly the problem — it would have given us full control. The value of blockchain for elections isn't performance; it's the credible commitment that the administrators cannot cheat.",
      },
      {
        type: "h2",
        content: "The voter privacy problem",
      },
      {
        type: "p",
        content:
          "Publishing every vote on a public blockchain sounds like it destroys anonymity. It doesn't have to. We use a zero-knowledge commitment scheme: when you vote, a cryptographic commitment is written on-chain that proves you participated and that your vote was counted — without ever revealing which candidate you chose. The secret is held in your device and expires the moment the election closes.",
      },
      {
        type: "blockquote",
        content:
          "The goal isn't to make elections digital. It's to make elections undeniable.",
      },
      {
        type: "h2",
        content: "What this means in practice",
      },
      {
        type: "p",
        content:
          "When Federal Polytechnic Bida's 2,400 students voted in their SUG election last year, every vote commitment was anchored to Ethereum within seconds of being cast. When the results were published, any student with a block explorer could verify that the total number of on-chain commitments matched the announced turnout. No trust required — just a browser.",
      },
      {
        type: "p",
        content:
          "That's the bet we made on Ethereum. Not on transaction speed or gas costs — those are engineering problems. On the idea that when someone loses an election by three votes and demands a recount, they should be able to verify the result themselves, without asking anyone for permission.",
      },
    ],
  },
  {
    slug: "fed-poly-bida-91-percent-turnout",
    title: "The Day 2,400 Students Voted in Under 2 Hours",
    date: "January 28, 2025",
    readTime: "8 min read",
    tag: "Case Study",
    tagColor: "#10B981",
    excerpt:
      "Federal Polytechnic Bida's SUG election was our biggest test: 2,400 eligible voters, a 10-day deployment window, and a student body that had seen three disputed elections in five years.",
    author: "Adole Daniel Inalegwu",
    authorRole: "Founder & CEO",
    body: [
      {
        type: "p",
        content:
          "In November 2024, the Students' Union Government of Federal Polytechnic Bida reached out with a straightforward problem: they needed an election. Not a survey, not a show of hands — a real election, with NIN-verified voters, a transparent count, and results that no one could dispute the morning after.",
      },
      {
        type: "p",
        content:
          "They had tried paper ballots. They had tried a Google Form. They had tried a third-party app that went offline on election day. After a disputed election in 2022 that ended in a student protest, their Dean of Student Affairs had one instruction: whatever you use, make sure nobody can argue with the result.",
      },
      {
        type: "h2",
        content: "Deployment in 10 days",
      },
      {
        type: "p",
        content:
          "We committed to a 10-day deployment. Day one was a briefing with the electoral committee. Day three, we had the voter list — 2,400 students with matriculation numbers and NIN data. Days four through seven, we onboarded voters in batches: the app went out to department WhatsApp groups, students downloaded it, verified their NIN against the registry, and were flagged as eligible.",
      },
      {
        type: "p",
        content:
          "Day eight was a dry run with 50 students from different departments — including three who deliberately tried to vote twice. The system flagged all three before they reached the ballot screen. Day ten was election day.",
      },
      {
        type: "h2",
        content: "Election day",
      },
      {
        type: "p",
        content:
          "Voting opened at 8:00 AM. By 9:45 AM, 1,800 votes had been cast — a rate of roughly 16 votes per minute. The median voting time was 94 seconds. By 11:20 AM, polls closed with 2,183 votes recorded: a 91% turnout on a student electorate of 2,400.",
      },
      {
        type: "blockquote",
        content:
          "Results were published on-chain at 11:21 AM — one minute after polls closed. Every student could verify their own vote commitment using a public block explorer before the announcement was made.",
      },
      {
        type: "ul",
        content: [
          "2,400 eligible voters registered",
          "2,183 votes cast — 91% turnout",
          "0 duplicate votes detected",
          "0 tampering incidents",
          "Results published 60 seconds after polls closed",
          "Zero disputes filed after the result",
        ],
      },
      {
        type: "h2",
        content: "What we learned",
      },
      {
        type: "p",
        content:
          "The biggest challenge was not technical — it was trust. Students who had seen disputed results before were suspicious of any digital system. The breakthrough was the public audit trail: showing students that they could check the on-chain commitment themselves, using a tool we didn't control, was more persuasive than any feature demo.",
      },
      {
        type: "p",
        content:
          "The second lesson was onboarding friction. NIN verification added about 45 seconds to the sign-up flow, and three students were unable to verify because their NIN records had a name mismatch with the school registry. We built a manual override path for the electoral committee to handle those edge cases — a detail that's now standard in every deployment.",
      },
      {
        type: "p",
        content:
          "Federal Poly Bida renewed for their 2025 election before we left campus. That felt like the only review that mattered.",
      },
    ],
  },
  {
    slug: "zero-knowledge-proofs-explained",
    title: "How Zero-Knowledge Proofs Keep Your Vote Secret",
    date: "February 19, 2025",
    readTime: "7 min read",
    tag: "Education",
    tagColor: "#F5C518",
    excerpt:
      "Elections have a paradox at their core: you need to prove every vote was counted correctly, without ever revealing how anyone voted. ZK proofs solve it. Here's how.",
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
        content: "How Baalot uses ZK proofs",
      },
      {
        type: "p",
        content:
          "When you cast a vote on Baalot, three things happen in sequence. First, your device generates a cryptographic commitment — a mathematical fingerprint of your vote that can be verified without revealing the vote itself. Second, this commitment is anchored to the Ethereum blockchain, creating a permanent, tamper-proof record that you participated and that your vote was valid. Third, your actual vote choice is held in an encrypted tally structure that can only be opened when the election closes — and even then, only the aggregate result is decrypted, not individual choices.",
      },
      {
        type: "blockquote",
        content:
          "You can prove your vote was counted without proving how you voted. That's the core guarantee.",
      },
      {
        type: "h2",
        content: "What this means for election integrity",
      },
      {
        type: "ul",
        content: [
          "Administrators cannot see how you voted, even if they want to",
          "You can verify your own vote commitment on a public blockchain explorer",
          "The final tally can be independently verified without accessing any individual vote",
          "A corrupt administrator cannot change the result without invalidating thousands of on-chain proofs simultaneously",
        ],
      },
      {
        type: "h2",
        content: "The trade-offs we made",
      },
      {
        type: "p",
        content:
          "ZK proofs are computationally expensive. Generating a proof on a low-end Android device takes between 800ms and 1.4 seconds — which is why the voting flow on Baalot has a brief 'securing your vote' loading state. We optimised the proof circuit specifically for binary-choice and ranked-choice ballots to keep this under two seconds on devices as old as Android 8.",
      },
      {
        type: "p",
        content:
          "The other trade-off is complexity: ZK proofs require voters to trust mathematical guarantees they may not fully understand. Our answer to this is the public blockchain record. You don't need to understand the cryptography to verify your participation — you just need a block explorer and your voter receipt. The math handles the secret; the blockchain handles the proof.",
      },
      {
        type: "p",
        content:
          "African elections have been manipulated by people with physical access to ballot boxes, by administrators with database access, and by network attacks on centralised servers. ZK proofs don't eliminate corruption — but they make the specific corruptions that have historically worked impossible to execute without being detected. That's the point.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
