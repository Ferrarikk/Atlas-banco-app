import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const PURPLE = "#5425A8";
const LILAC = "#F0E9FC";
const INK = "#211A2E";
const MUTED = "#81798D";

function Action({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.action} activeOpacity={0.8}>
      <View style={styles.actionIcon}>
        <Text style={styles.actionSymbol}>{icon}</Text>
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>ATLAS BANK</Text>
            <Text style={styles.greeting}>Olá, João 👋</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <Text style={styles.balanceCaption}>Saldo disponível</Text>
            <Text style={styles.demoTag}>DEMONSTRAÇÃO</Text>
          </View>
          <Text style={styles.balance}>R$ 2.450,75</Text>
          <Text style={styles.balanceFoot}>Este é um saldo fictício para testes.</Text>
          <View style={styles.cardDecoration} />
        </View>

        <Text style={styles.sectionTitle}>Acesso rápido</Text>
        <View style={styles.actions}>
          <Action icon="⇄" label="PIX" />
          <Action icon="↗" label="Transferir" />
          <Action icon="▤" label="Pagar" />
          <Action icon="▣" label="Cartões" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas movimentações</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transaction}>
          <View style={styles.transactionIcon}><Text>↓</Text></View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>PIX recebido</Text>
            <Text style={styles.transactionDate}>Hoje • 10:24</Text>
          </View>
          <Text style={styles.income}>+ R$ 500,00</Text>
        </View>
        <View style={styles.transaction}>
          <View style={styles.transactionIcon}><Text>↗</Text></View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>Transferência</Text>
            <Text style={styles.transactionDate}>Ontem • 09:12</Text>
          </View>
          <Text style={styles.expense}>- R$ 150,00</Text>
        </View>
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Seu Atlas está em construção</Text>
          <Text style={styles.noticeText}>
            As funções financeiras desta versão são demonstrativas. Nenhum dinheiro real é movimentado.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <Text style={styles.tabActive}>⌂{"\n"}Início</Text>
        <Text style={styles.tab}>▤{"\n"}Extrato</Text>
        <Text style={styles.tab}>▣{"\n"}Cartões</Text>
        <Text style={styles.tab}>♙{"\n"}Perfil</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { padding: 22, paddingBottom: 28 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24, marginTop: 12 },
  eyebrow: { color: PURPLE, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  greeting: { color: INK, fontSize: 24, fontWeight: "700", marginTop: 5 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: LILAC, alignItems: "center", justifyContent: "center" },
  avatarText: { color: PURPLE, fontSize: 18, fontWeight: "800" },
  balanceCard: { backgroundColor: PURPLE, borderRadius: 22, padding: 22, overflow: "hidden", minHeight: 164, justifyContent: "center" },
  balanceTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  balanceCaption: { color: "#E9DFFF", fontSize: 14 },
  demoTag: { color: "#E9DFFF", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  balance: { color: "#FFFFFF", fontSize: 32, fontWeight: "800", marginTop: 12 },
  balanceFoot: { color: "#E9DFFF", fontSize: 11, marginTop: 8 },
  cardDecoration: { position: "absolute", width: 180, height: 180, borderRadius: 90, borderWidth: 28, borderColor: "rgba(255,255,255,0.08)", right: -75, top: 60 },
  sectionTitle: { color: INK, fontSize: 18, fontWeight: "700", marginTop: 28, marginBottom: 16 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  action: { alignItems: "center", width: "23%" },
  actionIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: LILAC, alignItems: "center", justifyContent: "center" },
  actionSymbol: { color: PURPLE, fontSize: 25, fontWeight: "700" },
  actionLabel: { color: INK, fontSize: 11, fontWeight: "600", marginTop: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  seeAll: { color: PURPLE, fontSize: 12, fontWeight: "700", marginTop: 12 },
  transaction: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F0EDF4" },
  transactionIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: LILAC, alignItems: "center", justifyContent: "center" },
  transactionInfo: { flex: 1, marginLeft: 12 },
  transactionName: { color: INK, fontSize: 13, fontWeight: "700" },
  transactionDate: { color: MUTED, fontSize: 11, marginTop: 4 },
  income: { color: "#16865D", fontSize: 12, fontWeight: "700" },
  expense: { color: "#C34A58", fontSize: 12, fontWeight: "700" },
  notice: { backgroundColor: "#F7F4FC", borderRadius: 16, padding: 16, marginTop: 24 },
  noticeTitle: { color: PURPLE, fontSize: 13, fontWeight: "800" },
  noticeText: { color: MUTED, fontSize: 11, lineHeight: 17, marginTop: 6 },
  tabBar: { flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#F0EDF4", paddingTop: 12, paddingBottom: 8, backgroundColor: "#FFFFFF" },
  tabActive: { color: PURPLE, fontSize: 11, textAlign: "center", fontWeight: "800", lineHeight: 18 },
  tab: { color: MUTED, fontSize: 11, textAlign: "center", lineHeight: 18 }
});