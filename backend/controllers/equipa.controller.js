const Equipa = require("../models/equipa.model");
const Jogo   = require("../models/jogo.model");

const endpoints = {};

const fs   = require("fs");
const path = require("path");

endpoints.getLogosDisponiveis = (req, res) => {
  const uploadsDir = path.join(__dirname, "../uploads");
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ status: "success", data: [] });
    }
    const extensoesImagem = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
    const ficheiros = fs.readdirSync(uploadsDir)
      .filter(f => extensoesImagem.includes(path.extname(f).toLowerCase()))
      .map(f => ({ nome: f, url: `/uploads/${f}` }));

    res.status(200).json({ status: "success", data: ficheiros });
  } catch {
    res.status(500).json({ status: "error", message: "Erro ao listar logos." });
  }
};


endpoints.createEquipa = async (req, res) => {
  const { nome, sigla, fundacao } = req.body;
  // req.file vem do multer quando é enviada uma imagem
  // logo pode vir de um upload novo (req.file) ou de um ficheiro existente (logoUrl no body)
  const logo = req.file ? `/uploads/${req.file.filename}` : (req.body.logoUrl || null);

  if (!nome) {
    return res.status(400).json({
      status: "error",
      message: "O nome da equipa é obrigatório.",
    });
  }

  if (sigla && sigla.length > 15) {
    return res.status(400).json({
      status: "error",
      message: "A abreviatura não pode exceder 15 caracteres.",
    });
  }

  try {
    const dados = await Equipa.create({ nome, sigla, fundacao, logo });

    res.status(201).json({
      status: "success",
      message: "Equipa criada com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({    // era 404
      status: "error",
      message: "Ocorreu um erro ao criar equipa.",
      data: null,
    });
  }
};

endpoints.getAllEquipas = async (req, res) => {
  try {
    const dados = await Equipa.findAll();

    res.status(200).json({
      status: "success",
      message: "Lista de equipas.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar equipas.",
      data: null,
    });
  }
};

endpoints.getEquipaById = async (req, res) => {
  const { id } = req.params;
  try {
    const dados = await Equipa.findOne({ where: { id } });

    if (!dados) {             // ✅ descomentado
      return res.status(404).json({
        status: "error",
        message: "Equipa não encontrada.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Equipa encontrada com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter equipa.",
      data: null,
    });
  }
};

endpoints.updateEquipa = async (req, res) => {
  const { id } = req.params;
  const { nome, sigla, fundacao } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    if (sigla && sigla.length > 15) {
      return res.status(400).json({
        status: "error",
        message: "A abreviatura não pode exceder 15 caracteres.",
      });
    }

    const existe = await Equipa.findOne({ where: { id } }); // ✅ verificar antes de atualizar
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Equipa não encontrada.",
      });
    }

    const dadosUpdate = { nome, sigla, fundacao };
    if (logo !== undefined) dadosUpdate.logo = logo; // só actualiza se vier nova imagem
    await Equipa.update(dadosUpdate, { where: { id } });
    const dadosAtualizados = await Equipa.findOne({ where: { id } });

    res.status(200).json({
      status: "success",
      message: "Equipa atualizada com sucesso.",
      data: dadosAtualizados,
    });
  } catch (error) {
    console.error("ERRO updateEquipa:", error.message);
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao atualizar equipa.",
      data: null,
    });
  }
};

endpoints.deleteEquipa = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Equipa.findOne({ where: { id } });
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Equipa não encontrada.",
      });
    }

    await Equipa.destroy({ where: { id } });

    res.status(204).send(); // ✅ 204 sem body
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao apagar equipa.",
      data: null,
    });
  }
};

endpoints.getEquipaByNome = async (req, res) => {
  const { nome } = req.params;
  try {
    const dados = await Equipa.findOne({ where: { nome } });

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Equipa não encontrada.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Equipa encontrada com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter equipa.",
      data: null,
    });
  }
};

// Jogos de uma equipa (casa + fora)
endpoints.getJogosEnrolledByEquipa = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Equipa.findOne({ where: { id } });
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Equipa não encontrada.",
        data: null,
      });
    }

    // ✅ Como há duas FK, busca os jogos directamente em vez de usar include
    const jogos = await Jogo.findAll({
      where: {
        [require("sequelize").Op.or]: [
          { id_equipa_casa: id },
          { id_equipa_fora: id },
        ],
      },
    });

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