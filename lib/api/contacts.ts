import api from './client';

// Interfaces
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  document?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  createdById?: string;
  contactTags: ContactTag[];
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  messages: any[];
  _count: {
    messages: number;
  };
}

export interface ContactTag {
  id: string;
  contactId: string;
  tagId: string;
  createdAt: string;
  tag: Tag;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  _count?: {
    contactTags: number;
  };
}

export interface CreateContactData {
  name: string;
  phone: string;
  email?: string;
  document?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  isActive?: boolean;
  tagIds?: string[];
}

export interface UpdateContactData {
  name?: string;
  phone?: string;
  email?: string;
  document?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  isActive?: boolean;
  tagIds?: string[];
}

export interface CreateTagData {
  name: string;
  color: string;
  description?: string;
}

export interface ContactsListParams {
  search?: string;
  tagId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactsResponse {
  data: Contact[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ImportSummary {
  message: string;
  summary: {
    total: number;
    success: number;
    errors: number;
    details: Array<{
      row: number;
      error: string;
    }>;
  };
}

export interface ImportContactData {
  name: string;
  phone: string;
  email?: string;
  document?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  isActive?: boolean;
  tags?: string[];
}

// Funções de contatos
export const getContacts = async (params?: ContactsListParams): Promise<ContactsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.tagId) queryParams.append('tagId', params.tagId);
  if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const response = await api.get(`/contacts?${queryParams.toString()}`);
  return response.data;
};

export const getContact = async (id: string): Promise<Contact> => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (data: CreateContactData): Promise<Contact> => {
  const response = await api.post('/contacts', data);
  return response.data;
};

export const updateContact = async (id: string, data: UpdateContactData): Promise<Contact> => {
  const response = await api.put(`/contacts/${id}`, data);
  return response.data;
};

export const deleteContact = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

// Funções de tags
export const getTags = async (): Promise<Tag[]> => {
  const response = await api.get('/contacts/tags');
  return response.data;
};

export const createTag = async (data: CreateTagData): Promise<Tag> => {
  const response = await api.post('/contacts/tags', data);
  return response.data;
};

export const addTagToContact = async (contactId: string, tagId: string): Promise<{ message: string }> => {
  const response = await api.post(`/contacts/${contactId}/tags/${tagId}`);
  return response.data;
};

export const removeTagFromContact = async (contactId: string, tagId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/contacts/${contactId}/tags/${tagId}`);
  return response.data;
};

// Funções de importação/exportação
export const downloadTemplate = async (): Promise<Blob> => {
  const response = await api.get('/contacts/template', {
    responseType: 'blob',
  });
  return response.data;
};

export const exportContacts = async (params?: {
  format?: 'xlsx' | 'csv';
  includeInactive?: boolean;
  tagIds?: string[];
}): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  
  if (params?.format) queryParams.append('format', params.format);
  if (params?.includeInactive !== undefined) queryParams.append('includeInactive', params.includeInactive.toString());
  if (params?.tagIds?.length) {
    params.tagIds.forEach(tagId => queryParams.append('tagIds', tagId));
  }

  const response = await api.get(`/contacts/export?${queryParams.toString()}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const importContacts = async (file: File): Promise<ImportSummary> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/contacts/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const importContactsJson = async (contacts: ImportContactData[]): Promise<ImportSummary> => {
  const response = await api.post('/contacts/import/json', { contacts });
  return response.data;
};

// Função utilitária para download de arquivos
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
