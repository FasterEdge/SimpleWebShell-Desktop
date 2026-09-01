// ─────────────────────────────────────────────────────────────
// FasterEdge 开源项目
// Github: https://github.com/FasterEdge
// Gitee:  https://gitee.com/FasterEdge
// ─────────────────────────────────────────────────────────────
use tauri::Manager;

#[tauri::command]
fn app_info() -> serde_json::Value {
    serde_json::json!({ "name": "SimpleWebShell Desktop", "version": env!("CARGO_PKG_VERSION"), "api": "SimpleWebShell HTTP" })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![app_info])
        .setup(|app| { let _ = app.get_webview_window("main"); Ok(()) })
        .run(tauri::generate_context!())
        .expect("error while running SimpleWebShell Desktop");
}
