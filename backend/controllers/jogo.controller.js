const Jogo    = require("../models/jogo.model");
const Bilhete = require("../models/bilhete.model");
const Estadio = require("../models/estadio.model");

const endpoints = {};

endpoints.createJogo = async (req, res) => {
  const { data, hora, jornada, id_estadio, id_equipa_casa, id_equipa_fora } = req.body;

  if (!data || !hora || !jornada || !id_estadio || !id_equipa_casa || !id_equipa_fora) {
    return res.status(400).json({
      status: "error",
      message: "Data, hora, jornada, estádio e ambas as equipas são obrigatórios.",
    });
  }

  try {
    // Criar o jogo
    const jogo = await Jogo.create({ data, hora, jornada, id_estadio, id_equipa_casa, id_equipa_fora });

    // Buscar o estádio para obter o preço base e a lotação
    const estadio = await Estadio.findByPk(id_estadio);

    if (estadio) {

      const bilhetes = Array.from({ length: estadio.lotacao }, () => ({
        custo:   estadio.preco_base,
        id_jogo: jogo.id,
      }));
      await Bilhete.bulkCreate(bilhetes);

    }

    res.status(201).json({
      status: "success",
      message: "Jogo e bilhete criados com sucesso.",
      data: jogo,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao criar jogo.",
      data: null,
    });
  }
};

endpoints.getAllJogos = async (req, res) => {
  try {
    const { jornada } = req.query;
    const filtro = jornada ? { where: { jornada } } : {};
    const dados = await Jogo.findAll(filtro); // ✅ suporta filtro por jornada via query param

    res.status(200).json({
      status: "success",
      message: "Lista de jogos.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar jogos.",
      data: null,
    });
  }
};

endpoints.getJogoById = async (req, res) => {
  const { id } = req.params;
  try {
    const dados = await Jogo.findByPk(id); // ✅ findByPk em vez de findById

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Jogo não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Jogo encontrado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter jogo.",
      data: null,
    });
  }
};

endpoints.updateJogo = async (req, res) => {
  const { id } = req.params;
  const { data, hora, jornada, id_estadio, id_equipa_casa, id_equipa_fora } = req.body;

  try {
    const existe = await Jogo.findByPk(id); // ✅ verificar antes de atualizar
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Jogo não encontrado.",
      });
    }

    await Jogo.update(                       // ✅ Sequelize update
      { data, hora, jornada, id_estadio, id_equipa_casa, id_equipa_fora },
      { where: { id } }
    );
    const dadosAtualizados = await Jogo.findByPk(id);

    res.status(200).json({
      status: "success",
      message: "Jogo atualizado com sucesso.",
      data: dadosAtualizados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao atualizar jogo.",
      data: null,
    });
  }
};

endpoints.deleteJogo = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Jogo.findByPk(id);
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Jogo não encontrado.",
      });
    }

    await Jogo.destroy({ where: { id } }); // ✅ Sequelize destroy

    res.status(204).send(); // ✅ 204 sem body
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao apagar jogo.",
      data: null,
    });
  }
};

module.exports = endpoints;