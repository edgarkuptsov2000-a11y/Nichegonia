import jsPDF from "jspdf";
import QRCode from "qrcode";


export async function generatePassportPdf({
  fullName,
  country,
  passportNumber,
  issueDate,
  status,
  photoUrl
}: {
  fullName: string;
  country: string;
  passportNumber: string;
  issueDate: string;
  status: string;
  photoUrl?: string;
}) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 297;
  const pageHeight = 210;

  pdf.setFillColor(248, 243, 232);
pdf.rect(0, 0, pageWidth, pageHeight, "F");

pdf.setFillColor(17, 17, 17);
pdf.rect(0, 0, 95, pageHeight, "F");

pdf.setTextColor(201, 166, 70);

pdf.setFontSize(12);
pdf.text("ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА", 47, 40, {
  align: "center"
});

pdf.setFontSize(26);
pdf.text("НИЧЕГОНИЯ", 47, 70, {
  align: "center"
});

pdf.setFontSize(24);
pdf.text("ПАСПОРТ", 47, 120, {
  align: "center"
});

pdf.setFontSize(11);
pdf.text("ГРАЖДАНИНА НИЧЕГОНИИ", 47, 135, {
  align: "center"
});

pdf.setDrawColor(216, 200, 168);
pdf.line(95, 0, 95, pageHeight);

pdf.setTextColor(17, 17, 17);

pdf.setFontSize(22);

pdf.text(
  "ПАСПОРТ ГРАЖДАНИНА НИЧЕГОНИИ",
  110,
  25
);

if (photoUrl) {
  const response = await fetch(photoUrl);
  const blob = await response.blob();

  const base64 = await new Promise<string>(
    (resolve) => {
      const reader = new FileReader();

      reader.onload = () =>
        resolve(reader.result as string);

      reader.readAsDataURL(blob);
    }
  );

  pdf.addImage(
    base64,
    "JPEG",
    110,
    40,
    40,
    55
  );
}

pdf.setFontSize(13);

pdf.text(
  `ФИО: ${fullName}`,
  165,
  50
);

pdf.text(
  `Страна: ${country}`,
  165,
  65
);

pdf.text(
  `Паспорт: ${passportNumber}`,
  165,
  80
);

pdf.text(
  `Дата выдачи: ${issueDate}`,
  165,
  95
);

pdf.text(
  `Статус: ${status}`,
  165,
  110
);

pdf.setDrawColor(20, 60, 180);

pdf.setTextColor(20, 60, 180);

pdf.circle(
  250,
  160,
  25
);

pdf.text(
  "ОДОБРЕНО",
  250,
  160,
  {
    align: "center"
  }
);


const verifyUrl =
`${window.location.origin}/verify?number=${passportNumber}`;

const qr = await QRCode.toDataURL(verifyUrl);

pdf.addImage(
  qr,
  "PNG",
  230,
  40,
  35,
  35
);

pdf.save(`passport-${passportNumber}.pdf`);
}


