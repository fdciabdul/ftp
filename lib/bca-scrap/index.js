const parser = require('./lib/parser');

module.exports = {
  getBalance: async (username, password) => {
    try {
      const IP = await parser.getIP();
      await parser.login(username, password, IP);
      await parser.openSettlementMenu();
      const balance = await parser.balance();
      await parser.logout();
      return balance;
    } catch (err) {
      await parser.logout();
      throw err;
    }
  },

  getSettlement: async (username, password,tanggalto , bulanto , tanggal, bulan) => {
    try {
      const IP = await parser.getIP();
      await parser.login(username, password, IP);
      await parser.openSettlementMenu();
      const settlement = await parser.settlement(tanggalto , bulanto , tanggal, bulan);
      await parser.logout();
      return settlement;
    } catch (err) {
      await parser.logout();
      throw err;
    }
  }
};
