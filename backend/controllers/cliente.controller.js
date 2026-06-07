const Cliente = require("../models/cliente.model");

const endpoints = {};

endpoints.createClient = async (req, res) => {
  const { nome, email, nif, telemovel, dta_nascimento } = req.body;

  // Validação de input
  if (!nome || !email || !nif) {
    return res.status(400).json({
      status: "error",
      message: "Nome, email e NIF são obrigatórios.",
    });
  }

  try {
    const dados = await Cliente.create({ nome, email, nif, telemovel, dta_nascimento }); // ✅ Cliente (não Client)

    res.status(201).json({
      status: "success",
      message: "Cliente criado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({   // era 404 — erro de criação é 500
      status: "error",
      message: "Ocorreu um erro ao criar cliente.",
      data: null,
    });
  }
};

endpoints.getAllClients = async (req, res) => {
  try {
    const dados = await Cliente.findAll(); // ✅ Cliente

    res.status(200).json({
      status: "success",
      message: "Lista de clientes.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar clientes.",
      data: null,
    });
  }
};

endpoints.getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const dados = await Cliente.findOne({ where: { id } }); // ✅ Cliente

    if (!dados) {                          // ✅ verificação descomentada
      return res.status(404).json({
        status: "error",
        message: "Cliente não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Cliente encontrado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter cliente.",
      data: null,
    });
  }
};

endpoints.updateClient = async (req, res) => {
  const { id } = req.params;
  const { nome, email, nif, telemovel, dta_nascimento } = req.body;

  try {
    const existe = await Cliente.findOne({ where: { id } }); // ✅ verificar se existe antes de atualizar
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Cliente não encontrado.",
      });
    }

    const [linhasAfetadas] = await Cliente.update( // ✅ Cliente
      { nome, email, nif, telemovel, dta_nascimento },
      { where: { id } }
    );

    const dadosAtualizados = await Cliente.findOne({ where: { id } });

    res.status(200).json({
      status: "success",
      message: "Cliente atualizado com sucesso.",
      data: dadosAtualizados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao atualizar cliente.",
      data: null,
    });
  }
};

endpoints.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Cliente.findOne({ where: { id } }); // ✅ verificar antes de apagar
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Cliente não encontrado.",
      });
    }

    await Cliente.destroy({ where: { id } }); // ✅ Cliente

    res.status(204).send(); // ✅ 204 sem body — HTTP 204 não admite body
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao apagar cliente.",
      data: null,
    });
  }
};

endpoints.getClientByNome = async (req, res) => {
  const { nome } = req.params;
  try {
    const dados = await Cliente.findOne({ where: { nome } }); // ✅ Cliente

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Cliente não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Cliente encontrado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter cliente.",
      data: null,
    });
  }
};

endpoints.getClientByNif = async (req, res) => {
  const { nif } = req.params;
  try {
    const dados = await Cliente.findOne({ where: { nif } }); // ✅ Cliente

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Cliente não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Cliente encontrado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter cliente.",
      data: null,
    });
  }
};

module.exports = endpoints;
