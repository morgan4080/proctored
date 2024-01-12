import classNames from "@/utils/ClassNames";
import Container from "@/components/Container";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {FaqType} from "@/lib/service_types";

export default function FAQS({Faqs}: Readonly<{ Faqs: FaqType[] }>) {
    return <Container className="xl:px-0 pb-20" parentClassName="w-full bg-white">
        <div className="space-y-4 pt-20 pb-20">
            <div
                className={classNames(
                    "font-sans",
                    'text-4xl max-w-xl lg:max-w-7xl font-bold leading-none tracking-tight text-bermuda text-left',
                )}
            >
                <h2 className="max-w-5xl leading-snug">Frequently Asked Questions about Custom Writing.</h2>
            </div>
            <p className="text-2xl mx-auto text-left tracking-tight text-slate-600">
                What to expect in this virtual service?
            </p>
        </div>
        <Accordion type="single" collapsible className="max-w-7xl">
            {Faqs.map((faq, faqIdx) => (
                <AccordionItem key={`${faqIdx + faq.name}`} value={faqIdx + faq.name}>
                    <AccordionTrigger>
                        <div className="prose">
                            <h3 className="text-left">{faq.name}</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="prose">
                            <p className="text-left">{faq.description}</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </Container>
}