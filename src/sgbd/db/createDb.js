const fs = require("fs");

const dir = "./20230915";

const fileNames = fs.readdirSync(dir);

const db = {};

fileNames.forEach(fileName => {
	const originFileName = `${dir}/${fileName}`;
	const leituras = require(originFileName);

  leituras.forEach(leitura => {
    const id = leitura['ID EQP'];

    if (db[id]) {
      db[id].leituras.push({
        horario: `${leitura['DATA HORA']}.${leitura['MILESEGUNDO']}`,
        faixa: leitura['FAIXA'],
        velocidade_aferida: parseFloat(leitura['VELOCIDADE AFERIDA']),
        classificacao: leitura['CLASSIFICAÇÃO'],
        tamanho: parseFloat(leitura['TAMANHO'])
      })
    }
    else {
      db[id] = {
        numero_serie: leitura['NUMERO DE SÉRIE'],
        latitude: parseFloat(leitura['LATITUDE']),
        longitude: parseFloat(leitura['LONGITUDE']),
        endereco: leitura['ENDEREÇO'],
        sentido: leitura['SENTIDO'],
        velocidade_permitida: parseInt(leitura['VELOCIDADE DA VIA']),
        leituras: [
          {
            horario: `${leitura['DATA HORA']}.${leitura['MILESEGUNDO']}`,
            faixa: leitura['FAIXA'],
            velocidade_aferida: parseFloat(leitura['VELOCIDADE AFERIDA']),
            classificacao: leitura['CLASSIFICAÇÃO'],
            tamanho: parseFloat(leitura['TAMANHO'])
          }
        ]
      }
    }
  })
});

fs.writeFileSync("./db.json", JSON.stringify(db), { encoding: "utf-8" });
