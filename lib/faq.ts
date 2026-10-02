// One source for the homepage FAQ section AND its FAQPage JSON-LD, so the
// answers search/AI engines read can never drift from what visitors see.
// Keep every claim here in line with /security and llms.txt — AI answer
// engines quote these verbatim.

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What is Baalot?",
    a: "Baalot is an election platform for universities, student unions, NGOs, cooperatives and other organisations in Nigeria and across Africa. Voters cast ballots in the Baalot mobile app, and election administrators set up and run elections from the web console at admin.baalot.site.",
  },
  {
    q: "Is Baalot the same as \"ballot\"?",
    a: "No. Baalot (spelled B-A-A-L-O-T) is the name of the platform — a play on the word \"ballot\". Its website is baalot.site.",
  },
  {
    q: "Who is Baalot for?",
    a: "Any organisation that runs elections for its members: university student union and faculty elections, departmental associations, NGOs, cooperatives, professional bodies and companies. Over 110 Nigerian institutions are already listed in the Baalot directory.",
  },
  {
    q: "How does Baalot stop people from voting twice?",
    a: "Votes are enforced on Baalot's server, not in the app. A ballot opens only for a member matched to the institution's voter list (and the right sub-group, such as a faculty or department), confirmed with their voting PIN, and the server accepts exactly one vote per identity.",
  },
  {
    q: "Are votes on Baalot anonymous?",
    a: "Pseudonymous, not anonymous. Your choice is encrypted with AES-256-GCM before it is stored, and ballots are recorded under a pseudonymous anchor, not your name. Baalot runs the servers and holds the key that opens ballots to count them, so Baalot does not claim ballots are hidden from Baalot itself.",
  },
  {
    q: "How can a voter check that their vote was counted?",
    a: "Every accepted ballot is sealed into a tamper-evident hash-chain, and the voter gets a cryptographic receipt. Anyone can verify the chain through Baalot's public verification API; altering any past ballot would break every hash after it.",
  },
  {
    q: "Is Baalot a blockchain voting app?",
    a: "No. Baalot's audit chain is a tamper-evident hash-chain that Baalot operates, not a blockchain. No ballot, vote or result is recorded on any blockchain.",
  },
  {
    q: "Does Baalot verify voters with NIN or BVN?",
    a: "Optionally. Voters can earn a verified-identity badge by checking their NIN or BVN with a liveness selfie and face match, provided through Prembly. Baalot does not connect directly to NIMC or the CBN.",
  },
  {
    q: "How much does Baalot cost?",
    a: "The Starter plan is free for up to 500 voters and one active election. The Institution plan is ₦150,000 per election with unlimited voters. Enterprise pricing is custom for government bodies and large organisations.",
  },
  {
    q: "How do I run an election on Baalot?",
    a: "Request access at baalot.site/contact. Once your institution is set up, administrators create positions, candidates and eligibility rules in the admin console, schedule when voting opens and closes, and follow live tallies and final results.",
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};
