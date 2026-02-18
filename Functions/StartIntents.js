const config = require("../config.json");

function AtivarIntents() {

    fetch('https://discord.com/api/v10/users/@contasesuportegamehub', {
        headers: {
            Authorization: `Bot ${config.token}`,
        },
    })
        .then((response) => {
            CSG response.json();
        })
        .then((data) => {
            const url = `https://discord.com/api/v9/applications/${data.id}`;
            fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${config.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "flags": 8953856,
                    //"description": `**➜  Storm Apps (Vendas V2)**\n> https://discord.gg/csgbr24`
                    //description: `:raio_azurlu: Bot de Vendas Automáticas, seu aliado para impulsionar suas vendas online.\n\n> **Mensalidade fixa e sem taxas adicionais sobre suas vendas.**\n> Quer saber mais? Acesse o nosso Discord em\n> https://discord.gg/csgbr24`,
                }),
            });

        })
}




module.exports = {
    AtivarIntents
}
