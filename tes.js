const Slimbot = require("slimbot");
const slimbot = new Slimbot("2018545141:AAGWponPNzISOAFAIS4w91a-AWeHfvIVZGs");
const moment = require("moment-timezone");
const now = moment();
const db = require("./lib/db");
const qrcode = require("qrcode-terminal");
// const config = require("./config");
// const tunggu = require("delay");
// 
const {
  WAConnection,
  MessageType,
  Presence,
  MessageOptions,
  Mimetype,
  WALocationMessage,
  WA_MESSAGE_STUB_TYPES,
  ReconnectMode,
  ProxyAgent,
  waChatKey,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const bca = require("mutasi-bca");
var tgl = now.format("DD");
var bln = now.format("MM");
var thn = now.format("YY");
var jam = now.tz('Asia/Jakarta').format("HH:mm:ss");


////////// USERNAME DAN PASS IBANKING


var username = "wistaryo0982";
var password = "888999";


//////////////////
// Register listeners
const conn = new WAConnection();
conn.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
  console.log(`[ ${moment().format("HH:mm:ss")} ] Please Scan QR with app!`);
});
conn.on("open", () => {
  // save credentials whenever updated
  console.log(`credentials updated!`);
  const authInfo = conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
  fs.writeFileSync("./auth_info.json", JSON.stringify(authInfo, null, "\t")); // save this info to a file
});
// uncomment the following line to proxy the connection; some random proxy I got off of: https://proxyscrape.com/free-proxy-list
//conn.connectOptions.agent = ProxyAgent ('http://1.0.180.120:8080')
fs.existsSync("./auth_info.json") && conn.loadAuthInfo("./auth_info.json");
conn.connect();

conn.on("user-presence-update", (json) =>
  console.log(json.id + " presence is " + json.type)
);
conn.on("message-status-update", (json) => {
  const participant = json.participant ? " (" + json.participant + ")" : ""; // participant exists when the message is from a group
  console.log(
    `${json.to}${participant} acknlowledged message(s) ${json.ids} as ${json.type}`
  );
});

var validation = {
  isEmailAddress: function(str) {
    var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(str); // returns a boolean
  },
  isNotEmpty: function(str) {
    var pattern = /\S+/;
    return pattern.test(str); // returns a boolean
  },
  isNumber: function(str) {
    var pattern = /^\d+$/;
    return pattern.test(str); // returns a boolean
  },
  isSame: function(str1, str2) {
    return str1 === str2;
  },
};


