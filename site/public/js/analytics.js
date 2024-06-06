var idTv = sessionStorage.ID_TV;
var nomeTv = sessionStorage.NOME_TV;
var hostname = sessionStorage.HOSTNAME_TV;
var statusTv = sessionStorage.STATUS_TV;
var andar = sessionStorage.FLOOR_TV;
var setor = sessionStorage.SECTOR_TV;

function primeioAcessoAnalytcs(idTelevisao, idEmpresa) {
    if (idTelevisao == undefined) {
        fetch(`/tv/listarDadosTv/${idEmpresa}`, {
            method: "GET",
        })
            .then((resposta) => {
                if (resposta.ok) {
                    return resposta.json();
                } else {
                    console.error('Nenhum dado encontrado ou erro na API');
                }
            })
            .then((data) => {
                console.log(data[0].idTelevisao);

                 sessionStorage.ID_TV = data[0].idTelevisao;
                 sessionStorage.NOME_TV = data[0].nomeTelevisao;
                 sessionStorage.HOSTNAME_TV = data[0].hostname;
                 sessionStorage.STATUS_TV = "NORMAL";
                 sessionStorage.FLOOR_TV = data[0].andar;
                 sessionStorage.SECTOR_TV = data[0].setor;

                document.getElementById("setor_name").innerHTML = `${data[0].setor}`
                document.getElementById("andar_name").innerHTML = `${data[0].andar}`

                document.getElementById("nome_tv").innerHTML = `${data[0].nomeTelevisao}`
                document.getElementById("nome_tv_modal").innerHTML = `${data[0].nomeTelevisao}`
                document.getElementById("hostname").innerHTML = `${data[0].hostname}`
                document.getElementById("conexao").innerHTML = "OFF";
                document.getElementById("status").innerHTML = `${"NORMAL"}`
            })
    }
}

document.getElementById("setor_name").innerHTML = `${setor}`
document.getElementById("andar_name").innerHTML = `${andar}`

document.getElementById("nome_tv").innerHTML = `${nomeTv}`
document.getElementById("nome_tv_modal").innerHTML = `${nomeTv}`
document.getElementById("hostname").innerHTML = `${hostname}`
document.getElementById("conexao").innerHTML = "OFF";
document.getElementById("status").innerHTML = `${statusTv}`


listarComponentes(idTv)