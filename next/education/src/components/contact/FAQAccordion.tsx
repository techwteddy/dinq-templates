import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQAccordion() {
  const faqs = [
    {
      question: 'How do I reset my student password?',
      answer:
        'You can reset your password through the IT portal or by visiting the IT Help Desk in person with your student ID.',
    },
    {
      question: 'Where can I find my course schedule?',
      answer:
        "Course schedules are available in the Student Dashboard under the 'My Courses' section.",
    },
    {
      question: 'When is the deadline for financial aid applications?',
      answer:
        'Priority deadlines for financial aid are usually March 1st for the Fall semester and October 1st for the Spring semester.',
    },
    {
      question: 'Can I schedule a campus tour?',
      answer:
        'Yes, campus tours are available every weekday at 10am and 2pm. Please register through the Admissions page.',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
