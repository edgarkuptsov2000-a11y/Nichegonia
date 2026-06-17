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

function normalizeNumber(value?: string | null) {
  return String(value || "").trim().toUpperCase();
}

function parseFirstConvocationIndex(value?: string | null) {
  const normalized = normalizeNumber(value);
  const match = normalized.match(/^ПС-(\d+)$/);

  if (!match) {
    return null;
  }

  const index = Number(match[1]);

  if (!Number.isInteger(index) || index < 1 || index > FIRST_CONVOCATION_LIMIT) {
    return null;
  }

  return index;
}

export function isFirstConvocationNumber(value?: string | null) {
  return parseFirstConvocationIndex(value) !== null;
}

export function formatFirstConvocationNumber(index: number) {
  return `${FIRST_CONVOCATION_NUMBER_PREFIX}-${index}`;
}

export function getFallbackCitizenNumber(application: ApplicationForCitizen) {
  return (
    application.application_number ||
    `${DEFAULT_CITIZEN_NUMBER_PREFIX}-${String(application.id).padStart(6, "0")}`
  );
}

async function collectUsedFirstConvocationIndexes() {
  const usedIndexes = new Set<number>();

  const { data: applications, error: applicationsError } = await supabaseAdmin
    .from("applications")
    .select("application_number")
    .like("application_number", `${FIRST_CONVOCATION_NUMBER_PREFIX}-%`);

  if (applicationsError) {
    throw applicationsError;
  }

  for (const application of applications || []) {
    const index = parseFirstConvocationIndex(application.application_number);

    if (index !== null) {
      usedIndexes.add(index);
    }
  }

  const { data: citizens, error: citizensError } = await supabaseAdmin
    .from("citizens")
    .select("citizen_number")
    .like("citizen_number", `${FIRST_CONVOCATION_NUMBER_PREFIX}-%`);

  if (citizensError) {
    throw citizensError;
  }

  for (const citizen of citizens || []) {
    const index = parseFirstConvocationIndex(citizen.citizen_number);

    if (index !== null) {
      usedIndexes.add(index);
    }
  }

  return usedIndexes;
}

export async function getNextFirstConvocationNumber() {
  const usedIndexes = await collectUsedFirstConvocationIndexes();

  for (let index = 1; index <= FIRST_CONVOCATION_LIMIT; index += 1) {
    if (!usedIndexes.has(index)) {
      return index;
    }
  }

  return null;
}

export async function getNextApplicationNumber(applicationId: number) {
  const firstConvocationIndex = await getNextFirstConvocationNumber();

  if (firstConvocationIndex !== null) {
    return formatFirstConvocationNumber(firstConvocationIndex);
  }

  return `${DEFAULT_CITIZEN_NUMBER_PREFIX}-${String(applicationId).padStart(6, "0")}`;
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
    if (application.application_number !== existingCitizen.citizen_number) {
      const { error: applicationNumberError } = await supabaseAdmin
        .from("applications")
        .update({ application_number: existingCitizen.citizen_number })
        .eq("id", application.id);

      if (applicationNumberError) {
        throw applicationNumberError;
      }
    }

    return existingCitizen;
  }

  let citizenNumber = application.application_number || null;

  if (!isFirstConvocationNumber(citizenNumber)) {
    const firstConvocationIndex = await getNextFirstConvocationNumber();

    if (firstConvocationIndex !== null) {
      citizenNumber = formatFirstConvocationNumber(firstConvocationIndex);
    }
  }

  if (!citizenNumber) {
    citizenNumber = getFallbackCitizenNumber(application);
  }

  const title = isFirstConvocationNumber(citizenNumber)
    ? FIRST_CONVOCATION_TITLE
    : null;

  if (application.application_number !== citizenNumber) {
    const { error: applicationNumberError } = await supabaseAdmin
      .from("applications")
      .update({ application_number: citizenNumber })
      .eq("id", application.id);

    if (applicationNumberError) {
      throw applicationNumberError;
    }
  }

  const { data: createdCitizen, error: citizenError } = await supabaseAdmin
    .from("citizens")
    .insert([
      {
        application_id: application.id,
        full_name: application.full_name,
        country: application.country,
        application_number: citizenNumber,
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
