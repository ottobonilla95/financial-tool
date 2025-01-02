import { Emotion } from "@/src/types";

export const ExpenseSatisfactionIcon = ({
  satisfaction,
}: {
  satisfaction: number;
}) => {
  if (satisfaction === 1) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Muy insatisfecho"
      >
        &#128534;
      </div>
    );
  }
  if (satisfaction === 2) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Insatisfecho"
      >
        &#128530;
      </div>
    );
  }
  if (satisfaction === 3) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Neutral"
      >
        &#128578;
      </div>
    );
  }
  if (satisfaction === 4) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Satisfecho"
      >
        &#128512;
      </div>
    );
  }
  if (satisfaction === 5) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Muy satisfecho"
      >
        &#128513;
      </div>
    );
  }
};

export const ExpenseEmotionIcon = ({ emotionType, name }: Partial<Emotion>) => {
  if (emotionType === "positive") {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={name}
      >
        &#128513;
      </div>
    );
  }

  if (emotionType === "negative") {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={name}
      >
        &#128533;
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer"
      data-tooltip-id="my-tooltip"
      data-tooltip-content={name}
    >
      &#128578;
    </div>
  );
};
