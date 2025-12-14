import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appConfiguration: AppConfiguration
    @EnvironmentObject var hapticEngine: HapticEngine
    @StateObject private var settingsService = SettingsService()
    
    var body: some View {
        Form {
            // Experience Settings
            Section("Experience") {
                Toggle("Audio Reactive", isOn: $appConfiguration.audioReactiveEnabled)
                    .onChange(of: appConfiguration.audioReactiveEnabled) { _ in
                        appConfiguration.saveConfiguration()
                        hapticEngine.playIntensity(0.2)
                    }
                
                Toggle("Haptic Feedback", isOn: $appConfiguration.hapticFeedbackEnabled)
                    .onChange(of: appConfiguration.hapticFeedbackEnabled) { _ in
                        appConfiguration.saveConfiguration()
                        hapticEngine.playIntensity(0.3)
                    }
                
                Picker("Graphics Quality", selection: $appConfiguration.graphicsQuality) {
                    ForEach(AppConfiguration.GraphicsQuality.allCases, id: \.self) { quality in
                        Text(quality.rawValue.capitalized)
                            .tag(quality)
                    }
                }
                .onChange(of: appConfiguration.graphicsQuality) { _ in
                    appConfiguration.saveConfiguration()
                }
                
                Picker("Color Palette", selection: $appConfiguration.colorPalette) {
                    ForEach(AppConfiguration.ColorPalette.allCases, id: \.self) { palette in
                        Text(palette.rawValue.capitalized)
                            .tag(palette)
                    }
                }
                .onChange(of: appConfiguration.colorPalette) { _ in
                    appConfiguration.saveConfiguration()
                }
            }
            
            // Performance
            Section("Performance") {
                Picker("Frame Rate", selection: $appConfiguration.preferredFrameRate) {
                    Text("30 FPS").tag(30)
                    Text("60 FPS").tag(60)
                    Text("120 FPS").tag(120)
                }
                .onChange(of: appConfiguration.preferredFrameRate) { _ in
                    appConfiguration.saveConfiguration()
                }
                
                Toggle("Low Power Mode", isOn: .constant(false))
                    .disabled(true)
            }
            
            // Data & Privacy
            Section("Data & Privacy") {
                Button("Export Journal") {
                    exportJournal()
                }
                
                Button("Clear All Data") {
                    clearAllData()
                }
                .foregroundColor(.red)
                
                Toggle("Analytics", isOn: $settingsService.settings.analyticsEnabled)
                    .onChange(of: settingsService.settings.analyticsEnabled) { _ in
                        settingsService.saveSettings()
                    }
            }
            
            // About
            Section("About") {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0")
                        .foregroundColor(.secondary)
                }
                
                Button("Privacy Policy") {
                    // Open privacy policy
                }
                
                Button("Terms of Service") {
                    // Open terms
                }
                
                Button("Support") {
                    // Open support
                }
            }
        }
        .navigationTitle("Settings")
    }
    
    private func exportJournal() {
        // Export journal entries
        hapticEngine.playIntensity(0.3)
    }
    
    private func clearAllData() {
        // Show confirmation alert
        hapticEngine.playPattern(.breakthrough)
    }
}

// MARK: - Settings Components
struct SettingsToggle: View {
    let title: String
    let icon: String
    @Binding var isOn: Bool
    let action: () -> Void
    
    var body: some View {
        Toggle(isOn: $isOn) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(.accentColor)
                Text(title)
            }
        }
        .onChange(of: isOn) { _ in
            action()
        }
    }
}

struct SettingsPicker<T: Hashable & CaseIterable & RawRepresentable>: View where T.RawValue == String {
    let title: String
    let icon: String
    @Binding var selection: T
    let action: () -> Void
    
    var body: some View {
        Picker(selection: $selection) {
            ForEach(Array(T.allCases), id: \.self) { option in
                Text(option.rawValue.capitalized)
                    .tag(option)
            }
        } label: {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(.accentColor)
                Text(title)
            }
        }
        .onChange(of: selection) { _ in
            action()
        }
    }
}