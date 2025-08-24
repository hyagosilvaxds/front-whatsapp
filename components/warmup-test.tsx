"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";
import { getCampaigns, Campaign, CampaignsListResponse } from "@/lib/api/warmup";

export default function WarmupTest() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [response, setResponse] = useState<CampaignsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGetCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Chamando getCampaigns...");
      const result = await getCampaigns();
      
      console.log("Resposta completa:", result);
      setResponse(result);
      setCampaigns(result.data || []);
      
    } catch (err: any) {
      console.error("Erro ao buscar campanhas:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const testWithParams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Chamando getCampaigns com parâmetros...");
      const result = await getCampaigns({
        status: "active",
        page: 1,
        limit: 10
      });
      
      console.log("Resposta com parâmetros:", result);
      setResponse(result);
      setCampaigns(result.data || []);
      
    } catch (err: any) {
      console.error("Erro ao buscar campanhas com parâmetros:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testGetCampaigns();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teste da API de Warmup</h1>
        <div className="flex gap-2">
          <Button onClick={testGetCampaigns} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Buscar Todas
          </Button>
          <Button onClick={testWithParams} disabled={loading} variant="outline">
            Buscar com Filtros
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Erro:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Estrutura da Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campanhas Encontradas ({campaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma campanha encontrada</p>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Meta Diária:</span> {campaign.dailyMessageGoal}
                    </div>
                    <div>
                      <span className="font-medium">Sessões:</span> {campaign.campaignSessions?.length || 0}
                    </div>
                    <div>
                      <span className="font-medium">Contatos:</span> {campaign._count?.campaignContacts || 0}
                    </div>
                    <div>
                      <span className="font-medium">Templates:</span> {campaign._count?.messageTemplates || 0}
                    </div>
                  </div>
                  {campaign.campaignSessions && campaign.campaignSessions.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-2">Sessões:</h4>
                      <div className="space-y-1">
                        {campaign.campaignSessions.map((session) => (
                          <div key={session.id} className="text-xs bg-gray-50 p-2 rounded">
                            <div className="flex justify-between">
                              <span>{session.session.name} ({session.session.phone})</span>
                              <span className="font-medium">Saúde: {session.healthScore}%</span>
                            </div>
                            <div className="text-gray-600">
                              {session.dailyMessagesSent} mensagens hoje | Status: {session.session.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
