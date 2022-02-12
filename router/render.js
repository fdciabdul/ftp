const bca = require("mutasi-bca");
const db = require("../lib/db");
const moment = require('moment');
const now = moment();
module.exports = async function (app) {
  app.get("/get/:id", async(req, res, next) => {
    try {
    
      const akun = await db.checklink(req.params["id"]);
      var datenya = now.format('YYYY');
      var tanggal = akun[0].tanggalawal +'-'+akun[0].bulanawal+'-'+ datenya ;
      var tanggal2 = akun[0].tanggalakhir+'-'+akun[0].bulanakhir+ '-'+ datenya


      const result = await bca.getSettlement(
        akun[0].username,
        akun[0].password,
        akun[0].tanggalawal,
        akun[0].bulanawal,
        akun[0].tanggalakhir,
        akun[0].bulanakhir
      );
     
     console.log(akun);
      res.render("render", {
        username: "",
        result: result,
        akun: akun[0],
        tanggal : tanggal ,
        tanggal1 : tanggal2,
        inputdate: now.format('DD-MM-YYYY')
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  });
 
  app.post("/update-tgl", async(req,res) =>{
    let dateskarang = now.format('DD-MM-YYYY');
    var datestart = req.body.date.toString().split(/-/g);
    var dateend = req.body.date1.toString().split(/-/g);
    if (moment(req.body.date).isBefore(dateskarang) === true){
    await db.newdate(req.body.user ,   parseInt(datestart[0]),   parseInt(datestart[1]) ,dateend[0],dateend[1])
    res.redirect("/get/"+ req.body.link)
    }else{
      res.render("error", {
        pesan : "Tanggal tidak boleh lebih besar dari 1 bulan hari ini"
      })
    }
  })
};
