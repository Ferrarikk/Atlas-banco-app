import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const C = { purple: "#5425A8", pale: "#F1ECFA", ink: "#211A2E", muted: "#81798D", line: "#EEEAF3", green: "#16865D", white: "#FFFFFF" };

function Action({ symbol, label }: { symbol: string; label: string }) {
  return <TouchableOpacity style={s.action} activeOpacity={0.75}><View style={s.actionIcon}><Text style={s.actionSymbol}>{symbol}</Text></View><Text style={s.actionLabel}>{label}</Text></TouchableOpacity>;
}

export default function App() {
  return <SafeAreaView style={s.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={C.white}/>
    <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      <View style={s.header}><View><Text style={s.brand}>ATLAS BANK</Text><Text style={s.greeting}>Olá, João</Text></View><View style={s.avatar}><Text style={s.avatarText}>J</Text></View></View>
      <View style={s.balanceCard}><View style={s.cardTop}><Text style={s.balanceLabel}>Saldo disponível</Text><Text style={s.demo}>CONTA TESTE</Text></View><Text style={s.balance}>R$ 2.450,75</Text><Text style={s.foot}>Valor fictício • ambiente de demonstração</Text><View style={s.orb}/></View>
      <Text style={s.heading}>Atalhos</Text><View style={s.actions}><Action symbol="⇄" label="PIX teste"/><Action symbol="↗" label="Transferir"/><Action symbol="▤" label="Pagar"/><Action symbol="▣" label="Cartões"/></View>
      <View style={s.sectionRow}><Text style={s.heading}>Movimentações</Text><Text style={s.link}>Ver extrato</Text></View>
      <View style={s.tx}><View style={s.txIcon}><Text style={s.txSymbol}>↓</Text></View><View style={s.txBody}><Text style={s.txTitle}>PIX recebido</Text><Text style={s.txDate}>Hoje, 10:24 • Exemplo</Text></View><Text style={s.income}>+ R$ 500,00</Text></View>
      <View style={s.tx}><View style={s.txIcon}><Text style={s.txSymbol}>↗</Text></View><View style={s.txBody}><Text style={s.txTitle}>Transferência</Text><Text style={s.txDate}>Ontem, 09:12 • Exemplo</Text></View><Text style={s.expense}>− R$ 150,00</Text></View>
      <View style={s.notice}><Text style={s.noticeTitle}>Protótipo em desenvolvimento</Text><Text style={s.noticeText}>Esta versão usa somente dados fictícios. Não existe conta bancária, PIX real ou movimentação de dinheiro.</Text></View>
    </ScrollView>
    <View style={s.tabs}><Text style={s.activeTab}>⌂{"\n"}Início</Text><Text style={s.tab}>▤{"\n"}Extrato</Text><Text style={s.tab}>▣{"\n"}Cartões</Text><Text style={s.tab}>○{"\n"}Perfil</Text></View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.white}, page:{paddingHorizontal:22,paddingTop:18,paddingBottom:28},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:25},
  brand:{color:C.purple,fontSize:11,fontWeight:"800",letterSpacing:2.1}, greeting:{color:C.ink,fontSize:25,fontWeight:"700",marginTop:5},
  avatar:{width:44,height:44,borderRadius:22,backgroundColor:C.pale,alignItems:"center",justifyContent:"center"},avatarText:{color:C.purple,fontSize:17,fontWeight:"800"},
  balanceCard:{backgroundColor:C.purple,borderRadius:22,padding:22,minHeight:164,justifyContent:"center",overflow:"hidden"},
  cardTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},balanceLabel:{color:"#E9DFFF",fontSize:13},
  demo:{color:C.white,fontSize:8,fontWeight:"800",letterSpacing:1,borderWidth:1,borderColor:"#BDA5E4",borderRadius:20,paddingHorizontal:9,paddingVertical:4},
  balance:{color:C.white,fontSize:32,fontWeight:"800",marginTop:13},foot:{color:"#E9DFFF",fontSize:10,marginTop:8},
  orb:{position:"absolute",width:150,height:150,borderRadius:75,borderWidth:24,borderColor:"rgba(255,255,255,0.08)",right:-65,bottom:-85},
  heading:{color:C.ink,fontSize:18,fontWeight:"700",marginTop:27,marginBottom:15},actions:{flexDirection:"row",justifyContent:"space-between"},
  action:{alignItems:"center",width:"23%"},actionIcon:{width:55,height:55,borderRadius:18,backgroundColor:C.pale,alignItems:"center",justifyContent:"center"},
  actionSymbol:{color:C.purple,fontSize:24,fontWeight:"700"},actionLabel:{color:C.ink,fontSize:10,fontWeight:"600",marginTop:8},
  sectionRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:3},link:{color:C.purple,fontSize:11,fontWeight:"700",marginTop:12},
  tx:{flexDirection:"row",alignItems:"center",paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.line},txIcon:{width:40,height:40,borderRadius:14,backgroundColor:C.pale,alignItems:"center",justifyContent:"center"},
  txSymbol:{color:C.purple,fontSize:19,fontWeight:"700"},txBody:{flex:1,marginLeft:12},txTitle:{color:C.ink,fontSize:12,fontWeight:"700"},txDate:{color:C.muted,fontSize:10,marginTop:4},
  income:{color:C.green,fontSize:11,fontWeight:"700"},expense:{color:"#C34A58",fontSize:11,fontWeight:"700"},
  notice:{backgroundColor:"#F7F4FC",borderRadius:15,padding:15,marginTop:23},noticeTitle:{color:C.purple,fontSize:12,fontWeight:"800"},noticeText:{color:C.muted,fontSize:10,lineHeight:16,marginTop:5},
  tabs:{flexDirection:"row",justifyContent:"space-around",paddingTop:11,paddingBottom:9,borderTopWidth:1,borderTopColor:C.line,backgroundColor:C.white},
  activeTab:{color:C.purple,fontSize:10,textAlign:"center",fontWeight:"800",lineHeight:17},tab:{color:C.muted,fontSize:10,textAlign:"center",lineHeight:17}
});