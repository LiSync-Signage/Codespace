var database = require("../database/config");

function buscarUtlimasMedidasComponente(
  idTelevisao,
  tipoComponente,
  limite_linhas
) {
  sql = ``;

  if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
    sql = `SELECT date_format(dataHora,'%H:%i:%s') as dataRegistro, valor as usoComponente, 
        fkComponente as idComponente, comp.tipoComponente, tv.nomeTelevisao as nomeTv FROM 
        LogComponente JOIN Componente as comp ON fkComponente = idComponente
        JOIN Televisao as tv ON fkTelevisao = idTelevisao
        WHERE idTelevisao = ${idTelevisao} AND tipoComponente = '${tipoComponente}' 
        order by idLogComponente desc limit ${limite_linhas};`;
  } else if (process.env.AMBIENTE_PROCESSO == "producao") {
    sql = `
        SELECT
            CONVERT(VARCHAR(8), CAST(dataHora AS TIME), 108) AS dataRegistro,
            valor AS usoComponente,
            fkComponente AS idComponente,
            comp.tipoComponente,
            tv.nomeTelevisao AS nomeTv
        FROM
            LogComponente
            JOIN Componente AS comp ON fkComponente = idComponente
            JOIN Televisao AS tv ON fkTelevisao = idTelevisao
        WHERE
            idTelevisao = ${idTelevisao}
            AND tipoComponente = '${tipoComponente}'
        ORDER BY
            idLogComponente DESC
        OFFSET 0 ROWS FETCH NEXT ${limite_linhas} ROWS ONLY;`;
  } else {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n"
    );
    return;
  }

  console.log("Executando a instrução SQL: \n" + sql);
  return database.executar(sql);
}

function buscarMedidasComponenteEmTempoReal(idTelevisao, tipoComponente) {
  sql = ``;

  if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
    sql = `SELECT date_format(dataHora,'%H:%i:%s') as dataRegistro, valor as usoComponente, 
        fkComponente as idComponente, comp.tipoComponente, tv.nomeTelevisao as nomeTv FROM 
        LogComponente JOIN Componente as comp ON fkComponente = idComponente
        JOIN Televisao as tv ON fkTelevisao = idTelevisao 
        WHERE idTelevisao = ${idTelevisao} AND tipoComponente = '${tipoComponente}'
        order by idLogComponente desc limit 1;`;
  } else if (process.env.AMBIENTE_PROCESSO == "producao") {
    console.log("FOI SQL SERVER");

    sql = `SELECT
            CONVERT(VARCHAR(8), CAST(dataHora AS TIME), 108) AS dataRegistro,
            valor AS usoComponente,
            fkComponente AS idComponente,
            comp.tipoComponente,
            tv.nomeTelevisao AS nomeTv
        FROM
            LogComponente
            JOIN Componente AS comp ON fkComponente = idComponente
            JOIN Televisao AS tv ON fkTelevisao = idTelevisao
        WHERE
            idTelevisao = ${idTelevisao}
            AND tipoComponente = '${tipoComponente}'
        ORDER BY
            idLogComponente DESC
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;`;
  } else {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n"
    );
    return;
  }

  return database.executar(sql);
}

function buscarUltimaAtualizacaoComponente(idTelevisao, tipoComponente) {
  let sql = ``;

  if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
    sql = `SELECT 
                    date_format(dataHora,'%Y-%m-%d %H:%i:%s') as dataRegistro, 
                    valor as usoComponente, 
                    fkComponente as idComponente, 
                    comp.tipoComponente, 
                    tv.nomeTelevisao as nomeTv 
                FROM 
                    LogComponente 
                JOIN 
                    Componente as comp ON fkComponente = idComponente
                JOIN 
                    Televisao as tv ON fkTelevisao = idTelevisao 
                WHERE 
                    idTelevisao = ${idTelevisao} AND tipoComponente = '${tipoComponente}'
                ORDER BY 
                    idLogComponente DESC 
                LIMIT 1;`;
  } else if (process.env.AMBIENTE_PROCESSO == "producao") {
    sql = `
        SELECT
            dataHora AS dataRegistro,
            valor AS usoComponente,
            fkComponente AS idComponente,
            comp.tipoComponente,
            tv.nomeTelevisao AS nomeTv
        FROM
            LogComponente
            JOIN Componente AS comp ON fkComponente = idComponente
            JOIN Televisao AS tv ON fkTelevisao = idTelevisao
        WHERE
            idTelevisao = ${idTelevisao}
            AND tipoComponente = '${tipoComponente}'
        ORDER BY
            idLogComponente DESC
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;`;
  } else {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n"
    );
    return;
  }

  return database.executar(sql);
}

function buscarMedidasProcessos(idTelevisao) {
  if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
    sql = `
        SELECT 
            processo.idLog, processo.pid, date_format(processo.dataHora,'%H:%i:%s') as dataRegistro,
            processo.nomeProcesso, processo.valor, processo.fkComponente, comp.modelo, comp.tipoComponente, tv.nomeTelevisao
        FROM 
            LogProcesso as processo 
            JOIN Componente as comp ON fkComponente = idComponente 
            JOIN Televisao as tv ON fkTelevisao = idTelevisao 
        WHERE idTelevisao = ${idTelevisao}
        ORDER BY 
            idLog DESC LIMIT 12;
        `;
  } else if (process.env.AMBIENTE_PROCESSO == "producao") {
    sql = `
        SELECT 
            processo.idLog, 
            processo.pid, 
            CONVERT(VARCHAR(8), processo.dataHora, 108) as dataRegistro,
            processo.nomeProcesso, 
            processo.valor, 
            processo.fkComponente, 
            comp.modelo, 
            comp.tipoComponente, 
            tv.nomeTelevisao
        FROM 
            LogProcesso AS processo
            JOIN Componente AS comp ON processo.fkComponente = comp.idComponente
            JOIN Televisao AS tv ON comp.fkTelevisao = tv.idTelevisao
        WHERE 
            tv.idTelevisao = ${idTelevisao}
        ORDER BY 
            processo.idLog DESC
        OFFSET 0 ROWS FETCH NEXT 12 ROWS ONLY;
    `;
  }

  return database.executar(sql);
}

module.exports = {
  buscarUtlimasMedidasComponente,
  buscarMedidasComponenteEmTempoReal,
  buscarUltimaAtualizacaoComponente,
  buscarMedidasProcessos,
};
