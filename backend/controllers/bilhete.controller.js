const Bilhete = require("../models/bilhete.model");

const endpoints = {};

endpoints.createBilhete = async (req, res) => {
  const { custo, id_jogo } = req.body;

  if (!custo || !id_jogo) {
    return res.status(400).json({
      status: "error",
      message: "Custo e ID do jogo são obrigatórios.",
    });
  }

  try {
    const dados = await Bilhete.create({ custo, id_jogo });

    res.status(201).json({
      status: "success",
      message: "Bilhete criado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao criar bilhete.",
      data: null,
    });
  }
};

endpoints.getAllBilhetes = async (req, res) => {
  try {
    const { id_jogo } = req.query;
    const filtro = id_jogo ? { where: { id_jogo } } : {};
    const dados = await Bilhete.findAll(filtro); // ✅ suporta filtro por jogo

    res.status(200).json({
      status: "success",
      message: "Lista de bilhetes.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar bilhetes.",
      data: null,
    });
  }
};

endpoints.getBilheteById = async (req, res) => {
  const { id } = req.params;
  try {
    const dados = await Bilhete.findByPk(id); // ✅ findByPk em vez de findById

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Bilhete não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Bilhete encontrado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter bilhete.",
      data: null,
    });
  }
};

endpoints.updateBilhete = async (req, res) => {
  const { id } = req.params;
  const { custo, id_jogo } = req.body;

  try {
    const existe = await Bilhete.findByPk(id); // ✅ verificar antes de atualizar
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Bilhete não encontrado.",
      });
    }

    await Bilhete.update({ custo, id_jogo }, { where: { id } }); // ✅ Sequelize update
    const dadosAtualizados = await Bilhete.findByPk(id);

    res.status(200).json({
      status: "success",
      message: "Bilhete atualizado com sucesso.",
      data: dadosAtualizados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao atualizar bilhete.",
      data: null,
    });
  }
};

endpoints.deleteBilhete = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Bilhete.findByPk(id);
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Bilhete não encontrado.",
      });
    }

    await Bilhete.destroy({ where: { id } }); // ✅ Sequelize destroy

    res.status(204).send(); // ✅ 204 sem body
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao apagar bilhete.",
      data: null,
    });
  }
};

module.exports = endpoints;
