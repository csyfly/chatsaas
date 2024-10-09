import { MessageSquareIcon, BrainIcon, UsersIcon, LockIcon, ZapIcon, BarChartIcon } from "lucide-react";

const Feature = () => {
  const features = [
    { name: 'Intelligent Conversational AI', description: 'Engage in natural, context-aware conversations with our advanced AI, capable of understanding complex queries and providing accurate responses', icon: MessageSquareIcon },
    { name: 'Customizable AI Models', description: 'Tailor the AI to your specific industry or use case, ensuring relevant and precise interactions for your unique business needs', icon: BrainIcon },
    { name: 'Multi-User Collaboration', description: 'Enable seamless teamwork with shared conversations, knowledge bases, and collaborative AI training sessions', icon: UsersIcon },
    { name: 'Enterprise-Grade Security', description: 'Protect your sensitive data with end-to-end encryption, role-based access control, and compliance with industry standards', icon: LockIcon },
    { name: 'Rapid Integration', description: 'Easily integrate ChatSaaS into your existing systems with our comprehensive API and pre-built connectors for popular platforms', icon: ZapIcon },
    { name: 'Advanced Analytics', description: 'Gain valuable insights into user interactions, AI performance, and business impact with our powerful analytics dashboard', icon: BarChartIcon },
  ]
  
  return (
    <div>
     {/* Features section */}
     <div id="features" className="bg-white py-6 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Empower Your Business</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Key Features of ChatSaaS
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Transform your customer interactions with our cutting-edge AI-powered chatbot platform
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg">{feature.name}</h3>
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Feature;