'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Acesso Negado
          </CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta página. Entre em contato com o administrador do sistema se acredita que isto é um erro.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Ir para Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Se você precisa de acesso a esta funcionalidade, solicite ao administrador que ajuste suas permissões.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
