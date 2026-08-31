export interface Device { id: string; name: string; url: string; key: string; session?: string; online?: boolean; path?: string }

export class ShellApi {
  constructor(private readonly device: Device) {}
  private request(path: string, init?: RequestInit) {
    const url = new URL(path, this.device.url.endsWith('/') ? this.device.url : `${this.device.url}/`)
    url.searchParams.set('key', this.device.key)
    if (this.device.session) url.searchParams.set('session', this.device.session)
    return fetch(url, { ...init, signal: AbortSignal.timeout(15000) })
  }
  async command(cmd: string, method: 'GET' | 'POST') {
    const response = method === 'GET'
      ? await this.request(`/get?cmd=${encodeURIComponent(cmd)}`)
      : await this.request('/post', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cmd }) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.text()
  }
  async upload(file: File, targetPath?: string) {
    const body = new FormData(); body.append('file', file)
    if (targetPath) body.append('path', targetPath)
    const response = await this.request('/file_send', { method: 'POST', body })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.text()
  }
  async download(remotePath: string) {
    const response = await this.request(`/file_receive?path=${encodeURIComponent(remotePath)}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.blob()
  }
  async sessions() { return (await this.request('/session_list')).json() }
  async createSession() { return (await this.request('/session_create')).text() }
  async currentPath() { return (await this.request('/get_current_path')).text() }
  async deleteSession(session: string) { return this.request(`/session_delete?session=${encodeURIComponent(session)}`) }
  async sessionDetail(session: string) { return (await this.request(`/session_get?session=${encodeURIComponent(session)}`)).json() }
}
