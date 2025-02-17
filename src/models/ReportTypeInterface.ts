import { DrugInteraction } from "./DrugInteractionInterface";
import { DosageAdjustment } from "./DosageAdjustmentInterface";

export interface ReportType {
    potential_drug_interactions: DrugInteraction[];
    dosage_adjustment_recommendations: DosageAdjustment[];
    final_recommendation: string;
}