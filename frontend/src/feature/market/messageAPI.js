// src/feature/market/messageAPI.js

import { axiosPost } from '../../utils/dataFetch.js';

const LS_KEY = "flea_market_messages_v2";
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const readAll = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
};
const writeAll = (obj) => localStorage.setItem(LS_KEY, JSON.stringify(obj));

const makeKey = ({ fleaKey, buyerId, sellerId }) =>
  `${fleaKey}::${buyerId}::${sellerId}`;

export const messageAPI = {
 
  getConversation: async ({ fleaKey, buyerId, sellerId }) => {
    try {
       const url = "/market/getBuyerMsg";
       const payload = { fleaKey, buyerId, sellerId };
       const result = await axiosPost(url, payload);
       return result;
    } catch (error) {
       console.error("구매자 문의 내용 select 실패:", error);
       throw error;
    }
  },

  send: async ({ fleaKey, buyerId, sellerId, senderId, senderName, inquiryMsg }) => {
    try {
       const url = "/market/sendMsg";
       const payload = { fleaKey, buyerId, sellerId, senderId, senderName, inquiryMsg };
       const result = await axiosPost(url, payload);
       return result;
    } catch (error) {
       console.error("구매자 문의 내용 insert 실패:", error);
       throw error;
    }
  },
  
  listBySeller: async (sellerId, { fleaKey } = {}) => {
    try {
      let rows = [];
      const url = "/market/getSellerMsg";
      const params = { sellerId, fleaKey };
      if (fleaKey) params.fleaKey = fleaKey;

      const convList = await axiosPost(url, params);
      rows = Object.values(
        convList.reduce((acc, msg) => {
          const groupKey = `${msg.fleaKey}::${msg.buyerId}`;

          if (!acc[groupKey]) {
            // 처음 메시지 저장
            acc[groupKey] = {
              fleaKey: msg.fleaKey,
              buyerId: msg.buyerId,
              senderName: msg.senderName,
              sellerId: msg.sellerId,
              last: msg,
              count: 1,
            };
          } else {
            acc[groupKey].count++;

            if (msg.msgId > acc[groupKey].last.msgId) {
              acc[groupKey].last = msg;
            }
          }

          return acc;
        }, {})
      )
      .sort((a, b) => new Date(b.last.createdAt) - new Date(a.last.createdAt));
        console.log("rows -> ", rows)
      return rows;

    } catch (error) {
      console.error("거래별 메시지 처리 중 에러 발생:", error);
      return [];
    }
  },
};
