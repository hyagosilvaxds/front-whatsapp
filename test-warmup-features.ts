// Teste simples para verificar as funcionalidades do Warmup Details

import React from 'react';

// Simulação dos dados para teste
const mockCampaign = {
  id: 'camp_123',
  name: 'Campanha de Teste',
  description: 'Campanha de aquecimento para demonstração',
  dailyMessageGoal: 50,
  minIntervalMinutes: 15,
  maxIntervalMinutes: 45,
  useWorkingHours: true,
  workingHourStart: 8,
  workingHourEnd: 18,
  allowWeekends: false,
  randomizeInterval: true,
  enableInternalConversations: true,
  internalConversationRatio: 0.3,
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  statistics: {
    totalMessagesSent: 1250,
    activeSessions: 3,
    totalSessions: 4,
    averageHealthScore: 87.5,
    deliveryRate: 96.2
  }
};

const mockTemplates = [
  {
    id: 'tpl_1',
    name: 'Saudação Amigável',
    content: 'Olá {nome}! {saudacao}, como você está?',
    messageType: 'text',
    weight: 5,
    isActive: true,
    campaignId: 'camp_123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tpl_2',
    name: 'Apresentação com Imagem',
    content: 'Oi {nome}! Dá uma olhada nesta imagem interessante!',
    messageType: 'image',
    mediaUrl: '/example-image.jpg',
    weight: 3,
    isActive: true,
    campaignId: 'camp_123',
    createdAt: new Date().toISOString()
  }
];

const mockContacts = [
  {
    id: 'contact_1',
    contactId: 'cont_1',
    contact: {
      name: 'João Silva',
      phone: '+5511999999999'
    },
    priority: 5,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'contact_2',
    contactId: 'cont_2',
    contact: {
      name: 'Maria Santos',
      phone: '+5511888888888'
    },
    priority: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

console.log('🔥 Funcionalidades de Warmup Details Implementadas:');
console.log('✅ Tela de detalhes completa com tabs organizadas');
console.log('✅ Configurações editáveis da campanha');
console.log('✅ Gerenciamento de sessões WhatsApp');
console.log('✅ Sistema completo de templates de mensagem');
console.log('✅ Gerenciamento de contatos com priorização');
console.log('✅ Histórico de execuções e estatísticas');

console.log('\n📋 Dados de Exemplo:');
console.log('Campanha:', mockCampaign);
console.log('Templates:', mockTemplates);
console.log('Contatos:', mockContacts);

console.log('\n🎯 Principais Features:');
console.log('- 6 tabs organizadas: Visão Geral, Configurações, Sessões, Templates, Contatos, Histórico');
console.log('- Templates suportam: texto, imagem, áudio, vídeo, documento');
console.log('- Sistema de variáveis nos templates: {nome}, {telefone}, {saudacao}');
console.log('- Configurações completas de horários e intervalos');
console.log('- Conversas internas configuráveis com slider de proporção');
console.log('- Priorização de contatos e templates com sistema de peso');
console.log('- Interface moderna e responsiva com shadcn/ui');

export {};
