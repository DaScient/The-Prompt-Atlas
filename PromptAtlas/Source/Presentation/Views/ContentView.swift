import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var chapterRepository: ChapterRepository
    @EnvironmentObject var appConfiguration: AppConfiguration
    
    @State private var selectedTab: Tab = .explore
    
    enum Tab: String, CaseIterable {
        case explore, experience, journal, settings
        
        var icon: String {
            switch self {
            case .explore: return "book.fill"
            case .experience: return "arkit"
            case .journal: return "pencil.and.list.clipboard"
            case .settings: return "gear"
            }
        }
        
        var title: String {
            rawValue.capitalized
        }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                // Subtle Metal background
                MetalBackgroundView()
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Dynamic header based on selected tab
                    headerView
                    
                    // Main content
                    contentView
                    
                    // Custom tab bar
                    tabBar
                }
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            initializeApp()
        }
    }
    
    private var headerView: some View {
        Group {
            switch selectedTab {
            case .explore:
                ExploreHeaderView()
            case .experience:
                ExperienceHeaderView()
            case .journal:
                JournalHeaderView()
            case .settings:
                SettingsHeaderView()
            }
        }
        .transition(.slide)
        .animation(.spring(response: 0.3), value: selectedTab)
    }
    
    private var contentView: some View {
        Group {
            switch selectedTab {
            case .explore:
                ChapterListView()
            case .experience:
                ExperienceHubView()
            case .journal:
                JournalHubView()
            case .settings:
                SettingsView()
            }
        }
        .transition(.opacity)
        .animation(.easeInOut(duration: 0.2), value: selectedTab)
    }
    
    private var tabBar: some View {
        HStack(spacing: 0) {
            ForEach(Tab.allCases, id: \.self) { tab in
                TabButton(tab: tab, isSelected: selectedTab == tab) {
                    selectedTab = tab
                }
            }
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 16)
        .background(.ultraThinMaterial)
    }
    
    private func initializeApp() {
        // Request audio permissions
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            // Initialize services
        }
    }
}

// MARK: - Tab Button
struct TabButton: View {
    let tab: ContentView.Tab
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: tab.icon)
                    .font(.system(size: 20, weight: isSelected ? .bold : .medium))
                
                Text(tab.title)
                    .font(.caption2)
                    .fontWeight(isSelected ? .bold : .regular)
            }
            .frame(maxWidth: .infinity)
            .foregroundColor(isSelected ? .accentColor : .secondary)
            .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Header Views
struct ExploreHeaderView: View {
    var body: some View {
        VStack(spacing: 8) {
            Text("Prompt Atlas")
                .font(.system(size: 32, weight: .bold, design: .serif))
                .foregroundColor(.primary)
            
            Text("Navigate Questions • Reflect Yourself")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.top, 16)
        .padding(.bottom, 24)
    }
}

struct ExperienceHeaderView: View {
    var body: some View {
        VStack(spacing: 8) {
            Text("Immersive Experience")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("Feel the prompts come alive")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 16)
    }
}

struct JournalHeaderView: View {
    var body: some View {
        VStack(spacing: 8) {
            Text("Your Journey")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("Track insights and growth")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 16)
    }
}

struct SettingsHeaderView: View {
    var body: some View {
        VStack(spacing: 8) {
            Text("Settings")
                .font(.title2)
                .fontWeight(.bold)
        }
        .padding(.vertical, 16)
    }
}

// MARK: - Metal Background
struct MetalBackgroundView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        // Subtle animated background (disabled in low power mode)
        if ProcessInfo.processInfo.isLowPowerModeEnabled {
            Color.clear
        } else {
            VisualThemeBackground(theme: appState.selectedChapter?.visualTheme ?? .wonder)
                .opacity(0.05)
        }
    }
}

struct VisualThemeBackground: View {
    let theme: VisualTheme
    
    var body: some View {
        // This would contain the Metal view for background animation
        // For now, returns a subtle gradient
        LinearGradient(
            colors: [theme.color.primary, theme.color.secondary],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

// MARK: - Theme Color Extension
extension VisualTheme {
    var color: (primary: Color, secondary: Color, accent: Color) {
        switch self {
        case .profits:
            return (.yellow, .orange, .yellow)
        case .ecology:
            return (.green, .mint, .green)
        case .mirror:
            return (.purple, .indigo, .purple)
        case .wonder:
            return (.blue, .cyan, .blue)
        default:
            return (.gray, .secondary, .gray)
        }
    }
}