import { decrypt } from "./encryptionBooking";

function maskId(id: string) {
  if (!id) return "";

  if (id.length <= 7) {
    return id[0] + "*****" + id[id.length - 1];
  }

  const start = id.slice(0, 3);
  const end = id.slice(-2);

  return `${start}*****${end}`;
}

export function decryptBooking(booking: any) {
  const obj = booking?.toObject ? booking.toObject() : booking;

  try {
    if (obj?.passenger?.id_number) {
      const decrypted = decrypt(obj.passenger.id_number);
      obj.passenger.id_number = maskId(decrypted);
    }
  } catch (error) {
    console.warn("Failed to decrypt id_number");
  }

  return obj;
}
