// src/shared/utils/canvasUtils.ts

/**
 * URL로부터 이미지 객체를 생성하는 함수
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    // 크로스 도메인 이슈 방지 (외부 URL 이미지 사용 시 필요)
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

/**
 * 최종 크롭된 이미지를 생성하여 Blob URL 형태로 반환
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // 캔버스 크기를 자르려는 결과물 크기에 맞춤
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  //drawImage(원본이미지, 원본x, 원본y, 원본w, 원본h, 캔버스x, 캔버스y, 캔버스w, 캔버스h)
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // 캔버스 내용을 Blob(파일) 형태로 변환하여 URL 생성
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      resolve(window.URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
}
