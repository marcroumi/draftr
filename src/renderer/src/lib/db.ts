// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = (): any => (window as any).api.db

export interface ProposalRow {
  id: string
  title: string
  status: string
  client_name: string
  value: number
  sections_json: string
  active_theme_id: string
  font_size: string
  created_at: number
  updated_at: number
}

export interface UpsertPayload {
  id: string
  title: string
  status: string
  client_name: string
  value: number
  sections_json: string
  active_theme_id: string
  font_size: string
  created_at: number
  updated_at: number
}

export const dbList      = (): Promise<ProposalRow[]>                      => api().list()
export const dbGet       = (id: string): Promise<ProposalRow | null>       => api().get(id)
export const dbUpsert    = (p: UpsertPayload): Promise<{ success: boolean }> => api().upsert(p)
export const dbDelete    = (id: string): Promise<{ success: boolean }>     => api().delete(id)
export const dbDuplicate = (id: string): Promise<{ success: boolean; id?: string }> => api().duplicate(id)
export const dbRename    = (id: string, title: string): Promise<{ success: boolean }> => api().rename(id, title)
