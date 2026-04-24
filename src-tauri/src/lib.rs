use std::process::Command;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  // Disable macOS press-and-hold accent popup for this app
  // This enables key repeat behavior expected in code editors
  let bundle_id = "com.textplus.editor";
  let _ = Command::new("defaults")
    .args(["write", bundle_id, "ApplePressAndHoldEnabled", "-bool", "false"])
    .output();

  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
