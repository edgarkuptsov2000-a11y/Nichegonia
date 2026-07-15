export interface PassportData {
  surname: string;
  givenName: string;

  nationality: string;
  country: string;

  passportNumber: string;

  issueDate: string;

  photoUrl: string;

  qrCode: string;

  status: string;

  birthDate?: string;
  birthPlace?: string;
  sex?: string;

  citizenTitle?: string;
}

export interface PassportProps {
  passport: PassportData;
}