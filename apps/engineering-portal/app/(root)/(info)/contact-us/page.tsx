import { poppins } from '@/app/fonts';

import ImageRibbon from '@/components/ui/image-ribbon';

import ContactUsForm from '@/features/contact-us/components/contact-us-form';

const ContactUs = () => {
  return (
    <>
      <ImageRibbon src="/contact.jpg" />

      <section
        className={
          poppins.className +
          ' text-black! px-5 font-medium my-13 max-w-[760px] mx-auto'
        }
      >
        <h1 className="border-b border-text-muted/15 text-3xl md:text-4xl lg:text-5xl py-2 mb-5 text-center">
          Contact us
        </h1>
        <p className="font-medium text-lg lg:text-[1.3rem]">
          Please fill in the details below so your enquiry reaches the right
          person.
        </p>

        <ContactUsForm />
      </section>
    </>
  );
};

export default ContactUs;
