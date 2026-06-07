require("dotenv").config();
const sequelize = require("./config/database");

const User    = require("./models/user.model");
const Cliente = require("./models/cliente.model");
const Equipa  = require("./models/equipa.model");
const Estadio = require("./models/estadio.model");
const Jogo    = require("./models/jogo.model");
const Bilhete = require("./models/bilhete.model");
const Compra  = require("./models/compra.model");

// ─── Dados ────────────────────────────────────────────────────────────────────
const EQUIPAS = [
  { nome: "Associação Académica de Coimbra - SF", sigla: "AAC SF",      fundacao: "1887-10-15", logo: "/uploads/SF.png"          },
  { nome: "União Clube Eirense",                  sigla: "UC Eirense",  fundacao: "1921-03-12", logo: "/uploads/UCE.png"         },
  { nome: "Grupo Desportivo Tourizense",           sigla: "GD Touriz",  fundacao: "1927-06-01", logo: "/uploads/GDT.png"         },
  { nome: "Associação Desportiva Nogueirense",     sigla: "AD Noguei",  fundacao: "1930-05-05", logo: "/uploads/ADN.png"         },
  { nome: "Grupo Recreativo Sourense",             sigla: "GR Souren",  fundacao: "1942-11-20", logo: "/uploads/Sourense.png"    },
  { nome: "Esperança AC",                          sigla: "Esperança",  fundacao: "1938-03-10", logo: "/uploads/ESPERANCA.png"   },
  { nome: "GR Vigor da Mocidade",                  sigla: "GR Vigor",   fundacao: "1950-08-22", logo: "/uploads/vigor.png"       },
  { nome: "União 1919 FC",                         sigla: "União 1919", fundacao: "1919-04-01", logo: "/uploads/Uniao.png"       },
  { nome: "Académico Futebol Clube",               sigla: "ACF",        fundacao: "1945-02-14", logo: "/uploads/ACF.png"         },
  { nome: "Associação Desportiva Pombalense",      sigla: "ADP",        fundacao: "1920-07-03", logo: "/uploads/ADP.png"         },
  { nome: "Mocidade Atlética",                     sigla: "Mocidade",   fundacao: "1955-12-08", logo: "/uploads/MOCIDADE.png"    },
  { nome: "Penelense SC",                          sigla: "Penelense",  fundacao: "1961-04-02", logo: "/uploads/PENELENSE.png"   },
  { nome: "Clube Desportivo de Cantanhede",        sigla: "CDC",        fundacao: "1955-03-17", logo: "/uploads/CDC.png"         },
  { nome: "Clube Desportivo Pombalense",           sigla: "CDP",        fundacao: "1933-09-25", logo: "/uploads/CDP.png"         },
  { nome: "SC Tocha",                              sigla: "SC Tocha",   fundacao: "1944-06-11", logo: "/uploads/Tocha.png"       },
  { nome: "União Futebol Clube",                   sigla: "UFC",        fundacao: "1965-01-30", logo: "/uploads/UFC.png"         },
];

