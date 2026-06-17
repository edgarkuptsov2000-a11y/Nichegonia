import { supabaseAdmin } from "@/lib/supabase-admin";

export const FIRST_CONVOCATION_TITLE = "Ничегошка Первого Созыва";
export const FIRST_CONVOCATION_LIMIT = 10;
export const FIRST_CONVOCATION_NUMBER_PREFIX = "ПС";
export const DEFAULT_CITIZEN_NUMBER_PREFIX = "НЧ";

type ApplicationForCitizen = {
  id: number;
  full_name?: string | null;
  country?: string | null;
  application_number?: string | null;
};

export function getFallbackCitizenNumber(application: ApplicationForCitizen) {
  return (
    application.application_number ||
    `${DEFAULT_CITIZEN_NUMBER_PREFIX}-${String(application.id).padStart(6, "0")}`
  );
}

async function getNextFirstConvocationNumber() {
  const { count, error } = await supabaseAdmin
    .from("citizens")
    .select("id", {
      count: "exact",
      head: true
    })
    .eq("title", FIRST_CONVOCATION_TITLE);

  if (error) {
    throw error;
  }

  const usedCount = count ?? 0;

  if (usedCount >= FIRST_CONVOCATION_LIMIT) {
    return null;
  }

  return usedCount + 1;
}

export async function createCitizenForApprovedApplication(application: ApplicationForCitizen) {
  const { data: existingCitizen, error: existingError } = await supabaseAdmin
    .from("citizens")
    .select("id, citizen_number, title")
    .eq("application_id", application.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingCitizen) {
    return existingCitizen;
  }

  const firstConvocationNumber = await getNextFirstConvocationNumber();
  const isFirstConvocation = firstConvocationNumber !== null;

  const citizenNumber = isFirstConvocation
    ? `${FIRST_CONVOCATION_NUMBER_PREFIX}-${firstConvocationNumber}`
    : getFallbackCitizenNumber(application);

  const title = isFirstConvocation ? FIRST_CONVOCATION_TITLE : null;

  const { data: createdCitizen, error: citizenError } = await supabaseAdmin
    .from("citizens")
    .insert([
      {
        application_id: application.id,
        full_name: application.full_name,
        country: application.country,
        application_number: application.application_number,
        citizen_number: citizenNumber,
        status: "active",
        title
      }
    ])
    .select("id, citizen_number, title")
    .single();

  if (citizenError) {
    throw citizenError;
  }

  return createdCitizen;
}
