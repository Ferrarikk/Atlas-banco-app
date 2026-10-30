import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const C = {
  purple: "#6542B8",
  purpleDark: "#42277F",
  purpleSoft: "#F1EDFA",
  ink: "#211F27",
  muted: "#85818D",
  line: "#ECEAF0",
  green: "#16845D",
  red: "#C34D5B",
  white: "#FFFFFF",
  gold: "#B99A5B",
};

function BrandMark() {
  return (
    <View style={s.brandRow}>
      <View style={s.mark}>
        <Text style={s.markA}>A</Text>
        <View style={s.markSlash} />
      </View>
      <Text style={s.brand}>ATLAS <Text style={s.brandAccent}>BANK</Text></Text>
    </View>
  );
}

function Action({ symbol, label, onPress }: { symbol: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.action} activeOpacity={0.7} onPress={onPress}>
      <View style={s.actionIcon}><Text style={s.actionSymbol}>{symbol}</Text></View>
      <Text style={s.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [active, setActive] = useState("Início");
  const [showBalance, setShowBalance] = useState(true);
  const [message, setMessage] = useState("");

  const openAction = (name: string) => {
    setMessage(name + " estará disponível nas próximas etapas do protótipo.");
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View>
            <BrandMark />
            <Text style={s.greeting}>Olá, João.</Text>
            <Text style={s.subtitle}>Aqui está um resumo da sua conta.</Text>
          </View>
          <TouchableOpacity style={s.avatar} onPress={() => setActive("Perfil")} activeOpacity={0.7}>
            <Text style={s.avatarText}>J</Text>
          </TouchableOpacity>
        </View>

        <View style={s.balanceCard}>
          <View style={s.cardTop}>
            <Text style={s.balanceLabel}>SALDO DISPONÍVEL</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Text style={s.eye}>{showBalance ? "◉" : "◎"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.balance}>{showBalance ? "R$ 2.450,75" : "R$ ••••••"}</Text>
          <View style={s.cardBottom}>
            <Text style={s.account}>Conta de demonstração</Text>
            <Text style={s.cardDetail}>••••  2048</Text>
          </View>
          <View style={s.cardAccent} />
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.heading}>Acesso rápido</Text>
          <Text style={s.smallNote}>SERVIÇOS</Text>
        </View>
        <View style={s.actions}>
          <Action symbol="⇄" label="PIX" onPress={() => openAction("PIX")} />
          <Action symbol="↗" label="Transferir" onPress={() => openAction("Transferências")} />
          <Action symbol="▤" label="Pagar" onPress={() => openAction("Pagamentos")} />
          <Action symbol="▣" label="Cartões" onPress={() => setActive("Cartões")} />
        </View>

        {message ? (
          <TouchableOpacity style={s.message} onPress={() => setMessage("")}>
            <Text style={s.messageText}>{message}  ×</Text>
          </TouchableOpacity>
        ) : null}

        <View style={s.sectionRow}>
          <Text style={s.heading}>Últimas movimentações</Text>
          <TouchableOpacity onPress={() => setActive("Extrato")}><Text style={s.link}>Ver extrato</Text></TouchableOpacity>
        </View>

        <View style={s.tx}>
          <View style={s.txIcon}><Text style={s.txSymbol}>↓</Text></View>
          <View style={s.txBody}>
            <Text style={s.txTitle}>PIX recebido</Text>
            <Text style={s.txDate}>Hoje, 10:24 · Exemplo</Text>
          </View>
          <Text style={s.income}>+ R$ 500,00</Text>
        </View>
        <View style={s.tx}>
          <View style={s.txIcon}><Text style={s.txSymbol}>↗</Text></View>
          <View style={s.txBody}>
            <Text style={s.txTitle}>Transferência enviada</Text>
            <Text style={s.txDate}>Ontem, 09:12 · Exemplo</Text>
          </View>
          <Text style={s.expense}>− R$ 150,00</Text>
        </View>
        <View style={s.demoNote}>
          <View style={s.noteDot} />
          <View style={s.noteContent}>
            <Text style={s.noticeTitle}>Ambiente de demonstração</Text>
            <Text style={s.noticeText}>Saldo e movimentações são fictícios. Nenhuma operação financeira real é realizada.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={s.tabs}>
        {["Início", "Extrato", "Cartões", "Perfil"].map((tab) => (
          <TouchableOpacity key={tab} style={s.tabButton} onPress={() => setActive(tab)} activeOpacity={0.7}>
            <Text style={[s.tabIcon, active === tab && s.tabIconActive]}>{tab === "Início" ? "⌂" : tab === "Extrato" ? "▤" : tab === "Cartões" ? "▣" : "○"}</Text>
            <Text style={[s.tabText, active === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  page: { paddingHorizontal: 23, paddingTop: 17, paddingBottom: 30 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  brandRow: { flexDirection: "row", alignItems: "center" },
  mark: { width: 25, height: 27, justifyContent: "center", marginRight: 8 },
  markA: { color: C.ink, fontSize: 26, fontWeight: "900", lineHeight: 29 },
  markSlash: { position: "absolute", width: 19, height: 3, backgroundColor: C.purple, right: -1, top: 15, transform: [{ rotate: "-28deg" }] },
  brand: { color: C.ink, fontSize: 13, fontWeight: "900", letterSpacing: 2.1 },
  brandAccent: { color: C.purple },
  greeting: { color: C.ink, fontSize: 25, fontWeight: "700", marginTop: 20 },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 5 },
  avatar: { width: 43, height: 43, borderRadius: 22, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, alignItems: "center", justifyContent: "center" },
  avatarText: { color: C.purple, fontSize: 16, fontWeight: "700" },
  balanceCard: { backgroundColor: C.purpleDark, borderRadius: 17, padding: 21, minHeight: 158, justifyContent: "center", overflow: "hidden" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  balanceLabel: { color: "#DCD2EF", fontSize: 10, fontWeight: "700", letterSpacing: 1.4 },
  eye: { color: C.white, fontSize: 17 },
  balance: { color: C.white, fontSize: 31, fontWeight: "700", marginTop: 12, letterSpacing: 0.2 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", marginTop: 17, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.18)" },
  account: { color: "#DCD2EF", fontSize: 10 },
  cardDetail: { color: "#DCD2EF", fontSize: 10, letterSpacing: 1 },
  cardAccent: { position: "absolute", width: 110, height: 110, borderRadius: 55, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", right: -54, top: -52 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 15 },
  heading: { color: C.ink, fontSize: 17, fontWeight: "700" },
  smallNote: { color: C.muted, fontSize: 9, letterSpacing: 1.2 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  action: { alignItems: "center", width: "23%" },
  actionIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, alignItems: "center", justifyContent: "center" },
  actionSymbol: { color: C.purple, fontSize: 23, fontWeight: "600" },
  actionLabel: { color: C.ink, fontSize: 10, fontWeight: "600", marginTop: 8 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30, marginBottom: 3 },
  link: { color: C.purple, fontSize: 11, fontWeight: "700" },
  tx: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.line },
  txIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: C.purpleSoft, alignItems: "center", justifyContent: "center" },
  txSymbol: { color: C.purple, fontSize: 18, fontWeight: "700" },
  txBody: { flex: 1, marginLeft: 12 },
  txTitle: { color: C.ink, fontSize: 12, fontWeight: "700" },
  txDate: { color: C.muted, fontSize: 10, marginTop: 4 },
  income: { color: C.green, fontSize: 11, fontWeight: "700" },
  expense: { color: C.red, fontSize: 11, fontWeight: "700" },
  message: { backgroundColor: C.purpleSoft, padding: 12, borderRadius: 10, marginTop: 17 },
  messageText: { color: C.purpleDark, fontSize: 11 },
  demoNote: { flexDirection: "row", backgroundColor: "#FAF9FC", borderRadius: 12, padding: 13, marginTop: 22, borderWidth: 1, borderColor: C.line },
  noteDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.gold, marginTop: 4, marginRight: 10 },
  noteContent: { flex: 1 },
  noticeTitle: { color: C.ink, fontSize: 11, fontWeight: "700" },
  noticeText: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  tabs: { flexDirection: "row", justifyContent: "space-around", paddingTop: 10, paddingBottom: 8, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.white },
  tabButton: { alignItems: "center", minWidth: 55 },
  tabIcon: { color: C.muted, fontSize: 19, lineHeight: 22 },
  tabIconActive: { color: C.purple },
  tabText: { color: C.muted, fontSize: 9, marginTop: 3 },
  tabTextActive: { color: C.purple, fontWeight: "800" },
});