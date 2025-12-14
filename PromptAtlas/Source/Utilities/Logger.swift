import Foundation
import OSLog

class Logger {
    static let shared = Logger()
    private let logger = OSLog(subsystem: "com.promptatlas.app", category: "main")
    
    private init() {}
    
    func log(_ message: String, type: OSLogType = .info) {
        os_log("%{public}@", log: logger, type: type, message)
    }
    
    func error(_ message: String, error: Error? = nil) {
        if let error = error {
            os_log("%{public}@: %{public}@", log: logger, type: .error, message, error.localizedDescription)
        } else {
            os_log("%{public}@", log: logger, type: .error, message)
        }
    }
    
    func debug(_ message: String) {
        #if DEBUG
        os_log("%{public}@", log: logger, type: .debug, message)
        #endif
    }
}