'use client'
import React, { useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const faqs = [
  {
    question: "What is ChatSaaS?",
    answer: "ChatSaaS is a versatile AI-powered chat template designed for building SaaS applications. It provides a foundation for creating customized chat-based solutions across various industries."
  },
  {
    question: "How can I use ChatSaaS?",
    answer: "You can use ChatSaaS as a starting point for your own SaaS project. Clone the repository, customize the components and functionality to fit your specific needs, and deploy your application."
  },
  {
    question: "What features does ChatSaaS include?",
    answer: "ChatSaaS includes essential features such as user authentication, real-time chat functionality, customizable UI components, and integration with popular AI models. It's designed to be easily extendable and customizable."
  },
  {
    question: "Is ChatSaaS suitable for beginners?",
    answer: "Yes, ChatSaaS is designed with both beginners and experienced developers in mind. It comes with clear documentation and a modular structure that makes it easy to understand and modify."
  },
  {
    question: "Can I integrate my own AI model with ChatSaaS?",
    answer: "Absolutely! ChatSaaS is built to be flexible. While it comes with some pre-configured AI integrations, you can easily adapt it to work with your preferred AI model or service."
  },
  {
    question: "Is ChatSaaS free to use?",
    answer: "Yes, ChatSaaS is an open-source project and free to use. However, please make sure to review the license terms for any limitations on commercial use or redistribution."
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-24 sm:py-32" id="faq">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently Asked Questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="pt-6">
                <dt>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-start justify-between text-left text-gray-900"
                  >
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronUpIcon
                        className={`${openIndex === index ? 'rotate-180 transform' : ''} h-6 w-6 text-gray-600`}
                      />
                    </span>
                  </button>
                </dt>
                {openIndex === index && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}