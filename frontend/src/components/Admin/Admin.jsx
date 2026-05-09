import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Snackbar,
  Alert,
  Skeleton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

// ─── Mock data – substituir por chamadas à API ─────────────────────────────────
const MOCK_JOGOS = [
  { id: 1, equipa_casa: "Sporting CP", equipa_fora: "FC Porto",  data: "2025-06-14", hora: "21:00", estadio: "Alvalade", fase: "Final" },
  { id: 2, equipa_casa: "SL Benfica",  equipa_fora: "SC Braga",  data: "2025-06-07", hora: "18:30", estadio: "Estádio da Luz", fase: "Meia-Final" },
];
const MOCK_EQUIPAS = [
  { id: 1, nome: "Sporting CP", cidade: "Lisboa", fundacao: 1906 },
  { id: 2, nome: "FC Porto",    cidade: "Porto",  fundacao: 1893 },
  { id: 3, nome: "SL Benfica",  cidade: "Lisboa", fundacao: 1904 },
];
const MOCK_ESTADIOS = [
  { id: 1, nome: "Estádio de Alvalade", cidade: "Lisboa", capacidade: 50000 },
  { id: 2, nome: "Estádio do Dragão",   cidade: "Porto",  capacidade: 50033 },
  { id: 3, nome: "Estádio da Luz",      cidade: "Lisboa", capacidade: 64642 },
];
const MOCK_COMPRAS = [
  { id: 101, cliente: "ana@email.com", jogo: "Sporting vs Porto", categoria: "Geral",    qtd: 2, total: "30.00€", data: "2025-05-01" },
  { id: 102, cliente: "joao@email.com", jogo: "Benfica vs Braga", categoria: "Tribuna", qtd: 1, total: "55.00€", data: "2025-05-03" },
];
// ─────────────────────────────────────────────────────────────────────────────

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

