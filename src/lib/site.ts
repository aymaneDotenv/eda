/** Site behavior aligned with the original Google Sites + domir.edu.it */

export const SCHOOL_PHONE = "0464485511";
export const SCHOOL_PHONE_DISPLAY = "0464 485511";
export const SCHOOL_PHONE_TEL = "tel:+390464485511";

export const SCHOOL_EMAIL = "segreteria.eda@domir.it";

export const ENROLLMENT_BOOKING_URL =
  "https://registroelettronico.nettunopa.it/isccpia/?id=120101";

/** When the old site said the colloquio booking link would go live */
export const ENROLLMENT_BOOKING_ACTIVE_FROM = new Date("2026-08-10");

export const PRESS_ARTICLE_URL =
  "https://lavocedeltrentino.it/author/federicaan/";

export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/user/DonMilaniRovereto";

export const UNISTRASI_URL = "https://www.unistrapg.it";

export function isEnrollmentBookingActive(now = new Date()) {
  return now >= ENROLLMENT_BOOKING_ACTIVE_FROM;
}
