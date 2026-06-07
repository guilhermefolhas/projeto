const Estadio  = require("../models/estadio.model");
const Jogo     = require("../models/jogo.model");

const endpoints = {};

endpoints.createEstadio = async (req, res) => {
  const { nome, morada, lotacao, preco_base, id_equipa } = req.body;

  if (!nome || !morada || !lotacao || !preco_base) {
    return res.status(400).json({
      status: "error",
      message: "Nome, morada, lotação e preço base são obrigatórios.",
    });
  }

  try {
    const dados = await Estadio.create({ nome, morada, lotacao, preco_base, id_equipa });

    res.status(201).json({
      status: "success",
      message: "Estádio criado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao criar estádio.",
      data: null,
    });
  }
};

endpoints.getAllEstadios = async (req, res) => {
  try {
    const dados = await Estadio.findAll();

    res.status(200).json({
      status: "success",
      message: "Lista de estádios.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar estádios.",
      data: null,
    });
  }
};

endpoints.getEstadioById = async (req, res) => {
  const { id } = req.params;
  try {
    const dados = await Estadio.findByPk(id); // ✅ findByPk em vez de findById

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Estádio não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Estádio encontrado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter estádio.",
      data: null,
    });
  }
};

endpoints.updateEstadio = async (req, res) => {
  const { id } = req.params;
  const { nome, morada, lotacao, preco_base, id_equipa } = req.body;

  try {
    const existe = await Estadio.findByPk(id); // ✅ findByPk
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Estádio não encontrado.",
      });
    }

    await Estadio.update(                       // ✅ Sequelize update
      { nome, morada, lotacao, preco_base, id_equipa },
      { where: { id } }
    );
    const dadosAtualizados = await Estadio.findByPk(id);

    res.status(200).json({
      status: "success",
      message: "Estádio atualizado com sucesso.",
      data: dadosAtualizados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao atualizar estádio.",
      data: null,
    });
  }
};

endpoints.deleteEstadio = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Estadio.findByPk(id); // ✅ findByPk
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Estádio não encontrado.",
      });
    }

    await Estadio.destroy({ where: { id } });  // ✅ Sequelize destroy

    res.status(204).send(); // ✅ 204 sem body
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao apagar estádio.",
      data: null,
    });
  }
};

endpoints.getEstadioByNome = async (req, res) => {
  const { nome } = req.params;
  try {
    const dados = await Estadio.findOne({ where: { nome } }); // ✅ com { where: }

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Estádio não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Estádio encontrado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter estádio.",
      data: null,
    });
  }
};

endpoints.getJogosEnrolledByEstadio = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Estadio.findByPk(id);
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Estádio não encontrado.",
        data: null,
      });
    }

    const jogos = await Jogo.findAll({ where: { id_estadio: id } }); // ✅ query directa

    res.status(200).json({
      status: "success",
      message: "Jogos encontrados com sucesso.",
      data: jogos,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar jogos.",
      data: null,
    });
  }
};

module.exports = endpoints;
