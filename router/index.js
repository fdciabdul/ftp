const bca = require("mutasi-bca");
const db = require("../lib/db");
const fs = require("fs");
const moment = require('moment');
const now = moment();
var format = require("date-format");
function makeid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = async function (app) {
  app.get("/", function (req, res) {
    res.render("index",{
      inputdate: now.format('DD-MM-YYYY')
    });
  });

  app.post("/check", async function (req, res) {
    let dateskarang = now.format('DD-MM-YYYY');
    console.log(moment(req.body.date_begin).isBefore(dateskarang));
    if (moment(req.body.date_begin).isBefore(dateskarang) === true){
      // const masukin = await db.newdate(req.body.user ,   parseInt(datestart[0]),   parseInt(datestart[1]) ,dateend[0],dateend[1])
      // res.redirect("/get/"+ req.body.link)
  
  
    var id = makeid(5);
    var datestart = req.body.date_begin.toString().split(/-/g);
    var dateend = req.body.date_end.toString().split(/-/g);
    console.log(req.body.date_begin, req.body.date_end);

    const cekakun = await db.cekakun(req.body.user);
    // console.log(cekakun)
    if(cekakun === true){
      const balance = await bca.getBalance(req.body.user, req.body.pass);
     await db.insertakun(
        "",
        req.body.user,
        req.body.pass,
        balance[0].saldo,
        req.body.bank,
        balance[0].norek,
        id,
        datestart[0],
        datestart[1],
        dateend[0],
        dateend[1]
      );
      res.redirect("/get/"+id);
    }
 
    // console.log(datamutasikredit);
    // fs.writeFile('./filejson/'+req.body.user+'_mutasi_kredit.json', JSON.stringify(datamutasikredit),  {'flag':'a'},  function(err) {
    //          if (err) {
    //         console.error("gagal"+ err);

    //         }
    //     })

    //     fs.writeFile(req.body.user+'_mutasi_debit.json', JSON.stringify(datamutasidebit),  {'flag':'a'},  function(err) {
    //       if (err) {
    //      console.error("gagal"+ err);

    //      }
    //  })

    // res.redirect("/get/"+id);
  }else{
    res.render("error", {
      pesan : "Tanggal tidak boleh lebih besar dari 1 bulan hari ini"
    })
  }
 
  });
};
