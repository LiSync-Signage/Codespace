var database = require("../database/config")


function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucao = `
        SELECT idUsuario, nomeUsuario, email, fkGestor as idGestor ,fkEmpresa as idEmpresa FROM Usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrar(nome, email, senha, idEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, idEmpresa);

    var instrucao = `
        INSERT INTO Usuario (nomeUsuario ,email, senha, fkEmpresa) VALUES ('${nome}', '${email}', '${senha}', ${idEmpresa});
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function gestorCadastrar(nome, email, senha, idEmpresa) {
    var sql = `INSERT INTO Usuario (nomeUsuario ,email, senha, fkEmpresa, fkGestor) VALUES ('${nome}', '${email}', '${senha}', ${idEmpresa}, 1)`

    console.log("Executando a instrução SQL: \n" + sql);
    return database.executar(sql);
}

function atualizarPerfil(nome, email, idUsuario) {
    var instrucao = `UPDATE Usuario set nomeUsuario = '${nome}', email = '${email}' WHERE idUsuario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function atualizarPerfilGestor(nome, email, cargo, idUsuario) {
    var instrucao = `UPDATE Usuario set nomeUsuario = '${nome}', email = '${email}', fkGestor = ${cargo} WHERE idUsuario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function quantidadeUsuariosPorTipo(idEmpresa) {
    var sql = `SELECT SUM(CASE WHEN fkGestor IS NULL THEN 1 ELSE 0 END) AS gestorNoc, SUM(CASE WHEN fkGestor IS NOT NULL THEN 1 ELSE 0 END) 
    AS assitenteNoc FROM Usuario WHERE fkEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + sql);
    return database.executar(sql);
}

function buscarUsuario(idEmpresa, idUsuario) {
    var sql = `SELECT nomeUsuario, email, fkGestor FROM Usuario WHERE fkEmpresa = ${idEmpresa} AND idUsuario = ${idUsuario}`;

    return database.executar(sql);
}

function buscarGestor(idEmpresa) {
    var sql = `SELECT *FROM Usuario WHERE fkEmpresa = ${idEmpresa} and fkGestor is null;`;

    return database.executar(sql);
}



function redefinirSenha(email, novaSenha) {
    var instrucao = `
        UPDATE funcionario SET senha = '${novaSenha}' WHERE email = '${email}';
    `;
    console.log("Executando a instrução SQL para redefinir a senha: \n" + instrucao);

    return new Promise((resolve, reject) => {
        database.executar(instrucao)
            .then(() => {
                resolve("Senha redefinida com sucesso!");
            })
            .catch((error) => {
                reject("Erro ao redefinir a senha: " + error);
            });
    });
}

module.exports = {
    buscarGestor,
    autenticar,
    cadastrar,
    atualizarPerfil,
    atualizarPerfilGestor,
    quantidadeUsuariosPorTipo,
    buscarUsuario,
    gestorCadastrar,
    redefinirSenha
};