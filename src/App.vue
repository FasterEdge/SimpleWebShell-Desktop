<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ShellApi, type Device } from './lib/api'

const devices = ref<Device[]>(JSON.parse(localStorage.getItem('sws-devices') || '[]'))
const selectedId = ref(devices.value[0]?.id || '')
const form = ref({ name: '', url: 'http://127.0.0.1:8878', key: '' })
const command = ref('uname -a')
const method = ref<'GET' | 'POST'>('GET')
const output = ref('')
const error = ref('')
const loading = ref(false)
const sessions = ref<any[]>([])
const detail = ref('')
const useSession = ref(false)

const selected = computed(() => devices.value.find(d => d.id === selectedId.value))
const api = computed(() => selected.value ? new ShellApi(selected.value) : null)
function save() {
  if (!form.value.name || !form.value.url || !form.value.key) return error.value = '请填写设备名称、地址和访问密钥'
  const device = { ...form.value, id: crypto.randomUUID(), online: false } as Device
  devices.value.push(device); selectedId.value = device.id; persist(); form.value = { name: '', url: device.url, key: '' }
}
function persist() { localStorage.setItem('sws-devices', JSON.stringify(devices.value)) }
function remove() { if (!selected.value) return; devices.value = devices.value.filter(d => d.id !== selected.value!.id); selectedId.value = devices.value[0]?.id || ''; persist() }
async function refresh() {
  if (!api.value) return error.value = '请先添加设备'
  loading.value = true; error.value = ''
  try { selected.value!.path = await api.value.currentPath(); selected.value!.online = true; sessions.value = await api.value.sessions(); persist() }
  catch (e) { selected.value!.online = false; error.value = e instanceof Error ? e.message : '连接失败' }
  finally { loading.value = false }
}
async function run() {
  if (!api.value || !command.value.trim()) return
  loading.value = true; error.value = ''
  try { output.value = await api.value.command(command.value, method.value) }
  catch (e) { error.value = e instanceof Error ? e.message : '执行失败' }
  finally { loading.value = false }
}
async function createSession() { if (!api.value) return; const id = await api.value.createSession(); selected.value!.session = id.trim(); useSession.value = true; await refresh() }
async function chooseSession(id: string) { if (!selected.value) return; selected.value.session = id; useSession.value = true; await refresh() }
async function showDetail(id: string) { if (api.value) detail.value = JSON.stringify(await api.value.sessionDetail(id), null, 2) }
async function deleteSession(id: string) { if (api.value) { await api.value.deleteSession(id); if (selected.value?.session === id) selected.value.session = undefined; await refresh() } }
function toggleSession() { if (selected.value && !useSession.value) selected.value.session = undefined }
onMounted(() => { if (selected.value) refresh() })
</script>

<template>
  <main class="app-shell">
    <header><div><span class="eyebrow">REMOTE OPERATIONS</span><h1>SimpleWebShell <b>Desktop</b></h1><p>安全管理远程设备、会话与命令</p></div><button class="ghost" @click="refresh">{{ loading ? '连接中…' : '刷新状态' }}</button></header>
    <section class="layout">
      <aside class="panel sidebar"><div class="panel-title"><h2>设备</h2><span>{{ devices.length }}</span></div><div v-if="!devices.length" class="empty">还没有设备配置</div><button v-for="device in devices" :key="device.id" class="device" :class="{ active: selectedId === device.id }" @click="selectedId = device.id; refresh()"><i :class="{ online: device.online }"></i><div><strong>{{ device.name }}</strong><small>{{ device.url }}</small></div></button><div class="add-device"><input v-model="form.name" placeholder="设备名称" /><input v-model="form.url" placeholder="http://host:8878" /><input v-model="form.key" type="password" placeholder="访问密钥" /><button @click="save">+ 添加设备</button></div></aside>
      <section class="content"><div class="panel overview"><div><span class="eyebrow">ACTIVE DEVICE</span><h2>{{ selected?.name || '未选择设备' }}</h2><p>{{ selected?.url || '添加一个 SimpleWebShell 服务开始管理' }}</p></div><div class="status" :class="{ online: selected?.online }"><i></i>{{ selected?.online ? '在线' : '未连接' }}</div><button v-if="selected" class="danger" @click="remove">删除设备</button></div>
        <div class="grid"><section class="panel command-panel"><div class="panel-title"><h2>命令终端</h2><label><input v-model="useSession" type="checkbox" @change="toggleSession" /> 使用 Session</label></div><div class="path">当前目录：{{ selected?.path || '—' }}</div><div class="command-row"><select v-model="method"><option>GET</option><option>POST</option></select><input v-model="command" @keyup.enter="run" placeholder="输入远程命令，例如 uname -a" /><button class="primary" :disabled="loading || !api" @click="run">执行</button></div><pre class="terminal">{{ output || '命令输出将显示在这里…' }}</pre><p v-if="error" class="error">{{ error }}</p></section>
          <section class="panel session-panel"><div class="panel-title"><h2>会话</h2><button class="small" :disabled="!api" @click="createSession">新建</button></div><div v-if="!sessions.length" class="empty">暂无远程会话</div><div v-for="session in sessions" :key="session.id || session" class="session"><div @click="chooseSession(session.id || session)"><strong>{{ session.id || session }}</strong><small>{{ session.path || '点击启用' }}</small></div><button @click="showDetail(session.id || session)">详情</button><button @click="deleteSession(session.id || session)">×</button></div></section></div>
        <section v-if="detail" class="panel detail"><div class="panel-title"><h2>Session 详情</h2><button class="small" @click="detail = ''">关闭</button></div><pre>{{ detail }}</pre></section>
      </section>
    </section><footer>仅用于已授权的远程运维 · SimpleWebShell API · 默认请求超时 15 秒</footer>
  </main>
</template>
