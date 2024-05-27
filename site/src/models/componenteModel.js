var database = require("../database/config");

function componentesTv(idTv) {
    sql = `SELECT idComponente as idComponente, modelo as modelo, identificador as identificador, tipoComponente as tipoComponente FROM Componente as componente 
    JOIN Televisao as televisao ON fkTelevisao = idTelevisao WHERE idTelevisao = ${idTv};`

    console.log("Executando a instrução SQL: \n" + sql);
    return(database.executar(sql));
}

module.exports = {
    componentesTv
}