// ─── Formulário genérico ──────────────────────────────────────────────────────
function FormDialog({ aberto, onFechar, titulo, campos, valores, onGuardar }) {
  const [form, setForm] = useState(valores || {});

  useEffect(() => {
    setForm(valores || {});
  }, [valores, aberto]);

  const handleChange = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const handleSubmit = () => {
    onGuardar(form);
    onFechar();
  };

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>{titulo}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {campos.map((campo) => (
            <Grid key={campo.key} size={{ xs: 12, sm: campo.fullWidth ? 12 : 6 }}>
              <TextField
                fullWidth
                label={campo.label}
                type={campo.type || "text"}
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

// ─── Dialog de confirmação de apagar ─────────────────────────────────────────
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

// ─── Aba: Jogos ───────────────────────────────────────────────────────────────
function AbaJogos({ setSnackbar }) {
  const [jogos, setJogos] = useState(MOCK_JOGOS);
  const [dialogForm, setDialogForm] = useState({ aberto: false, valores: null });
  const [dialogApagar, setDialogApagar] = useState({ aberto: false, item: null });

  const campos = [
    { key: "equipa_casa", label: "Equipa Casa" },
    { key: "equipa_fora", label: "Equipa Fora" },
    { key: "data", label: "Data", type: "date" },
    { key: "hora", label: "Hora", type: "time" },
    { key: "estadio", label: "Estádio" },
    { key: "fase", label: "Fase" },
  ];

  const handleGuardar = (form) => {
    if (form.id) {
      setJogos((prev) => prev.map((j) => (j.id === form.id ? form : j)));
      // TODO: axios.put(`http://localhost:5000/api/v1/jogos/${form.id}`, form)
    } else {
      setJogos((prev) => [...prev, { ...form, id: Date.now() }]);
      // TODO: axios.post("http://localhost:5000/api/v1/jogos", form)
    }
    setSnackbar({ aberto: true, msg: "Jogo guardado com sucesso!", tipo: "success" });
  };

  const handleApagar = () => {
    setJogos((prev) => prev.filter((j) => j.id !== dialogApagar.item.id));
    // TODO: axios.delete(`http://localhost:5000/api/v1/jogos/${dialogApagar.item.id}`)
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
              {["ID", "Casa", "Fora", "Data", "Hora", "Fase", ""].map((h) => (
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
                <TableCell><Chip label={j.fase} size="small" color="secondary" /></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => setDialogForm({ aberto: true, valores: j })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => setDialogApagar({ aberto: true, item: j })}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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

// ─── Aba: Equipas ────────────────────────────────────────────────────────────
function AbaEquipas({ setSnackbar }) {
  const [equipas, setEquipas] = useState(MOCK_EQUIPAS);
  const [dialogForm, setDialogForm] = useState({ aberto: false, valores: null });
  const [dialogApagar, setDialogApagar] = useState({ aberto: false, item: null });

  const campos = [
    { key: "nome", label: "Nome", fullWidth: true },
    { key: "cidade", label: "Cidade" },
    { key: "fundacao", label: "Ano de Fundação", type: "number" },
  ];

  const handleGuardar = (form) => {
    if (form.id) {
      setEquipas((prev) => prev.map((e) => (e.id === form.id ? form : e)));
    } else {
      setEquipas((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setSnackbar({ aberto: true, msg: "Equipa guardada!", tipo: "success" });
  };

  const handleApagar = () => {
    setEquipas((prev) => prev.filter((e) => e.id !== dialogApagar.item.id));
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
              {["ID", "Nome", "Cidade", "Fundação", ""].map((h) => (
                <TableCell key={h} sx={{ color: "white", fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {equipas.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{e.id}</TableCell>
                <TableCell fontWeight={600}>{e.nome}</TableCell>
                <TableCell>{e.cidade}</TableCell>
                <TableCell>{e.fundacao}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => setDialogForm({ aberto: true, valores: e })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => setDialogApagar({ aberto: true, item: e })}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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

// ─── Aba: Estádios ────────────────────────────────────────────────────────────
function AbaEstadios({ setSnackbar }) {
  const [estadios, setEstadios] = useState(MOCK_ESTADIOS);
  const [dialogForm, setDialogForm] = useState({ aberto: false, valores: null });
  const [dialogApagar, setDialogApagar] = useState({ aberto: false, item: null });

  const campos = [
    { key: "nome", label: "Nome", fullWidth: true },
    { key: "cidade", label: "Cidade" },
    { key: "capacidade", label: "Capacidade", type: "number" },
  ];

  const handleGuardar = (form) => {
    if (form.id) {
      setEstadios((prev) => prev.map((e) => (e.id === form.id ? form : e)));
    } else {
      setEstadios((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setSnackbar({ aberto: true, msg: "Estádio guardado!", tipo: "success" });
  };

  const handleApagar = () => {
    setEstadios((prev) => prev.filter((e) => e.id !== dialogApagar.item.id));
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
              {["ID", "Nome", "Cidade", "Capacidade", ""].map((h) => (
                <TableCell key={h} sx={{ color: "white", fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {estadios.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.nome}</TableCell>
                <TableCell>{e.cidade}</TableCell>
                <TableCell>{Number(e.capacidade).toLocaleString("pt-PT")}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => setDialogForm({ aberto: true, valores: e })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => setDialogApagar({ aberto: true, item: e })}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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

// ─── Aba: Compras (só leitura) ────────────────────────────────────────────────
function AbaCompras() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.main" }}>
            {["ID", "Cliente", "Jogo", "Categoria", "Qtd", "Total", "Data"].map((h) => (
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
              <TableCell>{c.categoria}</TableCell>
              <TableCell>{c.qtd}</TableCell>
              <TableCell><strong>{c.total}</strong></TableCell>
              <TableCell>{c.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Componente principal Admin ───────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ aberto: false, msg: "", tipo: "success" });

  return (
    <Box sx={{ py: 5, bgcolor: "background.default", minHeight: "calc(100vh - 80px)" }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" color="secondary.dark" fontWeight={700}>
            Área restrita
          </Typography>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Painel de Administração
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 2,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
            }}
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
        open={snackbar.aberto}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, aberto: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.tipo} variant="filled" sx={{ width: "100%" }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}