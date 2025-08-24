// Teste rápido dos tipos atualizados
import type { UserData, LoginResponse, RegisterData } from './lib/types/auth';

// Teste LoginResponse
const loginResponse: LoginResponse = {
  user: {
    id: "test",
    name: "Test User",
    email: "test@example.com",
    role: "ORG_ADMIN",
    organization: {
      id: "org1",
      name: "Test Org",
      slug: "test-org"
    }
  },
  access_token: "jwt_token"
};

// Teste RegisterData
const registerData: RegisterData = {
  name: "New User",
  email: "new@example.com", 
  password: "password123",
  organizationId: "org1",
  role: "ORG_USER"
};

console.log("Tipos validados com sucesso!");