(async function() {
 setInterval(async() => {
  const waktu = await db.custom('SELECT * FROM setting');

  console.log(waktu[0].delay);
  var minutes = waktu[0].delay, the_interval = minutes * 60 * 1000;
  const [akunnya ]= await db.custom('SELECT username,password FROM akun ORDER BY RAND() LIMIT 1;');
 console.log(the_interval);
  // 

     setInterval(async () => {
 
      const detailakun = await bca.getBalance(akunnya.username, akunnya.password);
    const result = await bca.getSettlement(akunnya.username, akunnya.password);

    console.log(detailakun);

    console.log(result);
    for (var i = 0; i < result.length; i++) {
      const masukin = await db.mutasiakun(JSON.stringify(result[i]));

      var data;

      if (result[i].Jenis === "DB") {
        data = `
Mutasi Baru BCA - ${detailakun.norek} (${detailakun.nama}):
    
Tanggal : ${tgl + "-" + bln + "-" + thn}
Jam : ${jam}
Jenis : Dana Keluar
Jumlah : Rp.${result[i].Jumlah}   
Keterangan : ${result[i].Keterangan}

Saldo : Rp ${result[i].Saldo}

===========
Saldo Akun: Rp.${detailakun.saldo.replace(":",'')} (${detailakun.nama}) 
     `;
      } else if (result[i].Jenis === "CR") {
        data = `
Mutasi Baru BCA - ${detailakun.norek} (${detailakun.nama}) :
    
Tanggal : ${tgl + "-" + bln + "-" + thn}
Jam : ${jam}
Jenis : Dana Masuk
Jumlah : Rp.${result[i].Jumlah}   
Keterangan : ${result[i].Keterangan}

Saldo : Rp ${result[i].Saldo}

===========
Saldo Akun: Rp.${detailakun.saldo.replace(":",'')} (${detailakun.nama}) 
    `;
      }

      if (masukin === false) {
        console.log("DATA SUDAH ADA == SKIPPED");
      } else {
        conn.sendMessage("6281222222228@s.whatsapp.net",
          data,
          MessageType.text
        );
        slimbot.sendMessage(waktu[0].chatid, data);
      }
    }
    // Call API
  },the_interval);


}, 60000);

  // Message
  

  
  slimbot.on("message", (message) => {
    console.log(message);
    db.custom(`UPDATE setting SET chatid = '${message.chat.id}' WHERE setting.id = 1`).then(
      function(data) {
        // slimbot.sendMessage(message.chat.id, "Data di setting 5 menit");
      }
    );
    if (validation.isNumber(message.text) == true) {
      db.custom(
        `UPDATE setting SET whatsapp = '${message.text}' WHERE setting.id = 1`
      ).then(function(data) {
        slimbot.sendMessage(message.chat.id, "ok");
      });
    } else {
    }
    // define inline keyboard to send to user
   if (message.text === "/aplikasi") {
        let optionalParams = {
        parse_mode: "Markdown",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: "Restart", callback_data: "restart" },
              { text: "Suspend", callback_data: "suspend" },
              { text: "Mulai", callback_data: "mulai" },
            ],
          ],
        }),
      };
      slimbot.sendMessage(message.chat.id, "Are you sure ?", optionalParams);
      }
    if (message.text === "/setting") {
      let optionalParams = {
        parse_mode: "Markdown",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: "Delay", callback_data: "delay" },
              { text: "Nomor Whatsapp", callback_data: "nowa" },
              { text: "Tambah Akun Ibanking", callback_data: "akun" },
            ],
          ],
        }),
      };
      slimbot.sendMessage(message.chat.id, "Are you sure ?", optionalParams);
    }
    if (message.text.includes("|")){
      let user = message.text.split("|")[0];
      let pass = message.text.split("|")[1]
      db.custom(`INSERT INTO akun (id,username,password) VALUES (NULL, '${user}', '${pass}');`).then(
        function(data) {
          slimbot.sendMessage(query.message.chat.id, "Data di setting 5 menit");
        }
      );
    }
  });

  ///// AMBIL DATA TOMBOL 

  slimbot.on("callback_query", (query) => {
    console.log(query);

    if (query.data === "delay") {
      let optionalParams = {
        parse_mode: "Markdown",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: "5", callback_data: "5" },
              { text: "10", callback_data: "10" },
              { text: "15", callback_data: "15" },
            ],
          ],
        }),
      };
      slimbot.sendMessage(
        query.message.chat.id,
        "Pilih delay!",
        optionalParams
      );
    } else if (query.data === "nowa") {
      slimbot.sendMessage(query.message.chat.id, "Silahkan kirim nowa anda");
    } else if (query.data === "5") {
      db.custom(`UPDATE setting SET delay = '5' WHERE setting.id = 1`).then(
        function(data) {
          slimbot.sendMessage(query.message.chat.id, "Data di setting 5 menit");
        }
      );
    } else if (query.data === "10") {
      db.custom(
        `UPDATE setting SET delay = '10' WHERE setting.id = 1`
      ).then(function(data) {
        slimbot.sendMessage(query.message.chat.id, "Data di setting 10 menit");
      });
    } else if (query.data === "15") {
      db.custom(`UPDATE setting SET delay = '15' WHERE setting.id = 1`).then(
        function(data) {
          slimbot.sendMessage(
            query.message.chat.id,
            "Data di setting 15 menit"
          );
        }
      );
    }else if (query.data === "akun") {
      slimbot.sendMessage(query.message.chat.id, "isi username dengan format \n username|password");
    } else if (query.data === "restart") {
    // process.exit(1)
    slimbot.sendMessage(
            query.message.chat.id,
            "Aplikasi di Restart"
          );
    } else if (query.data === "suspend") {
    // process.exit(1)
    slimbot.sendMessage(
            query.message.chat.id,
            "Aplikasi di Suspend"
          );
    } else if (query.data === "mulai") {
    // process.exit(1)
    slimbot.sendMessage(
            query.message.chat.id,
            "Aplikasi di Mulai"
          );
    }
  });

  slimbot.startPolling();
})();
