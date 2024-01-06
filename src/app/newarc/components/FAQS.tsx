import classNames from "@/utils/ClassNames";
import Container from "@/components/Container";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export default function FAQS({FAQs}: {FAQs: any[]}) {
    return <Container className="xl:px-0 pb-20" parentClassName="w-full bg-reef">
        <div className="space-y-4 pt-20 pb-8">
            <h2
                className={classNames(
                    "font-sans",
                    'text-5xl max-w-2xl mx-auto font-bold leading-none text-bermuda text-center capitalize',
                )}
            >
                Frequently Asked Questions about Custom Writing.
            </h2>
            <p className="text-2xl lg:max-w-lg mx-auto text-center tracking-tight text-slate-600">
                What to expect in this virtual service?
            </p>
        </div>
        <Accordion type="single" collapsible className="max-w-7xl">
            {FAQs.map((faq, faqIdx) => (
                <AccordionItem key={faqIdx} value={faqIdx + faq.name}>
                    <AccordionTrigger>
                        <div className="prose">
                            <h3>{faq.name}</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="prose">
                            <p>{faq.description}</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </Container>
}