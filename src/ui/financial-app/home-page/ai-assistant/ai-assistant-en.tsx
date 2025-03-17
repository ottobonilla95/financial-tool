import React from "react";

export const AIAssistantEn = () => {
  return (
    <section id="ai-assistant" className="tracking-tight">
      <div className="flex justify-center py-5">
        <img
          src={`/images/ai-robot.png`}
          className="w-[150px] sm:max-w-[500px]"
          alt="AI financial assistant illustration"
        />
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">
        Your AI Financial Assistant
      </h2>
      <p className="text-lg mb-6">
        Imagine having a financial advisor helping you make better decisions
        every day. <br />
        With <strong>TrackMySpend</strong>,{" "}
        <span className="text-green-600 font-semibold">
          artificial intelligence
        </span>{" "}
        analyzes your financial habits and provides personalized advice in
        real-time.
      </p>
      <ul className="text-lg mb-6 space-y-4 text-left inline-block">
        <li>
          🤖 <strong>Analyzes your financial history</strong> to detect patterns
          and help you better understand your money.
        </li>
        <li>
          💰 <strong>Gives you personalized savings recommendations</strong>
          based on your spending and financial habits.
        </li>
        <li>
          🎯 <strong>Highlights your financial achievements</strong> and
          motivates you to keep improving your finances.
        </li>
        <li>
          📌 <strong>Provides actionable tips</strong> on how to optimize your
          expenses month by month.
        </li>
      </ul>
      <p className="text-lg mb-6 font-semibold text-green-600">
        🚀 Let AI do the hard work for you and take control of your finances
        intelligently.
      </p>
      {/* <Button
        className="!py-10 !font-bold mt-4 !text-xl group rounded-lg bg-green-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px]"
        icon={<SparklesIcon className="w-6 h-6 text-white" />}
        iconPosition="left"
      >
        👉 Start for free today and let AI optimize your finances
      </Button> */}
    </section>
  );
};
