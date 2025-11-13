// src/feature/market/messageAPI.js

const LS_KEY = "flea_market_messages_v2";
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const readAll = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
};
const writeAll = (obj) => localStorage.setItem(LS_KEY, JSON.stringify(obj));

const makeKey = ({ listingId, buyerId, sellerId }) =>
  `${listingId}::${buyerId}::${sellerId}`;

export const messageAPI = {
 
  getConversation: async ({ listingId, buyerId, sellerId }) => {
    const all = readAll();
    const key = makeKey({ listingId, buyerId, sellerId });
    return all[key]?.messages || [];
  },

  send: async ({ listingId, buyerId, sellerId, senderId, senderName, text }) => {
    const all = readAll();
    const key = makeKey({ listingId, buyerId, sellerId });
    const now = Date.now();
    const msg = { id: uid(), senderId, senderName, text: String(text || "").trim(), createdAt: now };

    if (!all[key]) {
      all[key] = { listingId, buyerId, sellerId, messages: [] };
    }
    all[key].messages.push(msg);
    writeAll(all);
    return msg;
  },

  
  listBySeller: async (sellerId, { listingId } = {}) => {
    const all = readAll();
    const rows = [];
    for (const key in all) {
      const conv = all[key];
      if (conv.sellerId !== sellerId) continue;
      if (listingId && conv.listingId !== listingId) continue;
      if (!conv.messages?.length) continue;
      rows.push({
        key,
        listingId: conv.listingId,
        buyerId: conv.buyerId,
        sellerId: conv.sellerId,
        last: conv.messages[conv.messages.length - 1],
        count: conv.messages.length,
      });
    }
   
    rows.sort((a, b) => (b.last?.createdAt || 0) - (a.last?.createdAt || 0));
    return rows;
  },
};
