    const { JsonDatabase } = require("wio.db");


  const General = new JsonDatabase({
    databasePath: "./Database/settings.json"
  });

  const BList = new JsonDatabase({
    databasePath: "./Database/blacklist.json"
  });

  const tickets = new JsonDatabase({
    databasePath: "./Database/tickets.json"
  });

  const announce = new JsonDatabase({
    databasePath: "./Database/anunciar.json"
  });

  const welcomis = new JsonDatabase({
    databasePath: "./Database/boasvindas.json"
  });

  const products = new JsonDatabase({
    databasePath: "./Database/produtos.json"
  });

  const lojaInfo = new JsonDatabase({
    databasePath: "./Database/infoloja.json"
  });
  
  const carrinhos = new JsonDatabase({
    databasePath: "./Database/carrinhos.json"
  });

  const EmojIs = new JsonDatabase({
    databasePath: "./Database/emojis.json"
  });

  const Autos = new JsonDatabase({
    databasePath: "./Database/auto.json"
  });

  module.exports = {
    General,
    BList,
    tickets,
    announce,
    welcomis,
    products,
    lojaInfo,
    carrinhos,
    EmojIs,
    Autos
  }