const ESTADIOS = [
  { nome: "Estádio Universitário de Coimbra",  morada: "R. do Estádio Universitário, Coimbra",  lotacao: 3000, preco_base: 5.00 },
  { nome: "Campo Municipal de Eiras",           morada: "Av. de Eiras, Coimbra",                 lotacao: 1500, preco_base: 4.00 },
  { nome: "Estádio Municipal de Tábua",         morada: "R. do Desporto, Tábua",                 lotacao: 800,  preco_base: 3.00 },
  { nome: "Campo Municipal de Pombal",          morada: "Av. do Estádio, Pombal",                lotacao: 1200, preco_base: 3.50 },
  { nome: "Complexo Desportivo de Soure",       morada: "R. Principal, Soure",                   lotacao: 900,  preco_base: 3.00 },
  { nome: "Estádio Municipal de Cantanhede",    morada: "Av. Cantanhede, Cantanhede",            lotacao: 1100, preco_base: 3.50 },
  { nome: "Campo da Lousã",                     morada: "R. do Campo, Lousã",                    lotacao: 700,  preco_base: 2.50 },
  { nome: "Estádio de Oliveira do Hospital",    morada: "R. do Desporto, Oliveira do Hospital",  lotacao: 1000, preco_base: 3.00 },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de dados ligada.");
    await sequelize.sync({ alter: true });
    console.log("✅ Tabelas sincronizadas.\n");

    // ── 1. Limpar tudo (ordem inversa das FK) ────────────────────────────────
    console.log("🗑️  A limpar dados anteriores...");
    await Compra.destroy({ where: {}, truncate: true, cascade: true });
    await Bilhete.destroy({ where: {}, truncate: true, cascade: true });
    await Jogo.destroy({ where: {}, truncate: true, cascade: true });
    await Estadio.destroy({ where: {}, truncate: true, cascade: true });
    await Equipa.destroy({ where: {}, truncate: true, cascade: true });
    await Cliente.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    console.log("   ✅ Base de dados limpa.\n");

    // ── 2. Utilizadores ──────────────────────────────────────────────────────
    console.log("📌 A criar utilizadores...");
    await User.create({ email: "admin@afc.pt",   password: "admin123",   role: "admin" });
    await User.create({ email: "cliente@afc.pt", password: "cliente123", role: "user"  });
    await Cliente.create({ nome: "Administrador AFC", email: "admin@afc.pt",   nif: "100000001", telemovel: "910000001", dta_nascimento: "1980-01-01" });
    await Cliente.create({ nome: "Cliente Teste",     email: "cliente@afc.pt", nif: "200000002", telemovel: "920000002", dta_nascimento: "1995-06-15" });
    console.log("   ✅ admin@afc.pt   (admin123)");
    console.log("   ✅ cliente@afc.pt (cliente123)\n");

    // ── 3. Equipas ───────────────────────────────────────────────────────────
    console.log("📌 A criar equipas...");
    const equipasCriadas = await Equipa.bulkCreate(EQUIPAS, { returning: true });
    console.log(`   ✅ ${equipasCriadas.length} equipas criadas.\n`);

    // ── 4. Estádios ──────────────────────────────────────────────────────────
    console.log("📌 A criar estádios...");
    const estadiosDados = ESTADIOS.map((e, i) => ({ ...e, id_equipa: equipasCriadas[i].id }));
    const estadiosCriados = await Estadio.bulkCreate(estadiosDados, { returning: true });
    console.log(`   ✅ ${estadiosCriados.length} estádios criados.\n`);

    // ── 5. Jogos + Bilhetes ───────────────────────────────────────────────────
    console.log("📌 A criar jogos e bilhetes...");
    const pares = [
      [0,1,0], [2,3,1], [4,5,2], [6,7,3],
      [8,9,4], [10,11,5], [12,13,6], [14,15,7],
    ];
    const datas = [
      "2026-06-20","2026-06-20","2026-06-20","2026-06-21",
      "2026-06-21","2026-06-21","2026-06-22","2026-06-22",
    ];
    const horas = ["21:00","17:00","19:00","16:00","18:30","20:00","15:00","17:00"];

    let totalBilhetes = 0;
    for (let i = 0; i < pares.length; i++) {
      const [casa, fora, estadioIdx] = pares[i];
      const estadio = estadiosCriados[estadioIdx];
      const jogo = await Jogo.create({
        id_equipa_casa: equipasCriadas[casa].id,
        id_equipa_fora: equipasCriadas[fora].id,
        id_estadio:     estadio.id,
        data:           datas[i],
        hora:           horas[i],
        jornada:        1,
      });

      const bilhetes = Array.from({ length: estadio.lotacao }, () => ({
        custo:   estadio.preco_base,
        id_jogo: jogo.id,
      }));
      await Bilhete.bulkCreate(bilhetes);
      totalBilhetes += estadio.lotacao;
    }
    console.log(`   ✅ 8 jogos criados com ${totalBilhetes} bilhetes.\n`);

    console.log("🎉 Seed concluído com sucesso!\n");
    console.log("   admin@afc.pt   → admin123");
    console.log("   cliente@afc.pt → cliente123\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no seed:", err.message);
    process.exit(1);
  }
}

seed();
