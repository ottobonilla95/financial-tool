import React from "react";

export type AIAssistantProps = {};

export const AIAssistant = ({}: AIAssistantProps) => {
  return (
    <section id="ai-assistant" className="tracking-tight">
      <div className="flex justify-center py-5">
        <img
          src={`/images/ai-robot.png`}
          className="w-[150px] sm:max-w-[500px]"
          alt="Screenshots of the dashboard project showing desktop version"
        />
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">
        Tu asistente financiero con IA
      </h2>
      <p className="text-lg mb-6">
        ¿Imaginas tener un asesor financiero que te ayude a tomar mejores
        decisiones cada día? <br />
        Con <strong>TrackMySpend</strong>, la{" "}
        <span className="text-green-600 font-semibold">
          inteligencia artificial
        </span>{" "}
        analiza tus hábitos financieros y te brinda consejos personalizados en
        tiempo real.
      </p>
      <ul className="text-lg mb-6 space-y-4 text-left inline-block">
        <li>
          🤖 <strong>Analiza tu historial financiero</strong> para detectar
          patrones y ayudarte a entender mejor tu dinero.
        </li>
        <li>
          💰 <strong>Te da recomendaciones de ahorro personalizadas</strong>{" "}
          basadas en tus gastos y hábitos financieros.
        </li>
        <li>
          🎯 <strong>Destaca tus logros financieros</strong> y te motiva a
          seguir mejorando tu economía.
        </li>
        <li>
          📌 <strong>Te ofrece tips accionables</strong> sobre cómo optimizar
          tus gastos mes a mes.
        </li>
      </ul>
      <p className="text-lg mb-6 font-semibold text-green-600">
        🚀 Deja que la IA haga el trabajo difícil por ti y toma el control de
        tus finanzas con inteligencia.
      </p>
      {/* <Button
        className="!py-10 !font-bold mt-4 !text-xl group rounded-lg bg-green-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px]"
        icon={<SparklesIcon className="w-6 h-6 text-white" />}
        iconPosition="left"
      >
        👉 Empieza gratis hoy y deja que la IA optimice tus finanzas
      </Button> */}
    </section>
  );
};
