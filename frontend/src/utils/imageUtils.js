export const srcOf = (item) => {
  const raw =
    typeof item === "string" ? item : item?.img || item?.image || "";

  // 누락 시 플레이스홀더
  if (!raw) return `${process.env.PUBLIC_URL}/images/placeholder.png`;

  // 외부 URL이면 그대로
  if (/^https?:\/\//i.test(raw)) return raw;

  // /images/... 형식이든 상대경로든 PUBLIC_URL 기준 절대경로 + 한글 인코딩
  const cleaned = raw.startsWith("/") ? raw : `/${raw}`;
  return `${process.env.PUBLIC_URL}${encodeURI(cleaned)}`;
};

// IndexedDB에서 데이터베이스를 설정하는 함수
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MarketDB", 1);

    // 스키마 업그레이드: DB 버전이 변경될 때마다 호출됨
    request.onupgradeneeded = function (e) {
      const db = e.target.result;
      // 'images'라는 objectStore 생성, 이미지 데이터를 저장
      if (!db.objectStoreNames.contains("images")) {
        const objectStore = db.createObjectStore("images", { keyPath: "key" });
      }
    };

    request.onsuccess = function (e) {
      resolve(e.target.result);
    };

    request.onerror = function (e) {
      reject("IndexedDB open error", e);
    };
  });
}

// 이미지 데이터를 IndexedDB에 저장하는 함수
export function saveImageToIndexedDB(key, base64Image) {
  return new Promise((resolve, reject) => {
    // IndexedDB 열기
    openDB().then((db) => {
      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");

      // 이미지를 저장할 데이터 형식
      const imageData = {
        key: key,
        base64: base64Image,
      };

      // 이미지 데이터를 objectStore에 추가
      const request = store.put(imageData);

      request.onsuccess = function () {
        resolve("Image saved successfully");
      };

      request.onerror = function (e) {
        reject("Failed to save image", e);
      };
    });
  });
}

// IndexedDB에서 이미지 데이터를 가져오는 함수
export function getImageFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction("images", "readonly");
      const store = transaction.objectStore("images");

      // key로 이미지 가져오기
      const request = store.get(key);

      request.onsuccess = function () {
        resolve(request.result ? request.result.base64 : null); // base64 형식 반환
      };

      request.onerror = function (e) {
        reject("Failed to get image", e);
      };
    });
  });
}

// IndexedDB에서 이미지 데이터를 삭제하는 함수
export function deleteImageFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");

      // key로 이미지 삭제
      const request = store.delete(key);

      request.onsuccess = function () {
        resolve("Image deleted successfully");
      };

      request.onerror = function (e) {
        reject("Failed to delete image", e);
      };
    });
  });
}

export const parseFleaList = (fleaListStr) => {
  try {
    // JSON 문자열을 배열로 변환
    const parsedList = JSON.parse(fleaListStr);
    if (Array.isArray(parsedList)) {
      return parsedList;
    }
  } catch (e) {
    console.error("Error parsing fleaList:", e);
  }
  return []; // 변환 실패 시 빈 배열 반환
};