const Compra = require("../models/compra.model");

const endpoints = {};

endpoints.createCompra = async (req, res) => {
  const { estado, id_cliente, id_bilhete } = req.body;

  if (!id_cliente || !id_bilhete) {
    return res.status(400).json({
      status: "error",
      message: "ID do cliente e ID do bilhete são obrigatórios.",
    });
  }

  const estadosValidos = ["pago", "por pagar", "cancelado"];
  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({
      status: "error",
      message: `Estado inválido. Valores aceites: ${estadosValidos.join(", ")}.`,
    });
  }

  try {
    const dados = await Compra.create({
      estado: estado || "por pagar",  // default se não enviado
      dta_compra: new Date(),
      id_cliente,
      id_bilhete,
    });

    res.status(201).json({
      status: "success",
      message: "Compra criada com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao criar compra.",
      data: null,
    });
  }
};

endpoints.getAllCompras = async (req, res) => {
  try {
    const dados = await Compra.findAll();

    res.status(200).json({
      status: "success",
      message: "Lista de compras.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar compras.",
      data: null,
    });
  }
};

endpoints.getCompraById = async (req, res) => {
  const { id } = req.params;
  try {
    const dados = await Compra.findByPk(id); // ✅ findByPk em vez de findById

    if (!dados) {
      return res.status(404).json({
        status: "error",
        message: "Compra não encontrada.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Compra encontrada com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao obter compra.",
      data: null,
    });
  }
};

endpoints.updateCompra = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ["pago", "por pagar", "cancelado"];
  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({
      status: "error",
      message: `Estado inválido. Valores aceites: ${estadosValidos.join(", ")}.`,
    });
  }

  try {
    const existe = await Compra.findByPk(id); // ✅ verificar antes de atualizar
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Compra não encontrada.",
      });
    }

    await Compra.update({ estado }, { where: { id } }); // ✅ Sequelize update
    const dadosAtualizados = await Compra.findByPk(id);

    res.status(200).json({
      status: "success",
      message: "Compra atualizada com sucesso.",
      data: dadosAtualizados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao atualizar compra.",
      data: null,
    });
  }
};

endpoints.deleteCompra = async (req, res) => {
  const { id } = req.params;
  try {
    const existe = await Compra.findByPk(id);
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "Compra não encontrada.",
      });
    }

    await Compra.destroy({ where: { id } }); // ✅ Sequelize destroy

    res.status(204).send(); // ✅ 204 sem body
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao apagar compra.",
      data: null,
    });
  }
};

endpoints.getComprasByCliente = async (req, res) => {
  const { id_cliente } = req.params;
  try {
    const dados = await Compra.findAll({ where: { id_cliente } });

    res.status(200).json({
      status: "success",
      message: "Compras do cliente.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro ao listar compras do cliente.",
      data: null,
    });
  }
};


// Conta quantos bilhetes de um jogo ainda estão disponíveis (sem compra)
// Acessível a utilizadores autenticados (não só admin)
endpoints.getDisponibilidadeJogo = async (req, res) => {
  const { id_jogo } = req.params;
  try {
    const Bilhete  = require("../models/bilhete.model");
    const bilhetes = await Bilhete.findAll({ where: { id_jogo } });
    const compras  = await Compra.findAll();

    const vendidosIds    = new Set(compras.map(c => c.id_bilhete));
    const bilhetesLivres = bilhetes.filter(b => !vendidosIds.has(b.id));

    res.status(200).json({
      status: "success",
      data: {
        total:       bilhetes.length,
        vendidos:    bilhetes.length - bilhetesLivres.length,
        disponiveis: bilhetesLivres.length,
        bilhete:     bilhetesLivres[0] || null,  // primeiro bilhete disponível
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Erro ao verificar disponibilidade." });
  }
};

module.exports = endpoints;