import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, Grid, Chip, Snackbar, Alert,
  Tooltip, Select, MenuItem, FormControl, InputLabel, Skeleton,
} from "@mui/material";
import AddIcon             from "@mui/icons-material/Add";
import EditIcon            from "@mui/icons-material/Edit";
import DeleteIcon          from "@mui/icons-material/Delete";
import SportsSoccerIcon    from "@mui/icons-material/SportsSoccer";
import StadiumIcon         from "@mui/icons-material/Stadium";
import GroupsIcon          from "@mui/icons-material/Groups";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ShoppingCartIcon    from "@mui/icons-material/ShoppingCart";
import DashboardIcon       from "@mui/icons-material/Dashboard";

import jogoService    from "../../services/jogo.service";
import equipaService  from "../../services/equipa.service";
import estadioService from "../../services/estadio.service";
import compraService  from "../../services/compra.service";
import bilheteService from "../../services/bilhete.service";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const PAGE_BG     = "#0a0f1e";
const SIDEBAR_BG  = "#0d1428";
const CONTENT_BG  = "#111827";
const CARD_BG     = "#1a2235";
const GOLD        = "#C8A850";
const GOLD2       = "#E0C068";
const WHITE       = "#FFFFFF";
const MUTED       = "rgba(255,255,255,0.45)";
const BORDER      = "rgba(255,255,255,0.07)";

// ─── Navegação lateral ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",  icon: <DashboardIcon /> },
  { id: "jogos",     label: "Jogos",      icon: <SportsSoccerIcon /> },
  { id: "equipas",   label: "Equipas",    icon: <GroupsIcon /> },
  { id: "estadios",  label: "Estádios",   icon: <StadiumIcon /> },
  { id: "bilhetes",  label: "Bilhetes",   icon: <ConfirmationNumberIcon /> },
  { id: "compras",   label: "Compras",    icon: <ShoppingCartIcon /> },
];

// ─── Estilos dos campos ───────────────────────────────────────────────────────
const inputSx = {
  bgcolor: "#f8f9fa", color: "#111",
  "& fieldset": { borderColor: "#ddd" },
  "&:hover fieldset": { borderColor: "#aaa" },
  "&.Mui-focused fieldset": { borderColor: GOLD },
};
const labelSx = { color: "#666", "&.Mui-focused": { color: GOLD } };
const selectSx = {
  bgcolor: "#f8f9fa", color: "#111",
  "& .MuiSelect-select": { color: "#111" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#aaa" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD },
  "& .MuiSvgIcon-root": { color: "#666" },
};
const menuProps = {
  PaperProps: { sx: {
    bgcolor: WHITE,
    "& .MuiMenuItem-root": { color: "#111" },
    "& .MuiMenuItem-root:hover": { bgcolor: "#f5f5f5" },
    "& .Mui-selected": { bgcolor: `${GOLD}22 !important`, fontWeight: 700 },
  }},
};

// ─── Tabela base ──────────────────────────────────────────────────────────────
const thSx = { color: GOLD, fontWeight: 700, bgcolor: "rgba(200,168,80,0.06)", borderBottom: `1px solid ${BORDER}`, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", py: 1.5 };
const tdSx = { color: "rgba(255,255,255,0.85)", borderBottom: `1px solid ${BORDER}`, py: 1.2, fontSize: "0.88rem" };

// ─── Dialog apagar ────────────────────────────────────────────────────────────
function DialogApagar({ aberto, onFechar, onConfirmar, descricao }) {
  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="xs" fullWidth
      PaperProps={{ sx: { bgcolor: CARD_BG, border: `1px solid ${BORDER}` } }}>
      <DialogTitle sx={{ color: WHITE, fontWeight: 700 }}>Confirmar Eliminação</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: MUTED }}>
          Tens a certeza que queres eliminar <strong style={{ color: WHITE }}>{descricao}</strong>? Esta ação não pode ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onFechar} sx={{ color: MUTED }}>Cancelar</Button>
        <Button onClick={onConfirmar} variant="contained" color="error">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Botão adicionar ──────────────────────────────────────────────────────────
