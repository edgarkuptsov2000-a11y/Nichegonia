export const AVATAR_SIZE_PX = 512;
export const MAX_AVATAR_FILE_SIZE_BYTES = 1024 * 1024;
export const MAX_AVATAR_FILE_SIZE_MB = MAX_AVATAR_FILE_SIZE_BYTES / 1024 / 1024;

export const ALLOWED_AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
] as const;

export const AVATAR_REQUIREMENTS_TEXT = `Фото должно быть квадратным ${AVATAR_SIZE_PX}x${AVATAR_SIZE_PX} px, JPG/PNG/WebP, до ${MAX_AVATAR_FILE_SIZE_MB} МБ.`;

export function isAllowedAvatarMimeType(type: string) {
  return ALLOWED_AVATAR_MIME_TYPES.includes(
    type as (typeof ALLOWED_AVATAR_MIME_TYPES)[number]
  );
}

export function getAvatarExtensionByMimeType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}
