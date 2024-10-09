const HomeGuide = () => {
    const steps = [
        { title: "DEMO: Start a blog", subtitle: "Set up a personal website" },
        { title: "DEMO: Write content", subtitle: "Create 5 blog posts" },
        { title: "DEMO: Promote blog", subtitle: "Share on social media" },
        { title: "DEMO: Analyze traffic", subtitle: "Review visitor statistics" },
        { title: "DEMO: Improve and expand", subtitle: "Add new features and content" }
    ];

    return (
        <div className="container mx-auto px-6 py-6">
            <h1 className="text-3xl font-medium text-gray-700 mb-6">Setting Guide</h1>
            <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center w-1/5">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-2">
                            {index + 1}
                        </div>
                        <h3 className="text-center font-semibold mb-1">{step.title}</h3>
                        <h3 className="text-center font-normal">{step.subtitle}</h3>
                    </div>
                ))}
            </div>
            {/* 这里可以添加更多内容,如每个步骤的详细说明 */}
        </div>
    )
}

export default HomeGuide;