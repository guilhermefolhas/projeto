import { useState, useEffect } from "react";
import {
  Box, Container, Typography, Tabs, Tab, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, Grid, Chip, Snackbar, Alert, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA – edita aqui as equipas, estádios, jogos e compras
// Campos das equipas: id, nome, fundacao (data ex: "1999-09-09")
// Campos dos estádios: id, nome, morada, lotacao, preco_base
// Campos dos jogos: id, equipa_casa, equipa_fora, data, hora, estadio, jornada
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_EQUIPAS = [
  { id: 1, nome: "Vigor da Mocidade", fundacao: "1999-09-09" },
  { id: 2, nome: "AD Oliveirense",    fundacao: "1925-03-15" },
  { id: 3, nome: "Sertanense FC",     fundacao: "1921-06-01" },
  { id: 4, nome: "Marinhense SC",     fundacao: "1945-01-01" },
  { id: 5, nome: "CD Eiras",          fundacao: "1955-05-10" },
  { id: 6, nome: "AFC Coimbra",       fundacao: "2014-07-01" },
];

const MOCK_ESTADIOS = [
  { id: 1, nome: "Campo dos Sardões",                     morada: "Rua dos Sardões, Coimbra",              lotacao: 2000, preco_base: 4.50 },
  { id: 2, nome: "Campo Municipal de Oliveira do Hospital", morada: "Av. do Estádio, Oliveira do Hospital", lotacao: 1500, preco_base: 3.50 },
  { id: 3, nome: "Estádio Municipal de Sertã",            morada: "Rua do Estádio, Sertã",                 lotacao: 800,  preco_base: 3.00 },
  { id: 4, nome: "Campo do Marinhense",                   morada: "Rua Principal, Figueira da Foz",        lotacao: 600,  preco_base: 3.00 },
  { id: 5, nome: "Campo de Eiras",                        morada: "Rua de Eiras, Coimbra",                 lotacao: 500,  preco_base: 2.50 },
];

const MOCK_JOGOS = [
  { id: 1, equipa_casa: "Vigor da Mocidade", equipa_fora: "AD Oliveirense", data: "2025-06-14", hora: "21:00", estadio: "Campo dos Sardões",                      jornada: 34 },
  { id: 2, equipa_casa: "Sertanense FC",     equipa_fora: "CD Eiras",       data: "2025-06-14", hora: "17:00", estadio: "Estádio Municipal de Sertã",             jornada: 34 },
  { id: 3, equipa_casa: "Marinhense SC",     equipa_fora: "AFC Coimbra",    data: "2025-06-14", hora: "18:30", estadio: "Campo do Marinhense",                    jornada: 34 },
  { id: 4, equipa_casa: "Vigor da Mocidade", equipa_fora: "Marinhense SC",  data: "2025-06-07", hora: "21:00", estadio: "Campo dos Sardões",                      jornada: 33 },
];

const MOCK_COMPRAS = [
  { id: 101, cliente: "ana@email.com",  jogo: "Vigor vs Oliveirense", qtd: 2, total: "9.00€",  estado: "pago",      data: "2025-05-01" },
  { id: 102, cliente: "joao@email.com", jogo: "Sertanense vs Eiras",  qtd: 1, total: "3.00€",  estado: "por pagar", data: "2025-05-03" },
];
// ─────────────────────────────────────────────────────────────────────────────

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

function FormDialog({ aberto, onFechar, titulo, campos, valores, onGuardar }) {
  const [form, setForm] = useState(valores || {});
  useEffect(() => { setForm(valores || {}); }, [valores, aberto]);
  const handleChange = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const handleSubmit = () => { onGuardar(form); onFechar(); };

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>{titulo}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {campos.map((campo) => (
            <Grid key={campo.key} size={{ xs: 12, sm: campo.fullWidth ? 12 : 6 }}>
              <TextField
                fullWidth label={campo.label} type={campo.type || "text"}
                value={form[campo.key] || ""}
                onChange={(e) => handleChange(campo.key, e.target.value)}
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onFechar} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

function DialogApagar({ aberto, onFechar, onConfirmar, descricao }) {
  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Confirmar Eliminação</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tens a certeza que queres eliminar <strong>{descricao}</strong>? Esta ação não pode ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onFechar} color="inherit">Cancelar</Button>
        <Button onClick={onConfirmar} variant="contained" color="error">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Aba Jogos ────────────────────────────────────────────────────────────────
function AbaJogos({ setSnackbar }) {
  const [jogos, setJogos] = useState(MOCK_JOGOS);
  const [dialogForm, setDialogForm] = useState({ aberto: false, valores: null });
  const [dialogApagar, setDialogApagar] = useState({ aberto: false, item: null });

  const campos = [
    { key: "equipa_casa",  label: "Equipa Casa" },
    { key: "equipa_fora",  label: "Equipa Fora" },
    { key: "data",         label: "Data",    type: "date" },
    { key: "hora",         label: "Hora",    type: "time" },
    { key: "estadio",      label: "Estádio", fullWidth: true },
    { key: "jornada",      label: "Jornada", type: "number" },
  ];

  const handleGuardar = (form) => {
    const jornada = Number(form.jornada);
    if (form.id) setJogos((p) => p.map((j) => j.id === form.id ? { ...form, jornada } : j));
    else setJogos((p) => [...p, { ...form, jornada, id: Date.now() }]);
    // TODO: axios.post/put http://localhost:5000/api/v3/jogo
    setSnackbar({ aberto: true, msg: "Jogo guardado!", tipo: "success" });
  };

  const handleApagar = () => {
    setJogos((p) => p.filter((j) => j.id !== dialogApagar.item.id));
    // TODO: axios.delete(`http://localhost:5000/api/v3/jogo/${dialogApagar.item.id}`)
    setDialogApagar({ aberto: false, item: null });
    setSnackbar({ aberto: true, msg: "Jogo eliminado.", tipo: "info" });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogForm({ aberto: true, valores: null })}>
          Adicionar Jogo
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              {["ID", "Casa", "Fora", "Data", "Hora", "Estádio", "Jornada", ""].map((h) => (
                <TableCell key={h} sx={{ color: "white", fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {jogos.map((j) => (
              <TableRow key={j.id} hover>
                <TableCell>{j.id}</TableCell>
                <TableCell>{j.equipa_casa}</TableCell>
                <TableCell>{j.equipa_fora}</TableCell>
                <TableCell>{j.data}</TableCell>
                <TableCell>{j.hora}</TableCell>
                <TableCell>{j.estadio}</TableCell>
                <TableCell><Chip label={`J${j.jornada}`} size="small" color="secondary" /></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar"><IconButton size="small" color="primary" onClick={() => setDialogForm({ aberto: true, valores: j })}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={() => setDialogApagar({ aberto: true, item: j })}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormDialog aberto={dialogForm.aberto} onFechar={() => setDialogForm({ aberto: false, valores: null })} titulo={dialogForm.valores ? "Editar Jogo" : "Novo Jogo"} campos={campos} valores={dialogForm.valores} onGuardar={handleGuardar} />
      <DialogApagar aberto={dialogApagar.aberto} onFechar={() => setDialogApagar({ aberto: false, item: null })} onConfirmar={handleApagar} descricao={dialogApagar.item ? `${dialogApagar.item.equipa_casa} vs ${dialogApagar.item.equipa_fora}` : ""} />
    </>
  );
}

// ── Aba Equipas ──────────────────────────────────────────────────────────────
function AbaEquipas({ setSnackbar }) {
  const [equipas, setEquipas] = useState(MOCK_EQUIPAS);
  const [dialogForm, setDialogForm] = useState({ aberto: false, valores: null });
  const [dialogApagar, setDialogApagar] = useState({ aberto: false, item: null });

  const campos = [
    { key: "nome",     label: "Nome",              fullWidth: true },
    { key: "fundacao", label: "Data de Fundação",  type: "date" },
  ];

  const handleGuardar = (form) => {
    if (form.id) setEquipas((p) => p.map((e) => e.id === form.id ? form : e));
    else setEquipas((p) => [...p, { ...form, id: Date.now() }]);
    // TODO: axios.post/put http://localhost:5000/api/v3/equipa
    setSnackbar({ aberto: true, msg: "Equipa guardada!", tipo: "success" });
  };

  const handleApagar = () => {
    setEquipas((p) => p.filter((e) => e.id !== dialogApagar.item.id));
    setDialogApagar({ aberto: false, item: null });
    setSnackbar({ aberto: true, msg: "Equipa eliminada.", tipo: "info" });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogForm({ aberto: true, valores: null })}>
          Adicionar Equipa
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              {["ID", "Nome", "Fundação", ""].map((h) => (
                <TableCell key={h} sx={{ color: "white", fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {equipas.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{e.id}</TableCell>
                <TableCell fontWeight={600}>{e.nome}</TableCell>
                <TableCell>{e.fundacao}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar"><IconButton size="small" color="primary" onClick={() => setDialogForm({ aberto: true, valores: e })}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={() => setDialogApagar({ aberto: true, item: e })}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormDialog aberto={dialogForm.aberto} onFechar={() => setDialogForm({ aberto: false, valores: null })} titulo={dialogForm.valores ? "Editar Equipa" : "Nova Equipa"} campos={campos} valores={dialogForm.valores} onGuardar={handleGuardar} />
      <DialogApagar aberto={dialogApagar.aberto} onFechar={() => setDialogApagar({ aberto: false, item: null })} onConfirmar={handleApagar} descricao={dialogApagar.item?.nome} />
    </>
  );
}

// ── Aba Estádios ─────────────────────────────────────────────────────────────
function AbaEstadios({ setSnackbar }) {
  const [estadios, setEstadios] = useState(MOCK_ESTADIOS);
  const [dialogForm, setDialogForm] = useState({ aberto: false, valores: null });
  const [dialogApagar, setDialogApagar] = useState({ aberto: false, item: null });

  const campos = [
    { key: "nome",       label: "Nome",        fullWidth: true },
    { key: "morada",     label: "Morada",      fullWidth: true },
    { key: "lotacao",    label: "Lotação",     type: "number" },
    { key: "preco_base", label: "Preço Base (€)", type: "number" },
  ];

  const handleGuardar = (form) => {
    const dados = { ...form, lotacao: Number(form.lotacao), preco_base: Number(form.preco_base) };
    if (form.id) setEstadios((p) => p.map((e) => e.id === form.id ? dados : e));
    else setEstadios((p) => [...p, { ...dados, id: Date.now() }]);
    // TODO: axios.post/put http://localhost:5000/api/v3/estadio
    setSnackbar({ aberto: true, msg: "Estádio guardado!", tipo: "success" });
  };

  const handleApagar = () => {
    setEstadios((p) => p.filter((e) => e.id !== dialogApagar.item.id));
    setDialogApagar({ aberto: false, item: null });
    setSnackbar({ aberto: true, msg: "Estádio eliminado.", tipo: "info" });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogForm({ aberto: true, valores: null })}>
          Adicionar Estádio
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              {["ID", "Nome", "Morada", "Lotação", "Preço Base", ""].map((h) => (
                <TableCell key={h} sx={{ color: "white", fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {estadios.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.nome}</TableCell>
                <TableCell>{e.morada}</TableCell>
                <TableCell>{Number(e.lotacao).toLocaleString("pt-PT")}</TableCell>
                <TableCell>{Number(e.preco_base).toFixed(2)}€</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar"><IconButton size="small" color="primary" onClick={() => setDialogForm({ aberto: true, valores: e })}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={() => setDialogApagar({ aberto: true, item: e })}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormDialog aberto={dialogForm.aberto} onFechar={() => setDialogForm({ aberto: false, valores: null })} titulo={dialogForm.valores ? "Editar Estádio" : "Novo Estádio"} campos={campos} valores={dialogForm.valores} onGuardar={handleGuardar} />
      <DialogApagar aberto={dialogApagar.aberto} onFechar={() => setDialogApagar({ aberto: false, item: null })} onConfirmar={handleApagar} descricao={dialogApagar.item?.nome} />
    </>
  );
}

// ── Aba Compras ──────────────────────────────────────────────────────────────
function AbaCompras() {
  const estadoColor = (estado) =>
    estado === "pago" ? "success" : estado === "cancelado" ? "error" : "warning";

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.main" }}>
            {["ID", "Cliente", "Jogo", "Qtd", "Total", "Estado", "Data"].map((h) => (
              <TableCell key={h} sx={{ color: "white", fontWeight: 600 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {MOCK_COMPRAS.map((c) => (
            <TableRow key={c.id} hover>
              <TableCell>#{c.id}</TableCell>
              <TableCell>{c.cliente}</TableCell>
              <TableCell>{c.jogo}</TableCell>
              <TableCell>{c.qtd}</TableCell>
              <TableCell><strong>{c.total}</strong></TableCell>
              <TableCell><Chip label={c.estado} size="small" color={estadoColor(c.estado)} /></TableCell>
              <TableCell>{c.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ aberto: false, msg: "", tipo: "success" });

  return (
    <Box sx={{ py: 5, bgcolor: "background.default", minHeight: "calc(100vh - 80px)" }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" color="secondary.dark" fontWeight={700}>Área restrita</Typography>
          <Typography variant="h4" fontWeight={700} color="primary.main">Painel de Administração</Typography>
        </Box>

        <Paper sx={{ borderRadius: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ borderBottom: 1, borderColor: "divider", px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 600 } }}
          >
            <Tab label="Jogos" />
            <Tab label="Equipas" />
            <Tab label="Estádios" />
            <Tab label="Compras" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            <TabPanel value={tab} index={0}><AbaJogos setSnackbar={setSnackbar} /></TabPanel>
            <TabPanel value={tab} index={1}><AbaEquipas setSnackbar={setSnackbar} /></TabPanel>
            <TabPanel value={tab} index={2}><AbaEstadios setSnackbar={setSnackbar} /></TabPanel>
            <TabPanel value={tab} index={3}><AbaCompras /></TabPanel>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.aberto} autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, aberto: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.tipo} variant="filled" sx={{ width: "100%" }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
