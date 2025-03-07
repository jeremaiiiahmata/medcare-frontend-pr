import { DrugInteraction } from "../models/DrugInteractionInterface";

interface Props {
  interaction: DrugInteraction;
}

const Interaction = ({ interaction }: Props) => {
  const statusStyle = (severity: string) => {
    switch (severity) {
      case "Minor":
        return "border-amber-500 bg-amber-50";
      case "Moderate":
        return "border-rose-500 bg-rose-100";
      case "Major":
        return "border-fuchsia-500 bg-fuchsia-100";
    }
  };

  return (
    <div
      className={`border-l-4 ${statusStyle(
        interaction.severity
      )} p-2 rounded-md my-1`}
    >
      <p className="font-bold text-xl">
        {interaction.drug_a} + {interaction.drug_b}
      </p>
      <p className="text-sm">
        <strong>Severity: </strong>
        <span
          className={` font-semibold
            ${
              interaction.severity === "Minor"
                ? "text-amber-500"
                : interaction.severity === "Moderate"
                ? "text-rose-500"
                : "text-fuchsia-500"
            }
          `}
        >
          {interaction.severity}
        </span>
      </p>
      <p className="text-sm">
        <strong>Description:</strong> {interaction.description}
      </p>
      <p className="text-sm">
        <strong>Management:</strong> {interaction.management}
      </p>
    </div>
  );
};

export default Interaction;
