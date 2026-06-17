import {
  AVATAR_REQUIREMENTS_TEXT,
  AVATAR_SIZE_PX,
  MAX_AVATAR_FILE_SIZE_BYTES,
  isAllowedAvatarMimeType
} from "@/lib/avatar-rules";

type ImageDimensions = {
  width: number;
  height: number;
};

function readPngDimensions(buffer: Buffer): ImageDimensions | null {
  const pngSignature = "89504e470d0a1a0a";

  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function readJpegDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    while (buffer[offset] === 0xff) {
      offset += 1;
    }

    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) {
      break;
    }

    if (offset + 2 > buffer.length) {
      break;
    }

    const segmentLength = buffer.readUInt16BE(offset);

    if (segmentLength < 2 || offset + segmentLength > buffer.length) {
      break;
    }

    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5)
      };
    }

    offset += segmentLength;
  }

  return null;
}

function readWebpDimensions(buffer: Buffer): ImageDimensions | null {
  if (
    buffer.length < 30 ||
    buffer.subarray(0, 4).toString("ascii") !== "RIFF" ||
    buffer.subarray(8, 12).toString("ascii") !== "WEBP"
  ) {
    return null;
  }

  const chunkType = buffer.subarray(12, 16).toString("ascii");

  if (chunkType === "VP8X" && buffer.length >= 30) {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { width, height };
  }

  if (chunkType === "VP8 " && buffer.length >= 30) {
    if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) {
      return null;
    }

    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff
    };
  }

  if (chunkType === "VP8L" && buffer.length >= 25 && buffer[20] === 0x2f) {
    const b1 = buffer[21];
    const b2 = buffer[22];
    const b3 = buffer[23];
    const b4 = buffer[24];

    return {
      width: 1 + (((b2 & 0x3f) << 8) | b1),
      height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
    };
  }

  return null;
}

export function readImageDimensions(buffer: Buffer): ImageDimensions | null {
  return (
    readPngDimensions(buffer) ||
    readJpegDimensions(buffer) ||
    readWebpDimensions(buffer)
  );
}

export async function validateAvatarFile(photo: File) {
  if (!isAllowedAvatarMimeType(photo.type)) {
    return {
      ok: false as const,
      error: AVATAR_REQUIREMENTS_TEXT
    };
  }

  if (photo.size > MAX_AVATAR_FILE_SIZE_BYTES) {
    return {
      ok: false as const,
      error: AVATAR_REQUIREMENTS_TEXT
    };
  }

  const buffer = Buffer.from(await photo.arrayBuffer());
  const dimensions = readImageDimensions(buffer);

  if (!dimensions) {
    return {
      ok: false as const,
      error: "Не удалось определить разрешение фото. Загрузите JPG, PNG или WebP."
    };
  }

  if (dimensions.width !== AVATAR_SIZE_PX || dimensions.height !== AVATAR_SIZE_PX) {
    return {
      ok: false as const,
      error: `Фото должно быть ровно ${AVATAR_SIZE_PX}x${AVATAR_SIZE_PX} px. Сейчас: ${dimensions.width}x${dimensions.height} px.`
    };
  }

  return {
    ok: true as const,
    buffer
  };
}
