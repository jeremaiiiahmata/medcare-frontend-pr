import { DrugInteraction } from "../models/DrugInteractionInterface";

interface Props {
  interaction: DrugInteraction;
}

const Interaction = ({ interaction }: Props) => {
  const statusStyle = (severity: string) => {
    switch (severity) {
      case "Minor":
        return "border-teal-500 bg-teal-50";
      case "Moderate":
        return "border-yellow-500 bg-yellow-100";
      case "Major":
        return "border-rose-500 bg-rose-100";
    }
  };

  return (
    <div
      className={`border-l-4 ${statusStyle(
        interaction.severity
      )} p-2 rounded-md`}
    >
      <p className="font-bold text-lg">
        {interaction.drug_a} + {interaction.drug_b}
      </p>
      <p className="text-sm">
        <strong>Severity: </strong>
        <span
          className={` font-semibold
            ${
              interaction.severity === "Minor"
                ? "text-teal-500"
                : interaction.severity === "Moderate"
                ? "text-amber-500"
                : "text-rose-500"
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