function BotaoAdd({ label, onClick }) {
  return (
    <Button variant="contained" startIcon={<AddIcon />} onClick={onClick}
      sx={{ bgcolor: GOLD, color: "#0a0f1e", fontWeight: 800, fontSize: "0.8rem", "&:hover": { bgcolor: GOLD2 }, boxShadow: "none", borderRadius: "6px" }}>
      {label}
    </Button>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, valor, label, cor }) {
  return (
    <Box sx={{
      bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "10px",
      p: 2.5, display: "flex", alignItems: "center", gap: 2,
      transition: "transform 0.18s, box-shadow 0.18s",
      "&:hover": { transform: "translateY(-3px)", boxShadow: `0 8px 24px rgba(0,0,0,0.3)` },
    }}>
      <Box sx={{ width: 48, height: 48, borderRadius: "10px", bgcolor: `${cor}18`, border: `1px solid ${cor}33`, display: "flex", alignItems: "center", justifyContent: "center", color: cor, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: "1.6rem", lineHeight: 1 }}>{valor}</Typography>
        <Typography sx={{ color: MUTED, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", mt: 0.3 }}>{label}</Typography>
      </Box>
    </Box>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([jogoService.getAll(), equipaService.getAll(), estadioService.getAll(), compraService.getAll(), bilheteService.getAll()])
      .then(([j, e, es, c, b]) => setStats({
        jogos: (j.data||[]).length, equipas: (e.data||[]).length,
        estadios: (es.data||[]).length, compras: (c.data||[]).length, bilhetes: (b.data||[]).length,
      }));
  }, []);

  const cards = [
    { icon: <SportsSoccerIcon />,     label: "Jogos",    valor: stats?.jogos    ?? "—", cor: "#60a5fa" },
    { icon: <GroupsIcon />,           label: "Equipas",  valor: stats?.equipas  ?? "—", cor: GOLD },
    { icon: <StadiumIcon />,          label: "Estádios", valor: stats?.estadios ?? "—", cor: "#a78bfa" },
    { icon: <ConfirmationNumberIcon />,label: "Bilhetes", valor: stats?.bilhetes ?? "—", cor: "#34d399" },
    { icon: <ShoppingCartIcon />,     label: "Compras",  valor: stats?.compras  ?? "—", cor: "#f87171" },
  ];

  return (
    <Box>
      <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: "1.3rem", mb: 3 }}>Visão Geral</Typography>
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid key={c.label} size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard {...c} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ─── Aba Equipas ──────────────────────────────────────────────────────────────
function AbaEquipas({ setSnackbar }) {
  const [equipas, setEquipas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog]   = useState({ aberto: false, valores: null });
  const [apagar, setApagar]   = useState({ aberto: false, item: null });
  const [form, setForm]       = useState({ nome: "", sigla: "", fundacao: "" });
  const [logoFile, setLogoFile]     = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const equipasFiltradas = equipas.filter(e => e.nome.toLowerCase().includes(pesquisa.toLowerCase()));

  const carregar = async () => { try { const r = await equipaService.getAll(); setEquipas(r.data||[]); } finally { setLoading(false); } };
  useEffect(() => { carregar(); }, []);

  const abrirForm = (e = null) => {
    setForm(e || { nome: "", sigla: "", fundacao: "" });
    setLogoFile(null);
    setLogoPreview(e?.logo ? `http://localhost:5000${e.logo}` : null);
    setDialog({ aberto: true, valores: e });
  };

  const handleGuardar = async () => {
    try {
      // Usar FormData para suportar upload de ficheiro
      const formData = new FormData();
      formData.append("nome", form.nome || "");
      formData.append("sigla", form.sigla || "");
      formData.append("fundacao", form.fundacao || "");
      if (logoFile) formData.append("logo", logoFile);

      if (form.id) await equipaService.updateForm(form.id, formData);
      else await equipaService.createForm(formData);
      setSnackbar({ aberto: true, msg: form.id ? "Equipa atualizada!" : "Equipa criada!", tipo: "success" });
      setLogoFile(null); setLogoPreview(null);
      await carregar();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao guardar.";
      setSnackbar({ aberto: true, msg, tipo: "error" });
      console.error("Erro ao guardar equipa:", err);
    }
    setDialog({ aberto: false, valores: null });
  };

  const handleApagar = async () => {
    try { await equipaService.remove(apagar.item.id); setSnackbar({ aberto: true, msg: "Equipa eliminada.", tipo: "info" }); await carregar(); }
    catch { setSnackbar({ aberto: true, msg: "Erro ao eliminar.", tipo: "error" }); }
    setApagar({ aberto: false, item: null });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: "1.3rem" }}>Equipas</Typography>
        <BotaoAdd label="Nova Equipa" onClick={() => abrirForm()} />
      </Box>
      <TextField placeholder="Pesquisar equipa…" size="small" value={pesquisa} onChange={e=>setPesquisa(e.target.value)}
        sx={{mb:2,width:280,"& .MuiOutlinedInput-root":{bgcolor:"rgba(255,255,255,0.05)",color:WHITE,borderRadius:"8px","& fieldset":{borderColor:BORDER},"&:hover fieldset":{borderColor:"rgba(255,255,255,0.25)"},"&.Mui-focused fieldset":{borderColor:GOLD}},"& input::placeholder":{color:MUTED}}}
        inputProps={{style:{color:WHITE}}}
      />
      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "10px" }}>
        <Table size="small">
          <TableHead><TableRow>
            {["ID", "Nome", "Abrev.", "Fundação", ""].map((h) => <TableCell key={h} sx={thSx}>{h}</TableCell>)}
          </TableRow></TableHead>
          <TableBody>
            {loading ? Array.from({length:3}).map((_,i) => <TableRow key={i}>{[1,2,3,4].map(j=><TableCell key={j}><Skeleton sx={{bgcolor:"rgba(255,255,255,0.06)"}}/></TableCell>)}</TableRow>)
            : equipasFiltradas.map((e) => (
              <TableRow key={e.id} sx={{"&:hover":{bgcolor:"rgba(255,255,255,0.03)"}}}>
                <TableCell sx={{...tdSx,color:MUTED,fontSize:"0.78rem"}}>#{e.id}</TableCell>
                <TableCell sx={tdSx}>
                  <Box sx={{display:"flex",alignItems:"center",gap:1.5}}>
                    {e.logo
                      ? <Box component="img" src={`http://localhost:5000${e.logo}`} alt={e.nome} sx={{width:28,height:28,objectFit:"contain"}}/>
                      : <Box sx={{width:28,height:28,borderRadius:"50%",bgcolor:`${GOLD}22`,display:"flex",alignItems:"center",justifyContent:"center"}}><Typography sx={{fontSize:"0.65rem",fontWeight:800,color:GOLD}}>{(e.sigla||e.nome||"?").slice(0,2).toUpperCase()}</Typography></Box>
                    }
                    <Typography sx={{fontWeight:600,color:"rgba(255,255,255,0.85)",fontSize:"0.88rem"}}>{e.nome}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={tdSx}><Chip label={e.sigla||"—"} size="small" sx={{bgcolor:e.sigla?`${GOLD}18`:"transparent",color:e.sigla?GOLD:MUTED,border:`1px solid ${e.sigla?GOLD+"33":BORDER}`,fontWeight:700,fontSize:"0.72rem"}}/></TableCell>
                <TableCell sx={tdSx}>{e.fundacao||"—"}</TableCell>
                <TableCell sx={tdSx} align="right">
                  <Tooltip title="Editar"><IconButton size="small" onClick={() => abrirForm(e)} sx={{color:GOLD}}><EditIcon fontSize="small"/></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={() => setApagar({aberto:true,item:e})}><DeleteIcon fontSize="small"/></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialog.aberto} onClose={() => setDialog({aberto:false,valores:null})} maxWidth="xs" fullWidth PaperProps={{sx:{bgcolor:CARD_BG,border:`1px solid ${BORDER}`}}}>
        <DialogTitle sx={{color:WHITE,fontWeight:700}}>{dialog.valores ? "Editar Equipa" : "Nova Equipa"}</DialogTitle>
        <DialogContent>
          <Box sx={{display:"flex",flexDirection:"column",gap:2,mt:1}}>
            <TextField fullWidth label="Nome" size="small" value={form.nome||""} onChange={(e)=>setForm(f=>({...f,nome:e.target.value}))} InputLabelProps={{sx:labelSx}} InputProps={{sx:inputSx}}/>
            {/* Preview do logo */}
            {logoPreview && (
              <Box sx={{display:"flex",justifyContent:"center",mb:1}}>
                <Box component="img" src={logoPreview} alt="preview"
                  sx={{width:80,height:80,objectFit:"contain",borderRadius:"8px",border:"1px solid #ddd",bgcolor:"#f8f9fa",p:1}}/>
              </Box>
            )}
            {/* Upload do logo */}
            <Button component="label" variant="outlined" fullWidth size="small"
              sx={{borderColor:"#ddd",color:"#555","&:hover":{borderColor:GOLD,color:GOLD}}}>
              {logoFile ? logoFile.name : "Escolher Logo (JPG, PNG, SVG — máx 2MB)"}
              <input type="file" hidden accept="image/*" onChange={(e)=>{
                const f = e.target.files[0];
                if(f){ setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
              }}/>
            </Button>
            <TextField fullWidth label="Abreviatura (ex: GRV, ACO)" size="small" value={form.sigla||""} onChange={(e)=>{ if(e.target.value.length<=15) setForm(f=>({...f,sigla:e.target.value})); }} inputProps={{maxLength:15}} helperText={`${(form.sigla||"").length}/15 caracteres`} FormHelperTextProps={{sx:{color:(form.sigla||"").length===15?"#f87171":MUTED}}} InputLabelProps={{sx:labelSx}} InputProps={{sx:inputSx}}/>
            <TextField fullWidth label="Data de Fundação" type="date" size="small" value={form.fundacao||""} onChange={(e)=>setForm(f=>({...f,fundacao:e.target.value}))} InputLabelProps={{shrink:true,sx:labelSx}} InputProps={{sx:inputSx}}/>
          </Box>
        </DialogContent>
        <DialogActions sx={{px:3,pb:2}}>
          <Button onClick={() => setDialog({aberto:false,valores:null})} sx={{color:MUTED}}>Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained" sx={{bgcolor:GOLD,color:"#0a0f1e",fontWeight:700,"&:hover":{bgcolor:GOLD2}}}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <DialogApagar aberto={apagar.aberto} onFechar={()=>setApagar({aberto:false,item:null})} onConfirmar={handleApagar} descricao={apagar.item?.nome}/>
    </>
  );
}

// ─── Aba Estádios ─────────────────────────────────────────────────────────────
function AbaEstadios({ setSnackbar }) {
  const [estadios, setEstadios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dialog, setDialog]     = useState({ aberto: false, valores: null });
  const [apagar, setApagar]     = useState({ aberto: false, item: null });
  const [form, setForm]         = useState({ nome:"",morada:"",lotacao:"",preco_base:"" });
  const [pesquisaEs, setPesquisaEs] = useState("");
  const estadiosFiltrados = estadios.filter(e => e.nome.toLowerCase().includes(pesquisaEs.toLowerCase()));

  const carregar = async () => { try { const r = await estadioService.getAll(); setEstadios(r.data||[]); } finally { setLoading(false); } };
  useEffect(() => { carregar(); }, []);

  const handleGuardar = async () => {
    try {
      const d = { nome:form.nome, morada:form.morada, lotacao:Number(form.lotacao), preco_base:Number(form.preco_base) };
      if (form.id) await estadioService.update(form.id, d); else await estadioService.create(d);
      setSnackbar({ aberto:true, msg: form.id?"Estádio atualizado!":"Estádio criado!", tipo:"success" });
      await carregar();
    } catch { setSnackbar({aberto:true,msg:"Erro ao guardar.",tipo:"error"}); }
    setDialog({aberto:false,valores:null});
  };

  const handleApagar = async () => {
    try { await estadioService.remove(apagar.item.id); setSnackbar({aberto:true,msg:"Estádio eliminado.",tipo:"info"}); await carregar(); }
    catch { setSnackbar({aberto:true,msg:"Erro ao eliminar.",tipo:"error"}); }
    setApagar({aberto:false,item:null});
  };

  return (
    <>
      <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mb:3}}>
        <Typography sx={{color:WHITE,fontWeight:800,fontSize:"1.3rem"}}>Estádios</Typography>
        <BotaoAdd label="Novo Estádio" onClick={()=>{setForm({nome:"",morada:"",lotacao:"",preco_base:""});setDialog({aberto:true,valores:null});}}/>
      </Box>
      <TextField placeholder="Pesquisar estádio…" size="small" value={pesquisaEs} onChange={e=>setPesquisaEs(e.target.value)}
        sx={{mb:2,width:280,"& .MuiOutlinedInput-root":{bgcolor:"rgba(255,255,255,0.05)",color:WHITE,borderRadius:"8px","& fieldset":{borderColor:BORDER},"&:hover fieldset":{borderColor:"rgba(255,255,255,0.25)"},"&.Mui-focused fieldset":{borderColor:GOLD}},"& input::placeholder":{color:MUTED}}}
        inputProps={{style:{color:WHITE}}}
      />
      <TableContainer component={Paper} elevation={0} sx={{bgcolor:CARD_BG,border:`1px solid ${BORDER}`,borderRadius:"10px"}}>
        <Table size="small">
          <TableHead><TableRow>{["ID","Nome","Morada","Lotação","Preço Base",""].map(h=><TableCell key={h} sx={thSx}>{h}</TableCell>)}</TableRow></TableHead>
          <TableBody>
            {loading ? Array.from({length:3}).map((_,i)=><TableRow key={i}>{[1,2,3,4,5,6].map(j=><TableCell key={j}><Skeleton sx={{bgcolor:"rgba(255,255,255,0.06)"}}/></TableCell>)}</TableRow>)
            : estadiosFiltrados.map(e=>(
              <TableRow key={e.id} sx={{"&:hover":{bgcolor:"rgba(255,255,255,0.03)"}}}>
                <TableCell sx={{...tdSx,color:MUTED,fontSize:"0.78rem"}}>#{e.id}</TableCell>
                <TableCell sx={{...tdSx,fontWeight:600}}>{e.nome}</TableCell>
                <TableCell sx={tdSx}>{e.morada}</TableCell>
                <TableCell sx={tdSx}>{Number(e.lotacao).toLocaleString("pt-PT")}</TableCell>
                <TableCell sx={{...tdSx,color:GOLD,fontWeight:700}}>{Number(e.preco_base).toFixed(2)}€</TableCell>
                <TableCell sx={tdSx} align="right">
                  <Tooltip title="Editar"><IconButton size="small" onClick={()=>{setForm(e);setDialog({aberto:true,valores:e});}} sx={{color:GOLD}}><EditIcon fontSize="small"/></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={()=>setApagar({aberto:true,item:e})}><DeleteIcon fontSize="small"/></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialog.aberto} onClose={()=>setDialog({aberto:false,valores:null})} maxWidth="sm" fullWidth PaperProps={{sx:{bgcolor:CARD_BG,border:`1px solid ${BORDER}`}}}>
        <DialogTitle sx={{color:WHITE,fontWeight:700}}>{dialog.valores?"Editar Estádio":"Novo Estádio"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt:0.5}}>
            {[{k:"nome",l:"Nome",xs:12},{k:"morada",l:"Morada",xs:12},{k:"lotacao",l:"Lotação",xs:6,t:"number"},{k:"preco_base",l:"Preço Base (€)",xs:6,t:"number"}].map(f=>(
              <Grid key={f.k} size={{xs:f.xs}}>
                <TextField fullWidth label={f.l} type={f.t||"text"} size="small" value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} InputLabelProps={{sx:labelSx}} InputProps={{sx:inputSx}}/>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{px:3,pb:2}}>
          <Button onClick={()=>setDialog({aberto:false,valores:null})} sx={{color:MUTED}}>Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained" sx={{bgcolor:GOLD,color:"#0a0f1e",fontWeight:700,"&:hover":{bgcolor:GOLD2}}}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <DialogApagar aberto={apagar.aberto} onFechar={()=>setApagar({aberto:false,item:null})} onConfirmar={handleApagar} descricao={apagar.item?.nome}/>
    </>
  );
}

// ─── Aba Jogos ────────────────────────────────────────────────────────────────
function AbaJogos({ setSnackbar }) {
  const [jogos, setJogos]       = useState([]);
  const [equipas, setEquipas]   = useState([]);
  const [estadios, setEstadios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dialog, setDialog]     = useState({ aberto: false, valores: null });
  const [apagar, setApagar]     = useState({ aberto: false, item: null });
  const [form, setForm]         = useState({ data:"",hora:"",jornada:"",id_estadio:"",id_equipa_casa:"",id_equipa_fora:"" });
  const [jornadaFiltro, setJornadaFiltro] = useState(0);
  const jornadas = [...new Set(jogos.map(j=>j.jornada))].sort((a,b)=>a-b);
  const jogosFiltrados = jornadaFiltro === 0 ? jogos : jogos.filter(j=>j.jornada===jornadaFiltro);

  const carregar = async () => {
    try {
      const [rj,re,res] = await Promise.all([jogoService.getAll(),equipaService.getAll(),estadioService.getAll()]);
      // mapaEq: id → { nome, sigla } — usa sigla se existir, senão nome completo
      const mapaEq = Object.fromEntries((re.data||[]).map(e=>[e.id,{nome:e.nome,abrev:e.sigla||e.nome}]));
      const ms = Object.fromEntries((res.data||[]).map(e=>[e.id,e.nome]));
      setJogos((rj.data||[]).map(j=>({...j, equipa_casa_nome:mapaEq[j.id_equipa_casa]?.nome||`#${j.id_equipa_casa}`, equipa_casa_abrev:mapaEq[j.id_equipa_casa]?.abrev||`#${j.id_equipa_casa}`, equipa_fora_nome:mapaEq[j.id_equipa_fora]?.nome||`#${j.id_equipa_fora}`, equipa_fora_abrev:mapaEq[j.id_equipa_fora]?.abrev||`#${j.id_equipa_fora}`, estadio_nome:ms[j.id_estadio]||`#${j.id_estadio}` })));
      setEquipas(re.data||[]);
      setEstadios(res.data||[]);
    } finally { setLoading(false); }
  };
  useEffect(()=>{carregar();},[]);

  const handleGuardar = async () => {
    try {
      const d = {...form, jornada:Number(form.jornada), id_estadio:Number(form.id_estadio), id_equipa_casa:Number(form.id_equipa_casa), id_equipa_fora:Number(form.id_equipa_fora) };
      if (form.id) await jogoService.update(form.id,d); else await jogoService.create(d);
      setSnackbar({aberto:true,msg:form.id?"Jogo atualizado!":"Jogo criado!",tipo:"success"});
      await carregar();
    } catch { setSnackbar({aberto:true,msg:"Erro ao guardar.",tipo:"error"}); }
    setDialog({aberto:false,valores:null});
  };

  const handleApagar = async () => {
    try { await jogoService.remove(apagar.item.id); setSnackbar({aberto:true,msg:"Jogo eliminado.",tipo:"info"}); await carregar(); }
    catch { setSnackbar({aberto:true,msg:"Erro ao eliminar.",tipo:"error"}); }
    setApagar({aberto:false,item:null});
  };

  return (
    <>
      <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mb:3}}>
        <Typography sx={{color:WHITE,fontWeight:800,fontSize:"1.3rem"}}>Jogos</Typography>
        <BotaoAdd label="Novo Jogo" onClick={()=>{setForm({data:"",hora:"",jornada:"",id_estadio:"",id_equipa_casa:"",id_equipa_fora:""});setDialog({aberto:true,valores:null});}}/>
      </Box>
      <Box sx={{display:"flex",gap:2,mb:2,alignItems:"center"}}>
        <FormControl size="small" sx={{minWidth:180}}>
          <InputLabel sx={{color:MUTED,"&.Mui-focused":{color:GOLD}}}>Jornada</InputLabel>
          <Select value={jornadaFiltro} label="Jornada" onChange={e=>setJornadaFiltro(e.target.value)}
            sx={{bgcolor:"rgba(255,255,255,0.05)",color:WHITE,"& .MuiSelect-select":{color:WHITE},"& .MuiOutlinedInput-notchedOutline":{borderColor:BORDER},"&:hover .MuiOutlinedInput-notchedOutline":{borderColor:"rgba(255,255,255,0.25)"},"&.Mui-focused .MuiOutlinedInput-notchedOutline":{borderColor:GOLD},"& .MuiSvgIcon-root":{color:MUTED}}}
            MenuProps={{PaperProps:{sx:{bgcolor:"#1a2235","& .MuiMenuItem-root":{color:WHITE},"& .MuiMenuItem-root:hover":{bgcolor:"rgba(255,255,255,0.06)"},"& .Mui-selected":{bgcolor:"rgba(200,168,80,0.15) !important",color:GOLD}}}}}>
            <MenuItem value={0}>Todas as Jornadas</MenuItem>
            {jornadas.map(j=><MenuItem key={j} value={j}>Jornada {j}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{bgcolor:CARD_BG,border:`1px solid ${BORDER}`,borderRadius:"10px"}}>
        <Table size="small">
          <TableHead><TableRow>{["ID","Casa","Fora","Data","Hora","Estádio","Jornada",""].map(h=><TableCell key={h} sx={thSx}>{h}</TableCell>)}</TableRow></TableHead>
          <TableBody>
            {loading ? Array.from({length:3}).map((_,i)=><TableRow key={i}>{[1,2,3,4,5,6,7,8].map(j=><TableCell key={j}><Skeleton sx={{bgcolor:"rgba(255,255,255,0.06)"}}/></TableCell>)}</TableRow>)
            : jogosFiltrados.map(j=>(
              <TableRow key={j.id} sx={{"&:hover":{bgcolor:"rgba(255,255,255,0.03)"}}}>
                <TableCell sx={{...tdSx,color:MUTED,fontSize:"0.78rem"}}>#{j.id}</TableCell>
                <TableCell sx={{...tdSx,fontWeight:600}}><Tooltip title={j.equipa_casa_nome}><span>{j.equipa_casa_abrev}</span></Tooltip></TableCell>
                <TableCell sx={tdSx}><Tooltip title={j.equipa_fora_nome}><span>{j.equipa_fora_abrev}</span></Tooltip></TableCell>
                <TableCell sx={tdSx}>{j.data}</TableCell>
                <TableCell sx={tdSx}>{j.hora}</TableCell>
                <TableCell sx={tdSx}>{j.estadio_nome}</TableCell>
                <TableCell sx={tdSx}><Chip label={`J${j.jornada}`} size="small" sx={{bgcolor:`${GOLD}18`,color:GOLD,fontWeight:700,border:`1px solid ${GOLD}33`,fontSize:"0.72rem"}}/></TableCell>
                <TableCell sx={tdSx} align="right">
                  <Tooltip title="Editar"><IconButton size="small" onClick={()=>{setForm(j);setDialog({aberto:true,valores:j});}} sx={{color:GOLD}}><EditIcon fontSize="small"/></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={()=>setApagar({aberto:true,item:j})}><DeleteIcon fontSize="small"/></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialog.aberto} onClose={()=>setDialog({aberto:false,valores:null})} maxWidth="sm" fullWidth PaperProps={{sx:{bgcolor:CARD_BG,border:`1px solid ${BORDER}`}}}>
        <DialogTitle sx={{color:WHITE,fontWeight:700}}>{dialog.valores?"Editar Jogo":"Novo Jogo"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt:0.5}}>
            <Grid size={{xs:12,sm:6}}>
              <FormControl fullWidth size="small"><InputLabel sx={labelSx}>Equipa Casa</InputLabel>
                <Select value={form.id_equipa_casa||""} label="Equipa Casa" onChange={e=>setForm(f=>({...f,id_equipa_casa:e.target.value}))} sx={selectSx} MenuProps={menuProps}>
                  {equipas.map(e=><MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <FormControl fullWidth size="small"><InputLabel sx={labelSx}>Equipa Fora</InputLabel>
                <Select value={form.id_equipa_fora||""} label="Equipa Fora" onChange={e=>setForm(f=>({...f,id_equipa_fora:e.target.value}))} sx={selectSx} MenuProps={menuProps}>
                  {equipas.map(e=><MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12}}>
              <FormControl fullWidth size="small"><InputLabel sx={labelSx}>Estádio</InputLabel>
                <Select value={form.id_estadio||""} label="Estádio" onChange={e=>setForm(f=>({...f,id_estadio:e.target.value}))} sx={selectSx} MenuProps={menuProps}>
                  {estadios.map(e=><MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12,sm:4}}><TextField fullWidth label="Data" type="date" size="small" value={form.data||""} onChange={e=>setForm(f=>({...f,data:e.target.value}))} InputLabelProps={{shrink:true,sx:labelSx}} InputProps={{sx:inputSx}}/></Grid>
            <Grid size={{xs:12,sm:4}}><TextField fullWidth label="Hora" type="time" size="small" value={form.hora||""} onChange={e=>setForm(f=>({...f,hora:e.target.value}))} InputLabelProps={{shrink:true,sx:labelSx}} InputProps={{sx:inputSx}}/></Grid>
            <Grid size={{xs:12,sm:4}}><TextField fullWidth label="Jornada" type="number" size="small" value={form.jornada||""} onChange={e=>setForm(f=>({...f,jornada:e.target.value}))} InputLabelProps={{sx:labelSx}} InputProps={{sx:inputSx}}/></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{px:3,pb:2}}>
          <Button onClick={()=>setDialog({aberto:false,valores:null})} sx={{color:MUTED}}>Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained" sx={{bgcolor:GOLD,color:"#0a0f1e",fontWeight:700,"&:hover":{bgcolor:GOLD2}}}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <DialogApagar aberto={apagar.aberto} onFechar={()=>setApagar({aberto:false,item:null})} onConfirmar={handleApagar} descricao={apagar.item?`${apagar.item.equipa_casa_nome} vs ${apagar.item.equipa_fora_nome}`:""}/>
    </>
  );
}

// ─── Aba Bilhetes ─────────────────────────────────────────────────────────────
function AbaBilhetes() {
  const [resumo, setResumo]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [jornadaBilhete, setJornadaBilhete] = useState(0);
  const jornadasB = [...new Set(resumo.map(r=>r.jornada))].sort((a,b)=>a-b);
  const resumoFiltrado = jornadaBilhete === 0 ? resumo : resumo.filter(r=>r.jornada===jornadaBilhete);

  useEffect(() => {
    const carregar = async () => {
      try {
        // Buscar jogos, bilhetes e compras em paralelo — sem carregar bilhetes individualmente
        const [rj, re, rb, rc] = await Promise.all([
          jogoService.getAll(),
          equipaService.getAll(),
          bilheteService.getAll(),
          compraService.getAll(),
        ]);

        const equipas  = rj.data || [];
        const mapaEq = Object.fromEntries((re.data||[]).map(e=>[e.id,{nome:e.nome,abrev:e.sigla||e.nome}]));
        const bilhetes = rb.data || [];
        const compras  = rc.data || [];

        // IDs de bilhetes já comprados
        const bilhetesVendidosIds = new Set(compras.map(c => c.id_bilhete));

        // Agrupar bilhetes por jogo
        const porJogo = {};
        bilhetes.forEach(b => {
          if (!porJogo[b.id_jogo]) porJogo[b.id_jogo] = { total: 0, vendidos: 0, preco: b.custo };
          porJogo[b.id_jogo].total++;
          if (bilhetesVendidosIds.has(b.id)) porJogo[b.id_jogo].vendidos++;
        });

        // Construir resumo por jogo — usa sigla se existir
        const linhas = (rj.data||[]).map(j => ({
          id:          j.id,
          jogo:        `${mapaEq[j.id_equipa_casa]?.abrev||`#${j.id_equipa_casa}`} vs ${mapaEq[j.id_equipa_fora]?.abrev||`#${j.id_equipa_fora}`}`,
          jogoFull:    `${mapaEq[j.id_equipa_casa]?.nome||`#${j.id_equipa_casa}`} vs ${mapaEq[j.id_equipa_fora]?.nome||`#${j.id_equipa_fora}`}`,
          jornada:     j.jornada,
          data:        j.data,
          total:       porJogo[j.id]?.total    || 0,
          vendidos:    porJogo[j.id]?.vendidos  || 0,
          disponiveis: (porJogo[j.id]?.total||0) - (porJogo[j.id]?.vendidos||0),
          preco:       porJogo[j.id]?.preco     || 0,
        }));

        setResumo(linhas);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const pct = (vendidos, total) => total > 0 ? Math.round((vendidos / total) * 100) : 0;

  return (
    <>
      <Box sx={{mb:3}}>
        <Typography sx={{color:WHITE,fontWeight:800,fontSize:"1.3rem"}}>Disponibilidade de Bilhetes</Typography>
        <Typography sx={{color:MUTED,fontSize:"0.8rem",mt:0.5}}>Resumo por jogo — total, vendidos e disponíveis</Typography>
      </Box>

      <Box sx={{mb:2}}>
        <FormControl size="small" sx={{minWidth:180}}>
          <InputLabel sx={{color:MUTED,"&.Mui-focused":{color:GOLD}}}>Jornada</InputLabel>
          <Select value={jornadaBilhete} label="Jornada" onChange={e=>setJornadaBilhete(e.target.value)}
            sx={{bgcolor:"rgba(255,255,255,0.05)",color:WHITE,"& .MuiSelect-select":{color:WHITE},"& .MuiOutlinedInput-notchedOutline":{borderColor:BORDER},"&:hover .MuiOutlinedInput-notchedOutline":{borderColor:"rgba(255,255,255,0.25)"},"&.Mui-focused .MuiOutlinedInput-notchedOutline":{borderColor:GOLD},"& .MuiSvgIcon-root":{color:MUTED}}}
            MenuProps={{PaperProps:{sx:{bgcolor:"#1a2235","& .MuiMenuItem-root":{color:WHITE},"& .MuiMenuItem-root:hover":{bgcolor:"rgba(255,255,255,0.06)"},"& .Mui-selected":{bgcolor:"rgba(200,168,80,0.15) !important",color:GOLD}}}}}>
            <MenuItem value={0}>Todas as Jornadas</MenuItem>
            {jornadasB.map(j=><MenuItem key={j} value={j}>Jornada {j}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{bgcolor:CARD_BG,border:`1px solid ${BORDER}`,borderRadius:"10px"}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Jogo","Jornada","Data","Preço","Total","Vendidos","Disponíveis","Ocupação"].map(h=>(
                <TableCell key={h} sx={thSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({length:4}).map((_,i)=>(
                  <TableRow key={i}>{[1,2,3,4,5,6,7,8].map(j=><TableCell key={j}><Skeleton sx={{bgcolor:"rgba(255,255,255,0.06)"}}/></TableCell>)}</TableRow>
                ))
              : resumoFiltrado.map(r => {
                  const ocupacao = pct(r.vendidos, r.total);
                  const corOcupacao = ocupacao >= 90 ? "#f87171" : ocupacao >= 60 ? "#fbbf24" : "#34d399";
                  return (
                    <TableRow key={r.id} sx={{"&:hover":{bgcolor:"rgba(255,255,255,0.03)"}}}>
                      <TableCell sx={{...tdSx,fontWeight:600}}><Tooltip title={r.jogoFull||r.jogo}><span>{r.jogo}</span></Tooltip></TableCell>
                      <TableCell sx={tdSx}>
                        <Chip label={`J${r.jornada}`} size="small" sx={{bgcolor:`${GOLD}18`,color:GOLD,fontWeight:700,border:`1px solid ${GOLD}33`,fontSize:"0.72rem"}}/>
                      </TableCell>
                      <TableCell sx={{...tdSx,color:MUTED}}>{r.data}</TableCell>
                      <TableCell sx={{...tdSx,color:"#34d399",fontWeight:700}}>{Number(r.preco).toFixed(2)}€</TableCell>
                      <TableCell sx={tdSx}>{r.total.toLocaleString("pt-PT")}</TableCell>
                      <TableCell sx={{...tdSx,color:"#f87171",fontWeight:600}}>{r.vendidos.toLocaleString("pt-PT")}</TableCell>
                      <TableCell sx={{...tdSx,color:"#34d399",fontWeight:700}}>{r.disponiveis.toLocaleString("pt-PT")}</TableCell>
                      <TableCell sx={tdSx}>
                        {/* Barra de ocupação */}
                        <Box sx={{display:"flex",alignItems:"center",gap:1}}>
                          <Box sx={{flex:1,height:6,bgcolor:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                            <Box sx={{width:`${ocupacao}%`,height:"100%",bgcolor:corOcupacao,borderRadius:3,transition:"width 0.4s ease"}}/>
                          </Box>
                          <Typography sx={{color:corOcupacao,fontWeight:700,fontSize:"0.78rem",minWidth:32}}>
                            {ocupacao}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// ─── Aba Compras ──────────────────────────────────────────────────────────────
function AbaCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { compraService.getAll().then(r=>setCompras(r.data||[])).finally(()=>setLoading(false)); }, []);

  const estadoStyle = (e) =>
    e==="pago"      ? {bgcolor:"rgba(52,211,153,0.12)",color:"#34d399",border:"1px solid rgba(52,211,153,0.25)"}
    : e==="cancelado" ? {bgcolor:"rgba(248,113,113,0.12)",color:"#f87171",border:"1px solid rgba(248,113,113,0.25)"}
    : {bgcolor:"rgba(251,191,36,0.12)",color:"#fbbf24",border:"1px solid rgba(251,191,36,0.25)"};

  return (
    <>
      <Box sx={{mb:3}}><Typography sx={{color:WHITE,fontWeight:800,fontSize:"1.3rem"}}>Compras</Typography></Box>
      <TableContainer component={Paper} elevation={0} sx={{bgcolor:CARD_BG,border:`1px solid ${BORDER}`,borderRadius:"10px"}}>
        <Table size="small">
          <TableHead><TableRow>{["ID","ID Cliente","ID Bilhete","Estado","Data"].map(h=><TableCell key={h} sx={thSx}>{h}</TableCell>)}</TableRow></TableHead>
          <TableBody>
            {loading ? Array.from({length:3}).map((_,i)=><TableRow key={i}>{[1,2,3,4,5].map(j=><TableCell key={j}><Skeleton sx={{bgcolor:"rgba(255,255,255,0.06)"}}/></TableCell>)}</TableRow>)
            : compras.map(c=>(
              <TableRow key={c.id} sx={{"&:hover":{bgcolor:"rgba(255,255,255,0.03)"}}}>
                <TableCell sx={{...tdSx,color:MUTED,fontSize:"0.78rem"}}>#{c.id}</TableCell>
                <TableCell sx={tdSx}>{c.id_cliente}</TableCell>
                <TableCell sx={tdSx}>{c.id_bilhete}</TableCell>
                <TableCell sx={tdSx}><Chip label={c.estado} size="small" sx={{fontWeight:700,fontSize:"0.72rem",...estadoStyle(c.estado)}}/></TableCell>
                <TableCell sx={tdSx}>{c.dta_compra?new Date(c.dta_compra).toLocaleDateString("pt-PT"):"—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
const CONTEUDO = { dashboard:<Dashboard/>, jogos:<AbaJogos/>, equipas:<AbaEquipas/>, estadios:<AbaEstadios/>, bilhetes:<AbaBilhetes/>, compras:<AbaCompras/> };

export default function Admin() {
  const [secao, setSecao]       = useState("dashboard");
  const [snackbar, setSnackbar] = useState({ aberto:false, msg:"", tipo:"success" });

  // Injectar setSnackbar nas abas que precisam
  const renderConteudo = () => {
    if (secao === "equipas")   return <AbaEquipas   setSnackbar={setSnackbar} />;
    if (secao === "estadios")  return <AbaEstadios  setSnackbar={setSnackbar} />;
    if (secao === "jogos")     return <AbaJogos     setSnackbar={setSnackbar} />;
    if (secao === "bilhetes")  return <AbaBilhetes  setSnackbar={setSnackbar} />;
    if (secao === "compras")   return <AbaCompras />;
    return <Dashboard />;
  };

  return (
    <Box sx={{ display:"flex", minHeight:"calc(100vh - 80px)", bgcolor:PAGE_BG }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <Box sx={{
        width: 220, flexShrink: 0, bgcolor: SIDEBAR_BG,
        borderRight: `1px solid ${BORDER}`, py: 3, px: 1.5,
        display: "flex", flexDirection: "column", gap: 0.5,
      }}>
        <Typography sx={{ color:MUTED, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", px:1.5, mb:1 }}>
          Administração
        </Typography>
        {NAV_ITEMS.map((item) => {
          const active = secao === item.id;
          return (
            <Box key={item.id} onClick={() => setSecao(item.id)} sx={{
              display:"flex", alignItems:"center", gap:1.5,
              px:1.5, py:1.2, borderRadius:"8px", cursor:"pointer",
              bgcolor: active ? `${GOLD}15` : "transparent",
              border: active ? `1px solid ${GOLD}30` : "1px solid transparent",
              color: active ? GOLD : MUTED,
              transition: "all 0.15s",
              "&:hover": { bgcolor: active ? `${GOLD}15` : "rgba(255,255,255,0.04)", color: active ? GOLD : WHITE },
            }}>
              <Box sx={{ "& svg": { fontSize: 18 } }}>{item.icon}</Box>
              <Typography sx={{ fontWeight: active ? 700 : 500, fontSize:"0.88rem" }}>{item.label}</Typography>
              {active && <Box sx={{ ml:"auto", width:4, height:4, borderRadius:"50%", bgcolor:GOLD }}/>}
            </Box>
          );
        })}
      </Box>

      {/* ── Conteúdo ─────────────────────────────────────────────────────── */}
      <Box sx={{ flex:1, bgcolor:CONTENT_BG, p:4, overflowY:"auto" }}>
        {renderConteudo()}
      </Box>

      <Snackbar open={snackbar.aberto} autoHideDuration={3500}
        onClose={() => setSnackbar(s=>({...s,aberto:false}))}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity={snackbar.tipo} variant="filled" sx={{width:"100%"}}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}