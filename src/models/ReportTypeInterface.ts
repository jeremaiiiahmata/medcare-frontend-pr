import { DrugInteraction } from "./DrugInteractionInterface";
import { DosageAdjustment } from "./DosageAdjustmentInterface";

export interface ReportType {
    interactions: DrugInteraction[];
    dosage_adjustments: DosageAdjustment[];
    final_recommendation: string;
}