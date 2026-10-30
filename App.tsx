import React, { useMemo, useState } from "react";
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View, Alert
} from "react-native";

type Tab = "Início" | "Extrato" | "Cartões" | "Perfil";
type Operation = "PIX" | "Transferir" | "Pagar";
type Tx = { id: string; title: string; detail: string; amount: number; date: string; kind: "in" | "out" };

const C = {
  purple: "#6542B8", purpleDark: "#42277F", purpleSoft: "#F1EDFA",
  ink: "#211F27", muted: "#85818D", line: "#ECEAF0", green: "#16845D",
  red: "#C34D5B", white: "#FFFFFF", gold: "#B99A5B", bg: "#FBFAFC"
};
const initialTx: Tx[] = [
  { id: "1", title: "PIX recebido", detail: "Hoje, 10:24 · Demonstração", amount: 500, date: "Hoje", kind: "in" },
  { id: "2", title: "Transferência enviada", detail: "Ontem, 09:12 · Demonstração", amount: -150, date: "Ontem", kind: "out" },
  { id: "3", title: "Compra no débito", detail: "28 out · Demonstração", amount: -42.9, date: "Esta semana", kind: "out" },
  { id: "4", title: "PIX recebido", detail: "27 out · Demonstração", amount: 250, date: "Esta semana", kind: "in" }
];
const money = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function BrandMark() {
  return <View style={s.brandRow}><View style={s.mark}><Text style={s.markA}>A</Text><View style={s.markSlash} /></View><Text style={s.brand}>ATLAS <Text style={s.brandAccent}>BANK</Text></Text></View>;
}
function Button({ title, onPress, secondary = false }: { title: string; onPress: () => void; secondary?: boolean }) {
  return <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={[s.button, secondary && s.buttonSecondary]}><Text style={[s.buttonText, secondary && s.buttonTextSecondary]}>{title}</Text></TouchableOpacity>;
}
function Field({ label, value, onChangeText, placeholder, keyboardType = "default" }: any) {
  return <View style={s.fieldWrap}><Text style={s.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#AAA5B1" keyboardType={keyboardType} autoCapitalize="none" style={s.input}/></View>;
}
function Transaction({ tx }: { tx: Tx }) {
  return <View style={s.tx}><View style={s.txIcon}><Text style={s.txSymbol}>{tx.kind === "in" ? "↓" : "↗"}</Text></View><View style={s.txBody}><Text style={s.txTitle}>{tx.title}</Text><Text style={s.txDate}>{tx.detail}</Text></View><Text style={[s.txAmount, tx.kind === "in" ? s.income : s.expense]}>{tx.kind === "in" ? "+" : "−"} {money(Math.abs(tx.amount))}</Text></View>;
}

export default function App() {
  const [active, setActive] = useState<Tab>("Início");
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(2450.75);
  const [transactions, setTransactions] = useState<Tx[]>(initialTx);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<"Todas" | "Entradas" | "Saídas">("Todas");
  const [cardLocked, setCardLocked] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [profileName, setProfileName] = useState("João");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => transactions.filter(t => filter === "Todas" || (filter === "Entradas" ? t.kind === "in" : t.kind === "out")), [transactions, filter]);
  const go = (tab: Tab) => { setOperation(null); setNotice(""); setActive(tab); };
  const startOperation = (op: Operation) => { setRecipient(""); setAmount(""); setDescription(""); setOperation(op); setNotice(""); };
  const finishOperation = () => {
    const numeric = Number(amount.replace(",", "."));
    if (!recipient.trim() || !Number.isFinite(numeric) || numeric <= 0) {
      setNotice("Preencha o destinatário e um valor válido.");
      return;
    }
    if (numeric > balance) {
      setNotice("Saldo demonstrativo insuficiente para esta simulação.");
      return;
    }
    const title = operation === "PIX" ? "PIX simulado" : operation === "Transferir" ? "Transferência simulada" : "Pagamento simulado";
    const now = new Date().toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    const tx: Tx = { id: String(Date.now()), title, detail: now + " · Operação fictícia", amount: -numeric, date: "Hoje", kind: "out" };
    setTransactions(prev => [tx, ...prev]);
    setBalance(prev => Number((prev - numeric).toFixed(2)));
    setOperation(null);
    setActive("Extrato");
    setNotice("Simulação concluída. Nenhum dinheiro foi enviado ou pago.");
  };

  const header = (title: string, subtitle?: string) => <View style={s.pageHeading}><Text style={s.pageTitle}>{title}</Text>{subtitle ? <Text style={s.pageSubtitle}>{subtitle}</Text> : null}</View>;
  const renderHome = () => <>
    <View style={s.header}><View><BrandMark/><Text style={s.greeting}>Olá, {profileName}.</Text><Text style={s.subtitle}>Aqui está um resumo da sua conta.</Text></View><TouchableOpacity style={s.avatar} onPress={() => go("Perfil")}><Text style={s.avatarText}>{profileName.slice(0,1).toUpperCase()}</Text></TouchableOpacity></View>
    <View style={s.balanceCard}><View style={s.cardTop}><Text style={s.balanceLabel}>SALDO DISPONÍVEL</Text><TouchableOpacity onPress={() => setShowBalance(!showBalance)}><Text style={s.eye}>{showBalance ? "◉" : "◎"}</Text></TouchableOpacity></View><Text style={s.balance}>{showBalance ? money(balance) : "R$ ••••••"}</Text><View style={s.cardBottom}><Text style={s.account}>Conta de demonstração</Text><Text style={s.cardDetail}>•••• 2048</Text></View><View style={s.cardAccent}/></View>
    <View style={s.sectionHeader}><Text style={s.heading}>Acesso rápido</Text><Text style={s.smallNote}>SERVIÇOS</Text></View>
    <View style={s.actions}><Quick symbol="⇄" label="PIX" onPress={() => startOperation("PIX")}/><Quick symbol="↗" label="Transferir" onPress={() => startOperation("Transferir")}/><Quick symbol="▤" label="Pagar" onPress={() => startOperation("Pagar")}/><Quick symbol="▣" label="Cartões" onPress={() => go("Cartões")}/></View>
    <View style={s.sectionRow}><Text style={s.heading}>Últimas movimentações</Text><TouchableOpacity onPress={() => go("Extrato")}><Text style={s.link}>Ver extrato</Text></TouchableOpacity></View>
    {transactions.slice(0,3).map(tx => <Transaction key={tx.id} tx={tx}/>)}
    <View style={s.demoNote}><View style={s.noteDot}/><View style={s.noteContent}><Text style={s.noticeTitle}>Ambiente de demonstração</Text><Text style={s.noticeText}>Saldo e operações são fictícios. Nenhuma movimentação financeira real é realizada.</Text></View></View>
  </>;
  const renderStatement = () => <>
    {header("Extrato", "Acompanhe as movimentações da conta demonstrativa.")}
    <View style={s.filterRow}>{(["Todas","Entradas","Saídas"] as const).map(v => <TouchableOpacity key={v} onPress={() => setFilter(v)} style={[s.filter, filter === v && s.filterActive]}><Text style={[s.filterText, filter === v && s.filterTextActive]}>{v}</Text></TouchableOpacity>)}</View>
    {filtered.length ? filtered.map(tx => <Transaction key={tx.id} tx={tx}/>) : <Text style={s.empty}>Nenhuma movimentação nesta categoria.</Text>}
    <Text style={s.helper}>Este extrato contém apenas dados fictícios de demonstração.</Text>
  </>;
  const renderCards = () => <>
    {header("Cartões", "Gerencie seu cartão demonstrativo.")}
    <View style={s.virtualCard}><Text style={s.virtualBrand}>ATLAS <Text style={{color:"#D6C18D"}}>BANK</Text></Text><Text style={s.virtualNumber}>••••  ••••  ••••  2048</Text><View style={s.virtualBottom}><View><Text style={s.virtualCaption}>TITULAR</Text><Text style={s.virtualName}>{profileName.toUpperCase()}</Text></View><Text style={s.virtualChip}>◈</Text></View></View>
    <View style={s.infoCard}><Text style={s.infoTitle}>Cartão virtual demonstrativo</Text><Text style={s.infoText}>Os dados exibidos não correspondem a um cartão real e não podem ser usados em compras.</Text></View>
    <View style={s.settingRow}><View style={{flex:1}}><Text style={s.settingTitle}>Bloquear cartão</Text><Text style={s.settingText}>Simula o bloqueio do cartão demonstrativo.</Text></View><TouchableOpacity onPress={() => setCardLocked(!cardLocked)} style={[s.toggle, cardLocked && s.toggleOn]}><View style={[s.toggleKnob, cardLocked && s.toggleKnobOn]}/></TouchableOpacity></View>
    <View style={[s.statusBox, cardLocked ? s.statusBlocked : s.statusReady]}><Text style={s.statusText}>{cardLocked ? "Cartão demonstrativo bloqueado" : "Cartão demonstrativo desbloqueado"}</Text></View>
  </>;
  const renderProfile = () => <>
    {header("Perfil", "Preferências da sua conta de demonstração.")}
    <View style={s.profileAvatar}><Text style={s.profileAvatarText}>{profileName.slice(0,1).toUpperCase()}</Text></View>
    <Field label="NOME DE EXIBIÇÃO" value={profileName} onChangeText={setProfileName} placeholder="Seu nome"/>
    <View style={s.infoCard}><Text style={s.infoTitle}>Segurança e privacidade</Text><Text style={s.infoText}>O protótipo ainda não possui autenticação real, biometria ou armazenamento de dados pessoais. Não informe senhas nem dados bancários.</Text></View>
    <View style={s.settingRow}><Text style={s.settingTitle}>Notificações demonstrativas</Text><Text style={s.badge}>ATIVAS</Text></View>
    <Button title="Voltar ao início" onPress={() => go("Início")} secondary/>
  </>;
  const renderOperation = () => operation ? <>
    <TouchableOpacity onPress={() => setOperation(null)} style={s.back}><Text style={s.backText}>‹  Voltar</Text></TouchableOpacity>
    {header(operation, operation === "PIX" ? "Simule um envio usando uma chave fictícia." : operation === "Transferir" ? "Simule uma transferência entre contas fictícias." : "Simule o pagamento de uma cobrança fictícia.")}
    <View style={s.infoCard}><Text style={s.infoTitle}>Operação de teste</Text><Text style={s.infoText}>Nada será enviado, cobrado ou transferido. A simulação apenas atualiza o saldo e o extrato desta sessão.</Text></View>
    <Field label={operation === "Pagar" ? "IDENTIFICAÇÃO DA COBRANÇA" : operation === "PIX" ? "CHAVE PIX FICTÍCIA" : "DESTINATÁRIO"} value={recipient} onChangeText={setRecipient} placeholder={operation === "PIX" ? "exemplo@teste.com" : "Nome de demonstração"}/>
    <Field label="VALOR (R$)" value={amount} onChangeText={setAmount} placeholder="0,00" keyboardType="decimal-pad"/>
    <Field label="DESCRIÇÃO (OPCIONAL)" value={description} onChangeText={setDescription} placeholder="Ex.: teste de operação"/>
    <View style={s.available}><Text style={s.availableLabel}>SALDO PARA SIMULAÇÃO</Text><Text style={s.availableValue}>{money(balance)}</Text></View>
    {notice ? <Text style={s.error}>{notice}</Text> : null}
    <Button title="Revisar e simular operação" onPress={finishOperation}/>
    <Button title="Cancelar" onPress={() => setOperation(null)} secondary/>
  </> : null;

  return <SafeAreaView style={s.safe}><StatusBar barStyle="dark-content" backgroundColor={C.white}/><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    {operation ? renderOperation() : active === "Início" ? renderHome() : active === "Extrato" ? renderStatement() : active === "Cartões" ? renderCards() : renderProfile()}
    {notice && !operation ? <TouchableOpacity style={s.noticeToast} onPress={() => setNotice("")}><Text style={s.noticeToastText}>{notice}  ×</Text></TouchableOpacity> : null}
  </ScrollView>
  {!operation ? <View style={s.tabs}>{(["Início","Extrato","Cartões","Perfil"] as Tab[]).map(tab => <TouchableOpacity key={tab} style={s.tabButton} onPress={() => go(tab)} activeOpacity={0.7}><Text style={[s.tabIcon, active === tab && s.tabIconActive]}>{tab === "Início" ? "⌂" : tab === "Extrato" ? "▤" : tab === "Cartões" ? "▣" : "○"}</Text><Text style={[s.tabText, active === tab && s.tabTextActive]}>{tab}</Text></TouchableOpacity>)}</View> : null}
  </SafeAreaView>;
}
function Quick({symbol,label,onPress}:{symbol:string;label:string;onPress:()=>void}) {
  return <TouchableOpacity style={s.action} activeOpacity={0.72} onPress={onPress}><View style={s.actionIcon}><Text style={s.actionSymbol}>{symbol}</Text></View><Text style={s.actionLabel}>{label}</Text></TouchableOpacity>;
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.white}, page:{paddingHorizontal:23,paddingTop:17,paddingBottom:35},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:25}, brandRow:{flexDirection:"row",alignItems:"center"},
  mark:{width:25,height:27,justifyContent:"center",marginRight:8},markA:{color:C.ink,fontSize:26,fontWeight:"900",lineHeight:29},markSlash:{position:"absolute",width:19,height:3,backgroundColor:C.purple,right:-1,top:15,transform:[{rotate:"-28deg"}]},
  brand:{color:C.ink,fontSize:13,fontWeight:"900",letterSpacing:2.1},brandAccent:{color:C.purple},greeting:{color:C.ink,fontSize:25,fontWeight:"700",marginTop:20},subtitle:{color:C.muted,fontSize:12,marginTop:5},
  avatar:{width:43,height:43,borderRadius:22,borderWidth:1,borderColor:C.line,alignItems:"center",justifyContent:"center"},avatarText:{color:C.purple,fontSize:16,fontWeight:"700"},
  balanceCard:{backgroundColor:C.purpleDark,borderRadius:17,padding:21,minHeight:158,justifyContent:"center",overflow:"hidden"},cardTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},balanceLabel:{color:"#DCD2EF",fontSize:10,fontWeight:"700",letterSpacing:1.4},eye:{color:C.white,fontSize:17},balance:{color:C.white,fontSize:31,fontWeight:"700",marginTop:12},
  cardBottom:{flexDirection:"row",justifyContent:"space-between",marginTop:17,paddingTop:12,borderTopWidth:1,borderTopColor:"rgba(255,255,255,0.18)"},account:{color:"#DCD2EF",fontSize:10},cardDetail:{color:"#DCD2EF",fontSize:10,letterSpacing:1},cardAccent:{position:"absolute",width:110,height:110,borderRadius:55,borderWidth:1,borderColor:"rgba(255,255,255,0.12)",right:-54,top:-52},
  sectionHeader:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:28,marginBottom:15},heading:{color:C.ink,fontSize:17,fontWeight:"700"},smallNote:{color:C.muted,fontSize:9,letterSpacing:1.2},actions:{flexDirection:"row",justifyContent:"space-between"},action:{alignItems:"center",width:"23%"},actionIcon:{width:54,height:54,borderRadius:16,backgroundColor:C.white,borderWidth:1,borderColor:C.line,alignItems:"center",justifyContent:"center"},actionSymbol:{color:C.purple,fontSize:23,fontWeight:"600"},actionLabel:{color:C.ink,fontSize:10,fontWeight:"600",marginTop:8},
  sectionRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:30,marginBottom:3},link:{color:C.purple,fontSize:11,fontWeight:"700"},
  tx:{flexDirection:"row",alignItems:"center",paddingVertical:15,borderBottomWidth:1,borderBottomColor:C.line},txIcon:{width:39,height:39,borderRadius:13,backgroundColor:C.purpleSoft,alignItems:"center",justifyContent:"center"},txSymbol:{color:C.purple,fontSize:18,fontWeight:"700"},txBody:{flex:1,marginLeft:12},txTitle:{color:C.ink,fontSize:12,fontWeight:"700"},txDate:{color:C.muted,fontSize:10,marginTop:4},txAmount:{fontSize:11,fontWeight:"700"},income:{color:C.green},expense:{color:C.red},
  demoNote:{flexDirection:"row",backgroundColor:"#FAF9FC",borderRadius:12,padding:13,marginTop:22,borderWidth:1,borderColor:C.line},noteDot:{width:7,height:7,borderRadius:4,backgroundColor:C.gold,marginTop:4,marginRight:10},noteContent:{flex:1},noticeTitle:{color:C.ink,fontSize:11,fontWeight:"700"},noticeText:{color:C.muted,fontSize:10,lineHeight:15,marginTop:4},
  tabs:{flexDirection:"row",justifyContent:"space-around",paddingTop:10,paddingBottom:8,borderTopWidth:1,borderTopColor:C.line,backgroundColor:C.white},tabButton:{alignItems:"center",minWidth:55},tabIcon:{color:C.muted,fontSize:19,lineHeight:22},tabIconActive:{color:C.purple},tabText:{color:C.muted,fontSize:9,marginTop:3},tabTextActive:{color:C.purple,fontWeight:"800"},
  pageHeading:{marginTop:8,marginBottom:23},pageTitle:{fontSize:27,fontWeight:"800",color:C.ink},pageSubtitle:{fontSize:12,color:C.muted,marginTop:6,lineHeight:18},
  filterRow:{flexDirection:"row",gap:8,marginBottom:8},filter:{paddingVertical:9,paddingHorizontal:15,borderRadius:20,backgroundColor:C.bg,borderWidth:1,borderColor:C.line},filterActive:{backgroundColor:C.purpleSoft,borderColor:C.purple},filterText:{fontSize:11,color:C.muted,fontWeight:"600"},filterTextActive:{color:C.purple},
  empty:{textAlign:"center",color:C.muted,paddingVertical:35,fontSize:13},helper:{fontSize:10,color:C.muted,lineHeight:16,marginTop:18},
  virtualCard:{backgroundColor:C.purpleDark,borderRadius:19,padding:22,minHeight:190,justifyContent:"space-between"},virtualBrand:{fontSize:14,fontWeight:"900",letterSpacing:2,color:C.white},virtualNumber:{fontSize:20,color:C.white,letterSpacing:2,marginTop:25},virtualBottom:{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"},virtualCaption:{fontSize:8,color:"#DCD2EF",letterSpacing:1.2},virtualName:{fontSize:12,color:C.white,fontWeight:"700",marginTop:5},virtualChip:{fontSize:28,color:"#D6C18D"},
  infoCard:{backgroundColor:C.bg,borderRadius:13,borderWidth:1,borderColor:C.line,padding:15,marginTop:17,marginBottom:18},infoTitle:{fontSize:12,fontWeight:"800",color:C.ink},infoText:{fontSize:11,color:C.muted,lineHeight:17,marginTop:6},
  settingRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:17,borderBottomWidth:1,borderBottomColor:C.line},settingTitle:{fontSize:12,fontWeight:"700",color:C.ink},settingText:{fontSize:10,color:C.muted,marginTop:4},toggle:{width:47,height:27,borderRadius:15,backgroundColor:"#D9D5DF",padding:3,justifyContent:"center"},toggleOn:{backgroundColor:C.purple},toggleKnob:{width:21,height:21,borderRadius:11,backgroundColor:C.white},toggleKnobOn:{alignSelf:"flex-end"},statusBox:{padding:12,borderRadius:10,marginTop:15},statusReady:{backgroundColor:"#EAF6F0"},statusBlocked:{backgroundColor:"#FCEDEF"},statusText:{fontSize:11,fontWeight:"700",color:C.ink,textAlign:"center"},badge:{fontSize:9,color:C.green,fontWeight:"800",letterSpacing:1},
  profileAvatar:{width:66,height:66,borderRadius:34,backgroundColor:C.purpleSoft,alignItems:"center",justifyContent:"center",alignSelf:"center",marginBottom:22},profileAvatarText:{fontSize:26,fontWeight:"800",color:C.purple},
  fieldWrap:{marginBottom:16},fieldLabel:{fontSize:9,fontWeight:"800",letterSpacing:1,color:C.muted,marginBottom:7},input:{height:48,borderWidth:1,borderColor:C.line,borderRadius:11,paddingHorizontal:13,color:C.ink,fontSize:13,backgroundColor:C.white},
  button:{height:49,backgroundColor:C.purple,borderRadius:12,alignItems:"center",justifyContent:"center",marginTop:12},buttonSecondary:{backgroundColor:C.white,borderWidth:1,borderColor:C.line},buttonText:{color:C.white,fontSize:12,fontWeight:"800"},buttonTextSecondary:{color:C.purple},
  back:{paddingVertical:8,marginBottom:8},backText:{fontSize:14,color:C.purple,fontWeight:"700"},available:{backgroundColor:C.purpleSoft,padding:14,borderRadius:11,marginBottom:12},availableLabel:{fontSize:9,color:C.muted,fontWeight:"800",letterSpacing:1},availableValue:{fontSize:18,color:C.purpleDark,fontWeight:"800",marginTop:5},error:{fontSize:11,color:C.red,marginVertical:7},
  noticeToast:{padding:12,backgroundColor:C.purpleSoft,borderRadius:10,marginTop:17},noticeToastText:{fontSize:11,color:C.purpleDark}
});
