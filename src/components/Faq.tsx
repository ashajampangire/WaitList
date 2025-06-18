import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is NEFTIT?",
    answer:
      "NEFTIT is a gamified Web3 platform that helps you earn free NFTs and NEFT Points by completing simple social and on-chain tasks for partnered projects. You participate in campaigns, earn NFTs, and upgrade or stake them for more rewards.",
  },
  {
    question: "How can I start using NEFTIT?",
    answer:
      "Just connect your wallet, complete tasks from any active campaign, and start earning rewards for free.",
  },
  {
    question: "Can I sell my NEFTIT NFTs?",
    answer:
      "Yes! Once claimed, your NFTs are minted on-chain and can be listed on marketplaces.",
  },
  {
    question: "Can I upgrade my NFT?",
    answer:
      "Yes. NEFTIT lets you burn multiple lower-tier NFTs to upgrade to a higher rarity, unlocking more NEFT Points, perks, or access in future campaigns.",
  },
  {
    question: "What chains are supported?",
    answer:
      "You can claim NFTs on multiple chains! (depending on campaign and project).",
  },
  {
    question: "Can I use multiple wallets or accounts?",
    answer:
      "No. NEFTIT uses strict Sybil and bot protection systems. Users trying to farm using multiple wallets or fake tasks may be flagged, lose access to rewards, or be banned.",
  },
  {
    question: "What happens if my account is flagged?",
    answer:
      "You’ll see a warning in your dashboard. If flagged, your tasks may not count toward rewards until reviewed. Repeated abuse will result in suspension.",
  },
];

const Faq = () => {
  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl space-y-8 my-6 md:my-10 mx-auto font-sans">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-md">
          Frequently Asked Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="backdrop-blur-md bg-white/10 border border-[#5D43EF]/30 rounded-3xl px-6 "
          >
            <AccordionTrigger className="text-left text-lg sm:text-xl font-medium text-white hover:no-underline">
              <div className="flex items-center text-left gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#5D43EF] to-[#3B5EFB] shadow-md mr-2">
                  <HelpCircle className="h-5 w-5 text-white" />
                </span>
                <span>{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-zinc-200 text-base font-normal leading-relaxed pl-12 pt-2 pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
